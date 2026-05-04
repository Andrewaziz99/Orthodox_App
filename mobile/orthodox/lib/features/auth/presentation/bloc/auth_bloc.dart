import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../domain/entities/auth_user.dart';
import '../../domain/usecases/auth_usecases.dart';

// ── Events ──────────────────────────────────────────────────────────────────

abstract class AuthEvent extends Equatable {
  const AuthEvent();
  @override
  List<Object?> get props => [];
}

/// Check if a session exists in local storage on app start
class AuthCheckRequested extends AuthEvent {}

/// User submitted their phone number
class AuthOtpSendRequested extends AuthEvent {
  final String phone;
  const AuthOtpSendRequested(this.phone);
  @override
  List<Object?> get props => [phone];
}

/// User submitted the OTP code
class AuthOtpVerifyRequested extends AuthEvent {
  final String phone;
  final String code;
  const AuthOtpVerifyRequested({required this.phone, required this.code});
  @override
  List<Object?> get props => [phone, code];
}

/// User tapped logout
class AuthLogoutRequested extends AuthEvent {}

// ── States ──────────────────────────────────────────────────────────────────

abstract class AuthState extends Equatable {
  const AuthState();
  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthOtpSent extends AuthState {
  final String phone;
  const AuthOtpSent(this.phone);
  @override
  List<Object?> get props => [phone];
}

class AuthAuthenticated extends AuthState {
  final AuthUser user;
  const AuthAuthenticated(this.user);
  @override
  List<Object?> get props => [user];
}

class AuthUnauthenticated extends AuthState {}

class AuthError extends AuthState {
  final String message;
  const AuthError(this.message);
  @override
  List<Object?> get props => [message];
}

// ── BLoC ────────────────────────────────────────────────────────────────────

@injectable
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final SendOtpUseCase _sendOtp;
  final VerifyOtpUseCase _verifyOtp;
  final GetStoredSessionUseCase _getSession;
  final LogoutUseCase _logout;

  AuthBloc(
    this._sendOtp,
    this._verifyOtp,
    this._getSession,
    this._logout,
  ) : super(AuthInitial()) {
    on<AuthCheckRequested>(_onCheckRequested);
    on<AuthOtpSendRequested>(_onOtpSendRequested);
    on<AuthOtpVerifyRequested>(_onOtpVerifyRequested);
    on<AuthLogoutRequested>(_onLogoutRequested);
  }

  Future<void> _onCheckRequested(
    AuthCheckRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    final user = await _getSession();
    if (user != null) {
      emit(AuthAuthenticated(user));
    } else {
      emit(AuthUnauthenticated());
    }
  }

  Future<void> _onOtpSendRequested(
    AuthOtpSendRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    final result = await _sendOtp(event.phone);
    result.fold(
      (error) => emit(AuthError(error)),
      (_) => emit(AuthOtpSent(event.phone)),
    );
  }

  Future<void> _onOtpVerifyRequested(
    AuthOtpVerifyRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    final result = await _verifyOtp(phone: event.phone, code: event.code);
    result.fold(
      (error) => emit(AuthError(error)),
      (user) => emit(AuthAuthenticated(user)),
    );
  }

  Future<void> _onLogoutRequested(
    AuthLogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    await _logout();
    emit(AuthUnauthenticated());
  }
}
