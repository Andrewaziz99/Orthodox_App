import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'core/di/injection.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';

class BibleSchoolApp extends StatefulWidget {
  const BibleSchoolApp({super.key});

  @override
  State<BibleSchoolApp> createState() => _BibleSchoolAppState();
}

class _BibleSchoolAppState extends State<BibleSchoolApp> {
  // Create AuthBloc once here so the router can reference it
  final _authBloc = getIt<AuthBloc>()..add(AuthCheckRequested());
  late final _router = AppRouter.createRouter(_authBloc);

  @override
  void dispose() {
    _authBloc.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: _authBloc,
      child: MaterialApp.router(
        title: 'مدرسة الكتاب للأطفال',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.light,
        routerConfig: _router,
        builder: (context, child) {
          return Directionality(
            textDirection: TextDirection.ltr,
            child: child!,
          );
        },
      ),
    );
  }
}