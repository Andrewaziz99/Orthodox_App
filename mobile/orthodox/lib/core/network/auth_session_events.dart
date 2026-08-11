import 'dart:async';

import 'package:injectable/injectable.dart';

@singleton
class AuthSessionEvents {
  final _expiredController = StreamController<void>.broadcast();

  Stream<void> get expired => _expiredController.stream;

  void notifyExpired() => _expiredController.add(null);
}
