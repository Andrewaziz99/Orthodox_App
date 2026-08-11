import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

import '../../features/auth/data/datasources/auth_local_datasource.dart';
import '../../features/auth/data/models/auth_tokens_model.dart';
import 'auth_session_events.dart';

const String _baseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://10.0.2.2:3000/api/v1',
);

@singleton
class ApiClient {
  final AuthLocalDataSource _localDataSource;
  final AuthSessionEvents _sessionEvents;
  late final Dio dio;

  ApiClient(this._localDataSource, this._sessionEvents) {
    dio = Dio(
      BaseOptions(
        baseUrl: _baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 15),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    dio.interceptors.add(
      _AuthInterceptor(dio, _localDataSource, _sessionEvents),
    );
  }
}

class _AuthInterceptor extends Interceptor {
  static const _retriedKey = 'auth_retried';
  static const _sessionIdKey = 'auth_session_id';
  static const _accessTokenKey = 'auth_access_token';

  final Dio _dio;
  final AuthLocalDataSource _localDataSource;
  final AuthSessionEvents _sessionEvents;
  Future<AuthTokensModel>? _refreshFuture;
  String? _refreshSessionId;

  _AuthInterceptor(this._dio, this._localDataSource, this._sessionEvents);

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    if (_isPublicAuthRequest(options)) {
      handler.next(options);
      return;
    }

    final tokens = await _localDataSource.getTokens();
    if (tokens != null) {
      options.headers['Authorization'] = 'Bearer ${tokens.accessToken}';
      options.extra[_sessionIdKey] = _sessionId(tokens.accessToken);
      options.extra[_accessTokenKey] = tokens.accessToken;
    }

    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final request = err.requestOptions;
    final requestSessionId = request.extra[_sessionIdKey] as String?;
    if (err.response?.statusCode != 401 ||
        request.path == '/auth/login' ||
        request.path == '/auth/refresh' ||
        request.extra[_retriedKey] == true) {
      if (err.response?.statusCode == 401 && request.path != '/auth/login') {
        await _expireSession(requestSessionId);
      }
      handler.next(err);
      return;
    }

    final tokens = await _localDataSource.getTokens();
    if (tokens == null) {
      await _expireSession(requestSessionId);
      handler.next(err);
      return;
    }

    final currentSessionId = _sessionId(tokens.accessToken);
    if (requestSessionId != currentSessionId) {
      handler.next(err);
      return;
    }

    if (request.extra[_accessTokenKey] != tokens.accessToken) {
      await _retry(request, tokens.accessToken, handler);
      return;
    }

    try {
      final refreshed = await _refreshTokens(tokens.refreshToken, currentSessionId);
      await _retry(request, refreshed.accessToken, handler);
    } on DioException catch (refreshError) {
      if (refreshError.response?.statusCode == 401) {
        await _expireSession(currentSessionId, tokens.refreshToken);
      }
      handler.next(refreshError);
    } on _SessionChangedException {
      handler.next(err);
    } on FormatException {
      handler.next(err);
    } on TypeError {
      handler.next(err);
    }
  }

  Future<AuthTokensModel> _refreshTokens(
    String refreshToken,
    String? sessionId,
  ) async {
    final activeRefresh = _refreshFuture;
    if (activeRefresh != null && _refreshSessionId == sessionId) {
      return activeRefresh;
    }

    final refresh = _requestRefresh(refreshToken, sessionId);
    _refreshFuture = refresh;
    _refreshSessionId = sessionId;
    try {
      return await refresh;
    } finally {
      if (identical(_refreshFuture, refresh)) {
        _refreshFuture = null;
        _refreshSessionId = null;
      }
    }
  }

  Future<AuthTokensModel> _requestRefresh(
    String refreshToken,
    String? sessionId,
  ) async {
    final response = await Dio(_dio.options).post<Map<String, dynamic>>(
      '/auth/refresh',
      data: {'refreshToken': refreshToken},
    );
    final refreshed = AuthTokensModel.fromJson(response.data!);
    final current = await _localDataSource.getTokens();
    if (current == null || _sessionId(current.accessToken) != sessionId) {
      throw const _SessionChangedException();
    }
    if (current.refreshToken != refreshToken) return current;
    await _localDataSource.saveTokens(refreshed);
    return refreshed;
  }

  Future<void> _retry(
    RequestOptions request,
    String accessToken,
    ErrorInterceptorHandler handler,
  ) async {
    request.headers['Authorization'] = 'Bearer $accessToken';
    request.extra[_retriedKey] = true;
    handler.resolve(await _dio.fetch<dynamic>(request));
  }

  bool _isPublicAuthRequest(RequestOptions options) =>
      options.path == '/auth/login' || options.path == '/auth/refresh';

  Future<void> _expireSession(
    String? sessionId, [
    String? expectedRefreshToken,
  ]) async {
    final current = await _localDataSource.getTokens();
    if (current == null || _sessionId(current.accessToken) != sessionId) return;
    if (expectedRefreshToken != null && current.refreshToken != expectedRefreshToken) return;
    try {
      await _localDataSource.clearSession();
    } finally {
      _sessionEvents.notifyExpired();
    }
  }

  String? _sessionId(String accessToken) {
    try {
      final parts = accessToken.split('.');
      if (parts.length != 3) return accessToken;
      final payload = jsonDecode(
        utf8.decode(base64Url.decode(base64Url.normalize(parts[1]))),
      );
      return payload is Map && payload['jti'] is String
          ? payload['jti'] as String
          : accessToken;
    } on FormatException {
      return accessToken;
    }
  }
}

class _SessionChangedException implements Exception {
  const _SessionChangedException();
}
