import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/services.dart';
import 'package:hive/hive.dart';
import 'package:injectable/injectable.dart';

import '../models/auth_tokens_model.dart';
import '../models/auth_user_model.dart';

abstract class AuthLocalDataSource {
  Future<void> cacheSession(AuthUserModel user);
  Future<AuthUserModel?> getCachedSession();
  Future<AuthTokensModel?> getTokens();
  Future<void> saveTokens(AuthTokensModel tokens);
  Future<void> clearSession();
}

@Singleton(as: AuthLocalDataSource)
class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  static const _tokensKey = 'graphy_tokens';

  final FlutterSecureStorage _secureStorage;

  AuthLocalDataSourceImpl()
      : _secureStorage = const FlutterSecureStorage();

  Box get _box => Hive.box('auth');

  @override
  Future<void> cacheSession(AuthUserModel user) async {
    await _removeLegacyTokens();
    await _box.put('user', user.toUserProjection());
    try {
      await saveTokens(
        AuthTokensModel(
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        ),
      );
    } on PlatformException {
      await _box.delete('user');
      rethrow;
    }
  }

  @override
  Future<AuthUserModel?> getCachedSession() async {
    await _removeLegacyTokens();
    final data = _box.get('user');
    if (data == null) {
      await _secureStorage.delete(key: _tokensKey);
      return null;
    }

    final tokens = await getTokens();
    if (tokens == null) {
      await clearSession();
      return null;
    }

    try {
      return AuthUserModel.fromStorage(
        data as Map,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      );
    } on FormatException {
      await clearSession();
      return null;
    } on TypeError {
      await clearSession();
      return null;
    }
  }

  @override
  Future<AuthTokensModel?> getTokens() async {
    final serializedTokens = await _secureStorage.read(key: _tokensKey);
    if (serializedTokens == null) return null;
    final decoded = jsonDecode(serializedTokens);
    if (decoded is! Map<String, dynamic>) {
      throw const FormatException('Stored token pair is invalid');
    }
    return AuthTokensModel.fromJson(decoded);
  }

  @override
  Future<void> saveTokens(AuthTokensModel tokens) async {
    await _secureStorage.write(
      key: _tokensKey,
      value: jsonEncode(tokens.toJson()),
    );
  }

  @override
  Future<void> clearSession() async {
    await _secureStorage.delete(key: _tokensKey);
    await _box.delete('user');
    await _removeLegacyTokens();
  }

  Future<void> _removeLegacyTokens() async {
    await _box.deleteAll(['access_token', 'refresh_token']);
  }
}
