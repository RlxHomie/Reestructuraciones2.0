// utils.js (módulo de utilidades)
//////////////////////////////////////////

// Función de debounce
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Notificaciones
function mostrarNotificacion(mensaje, tipo = "info") {
  const notif = document.createElement("div");
  notif.className = `notificacion ${tipo}`;
  notif.textContent = mensaje;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.classList.add("fadeOut");
    setTimeout(() => notif.remove(), 500);
  }, 3000);
}

// Confirmar acciones críticas (centralizado para no duplicar)
function confirmarAccion(mensaje, accionSi) {
  if (confirm(mensaje)) {
    accionSi();
  }
}

// Validación robusta de inputs numéricos
// Retorna true si es válido, false si no.
function validarInputNumerico(input, min = 0, max = Infinity) {
  const valor = parseFloat(input.value);
  if (isNaN(valor) || valor < min || valor > max) {
    input.classList.add("error");
    mostrarNotificacion(`Valor inválido (entre ${min} y ${max})`, "error");
    input.value = input.defaultValue || min;
    setTimeout(() => input.classList.remove("error"), 1200);
    return false;
  }
  return true;
}


//////////////////////////////////////////
// GoogleSheetsModule
//////////////////////////////////////////

const GoogleSheetsModule = (function() {
  // URL del script de Google Apps Script
  const GOOGLE_SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbxLEVjy-I3.../exec";
  
  // Variables para almacenar datos cargados
  let entidades = [];
  let tiposProducto = [];
  let datosEntidadesCargados = false;
  
  // Función para cargar entidades y tipos de producto desde Google Sheets
  function cargarEntidadesYTipos() {
    return new Promise((resolve, reject) => {
      mostrarNotificacion("Cargando datos desde Google Sheets...", "info");
      
      fetch(GOOGLE_SHEET_ENDPOINT)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            mostrarNotificacion("Error al cargar datos: " + data.error, "error");
            reject(data.error);
            return;
          }
          
          // Guardar datos en variables del módulo
          entidades = data.entidades || [];
          tiposProducto = data.tiposProducto || [];
          datosEntidadesCargados = true;
          
          mostrarNotificacion("Datos cargados correctamente", "success");
          resolve({ entidades, tiposProducto });
        })
        .catch(error => {
          mostrarNotificacion("Error de conexión al cargar datos", "error");
          console.error("Error al cargar entidades y tipos:", error);
          reject(error);
        });
    });
  }
  
  // Función para obtener entidades (carga si no están disponibles)
  function obtenerEntidades() {
    if (datosEntidadesCargados) {
      return Promise.resolve(entidades);
    } else {
      return cargarEntidadesYTipos().then(data => data.entidades);
    }
  }
  
  // Función para obtener tipos de producto (carga si no están disponibles)
  function obtenerTiposProducto() {
    if (datosEntidadesCargados) {
      return Promise.resolve(tiposProducto);
    } else {
      return cargarEntidadesYTipos().then(data => data.tiposProducto);
    }
  }
  
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
  
  // Función para obtener detalles de un contrato específico
  function obtenerDetallesContrato(folio) {
    return new Promise((resolve, reject) => {
      const formData = new URLSearchParams();
      
      formData.append("accion", "obtenerDetallesContrato");
      formData.append("folio", folio);
      
      fetch(GOOGLE_SHEET_ENDPOINT, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
      })
      .then(response => response.json())
      .then(data => {
        if (data && data.detalles) {
          resolve(data.detalles);
        } else {
          reject("No se encontraron detalles para este contrato");
        }
      })
      .catch(error => {
        reject(error);
      });
    });
  }
  
  return {
    cargarEntidadesYTipos,
    obtenerEntidades,
    obtenerTiposProducto,
    guardarContrato,
    guardarHistorial,
    actualizarContrato,
    obtenerDetallesContrato
  };
})();


//////////////////////////////////////////
// TablaDeudasModule
//////////////////////////////////////////

// Encargado de crear filas, validarlas y recalcular valores individuales

const TablaDeudasModule = (function() {

  const tablaDeudasBody = document.getElementById("tablaDeudas");

  function init() {
    // Iniciar con 1 fila
    agregarFila();
    // Escuchar cambios de input en la tabla
    if (tablaDeudasBody) {
      tablaDeudasBody.addEventListener(
        "input",
        debounce((event) => {
          if (event.target.tagName === "INPUT") {
            const fila = event.target.closest("tr");
            recalcularFila(fila);
          }
        }, 300)
      );
    }
  }

  function agregarFila() {
    if (!tablaDeudasBody) return;

    const fila = document.createElement("tr");

    // 1) N° contrato
    const tdContrato = document.createElement("td");
    const inputContrato = document.createElement("input");
    inputContrato.type = "text";
    inputContrato.placeholder = "Ej: 12345";
    tdContrato.appendChild(inputContrato);

    // 2) Tipo producto (select)
    const tdTipo = document.createElement("td");
    const selectTipo = document.createElement("select");
    selectTipo.innerHTML = '<option value="">Cargando tipos...</option>';
    
    // Cargar tipos de producto desde Google Sheets
    GoogleSheetsModule.obtenerTiposProducto()
      .then(tipos => {
        selectTipo.innerHTML = '';
        tipos.forEach(tipo => {
          const option = document.createElement("option");
          option.value = tipo;
          option.textContent = tipo;
          selectTipo.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Error al cargar tipos de producto:", error);
        selectTipo.innerHTML = '<option value="">Error al cargar</option>';
      });
    
    tdTipo.appendChild(selectTipo);

    // 3) Entidad (select)
    const tdEntidad = document.createElement("td");
    const selectEntidad = document.createElement("select");
    selectEntidad.innerHTML = '<option value="">Cargando entidades...</option>';
    
    // Cargar entidades desde Google Sheets
    GoogleSheetsModule.obtenerEntidades()
      .then(entidades => {
        selectEntidad.innerHTML = '';
        entidades.forEach(ent => {
          const option = document.createElement("option");
          option.value = ent;
          option.textContent = (ent.length > 45)
            ? ent.substring(0, 42) + "..."
            : ent;
          option.title = ent;
          selectEntidad.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Error al cargar entidades:", error);
        selectEntidad.innerHTML = '<option value="">Error al cargar</option>';
      });
    
    tdEntidad.appendChild(selectEntidad);

    // 4) Importe Deuda
    const tdDeudaOrig = document.createElement("td");
    const inputDeudaOrig = document.createElement("input");
    inputDeudaOrig.type = "number";
    inputDeudaOrig.placeholder = "3000";
    tdDeudaOrig.appendChild(inputDeudaOrig);

    // 5) % Descuento
    const tdDescuento = document.createElement("td");
    const inputDesc = document.createElement("input");
    inputDesc.type = "number";
    inputDesc.placeholder = "30";
    tdDescuento.appendChild(inputDesc);

    // 6) Importe con Descuento
    const tdDeudaDesc = document.createElement("td");
    const spanDeudaDesc = document.createElement("span");
    spanDeudaDesc.textContent = "0.00";
    tdDeudaDesc.appendChild(spanDeudaDesc);

    // 7) Botón eliminar
    const tdEliminar = document.createElement("td");
    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn-borrar";
    btnEliminar.innerHTML = "🗑";
    btnEliminar.addEventListener("click", () => {
      confirmarAccion("¿Eliminar esta fila de deuda?", () => {
        tablaDeudasBody.removeChild(fila);
        SimuladorModule.calcular();
      });
    });
    tdEliminar.appendChild(btnEliminar);

    // Agregar celdas
    fila.appendChild(tdContrato);
    fila.appendChild(tdTipo);
    fila.appendChild(tdEntidad);
    fila.appendChild(tdDeudaOrig);
    fila.appendChild(tdDescuento);
    fila.appendChild(tdDeudaDesc);
    fila.appendChild(tdEliminar);

    tablaDeudasBody.appendChild(fila);
  }

  function recalcularFila(fila) {
    if (!fila) return;

    const inputDeudaOriginal = fila.querySelector("td:nth-child(4) input");
    const inputDescuento = fila.querySelector("td:nth-child(5) input");
    const spanDeudaDesc = fila.querySelector("td:nth-child(6) span");

    // Validar
    if (!validarInputNumerico(inputDeudaOriginal, 0)) {
      return;
    }
    if (!validarInputNumerico(inputDescuento, 0, 100)) {
      return;
    }

    const deudaOriginal = parseFloat(inputDeudaOriginal.value) || 0;
    const descuento = parseFloat(inputDescuento.value) || 0;
    const deudaConDesc = deudaOriginal * (1 - descuento / 100);
    spanDeudaDesc.textContent = deudaConDesc.toFixed(2);
  }

  // Función para cargar datos de contrato en la tabla
  function cargarDatosContrato(datosContrato) {
    if (!tablaDeudasBody || !datosContrato || !datosContrato.detalles || !datosContrato.detalles.length) return;
    
    // Limpiar tabla actual
    tablaDeudasBody.innerHTML = "";
    
    // Cargar cada fila de datos
    datosContrato.detalles.forEach(detalle => {
      const fila = document.createElement("tr");
      
      // 1) N° contrato
      const tdContrato = document.createElement("td");
      const inputContrato = document.createElement("input");
      inputContrato.type = "text";
      inputContrato.value = detalle.numeroContrato || "";
      inputContrato.placeholder = "Ej: 12345";
      tdContrato.appendChild(inputContrato);
      
      // 2) Tipo producto (select)
      const tdTipo = document.createElement("td");
      const selectTipo = document.createElement("select");
      selectTipo.innerHTML = '<option value="">Cargando tipos...</option>';
      
      // Cargar tipos de producto y seleccionar el correcto
      GoogleSheetsModule.obtenerTiposProducto()
        .then(tipos => {
          selectTipo.innerHTML = '';
          tipos.forEach(tipo => {
            const option = document.createElement("option");
            option.value = tipo;
            option.textContent = tipo;
            if (tipo === detalle.tipoProducto) {
              option.selected = true;
            }
            selectTipo.appendChild(option);
          });
        });
      
      tdTipo.appendChild(selectTipo);
      
      // 3) Entidad (select)
      const tdEntidad = document.createElement("td");
      const selectEntidad = document.createElement("select");
      selectEntidad.innerHTML = '<option value="">Cargando entidades...</option>';
      
      // Cargar entidades y seleccionar la correcta
      GoogleSheetsModule.obtenerEntidades()
        .then(entidades => {
          selectEntidad.innerHTML = '';
          entidades.forEach(ent => {
            const option = document.createElement("option");
            option.value = ent;
            option.textContent = (ent.length > 45) ? ent.substring(0, 42) + "..." : ent;
            option.title = ent;
            if (ent === detalle.entidad) {
              option.selected = true;
            }
            selectEntidad.appendChild(option);
          });
        });
      
      tdEntidad.appendChild(selectEntidad);
      
      // 4) Importe Deuda
      const tdDeudaOrig = document.createElement("td");
      const inputDeudaOrig = document.createElement("input");
      inputDeudaOrig.type = "number";
      inputDeudaOrig.value = detalle.deudaOriginal || "";
      inputDeudaOrig.placeholder = "3000";
      tdDeudaOrig.appendChild(inputDeudaOrig);
      
      // 5) % Descuento
      const tdDescuento = document.createElement("td");
      const inputDesc = document.createElement("input");
      inputDesc.type = "number";
      inputDesc.value = detalle.porcentajeDescuento || "";
      inputDesc.placeholder = "30";
      tdDescuento.appendChild(inputDesc);
      
      // 6) Importe con Descuento
      const tdDeudaDesc = document.createElement("td");
      const spanDeudaDesc = document.createElement("span");
      spanDeudaDesc.textContent = detalle.deudaConDescuento ? detalle.deudaConDescuento.toFixed(2) : "0.00";
      tdDeudaDesc.appendChild(spanDeudaDesc);
      
      // 7) Botón eliminar
      const tdEliminar = document.createElement("td");
      const btnEliminar = document.createElement("button");
      btnEliminar.className = "btn-borrar";
      btnEliminar.innerHTML = "🗑";
      btnEliminar.addEventListener("click", () => {
        confirmarAccion("¿Eliminar esta fila de deuda?", () => {
          tablaDeudasBody.removeChild(fila);
          SimuladorModule.calcular();
        });
      });
      tdEliminar.appendChild(btnEliminar);
      
      // Agregar celdas
      fila.appendChild(tdContrato);
      fila.appendChild(tdTipo);
      fila.appendChild(tdEntidad);
      fila.appendChild(tdDeudaOrig);
      fila.appendChild(tdDescuento);
      fila.appendChild(tdDeudaDesc);
      fila.appendChild(tdEliminar);
      
      tablaDeudasBody.appendChild(fila);
    });
    
    // Actualizar otros campos del formulario
    if (datosContrato.nombreDeudor) {
      document.getElementById("nombreDeudor").value = datosContrato.nombreDeudor;
    }
    
    if (datosContrato.numCuotas) {
      document.getElementById("numCuotas").value = datosContrato.numCuotas;
    }
  }

  return {
    init,
    agregarFila,
    recalcularFila,
    cargarDatosContrato
  };
})();

//////////////////////////////////////////
// HistorialModule
//////////////////////////////////////////

const HistorialModule = (function() {
  const historialContainer = document.getElementById("historialContainer");
  const historialBody = document.getElementById("historialBody");

  function guardarSimulacion(simulacion) {
    let historial = JSON.parse(localStorage.getItem("historialSimulaciones")) || [];
    historial.push(simulacion);
    localStorage.setItem("historialSimulaciones", JSON.stringify(historial));
  }

  function cargarHistorial() {
    return JSON.parse(localStorage.getItem("historialSimulaciones")) || [];
  }

  function mostrarHistorial() {
    if (!historialBody) return;
    historialBody.innerHTML = "";
    const historial = cargarHistorial();

    historial.forEach((sim) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${sim.folio}</td>
        <td>${sim.fecha}</td>
        <td>${sim.nombreDeudor}</td>
        <td>${sim.numeroDeudas}</td>
        <td>€${sim.deudaOriginal.toLocaleString('es-ES',{ minimumFractionDigits:2 })}</td>
        <td>€${sim.deudaDescontada.toLocaleString('es-ES',{ minimumFractionDigits:2 })}</td>
        <td>€${sim.ahorro.toLocaleString('es-ES',{ minimumFractionDigits:2 })}</td>
        <td>€${sim.totalAPagar.toLocaleString('es-ES',{ minimumFractionDigits:2 })}</td>
        <td>
          <button class="btn-eliminar-historial" data-folio="${sim.folio}">Eliminar</button>
          <button class="btn-editar-historial" data-folio="${sim.folio}">Editar</button>
        </td>
      `;
      historialBody.appendChild(tr);
    });

    historialContainer.style.display = "block";
  }

  function ocultarHistorial() {
    if (!historialContainer) return;
    historialContainer.style.display = "none";
  }

  function eliminarDelHistorial(folio) {
    let historial = cargarHistorial();
    historial = historial.filter((sim) => sim.folio !== folio);
    localStorage.setItem("historialSimulaciones", JSON.stringify(historial));
    mostrarHistorial();
  }

  function obtenerSimulacionPorFolio(folio) {
    const historial = cargarHistorial();
    return historial.find(sim => sim.folio === folio);
  }

  function init() {
    if (historialBody) {
      historialBody.addEventListener("click", (e) => {
        if (e.target.matches(".btn-eliminar-historial")) {
          confirmarAccion("¿Eliminar esta simulación del historial?", () => {
            const folio = e.target.getAttribute("data-folio");
            eliminarDelHistorial(folio);
          });
        } else if (e.target.matches(".btn-editar-historial")) {
          const folio = e.target.getAttribute("data-folio");
          const simulacion = obtenerSimulacionPorFolio(folio);
          
          if (simulacion) {
            // Obtener detalles del contrato desde Google Sheets
            GoogleSheetsModule.obtenerDetallesContrato(folio)
              .then(detalles => {
                // Combinar datos de simulación con detalles
                const datosCompletos = {
                  ...simulacion,
                  detalles: detalles
                };
                
                // Cargar datos en el formulario
                TablaDeudasModule.cargarDatosContrato(datosCompletos);
                
                // Mostrar botón de editar contrato
                const btnEditarContrato = document.getElementById("btnEditarContrato");
                if (btnEditarContrato) {
                  btnEditarContrato.setAttribute("data-folio", folio);
                  btnEditarContrato.style.display = "inline-block";
                }
                
                // Ocultar historial
                ocultarHistorial();
                
                // Calcular para actualizar vista
                SimuladorModule.calcular();
              })
              .catch(error => {
                mostrarNotificacion("Error al cargar detalles del contrato: " + error, "error");
              });
          }
        }
      });
    }
  }

  return {
    init,
    guardarSimulacion,
    mostrarHistorial,
    ocultarHistorial,
    obtenerSimulacionPorFolio
  };
})();

//////////////////////////////////////////
// SimuladorModule
//////////////////////////////////////////

const SimuladorModule = (function() {

  // Variables para el plan
  let ultimoContadorFolio = 0;
  let modoEdicion = false;
  let folioEdicion = null;

  // Referencias DOM
  const inputNombreDeudor = document.getElementById("nombreDeudor");
  const inputNumCuotas = document.getElementById("numCuotas");
  const resultadoFinalDiv = document.getElementById("resultadoFinal");
  const planContainerOuter = document.getElementById("planContainerOuter");

  const planNombreDeudor   = document.getElementById("plan-nombre-deudor");
  const planNumDeudas      = document.getElementById("plan-num-deudas");
  const planDeudaTotal     = document.getElementById("plan-deuda-total");
  const planLoQueDebes     = document.getElementById("plan-lo-que-debes");
  const planLoQuePagarias  = document.getElementById("plan-lo-que-pagarias");
  const planAhorro         = document.getElementById("plan-ahorro");
  const planCuotaMensual   = document.getElementById("plan-cuota-mensual");
  const planDescuentoTotal = document.getElementById("plan-descuento-total");
  const planDuracion       = document.getElementById("plan-duracion");
  const planFecha          = document.getElementById("plan-fecha");
  const planFolio          = document.getElementById("plan-folio");
  const planTablaBody      = document.getElementById("plan-tabla-body");

  let myChart = null;

  // Cálculo principal
  function calcularDeuda(sumaOriginal, sumaDescontada, nCuotas) {
    const ahorro = sumaOriginal - sumaDescontada;
    const comisionExito = 0.25 * ahorro;
    const comisionGestion = 0.10 * sumaOriginal;
    const totalAPagar = sumaDescontada + comisionExito + comisionGestion;
    const cuotaMensual = totalAPagar / nCuotas;
    return { ahorro, comisionExito, comisionGestion, totalAPagar, cuotaMensual };
  }

  function generarNuevoFolio() {
    let contador = parseInt(localStorage.getItem("contadorFolio")) || 0;
    contador++;
    ultimoContadorFolio = contador;
    localStorage.setItem("contadorFolio", contador);

    const hoy = new Date();
    const fecha = `${hoy.getFullYear()}${String(hoy.getMonth()+1).padStart(2,'0')}${String(hoy.getDate()).padStart(2,'0')}`;

    return `FOLIO-${fecha}-${contador.toString().padStart(4, '0')}`;
  }

  function calcular() {
    const filas = Array.from(document.querySelectorAll("#tablaDeudas tr"));
    const nombreDeudor = inputNombreDeudor.value.trim() || "Sin nombre";

    let sumaOriginal = 0;
    let sumaDescontada = 0;
    let sumaPorcentajes = 0;
    let numeroDeudas = 0;
    let filasData = [];

    filas.forEach((fila) => {
      numeroDeudas++;
      const inputContrato   = fila.querySelector("td:nth-child(1) input");
      const selectTipo      = fila.querySelector("td:nth-child(2) select");
      const selectEntidad   = fila.querySelector("td:nth-child(3) select");
      const inputDeudaOrig  = fila.querySelector("td:nth-child(4) input");
      const inputDesc       = fila.querySelector("td:nth-child(5) input");
      const spanDeudaDesc   = fila.querySelector("td:nth-child(6) span");

      const deudaOriginal = parseFloat(inputDeudaOrig.value) || 0;
      const descuento     = parseFloat(inputDesc.value) || 0;
      const deudaConDesc  = parseFloat(spanDeudaDesc.textContent) || 0;

      sumaOriginal   += deudaOriginal;
      sumaDescontada += deudaConDesc;
      sumaPorcentajes += descuento;

      filasData.push({
        numeroContrato: inputContrato.value,
        tipoProducto: selectTipo.value,
        entidad: selectEntidad.value,
        deudaOriginal,
        porcentajeDescuento: descuento,
        deudaConDescuento: deudaConDesc
      });
    });

    const nCuotas = parseInt(inputNumCuotas.value) || 1;
    const { ahorro, comisionExito, comisionGestion, totalAPagar, cuotaMensual } =
      calcularDeuda(sumaOriginal, sumaDescontada, nCuotas);

    const promedioDesc = (numeroDeudas > 0) ? (sumaPorcentajes / numeroDeudas) : 0;

    if (resultadoFinalDiv) {
      resultadoFinalDiv.style.display = "block";
      resultadoFinalDiv.innerHTML = `
        <h3>Resultados (Simulador)</h3>
        <p><strong>Nombre Deudor:</strong> ${nombreDeudor}</p>
        <p><strong>Número de Deudas:</strong> ${numeroDeudas}</p>
        <p><strong>Deuda Original:</strong> €${sumaOriginal.toLocaleString('es-ES', { minimumFractionDigits:2 })}</p>
        <p><strong>Deuda Descontada:</strong> €${sumaDescontada.toLocaleString('es-ES', { minimumFractionDigits:2 })}</p>
        <p><strong>Ahorro:</strong> €${ahorro.toLocaleString('es-ES', { minimumFractionDigits:2 })}</p>
        <p><strong>Promedio % Descuento:</strong> ${promedioDesc.toFixed(2)}%</p>
        <hr />
        <p><strong>Comisión de Éxito (25% Ahorro):</strong> €${comisionExito.toLocaleString('es-ES', { minimumFractionDigits:2 })}</p>
        <p><strong>Comisión de Gestión (10% Deuda Original):</strong> €${comisionGestion.toLocaleString('es-ES', { minimumFractionDigits:2 })}</p>
        <p id="resultadoPagar"><strong>Total a Pagar:</strong> €${totalAPagar.toLocaleString('es-ES', { minimumFractionDigits:2 })}</p>
        <p><strong>Cuotas:</strong> ${nCuotas}</p>
        <p><strong>Cuota Mensual:</strong> €${cuotaMensual.toLocaleString('es-ES', { minimumFractionDigits:2 })}</p>
      `;
    }

    if (planContainerOuter) {
      planContainerOuter.style.display = "block";
    }

    if (planNombreDeudor) planNombreDeudor.textContent = nombreDeudor;
    if (planNumDeudas) planNumDeudas.textContent = numeroDeudas;
    if (planDeudaTotal) planDeudaTotal.textContent = "€" + sumaOriginal.toLocaleString('es-ES', { minimumFractionDigits: 2 });
    if (planLoQueDebes) planLoQueDebes.textContent = "€" + sumaOriginal.toLocaleString('es-ES', { minimumFractionDigits: 2 });
    if (planLoQuePagarias) planLoQuePagarias.textContent = "€" + sumaDescontada.toLocaleString('es-ES', { minimumFractionDigits: 2 });
    if (planAhorro) planAhorro.textContent = "€" + ahorro.toLocaleString('es-ES', { minimumFractionDigits: 2 });
    if (planCuotaMensual) planCuotaMensual.textContent = "€" + cuotaMensual.toLocaleString('es-ES', { minimumFractionDigits: 2 });

    const descuentoPorc = (sumaOriginal > 0) ? (ahorro / sumaOriginal) * 100 : 0;
    if (planDescuentoTotal) planDescuentoTotal.textContent = descuentoPorc.toFixed(2) + "%";
    if (planDuracion) planDuracion.textContent = nCuotas + " meses";

    // Fecha
    const hoy = new Date();
    const dia  = String(hoy.getDate()).padStart(2, '0');
    const mes  = String(hoy.getMonth()+1).padStart(2,'0');
    const anio = hoy.getFullYear();
    if (planFecha) planFecha.textContent = `${dia}/${mes}/${anio}`;

    // Folio - Si estamos en modo edición, mantener el folio original
    const folioGenerado = modoEdicion ? folioEdicion : generarNuevoFolio();
    if (planFolio) planFolio.textContent = folioGenerado;

    if (planTablaBody) {
      planTablaBody.innerHTML = "";
      filasData.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.entidad}</td>
          <td>€${item.deudaOriginal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
          <td>€${item.deudaConDescuento.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
        `;
        planTablaBody.appendChild(row);
      });
    }

    // Crear/Actualizar gráfico (usando Chart.js)
    actualizarGrafico(ahorro, sumaDescontada);

    // Guardar en historial solo si no estamos en modo edición
    if (!modoEdicion) {
      HistorialModule.guardarSimulacion({
        folio: folioGenerado,
        fecha: `${dia}/${mes}/${anio}`,
        nombreDeudor,
        numeroDeudas,
        deudaOriginal: sumaOriginal,
        deudaDescontada: sumaDescontada,
        ahorro,
        totalAPagar,
        numCuotas: nCuotas,
        cuotaMensual
      });
    }
    
    // Actualizar estado de botones según modo
    const btnEditarContrato = document.getElementById("btnEditarContrato");
    if (btnEditarContrato) {
      btnEditarContrato.style.display = modoEdicion ? "inline-block" : "none";
    }
  }

  // Gráfico
  function actualizarGrafico(ahorro, sumaDescontada) {
    const ctx = document.getElementById("myChart")?.getContext("2d");
    if (!ctx) return;
    if (myChart) myChart.destroy();

    const data = {
      labels: ["Ahorro", "Pago"],
      datasets: [
        {
          data: [ahorro, sumaDescontada],
          backgroundColor: ["#34c759", "#007aff"]
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: {
          callbacks: {
            label(context) {
              let label = context.label || "";
              let value = context.parsed;
              return `${label}: €${value.toLocaleString('es-ES',{minimumFractionDigits:2})}`;
            }
          }
        }
      }
    };

    myChart = new Chart(ctx, {
      type: "doughnut",
      data,
      options
    });
  }

  // Re-analizar
  function reAnalizar() {
    const tablaBody = document.getElementById("tablaDeudas");
    if (tablaBody) {
      tablaBody.innerHTML = "";
    }
    if (resultadoFinalDiv) {
      resultadoFinalDiv.style.display = "none";
    }
    if (planContainerOuter) {
      planContainerOuter.style.display = "none";
    }

    if (inputNombreDeudor) inputNombreDeudor.value = "";
    if (inputNumCuotas) inputNumCuotas.value = "12";

    if (myChart) {
      myChart.destroy();
      myChart = null;
    }
    
    // Resetear modo edición
    modoEdicion = false;
    folioEdicion = null;
    
    // Ocultar botón de editar contrato
    const btnEditarContrato = document.getElementById("btnEditarContrato");
    if (btnEditarContrato) {
      btnEditarContrato.style.display = "none";
    }

    TablaDeudasModule.agregarFila();
  }

  function descargarPlan() {
    window.scrollTo(0, 0);
    const planDiv = document.getElementById("plan-de-liquidacion");
    if (!planDiv) return;

    const fechaFilename = (planFecha?.textContent || "").replaceAll("/", "-");
    const nombreDeudor = (planNombreDeudor?.textContent || "Simulacion").trim();
    const folioActual = planFolio?.textContent || "";

    // Configuración mejorada para la generación del PDF
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
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] }
    };

    // Mostrar notificación de inicio
    mostrarNotificacion("Generando PDF, por favor espere...", "info");

    // Usar una promesa para manejar la generación del PDF
    html2pdf().from(planDiv).set(opt).save()
      .then(() => {
        mostrarNotificacion("PDF generado correctamente", "success");
      })
      .catch(error => {
        console.error("Error al generar PDF:", error);
        mostrarNotificacion("Error al generar PDF. Intente nuevamente.", "error");
      });
  }

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
    const fechaFormateada = `${dia}/${mes}/${anio}`;
    
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

  // Función para contratar plan (guardar en Google Sheets)
  function contratarPlan() {
    mostrarNotificacion("Enviando datos...", "loading");
    
    const datosContrato = recopilarDatosContrato();
    
    // Guardar contrato en Google Sheets
    GoogleSheetsModule.guardarContrato(datosContrato)
      .then(() => {
        // Guardar historial en Google Sheets
        return GoogleSheetsModule.guardarHistorial(datosContrato);
      })
      .then(() => {
        mostrarNotificacion("¡Plan contratado y guardado correctamente!", "success");
      })
      .catch((error) => {
        console.error(error);
        mostrarNotificacion("Error al guardar el plan: " + error, "error");
      });
  }
  
  // Función para actualizar un contrato existente
  function actualizarContrato() {
    if (!modoEdicion || !folioEdicion) {
      mostrarNotificacion("No hay contrato para actualizar", "error");
      return;
    }
    
    mostrarNotificacion("Actualizando contrato...", "loading");
    
    const datosContrato = recopilarDatosContrato();
    
    // Actualizar contrato en Google Sheets
    GoogleSheetsModule.actualizarContrato(datosContrato)
      .then(() => {
        // Actualizar historial en Google Sheets
        return GoogleSheetsModule.guardarHistorial(datosContrato);
      })
      .then(() => {
        mostrarNotificacion("¡Contrato actualizado correctamente!", "success");
        
        // Salir del modo edición
        modoEdicion = false;
        folioEdicion = null;
        
        // Ocultar botón de editar
        const btnEditarContrato = document.getElementById("btnEditarContrato");
        if (btnEditarContrato) {
          btnEditarContrato.style.display = "none";
        }
      })
      .catch((error) => {
        console.error(error);
        mostrarNotificacion("Error al actualizar el contrato: " + error, "error");
      });
  }
  
  // Función para activar el modo edición
  function activarModoEdicion(folio) {
    modoEdicion = true;
    folioEdicion = folio;
  }

  return {
    calcular,
    reAnalizar,
    descargarPlan,
    contratarPlan,
    actualizarContrato,
    activarModoEdicion
  };
})();

//////////////////////////////////////////
// Main: Inicialización de todos los módulos
//////////////////////////////////////////

window.addEventListener("DOMContentLoaded", () => {
  // Cargar entidades y tipos de producto desde Google Sheets al inicio
  GoogleSheetsModule.cargarEntidadesYTipos()
    .then(() => {
      console.log("Datos iniciales cargados correctamente");
    })
    .catch(error => {
      console.error("Error al cargar datos iniciales:", error);
    });

  // Iniciar Tabla Deudas
  TablaDeudasModule.init();

  // Simulador Botones
  const btnCalcular = document.getElementById("btnCalcular");
  if (btnCalcular) {
    btnCalcular.addEventListener("click", () => {
      SimuladorModule.calcular();
    });
  }

  const btnReAnalizar = document.getElementById("btnReAnalizar");
  if (btnReAnalizar) {
    btnReAnalizar.addEventListener("click", () => {
      SimuladorModule.reAnalizar();
    });
  }

  const btnDescargarPlan = document.getElementById("btnDescargarPlan");
  if (btnDescargarPlan) {
    btnDescargarPlan.addEventListener("click", () => {
      SimuladorModule.descargarPlan();
    });
  }

  // Historial
  HistorialModule.init();
  const btnMostrarHistorial = document.getElementById("btnMostrarHistorial");
  if (btnMostrarHistorial) {
    btnMostrarHistorial.addEventListener("click", () => {
      HistorialModule.mostrarHistorial();
    });
  }

  const btnCerrarHistorial = document.getElementById("btnCerrarHistorial");
  if (btnCerrarHistorial) {
    btnCerrarHistorial.addEventListener("click", () => {
      HistorialModule.ocultarHistorial();
    });
  }

  // Contratar -> Google Sheets
  const btnContratar = document.getElementById("btnContratar");
  if (btnContratar) {
    btnContratar.addEventListener("click", () => {
      SimuladorModule.contratarPlan();
    });
  }
  
  // Editar Contrato
  const btnEditarContrato = document.getElementById("btnEditarContrato");
  if (btnEditarContrato) {
    btnEditarContrato.addEventListener("click", () => {
      const folio = btnEditarContrato.getAttribute("data-folio");
      if (folio) {
        SimuladorModule.activarModoEdicion(folio);
        SimuladorModule.actualizarContrato();
      }
    });
  }
  
  // Agregar fila
  const btnAgregarFila = document.getElementById("btnAgregarFila");
  if (btnAgregarFila) {
    btnAgregarFila.addEventListener("click", () => {
      TablaDeudasModule.agregarFila();
    });
  }
});
