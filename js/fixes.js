// Modificación para corregir la descarga de PDF y otros problemas

// Función para descargar PDF mejorada
function descargarPlanMejorado() {
  // Mostrar notificación de inicio
  mostrarNotificacion("Generando PDF, por favor espere...", "info");
  
  // Obtener el elemento que contiene el plan
  const planDiv = document.getElementById("plan-de-liquidacion");
  if (!planDiv) {
    mostrarNotificacion("Error: No se encontró el contenido del plan", "error");
    return;
  }
  
  // Preparar datos para el nombre del archivo
  const fechaFilename = (document.getElementById("plan-fecha")?.textContent || "").replaceAll("/", "-");
  const nombreDeudor = (document.getElementById("plan-nombre-deudor")?.textContent || "Simulacion").trim();
  const folioActual = document.getElementById("plan-folio")?.textContent || "";
  
  // Configuración para html2pdf
  const opt = {
    margin: [10, 10, 10, 10],
    filename: `${nombreDeudor}_${fechaFilename}_${folioActual.replace("FOLIO-", "")}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      logging: false,
      letterRendering: true
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true
    }
  };
  
  // Usar el método .save() directamente en lugar de encadenarlo
  const pdf = html2pdf();
  pdf.set(opt);
  
  // Usar promesas para manejar el proceso
  pdf.from(planDiv)
    .outputPdf()
    .then(function(pdf) {
      // Forzar la descarga usando un enlace
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = opt.filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        mostrarNotificacion("PDF descargado correctamente", "success");
      }, 100);
    })
    .catch(function(error) {
      console.error("Error al generar PDF:", error);
      mostrarNotificacion("Error al generar PDF: " + error, "error");
    });
}

// Función para corregir el formato de los campos numéricos
function corregirFormatoNumerico() {
  // Seleccionar todos los inputs numéricos en la tabla
  const inputsNumericos = document.querySelectorAll('#tablaDeudas input[type="number"]');
  
  // Para cada input, añadir eventos para manejar el formato
  inputsNumericos.forEach(input => {
    // Al enfocar, eliminar ceros iniciales
    input.addEventListener('focus', function() {
      // Si el valor es solo cero, vaciar el campo
      if (this.value === '0' || this.value === 0) {
        this.value = '';
      }
      // Si tiene ceros al inicio, eliminarlos
      else if (this.value.startsWith('0') && this.value.length > 1 && !this.value.startsWith('0.')) {
        this.value = parseFloat(this.value).toString();
      }
    });
    
    // Al perder el foco, formatear correctamente
    input.addEventListener('blur', function() {
      // Si está vacío, no hacer nada (no poner cero)
      if (this.value === '') {
        return;
      }
      
      // Convertir a número y formatear
      const valor = parseFloat(this.value);
      if (!isNaN(valor)) {
        // Para campos de porcentaje, no usar decimales
        if (this.closest('td').cellIndex === 4) { // Columna de % Descuento
          this.value = Math.round(valor);
        } 
        // Para campos de importe, usar dos decimales
        else {
          this.value = valor.toString();
        }
      }
    });
  });
}

// Función para actualizar el script de Google Apps Script
function actualizarScriptGoogleSheets() {
  // Esta función contiene el código actualizado para el script de Google Apps Script
  // que incluye el guardado del número de cuotas
  
  const codigoActualizado = `
/**
 * Configuración global y variables
 */
const HOJA_CONTRATOS = "Contratos";
const HOJA_DETALLES = "DetallesContratos";
const HOJA_HISTORIAL = "Historial";
const HOJA_ENTIDADES = "Entidades";
const HOJA_TIPOS_PRODUCTO = "TiposProducto";

/**
 * doPost(e) recibe los datos en formato URL-encoded.
 * Cada campo que envies en el fetch, lo capturas en e.parameter.
 */
function doPost(e) {
  try {
    // Determinar la acción a realizar
    const accion = e.parameter.accion || "guardarContrato";
    
    switch (accion) {
      case "guardarContrato":
        return guardarContrato(e);
      case "guardarHistorial":
        return guardarHistorial(e);
      case "actualizarContrato":
        return actualizarContrato(e);
      case "obtenerDetallesContrato":
        return obtenerDetallesContrato(e);
      default:
        return ContentService.createTextOutput("ERROR: Acción no reconocida")
          .setMimeType(ContentService.MimeType.TEXT);
    }
  } catch (err) {
    // En caso de error
    return ContentService.createTextOutput("ERROR: " + err)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Guarda los datos principales del contrato
 */
function guardarContrato(e) {
  try {
    // Hoja destino para datos principales
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetContratos = ss.getSheetByName(HOJA_CONTRATOS);
    
    if (!sheetContratos) {
      // Crear la hoja si no existe
      ss.insertSheet(HOJA_CONTRATOS);
      const newSheet = ss.getSheetByName(HOJA_CONTRATOS);
      // Añadir encabezados
      newSheet.appendRow([
        "Timestamp", "Folio", "Fecha", "Nombre Deudor", "Número Deudas", 
        "Deuda Original", "Deuda Descontada", "Ahorro", "Total a Pagar", "Cuota Mensual", "Número Cuotas"
      ]);
    }
    
    // Extraer parámetros principales
    const folio = e.parameter.folio || "";
    const fecha = e.parameter.fecha || "";
    const nombreDeudor = e.parameter.nombreDeudor || "";
    const numeroDeudas = e.parameter.numeroDeudas || "";
    const deudaOriginal = e.parameter.deudaOriginal || "";
    const deudaDescontada = e.parameter.deudaDescontada || "";
    const ahorro = e.parameter.ahorro || "";
    const totalAPagar = e.parameter.totalAPagar || "";
    const cuotaMensual = e.parameter.cuotaMensual || "";
    const numCuotas = e.parameter.numCuotas || ""; // Añadido número de cuotas

    // Añadir la fila al final de la hoja de contratos
    sheetContratos.appendRow([
      new Date(),      // Marca de tiempo adicional
      folio,
      fecha,
      nombreDeudor,
      numeroDeudas,
      deudaOriginal,
      deudaDescontada,
      ahorro,
      totalAPagar,
      cuotaMensual,
      numCuotas        // Añadido número de cuotas
    ]);
    
    // Guardar detalles del contrato si existen
    if (e.parameter.detalles) {
      guardarDetallesContrato(folio, e.parameter.detalles);
    }

    // Respuesta de éxito
    return ContentService.createTextOutput("OK: Contrato guardado correctamente")
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    // En caso de error
    return ContentService.createTextOutput("ERROR: " + err)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Guarda los detalles de cada línea del contrato
 */
function guardarDetallesContrato(folio, detallesJson) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetDetalles = ss.getSheetByName(HOJA_DETALLES);
    
    if (!sheetDetalles) {
      // Crear la hoja si no existe
      ss.insertSheet(HOJA_DETALLES);
      const newSheet = ss.getSheetByName(HOJA_DETALLES);
      // Añadir encabezados
      newSheet.appendRow([
        "Timestamp", "Folio", "Número Contrato", "Tipo Producto", "Entidad",
        "Deuda Original", "Porcentaje Descuento", "Deuda Con Descuento"
      ]);
    }
    
    // Parsear los detalles JSON
    const detalles = JSON.parse(detallesJson);
    
    // Guardar cada detalle como una fila
    detalles.forEach(detalle => {
      sheetDetalles.appendRow([
        new Date(),
        folio,
        detalle.numeroContrato || "",
        detalle.tipoProducto || "",
        detalle.entidad || "",
        detalle.deudaOriginal || 0,
        detalle.porcentajeDescuento || 0,
        detalle.deudaConDescuento || 0
      ]);
    });
    
    return true;
  } catch (err) {
    Logger.log("Error al guardar detalles: " + err);
    return false;
  }
}

/**
 * Guarda los datos en la hoja de historial
 */
function guardarHistorial(e) {
  try {
    // Hoja destino para historial
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetHistorial = ss.getSheetByName(HOJA_HISTORIAL);
    
    if (!sheetHistorial) {
      // Crear la hoja si no existe
      ss.insertSheet(HOJA_HISTORIAL);
      const newSheet = ss.getSheetByName(HOJA_HISTORIAL);
      // Añadir encabezados
      newSheet.appendRow([
        "Timestamp", "Folio", "Fecha", "Nombre Deudor", "Número Deudas", 
        "Deuda Original", "Deuda Descontada", "Ahorro", "Total a Pagar", "Número Cuotas"
      ]);
    }
    
    // Extraer parámetros
    const folio = e.parameter.folio || "";
    const fecha = e.parameter.fecha || "";
    const nombreDeudor = e.parameter.nombreDeudor || "";
    const numeroDeudas = e.parameter.numeroDeudas || "";
    const deudaOriginal = e.parameter.deudaOriginal || "";
    const deudaDescontada = e.parameter.deudaDescontada || "";
    const ahorro = e.parameter.ahorro || "";
    const totalAPagar = e.parameter.totalAPagar || "";
    const numCuotas = e.parameter.numCuotas || ""; // Añadido número de cuotas

    // Añadir la fila al final
    sheetHistorial.appendRow([
      new Date(),      // Marca de tiempo adicional
      folio,
      fecha,
      nombreDeudor,
      numeroDeudas,
      deudaOriginal,
      deudaDescontada,
      ahorro,
      totalAPagar,
      numCuotas        // Añadido número de cuotas
    ]);

    // Respuesta de éxito
    return ContentService.createTextOutput("OK: Historial guardado correctamente")
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    // En caso de error
    return ContentService.createTextOutput("ERROR: " + err)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Actualiza un contrato existente
 */
function actualizarContrato(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetContratos = ss.getSheetByName(HOJA_CONTRATOS);
    
    if (!sheetContratos) {
      return ContentService.createTextOutput("ERROR: No existe la hoja de contratos")
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    // Extraer parámetros
    const folio = e.parameter.folio || "";
    const fecha = e.parameter.fecha || "";
    const nombreDeudor = e.parameter.nombreDeudor || "";
    const numeroDeudas = e.parameter.numeroDeudas || "";
    const deudaOriginal = e.parameter.deudaOriginal || "";
    const deudaDescontada = e.parameter.deudaDescontada || "";
    const ahorro = e.parameter.ahorro || "";
    const totalAPagar = e.parameter.totalAPagar || "";
    const cuotaMensual = e.parameter.cuotaMensual || "";
    const numCuotas = e.parameter.numCuotas || ""; // Añadido número de cuotas
    
    // Buscar el contrato por folio
    const datos = sheetContratos.getDataRange().getValues();
    let filaEncontrada = -1;
    
    for (let i = 0; i < datos.length; i++) {
      if (datos[i][1] === folio) {  // La columna 1 (índice 0-based) contiene el folio
        filaEncontrada = i + 1;  // +1 porque las filas en Sheets son 1-based
        break;
      }
    }
    
    if (filaEncontrada === -1) {
      // Si no se encuentra, crear un nuevo contrato
      return guardarContrato(e);
    }
    
    // Actualizar los datos del contrato
    sheetContratos.getRange(filaEncontrada, 3).setValue(fecha);  // Columna C
    sheetContratos.getRange(filaEncontrada, 4).setValue(nombreDeudor);  // Columna D
    sheetContratos.getRange(filaEncontrada, 5).setValue(numeroDeudas);  // Columna E
    sheetContratos.getRange(filaEncontrada, 6).setValue(deudaOriginal);  // Columna F
    sheetContratos.getRange(filaEncontrada, 7).setValue(deudaDescontada);  // Columna G
    sheetContratos.getRange(filaEncontrada, 8).setValue(ahorro);  // Columna H
    sheetContratos.getRange(filaEncontrada, 9).setValue(totalAPagar);  // Columna I
    sheetContratos.getRange(filaEncontrada, 10).setValue(cuotaMensual);  // Columna J
    sheetContratos.getRange(filaEncontrada, 11).setValue(numCuotas);  // Columna K - Número de cuotas
    
    // Actualizar detalles del contrato
    if (e.parameter.detalles) {
      // Eliminar detalles anteriores
      eliminarDetallesContrato(folio);
      // Guardar nuevos detalles
      guardarDetallesContrato(folio, e.parameter.detalles);
    }
    
    return ContentService.createTextOutput("OK: Contrato actualizado correctamente")
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Elimina los detalles de un contrato para actualizarlos
 */
function eliminarDetallesContrato(folio) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetDetalles = ss.getSheetByName(HOJA_DETALLES);
    
    if (!sheetDetalles) return false;
    
    const datos = sheetDetalles.getDataRange().getValues();
    const filasAEliminar = [];
    
    // Identificar filas a eliminar (de abajo hacia arriba para no afectar índices)
    for (let i = datos.length - 1; i >= 0; i--) {
      if (datos[i][1] === folio) {  // La columna B (índice 1) contiene el folio
        filasAEliminar.push(i + 1);  // +1 porque las filas en Sheets son 1-based
      }
    }
    
    // Eliminar filas de abajo hacia arriba
    filasAEliminar.forEach(fila => {
      sheetDetalles.deleteRow(fila);
    });
    
    return true;
  } catch (err) {
    Logger.log("Error al eliminar detalles: " + err);
    return false;
  }
}

/**
 * Obtiene los detalles de un contrato específico
 */
function obtenerDetallesContrato(e) {
  try {
    const folio = e.parameter.folio || "";
    
    if (!folio) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Folio no proporcionado" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetDetalles = ss.getSheetByName(HOJA_DETALLES);
    
    if (!sheetDetalles) {
      return ContentService.createTextOutput(JSON.stringify({ error: "No existe la hoja de detalles" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const datos = sheetDetalles.getDataRange().getValues();
    const detalles = [];
    
    // Buscar todos los detalles que coincidan con el folio
    for (let i = 1; i < datos.length; i++) {  // Empezar desde 1 para omitir encabezados
      if (datos[i][1] === folio) {  // La columna B (índice 1) contiene el folio
        detalles.push({
          numeroContrato: datos[i][2],
          tipoProducto: datos[i][3],
          entidad: datos[i][4],
          deudaOriginal: datos[i][5],
          porcentajeDescuento: datos[i][6],
          deudaConDescuento: datos[i][7]
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ detalles: detalles }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet(e) para obtener datos de entidades y tipos de producto
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Obtener entidades desde la hoja "Entidades"
    const sheetEnt = ss.getSheetByName(HOJA_ENTIDADES);
    if (!sheetEnt) {
      return ContentService.createTextOutput(JSON.stringify({ error: "No existe la hoja de entidades" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const lastRowEnt = sheetEnt.getLastRow();
    const dataEnt = sheetEnt.getRange(1, 1, lastRowEnt, 1).getValues();
    const entidades = dataEnt.map(row => row[0]);

    // Obtener tipos de producto desde la hoja "TiposProducto"
    const sheetTipo = ss.getSheetByName(HOJA_TIPOS_PRODUCTO);
    if (!sheetTipo) {
      return ContentService.createTextOutput(JSON.stringify({ error: "No existe la hoja de tipos de producto" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const lastRowTipo = sheetTipo.getLastRow();
    const dataTipo = sheetTipo.getRange(1, 1, lastRowTipo, 1).getValues();
    const tiposProducto = dataTipo.map(row => row[0]);

    const result = { entidades, tiposProducto };
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
  catch(err){
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
  `;
  
  // Mostrar el código actualizado (en una aplicación real, esto podría guardarse en un archivo)
  console.log("Código actualizado para Google Apps Script:", codigoActualizado);
  
  return codigoActualizado;
}

// Función para actualizar el módulo de Google Sheets en el JavaScript principal
function actualizarGoogleSheetsModule() {
  // Esta función contiene el código actualizado para el módulo GoogleSheetsModule
  // que incluye el guardado del número de cuotas
  
  const codigoActualizado = `
// Función para guardar datos de contrato en Google Sheets
function guardarContrato(datosContrato) {
  return new Promise((resolve, reject) => {
    const formData = new URLSearchParams();
    
    // Datos principales del contrato
    formData.append("accion", "guardarContrato");
    formData.append("folio", datosContrato.folio);
    formData.append("fecha", datosContrato.fecha);
    formData.append("nombreDeudor", datosContrato.nombreDeudor);
    formData.append("numeroDeudas", datosContrato.numeroDeudas);
    formData.append("deudaOriginal", datosContrato.deudaOriginal);
    formData.append("deudaDescontada", datosContrato.deudaDescontada);
    formData.append("ahorro", datosContrato.ahorro);
    formData.append("totalAPagar", datosContrato.totalAPagar);
    formData.append("cuotaMensual", datosContrato.cuotaMensual);
    formData.append("numCuotas", datosContrato.numCuotas); // Añadido número de cuotas
    
    // Detalles de cada línea de contrato
    if (datosContrato.detalles && datosContrato.detalles.length > 0) {
      formData.append("detalles", JSON.stringify(datosContrato.detalles));
    }
    
    fetch(GOOGLE_SHEET_ENDPOINT, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    })
    .then(response => response.text())
    .then(data => {
      if (data.includes("OK")) {
        resolve(data);
      } else {
        reject(data);
      }
    })
    .catch(error => {
      reject(error);
    });
  });
}

// Función para guardar historial en Google Sheets
function guardarHistorial(datosHistorial) {
  return new Promise((resolve, reject) => {
    const formData = new URLSearchParams();
    
    formData.append("accion", "guardarHistorial");
    formData.append("folio", datosHistorial.folio);
    formData.append("fecha", datosHistorial.fecha);
    formData.append("nombreDeudor", datosHistorial.nombreDeudor);
    formData.append("numeroDeudas", datosHistorial.numeroDeudas);
    formData.append("deudaOriginal", datosHistorial.deudaOriginal);
    formData.append("deudaDescontada", datosHistorial.deudaDescontada);
    formData.append("ahorro", datosHistorial.ahorro);
    formData.append("totalAPagar", datosHistorial.totalAPagar);
    formData.append("numCuotas", datosHistorial.numCuotas); // Añadido número de cuotas
    
    fetch(GOOGLE_SHEET_ENDPOINT, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    })
    .then(response => response.text())
    .then(data => {
      if (data.includes("OK")) {
        resolve(data);
      } else {
        reject(data);
      }
    })
    .catch(error => {
      reject(error);
    });
  });
}

// Función para actualizar un contrato existente
function actualizarContrato(datosContrato) {
  return new Promise((resolve, reject) => {
    const formData = new URLSearchParams();
    
    // Datos principales del contrato
    formData.append("accion", "actualizarContrato");
    formData.append("folio", datosContrato.folio);
    formData.append("fecha", datosContrato.fecha);
    formData.append("nombreDeudor", datosContrato.nombreDeudor);
    formData.append("numeroDeudas", datosContrato.numeroDeudas);
    formData.append("deudaOriginal", datosContrato.deudaOriginal);
    formData.append("deudaDescontada", datosContrato.deudaDescontada);
    formData.append("ahorro", datosContrato.ahorro);
    formData.append("totalAPagar", datosContrato.totalAPagar);
    formData.append("cuotaMensual", datosContrato.cuotaMensual);
    formData.append("numCuotas", datosContrato.numCuotas); // Añadido número de cuotas
    
    // Detalles de cada línea de contrato
    if (datosContrato.detalles && datosContrato.detalles.length > 0) {
      formData.append("detalles", JSON.stringify(datosContrato.detalles));
    }
    
    fetch(GOOGLE_SHEET_ENDPOINT, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    })
    .then(response => response.text())
    .then(data => {
      if (data.includes("OK")) {
        resolve(data);
      } else {
        reject(data);
      }
    })
    .catch(error => {
      reject(error);
    });
  });
}
  `;
  
  // Mostrar el código actualizado (en una aplicación real, esto podría guardarse en un archivo)
  console.log("Código actualizado para GoogleSheetsModule:", codigoActualizado);
  
  return codigoActualizado;
}

// Función para actualizar la función recopilarDatosContrato en SimuladorModule
function actualizarRecopilarDatosContrato() {
  // Esta función contiene el código actualizado para la función recopilarDatosContrato
  // que incluye el número de cuotas
  
  const codigoActualizado = `
// Función para recopilar todos los datos del contrato actual
function recopilarDatosContrato() {
  const filas = Array.from(document.querySelectorAll("#tablaDeudas tr"));
  const nombreDeudor = inputNombreDeudor.value.trim() || "Sin nombre";
  const nCuotas = parseInt(inputNumCuotas.value) || 1;
  
  let sumaOriginal = 0;
  let sumaDescontada = 0;
  let numeroDeudas = filas.length;
  let detalles = [];
  
  filas.forEach((fila) => {
    const inputContrato = fila.querySelector("td:nth-child(1) input");
    const selectTipo = fila.querySelector("td:nth-child(2) select");
    const selectEntidad = fila.querySelector("td:nth-child(3) select");
    const inputDeudaOrig = fila.querySelector("td:nth-child(4) input");
    const inputDesc = fila.querySelector("td:nth-child(5) input");
    const spanDeudaDesc = fila.querySelector("td:nth-child(6) span");
    
    const deudaOriginal = parseFloat(inputDeudaOrig.value) || 0;
    const descuento = parseFloat(inputDesc.value) || 0;
    const deudaConDesc = parseFloat(spanDeudaDesc.textContent) || 0;
    
    sumaOriginal += deudaOriginal;
    sumaDescontada += deudaConDesc;
    
    detalles.push({
      numeroContrato: inputContrato.value,
      tipoProducto: selectTipo.value,
      entidad: selectEntidad.value,
      deudaOriginal,
      porcentajeDescuento: descuento,
      deudaConDescuento: deudaConDesc
    });
  });
  
  const { ahorro, totalAPagar, cuotaMensual } = calcularDeuda(sumaOriginal, sumaDescontada, nCuotas);
  
  // Fecha actual
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const anio = hoy.getFullYear();
  const fechaFormateada = \`\${dia}/\${mes}/\${anio}\`;
  
  // Folio - usar el existente en modo edición o generar uno nuevo
  const folio = modoEdicion ? folioEdicion : (planFolio?.textContent || generarNuevoFolio());
  
  return {
    folio,
    fecha: fechaFormateada,
    nombreDeudor,
    numeroDeudas,
    deudaOriginal: sumaOriginal,
    deudaDescontada: sumaDescontada,
    ahorro,
    totalAPagar,
    numCuotas: nCuotas,
    cuotaMensual,
    detalles
  };
}
  `;
  
  // Mostrar el código actualizado (en una aplicación real, esto podría guardarse en un archivo)
  console.log("Código actualizado para recopilarDatosContrato:", codigoActualizado);
  
  return codigoActualizado;
}

// Exportar las funciones para su uso
export {
  descargarPlanMejorado,
  corregirFormatoNumerico,
  actualizarScriptGoogleSheets,
  actualizarGoogleSheetsModule,
  actualizarRecopilarDatosContrato
};
