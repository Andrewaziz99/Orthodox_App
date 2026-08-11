import 'package:dartz/dartz.dart';

import '../entities/auth_user.dart';

abstract class AuthRepository {
  Future<Either<String, AuthUser>> login({
    required String identifier,
    required String password,
  });

  Future<Either<String, AuthUser?>> getStoredSession();

  Future<Either<String, Unit>> logout();
}
