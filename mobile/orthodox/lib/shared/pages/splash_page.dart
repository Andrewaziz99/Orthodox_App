import 'package:flutter/material.dart';

class SplashPage extends StatelessWidget {
  const SplashPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Color(0xFF1E40AF),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.menu_book_rounded, color: Colors.white, size: 72),
            SizedBox(height: 20),
            Text(
              'مدرسة الكتاب',
              style: TextStyle(
                color: Colors.white,
                fontSize: 32,
                fontWeight: FontWeight.bold,
                fontFamily: 'Cairo',
              ),
              textDirection: TextDirection.rtl,
            ),
            SizedBox(height: 8),
            Text(
              'Bible School for Children',
              style: TextStyle(color: Colors.white70, fontSize: 14),
            ),
            SizedBox(height: 48),
            CircularProgressIndicator(color: Colors.white54, strokeWidth: 2),
          ],
        ),
      ),
    );
  }
}
