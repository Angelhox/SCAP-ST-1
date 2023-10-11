"use strict";

var _require = require("electron"),
    ipcRenderer = _require.ipcRenderer; // ----------------------------------------------------------------
// Varibles de las planillas
// ----------------------------------------------------------------


var planillaEmision = document.getElementById("planillaEmision");
var planillaCodigo = document.getElementById("planillaCodigo");
var planillaEstado = document.getElementById("planillaEstado");
var lecturaAnterior = document.getElementById("lecturaAnterior");
var lecturaActual = document.getElementById("lecturaActual");
var valorConsumo = document.getElementById("valorConsumo");
var tarifaConsumo = document.getElementById("tarifaConsumo");
var planillasList = document.getElementById("planillas"); // ----------------------------------------------------------------
// Variables del socio
// ----------------------------------------------------------------

var socioNombres = document.getElementById("socioNombres");
var socioCedula = document.getElementById("socioCedula"); // ----------------------------------------------------------------
// Variables del contrato/medidor
// ----------------------------------------------------------------

var contratoCodigo = document.getElementById("contratoCodigo"); // ----------------------------------------------------------------
// Variables de los servicios
// ----------------------------------------------------------------

var serviciosFijosList = document.getElementById("serviciosFijos");
var otrosServiciosList = document.getElementById("otrosServicios");
var otrosAplazablesList = document.getElementById("otrosAplazables");
var mesBusqueda = document.getElementById("mesBusqueda");
var anioBusqueda = document.getElementById("anioBusqueda");
var errortextAbono = document.getElementById("errorTextAbono");
var errContainer = document.getElementById("err-container"); // ----------------------------------------------------------------
// Variables del los totales de la planilla
// ----------------------------------------------------------------

var totalFinal = 0.0;
var totalConsumo = 0.0;
var tarifaAplicada = "Familiar";
var valorTarifa = 2.0;
var valorSubtotal = document.getElementById("valorSubtotal");
var valorTotalDescuento = document.getElementById("valorTotalDescuento");
var valorTotalPagar = document.getElementById("valorTotalPagar"); // Variables del dialogo de los servicios

var dialogServicios = document.getElementById("formServicios");
var servicioDg = document.getElementById("title-dg");
var descripcionDg = document.getElementById("descripcion-dg");
var detallesDg = document.getElementById("detalles-dg");
var subtotalDg = document.getElementById("subtotal-dg");
var descuentoDg = document.getElementById("descuento-dg");
var totalDg = document.getElementById("total-dg");
var numPagosDg = document.getElementById("numPagos-dg");
var canceladosDg = document.getElementById("cancelados-dg");
var pendientesDg = document.getElementById("pendientes-dg");
var saldoDg = document.getElementById("saldo-dg");
var abonadoDg = document.getElementById("abonado-dg");
var abonarDg = document.getElementById("abonar-dg");
var guardarDg = document.getElementById("btnGuardar-dg");
var administrarDg = document.getElementById("btnAdministrar-dg");
var abonarStatus = false;
var valorAbonoEdit = 0;
var planillas = [];
var datosServicios = [];
var serviciosFijos = [];
var otrosServicios = [];
var editingStatus = false;
var editPlanillaId = "";
var editDetalleId = "";
planillaForm.addEventListener("submit", function _callee(e) {
  var newPlanilla, newDetalleServicio, result, _result, resultDetalle;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          e.preventDefault();
          newPlanilla = {
            valor: valorConsumo.value,
            lecturaAnterior: lecturaAnterior.value,
            lecturaActual: lecturaActual.value,
            observacion: "NA",
            tarifa: tarifaAplicada,
            tarifaValor: valorTarifa
          };
          newDetalleServicio = {
            subtotal: valorConsumo.value,
            total: valorConsumo.value,
            saldo: valorConsumo.value,
            abono: 0.0
          };

          if (editingStatus) {
            _context.next = 10;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("createPlanilla"));

        case 6:
          result = _context.sent;
          console.log(result);
          _context.next = 20;
          break;

        case 10:
          console.log("Editing planilla with electron");
          _context.next = 13;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("updatePlanilla", editPlanillaId, newPlanilla));

        case 13:
          _result = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("updateDetalle", editDetalleId, newDetalleServicio));

        case 16:
          resultDetalle = _context.sent;
          editingStatus = false;
          editPlanillaId = "";
          console.log(_result, resultDetalle);

        case 20:
          getPlanillas();
          planillaForm.reset(); //medidorCodigo.focus();

        case 22:
        case "end":
          return _context.stop();
      }
    }
  });
}); // function renderPlanillas(datosPlanillas) {
//   planillasList.innerHTML = "";
//   datosPlanillas.forEach((datosPlanilla) => {
//     planillasList.innerHTML += `
//        <tr>
//        <td>${datosPlanilla.codigoPlanilla}</td>
//        <td>${datosPlanilla.codigoMedidor}</td>
//        <td>${datosPlanilla.nombre + " " + datosPlanilla.apellido}</td>
//        <td>${datosPlanilla.cedula}</td>
//        <td>${formatearFecha(datosPlanilla.fecha)}</td>
//        <td>${datosPlanilla.valor}</td>
//        <td>${datosPlanilla.estado}</td>
//        <td>${datosPlanilla.lecturaAnterior}</td>
//        <td>${datosPlanilla.lecturaActual}</td>
//       <td>
//       <button onclick="deleteMedidor('${datosPlanilla.id}')" class="btn ">
//       <i class="fa-solid fa-user-minus"></i>
//       </button>
//       </td>
//       <td>
//       <button onclick="editPlanilla('${datosPlanilla.id}')" class="btn ">
//       <i class="fa-solid fa-user-pen"></i>
//       </button>
//       </td>
//    </tr>
//       `;
//   });
// }

function renderPlanillas(datosPlanillas) {
  planillasList.innerHTML = "";
  datosPlanillas.forEach(function _callee2(datosPlanilla) {
    var cardDiv, headerDiv, contratoDiv, contratoP, contratoValor, canceladoDiv, canceladoP, canceladoValor, bodyDiv, socioDiv, socioH5, socioP, fechaEmisionDiv, fechaEmisionP, fechaEmisionSp, fechaEmisionValor, serviciosDiv, serviciosP, serviciosTituloP, listaServiciosDiv, listaUl, valorAguaPotable, totalPagar, consumoDiv, consumoP, tarifaDiv, tarifaP, valorDiv, valorP, consumoValor, tarifaValor, valorValor, _consumoValor, _tarifaValor, _valorValor, footerDiv, totalDiv, totalP, totalValor, button, buttonIcon;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Crear el elemento div principal con las clases y el estilo
            cardDiv = document.createElement("div");
            cardDiv.className = "col-6 mx-1 card mb-3 border-info card-planilla";
            cardDiv.style.maxWidth = "48%"; // Crear el elemento div para el encabezado de la tarjeta con la clase y el estilo

            headerDiv = document.createElement("div");
            headerDiv.className = "card-header row d-flex ";
            headerDiv.style.backgroundColor = "#85c1e9"; // Crear el elemento div para la información del contrato

            contratoDiv = document.createElement("div");
            contratoDiv.className = "d-flex col-6 titulo-detalles header-planilla";
            contratoP = document.createElement("p");
            contratoP.textContent = "Contrato: ";
            contratoValor = document.createTextNode(datosPlanilla.codigo);
            contratoDiv.appendChild(contratoP);
            contratoDiv.appendChild(contratoValor); // Crear el elemento div para la información de "Cancelado"

            canceladoDiv = document.createElement("div");
            canceladoDiv.className = "d-flex col-6 titulo-detalles header-planilla positive justify-content-end";
            canceladoP = document.createElement("p");
            canceladoP.textContent = "Cancelado: ";
            canceladoValor = document.createTextNode(datosPlanilla.estado);
            canceladoDiv.appendChild(canceladoP);
            canceladoDiv.appendChild(canceladoValor); // Agregar los elementos de contrato y cancelado al encabezado

            headerDiv.appendChild(contratoDiv);
            headerDiv.appendChild(canceladoDiv); // Crear el elemento div para el cuerpo de la tarjeta

            bodyDiv = document.createElement("div");
            bodyDiv.className = "card-body cuerpo"; // Crear el elemento div para el título del socio

            socioDiv = document.createElement("div");
            socioDiv.className = "card-title d-flex titulo-socio";
            socioH5 = document.createElement("h5");
            socioH5.textContent = "Socio: ";
            socioP = document.createTextNode(datosPlanilla.nombre);
            socioDiv.appendChild(socioH5);
            socioDiv.appendChild(socioP); // Crear el elemento para la fecha de emisión

            fechaEmisionDiv = document.createElement("div");
            fechaEmisionDiv.className = "d-flex";
            fechaEmisionP = document.createElement("p");
            fechaEmisionP.textContent = "Fecha emisión: ";
            fechaEmisionSp = document.createTextNode("-");
            fechaEmisionValor = document.createTextNode(formatearFecha(datosPlanilla.fechaEmision));
            fechaEmisionDiv.appendChild(fechaEmisionP);
            fechaEmisionDiv.appendChild(fechaEmisionSp);
            fechaEmisionDiv.appendChild(fechaEmisionValor); // Crear el elemento para la sección de servicios

            serviciosDiv = document.createElement("div");
            serviciosDiv.className = "row";
            serviciosP = document.createElement("p");
            serviciosP.className = "text-center titulo-servicios-positive";
            serviciosP.textContent = "Agua Potable";
            serviciosTituloP = document.createElement("p");
            serviciosTituloP.className = "text-center titulo-servicios-positive";
            serviciosTituloP.textContent = "Servicios"; // Agrega la fecha de Emision y el Socio

            serviciosDiv.appendChild(socioDiv);
            serviciosDiv.appendChild(fechaEmisionDiv);
            serviciosDiv.appendChild(serviciosP); // Crear el elemento para la lista de servicios

            listaServiciosDiv = document.createElement("div");
            listaServiciosDiv.className = "lista-servicios"; // Crear la lista ul con la clase

            listaUl = document.createElement("ul");
            listaUl.className = "list-group list-group-flush"; //Consulta los servicios a cancelar de acuerdo al id del contrato

            _context2.next = 57;
            return regeneratorRuntime.awrap(ipcRenderer.invoke("getDatosServiciosByContratoId", datosPlanilla.contratosId, formatearFecha(datosPlanilla.fechaEmision), "all"));

          case 57:
            datosServicios = _context2.sent;
            console.log("Servicios encontrados: " + datosServicios); // Crear elementos para los detalles de servicios (Consumo, Tarifa, Valor)

            valorAguaPotable = null;
            totalPagar = 0.0;
            consumoDiv = document.createElement("div");
            consumoDiv.className = "col-4 d-flex titulo-detalles";
            consumoP = document.createElement("p");
            consumoP.textContent = "Consumo:";
            tarifaDiv = document.createElement("div");
            tarifaDiv.className = "col-4 d-flex titulo-detalles";
            tarifaP = document.createElement("p");
            tarifaP.textContent = "Tarifa:";
            valorDiv = document.createElement("div");
            valorDiv.className = "col-4 d-flex titulo-detalles";
            valorP = document.createElement("p");
            valorP.textContent = "Valor: $";
            datosServicios.forEach(function (datosServicio) {
              if (datosServicio.nombre === "Agua Potable") {
                valorAguaPotable = datosServicio.total;
                tarifaAguaPotable = datosServicio.tarifa;
                totalPagar += datosServicio.total;
              } else {
                // Crear elementos de la lista de servicios (Alcantarillado, Recolección de desechos, Riego Agrícola, Bomberos)
                if (datosServicio.aplazableSn === "Si") {
                  var alcantarilladoLi = document.createElement("li");
                  alcantarilladoLi.className = "titulo-detalles d-flex detalles";
                  var alcantarilladoP = document.createElement("p");
                  alcantarilladoP.textContent = datosServicio.nombre + ": ";
                  var alcantarilladoValor = document.createTextNode(datosServicio.abono);
                  totalPagar += datosServicio.abono;
                  alcantarilladoLi.appendChild(alcantarilladoP);
                  alcantarilladoLi.appendChild(alcantarilladoValor);
                  listaUl.appendChild(alcantarilladoLi);
                } else {
                  var _alcantarilladoLi = document.createElement("li");

                  _alcantarilladoLi.className = "titulo-detalles d-flex detalles";

                  var _alcantarilladoP = document.createElement("p");

                  _alcantarilladoP.textContent = datosServicio.nombre + ": ";

                  var _alcantarilladoValor = document.createTextNode(datosServicio.total);

                  totalPagar += datosServicio.total;

                  _alcantarilladoLi.appendChild(_alcantarilladoP);

                  _alcantarilladoLi.appendChild(_alcantarilladoValor);

                  listaUl.appendChild(_alcantarilladoLi);
                }
              } // Agregar los elementos de servicios al contenedor de servicios


              serviciosDiv.appendChild(consumoDiv);
              serviciosDiv.appendChild(tarifaDiv);
              serviciosDiv.appendChild(valorDiv);
              serviciosDiv.appendChild(serviciosTituloP); // Agregar la lista ul al contenedor de lista de servicios

              listaServiciosDiv.appendChild(listaUl);
            });
            console.log("valor agua: " + valorAguaPotable);

            if (!(valorAguaPotable === null || valorAguaPotable === undefined || valorAguaPotable === "null")) {
              _context2.next = 88;
              break;
            }

            console.log("Asignando NA");
            consumoValor = document.createTextNode("NA");
            consumoDiv.appendChild(consumoP);
            consumoDiv.appendChild(consumoValor);
            tarifaValor = document.createTextNode("NA");
            tarifaDiv.appendChild(tarifaP);
            tarifaDiv.appendChild(tarifaValor);
            valorValor = document.createTextNode("NA");
            valorDiv.appendChild(valorP);
            valorDiv.appendChild(valorValor);
            _context2.next = 101;
            break;

          case 88:
            _context2.next = 90;
            return regeneratorRuntime.awrap(getDatosLecturas(datosPlanilla.contratosId, formatearFecha(datosPlanilla.fechaEmision)));

          case 90:
            lectura = _context2.sent;
            console.log("Datos Lecturas: ", lectura);
            _consumoValor = document.createTextNode(lectura[0].lecturaActual - lectura[0].lecturaAnterior);
            consumoDiv.appendChild(consumoP);
            consumoDiv.appendChild(_consumoValor);
            _tarifaValor = document.createTextNode(" " + "(" + lectura[0].tarifaValor + ")"); // const tarifaValor = document.createTextNode(
            //   lectura[0].tarifa + "(" + lectura[0].tarifaValor + ")"
            // );

            tarifaDiv.appendChild(tarifaP);
            tarifaDiv.appendChild(_tarifaValor); // tarifaDiv.className = "d-flex";

            _valorValor = document.createTextNode(lectura[0].valor);
            valorDiv.appendChild(valorP);
            valorDiv.appendChild(_valorValor);

          case 101:
            // --->
            bodyDiv.appendChild(serviciosDiv);
            bodyDiv.appendChild(listaServiciosDiv); // Crear el elemento para el pie de la tarjeta

            footerDiv = document.createElement("div");
            footerDiv.className = "card-footer row d-flex"; // Crear elemento para el total

            totalDiv = document.createElement("div");
            totalDiv.className = "col-6 titulo-detalles d-flex";
            totalP = document.createElement("p");
            totalP.textContent = "Total: $";
            totalValor = document.createTextNode(totalPagar);
            totalDiv.appendChild(totalP);
            totalDiv.appendChild(totalValor); // Crear el botón con la clase y el ícono

            button = document.createElement("button");
            button.className = "btn-planilla-positive col-6"; // Añadir un evento onclick

            button.onclick = function () {
              editPlanilla(datosPlanilla.planillasId, datosPlanilla.contratosId, formatearFecha(datosPlanilla.fechaEmision));
              console.log("¡Hiciste clic en el botón!", datosPlanilla.planillasId, datosPlanilla.contratosId, formatearFecha(datosPlanilla.fechaEmision));
            };

            buttonIcon = document.createElement("i");
            buttonIcon.className = "fa-solid fa-file-pen";
            button.appendChild(buttonIcon); // Agregar elementos al pie de la tarjeta

            footerDiv.appendChild(totalDiv);
            footerDiv.appendChild(button); // Agregar todos los elementos a la tarjeta principal

            cardDiv.appendChild(headerDiv);
            cardDiv.appendChild(bodyDiv); // cardDiv.appendChild(serviciosDiv);
            // cardDiv.appendChild(listaServiciosDiv);

            cardDiv.appendChild(footerDiv); // Agregar la tarjeta al documento (por ejemplo, al elemento con el id "planillasList")
            // const planillasList = document.getElementById("planillasList");

            planillasList.appendChild(cardDiv);

          case 124:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
}

var getDatosLecturas = function getDatosLecturas(contratoId, fechaEmision) {
  var lectura;
  return regeneratorRuntime.async(function getDatosLecturas$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log("Parámetros de busqueda: " + contratoId, fechaEmision);
          _context3.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getLecturasByFecha", contratoId, fechaEmision));

        case 3:
          lectura = _context3.sent;
          return _context3.abrupt("return", lectura);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var editPlanilla = function editPlanilla(planillaId, contratoId, fechaEmision) {
  var planilla;
  return regeneratorRuntime.async(function editPlanilla$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          editingStatus = true;
          editPlanillaId = planillaId;
          console.log("Planilla a editar: " + planillaId);
          totalFinal = 0.0;
          totalConsumo = 0.0;
          console.log("LLamando funcion editPlanilla: " + planillaId, contratoId, fechaEmision);
          _context4.next = 8;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getPlanillaById", planillaId));

        case 8:
          planilla = _context4.sent;
          // ----------------------------------------------------------------
          // Datos del encabezado de la planilla a editar
          planillaEmision.textContent = formatearFecha(planilla[0].fechaEmision);
          planillaCodigo.textContent = planilla[0].planillasCodigo;
          planillaEstado.textContent = planilla[0].estado;
          socioNombres.textContent = planilla[0].nombre;
          socioCedula.textContent = planilla[0].cedulaPasaporte; // ----------------------------------------------------------------
          // Datos del consumo de agua potable de la planilla

          lecturaActual.value = planilla[0].lecturaActual;
          lecturaAnterior.value = planilla[0].lecturaAnterior;
          valorConsumo.value = planilla[0].valor;
          console.log("total consumo: ", totalConsumo);
          totalConsumo += planilla[0].valor;
          console.log("total consumo: ", totalConsumo);
          console.log(planilla[0]);
          serviciosFijosList.innerHTML = "";
          otrosServiciosList.innerHTML = "";
          otrosAplazablesList.innerHTML = "";
          _context4.next = 26;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getDatosServiciosByContratoId", contratoId, formatearFecha(fechaEmision), "fijos"));

        case 26:
          serviciosFijos = _context4.sent;

          if (serviciosFijos[0] !== undefined) {
            renderServicios(serviciosFijos, "fijos");
          } else {
            serviciosFijosList.innerHTML = "";
          }

          _context4.next = 30;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getDatosServiciosByContratoId", contratoId, formatearFecha(fechaEmision), "otros"));

        case 30:
          otrosServicios = _context4.sent;

          if (otrosServicios[0] !== undefined) {
            renderServicios(otrosServicios, "otros");
          } else {
            otrosServiciosList.innerHTML = "";
          }

          calcularConsumo();
          valorTotalPagar.value = totalFinal + totalConsumo;

        case 34:
        case "end":
          return _context4.stop();
      }
    }
  });
};

function renderServicios(servicios, tipo) {
  var totalPagarEdit = 0.0;
  console.log("Servicios a renderizard: ", servicios, tipo);
  servicios.forEach(function (servicio) {
    // Crear el div principal
    if (servicio.nombre !== "Agua Potable") {
      var tr = document.createElement("tr");
      tr.id = servicio.id;
      var tdServicio = document.createElement("td");
      tdServicio.textContent = servicio.nombre;
      var tdAplazable = document.createElement("td");
      tdAplazable.textContent = servicio.aplazableSn;
      var tdSubtotal = document.createElement("td");
      tdSubtotal.textContent = servicio.valor;
      var tdDescuento = document.createElement("td");
      tdDescuento.textContent = servicio.descuento;
      var tdTotal = document.createElement("td");
      tdTotal.textContent = servicio.total;
      var tdSaldo = document.createElement("td");
      tdSaldo.textContent = servicio.total;
      var tdAbono = document.createElement("td");
      tdAbono.className = "valorAbono";
      tdAbono.textContent = servicio.abono;

      if (servicio.aplazableSn === "Si") {
        totalPagarEdit += servicio.abono;
      } else {
        totalPagarEdit += servicio.total;
      }

      var tdBtnGestionar = document.createElement("td");
      var btnGestionar = document.createElement("button");
      btnGestionar.className = "btn";
      btnGestionar.type = "button";

      btnGestionar.onclick = function () {
        detallesServiciodg(servicio);
        valorAbonoEdit = servicio.id;
      };

      var iconGestionar = document.createElement("i");
      iconGestionar.className = "fa-solid fa-ellipsis-vertical";
      btnGestionar.appendChild(iconGestionar);
      tdBtnGestionar.appendChild(btnGestionar);

      if (tipo == "fijos") {
        tr.appendChild(tdServicio);
        tr.appendChild(tdSubtotal);
        tr.appendChild(tdDescuento);
        tr.appendChild(tdTotal);
        tr.appendChild(tdBtnGestionar);
        serviciosFijosList.appendChild(tr);
      } else {
        if (servicio.aplazableSn === "Si") {
          tr.appendChild(tdServicio);
          tr.appendChild(tdSubtotal);
          tr.appendChild(tdDescuento);
          tr.appendChild(tdTotal);
          tr.appendChild(tdSaldo);
          tr.appendChild(tdAbono);
          tr.appendChild(tdBtnGestionar);
          otrosAplazablesList.appendChild(tr);
        } else {
          tr.appendChild(tdServicio);
          tr.appendChild(tdSubtotal);
          tr.appendChild(tdDescuento);
          tr.appendChild(tdTotal);
          tr.appendChild(tdBtnGestionar);
          otrosServiciosList.appendChild(tr);
        }
      }
    } else if (servicio.nombre === "Agua Potable") {
      editDetalleId = servicio.id;
      console.log("Id del detalle Agua: " + editDetalleId);
    }
  });
  totalFinal += totalPagarEdit;
} // function renderServicios(servicios, tipo) {
//   let totalPagarEdit = 0.0;
//   console.log("Servicios a renderizard: ", servicios, tipo);
//   servicios.forEach((servicio) => {
//     // Crear el div principal
//     if (servicio.nombre !== "Agua Potable") {
//       const divPrincipal = document.createElement("div");
//       divPrincipal.className = "col-12 card border-info mb-2 ";
//       divPrincipal.style.maxWidth = "100%";
//       divPrincipal.style.maxHeight = "45%";
//       divPrincipal.style.minHeight = "45%";
//       divPrincipal.style.padding = "0";
//       // Crear el div para el encabezado
//       const divEncabezado = document.createElement("div");
//       divEncabezado.className = "card-header titulo-detalles";
//       divEncabezado.style.margin = "0";
//       divEncabezado.style.padding = "0.5%";
//       divEncabezado.style.backgroundColor = "#85c1e9";
//       const encabezadoTexto = document.createElement("p");
//       encabezadoTexto.textContent = servicio.nombre;
//       divEncabezado.appendChild(encabezadoTexto);
//       // Crear el div para el cuerpo de la tarjeta
//       const divCuerpo = document.createElement("div");
//       divCuerpo.className = "card-body card-cuerpo card-s-cuerpo";
//       divCuerpo.style.padding = "1em";
//       // Crear el div con las columnas
//       const divColumnas = document.createElement("div");
//       divColumnas.className = "col-12";
//       const divFila = document.createElement("div");
//       divFila.className = "row";
//       // Crear las columnas con sus contenidos
//       totalPagarEdit += servicio.total;
//       const columnas = [
//         { titulo: "Valor:", contenido: servicio.valor },
//         { titulo: "Desc:", contenido: servicio.tipodescuento },
//         { titulo: "Valor desc:", contenido: servicio.descuento },
//         { titulo: "Total:", contenido: servicio.total },
//       ];
//       columnas.forEach((columna) => {
//         const divColumna = document.createElement("div");
//         divColumna.className = "col-3 card-cuerpo";
//         const pTitulo = document.createElement("p");
//         pTitulo.textContent = columna.titulo;
//         const pContenido = document.createElement("p");
//         pContenido.textContent = columna.contenido;
//         divColumna.appendChild(pTitulo);
//         divColumna.appendChild(pContenido);
//         divFila.appendChild(divColumna);
//       });
//       divColumnas.appendChild(divFila);
//       divCuerpo.appendChild(divColumnas);
//       // Agregar los elementos al div principal
//       divPrincipal.appendChild(divEncabezado);
//       divPrincipal.appendChild(divCuerpo);
//       // Agregar el div principal al documento (por ejemplo, al cuerpo del documento)
//       // document.body.appendChild(divPrincipal);
//       if (tipo == "fijos") {
//         serviciosFijosList.appendChild(divPrincipal);
//       } else {
//         otrosServiciosList.appendChild(divPrincipal);
//       }
//     } else if (servicio.nombre === "Agua Potable") {
//       editDetalleId = servicio.id;
//       console.log("Id del detalle Agua: " + editDetalleId);
//     }
//   });
//   totalFinal += totalPagarEdit;
// }


guardarDg.onclick = function () {
  var totalRc = totalFinal;
  console.log("Total Rc: " + totalRc);
  console.log("Fila a editar: " + valorAbonoEdit);

  if (abonarStatus) {
    var nuevoAbono = abonarDg.value;
    var fila = document.getElementById(valorAbonoEdit);
    var valorAnterior = fila.querySelector(".valorAbono").textContent;
    console.log("Valor anterior: " + valorAnterior);

    if (valorAnterior !== nuevoAbono) {
      console.log("Compara: " + valorAnterior + " | " + nuevoAbono);
      fila.querySelector(".valorAbono").textContent = nuevoAbono;
      totalRc = totalFinal - valorAnterior;
      console.log("Total rc: " + totalRc);
      totalFinal = totalRc + parseFloat(nuevoAbono);
      console.log("Total final: " + totalFinal);
      valorTotalPagar.value = aproximarDosDecimales(totalFinal + parseFloat(totalConsumo));
      CerrarFormServicios();
    } else {
      CerrarFormServicios();
    }
  }
};

var getPlanillas = function getPlanillas() {
  return regeneratorRuntime.async(function getPlanillas$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getDatosPlanillas"));

        case 2:
          planillas = _context5.sent;
          console.log(planillas);
          renderPlanillas(planillas);

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
};

function init() {
  return regeneratorRuntime.async(function init$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(getPlanillas());

        case 2:
          cargarAnioBusquedas();
          cargarMesActual();

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function calcularConsumo() {
  var consumo, preValorConsumo, base, limitebase, tarifas;
  return regeneratorRuntime.async(function calcularConsumo$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log("Consultando tarifas ...");
          consumo = Math.round(lecturaActual.value - lecturaAnterior.value);
          preValorConsumo = 0.0;
          base = 0.0;
          limitebase = 15.0;
          console.log("Consumo: " + consumo);
          _context7.next = 8;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getTarifas"));

        case 8:
          tarifas = _context7.sent;

          if (tarifas[0] !== undefined) {
            tarifas.forEach(function (tarifa) {
              if (consumo >= tarifa.desde && consumo <= tarifa.hasta) {
                tarifaAplicada = tarifa.tarifa;
                valorTarifa = tarifa.valor;
                console.log("Tarifa aplicada: " + tarifaAplicada);
              }

              if (tarifa.tarifa === "Familiar") {
                base = tarifa.valor;
                limitebase = tarifa.hasta;
              }
            });
          }

          if (tarifaAplicada === "Familiar") {
            valorConsumo.value = valorTarifa.toFixed(2);
            totalConsumo = valorTarifa.toFixed(2);
            console.log("totalConsumo 1: " + totalConsumo);
          } else {
            console.log("Entrando else");

            if (consumo <= 0) {
              totalConsumo = base;
            } else {
              totalConsumo = (consumo - limitebase) * valorTarifa;
              preValorConsumo = totalConsumo + base;
              console.log("totalConsumo 2: " + preValorConsumo);
              totalConsumo = preValorConsumo;
              valorConsumo.value = totalConsumo.toFixed(2);
            }
          }

          tarifaConsumo.value = tarifaAplicada + "($" + valorTarifa + ")";
          console.log("Tarifa: " + tarifaAplicada + "(" + valorTarifa + ")");

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  });
}

function vistaFactura() {
  var socio, datos, encabezado, datosAgua, datosTotales;
  return regeneratorRuntime.async(function vistaFactura$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          socio = socioNombres.textContent;
          console.log("Encabezado a enviar: " + socio);
          datos = {
            mensaje: "Hola desde pagina1",
            otroDato: 12345
          };
          encabezado = {
            socio: socioNombres.textContent,
            fecha: formatearFecha(planillaEmision.textContent),
            cedula: socioCedula.textContent,
            contrato: contratoCodigo.textContent,
            planilla: planillaCodigo.textContent
          };
          datosAgua = {
            lecturaAnterior: lecturaAnterior.value,
            lecturaActual: lecturaActual.value,
            tarifaConsumo: tarifaConsumo.value,
            valorConsumo: valorConsumo.value
          };
          datosTotales = {
            subtotal: valorSubtotal.value,
            descuento: valorTotalDescuento.value,
            totalPagar: valorTotalPagar.value
          };
          _context8.next = 8;
          return regeneratorRuntime.awrap(ipcRenderer.send("datos-a-pagina2", datos, encabezado, serviciosFijos, otrosServicios, datosAgua, datosTotales));

        case 8:
        case "end":
          return _context8.stop();
      }
    }
  });
}

function recalcularConsumo() {
  var totalRecalculado;
  return regeneratorRuntime.async(function recalcularConsumo$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(calcularConsumo());

        case 2:
          console.log("tf-tc: " + totalFinal, totalConsumo);
          totalRecalculado = totalFinal;
          console.log("totalRecalculado: " + totalRecalculado);
          console.log("Valor consumo: " + valorConsumo.value);
          totalRecalculado += parseFloat(valorConsumo.value);
          totalFinal = parseFloat(totalRecalculado).toFixed(2);
          valorTotalPagar.value = totalFinal;

        case 9:
        case "end":
          return _context9.stop();
      }
    }
  });
}

function formatearFecha(fecha) {
  var fechaOriginal = new Date(fecha);
  var year = fechaOriginal.getFullYear();
  var month = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
  var day = String(fechaOriginal.getDate()).padStart(2, "0");
  var fechaFormateada = "".concat(year, "-").concat(month, "-").concat(day);
  return fechaFormateada;
} // Generar Planillas


function generarPlanilla() {
  var result;
  return regeneratorRuntime.async(function generarPlanilla$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          console.log("js");
          _context10.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("createPlanilla"));

        case 3:
          result = _context10.sent;
          console.log(result); //getPlanillas();

        case 5:
        case "end":
          return _context10.stop();
      }
    }
  });
}

function cargarMesActual() {
  mesBusqueda.innerHTML = ""; // Obtén el mes actual (0-indexed, enero es 0, diciembre es 11)

  var mesActual = new Date().getMonth(); // Array de nombres de meses

  var nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; // Llena el select con las opciones de los meses

  for (var i = 0; i < nombresMeses.length; i++) {
    var option = document.createElement("option");
    option.value = i - 1; // El valor es el índice del mes

    option.textContent = nombresMeses[i];
    mesBusqueda.appendChild(option);
  } // Establece el mes actual como seleccionado


  mesBusqueda.value = mesActual;
}

function cargarAnioBusquedas() {
  anioBusqueda.innerHTML = ""; // Obtener el año actual

  var anioActual = new Date().getFullYear(); // Crear opciones de años desde el año actual hacia atrás

  for (var i = anioActual; i >= 2020; i--) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;

    if (i === anioActual) {
      option.selected = true;
    }

    anioBusqueda.appendChild(option);
  }
}

var detallesServiciodg = function detallesServiciodg(servicio) {
  var aplazable, cancelados, pendientes, valorCancelado, valorAbonar, valorSaldo, pagosAnteriores;
  return regeneratorRuntime.async(function detallesServiciodg$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          abonarStatus = true;
          errortextAbono.textContent = "Error";
          errContainer.style.display = "none";
          abonarDg.readOnly = true;
          aplazable = "No aplazable";
          cancelados = 0;
          pendientes = 0;
          valorCancelado = 0;
          valorAbonar = 0;
          valorSaldo = 0;
          console.log("Servicio al Dg: " + servicio.contratadosId);
          servicioDg.textContent = servicio.nombre;
          descripcionDg.textContent = servicio.descripcion;

          if (servicioDg.aplazableSn === "Si") {
            aplazable = "Aplazable";
          }

          detallesDg.textContent = servicio.tipo + " | " + aplazable;
          subtotalDg.textContent = servicio.subtotal;
          descuentoDg.textContent = servicio.descuento;
          totalDg.textContent = servicio.total;
          numPagosDg.textContent = servicio.numeroPagos;

          if (servicio.estadoDetalle !== "Cancelado") {
            pendientes + 1;
          }

          _context11.next = 22;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getDetallesByContratadoId", servicio.contratadosId));

        case 22:
          pagosAnteriores = _context11.sent;
          pagosAnteriores.forEach(function (pagoAnterior) {
            if (pagoAnterior !== null || pagoAnterior !== undefined) {
              if (pagoAnterior.estado === "Cancelado") {
                valorCancelado += pagoAnterior.abono;
                cancelados++;
              } else {
                pendientes++;
              }
            }
          });
          canceladosDg.textContent = cancelados;
          pendientesDg.textContent = pendientes;
          valorSaldo = servicio.total - valorCancelado;
          saldoDg.textContent = valorSaldo;
          abonadoDg.textContent = valorCancelado;

          if (valorSaldo - valorCancelado < servicio.valorPagos) {
            valorAbonar = valorSaldo - valorCancelado;
          } else {
            if (servicio.valorPagos !== null) {
              valorAbonar = servicio.valorPagos;
            } else {
              valorAbonar = valorSaldo - valorCancelado;
            }
          }

          console.log("Abonar: " + valorAbonar);

          if (servicio.tipo !== "Servicio fijo" && servicio.aplazableSn === "Si") {
            abonarDg.readOnly = false;
          }

          abonarDg.value = valorAbonar;
          abonarDg.placeHolder = "" + valorAbonar;

          abonarDg.oninput = function () {
            if (abonarDg.value < valorAbonar) {
              abonarStatus = false;
              errContainer.style.display = "flex";
              errortextAbono.textContent = "El abono no puede ser menor a " + valorAbonar;
            } else if (abonarDg.value > valorSaldo) {
              abonarStatus = false;
              errContainer.style.display = "flex";
              errortextAbono.textContent = "El abono no puede ser mayor a " + valorSaldo;
            } else {
              abonarStatus = true;
              errortextAbono.textContent = "Error";
              errContainer.style.display = "none";
            }
          };

          if (dialogServicios.close) {
            dialogServicios.showModal();
          }

        case 36:
        case "end":
          return _context11.stop();
      }
    }
  });
};

function mostrarFormServicios() {
  console.log("MostrarFormServicios");

  if (dialogServicios.close) {
    dialogServicios.showModal();
  }
}

function CerrarFormServicios() {
  dialogServicios.close();
}

function aproximarDosDecimales(numero) {
  // Redondea el número hacia arriba
  var numeroRedondeado = Math.ceil(numero * 100) / 100;
  return numeroRedondeado.toFixed(2);
} // Transicion entre las secciones de la vista


var btnSeccion1 = document.getElementById("btnSeccion1");
var btnSeccion2 = document.getElementById("btnSeccion2");
var seccion1 = document.getElementById("seccion1");
var seccion2 = document.getElementById("seccion2");
btnSeccion1.addEventListener("click", function () {
  console.log("btn1");
  seccion1.classList.remove("active");
  seccion2.classList.add("active");
});
btnSeccion2.addEventListener("click", function () {
  console.log("btn2");
  seccion2.classList.remove("active");
  seccion1.classList.add("active");
}); // funciones del navbar

var abrirInicio = function abrirInicio() {
  var url;
  return regeneratorRuntime.async(function abrirInicio$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          url = "src/ui/principal.html";
          _context12.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context12.stop();
      }
    }
  });
};

var abrirSocios = function abrirSocios() {
  var url;
  return regeneratorRuntime.async(function abrirSocios$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          url = "src/ui/socios.html";
          _context13.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context13.stop();
      }
    }
  });
};

var abrirUsuarios = function abrirUsuarios() {
  var url;
  return regeneratorRuntime.async(function abrirUsuarios$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          url = "src/ui/usuarios.html";
          _context14.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context14.stop();
      }
    }
  });
};

var abrirPagos = function abrirPagos() {
  var url;
  return regeneratorRuntime.async(function abrirPagos$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          url = "src/ui/planillas.html";
          _context15.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context15.stop();
      }
    }
  });
};

var abrirPlanillas = function abrirPlanillas() {
  var url;
  return regeneratorRuntime.async(function abrirPlanillas$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          url = "src/ui/planillas-cuotas.html";
          _context16.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context16.stop();
      }
    }
  });
};

var abrirParametros = function abrirParametros() {
  var url;
  return regeneratorRuntime.async(function abrirParametros$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          url = "src/ui/parametros.html";
          _context17.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context17.stop();
      }
    }
  });
};

var abrirImplementos = function abrirImplementos() {
  var url;
  return regeneratorRuntime.async(function abrirImplementos$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          url = "src/ui/implementos.html";
          _context18.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context18.stop();
      }
    }
  });
};

function mostrarLogin() {
  var dialog = document.getElementById("loginDialog");
  dialog.showModal();
}

var abrirContratos = function abrirContratos() {
  var url;
  return regeneratorRuntime.async(function abrirContratos$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          url = "src/ui/medidores.html";
          _context19.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context19.stop();
      }
    }
  });
};

init();