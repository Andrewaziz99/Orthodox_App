import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/api_client.dart';
import '../models/auth_user_model.dart';

abstract class AuthRemoteDataSource {
  Future<AuthUserModel> login({
    required String identifier,
    required String password,
  });
  Future<Map<String, dynamic>> getCurrentUser();
  Future<void> logout();
}

@Injectable(as: AuthRemoteDataSource)
class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient _apiClient;
  AuthRemoteDataSourceImpl(this._apiClient);

  @override
  Future<AuthUserModel> login({
    required String identifier,
    required String password,
  }) async {
    final response = await _apiClient.dio.post<Map<String, dynamic>>(
      '/auth/login',
      data: {'identifier': identifier, 'password': password},
    );
    return AuthUserModel.fromLoginResponse(response.data!);
  }

  @override
  Future<Map<String, dynamic>> getCurrentUser() async {
    final response = await _apiClient.dio.get<Map<String, dynamic>>('/auth/me');
    return response.data!;
  }

  @override
  Future<void> logout() async {
    await _apiClient.dio.post<void>('/auth/logout');
  }
}
