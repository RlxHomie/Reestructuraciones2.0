# Implementación de Mejoras para el Simulador de Reestructuración DMD

Este documento resume las mejoras implementadas en el Simulador de Reestructuración DMD según los requerimientos solicitados.

## Mejoras Implementadas

### 1. Guardado de Datos de Contrato en Google Sheets

Se ha implementado la funcionalidad para guardar todos los datos de contrato línea por línea en Google Sheets, incluyendo:
- N° Contrato
- Tipo Producto
- Entidad
- Importe de deuda (€)
- % Descuento
- Importe con descuento (€)
- Cuota mensual

### 2. Guardado de Historial en Google Sheets

Se ha implementado la funcionalidad para guardar el historial de simulaciones en una pestaña específica de Google Sheets.

### 3. Edición de Contratos Existentes

Se ha añadido un botón para editar la información de contratos ya contratados, permitiendo:
- Cargar datos desde Google Sheets
- Modificar la información
- Actualizar los datos en Google Sheets

## Archivos Modificados

1. **index.html**: Se añadió el botón "Editar Contrato" en la sección del plan.
2. **main.js**: Se implementaron las siguientes mejoras:
   - Nuevo módulo GoogleSheetsModule para la integración con Google Sheets
   - Funciones para cargar y editar datos de contratos
   - Mejoras en el historial para incluir botón de edición
3. **appscript.js**: Nuevo script de Google Apps Script con funciones para:
   - Guardar contratos y sus detalles
   - Guardar historial
   - Obtener y actualizar datos de contratos

## Instrucciones de Implementación

1. **Configuración de Google Apps Script**:
   - Crear un nuevo proyecto en Google Apps Script
   - Copiar el contenido de `appscript.js` al editor
   - Implementar como aplicación web
   - Copiar la URL generada

2. **Actualización del Código del Simulador**:
   - Actualizar la constante `GOOGLE_SHEET_ENDPOINT` en el módulo `GoogleSheetsModule` con la URL obtenida
   - Asegurarse de que la hoja de cálculo vinculada tenga las pestañas necesarias: "Contratos", "DetallesContratos" y "Historial"

3. **Pruebas**:
   - Seguir el plan de pruebas detallado en `test-plan.js` para verificar todas las funcionalidades

## Notas Adicionales

- La funcionalidad de edición mantiene el folio original del contrato
- Se han implementado notificaciones para informar al usuario sobre el estado de las operaciones
- Se ha documentado el código para facilitar futuras modificaciones
