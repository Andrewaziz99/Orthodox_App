# Orthodox mobile app

Flutter client for the Bible School application. The existing home shell is
role-aware and authentication uses the Graphy identifier/password API.

## Authentication

Sign-in accepts a registered phone number or email plus password and calls
`POST /api/v1/auth/login`. Access and refresh tokens are stored with
`flutter_secure_storage`; Hive stores only the non-sensitive user projection
needed to restore the home shell.

Expired access tokens are refreshed through `POST /api/v1/auth/refresh`. An
invalid or reused refresh token clears the local session and returns to
`/login`; transient network and server failures retain the session so the
request can be retried. Logout calls the authenticated
`POST /api/v1/auth/logout` before clearing local session data.

## API configuration

The development default is the Android emulator host:

```text
http://10.0.2.2:3000/api/v1
```

The debug Android manifest permits cleartext traffic for local development
only. Release builds do not include a cleartext exception. Always provide the
production HTTPS API URL at build or run time:

```bash
flutter run --dart-define=API_BASE_URL=https://api.example.com/api/v1
flutter build apk --release --dart-define=API_BASE_URL=https://api.example.com/api/v1
```

## Setup

```bash
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter analyze
flutter test
```
