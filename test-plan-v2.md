# Pruebas de Implementación - Versión 2

## 1. Prueba de Descarga de PDF

- Verificar que el botón "Descargar PDF" genera y descarga correctamente el PDF
- Comprobar que se muestra la notificación de éxito después de la descarga
- Verificar que el PDF contiene todos los datos del contrato

## 2. Prueba de Guardado del Número de Cuotas

- Verificar que el número de cuotas se guarda correctamente en la hoja "Contratos" de Google Sheets
- Comprobar que el número de cuotas se guarda correctamente en la hoja "Historial" de Google Sheets
- Verificar que el número de cuotas se carga correctamente al editar un contrato existente

## 3. Prueba de Guardado de Datos

- Verificar que todos los datos del contrato se guardan correctamente en Google Sheets
- Comprobar que los detalles de cada línea se guardan correctamente en la hoja "DetallesContratos"
- Verificar que no hay errores durante el proceso de guardado

## 4. Prueba de Formato de Campos Numéricos

- Verificar que los campos de importe no muestran ceros iniciales
- Comprobar que los campos de porcentaje de descuento no muestran ceros iniciales
- Verificar que se pueden ingresar valores correctamente en los campos numéricos
- Comprobar que los campos vacíos no se rellenan automáticamente con ceros

## Notas Importantes

- Asegurarse de que la URL del script de Google Apps Script es correcta
- Verificar que existen las hojas necesarias en Google Sheets con los encabezados actualizados
- Comprobar que los permisos de acceso a la hoja de cálculo son correctos
