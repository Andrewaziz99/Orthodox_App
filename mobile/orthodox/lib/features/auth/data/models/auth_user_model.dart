import '../../domain/entities/auth_user.dart';
import 'auth_tokens_model.dart';

class AuthUserModel extends AuthUser {
  const AuthUserModel({
    required super.id,
    super.fullName,
    required super.role,
    super.churchId,
    super.classId,
    required super.accessToken,
    required super.refreshToken,
  });

  factory AuthUserModel.fromLoginResponse(Map<String, dynamic> json) {
    final user = json['user'];
    if (user is! Map) {
      throw const FormatException('Graphy login response is missing user');
    }

    return AuthUserModel(
      id: user['id'] as String,
      fullName: user['fullName'] as String?,
      role: userRoleFromWire(user['type'] as String),
      churchId: user['churchId'] as String?,
      classId: user['classId'] as String?,
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
    );
  }

  factory AuthUserModel.fromSessionResponse(
    Map<String, dynamic> user,
    AuthTokensModel tokens,
  ) {
    return AuthUserModel(
      id: user['id'] as String,
      fullName: user['fullName'] as String?,
      role: userRoleFromWire(user['type'] as String),
      churchId: user['churchId'] as String?,
      classId: user['classId'] as String?,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    );
  }

  Map<String, dynamic> toUserProjection() => {
        'id': id,
        'fullName': fullName,
        'type': userRoleToWire(role),
        'churchId': churchId,
        'classId': classId,
      };

  factory AuthUserModel.fromStorage(
    Map<dynamic, dynamic> map, {
    required String accessToken,
    required String refreshToken,
  }) {
    return AuthUserModel(
      id: map['id'] as String,
      fullName: map['fullName'] as String?,
      role: userRoleFromWire(map['type'] as String),
      churchId: map['churchId'] as String?,
      classId: map['classId'] as String?,
      accessToken: accessToken,
      refreshToken: refreshToken,
    );
  }
}
