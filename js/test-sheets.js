// Archivo de prueba para verificar la funcionalidad de Google Sheets
// Este script simula las llamadas a la API de Google Sheets para probar la integración

// Configuración
const GOOGLE_SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbxLEVjy-I3.../exec";

// Función para probar guardar un contrato
function probarGuardarContrato() {
  console.log("Probando guardar contrato...");
  
  // Datos de ejemplo
  const datosContrato = {
    folio: "FOLIO-20250319-0001",
    fecha: "19/03/2025",
    nombreDeudor: "Juan Pérez",
    numeroDeudas: "2",
    deudaOriginal: "5000",
    deudaDescontada: "3500",
    ahorro: "1500",
    totalAPagar: "4000",
    cuotaMensual: "333.33",
    detalles: JSON.stringify([
      {
        numeroContrato: "12345",
        tipoProducto: "Préstamo",
        entidad: "BANCO XYZ",
        deudaOriginal: 3000,
        porcentajeDescuento: 30,
        deudaConDescuento: 2100
      },
      {
        numeroContrato: "67890",
        tipoProducto: "Tarjeta",
        entidad: "FINANCIERA ABC",
        deudaOriginal: 2000,
        porcentajeDescuento: 30,
        deudaConDescuento: 1400
      }
    ])
  };
  
  // Crear FormData para enviar
  const formData = new URLSearchParams();
  formData.append("accion", "guardarContrato");
  
  // Añadir todos los campos
  Object.keys(datosContrato).forEach(key => {
    formData.append(key, datosContrato[key]);
  });
  
  // Enviar petición
  fetch(GOOGLE_SHEET_ENDPOINT, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString()
  })
  .then(response => response.text())
  .then(data => {
    console.log("Respuesta:", data);
  })
  .catch(error => {
    console.error("Error:", error);
  });
}

// Función para probar guardar historial
function probarGuardarHistorial() {
  console.log("Probando guardar historial...");
  
  // Datos de ejemplo
  const datosHistorial = {
    folio: "FOLIO-20250319-0001",
    fecha: "19/03/2025",
    nombreDeudor: "Juan Pérez",
    numeroDeudas: "2",
    deudaOriginal: "5000",
    deudaDescontada: "3500",
    ahorro: "1500",
    totalAPagar: "4000"
  };
  
  // Crear FormData para enviar
  const formData = new URLSearchParams();
  formData.append("accion", "guardarHistorial");
  
  // Añadir todos los campos
  Object.keys(datosHistorial).forEach(key => {
    formData.append(key, datosHistorial[key]);
  });
  
  // Enviar petición
  fetch(GOOGLE_SHEET_ENDPOINT, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString()
  })
  .then(response => response.text())
  .then(data => {
    console.log("Respuesta:", data);
  })
  .catch(error => {
    console.error("Error:", error);
  });
}

// Función para probar actualizar un contrato
function probarActualizarContrato() {
  console.log("Probando actualizar contrato...");
  
  // Datos de ejemplo
  const datosContrato = {
    folio: "FOLIO-20250319-0001", // Folio existente
    fecha: "19/03/2025",
    nombreDeudor: "Juan Pérez Actualizado",
    numeroDeudas: "3",
    deudaOriginal: "6000",
    deudaDescontada: "4200",
    ahorro: "1800",
    totalAPagar: "4800",
    cuotaMensual: "400",
    detalles: JSON.stringify([
      {
        numeroContrato: "12345",
        tipoProducto: "Préstamo",
        entidad: "BANCO XYZ",
        deudaOriginal: 3000,
        porcentajeDescuento: 30,
        deudaConDescuento: 2100
      },
      {
        numeroContrato: "67890",
        tipoProducto: "Tarjeta",
        entidad: "FINANCIERA ABC",
        deudaOriginal: 2000,
        porcentajeDescuento: 30,
        deudaConDescuento: 1400
      },
      {
        numeroContrato: "11223",
        tipoProducto: "Crédito",
        entidad: "COOPERATIVA DEF",
        deudaOriginal: 1000,
        porcentajeDescuento: 30,
        deudaConDescuento: 700
      }
    ])
  };
  
  // Crear FormData para enviar
  const formData = new URLSearchParams();
  formData.append("accion", "actualizarContrato");
  
  // Añadir todos los campos
  Object.keys(datosContrato).forEach(key => {
    formData.append(key, datosContrato[key]);
  });
  
  // Enviar petición
  fetch(GOOGLE_SHEET_ENDPOINT, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString()
  })
  .then(response => response.text())
  .then(data => {
    console.log("Respuesta:", data);
  })
  .catch(error => {
    console.error("Error:", error);
  });
}

// Función para probar obtener detalles de un contrato
function probarObtenerDetallesContrato() {
  console.log("Probando obtener detalles de contrato...");
  
  // Folio de ejemplo
  const folio = "FOLIO-20250319-0001";
  
  // Crear FormData para enviar
  const formData = new URLSearchParams();
  formData.append("accion", "obtenerDetallesContrato");
  formData.append("folio", folio);
  
  // Enviar petición
  fetch(GOOGLE_SHEET_ENDPOINT, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString()
  })
  .then(response => response.json())
  .then(data => {
    console.log("Detalles del contrato:", data);
  })
  .catch(error => {
    console.error("Error:", error);
  });
}

// Ejecutar pruebas
// Descomentar la función que deseas probar
// probarGuardarContrato();
// probarGuardarHistorial();
// probarActualizarContrato();
// probarObtenerDetallesContrato();
