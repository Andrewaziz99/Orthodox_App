import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/auth/presentation/pages/phone_entry_page.dart';
import '../../features/auth/presentation/pages/otp_verification_page.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../shared/pages/splash_page.dart';
import '../../shared/pages/unauthorized_page.dart';

class AppRouter {
  static final _rootNavigatorKey = GlobalKey<NavigatorState>();

  /// Call once in app.dart, passing the AuthBloc from the widget tree.
  static GoRouter createRouter(AuthBloc authBloc) {
    return GoRouter(
      navigatorKey: _rootNavigatorKey,
      initialLocation: '/splash',
      refreshListenable: _BlocListenable(authBloc),
      redirect: (context, state) => _redirect(authBloc, state),
      routes: [
        GoRoute(
          path: '/splash',
          builder: (_, __) => const SplashPage(),
        ),
        GoRoute(
          path: '/login',
          builder: (_, __) => const PhoneEntryPage(),
        ),
        GoRoute(
          path: '/otp/:phone',
          builder: (context, state) => OtpVerificationPage(
            phone: state.pathParameters['phone']!,
          ),
        ),
        GoRoute(
          path: '/home',
          builder: (_, __) => const HomePage(),
        ),
        GoRoute(
          path: '/unauthorized',
          builder: (_, __) => const UnauthorizedPage(),
        ),
      ],
      errorBuilder: (context, state) => Scaffold(
        body: Center(child: Text('Page not found: ${state.uri}')),
      ),
    );
  }

  static String? _redirect(AuthBloc authBloc, GoRouterState state) {
    final authState = authBloc.state;
    final location = state.uri.toString();

    final isOnSplash = location == '/splash';
    final isOnAuth =
        location.startsWith('/login') || location.startsWith('/otp');

    // Only the very first load (before AuthCheckRequested resolves) stays on splash
    if (authState is AuthInitial) {
      return isOnSplash ? null : '/splash';
    }

    // AuthLoading / AuthOtpSent / AuthError → don't redirect, let UI handle it
    if (authState is AuthLoading ||
        authState is AuthOtpSent ||
        authState is AuthError) {
      return null;
    }

    // Not logged in — go to login
    if (authState is AuthUnauthenticated) {
      return isOnAuth ? null : '/login';
    }

    // Logged in — skip splash and auth pages
    if (authState is AuthAuthenticated) {
      if (isOnSplash || isOnAuth) return '/home';
    }

    return null;
  }
}

/// Makes GoRouter re-evaluate redirect whenever AuthBloc emits a new state.
class _BlocListenable extends ChangeNotifier {
  _BlocListenable(AuthBloc bloc) {
    bloc.stream.listen((_) => notifyListeners());
  }
}