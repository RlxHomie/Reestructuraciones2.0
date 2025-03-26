/**
 * Configuración global y variables
 */
const HOJA_CONTRATOS = "Contratos";
const HOJA_DETALLES = "DetallesContratos";
const HOJA_HISTORIAL = "Historial";

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
        "Deuda Original", "Deuda Descontada", "Ahorro", "Total a Pagar", "Cuota Mensual"
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
      cuotaMensual
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
        "Deuda Original", "Deuda Descontada", "Ahorro", "Total a Pagar"
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
      totalAPagar
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
  // Supongamos que tienes dos hojas: "Entidades" y "TiposProducto"
  // Cada una con una lista (col A) de cadenas
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    const sheetEnt = ss.getSheetByName("Entidades");
    const lastRowEnt = sheetEnt.getLastRow();
    const dataEnt = sheetEnt.getRange(1,1,lastRowEnt,1).getValues();
    const entidades = dataEnt.map(row => row[0]);

    const sheetTipo = ss.getSheetByName("TiposProducto");
    const lastRowTipo = sheetTipo.getLastRow();
    const dataTipo = sheetTipo.getRange(1,1,lastRowTipo,1).getValues();
    const tiposProducto = dataTipo.map(row => row[0]);

    const result = { entidades, tiposProducto };
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
  catch(err){
    return ContentService.createTextOutput("ERROR: "+err)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
