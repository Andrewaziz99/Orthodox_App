import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../entities/auth_user.dart';
import '../repositories/auth_repository.dart';

@injectable
class LoginUseCase {
  final AuthRepository _repository;
  LoginUseCase(this._repository);

  Future<Either<String, AuthUser>> call({
    required String identifier,
    required String password,
  }) =>
      _repository.login(identifier: identifier, password: password);
}

@injectable
class GetStoredSessionUseCase {
  final AuthRepository _repository;
  GetStoredSessionUseCase(this._repository);

  Future<Either<String, AuthUser?>> call() => _repository.getStoredSession();
}

@injectable
class LogoutUseCase {
  final AuthRepository _repository;
  LogoutUseCase(this._repository);

  Future<Either<String, Unit>> call() => _repository.logout();
}
