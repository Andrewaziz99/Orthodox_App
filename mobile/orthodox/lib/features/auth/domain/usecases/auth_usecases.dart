import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../entities/auth_user.dart';
import '../repositories/auth_repository.dart';

@injectable
class SendOtpUseCase {
  final AuthRepository _repository;
  SendOtpUseCase(this._repository);

  Future<Either<String, void>> call(String phone) =>
      _repository.sendOtp(phone);
}

@injectable
class VerifyOtpUseCase {
  final AuthRepository _repository;
  VerifyOtpUseCase(this._repository);

  Future<Either<String, AuthUser>> call({
    required String phone,
    required String code,
  }) =>
      _repository.verifyOtp(phone: phone, code: code);
}

@injectable
class GetStoredSessionUseCase {
  final AuthRepository _repository;
  GetStoredSessionUseCase(this._repository);

  Future<AuthUser?> call() => _repository.getStoredSession();
}

@injectable
class LogoutUseCase {
  final AuthRepository _repository;
  LogoutUseCase(this._repository);

  Future<void> call() => _repository.clearSession();
}
