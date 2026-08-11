import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:flutter/services.dart';
import 'package:hive/hive.dart';
import 'package:injectable/injectable.dart';

import '../../domain/entities/auth_user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_datasource.dart';
import '../datasources/auth_remote_datasource.dart';
import '../models/auth_user_model.dart';

@Injectable(as: AuthRepository)
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remote;
  final AuthLocalDataSource _local;

  AuthRepositoryImpl(this._remote, this._local);

  @override
  Future<Either<String, AuthUser>> login({
    required String identifier,
    required String password,
  }) async {
    try {
      final user = await _remote.login(
        identifier: identifier,
        password: password,
      );
      await _local.cacheSession(user);
      return Right(user);
    } on DioException catch (e) {
      return Left(_mapDioError(e));
    } on FormatException {
      return const Left('The server returned an unexpected response.');
    } on TypeError {
      return const Left('The server returned an unexpected response.');
    } on PlatformException {
      return const Left('Unable to store the secure session on this device.');
    } on HiveError {
      return const Left('Unable to store the session on this device.');
    }
  }

  @override
  Future<Either<String, AuthUser?>> getStoredSession() async {
    try {
      final cachedUser = await _local.getCachedSession();
      if (cachedUser == null) return const Right(null);

      final session = await _remote.getCurrentUser();
      final tokens = await _local.getTokens();
      if (tokens == null) {
        await _local.clearSession();
        return const Right(null);
      }
      final currentUser = AuthUserModel.fromSessionResponse(session, tokens);
      await _local.cacheSession(currentUser);
      return Right(currentUser);
    } on DioException catch (error) {
      if (error.response?.statusCode == 401) {
        await _local.clearSession();
        return const Right(null);
      }
      return Left(_mapDioError(error));
    } on FormatException {
      await _local.clearSession();
      return const Right(null);
    } on TypeError {
      await _local.clearSession();
      return const Right(null);
    } on PlatformException {
      return const Left('Unable to read the secure session on this device.');
    } on HiveError {
      return const Left('Unable to read the session cache on this device.');
    }
  }

  @override
  Future<Either<String, Unit>> logout() async {
    try {
      await _remote.logout();
    } on DioException {
      // Local logout must still complete if the server is unreachable.
    }

    try {
      await _local.clearSession();
      return const Right(unit);
    } on PlatformException {
      return const Left('Unable to remove the secure session from this device.');
    } on HiveError {
      return const Left('Unable to clear the session cache on this device.');
    }
  }

  String _mapDioError(DioException e) {
    switch (e.response?.statusCode) {
      case 400:
        return _responseMessage(e) ?? 'Invalid request.';
      case 401:
        return 'Invalid identifier or password.';
      case 404:
        return 'Account not found. Contact your church administrator.';
      case 500:
        return 'Server error. Please try again.';
      default:
        return 'Unable to connect. Check your connection and try again.';
    }
  }

  String? _responseMessage(DioException exception) {
    final data = exception.response?.data;
    return data is Map && data['message'] is String
        ? data['message'] as String
        : null;
  }
}
