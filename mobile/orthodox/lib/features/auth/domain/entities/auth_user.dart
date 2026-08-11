import 'package:equatable/equatable.dart';

enum UserRole { superAdmin, churchAdmin, servant, child }

UserRole userRoleFromWire(String value) {
  switch (value) {
    case 'super_admin':
      return UserRole.superAdmin;
    case 'church_admin':
      return UserRole.churchAdmin;
    case 'servant':
      return UserRole.servant;
    case 'child':
      return UserRole.child;
    default:
      throw FormatException('Unknown Graphy user type: $value');
  }
}

String userRoleToWire(UserRole role) {
  switch (role) {
    case UserRole.superAdmin:
      return 'super_admin';
    case UserRole.churchAdmin:
      return 'church_admin';
    case UserRole.servant:
      return 'servant';
    case UserRole.child:
      return 'child';
  }
}

class AuthUser extends Equatable {
  final String id;
  final String? fullName;
  final UserRole role;
  final String? churchId;
  final String? classId;
  final String accessToken;
  final String refreshToken;

  const AuthUser({
    required this.id,
    this.fullName,
    required this.role,
    this.churchId,
    this.classId,
    required this.accessToken,
    required this.refreshToken,
  });

  bool get isSuperAdmin => role == UserRole.superAdmin;
  bool get isChurchAdmin => role == UserRole.churchAdmin;
  bool get isServant => role == UserRole.servant;
  bool get isChild => role == UserRole.child;
  bool get isAdmin => isSuperAdmin || isChurchAdmin;

  @override
  List<Object?> get props => [
        id,
        fullName,
        role,
        churchId,
        classId,
      ];
}
