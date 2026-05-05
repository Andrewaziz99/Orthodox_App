import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

import '../../domain/entities/auth_user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_datasource.dart';
import '../datasources/auth_remote_datasource.dart';

@Injectable(as: AuthRepository)
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remote;
  final AuthLocalDataSource _local;

  AuthRepositoryImpl(this._remote, this._local);

  @override
  Future<Either<String, void>> sendOtp(String phone) async {
    try {
      await _remote.sendOtp(phone);
      return const Right(null);
    } on DioException catch (e) {
      return Left(_mapDioError(e));
    } catch (e) {
      return Left(e.toString());
    }
  }

  @override
  Future<Either<String, AuthUser>> verifyOtp({
    required String phone,
    required String code,
  }) async {
    try {
      final user = await _remote.verifyOtp(phone: phone, code: code);
      await _local.cacheUser(user);
      return Right(user);
    } on DioException catch (e) {
      return Left(_mapDioError(e));
    } catch (e) {
      return Left(e.toString());
    }
  }

  @override
  Future<AuthUser?> getStoredSession() async {
    return _local.getCachedUser();
  }

  @override
  Future<void> clearSession() async {
    await _local.clearUser();
  }

  String _mapDioError(DioException e) {
    switch (e.response?.statusCode) {
      case 400:
        return e.response?.data?['message'] ?? 'Invalid request';
      case 401:
        return 'Invalid or expired OTP code';
      case 404:
        return 'Phone number not found. Contact your administrator.';
      case 500:
        return 'Server error. Please try again.';
      default:
        return e.message ?? 'Network error. Check your connection.';
    }
  }
}
