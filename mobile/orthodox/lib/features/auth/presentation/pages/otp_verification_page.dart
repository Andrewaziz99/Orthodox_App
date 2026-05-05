import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

import '../bloc/auth_bloc.dart';

class OtpVerificationPage extends StatefulWidget {
  final String phone;
  const OtpVerificationPage({super.key, required this.phone});

  @override
  State<OtpVerificationPage> createState() => _OtpVerificationPageState();
}

class _OtpVerificationPageState extends State<OtpVerificationPage> {
  final TextEditingController _otpController = TextEditingController();
  String _currentCode = '';

  // Resend countdown
  int _secondsRemaining = 60;
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  @override
  void dispose() {
    _timer.cancel();
    _otpController.dispose();
    super.dispose();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining == 0) {
        timer.cancel();
      } else {
        setState(() => _secondsRemaining--);
      }
    });
  }

  void _resendOtp() {
    context.read<AuthBloc>().add(AuthOtpSendRequested(widget.phone));
    setState(() => _secondsRemaining = 60);
    _startTimer();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthAuthenticated) {
          // Router will redirect via redirect guard
        }
        if (state is AuthError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: Colors.red.shade700,
            ),
          );
          _otpController.clear();
          setState(() => _currentCode = '');
        }
      },
      child: Scaffold(
        appBar: AppBar(
          leading: BackButton(onPressed: () => context.go('/login')),
          title: const Text('Verify Phone'),
        ),
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 24),

                const Text(
                  'Enter verification code',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  'We sent a 6-digit code to\n${widget.phone}',
                  style: const TextStyle(color: Colors.grey, fontSize: 14),
                ),

                const SizedBox(height: 36),

                // OTP pin input
                PinCodeTextField(
                  appContext: context,
                  length: 6,
                  controller: _otpController,
                  keyboardType: TextInputType.number,
                  animationType: AnimationType.fade,
                  pinTheme: PinTheme(
                    shape: PinCodeFieldShape.box,
                    borderRadius: BorderRadius.circular(10),
                    fieldHeight: 56,
                    fieldWidth: 48,
                    activeFillColor: Colors.white,
                    selectedFillColor: Colors.white,
                    inactiveFillColor: Colors.grey.shade100,
                    activeColor: const Color(0xFF1E40AF),
                    selectedColor: const Color(0xFF1E40AF),
                    inactiveColor: Colors.grey.shade300,
                  ),
                  enableActiveFill: true,
                  onChanged: (value) => setState(() => _currentCode = value),
                  onCompleted: (code) {
                    context.read<AuthBloc>().add(
                          AuthOtpVerifyRequested(
                            phone: widget.phone,
                            code: code,
                          ),
                        );
                  },
                ),

                const SizedBox(height: 32),

                // Verify button
                BlocBuilder<AuthBloc, AuthState>(
                  builder: (context, state) {
                    final isLoading = state is AuthLoading;
                    return ElevatedButton(
                      onPressed: (_currentCode.length == 6 && !isLoading)
                          ? () => context.read<AuthBloc>().add(
                                AuthOtpVerifyRequested(
                                  phone: widget.phone,
                                  code: _currentCode,
                                ),
                              )
                          : null,
                      child: isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text('Verify'),
                    );
                  },
                ),

                const SizedBox(height: 24),

                // Resend timer
                Center(
                  child: _secondsRemaining > 0
                      ? Text(
                          'Resend code in $_secondsRemaining seconds',
                          style: const TextStyle(color: Colors.grey),
                        )
                      : TextButton(
                          onPressed: _resendOtp,
                          child: const Text(
                            'Resend Code',
                            style: TextStyle(fontWeight: FontWeight.w600),
                          ),
                        ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
