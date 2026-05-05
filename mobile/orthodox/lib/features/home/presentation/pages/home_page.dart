import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../domain/entities/home_section.dart';
import '../widgets/home_header.dart';
import '../widgets/section_card.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        final user = state is AuthAuthenticated ? state.user : null;

        return Scaffold(
          backgroundColor: const Color(0xFFF9FAFB),
          body: SafeArea(
            child: CustomScrollView(
              slivers: [
                // Header
                SliverToBoxAdapter(
                  child: HomeHeader(user: user),
                ),

                // Sections based on role
                SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final sections = HomeSections.forRole(user?.role);
                        if (index >= sections.length) return null;
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: SectionCard(section: sections[index]),
                        );
                      },
                      childCount: HomeSections.forRole(user?.role).length,
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
