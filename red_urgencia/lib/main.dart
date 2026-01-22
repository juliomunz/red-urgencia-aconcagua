import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const RedUrgenciaApp());
}

class RedUrgenciaApp extends StatelessWidget {
  const RedUrgenciaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Red Urgencia Aconcagua',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const PantallaEstadoRed(),
    );
  }
}

class PantallaEstadoRed extends StatefulWidget {
  const PantallaEstadoRed({super.key});

  @override
  State<PantallaEstadoRed> createState() => _PantallaEstadoRedState();
}

class _PantallaEstadoRedState extends State<PantallaEstadoRed> {
  // TU URL REAL EN RENDER
  final String apiUrl = "https://red-urgencia-aconcagua.onrender.com/api/v1/red-urgencia";
  
  // Variable para guardar los datos que lleguen
  List<dynamic> centros = [];
  bool isLoading = true;
  String mensajeGlobal = "";

  @override
  void initState() {
    super.initState();
    fetchEstadoRed(); // Cargar datos al iniciar
  }

  // Función para pedir datos a la Nube
  Future<void> fetchEstadoRed() async {
    setState(() {
      isLoading = true;
    });

    try {
      final response = await http.get(Uri.parse(apiUrl));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          centros = data['centros'];
          mensajeGlobal = data['mensaje'];
          isLoading = false;
        });
      } else {
        throw Exception('Error al cargar datos');
      }
    } catch (e) {
      setState(() {
        isLoading = false;
        mensajeGlobal = "Error de conexión: $e";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Red Urgencia Aconcagua', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.blue[800],
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: fetchEstadoRed, // Botón para recargar datos
          )
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    mensajeGlobal,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
                    textAlign: TextAlign.center,
                  ),
                ),
                Expanded(
                  child: ListView.builder(
                    itemCount: centros.length,
                    itemBuilder: (context, index) {
                      final centro = centros[index];
                      // Convertimos el color HEX del JSON a Color de Flutter
                      final colorEstado = Color(centro['color_hex']);

                      return Card(
                        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        elevation: 4,
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: colorEstado,
                            child: const Icon(Icons.local_hospital, color: Colors.white),
                          ),
                          title: Text(
                            centro['nombre'],
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 5),
                              Text("Tipo: ${centro['tipo']}"),
                              Text(
                                "Estado: ${centro['estado']}",
                                style: TextStyle(
                                  color: colorEstado,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 5),
                              Text(
                                centro['recomendacion'],
                                style: const TextStyle(fontStyle: FontStyle.italic, fontSize: 12),
                              ),
                            ],
                          ),
                          trailing: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "${centro['tiempo_espera']}",
                                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                              ),
                              const Text("min", style: TextStyle(fontSize: 12)),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Text("Datos en Tiempo Real - Servicio de Salud Aconcagua", style: TextStyle(color: Colors.grey)),
                )
              ],
            ),
    );
  }
}