// import 'package:bloc_test/bloc_test.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:orthodox/features/auth/domain/entities/auth_user.dart';
import 'package:orthodox/features/auth/domain/usecases/auth_usecases.dart';
import 'package:orthodox/features/auth/presentation/bloc/auth_bloc.dart';

class MockSendOtpUseCase extends Mock implements SendOtpUseCase {}

class MockVerifyOtpUseCase extends Mock implements VerifyOtpUseCase {}

class MockGetStoredSessionUseCase extends Mock
    implements GetStoredSessionUseCase {}

class MockLogoutUseCase extends Mock implements LogoutUseCase {}

const _testUser = AuthUser(
  id: 'user-1',
  name: 'Test User',
  phone: '+201001234567',
  role: UserRole.servant,
  accessToken: 'test.jwt.token',
);

void main() {
  late AuthBloc bloc;
  late MockSendOtpUseCase sendOtp;
  late MockVerifyOtpUseCase verifyOtp;
  late MockGetStoredSessionUseCase getSession;
  late MockLogoutUseCase logout;

  setUp(() {
    sendOtp = MockSendOtpUseCase();
    verifyOtp = MockVerifyOtpUseCase();
    getSession = MockGetStoredSessionUseCase();
    logout = MockLogoutUseCase();

    bloc = AuthBloc(sendOtp, verifyOtp, getSession, logout);
  });

  tearDown(() => bloc.close());

  // group('AuthCheckRequested', () {
  //   blocTest<AuthBloc, AuthState>(
  //     'emits [Loading, Authenticated] when session exists',
  //     build: () {
  //       when(() => getSession()).thenAnswer((_) async => _testUser);
  //       return bloc;
  //     },
  //     act: (b) => b.add(AuthCheckRequested()),
  //     expect: () => [isA<AuthLoading>(), isA<AuthAuthenticated>()],
  //   );
  //
  //   blocTest<AuthBloc, AuthState>(
  //     'emits [Loading, Unauthenticated] when no session',
  //     build: () {
  //       when(() => getSession()).thenAnswer((_) async => null);
  //       return bloc;
  //     },
  //     act: (b) => b.add(AuthCheckRequested()),
  //     expect: () => [isA<AuthLoading>(), isA<AuthUnauthenticated>()],
  //   );
  // });
  //
  // group('AuthOtpSendRequested', () {
  //   blocTest<AuthBloc, AuthState>(
  //     'emits [Loading, OtpSent] on success',
  //     build: () {
  //       when(() => sendOtp(any())).thenAnswer((_) async => const Right(null));
  //       return bloc;
  //     },
  //     act: (b) => b.add(const AuthOtpSendRequested('+201001234567')),
  //     expect: () => [isA<AuthLoading>(), isA<AuthOtpSent>()],
  //   );
  //
  //   blocTest<AuthBloc, AuthState>(
  //     'emits [Loading, Error] on failure',
  //     build: () {
  //       when(() => sendOtp(any()))
  //           .thenAnswer((_) async => const Left('Phone not found'));
  //       return bloc;
  //     },
  //     act: (b) => b.add(const AuthOtpSendRequested('+201001234567')),
  //     expect: () => [isA<AuthLoading>(), isA<AuthError>()],
  //   );
  // });
  //
  // group('AuthOtpVerifyRequested', () {
  //   blocTest<AuthBloc, AuthState>(
  //     'emits [Loading, Authenticated] on valid OTP',
  //     build: () {
  //       when(() =>
  //               verifyOtp(phone: any(named: 'phone'), code: any(named: 'code')))
  //           .thenAnswer((_) async => const Right(_testUser));
  //       return bloc;
  //     },
  //     act: (b) => b.add(
  //       const AuthOtpVerifyRequested(phone: '+201001234567', code: '123456'),
  //     ),
  //     expect: () => [isA<AuthLoading>(), isA<AuthAuthenticated>()],
  //   );
  //
  //   blocTest<AuthBloc, AuthState>(
  //     'emits [Loading, Error] on invalid OTP',
  //     build: () {
  //       when(() =>
  //               verifyOtp(phone: any(named: 'phone'), code: any(named: 'code')))
  //           .thenAnswer((_) async => const Left('Invalid or expired OTP code'));
  //       return bloc;
  //     },
  //     act: (b) => b.add(
  //       const AuthOtpVerifyRequested(phone: '+201001234567', code: '000000'),
  //     ),
  //     expect: () => [isA<AuthLoading>(), isA<AuthError>()],
  //   );
  // });
  //
  // group('AuthLogoutRequested', () {
  //   blocTest<AuthBloc, AuthState>(
  //     'emits [Unauthenticated] after logout',
  //     build: () {
  //       when(() => logout()).thenAnswer((_) async {});
  //       return bloc;
  //     },
  //     act: (b) => b.add(AuthLogoutRequested()),
  //     expect: () => [isA<AuthUnauthenticated>()],
  //   );
  // });
}
