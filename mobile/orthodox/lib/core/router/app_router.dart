import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/auth/presentation/pages/login_page.dart';
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
          builder: (_, __) => const LoginPage(),
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
    final isOnAuth = location == '/login';

    // Only the very first load (before AuthCheckRequested resolves) stays on splash
    if (authState is AuthInitial) {
      return isOnSplash ? null : '/splash';
    }

    if (authState is AuthError && isOnSplash) return '/login';

    // Loading and form errors stay on their current page.
    if (authState is AuthLoading || authState is AuthError) {
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
  late final StreamSubscription<AuthState> _subscription;

  _BlocListenable(AuthBloc bloc) {
    _subscription = bloc.stream.listen((_) => notifyListeners());
  }

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}
