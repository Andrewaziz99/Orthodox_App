import 'package:dartz/dartz.dart';

import '../entities/auth_user.dart';

abstract class AuthRepository {
  /// Send OTP to the given phone number
  Future<Either<String, void>> sendOtp(String phone);

  /// Verify OTP and return authenticated user on success
  Future<Either<String, AuthUser>> verifyOtp({
    required String phone,
    required String code,
  });

  /// Load persisted session from local storage
  Future<AuthUser?> getStoredSession();

  /// Clear session from local storage
  Future<void> clearSession();
}
