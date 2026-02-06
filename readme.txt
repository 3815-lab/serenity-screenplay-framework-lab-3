PRUEBA DE CARGA - FAKESTORE API
=================================

DESCRIPCION GENERAL
-------------------
Este proyecto consiste en una prueba de carga y disponibilidad para el servicio de autenticación de https://fakestoreapi.com/auth/login. La implementación utiliza K6 (Grafana Labs) para la generación de tráfico y validación de SLAs, siguiendo un enfoque de "Código como Infraestructura" modular y escalable.
El script simula un flujo de usuarios concurrentes realizando login, validando no solo la respuesta HTTP sino también la lógica de negocio (recepción de tokens válidos).

PRERREQUISITOS
--------------
Para ejecutar este proyecto, asegúrese de tener instalado:
- Sistema Operativo: Linux, Windows o MacOS.
- K6: v0.47.0 o superior.
- Git (Opcional, para control de versiones).

INSTRUCCIONES DE EJECUCION (PASO A PASO)
----------------------------------------

1. Ubicación:
   Asegúrese de estar en la carpeta raíz del proyecto (donde se encuentran `tests/` y `src/`).

2. Ejecución de la prueba:
   El proyecto está configurado para ejecutarse con valores balanceados por defecto. 
   
   Ejecución Estándar:
   k6 run tests/load-test.js
   Por defecto: 22 TPS, 100 Max VUs, 1 min de duración.

   Para validar la estabilidad del sistema bajo carga prolongada:
   k6 run -e DURATION=15m tests/load-test.js

   Parametrización Avanzada:
   Puede sobrescribir cualquier variable de entorno sin modificar el código:
   - `TARGET_TPS`: Rata de peticiones por segundo (Defecto: 22).
   - `MAX_VUS`: Límite de usuarios simultáneos (Defecto: 100).
   - `DURATION`: Tiempo total de la prueba (e.g., 5m, 1h).
   - `REQ_DURATION_THRESHOLD`: SLA de latencia p95 en ms (Defecto: 1500).

   *Ejemplo personalizado:*
   `k6 run -e TARGET_TPS=30 -e DURATION=10m tests/load-test.js`

3. Ver los reportes:
   Al finalizar la ejecución (1 minuto), se generará automáticamente:
   - Salida en Consola: Resumen detallado de la ejecución.
   - Archivo `summary.txt`: Un reporte persistente con todas las métricas.
   - Archivo `index.html`: Dashboard gráfico local visual.


Nota: El reporte incluye métricas personalizadas de negocio prefijadas con `business_`.

DECISIONES DE ARQUITECTURA
--------------------------
- Patrón Service Object: Se encapsula la lógica de comunicación con la API en servicios (`src/services/auth-service.js`), separando las responsabilidades de "cómo" se hace la petición de "qué" prueba el escenario.
- Configuración Centralizada: Las rutas y constantes se manejan en archivos dedicados (`src/config/endpoints.js`, `src/config/config.js`), eliminando "strings quemados" y facilitando cambios futuros.
- Modularidad: Se separa la configuración (`src/config`), los datos (`src/data`) y los escenarios (`src/scenarios`) del script de ejecución (`tests/`), facilitando el mantenimiento.
- Manejo de Datos: Los usuarios se cargan desde un CSV (`users.csv`) y se sanean/filtran dinámicamente usando `Papaparse` para evitar fallos por datos vacíos.
- Métricas de Negocio: Se implementaron métricas personalizadas (`business_successful_logins`, `business_login_duration`) para medir el éxito real de la operación desde la perspectiva del usuario, más allá del código de estado HTTP.
- Dependencias Locales (Vendoring): Las librerías externas (`k6-summary`, `papaparse`) se han descargado localmente en `src/lib/` para garantizar que la prueba sea reproducible offline y no dependa de URLs externas inestables.
- Umbrales (Thresholds): Se definieron SLAs estrictos en el código (p95 < 1.5s, Errores < 3%) que hacen fallar la prueba automáticamente si no se cumplen.
