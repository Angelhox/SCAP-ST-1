"use strict";

var _require = require("electron"),
    ipcRenderer = _require.ipcRenderer;

var validator = require("validator");

var Swal = require("sweetalert2"); // ----------------------------------------------------------------
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
// Varibles de busqueda de las planillas
// ----------------------------------------------------------------

var mesBusqueda = document.getElementById("mesBusqueda");
var anioBusqueda = document.getElementById("anioBusqueda");
var estadoBuscar = document.getElementById("estado");
var criterioBuscar = document.getElementById("criterio");
var criterioContent = document.getElementById("criterioContent");
var btnBuscar = document.getElementById("btnBuscar"); // ----------------------------------------------------------------
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
var errortextAbono = document.getElementById("errorTextAbono");
var errContainer = document.getElementById("err-container"); // ----------------------------------------------------------------
// Variables del los totales de la planilla
// ----------------------------------------------------------------

var totalFinal = 0.0;
var totalConsumo = 0.0;
var tarifaAplicada = "Familiar";
var valorTarifa = 2.0;
var lecturaActualEdit = 0;
var lecturaAnteriorEdit = 0;
var valorConsumoEdit = 0; // ----------------------------------------------------------------

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
var aplicadosDg = document.getElementById("aplicados-dg");
var saldoDg = document.getElementById("saldo-dg");
var saldoAplicarDg = document.getElementById("saldo-aplicar-dg");
var abonadoDg = document.getElementById("abonado-dg");
var abonarDg = document.getElementById("abonar-dg");
var guardarDg = document.getElementById("btnGuardar-dg");
var administrarDg = document.getElementById("btnAdministrar-dg"); //----------------------------------------------------------------
// Variables de los elementos de la pagina

var mostrarLecturas = document.getElementById("mostrar-lecturas");
var contenedorLecturas = document.getElementById("contenedor-lecturas");
var collapse = document.getElementById("collapse");
var calcularConsumoBt = document.getElementById("calcular-consumo");
var cancelarForm = document.getElementById("cancelarForm"); // ----------------------------------------------------------------
// Variables contenedoras

var tarifasDisponibles = [];
var abonarStatus = false;
var valorAbonoEdit = 0;
var datosServicios = [];
var serviciosFijos = [];
var otrosServicios = [];
var editados = [];
var planillas = [];
var editingStatus = false;
var planillaMedidorSn = false;
var editPlanillaId = "";
var editDetalleId = "";
var fechaEmisionEdit = "";
var editContratoId = "";
var encabezadoId = "";
planillaForm.addEventListener("submit", function _callee(e) {
  var newPlanilla, newDetalleServicio;
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

          if (!editingStatus) {
            console.log("Can not create planilla");
          } else {// console.log("Editing planilla with electron");
            // const result = await ipcRenderer.invoke(
            //   "updatePlanilla",
            //   editPlanillaId,
            //   newPlanilla
            // );
            // const resultDetalle = await ipcRenderer.invoke(
            //   "updateDetalle",
            //   editDetalleId,
            //   newDetalleServicio
            // );
            // editingStatus = false;
            // editPlanillaId = "";
            // console.log(result, resultDetalle);
          }

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});

function renderPlanillas(datosPlanillas) {
  planillasList.innerHTML = "";
  datosPlanillas.forEach(function _callee2(datosPlanilla) {
    var divContainer, cardDiv, headerDiv, contratoDiv, contratoP, espace, contratoValor, canceladoDiv, canceladoP, canceladoValor, bodyDiv, socioDiv, socioH5, espace1, socioP, fechaEmisionDiv, fechaEmisionP, fechaEmisionSp, fechaEmisionValor, serviciosDiv, serviciosP, serviciosTituloP, listaServiciosDiv, listaUl, datosServicios, rpValorAguaPotable, rpTotalPagar, consumoDiv, consumoP, consumoSp, tarifaDiv, tarifaP, tarifaSp, valorDiv, valorP, valorSp, consumoValor, tarifaValor, valorValor, _consumoValor, _tarifaValor, _valorValor, _consumoValor2, _tarifaValor2, _valorValor2, alcantarilladoLi, alcantarilladoP, servicioSp, alcantarilladoValor, footerDiv, totalDiv, totalP, totalSp, totalValor, button, buttonIcon;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Crear el elemento div principal con las clases y el estilo
            divContainer = document.createElement("div");
            divContainer.className = "col-xl-6 col-lg-12 col-md-12 col-sm-12 px-1";
            divContainer.style.height = "fit-content";
            divContainer.style.maxHeight = "fit-content"; // divContainer.style.backgroundColor = "black";

            cardDiv = document.createElement("div");
            cardDiv.className = "clase col-xl-12 col-lg-12 col-md-12 col-sm-12 my-1 mx-1 card card-planilla";
            cardDiv.style.backgroundColor = "red";
            cardDiv.style.width = "100%"; // cardDiv.style.maxWidth = "100%";

            cardDiv.style.padding = "0.3em";
            cardDiv.style.backgroundColor = "#d6eaf8";
            cardDiv.style.height = "30em";
            cardDiv.style.minHeight = "30em";
            cardDiv.style.maxHeight = "30em"; // Crear el elemento div para el encabezado de la tarjeta con la clase y el estilo

            headerDiv = document.createElement("div");
            headerDiv.className = "card-header d-flex ";
            headerDiv.style.backgroundColor = "#85c1e9"; // Crear el elemento div para la información del contrato

            contratoDiv = document.createElement("div");
            contratoDiv.className = "d-flex col-6 titulo-detalles header-planilla";
            contratoP = document.createElement("p");
            contratoP.textContent = "Contrato: ";
            espace = document.createElement("p");
            espace.textContent = "-";
            espace.className = "trans";
            contratoValor = document.createElement("p");
            contratoValor.textContent = datosPlanilla.codigo;
            contratoValor.className = "title-contrato ";
            contratoDiv.appendChild(contratoP);
            contratoDiv.appendChild(espace);
            contratoDiv.appendChild(contratoValor); // Crear el elemento div para la información de "Cancelado"

            canceladoDiv = document.createElement("div");
            canceladoDiv.className = "d-flex col-6 titulo-detalles header-planilla positive justify-content-end";
            canceladoP = document.createElement("p");
            canceladoP.textContent = "Cancelado: ";
            canceladoValor = document.createTextNode(datosPlanilla.estado); // canceladoDiv.appendChild(canceladoP);

            canceladoDiv.appendChild(canceladoValor); // Agregar los elementos de contrato y cancelado al encabezado

            headerDiv.appendChild(contratoDiv);
            headerDiv.appendChild(canceladoDiv); // Crear el elemento div para el cuerpo de la tarjeta

            bodyDiv = document.createElement("div");
            bodyDiv.className = "card-body cuerpo";
            bodyDiv.style.backgroundColor = "white"; // Crear el elemento div para el título del socio

            socioDiv = document.createElement("div");
            socioDiv.className = "card-title d-flex  mp-0";
            socioH5 = document.createElement("p");
            socioH5.className = "mp-0 titulos";
            socioH5.textContent = "Socio: ";
            espace1 = document.createElement("p");
            espace1.textContent = "-";
            espace1.className = "trans mp-0";
            socioP = document.createTextNode(datosPlanilla.nombre);
            socioDiv.appendChild(socioH5);
            socioDiv.appendChild(espace1);
            socioDiv.appendChild(socioP); // Crear el elemento para la fecha de emisión

            fechaEmisionDiv = document.createElement("div");
            fechaEmisionDiv.className = "d-flex ";
            fechaEmisionP = document.createElement("p");
            fechaEmisionP.className = "titulos mp-0";
            fechaEmisionP.textContent = "Fecha emisión: ";
            fechaEmisionSp = document.createElement("p");
            fechaEmisionSp.textContent = "-";
            fechaEmisionSp.className = "trans mp-0";
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

            _context2.next = 81;
            return regeneratorRuntime.awrap(ipcRenderer.invoke("getDatosServiciosByContratoId", datosPlanilla.contratosId, formatearFecha(datosPlanilla.fechaEmision), "all"));

          case 81:
            datosServicios = _context2.sent;
            console.log("Servicios encontrados: " + datosServicios); // Crear elementos para los detalles de servicios (Consumo, Tarifa, Valor)

            rpValorAguaPotable = null;
            rpTotalPagar = 0.0; // Contenedor y contenido de consumo

            consumoDiv = document.createElement("div");
            consumoDiv.className = "col-4 d-flex titulo-detalles";
            consumoP = document.createElement("p");
            consumoP.textContent = "Consumo:";
            consumoSp = document.createElement("p");
            consumoSp.textContent = "-";
            consumoSp.className = "trans mp-0"; // Contenedor y contenido de tarifa

            tarifaDiv = document.createElement("div");
            tarifaDiv.className = "col-4 d-flex titulo-detalles";
            tarifaP = document.createElement("p");
            tarifaP.textContent = "Tarifa:";
            tarifaSp = document.createElement("p");
            tarifaSp.textContent = "-";
            tarifaSp.className = "trans mp-0"; // Contenedor y contenido de valor consumo

            valorDiv = document.createElement("div");
            valorDiv.className = "col-4 d-flex titulo-detalles";
            valorP = document.createElement("p");
            valorP.textContent = "Valor:$ ";
            valorSp = document.createElement("p");
            valorSp.textContent = "-";
            valorSp.className = "trans mp-0";

            if (!(datosServicios.length > 0)) {
              _context2.next = 146;
              break;
            }

            datosServicios.forEach(function (datosServicio) {
              if (datosServicio.nombre === "Agua Potable") {
                rpValorAguaPotable = datosServicio.total;
                tarifaAguaPotable = datosServicio.tarifa; // el total de servicio agua al total a pagar de rp

                rpTotalPagar += datosServicio.total;
              } else {
                // Crear elementos de la lista de servicios (Alcantarillado, Recolección de desechos, Riego Agrícola, Bomberos)
                if (datosServicio.aplazableSn === "Si") {
                  var alcantarilladoLi = document.createElement("li");
                  alcantarilladoLi.className = "titulo-detalles d-flex detalles";
                  var alcantarilladoP = document.createElement("p");
                  alcantarilladoP.textContent = datosServicio.nombre + ": ";
                  var servicioSp = document.createElement("p");
                  servicioSp.textContent = "-";
                  servicioSp.className = "trans mp-0";
                  var alcantarilladoValor = document.createTextNode( // en esta parte esta seliendo null
                  parseFloat(datosServicio.abono).toFixed(2) + "$"); // si el servicio es aplazable sumo el abono al total a pagar de rp

                  rpTotalPagar += datosServicio.abono;
                  alcantarilladoLi.appendChild(alcantarilladoP);
                  alcantarilladoLi.appendChild(servicioSp);
                  alcantarilladoLi.appendChild(alcantarilladoValor);
                  listaUl.appendChild(alcantarilladoLi);
                } else {
                  var _alcantarilladoLi = document.createElement("li");

                  _alcantarilladoLi.className = "titulo-detalles d-flex detalles";

                  var _alcantarilladoP = document.createElement("p");

                  _alcantarilladoP.textContent = datosServicio.nombre + ": ";

                  var _servicioSp = document.createElement("p");

                  _servicioSp.textContent = "-";
                  _servicioSp.className = "trans mp-0";

                  var _alcantarilladoValor = document.createTextNode(parseFloat(datosServicio.total).toFixed(2) + "$"); // Si el servicio no es aplazable (fijo u ocacional) sumo el total al total
                  // a pagar de rp


                  rpTotalPagar += datosServicio.total;

                  _alcantarilladoLi.appendChild(_alcantarilladoP);

                  _alcantarilladoLi.appendChild(_servicioSp);

                  _alcantarilladoLi.appendChild(_alcantarilladoValor);

                  listaUl.appendChild(_alcantarilladoLi);
                }
              } // Agregar los elementos de servicios al contenedor de servicios


              serviciosDiv.appendChild(consumoDiv);
              serviciosDiv.appendChild(tarifaDiv);
              serviciosDiv.appendChild(valorDiv);
              serviciosDiv.appendChild(serviciosTituloP);
              listaServiciosDiv.appendChild(listaUl);
            });
            console.log("valor agua: " + rpValorAguaPotable);

            if (!(rpValorAguaPotable === null || rpValorAguaPotable === undefined || rpValorAguaPotable === "null")) {
              _context2.next = 126;
              break;
            }

            // Si despues de almacenar el valor de agua potable la variable sique siendo null
            // no existe el servicio de agua potable asignamos No aplica
            console.log("Valor de agua= " + rpValorAguaPotable);
            console.log("Asignando NA");
            consumoValor = document.createTextNode("NA");
            consumoDiv.appendChild(consumoP);
            consumoDiv.appendChild(consumoSp);
            consumoDiv.appendChild(consumoValor);
            tarifaValor = document.createTextNode("NA");
            tarifaDiv.appendChild(tarifaP);
            tarifaDiv.appendChild(tarifaSp);
            tarifaDiv.appendChild(tarifaValor);
            valorValor = document.createTextNode("0.0");
            valorDiv.appendChild(valorP);
            valorDiv.appendChild(valorSp);
            valorDiv.appendChild(valorValor);
            _context2.next = 142;
            break;

          case 126:
            _context2.next = 128;
            return regeneratorRuntime.awrap(getDatosLecturas(datosPlanilla.contratosId, formatearFecha(datosPlanilla.fechaEmision)));

          case 128:
            lectura = _context2.sent;
            console.log("Datos Lecturas: ", lectura);
            _consumoValor = document.createTextNode(lectura[0].lecturaActual - lectura[0].lecturaAnterior);
            consumoDiv.appendChild(consumoP);
            consumoDiv.appendChild(consumoSp);
            consumoDiv.appendChild(_consumoValor);
            _tarifaValor = document.createTextNode(" " + "(" + lectura[0].tarifaValor + ")"); // const tarifaValor = document.createTextNode(
            //   lectura[0].tarifa + "(" + lectura[0].tarifaValor + ")"
            // );

            tarifaDiv.appendChild(tarifaP);
            tarifaDiv.appendChild(tarifaSp);
            tarifaDiv.appendChild(_tarifaValor); // tarifaDiv.className = "d-flex";

            _valorValor = document.createTextNode(parseFloat(lectura[0].valor).toFixed(2));
            valorDiv.appendChild(valorP);
            valorDiv.appendChild(valorSp);
            valorDiv.appendChild(_valorValor);

          case 142:
            // --->
            bodyDiv.appendChild(serviciosDiv);
            bodyDiv.appendChild(listaServiciosDiv);
            _context2.next = 179;
            break;

          case 146:
            // En caso de que no existan servicios cargados a la planilla
            console.log("Asignando NA para planillas vacias");
            _consumoValor2 = document.createTextNode("NA");
            consumoDiv.appendChild(consumoP);
            consumoDiv.appendChild(consumoSp);
            consumoDiv.appendChild(_consumoValor2);
            _tarifaValor2 = document.createTextNode("NA");
            tarifaDiv.appendChild(tarifaP);
            tarifaDiv.appendChild(tarifaSp);
            tarifaDiv.appendChild(_tarifaValor2);
            _valorValor2 = document.createTextNode("NA");
            valorDiv.appendChild(valorP);
            valorDiv.appendChild(valorSp);
            valorDiv.appendChild(_valorValor2);
            alcantarilladoLi = document.createElement("li");
            alcantarilladoLi.className = "titulo-detalles d-flex detalles";
            alcantarilladoP = document.createElement("p");
            alcantarilladoP.textContent = "Sin servicios adeudados" + ": ";
            servicioSp = document.createElement("p");
            servicioSp.textContent = "-";
            servicioSp.className = "trans mp-0";
            alcantarilladoValor = document.createTextNode(parseFloat(0).toFixed(2) + "$"); // El total a pagar de planillas sera cero

            rpTotalPagar += 0.0;
            alcantarilladoLi.appendChild(alcantarilladoP);
            alcantarilladoLi.appendChild(servicioSp);
            alcantarilladoLi.appendChild(alcantarilladoValor);
            serviciosDiv.appendChild(consumoDiv);
            serviciosDiv.appendChild(tarifaDiv);
            serviciosDiv.appendChild(valorDiv);
            serviciosDiv.appendChild(serviciosTituloP);
            listaUl.appendChild(alcantarilladoLi);
            listaServiciosDiv.appendChild(listaUl);
            bodyDiv.appendChild(serviciosDiv);
            bodyDiv.appendChild(listaServiciosDiv);

          case 179:
            // Crear el elemento para el pie de la tarjeta
            footerDiv = document.createElement("div");
            footerDiv.className = "card-footer row d-flex";
            footerDiv.style.border = "none"; // Crear elemento para el total

            totalDiv = document.createElement("div");
            totalDiv.className = "col-6 titulo-detalles d-flex";
            totalP = document.createElement("p");
            totalP.textContent = "Total:$";
            totalSp = document.createElement("p");
            totalSp.textContent = "-";
            totalSp.className = "trans mp-0"; // Mostramos en el pie de la planilla el total que se calculo durante rp

            totalValor = document.createTextNode(parseFloat(rpTotalPagar).toFixed(2));
            totalDiv.appendChild(totalP);
            totalDiv.appendChild(totalSp);
            totalDiv.appendChild(totalValor); // Crear el botón con la clase y el ícono

            button = document.createElement("button");
            button.className = "btn-planilla-positive col-6"; // Añadir un evento onclick

            button.onclick = function () {
              // Elimina la clase "selected" de todos los elementos
              var elementos = document.querySelectorAll(".clase"); // Reemplaza con la clase real de tus elementos

              elementos.forEach(function (elemento) {
                elemento.classList.remove("bg-secondary");
              }); // Agrega la clase "selected" al elemento que se hizo clic

              cardDiv.classList.add("bg-secondary"); // detallesContratos(datosContrato.contratosId);

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

            cardDiv.appendChild(footerDiv);
            divContainer.appendChild(cardDiv); // Agregar la tarjeta al documento (por ejemplo, al elemento con el id "planillasList")
            // const planillasList = document.getElementById("planillasList");

            planillasList.appendChild(divContainer);

          case 206:
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
          encabezadoId = "";
          editados = [];
          editingStatus = true;
          editPlanillaId = planillaId;
          console.log("Planilla a editar: " + planillaId);
          totalFinal = 0.0;
          totalConsumo = 0.0;
          console.log("LLamando funcion editPlanilla: " + planillaId, contratoId, fechaEmision);
          _context4.next = 10;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getPlanillaById", planillaId));

        case 10:
          planilla = _context4.sent;
          // ----------------------------------------------------------------
          // Datos del encabezado de la planilla a editar
          planillaEmision.textContent = formatearFecha(planilla[0].fechaEmision);
          planillaCodigo.textContent = planilla[0].planillasCodigo;
          planillaEstado.textContent = planilla[0].estado;
          socioNombres.textContent = planilla[0].nombre;
          socioCedula.textContent = planilla[0].cedulaPasaporte; // ----------------------------------------------------------------

          if (planilla[0].medidorSn !== "No") {
            planillaMedidorSn = true;
            lecturaActual.value = planilla[0].lecturaActual;
            lecturaActualEdit = planilla[0].lecturaActual;
            lecturaAnterior.value = planilla[0].lecturaAnterior;
            lecturaAnteriorEdit = planilla[0].lecturaAnterior;
            valorConsumo.value = planilla[0].valor;
            valorConsumoEdit = planilla[0].valor;
            console.log("total consumo reseteado: ", totalConsumo); // Asignamos a totalConsumo el valor de agua desde planilla

            totalConsumo += planilla[0].valor;
            console.log("total consumo con valor de ep: ", totalConsumo);
            console.log(planilla[0]);
            calcularConsumo();
            calcularConsumoBt.disabled = false;
            mostrarLecturas.disabled = false;
            mostrarLecturas.innerHTML = "";
            mostrarLecturas.innerHTML = "Servicio de agua potable" + '<i id="collapse" class="fs-3 fa-solid fa-caret-up"></i>';
            contenedorLecturas.style.display = "flex";
            collapse.classList.remove("fa-caret-down");
            collapse.classList.add("fa-caret-up");
          } else {
            planillaMedidorSn = false;
            lecturaActual.value = "";
            lecturaActual.placeHolder = "NA";
            lecturaAnterior.value = "";
            lecturaAnterior.placeHolder = "NA";
            valorConsumo.value = "";
            valorConsumo.placeHolder = "NA";
            tarifaConsumo.value = ""; // calcularConsumo();

            console.log("total consumo: ", totalConsumo); // totalConsumo += planilla[0].valor;

            console.log("total consumo: ", totalConsumo);
            console.log(planilla[0]);
            calcularConsumoBt.disabled = true;
            mostrarLecturas.disabled = true;
            mostrarLecturas.innerHTML = "";
            mostrarLecturas.innerHTML = "No aplica servicio de agua potable" + '<i id="collapse" class="fs-3 fa-solid fa-caret-down"></i>';
            contenedorLecturas.style.display = "none";
            collapse.classList.add("fa-caret-down");
            collapse.classList.remove("fa-caret-up");
          } // Datos del consumo de agua potable de la planilla


          serviciosFijosList.innerHTML = "";
          otrosServiciosList.innerHTML = "";
          otrosAplazablesList.innerHTML = "";
          _context4.next = 22;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getDatosServiciosByContratoId", contratoId, formatearFecha(fechaEmision), "fijos"));

        case 22:
          serviciosFijos = _context4.sent;

          if (serviciosFijos[0] !== undefined) {
            renderServicios(serviciosFijos, "fijos");
          } else {
            serviciosFijosList.innerHTML = "";
          }

          _context4.next = 26;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getDatosServiciosByContratoId", contratoId, formatearFecha(fechaEmision), "otros"));

        case 26:
          otrosServicios = _context4.sent;

          if (otrosServicios[0] !== undefined) {
            renderServicios(otrosServicios, "otros");
          } else {
            otrosServiciosList.innerHTML = "";
          }

          recalcularConsumo();
          valorTotalPagar.value = totalFinal + totalConsumo;

        case 30:
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
      encabezadoId = servicio.encabezadosId;
      console.log("Encabezado desde detalle : " + encabezadoId);
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
      encabezadoId = servicio.encabezadosId;
      console.log("Encabezado desde detalle agua: " + encabezadoId);
      editDetalleId = servicio.id;
      console.log("Id del detalle Agua: " + editDetalleId);
    }
  });
  totalFinal += totalPagarEdit;
  console.log("Total de edit: ", totalFinal);
  recalcularConsumo();
}

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
      editados.push({
        id: valorAbonoEdit,
        valor: nuevoAbono
      });
      editados.forEach(function (editado) {
        console.log("Editado: " + editado.id, " | " + editado.valor);
      });
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

var getPlanillas = function getPlanillas(criterio, criterioContent, estado, anio, mes) {
  return regeneratorRuntime.async(function getPlanillas$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getDatosPlanillas", criterio, criterioContent, estado, anio, mes));

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
          // let fechaActual = new Date();
          // let anioEnviar = fechaActual.getFullYear();
          // let mesEnviar = fechaActual.getMonth() + 1;
          // let criterioEnviar = criterioBuscar.value;
          // let criterioContentEnviar = criterioContent.value;
          // let estadoEnviar = estadoBuscar.value;
          // console.log("error", mesEnviar, anioEnviar);
          // await getPlanillas(
          //   criterioEnviar,
          //   criterioContentEnviar,
          //   estadoEnviar,
          //   anioEnviar,
          //   mesEnviar
          // );
          buscarPlanillas();
          getTarifasDisponibles();
          cargarAnioBusquedas();
          cargarMesActual();

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
}

ipcRenderer.on("Notificar", function (event, response) {
  if (response.title === "Borrado!") {// resetFormAfterSave();
  } else if (response.title === "Actualizado!") {// resetFormAfterUpdate();
  } else if (response.title === "Guardado!") {// resetFormAfterSave();
  }

  console.log("Response: " + response);

  if (response.success) {
    Swal.fire({
      title: response.title,
      text: response.message,
      icon: "success",
      confirmButtonColor: "#f8c471"
    });
  } else {
    Swal.fire({
      title: response.title,
      text: response.message,
      icon: "error",
      confirmButtonColor: "#f8c471"
    });
  }
});
lecturaActual.addEventListener("input", function () {
  recalcularConsumo();
});

function getTarifasDisponibles() {
  return regeneratorRuntime.async(function getTarifasDisponibles$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getTarifas"));

        case 2:
          tarifasDisponibles = _context7.sent;
          console.log("Tartifas disponibles :", tarifasDisponibles);

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  });
}

function calcularConsumo() {
  var consumo, base, limitebase;
  return regeneratorRuntime.async(function calcularConsumo$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log("Consultando tarifas ...");
          totalConsumo = 0;
          consumo = Math.round(lecturaActual.value - lecturaAnterior.value);
          base = 0.0;
          limitebase = 15.0;
          console.log("Consumo redondeado cC: " + consumo);
          console.log("Tarifas: " + tarifasDisponibles);

          if (tarifasDisponibles[0] !== undefined) {
            tarifasDisponibles.forEach(function (tarifa) {
              if (consumo >= tarifa.desde && consumo <= tarifa.hasta) {
                tarifaAplicada = tarifa.tarifa;
                valorTarifa = tarifa.valor;
                console.log("VAlores que se asignaran: ", tarifaAplicada + "|" + valorTarifa);
              }

              if (tarifa.tarifa == "Familiar") {
                base = tarifa.valor;
                limitebase = tarifa.hasta;
                console.log("Bases: ", base + "|" + limitebase);
              }
            });
          }

          if (tarifaAplicada === "Familiar") {
            console.log("Aplicando tarifa familiar: " + valorTarifa.toFixed(2));
            valorConsumo.value = valorTarifa.toFixed(2);
          } else {
            totalConsumo = (consumo - limitebase) * valorTarifa;
            console.log("Total consumo que excede la base: ", totalConsumo + "|" + base);
            valorConsumo.value = (totalConsumo + base).toFixed(2);
          }

          valorConsumo.value = (totalConsumo + base).toFixed(2);
          tarifaConsumo.value = tarifaAplicada + "($" + valorTarifa + ")";
          console.log("Tarifa: " + tarifaAplicada + "(" + valorTarifa + ")");

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  });
}

function vistaFactura() {
  var socio, datos, encabezado, datosAgua, datosTotales;
  return regeneratorRuntime.async(function vistaFactura$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          socio = socioNombres.textContent;
          console.log("Encabezado a enviar: " + socio);
          datos = {
            mensaje: "Hola desde pagina1",
            otroDato: 12345
          };
          encabezado = {
            encabezadoId: encabezadoId,
            socio: socioNombres.textContent,
            fecha: formatearFecha(planillaEmision.textContent),
            cedula: socioCedula.textContent,
            contrato: contratoCodigo.textContent,
            planilla: planillaCodigo.textContent
          };
          datosAgua = {
            planillaId: editPlanillaId,
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
          _context9.next = 8;
          return regeneratorRuntime.awrap(ipcRenderer.send("datos-a-pagina2", datos, encabezado, serviciosFijos, otrosServicios, datosAgua, datosTotales, editados));

        case 8:
        case "end":
          return _context9.stop();
      }
    }
  });
}

function recalcularConsumo() {
  var totalRecalculado, _totalRecalculado;

  return regeneratorRuntime.async(function recalcularConsumo$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          if (!planillaMedidorSn) {
            _context10.next = 11;
            break;
          }

          _context10.next = 3;
          return regeneratorRuntime.awrap(calcularConsumo());

        case 3:
          console.log("tf-tc: " + totalFinal, totalConsumo);
          totalRecalculado = totalFinal;
          console.log("totalRecalculado: " + totalRecalculado);
          console.log("Valor consumo: " + valorConsumo.value);
          totalRecalculado += parseFloat(valorConsumo.value);
          valorTotalPagar.value = totalRecalculado.toFixed(2);
          _context10.next = 17;
          break;

        case 11:
          console.log("tf-tc: " + totalFinal, totalConsumo);
          _totalRecalculado = totalFinal;
          console.log("totalRecalculado: " + _totalRecalculado);
          console.log("Valor consumo: " + valorConsumo.value);
          _totalRecalculado += parseFloat(valorConsumo.value);
          valorTotalPagar.value = _totalRecalculado.toFixed(2);

        case 17:
        case "end":
          return _context10.stop();
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
  return regeneratorRuntime.async(function generarPlanilla$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          console.log("js");
          _context11.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("createPlanilla"));

        case 3:
          result = _context11.sent;
          console.log(result); //getPlanillas();

        case 5:
        case "end":
          return _context11.stop();
      }
    }
  });
}

function cargarMesActual() {
  mesBusqueda.innerHTML = '<option value="all" selected>Todo mes</option>'; // Obtén el mes actual (0-indexed, enero es 0, diciembre es 11)

  var mesActual = new Date().getMonth(); // Array de nombres de meses

  var nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; // Llena el select con las opciones de los meses

  for (var i = 0; i < nombresMeses.length; i++) {
    var option = document.createElement("option");
    option.value = i + 1; // El valor es el índice del mes

    option.textContent = nombresMeses[i];

    if (i === mesActual) {
      console.log("seleccionando: " + mesActual); // option.selected = true;
    }

    mesBusqueda.appendChild(option);
  } // Establece el mes actual como seleccionado
  // mesBusqueda.value = mesActual;

}

function cargarAnioBusquedas() {
  anioBusqueda.innerHTML = '<option value="all" selected>Todo año</option>'; // Obtener el año actual

  var anioActual = new Date().getFullYear(); // Crear opciones de años desde el año actual hacia atrás

  for (var i = anioActual; i >= 2020; i--) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;

    if (i === anioActual) {// option.selected = true;
    }

    anioBusqueda.appendChild(option);
  }
}

criterioBuscar.addEventListener("change", function () {
  if (criterioBuscar.value == "all") {
    buscarPlanillas();
    criterioContent.value = "";
    criterioContent.readOnly = true;
  } else {
    criterioContent.readOnly = false;
  }
});
btnBuscar.addEventListener("click", function () {
  buscarPlanillas();
});

function buscarPlanillas() {
  var mesBuscar, anioBuscar, criterioABuscar, criterioContentABuscar, estadoABuscar;
  return regeneratorRuntime.async(function buscarPlanillas$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          mesBuscar = mesBusqueda.value;
          anioBuscar = anioBusqueda.value;
          criterioABuscar = criterioBuscar.value;
          criterioContentABuscar = criterioContent.value;
          estadoABuscar = estadoBuscar.value;
          _context12.next = 7;
          return regeneratorRuntime.awrap(getPlanillas(criterioABuscar, criterioContentABuscar, estadoABuscar, anioBuscar, mesBuscar));

        case 7:
        case "end":
          return _context12.stop();
      }
    }
  });
}

var detallesServiciodg = function detallesServiciodg(servicio) {
  var aplazable, cancelados, pendientesCancelar, aplicados, valorCancelado, valorAplicado, valorAbonar, valorSaldo, pagosAnteriores;
  return regeneratorRuntime.async(function detallesServiciodg$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          abonarStatus = true;
          errortextAbono.textContent = "Error";
          errContainer.style.display = "none";
          abonarDg.readOnly = true;
          aplazable = "No aplazable";
          cancelados = 0;
          pendientesCancelar = 0;
          aplicados = 0;
          valorCancelado = 0;
          valorAplicado = 0;
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
          numPagosDg.textContent = servicio.numeroPagosIndividual; // if (servicio.estadoDetalle !== "Cancelado") {
          //   pendientesCancelar + 1;
          // } else if (servicio.estadoDetalle == "Cancelado") {
          //   cancelados + 1;
          //   valorCancelado += servicio.abono;
          // }

          _context13.next = 23;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getDetallesByContratadoId", servicio.contratadosId));

        case 23:
          pagosAnteriores = _context13.sent;
          pagosAnteriores.forEach(function (pagoAnterior) {
            if (pagoAnterior !== null || pagoAnterior !== undefined) {
              aplicados++;

              if (pagoAnterior.estado === "Cancelado") {
                valorCancelado += pagoAnterior.abono;
                cancelados++;
              } else {
                valorAplicado += pagoAnterior.abono;
                pendientesCancelar++;
              }
            }

            valorAbonar = pagoAnterior.abono;
          });
          canceladosDg.textContent = cancelados;
          aplicadosDg.textContent = aplicados;
          pendientesDg.textContent = pendientesCancelar;
          valorSaldo = servicio.total - valorCancelado - valorAplicado;
          saldoDg.textContent = valorAplicado;
          saldoAplicarDg.textContent = valorSaldo;
          abonadoDg.textContent = valorCancelado;
          abonarDg.textContent = valorAbonar; // if (valorSaldo - valorCancelado < servicio.valorPagos) {
          //   valorAbonar = valorSaldo - valorCancelado;
          // } else {
          //   if (servicio.valorPagos !== null) {
          //     valorAbonar = servicio.valorPagos;
          //   } else {
          //     valorAbonar = valorSaldo - valorCancelado;
          //   }
          // }

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
            } else if (abonarDg.value > valorSaldo + valorAbonar) {
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

        case 39:
        case "end":
          return _context13.stop();
      }
    }
  });
};

function resetForm() {
  planillaForm.reset();
  lecturaActualEdit = 0;
  lecturaAnteriorEdit = 0;
  valorConsumoEdit = 0;
  totalFinal = 0.0;
  totalConsumo = 0.0;
  tarifaAplicada = "Familiar";
  valorTarifa = 2.0;
  calcularConsumoBt.disabled = true;
  editDetalleId = "";
  editPlanillaId = "";
  editContratoId = "";
  fechaEmisionEdit = "";
  editingStatus = false;
  planillaMedidorSn = false;
  serviciosFijosList.innerHTML = "";
  otrosServiciosList.innerHTML = "";
  otrosAplazablesList.innerHTML = "";
  mostrarLecturas.innerHTML = "";
  mostrarLecturas.innerHTML = "No aplica servicio de agua potable" + '<i id="collapse" class="fs-3 fa-solid fa-caret-down"></i>';
  contenedorLecturas.style.display = "none";
  collapse.classList.add("fa-caret-down");
  collapse.classList.remove("fa-caret-up");
}

function resetFormAfterUpdate() {
  editPlanilla(editPlanillaId, editContratoId, fechaEmisionEdit);
  recalcularConsumo();
}

cancelarForm.addEventListener("click", function () {
  console.log("Borrando form");
  resetForm();
});

mostrarLecturas.onclick = function () {
  if (contenedorLecturas.style.display == "none") {
    collapse.classList.remove("fa-caret-down");
    collapse.classList.add("fa-caret-up");
    contenedorLecturas.style.display = "flex";
  } else {
    contenedorLecturas.style.display = "none";
    collapse.classList.add("fa-caret-down");
    collapse.classList.remove("fa-caret-up");
  }
};

calcularConsumoBt.onclick = function () {
  lecturaActual.value = lecturaActualEdit;
  lecturaAnterior.value = lecturaAnteriorEdit;
  valorConsumo.value = valorConsumoEdit;
  calcularConsumo();
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
  return regeneratorRuntime.async(function abrirInicio$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          url = "src/ui/principal.html";
          _context14.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context14.stop();
      }
    }
  });
};

var abrirSocios = function abrirSocios() {
  var url;
  return regeneratorRuntime.async(function abrirSocios$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          url = "src/ui/socios.html";
          _context15.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context15.stop();
      }
    }
  });
};

var abrirUsuarios = function abrirUsuarios() {
  var url;
  return regeneratorRuntime.async(function abrirUsuarios$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          url = "src/ui/usuarios.html";
          _context16.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context16.stop();
      }
    }
  });
};

var abrirPagos = function abrirPagos() {
  var url;
  return regeneratorRuntime.async(function abrirPagos$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          url = "src/ui/planillas.html";
          _context17.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context17.stop();
      }
    }
  });
};

var abrirPlanillas = function abrirPlanillas() {
  var url;
  return regeneratorRuntime.async(function abrirPlanillas$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          url = "src/ui/planillas-cuotas.html";
          _context18.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context18.stop();
      }
    }
  });
};

var abrirParametros = function abrirParametros() {
  var url;
  return regeneratorRuntime.async(function abrirParametros$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          url = "src/ui/parametros.html";
          _context19.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context19.stop();
      }
    }
  });
};

var abrirImplementos = function abrirImplementos() {
  var url;
  return regeneratorRuntime.async(function abrirImplementos$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          url = "src/ui/implementos.html";
          _context20.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context20.stop();
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
  return regeneratorRuntime.async(function abrirContratos$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          url = "src/ui/medidores.html";
          _context21.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context21.stop();
      }
    }
  });
};

init();