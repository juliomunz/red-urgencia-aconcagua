# Red Urgencia San Felipe 📱🏥
**Sistema de Simulación y Visualización de Tiempos de Espera para Urgencias.**

Este proyecto es el resultado del **Proyecto de Título para Ingeniería en Informática**, enfocado en la optimización de la demanda asistencial en la red de salud de Aconcagua (Hospital San Camilo y APS).

## 🚀 Propósito
El objetivo principal es reducir la asimetría de información entre el sistema de salud y el usuario. Mediante el uso de algoritmos de simulación y una interfaz móvil intuitiva, se busca incentivar la redistribución de pacientes de baja complejidad (ESI 4 y 5) hacia los servicios de urgencia de atención primaria (SAPU/SAR).

## 🛠️ Tecnologías Utilizadas
- **Frontend:** [Flutter](https://flutter.dev/) (Multiplataforma / PWA).
- **Backend:** [Node.js](https://nodejs.org/) con Express.
- **Simulación:** Lógica basada en Teoría de Colas (Modelo $M/M/1$) y categorización ESI.
- **Despliegue:** Vercel (Frontend) y Render (Backend).

## 🏗️ Arquitectura
El sistema utiliza una arquitectura **desacoplada (Cliente-Servidor)** mediante servicios web (API REST). Esto permite que el cliente móvil consuma datos en tiempo real procesados por un motor de simulación estocástica alojado en la nube.

## 📦 Instalación y Uso

1. **Clonar el repositorio:**
 
   git clone [https://github.com/juliomunz/red-urgencia-aconcagua.git](https://github.com/juliomunz/red-urgencia-aconcagua.git)

2. **Ejecutar el Frontend:**
    cd red_urgencia
    flutter pub get
    flutter run

3. **Endpoints de Prueba (Modo Simulación):**
    Consultar API: /api/v1/red-urgencia
    Forzar Colapso: /admin/colapsar
    Liberar Red: /admin/liberar

**Desarrollado por:**
    Julio Muñoz Cortés
    Ingeniero en Informática, Instituto IACC.
