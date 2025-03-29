# Guía de Despliegue - Simulador de Planes de Liquidación

Esta guía detalla los pasos necesarios para desplegar correctamente el Simulador de Planes de Liquidación en un entorno de producción.

## 1. Configuración de Google Apps Script

### 1.1. Crear un nuevo proyecto de Google Apps Script

1. Ve a [Google Apps Script](https://script.google.com/)
2. Haz clic en "Nuevo proyecto"
3. Copia el contenido del archivo `appscript.js` en el editor
4. Guarda el proyecto con un nombre descriptivo (por ejemplo, "DMD-Simulador-Backend")

### 1.2. Configurar la hoja de Google Sheets

1. Crea una nueva hoja de cálculo en [Google Sheets](https://sheets.google.com/)
2. Renombra la hoja como "Planes Contratados"
3. Crea las siguientes hojas dentro del documento:
   - "Entidades"
   - "TiposProducto"
   - "Contratos"
   - "Detalles"
   - "Historial"

### 1.3. Vincular el script a la hoja de cálculo

1. En el editor de Google Apps Script, haz clic en "Proyecto" > "Configuración del proyecto"
2. En la sección "Hoja de cálculo", selecciona la hoja "Planes Contratados" que creaste
3. Guarda la configuración

### 1.4. Desplegar como aplicación web

1. En el editor de Google Apps Script, haz clic en "Implementar" > "Nueva implementación"
2. Selecciona "Aplicación web" como tipo de implementación
3. Configura los siguientes parámetros:
   - Descripción: "DMD Simulador API"
   - Ejecutar como: "Tu cuenta" (la cuenta propietaria del script)
   - Quién tiene acceso: "Cualquier persona, incluso anónimo"
4. Haz clic en "Implementar"
5. Copia la URL de la aplicación web que se genera (la necesitarás para configurar el frontend)

## 2. Configuración del Frontend

### 2.1. Actualizar la URL del endpoint

1. Abre el archivo `js/main-improved.js`
2. Busca la constante `GOOGLE_SHEET_ENDPOINT` (aproximadamente en la línea 91)
3. Reemplaza el valor con la URL de la aplicación web de Google Apps Script que copiaste anteriormente:
   ```javascript
   const GOOGLE_SHEET_ENDPOINT = "https://script.google.com/macros/s/TU-ID-ÚNICO/exec";
   ```

### 2.2. Despliegue en GitHub Pages

1. Crea un nuevo repositorio en GitHub
2. Sube todos los archivos del proyecto al repositorio
3. Ve a la sección "Settings" > "Pages" del repositorio
4. En "Source", selecciona "main" (o la rama que estés utilizando)
5. Haz clic en "Save"
6. GitHub te proporcionará una URL donde se ha desplegado tu sitio

### 2.3. Despliegue en un servidor web tradicional

Alternativamente, puedes desplegar los archivos en cualquier servidor web:

1. Sube todos los archivos a tu servidor web mediante FTP o el método que prefieras
2. Asegúrate de que los archivos sean accesibles públicamente
3. Verifica que la estructura de directorios se mantenga intacta

## 3. Verificación del Despliegue

### 3.1. Probar la aplicación

1. Accede a la URL donde has desplegado la aplicación
2. Verifica que la interfaz se carga correctamente
3. Realiza una simulación completa:
   - Ingresa datos del cliente (nombre y DNI)
   - Agrega deudas
   - Calcula el plan
   - Descarga el PDF
   - Contrata el plan

### 3.2. Verificar el almacenamiento de datos

1. Después de contratar un plan, verifica que los datos se han guardado correctamente en la hoja de Google Sheets
2. Comprueba que aparecen registros en las hojas "Contratos", "Detalles" y "Historial"

## 4. Solución de Problemas Comunes

### 4.1. Problemas con CORS

Si experimentas errores relacionados con CORS:

1. Verifica que estás utilizando el modo `no-cors` en las solicitudes fetch
2. Asegúrate de que la configuración de la aplicación web de Google Apps Script permite el acceso anónimo
3. Considera utilizar un proxy CORS si los problemas persisten

### 4.2. PDF en blanco

Si los PDF se generan en blanco:

1. Verifica que las bibliotecas html2canvas, jspdf y html2pdf están correctamente cargadas
2. Asegúrate de que las imágenes utilizadas en el PDF tienen rutas absolutas
3. Comprueba que no hay errores en la consola del navegador durante la generación del PDF

### 4.3. Datos no guardados en Google Sheets

Si los datos no se guardan correctamente:

1. Verifica que la URL del endpoint es correcta
2. Asegúrate de que el script tiene permisos para acceder y modificar la hoja de cálculo
3. Comprueba que los nombres de las hojas en el script coinciden exactamente con los nombres en la hoja de cálculo

## 5. Mantenimiento

### 5.1. Actualización del script

Si necesitas actualizar el script de Google Apps Script:

1. Realiza los cambios necesarios en el editor
2. Haz clic en "Implementar" > "Administrar implementaciones"
3. Selecciona la implementación existente
4. Haz clic en "Modificar"
5. Actualiza la versión y haz clic en "Implementar"

### 5.2. Actualización del frontend

Si necesitas actualizar el frontend:

1. Realiza los cambios necesarios en los archivos locales
2. Sube los cambios al repositorio de GitHub o a tu servidor web
3. Si estás utilizando GitHub Pages, los cambios se aplicarán automáticamente

## 6. Contacto y Soporte

Para cualquier consulta o soporte adicional, contacta a:

- Email: soporte@devuelvememidinero.com
- Teléfono: +34 XXX XXX XXX
