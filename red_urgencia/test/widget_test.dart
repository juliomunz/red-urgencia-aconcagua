import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:triage_predictivo_app/main.dart';

void main() {
  testWidgets('Prueba de Integración: La App inicia correctamente', (WidgetTester tester) async {
    // 1. Construir la app y disparar el primer frame
    await tester.pumpWidget(const RedUrgenciaApp());
    final appFinder = find.byType(MaterialApp);
    expect(appFinder, findsOneWidget);
  });
}