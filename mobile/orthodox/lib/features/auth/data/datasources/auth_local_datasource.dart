import 'package:hive/hive.dart';
import 'package:injectable/injectable.dart';

import '../models/auth_user_model.dart';

abstract class AuthLocalDataSource {
  Future<void> cacheUser(AuthUserModel user);
  AuthUserModel? getCachedUser();
  Future<void> clearUser();
}

@Injectable(as: AuthLocalDataSource)
class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final Box _box = Hive.box('auth');

  @override
  Future<void> cacheUser(AuthUserModel user) async {
    await _box.put('user', user.toJson());
    await _box.put('access_token', user.accessToken);
  }

  @override
  AuthUserModel? getCachedUser() {
    final data = _box.get('user');
    if (data == null) return null;
    try {
      return AuthUserModel.fromStorage(data as Map);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<void> clearUser() async {
    await _box.delete('user');
    await _box.delete('access_token');
  }
}
