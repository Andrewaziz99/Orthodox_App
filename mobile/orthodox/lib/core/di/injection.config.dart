// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;
import 'package:orthodox/core/network/api_client.dart' as _i886;
import 'package:orthodox/features/auth/data/datasources/auth_local_datasource.dart'
    as _i172;
import 'package:orthodox/features/auth/data/datasources/auth_remote_datasource.dart'
    as _i66;
import 'package:orthodox/features/auth/data/repositories/auth_repository_impl.dart'
    as _i1022;
import 'package:orthodox/features/auth/domain/repositories/auth_repository.dart'
    as _i477;
import 'package:orthodox/features/auth/domain/usecases/auth_usecases.dart'
    as _i722;
import 'package:orthodox/features/auth/presentation/bloc/auth_bloc.dart'
    as _i930;

extension GetItInjectableX on _i174.GetIt {
// initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(
      this,
      environment,
      environmentFilter,
    );
    gh.singleton<_i886.ApiClient>(() => _i886.ApiClient());
    gh.factory<_i172.AuthLocalDataSource>(
        () => _i172.AuthLocalDataSourceImpl());
    gh.factory<_i66.AuthRemoteDataSource>(
        () => _i66.AuthRemoteDataSourceImpl(gh<_i886.ApiClient>()));
    gh.factory<_i477.AuthRepository>(() => _i1022.AuthRepositoryImpl(
          gh<_i66.AuthRemoteDataSource>(),
          gh<_i172.AuthLocalDataSource>(),
        ));
    gh.factory<_i722.SendOtpUseCase>(
        () => _i722.SendOtpUseCase(gh<_i477.AuthRepository>()));
    gh.factory<_i722.VerifyOtpUseCase>(
        () => _i722.VerifyOtpUseCase(gh<_i477.AuthRepository>()));
    gh.factory<_i722.GetStoredSessionUseCase>(
        () => _i722.GetStoredSessionUseCase(gh<_i477.AuthRepository>()));
    gh.factory<_i722.LogoutUseCase>(
        () => _i722.LogoutUseCase(gh<_i477.AuthRepository>()));
    gh.factory<_i930.AuthBloc>(() => _i930.AuthBloc(
          gh<_i722.SendOtpUseCase>(),
          gh<_i722.VerifyOtpUseCase>(),
          gh<_i722.GetStoredSessionUseCase>(),
          gh<_i722.LogoutUseCase>(),
        ));
    return this;
  }
}
