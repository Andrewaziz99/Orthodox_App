import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'app.dart';
import 'core/di/injection.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive for local storage
  await Hive.initFlutter();

  // Open required boxes
  await Hive.openBox('auth');
  await Hive.openBox('settings');

  // Setup dependency injection
  configureDependencies();

  print('DI configured. AuthBloc: ${getIt.isRegistered<AuthBloc>()}');

  runApp(const BibleSchoolApp());
}
