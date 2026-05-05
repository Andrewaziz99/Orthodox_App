import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/api_client.dart';
import '../models/auth_user_model.dart';

abstract class AuthRemoteDataSource {
  Future<void> sendOtp(String phone);
  Future<AuthUserModel> verifyOtp({required String phone, required String code});
}

@Injectable(as: AuthRemoteDataSource)
class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient _apiClient;
  AuthRemoteDataSourceImpl(this._apiClient);

  @override
  Future<void> sendOtp(String phone) async {
    await _apiClient.dio.post(
      '/auth/otp/send',
      data: {'phone': phone},
    );
  }

  @override
  Future<AuthUserModel> verifyOtp({
    required String phone,
    required String code,
  }) async {
    final response = await _apiClient.dio.post(
      '/auth/otp/verify',
      data: {'phone': phone, 'code': code},
    );

    final token = response.data['access_token'] as String;
    final user = response.data['user'] as Map<String, dynamic>? ??
        _decodeUserFromToken(token);

    return AuthUserModel.fromJson(user, token);
  }

  /// Fallback: decode user payload from JWT if backend omits user in response
  Map<String, dynamic> _decodeUserFromToken(String token) {
    final parts = token.split('.');
    if (parts.length != 3) throw Exception('Invalid JWT');

    final payload = String.fromCharCodes(
      _base64Decode(parts[1]),
    );

    // Basic JSON-like parsing — in production use dart:convert
    return <String, dynamic>{
      'id': _extract(payload, 'sub') ?? _extract(payload, 'id') ?? '',
      'name': _extract(payload, 'name') ?? 'User',
      'role': _extract(payload, 'role') ?? 'child',
      'phone': _extract(payload, 'phone'),
      'email': _extract(payload, 'email'),
      'churchId': _extract(payload, 'churchId'),
    };
  }

  List<int> _base64Decode(String input) {
    final normalized = input.replaceAll('-', '+').replaceAll('_', '/');
    final padded = normalized.padRight(
      (normalized.length + 3) & ~3,
      '=',
    );
    return Uri.parse('data:;base64,$padded').data!.contentAsBytes();
  }

  String? _extract(String json, String key) {
    final regex = RegExp('"$key":"([^"]*)"');
    return regex.firstMatch(json)?.group(1);
  }
}
