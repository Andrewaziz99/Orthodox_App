import '../../domain/entities/auth_user.dart';

class AuthUserModel extends AuthUser {
  const AuthUserModel({
    required super.id,
    required super.name,
    super.phone,
    super.email,
    required super.role,
    super.churchId,
    required super.accessToken,
  });

  factory AuthUserModel.fromJson(Map<String, dynamic> json, String token) {
    return AuthUserModel(
      id: json['id'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String?,
      email: json['email'] as String?,
      role: roleFromString(json['role'] as String),
      churchId: json['churchId'] as String?,
      accessToken: token,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'phone': phone,
        'email': email,
        'role': role.name,
        'churchId': churchId,
        'accessToken': accessToken,
      };

  /// Reconstruct from Hive storage
  factory AuthUserModel.fromStorage(Map<dynamic, dynamic> map) {
    return AuthUserModel(
      id: map['id'] as String,
      name: map['name'] as String,
      phone: map['phone'] as String?,
      email: map['email'] as String?,
      role: roleFromString(map['role'] as String),
      churchId: map['churchId'] as String?,
      accessToken: map['accessToken'] as String,
    );
  }
}
