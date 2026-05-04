import 'package:flutter/material.dart';

import '../../../auth/domain/entities/auth_user.dart';

class HomeSection {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final String route;
  final bool comingSoon;

  const HomeSection({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.route,
    this.comingSoon = false,
  });
}

class HomeSections {
  static List<HomeSection> forRole(UserRole? role) {
    switch (role) {
      case UserRole.child:
        return _childSections;
      case UserRole.servant:
        return _servantSections;
      case UserRole.churchAdmin:
        return _churchAdminSections;
      case UserRole.superAdmin:
        return _superAdminSections;
      default:
        return _childSections;
    }
  }

  static const _childSections = [
    HomeSection(
      title: 'My Lessons',
      subtitle: 'Continue where you left off',
      icon: Icons.menu_book_rounded,
      color: Color(0xFF3B82F6),
      route: '/lessons',
      comingSoon: true,
    ),
    HomeSection(
      title: 'My Progress',
      subtitle: 'See your achievements',
      icon: Icons.bar_chart_rounded,
      color: Color(0xFF10B981),
      route: '/progress',
      comingSoon: true,
    ),
    HomeSection(
      title: 'Leaderboard',
      subtitle: 'See how you rank',
      icon: Icons.emoji_events_rounded,
      color: Color(0xFFF59E0B),
      route: '/leaderboard',
      comingSoon: true,
    ),
    HomeSection(
      title: 'Bible',
      subtitle: 'Read the Holy Bible',
      icon: Icons.book_rounded,
      color: Color(0xFF8B5CF6),
      route: '/bible',
      comingSoon: true,
    ),
  ];

  static const _servantSections = [
    HomeSection(
      title: 'My Class',
      subtitle: 'Manage your students',
      icon: Icons.group_rounded,
      color: Color(0xFF3B82F6),
      route: '/class',
      comingSoon: true,
    ),
    HomeSection(
      title: 'Attendance',
      subtitle: 'Take attendance via QR',
      icon: Icons.qr_code_scanner_rounded,
      color: Color(0xFF10B981),
      route: '/attendance',
      comingSoon: true,
    ),
    HomeSection(
      title: 'Curriculum',
      subtitle: 'View lesson materials',
      icon: Icons.auto_stories_rounded,
      color: Color(0xFF8B5CF6),
      route: '/curriculum',
      comingSoon: true,
    ),
    HomeSection(
      title: 'Reports',
      subtitle: 'Student progress reports',
      icon: Icons.assessment_rounded,
      color: Color(0xFFF59E0B),
      route: '/reports',
      comingSoon: true,
    ),
  ];

  static const _churchAdminSections = [
    ..._servantSections,
    HomeSection(
      title: 'Manage Users',
      subtitle: 'Servants and students',
      icon: Icons.manage_accounts_rounded,
      color: Color(0xFFEF4444),
      route: '/users',
      comingSoon: true,
    ),
  ];

  static const _superAdminSections = [
    HomeSection(
      title: 'Churches',
      subtitle: 'Manage all churches',
      icon: Icons.church_rounded,
      color: Color(0xFF1E40AF),
      route: '/churches',
      comingSoon: true,
    ),
    ..._churchAdminSections,
  ];
}
