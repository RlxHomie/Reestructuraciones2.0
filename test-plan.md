# Pruebas de Implementación

## 1. Prueba de Integración con Google Sheets

### Entidades y Tipos de Producto
- Verificar que se cargan correctamente las entidades desde la hoja "Entidades" de Google Sheets
- Verificar que se cargan correctamente los tipos de producto desde la hoja "TiposProducto" de Google Sheets
- Comprobar que los selectores muestran los datos cargados correctamente

### Guardado de Contratos
- Verificar que los datos del contrato se guardan correctamente en la hoja "Contratos"
- Verificar que los detalles de cada línea se guardan en la hoja "DetallesContratos"
- Comprobar que la cuota mensual se guarda correctamente

### Historial
- Verificar que el historial se guarda correctamente en la hoja "Historial"
- Comprobar que se pueden editar contratos existentes

## 2. Prueba de Interfaz de Usuario

### Ancho y Visualización
- Verificar que el contenedor principal tiene un ancho de 1200px
- Comprobar que las casillas de entrada tienen mejor visualización
- Verificar que los campos de formulario tienen el estilo mejorado

### Funcionalidad PDF
- Verificar que la descarga de PDF funciona correctamente
- Comprobar que el PDF generado incluye todos los datos del contrato

## 3. Prueba de Funcionalidad General

### Cálculos
- Verificar que los cálculos de descuentos y cuotas son correctos
- Comprobar que el gráfico se actualiza correctamente

### Edición de Contratos
- Verificar que se pueden cargar y editar contratos existentes
- Comprobar que los cambios se guardan correctamente en Google Sheets

## Notas Importantes

- Asegurarse de que la URL del script de Google Apps Script es correcta
- Verificar que existen las hojas necesarias en Google Sheets: "Entidades", "TiposProducto", "Contratos", "DetallesContratos" y "Historial"
- Comprobar que los permisos de acceso a la hoja de cálculo son correctos
