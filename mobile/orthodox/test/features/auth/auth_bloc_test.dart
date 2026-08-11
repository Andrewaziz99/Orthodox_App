import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:orthodox/core/network/auth_session_events.dart';
import 'package:orthodox/features/auth/data/models/auth_user_model.dart';
import 'package:orthodox/features/auth/domain/entities/auth_user.dart';
import 'package:orthodox/features/auth/domain/repositories/auth_repository.dart';
import 'package:orthodox/features/auth/domain/usecases/auth_usecases.dart';
import 'package:orthodox/features/auth/presentation/bloc/auth_bloc.dart';

const _testUser = AuthUser(
  id: 'user-1',
  fullName: 'Test User',
  role: UserRole.servant,
  churchId: 'church-1',
  classId: 'class-1',
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
);

class _FakeAuthRepository implements AuthRepository {
  Either<String, AuthUser> loginResult = const Right(_testUser);
  Either<String, AuthUser?> storedSessionResult = const Right(null);
  String? loginIdentifier;
  String? loginPassword;

  @override
  Future<Either<String, AuthUser?>> getStoredSession() async => storedSessionResult;

  @override
  Future<Either<String, AuthUser>> login({
    required String identifier,
    required String password,
  }) async {
    loginIdentifier = identifier;
    loginPassword = password;
    return loginResult;
  }

  @override
  Future<Either<String, Unit>> logout() async => const Right(unit);
}

AuthBloc _createBloc(
  _FakeAuthRepository repository,
  AuthSessionEvents sessionEvents,
) {
  return AuthBloc(
    LoginUseCase(repository),
    GetStoredSessionUseCase(repository),
    LogoutUseCase(repository),
    sessionEvents,
  );
}

void main() {
  test('valid Graphy login authenticates the user', () async {
    final repository = _FakeAuthRepository();
    final bloc = _createBloc(repository, AuthSessionEvents());
    addTearDown(bloc.close);

    final states = expectLater(
      bloc.stream,
      emitsInOrder([isA<AuthLoading>(), isA<AuthAuthenticated>()]),
    );

    bloc.add(
      const AuthLoginRequested(
        identifier: 'servant@example.com',
        password: 'secret',
      ),
    );

    await states;
    expect((bloc.state as AuthAuthenticated).user, _testUser);
    expect(repository.loginIdentifier, 'servant@example.com');
    expect(repository.loginPassword, 'secret');
  });

  test('session expiry immediately unauthenticates the user', () async {
    final repository = _FakeAuthRepository()
      ..storedSessionResult = const Right(_testUser);
    final sessionEvents = AuthSessionEvents();
    final bloc = _createBloc(repository, sessionEvents);
    addTearDown(bloc.close);

    final restoredStates = expectLater(
      bloc.stream,
      emitsInOrder([isA<AuthLoading>(), isA<AuthAuthenticated>()]),
    );
    bloc.add(AuthCheckRequested());
    await restoredStates;

    final expiredState =
        expectLater(bloc.stream, emits(isA<AuthUnauthenticated>()));
    sessionEvents.notifyExpired();
    await expiredState;
  });

  test('temporary startup failure is not treated as logged out', () async {
    final repository = _FakeAuthRepository()
      ..storedSessionResult = const Left('Unable to connect.');
    final bloc = _createBloc(repository, AuthSessionEvents());
    addTearDown(bloc.close);

    final states = expectLater(
      bloc.stream,
      emitsInOrder([isA<AuthLoading>(), isA<AuthError>()]),
    );

    bloc.add(AuthCheckRequested());

    await states;
    expect((bloc.state as AuthError).message, 'Unable to connect.');
  });

  test('Graphy response and Hive projection use explicit wire names', () {
    final model = AuthUserModel.fromLoginResponse({
      'accessToken': 'access-token',
      'refreshToken': 'refresh-token',
      'user': {
        'id': 'admin-1',
        'type': 'church_admin',
        'churchId': 'church-1',
        'fullName': 'Church Admin',
        'classId': null,
      },
    });

    expect(model.role, UserRole.churchAdmin);
    expect(model.classId, isNull);
    expect(model.refreshToken, 'refresh-token');
    expect(model.toUserProjection(), {
      'id': 'admin-1',
      'fullName': 'Church Admin',
      'type': 'church_admin',
      'churchId': 'church-1',
      'classId': null,
    });
    expect(model.toUserProjection().containsKey('accessToken'), isFalse);
    expect(model.toUserProjection().containsKey('refreshToken'), isFalse);

    final restored = AuthUserModel.fromStorage(
      model.toUserProjection(),
      accessToken: model.accessToken,
      refreshToken: model.refreshToken,
    );
    expect(restored.role, UserRole.churchAdmin);
    expect(restored.refreshToken, 'refresh-token');
  });

  test('unknown Graphy user type is rejected', () {
    expect(
      () => userRoleFromWire('unknown'),
      throwsA(isA<FormatException>()),
    );
  });
}
