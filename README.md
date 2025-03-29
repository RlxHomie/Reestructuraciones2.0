# Simulador de Planes de Liquidación - Devuélveme Mi Dinero

Este repositorio contiene una aplicación web para simular planes de liquidación de deudas para clientes de Devuélveme Mi Dinero.

## Características

- Simulación de planes de liquidación de deudas
- Cálculo de descuentos y cuotas mensuales
- Generación de PDF con el plan detallado
- Almacenamiento de datos en Google Sheets
- Visualización del historial de contratos
- Identificación de clientes mediante DNI

## Estructura del Proyecto

```
/
├── assets/               # Recursos estáticos
│   ├── DMD-LOGO.png      # Logo de la empresa
│   └── favicon.png       # Favicon del sitio
├── css/                  # Hojas de estilo
│   └── styles-improved.css  # Estilos de la aplicación
├── js/                   # Scripts de JavaScript
│   └── main-improved.js  # Lógica principal de la aplicación
├── libs/                 # Bibliotecas externas
│   ├── html2canvas.min.js    # Para capturar HTML como imagen
│   ├── jspdf.umd.min.js      # Para generar PDFs
│   └── html2pdf.bundle.min.js # Para convertir HTML a PDF
├── docs/                 # Documentación
│   ├── test-plan.md      # Plan de pruebas
│   └── deployment-guide.md # Guía de despliegue
├── appscript.js          # Código para Google Apps Script
└── index.html            # Página principal
```

## Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Cuenta de Google para Google Sheets y Google Apps Script
- Servidor web para alojar los archivos estáticos (o GitHub Pages)

## Instalación

1. Clona este repositorio:
   ```
   git clone https://github.com/tu-usuario/dmd-simulador.git
   ```

2. Configura Google Apps Script:
   - Crea un nuevo proyecto en [Google Apps Script](https://script.google.com/)
   - Copia el contenido de `appscript.js` en el editor
   - Despliega como aplicación web (ver guía de despliegue para más detalles)

3. Configura la URL del endpoint:
   - Abre `js/main-improved.js`
   - Actualiza la constante `GOOGLE_SHEET_ENDPOINT` con la URL de tu aplicación web de Google Apps Script

4. Sube los archivos a tu servidor web o GitHub Pages

## Uso

1. Abre la aplicación en un navegador web
2. Ingresa los datos del cliente (nombre y DNI)
3. Agrega las deudas a liquidar con sus respectivos detalles
4. Haz clic en "Calcular" para generar el plan de liquidación
5. Descarga el PDF o contrata el plan según sea necesario

## Desarrollo

Para contribuir al desarrollo:

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Contacto

Para cualquier consulta o soporte, contacta a [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)
