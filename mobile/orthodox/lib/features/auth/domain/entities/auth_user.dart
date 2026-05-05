import 'package:equatable/equatable.dart';

enum UserRole { superAdmin, churchAdmin, servant, child }

UserRole roleFromString(String role) {
  switch (role) {
    case 'super_admin':
      return UserRole.superAdmin;
    case 'church_admin':
      return UserRole.churchAdmin;
    case 'servant':
      return UserRole.servant;
    case 'child':
      return UserRole.child;
    default:
      return UserRole.child;
  }
}

class AuthUser extends Equatable {
  final String id;
  final String name;
  final String? phone;
  final String? email;
  final UserRole role;
  final String? churchId;
  final String accessToken;

  const AuthUser({
    required this.id,
    required this.name,
    this.phone,
    this.email,
    required this.role,
    this.churchId,
    required this.accessToken,
  });

  bool get isSuperAdmin => role == UserRole.superAdmin;
  bool get isChurchAdmin => role == UserRole.churchAdmin;
  bool get isServant => role == UserRole.servant;
  bool get isChild => role == UserRole.child;
  bool get isAdmin => isSuperAdmin || isChurchAdmin;

  @override
  List<Object?> get props => [id, role, accessToken];
}
