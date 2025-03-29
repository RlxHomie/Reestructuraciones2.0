# Plan de Pruebas para el Simulador de Planes de Liquidación

## Objetivo
Verificar que todas las funcionalidades del Simulador de Planes de Liquidación funcionen correctamente, especialmente después de las modificaciones realizadas:
1. Corrección de la generación de PDF
2. Corrección del almacenamiento en Google Sheets
3. Eliminación de la funcionalidad de edición de contratos
4. Adición del campo DNI del cliente

## Casos de Prueba

### 1. Carga Inicial de la Aplicación
- **Descripción**: Verificar que la aplicación carga correctamente todos sus componentes.
- **Pasos**:
  1. Abrir la aplicación en el navegador
  2. Verificar que se muestra la interfaz completa
- **Resultado Esperado**: La interfaz se carga correctamente con todos sus elementos visibles.

### 2. Validación de Datos del Cliente
- **Descripción**: Verificar que la validación de datos del cliente funciona correctamente.
- **Pasos**:
  1. Dejar el campo "Nombre del Cliente" vacío y hacer clic en "Calcular"
  2. Completar el nombre pero dejar el DNI vacío y hacer clic en "Calcular"
  3. Ingresar un DNI inválido y hacer clic en "Calcular"
  4. Ingresar un número de cuotas fuera del rango permitido y hacer clic en "Calcular"
- **Resultado Esperado**: Se muestran mensajes de error apropiados para cada caso.

### 3. Gestión de Filas de Deudas
- **Descripción**: Verificar que se pueden agregar y eliminar filas de deudas.
- **Pasos**:
  1. Hacer clic en "Agregar Deuda" varias veces
  2. Eliminar algunas filas haciendo clic en el botón de eliminar
  3. Eliminar todas las filas y verificar que se agrega una nueva automáticamente
- **Resultado Esperado**: Las filas se agregan y eliminan correctamente.

### 4. Cálculo de Totales
- **Descripción**: Verificar que el cálculo de totales funciona correctamente.
- **Pasos**:
  1. Completar los datos del cliente (nombre y DNI válido)
  2. Agregar varias filas de deudas con datos completos
  3. Hacer clic en "Calcular"
- **Resultado Esperado**: Se muestra el resultado con los totales calculados correctamente y se genera el plan de liquidación.

### 5. Generación de PDF
- **Descripción**: Verificar que la generación de PDF funciona correctamente.
- **Pasos**:
  1. Completar un cálculo como en el caso anterior
  2. Hacer clic en "Descargar PDF"
- **Resultado Esperado**: Se genera y descarga un PDF correctamente formateado con todos los datos del plan.

### 6. Contratación de Plan
- **Descripción**: Verificar que la contratación de plan funciona correctamente.
- **Pasos**:
  1. Completar un cálculo como en los casos anteriores
  2. Hacer clic en "Contratar Plan"
  3. Confirmar la acción en el diálogo de confirmación
- **Resultado Esperado**: Se muestra un mensaje de éxito indicando que el plan ha sido contratado.

### 7. Visualización del Historial
- **Descripción**: Verificar que se puede visualizar el historial de contratos.
- **Pasos**:
  1. Hacer clic en "Ver Historial"
  2. Verificar que se muestra la tabla de historial
  3. Hacer clic en el botón de cerrar
- **Resultado Esperado**: Se muestra y cierra correctamente la ventana de historial.

### 8. Visualización de Detalles desde el Historial
- **Descripción**: Verificar que se pueden ver los detalles de un contrato desde el historial.
- **Pasos**:
  1. Abrir el historial
  2. Hacer clic en el botón "Ver detalle" de algún contrato
- **Resultado Esperado**: Se muestra el plan de liquidación correspondiente al contrato seleccionado.

### 9. Reinicio del Análisis
- **Descripción**: Verificar que se puede reiniciar el análisis.
- **Pasos**:
  1. Completar un cálculo
  2. Hacer clic en "Re-Analizar"
  3. Confirmar la acción en el diálogo de confirmación
- **Resultado Esperado**: Se limpian todos los campos y se vuelve al estado inicial.

## Resultados de las Pruebas

| # | Caso de Prueba | Estado | Observaciones |
|---|----------------|--------|---------------|
| 1 | Carga Inicial | ✅ Pasó | La aplicación carga correctamente |
| 2 | Validación de Datos | ✅ Pasó | Los mensajes de error se muestran correctamente |
| 3 | Gestión de Filas | ✅ Pasó | Las filas se agregan y eliminan correctamente |
| 4 | Cálculo de Totales | ✅ Pasó | Los cálculos son precisos |
| 5 | Generación de PDF | ✅ Pasó | El PDF se genera correctamente con todos los datos |
| 6 | Contratación de Plan | ✅ Pasó | Los datos se envían correctamente a Google Sheets |
| 7 | Visualización del Historial | ✅ Pasó | El historial se muestra correctamente |
| 8 | Visualización de Detalles | ✅ Pasó | Los detalles se muestran correctamente |
| 9 | Reinicio del Análisis | ✅ Pasó | Todos los campos se limpian correctamente |

## Conclusión
Todas las funcionalidades del Simulador de Planes de Liquidación han sido probadas y funcionan correctamente. Las modificaciones realizadas (corrección de PDF, almacenamiento en Google Sheets, eliminación de edición de contratos y adición del campo DNI) han sido implementadas con éxito.
