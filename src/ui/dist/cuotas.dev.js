"use strict";

// ----------------------------------------------------------------
// Librerias
// ----------------------------------------------------------------
var _require = require("electron"),
    ipcRenderer = _require.ipcRenderer;

var validator = require("validator");

var Swal = require("sweetalert2"); // ----------------------------------------------------------------


var servicioCreacion = document.getElementById("fechacreacion");
var servicioNombre = document.getElementById("nombre");
var servicioDescripcion = document.getElementById("descripcion"); // const servicioTipo = document.getElementById("tipo");

var servicioValor = document.getElementById("valor");
var serviciosList = document.getElementById("servicios");
var usuariosList = document.getElementById("usuarios");
var buscarServicios = document.getElementById("buscarServicios");
var criterio = document.getElementById("criterio");
var criterioContent = document.getElementById("criterio-content");
var servicioAplazableSn = document.getElementById("aplazablesn");
var valoresDistintos = document.getElementById("distintosSn");
var aplazableOptions = document.getElementById("aplazable-options");
var numeroPagos = document.getElementById("numero-pagos");
var valorPagos = document.getElementById("valor-pagos");
var servicioIndividualSn = document.getElementById("individualSn");
var buscarBeneficiarios = document.getElementById("buscarBeneficiarios");
var criterioBn = document.getElementById("criterio-bn");
var criterioContentBn = document.getElementById("criterio-bn-content");
var servicioTit = document.getElementById("servicio-tit");
var servicioDesc = document.getElementById("servicio-desc");
var servicioDet = document.getElementById("servicio-det");
var servicioVal = document.getElementById("servicio-val");
var btnVolver = document.getElementById("btn-volver"); // const servicioCreacionBn = document.getElementById("fechaCreacion-bn");
// const servicioNombreBn = document.getElementById("nombre-bn");
// const servicioDescripcionBn = document.getElementById("descripcion-bn");
// const servicioValorBn = document.getElementById("valor-bn");
// ----------------------------------------------------------------
// Variables para mostrar el estado de recaudacion.
// ----------------------------------------------------------------

var valorRecaudado = document.getElementById("valorRecaudado");
var valorPendiente = document.getElementById("valorPendiente");
var valorTotal = document.getElementById("valorTotal");
var buscarRecaudaciones = document.getElementById("buscarRecaudaciones");
var criterioSt = document.getElementById("criterio-st");
var recaudacionesList = document.getElementById("recaudaciones");
var anioRecaudacion = document.getElementById("anioRecaudacion");
var mesRecaudacion = document.getElementById("mesRecaudacion");
var anioLimite = document.getElementById("anioLimite");
var mesLimite = document.getElementById("mesLimite");
var btnReporte = document.getElementById("btnReporte"); // ----------------------------------------------------------------
// Variables del diálogo de opciones de las cuotas.
// ----------------------------------------------------------------

var errortextAbono = document.getElementById("errorTextAbono");
var errContainer = document.getElementById("err-container");
var dialogOpciones = document.getElementById("formOpciones");
var servicioDg = document.getElementById("title-dg");
var descripcionDg = document.getElementById("descripcion-dg");
var detallesDg = document.getElementById("detalles-dg");
var servicioValorDg = document.getElementById("servicio-val-dg");
var subtotalText = document.getElementById("subtotalText");
var subtotalDg = document.getElementById("subtotal-dg");
var descuentoValDg = document.getElementById("descuento-val-dg");
var descuentoDg = document.getElementById("descuento-dg");
var totalDg = document.getElementById("total-dg");
var numPagosDg = document.getElementById("numPagos-dg");
var valPagosDg = document.getElementById("valorPagos-dg");
var canceladosDg = document.getElementById("cancelados-dg");
var pendientesDg = document.getElementById("pendientes-dg");
var saldoDg = document.getElementById("saldo-dg");
var abonadoDg = document.getElementById("abonado-dg");
var abonarDg = document.getElementById("abonar-dg");
var guardarDg = document.getElementById("btnGuardar-dg");
var administrarDg = document.getElementById("btnAdministrar-dg");
var contratarDg = document.getElementById("btnContratar-dg"); // ----------------------------------------------------------------
// ----------------------------------------------------------------
// Elementos del formulario.
// ----------------------------------------------------------------

var containerOpciones = document.getElementById("container-opciones");
var sectionOpciones = document.getElementById("section-opciones");
var cancelarForm = document.getElementById("cancelar-form");
var recaudaciones = [];
var porContratar = [];
var servicios = [];
var usuarios = [];
var valorIndividual = 0.0;
var editingStatus = false;
var editServicioId = "";
var valoresDistintosDf = "No";
servicioForm.addEventListener("submit", function _callee2(e) {
  var newCuota, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          e.preventDefault();

          if (!validator.isEmpty(servicioNombre.value)) {
            _context2.next = 6;
            break;
          }

          mensajeError.textContent = "El nombre del servicio es obligatorio.";
          servicioNombre.focus();
          _context2.next = 26;
          break;

        case 6:
          if (!validator.isEmpty(servicioDescripcion.value)) {
            _context2.next = 11;
            break;
          }

          mensajeError.textContent = "La descripcion del servicio es obligatoria.";
          servicioDescripcion.focus(); // } else if (validator.isEmpty(servicioTipo.value)) {
          //   mensajeError.textContent = "El tipo de servicio es obligatorio.";
          //   servicioTipo.focus();
          // }

          _context2.next = 26;
          break;

        case 11:
          if (!validator.isEmpty(servicioValor.value)) {
            _context2.next = 16;
            break;
          }

          mensajeError.textContent = "El valor el servicio es obligatorio.";
          servicioValor.focus();
          _context2.next = 26;
          break;

        case 16:
          if (valoresDistintos.value !== null) {
            valoresDistintosDf = valoresDistintos.value;
          }

          newCuota = {
            fechaCreacion: formatearFecha(new Date()),
            nombre: servicioNombre.value,
            descripcion: servicioDescripcion.value,
            tipo: "Cuota",
            valor: servicioValor.value,
            aplazableSn: servicioAplazableSn.value,
            numeroPagos: numeroPagos.value,
            valorPagos: valorPagos.value,
            individualSn: servicioIndividualSn.value,
            valoresDistintosSn: valoresDistintosDf
          };

          if (editingStatus) {
            _context2.next = 25;
            break;
          }

          _context2.next = 21;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("createCuotas", newCuota));

        case 21:
          result = _context2.sent;
          console.log(result);
          _context2.next = 26;
          break;

        case 25:
          Swal.fire({
            title: "¿Quieres guardar los cambios?",
            text: "No podrás deshacer esta acción.",
            icon: "question",
            iconColor: "#f8c471",
            showCancelButton: true,
            confirmButtonColor: "#2874A6",
            cancelButtonColor: "#EC7063 ",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar"
          }).then(function _callee(result) {
            var _result;

            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!result.isConfirmed) {
                      _context.next = 5;
                      break;
                    }

                    // Aquí puedes realizar la acción que desees cuando el usuario confirme.
                    console.log("Editing cuota with electron");
                    _context.next = 4;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("updateCuotas", editServicioId, newCuota));

                  case 4:
                    _result = _context.sent;

                  case 5:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  });
});

function renderCuotas(cuotas) {
  serviciosList.innerHTML = "";
  cuotas.forEach(function (cuota) {
    var divContainer = document.createElement("div");
    divContainer.className = "col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-1";
    divContainer.style.height = "fit-content";
    divContainer.style.maxHeight = "fit-content";
    var divCol6 = document.createElement("div");
    divCol6.className = "clase col-6 card card-servicios";
    divCol6.style.width = "100%";
    divCol6.style.maxWidth = "100%";
    divCol6.style.padding = "0.3em";
    divCol6.style.backgroundColor = "#d6eaf8";
    divCol6.style.height = "fit-content";
    divCol6.style.maxHeight = "fit-content";
    var divRowG0 = document.createElement("div");
    divRowG0.className = "row g-0 px-2";
    divRowG0.style.backgroundColor = "white";
    var divCol2 = document.createElement("div");
    divCol2.className = "col-2 d-flex justify-content-center align-items-center container-img";
    var imgServicios = document.createElement("img");
    imgServicios.src = "../assets/fonts/servicioIcon64x64.png";
    imgServicios.className = "img-fluid rounded-start img-servicios";
    imgServicios.alt = "not found";
    divCol2.appendChild(imgServicios);
    var divCol9 = document.createElement("div");
    divCol9.className = "col-9 d-flex justify-content-center align-items-center";
    var divCardBody = document.createElement("div");
    divCardBody.className = "card-body";
    var divContainerTitle = document.createElement("div");
    divContainerTitle.className = "row container-title";
    var h6CardTitle = document.createElement("h6");
    h6CardTitle.className = "card-title";
    h6CardTitle.textContent = cuota.nombre;
    divContainerTitle.appendChild(h6CardTitle);
    var divContainerSocios = document.createElement("div");
    divContainerSocios.className = "row container-socios d-flex align-items-center";
    var pDescription = document.createElement("p");
    pDescription.textContent = cuota.descripcion;
    divContainerSocios.appendChild(pDescription);
    var divContainerDetalles = document.createElement("div");
    divContainerDetalles.className = "row container-detalles";
    var detalles = [{
      label: "Valor:$",
      value: parseFloat(cuota.valor).toFixed(2)
    }, {
      label: "Tipo:",
      value: cuota.tipo
    }, {
      label: "Aplazable:",
      value: cuota.aplazableSn
    }];
    detalles.forEach(function (detalle) {
      var divDetalle = document.createElement("div");
      divDetalle.className = "d-flex align-items-baseline col-4 pm-0";
      var esp = document.createElement("p");
      esp.textContent = "-";
      esp.className = "trans";
      var h6Label = document.createElement("h6");
      h6Label.textContent = detalle.label;
      var pValue = document.createElement("p");
      pValue.textContent = detalle.value;
      divDetalle.appendChild(h6Label);
      divDetalle.appendChild(esp);
      divDetalle.appendChild(pValue);
      divContainerDetalles.appendChild(divDetalle);
    });
    divCardBody.appendChild(divContainerTitle);
    divCardBody.appendChild(divContainerSocios);
    divCardBody.appendChild(divContainerDetalles);
    divCol9.appendChild(divCardBody);
    var divCol1 = document.createElement("div");
    divCol1.className = "col-1 d-flex flex-column justify-content-center"; // const buttons = ["fa-file-pen", "fa-trash", "fa-chart-simple"];

    var btnEditServicio = document.createElement("button");
    btnEditServicio.className = "btn-servicios-custom d-flex justify-content-center align-items-center";
    var iconEdit = document.createElement("i");
    iconEdit.className = "fa fa-file-pen";
    btnEditServicio.appendChild(iconEdit);
    var btnDeleteServicio = document.createElement("button");
    btnDeleteServicio.className = "btn-servicios-custom d-flex justify-content-center align-items-center";
    var iconDelete = document.createElement("i");
    iconDelete.className = "fa fa-trash";
    btnDeleteServicio.appendChild(iconDelete);

    btnDeleteServicio.onclick = function () {
      console.log("Eliminar ...");
    };

    var btnEstadistics = document.createElement("button");
    btnEstadistics.className = "btn-servicios-custom d-flex justify-content-center align-items-center";
    var iconStadistics = document.createElement("i");
    iconStadistics.className = "fa fa-chart-simple";
    btnEstadistics.appendChild(iconStadistics);

    btnEstadistics.onclick = function () {
      console.log("Estadisticas del servicio: " + cuota.id);
      mostrarEstadisticas(cuota.id);
      mostrarSeccion("seccion2");
    };

    divCol1.appendChild(btnEditServicio);

    btnEditServicio.onclick = function () {
      console.log("Detalles del servicio: " + cuota.id);
      editServicio(cuota.id);
    };

    btnDeleteServicio.onclick = function () {
      console.log("Eliminar servicio: " + cuota.id);
      deleteServicio(cuota.id, cuota.nombre);
    };

    divCol1.appendChild(btnDeleteServicio);
    divCol1.appendChild(btnEstadistics);
    divRowG0.appendChild(divCol2);
    divRowG0.appendChild(divCol9);
    divRowG0.appendChild(divCol1);
    divCol6.appendChild(divRowG0);
    divContainer.appendChild(divCol6);

    divContainer.onclick = function () {
      // Elimina la clase "selected" de todos los elementos
      var elementos = document.querySelectorAll(".clase"); // Reemplaza con la clase real de tus elementos

      elementos.forEach(function (elemento) {
        elemento.classList.remove("bg-secondary");
      }); // Agrega la clase "selected" al elemento que se hizo clic

      divCol6.classList.add("bg-secondary");
      console.log("Detalles del servicio: " + cuota.id);
      editServicio(cuota.id);
    };

    serviciosList.appendChild(divContainer);
  });
}

function renderUsuarios(usuarios, servicio) {
  var ct, contratadosId;
  return regeneratorRuntime.async(function renderUsuarios$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          ct = [];
          _context4.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratadosById", servicio.id));

        case 3:
          contratadosId = _context4.sent;
          console.log("Contratados: " + contratadosId);
          contratadosId.forEach(function (contratadoId) {
            ct.push(contratadoId.contratosId);
          }); // contratados = console.log("Contratados", contratados);
          // await getContratados(servicioId);

          usuariosList.innerHTML = "";
          usuarios.forEach(function _callee3(usuario) {
            var divContainer, divCol4, divRowG0, divCol2, img, divCol8, divCardBody, containerTitle, h6Contrato, pContrato, pContratoValue, containerSocios, h6Socio, pSocio, pSocioValue, divCol2Estado, divEstado, pEstado, divCustomCheckbox, inputCheckbox, labelCheckbox, iCheckbox;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    divContainer = document.createElement("div");
                    divContainer.className = "col-xl-6 col-lg-6 col-md-12 col-sm-12";
                    divCol4 = document.createElement("div");
                    divCol4.className = "clase col-12 card  my-1";
                    divCol4.style.padding = "0.3em";
                    divCol4.style.backgroundColor = "#d6eaf8";
                    divCol4.style.maxWidth = "100%";
                    divCol4.style.width = "100%";
                    divCol4.style.height = "fit-content";
                    divCol4.style.maxHeight = "fit-content";
                    divRowG0 = document.createElement("div");
                    divRowG0.className = "row g-0";
                    divRowG0.style.backgroundColor = "white";
                    divCol2 = document.createElement("div");
                    divCol2.className = "col-2 d-flex justify-content-center align-items-center";
                    img = document.createElement("img");
                    img.src = "../assets/fonts/usuario-rounded48x48.png";
                    img.className = "img-fluid rounded-start";
                    img.alt = "not found";
                    divCol2.appendChild(img);
                    divCol8 = document.createElement("div");
                    divCol8.className = "col-7 d-flex justify-content-center align-items-center text-center";
                    divCardBody = document.createElement("div");
                    divCardBody.className = "card-body text-center";
                    containerTitle = document.createElement("div");
                    containerTitle.className = "d-flex align-items-baseline container-title mp-0";
                    h6Contrato = document.createElement("h6");
                    h6Contrato.className = "card-title mp-0";
                    h6Contrato.textContent = "Contrato:";
                    pContrato = document.createElement("p");
                    pContrato.className = "text-white mp-0";
                    pContrato.textContent = "-";
                    pContratoValue = document.createElement("p");
                    pContratoValue.className = "mp-0";
                    pContratoValue.textContent = usuario.codigo;
                    containerTitle.appendChild(h6Contrato);
                    containerTitle.appendChild(pContrato);
                    containerTitle.appendChild(pContratoValue);
                    containerSocios = document.createElement("div");
                    containerSocios.className = "container-socios d-flex align-items-baseline";
                    h6Socio = document.createElement("h6");
                    h6Socio.textContent = "Socio:";
                    pSocio = document.createElement("p");
                    pSocio.className = "trans";
                    pSocio.textContent = "-";
                    pSocioValue = document.createElement("p");
                    pSocioValue.textContent = usuario.socio;
                    containerSocios.appendChild(h6Socio);
                    containerSocios.appendChild(pSocio);
                    containerSocios.appendChild(pSocioValue);
                    divCardBody.appendChild(containerTitle);
                    divCardBody.appendChild(containerSocios);
                    divCol8.appendChild(divCardBody);
                    divCol2Estado = document.createElement("div");
                    divCol2Estado.className = "col-3 flex-column d-flex align-items-center ";
                    divEstado = document.createElement("div");
                    divEstado.className = "col-12 text-center";
                    pEstado = document.createElement("p");
                    pEstado.className = "mt-3";
                    divCustomCheckbox = document.createElement("div");
                    divCustomCheckbox.className = "custom-checkbox d-flex justify-content-center align-items-center";
                    divCustomCheckbox.style.marginTop = "0";
                    divCustomCheckbox.style.padding = "0 38%";
                    divCustomCheckbox.style.width = "100%";
                    inputCheckbox = document.createElement("input");
                    inputCheckbox.type = "checkbox";
                    inputCheckbox.className = "circular-checkbox ";
                    console.log("Cotratados comparar: " + ct);

                    if (ct.includes(usuario.contratosId)) {
                      inputCheckbox.checked = true;
                      pEstado.innerHTML = "<small>Contratado</small>";
                    } else {
                      inputCheckbox.checked = false;
                      pEstado.innerHTML = "<small>No contratado</small>";
                    }

                    inputCheckbox.style.width = "40%";
                    inputCheckbox.style.height = "40%";
                    inputCheckbox.disabled = true; // await let contratosIds = usuario.contratosId;
                    // console.log("id: " + contratosIds);

                    inputCheckbox.onchange = function () {
                      if (inputCheckbox.checked) {
                        console.log("id del contrato: " + usuario.contratosId);
                        porContratar.push(usuario.contratosId);
                        console.log("Por contratar: " + porContratar);
                      }
                    };

                    labelCheckbox = document.createElement("label");
                    labelCheckbox["for"] = "miCheckbox";
                    labelCheckbox.className = "text-white d-flex align-items-center justify-content-center";
                    iCheckbox = document.createElement("i");
                    iCheckbox.className = "fa fa-check";
                    labelCheckbox.appendChild(iCheckbox);
                    divCustomCheckbox.appendChild(inputCheckbox);
                    divCustomCheckbox.appendChild(labelCheckbox);
                    divEstado.appendChild(pEstado);
                    divEstado.appendChild(divCustomCheckbox);
                    divCol2Estado.appendChild(divEstado);
                    divRowG0.appendChild(divCol2);
                    divRowG0.appendChild(divCol8);
                    divRowG0.appendChild(divCol2Estado);
                    divCol4.appendChild(divRowG0);
                    divContainer.appendChild(divCol4);

                    divContainer.onclick = function () {
                      // Elimina la clase "selected" de todos los elementos
                      var elementos = document.querySelectorAll(".clase"); // Reemplaza con la clase real de tus elementos

                      elementos.forEach(function (elemento) {
                        elemento.classList.remove("bg-secondary");
                      }); // Agrega la clase "selected" al elemento que se hizo clic

                      divCol4.classList.add("bg-secondary"); // detallesContratos(datosContrato.contratosId);

                      servicioOpcionesdg(usuario, servicio);
                      console.log("div: " + usuario.socio);
                    };

                    usuariosList.appendChild(divContainer);

                  case 91:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          });

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
} // const contratar = async () => {
//   porContratar.forEach(async (contratando) => {
//     newServicioContratado = {
//       fechaEmision: formatearFecha(new Date()),
//       estado: "Sin aplicar",
//       serviciosId: editServicioId,
//       contratosId: contratando,
//       descuentosId: 1,
//       valorIndividual: valorIndividual,
//     };
//     const contratado = await ipcRenderer.invoke(
//       "createSercicioContratado",
//       newServicioContratado
//     );
//     return contratado;
//   });
// };
// function renderServicios(servicios) {
//   serviciosList.innerHTML = "";
//   servicios.forEach((servicio) => {
//     serviciosList.innerHTML += `
//        <tr>
//       <td>${servicio.nombre}</td>
//       <td>${servicio.descripcion}</td>
//       <td>${servicio.valor}</td>
//       <td>
//       <button onclick="deleteServicio('${servicio.id}')" class="btn ">
//       <i class="fa-solid fa-user-minus"></i>
//       </button>
//       </td>
//       <td>
//       <button onclick="editServicio('${servicio.id}')" class="btn ">
//       <i class="fa-solid fa-user-pen"></i>
//       </button>
//       </td>
//    </tr>
//       `;
//   });
// }


var editServicio = function editServicio(id) {
  var servicio;
  return regeneratorRuntime.async(function editServicio$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getCuotasById", id));

        case 2:
          servicio = _context5.sent;
          servicioCreacion.value = formatearFecha(servicio.fechaCreacion);
          servicioNombre.value = servicio.nombre;
          servicioDescripcion.value = servicio.descripcion;

          if (servicio.aplazableSn == "Si") {
            servicioAplazableSn.value = "Si";
          } else {
            servicioAplazableSn.value = "No";
          }

          if (servicio.IndividualSn === "Si") {
            servicioIndividualSn.value = "Si";
          }

          if (servicio.IndividualSn === "No") {
            servicioIndividualSn.value = "No";
          }

          if (servicio.numeroPagos !== "null") {
            numeroPagos.value = servicio.numeroPagos;
          }

          servicioValor.value = servicio.valor;
          valorPagos.value = servicio.valorPagos;
          editingStatus = true;
          editServicioId = servicio.id;
          console.log(servicio);

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var deleteServicio = function deleteServicio(id, servicioNombre) {
  return regeneratorRuntime.async(function deleteServicio$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          Swal.fire({
            title: "¿Quieres borrar el servicio  " + servicioNombre + " ?",
            text: "No se eliminarán los servicios en uso y no podrás deshacer esta acción.",
            icon: "question",
            iconColor: "#f8c471",
            showCancelButton: true,
            confirmButtonColor: "#2874A6",
            cancelButtonColor: "#EC7063 ",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar"
          }).then(function _callee4(result) {
            var _result2;

            return regeneratorRuntime.async(function _callee4$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    if (!result.isConfirmed) {
                      _context6.next = 6;
                      break;
                    }

                    // Aquí puedes realizar la acción que desees cuando el usuario confirme.
                    console.log("id from parametros.js"); // Eliminamos el registro de la tabla servicios de tipo ocacional.

                    _context6.next = 4;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("deleteCuotas", id));

                  case 4:
                    _result2 = _context6.sent;
                    console.log("Resultado parametros.js", _result2);

                  case 6:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          });

        case 1:
        case "end":
          return _context7.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que muestra las estadisticas de un servicio
// ----------------------------------------------------------------


var mostrarEstadisticas = function mostrarEstadisticas(servicioId) {
  var servicio, aplazableSnText, criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function mostrarEstadisticas$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getCuotasById", servicioId));

        case 2:
          servicio = _context8.sent;
          console.log("Estadisticas: " + servicio);
          servicioTit.textContent = servicio.nombre;
          servicioDesc.textContent = "(" + servicio.descripcion + ")";
          servicioVal.textContent = "Valor: $" + servicio.valor;
          aplazableSnText = "No aplazable";

          if (servicio.aplazableSn !== "No") {
            aplazableSnText = "Aplazable";
          }

          servicioDet.textContent = servicio.tipo + " | " + aplazableSnText;
          editingStatus = true;
          editServicioId = servicio.id;
          console.log(servicio);
          criterioBuscar = "all";
          criterioContentBuscar = "all";
          _context8.next = 17;
          return regeneratorRuntime.awrap(getBeneficiarios(criterioBuscar, criterioContentBuscar, servicio));

        case 17:
          _context8.next = 19;
          return regeneratorRuntime.awrap(getRecaudaciones(servicioId));

        case 19:
        case "end":
          return _context8.stop();
      }
    }
  });
};

var getRecaudaciones = function getRecaudaciones() {
  var valoresRecaudados, valoresPendientes, valoresTotales, fechaDesde, fechaHasta, anioD, mesD, anioH, mesH, diaD, diaH, _diaD, _diaD2;

  return regeneratorRuntime.async(function getRecaudaciones$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          console.log("Mostrando recaudaciones");
          valoresRecaudados = 0.0;
          valoresPendientes = 0.0;
          valoresTotales = 0.0;
          fechaDesde = "all";
          fechaHasta = "all";
          anioD = parseInt(anioRecaudacion.value);
          mesD = parseInt(mesRecaudacion.value);
          console.log("Mes a buscar: " + mesD);
          anioH = anioRecaudacion.value;
          mesH = mesRecaudacion.value;

          if (criterioSt.value === "periodo") {
            diaD = obtenerPrimerYUltimoDiaDeMes(anioD, mesD);
            diaH = obtenerPrimerYUltimoDiaDeMes(anioH, mesH); // fechaDesde = "'" + anioD + "-" + mesD + "-" + diaD + "'";
            // fechaHasta = "'" + anioH + "-" + mesH + "-" + diaH + "'";

            fechaDesde = formatearFecha(diaD.primerDia);
            fechaHasta = formatearFecha(diaH.ultimoDia);
          } else if (criterioSt.value === "mes") {
            _diaD = obtenerPrimerYUltimoDiaDeMes(anioD, mesD);
            fechaDesde = formatearFecha(_diaD.primerDia);
            fechaHasta = formatearFecha(_diaD.ultimoDia); // console.log(
            //   "fecha error? :" + diaD.ultimoDia + " " + fechaDesde + " " + fechaHasta
            // );
          } else if (criterioSt.value === "actual") {
            console.log("Buscando Actual");
            anioD = parseInt(new Date().getFullYear());
            console.log("Actual: " + anioD);
            mesD = parseInt(new Date().getMonth());
            console.log("Mes actual: " + mesD);
            _diaD2 = obtenerPrimerYUltimoDiaDeMes(anioD, mesD);
            fechaDesde = formatearFecha(_diaD2.primerDia);
            fechaHasta = formatearFecha(_diaD2.ultimoDia);
          }

          _context9.next = 14;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getRecaudaciones", editServicioId, fechaDesde, fechaHasta));

        case 14:
          recaudaciones = _context9.sent;
          console.log("Recaudaciones: ", recaudaciones);
          recaudacionesList.innerHTML = "";
          recaudaciones.forEach(function (recaudacion) {
            var abonoRp = 0;

            if (parseFloat(recaudacion.abono) == 0 && recaudacion.detalleEstado == "Cancelado") {
              abonoRp = recaudacion.total;
            } else if (recaudacion.detalleEstado == "Cancelado") {
              abonoRp = recaudacion.abono;
            } else {
              abonoRp = 0;
            }

            valoresPendientes += recaudacion.saldo - abonoRp;
            valoresRecaudados += abonoRp;
            valoresTotales += recaudacion.total;
            recaudacionesList.innerHTML += "\n           <tr>\n           <td>".concat(recaudacion.contratosCodigo, "</td>\n           <td>").concat(recaudacion.nombres + " " + recaudacion.apellidos, "</td>\n           <td>").concat(recaudacion.detalleEstado, "</td>\n           <td>").concat(abonoRp, "</td>\n           <td>").concat(recaudacion.total, "</td>\n           <td>").concat(recaudacion.saldo - abonoRp, "</td>        \n       </tr>\n          ");
          });
          valorPendiente.textContent = valoresPendientes.toFixed(2);
          valorRecaudado.textContent = valoresRecaudados.toFixed(2);
          valorTotal.textContent = valoresTotales.toFixed(2);

        case 21:
        case "end":
          return _context9.stop();
      }
    }
  });
};

var getBeneficiarios = function getBeneficiarios(criterio, criterioContent, servicio) {
  return regeneratorRuntime.async(function getBeneficiarios$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratos", criterio, criterioContent));

        case 2:
          usuarios = _context10.sent;
          console.log("Beneficiarios: ", usuarios); // if (servicio.IndividualSn == "No") {
          //   const usuariosFiltrados = usuarios.filter(
          //     (usuario) => usuario.principalSn == "Si"
          //   );
          //   renderUsuarios(usuariosFiltrados, servicio);
          // } else {

          renderUsuarios(usuarios, servicio); // }

        case 5:
        case "end":
          return _context10.stop();
      }
    }
  });
};

var getServicios = function getServicios() {
  return regeneratorRuntime.async(function getServicios$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getCuotas"));

        case 2:
          cuotas = _context11.sent;
          console.log(cuotas);
          renderCuotas(cuotas);

        case 5:
        case "end":
          return _context11.stop();
      }
    }
  });
};

criterio.onchange = function _callee5() {
  var criterioSeleccionado, criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function _callee5$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          criterioSeleccionado = criterio.value;
          console.log("Seleccionado: ", criterioSeleccionado);

          if (!(criterioSeleccionado === "all")) {
            _context12.next = 11;
            break;
          }

          // criterioContent.textContent = "";
          criterioContent.value = "";
          criterioContent.readOnly = true;
          criterioBuscar = "all";
          criterioContentBuscar = "all";
          _context12.next = 9;
          return regeneratorRuntime.awrap(getServicios(criterioBuscar, criterioContentBuscar));

        case 9:
          _context12.next = 12;
          break;

        case 11:
          criterioContent.readOnly = false;

        case 12:
        case "end":
          return _context12.stop();
      }
    }
  });
};

buscarServicios.onclick = function _callee6() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function _callee6$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          criterioBuscar = criterio.value;
          criterioContentBuscar = criterioContent.value;
          console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
          _context13.next = 5;
          return regeneratorRuntime.awrap(getServicios(criterioBuscar, criterioContentBuscar));

        case 5:
        case "end":
          return _context13.stop();
      }
    }
  });
};

criterioBn.onchange = function _callee7() {
  var criterioSeleccionado, criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function _callee7$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          criterioSeleccionado = criterioBn.value;
          console.log("Seleccionado: ", criterioSeleccionado);

          if (!(criterioSeleccionado === "all")) {
            _context14.next = 11;
            break;
          }

          // criterioContent.textContent = "";
          criterioContentBn.value = "";
          criterioContentBn.readOnly = true;
          criterioBuscar = "all";
          criterioContentBuscar = "all";
          _context14.next = 9;
          return regeneratorRuntime.awrap(getBeneficiarios(criterioBuscar, criterioContentBuscar, editServicioId));

        case 9:
          _context14.next = 12;
          break;

        case 11:
          criterioContentBn.readOnly = false;

        case 12:
        case "end":
          return _context14.stop();
      }
    }
  });
};

buscarBeneficiarios.onclick = function _callee8() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function _callee8$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          criterioBuscar = criterioBn.value;
          criterioContentBuscar = criterioContentBn.value;
          console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
          _context15.next = 5;
          return regeneratorRuntime.awrap(getBeneficiarios(criterioBuscar, criterioContentBuscar, editServicioId));

        case 5:
        case "end":
          return _context15.stop();
      }
    }
  });
};

criterioSt.onchange = function _callee9() {
  var criterioSeleccionado;
  return regeneratorRuntime.async(function _callee9$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          criterioSeleccionado = criterioSt.value;
          console.log("Seleccionado: ", criterioSeleccionado);

          if (!(criterioSeleccionado === "all")) {
            _context16.next = 7;
            break;
          }

          _context16.next = 5;
          return regeneratorRuntime.awrap(getRecaudaciones());

        case 5:
          _context16.next = 8;
          break;

        case 7:
          if (criterioSeleccionado === "actual") {
            mesActual();
            mesLimites();
            anioActual();
            anioLimites();
            getRecaudaciones();
            anioRecaudacion.disabled = true;
            mesRecaudacion.disabled = true;
          } else if (criterioSeleccionado === "mes") {
            anioRecaudacion.disabled = false;
            mesRecaudacion.disabled = false;
          }

        case 8:
        case "end":
          return _context16.stop();
      }
    }
  });
};

buscarRecaudaciones.onclick = function _callee10() {
  return regeneratorRuntime.async(function _callee10$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.next = 2;
          return regeneratorRuntime.awrap(getRecaudaciones());

        case 2:
        case "end":
          return _context17.stop();
      }
    }
  });
};

function init() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function init$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          servicioCreacion.value = formatearFecha(new Date());
          mesActual();
          mesLimites();
          anioActual();
          anioLimites();
          criterioBuscar = "all";
          criterioContentBuscar = "all";
          _context18.next = 9;
          return regeneratorRuntime.awrap(getServicios(criterioBuscar, criterioContentBuscar));

        case 9:
        case "end":
          return _context18.stop();
      }
    }
  });
}

servicioValor.oninput = function () {
  numeroPagos.value = 1;
  valorPagos.value = servicioValor.value;
};

numeroPagos.onchange = function () {
  var valorPorPago = 0.0;

  if (!servicioValor.value == 0 || !servicioValor.value == null || !servicioValor.value == "") {
    vpp = servicioValor.value / numeroPagos.value;
    valorPorPago = Math.ceil(vpp * 100) / 100;
    valorPagos.value = valorPorPago.toFixed(2);
  } else {
    Swal.fire("Antes ingresa un valor válido");
    servicioValor.focus();
  }
};

servicioAplazableSn.onchange = function () {
  if (servicioAplazableSn.value === "Si") {
    numeroPagos.disabled = false; // aplazableOptions.style.display = "flex";
  } else {
    numeroPagos.disabled = true;
    numeroPagos.value = 1;
    valorPagos.value = servicioValor.value; // aplazableOptions.style.display = "none";
  }
};

ipcRenderer.on("datos-a-ocacionales", function _callee11() {
  var datos;
  return regeneratorRuntime.async(function _callee11$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("pido-datos"));

        case 2:
          datos = _context19.sent;
          console.log("Estos: " + datos.id);
          mostrarEstadisticas(datos.id);
          mostrarSeccion("seccion2"); // console.log("Id recibido: " + servicioRv.id);
          // await mostrarEstadisticas(servicioRv.id);
          // mostrarSeccion("seccion2");

        case 6:
        case "end":
          return _context19.stop();
      }
    }
  });
});
ipcRenderer.on("Notificar", function (event, response) {
  if (response.title === "Borrado!") {
    resetFormAfterSave();
  } else if (response.title === "Actualizado!") {
    resetFormAfterUpdate();
  } else if (response.title === "Guardado!") {
    resetFormAfterSave();
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

function resetFormAfterUpdate() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function resetFormAfterUpdate$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          criterioBuscar = criterio.value;
          criterioContentBuscar = criterioContent.value;
          console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
          console;
          _context20.next = 6;
          return regeneratorRuntime.awrap(getServicios(criterioBuscar, criterioContentBuscar));

        case 6:
          mensajeError.textContent = "";
          servicioCreacion.value = formatearFecha(new Date());

        case 8:
        case "end":
          return _context20.stop();
      }
    }
  });
}

function resetFormAfterSave() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function resetFormAfterSave$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          criterioBuscar = criterio.value;
          criterioContentBuscar = criterioContent.value;
          console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
          console;
          _context21.next = 6;
          return regeneratorRuntime.awrap(getServicios(criterioBuscar, criterioContentBuscar));

        case 6:
          editingStatus = false;
          editServicioId = "";
          servicioForm.reset();
          mensajeError.textContent = "";
          servicioCreacion.value = formatearFecha(new Date());

        case 11:
        case "end":
          return _context21.stop();
      }
    }
  });
}

function resetForm() {
  editingStatus = false;
  editServicioId = "";
  servicioForm.reset();
  mensajeError.textContent = "";
  servicioCreacion.value = formatearFecha(new Date());
}

function mesActual() {
  mesRecaudacion.innerHTML = ""; // Obtén el mes actual (0-indexed, enero es 0, diciembre es 11)

  var mesActual = new Date().getMonth(); // Array de nombres de meses

  var nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; // Llena el select con las opciones de los meses

  for (var i = 0; i < nombresMeses.length; i++) {
    var option = document.createElement("option");
    option.value = i; // El valor es el índice del mes

    option.textContent = nombresMeses[i];
    mesRecaudacion.appendChild(option);
  } // Establece el mes actual como seleccionado


  mesRecaudacion.value = mesActual;
}

function mesLimites() {
  mesLimite.innerHTML = ""; // Obtén el mes actual (0-indexed, enero es 0, diciembre es 11)

  var mesActual = new Date().getMonth(); // Array de nombres de meses

  var nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; // Llena el select con las opciones de los meses

  for (var i = 0; i < nombresMeses.length; i++) {
    var option = document.createElement("option");
    option.value = i; // El valor es el índice del mes

    option.textContent = nombresMeses[i];
    mesLimite.appendChild(option);
  } // Establece el mes actual como seleccionado


  mesRecaudacion.value = mesActual;
}

function obtenerPrimerYUltimoDiaDeMes(anio, mes) {
  // Meses en JavaScript se numeran de 0 a 11 (enero es 0, diciembre es 11)
  var primerDia = new Date(anio, mes, 1);
  var ultimoDia = new Date(anio, mes + 1, 0);
  return {
    primerDia: primerDia,
    ultimoDia: ultimoDia
  };
}

function formatearFecha(fecha) {
  var fechaOriginal = new Date(fecha);
  var year = fechaOriginal.getFullYear();
  var month = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
  var day = String(fechaOriginal.getDate()).padStart(2, "0");
  var fechaFormateada = "".concat(year, "-").concat(month, "-").concat(day);
  return fechaFormateada;
}

btnVolver.onclick = function () {
  mostrarSeccion("seccion1");
};

function anioActual() {
  anioRecaudacion.innerHTML = ""; // Obtener el año actual

  var anioActual = new Date().getFullYear(); // Crear opciones de años desde el año actual hacia atrás

  for (var i = anioActual; i >= 2020; i--) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;

    if (i === anioActual) {
      option.selected = true;
    }

    anioRecaudacion.appendChild(option);
  }
}

function anioLimites() {
  anioLimite.innerHTML = ""; // Obtener el año actual

  var anioActual = new Date().getFullYear(); // Crear opciones de años desde el año actual hacia atrás

  for (var i = anioActual; i >= 2020; i--) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;

    if (i === anioActual) {
      option.selected = true;
    }

    anioLimite.appendChild(option);
  }
}

btnReporte.onclick = function () {
  Swal.fire({
    title: "Selecciona una acción",
    icon: "info",
    html: "\n      <button class=\"swal2-confirm swal2-styled\" id=\"reporteGeneral\" onclick=\"vistaFactura('general')\">General</button>\n      <button class=\"swal2-confirm swal2-styled\" id=\"reporteCancelados\" onclick=\"vistaFactura('cancelados')\">Cancelados</button>\n      <button class=\"swal2-confirm swal2-styled\" id=\"reporteSinCancelar\" onclick=\"vistaFactura('sinCancelar')\">Sin cancelar</button>\n\n    ",
    showCloseButton: true,
    allowOutsideClick: false,
    showConfirmButton: false
  }).then(function (result) {
    if (result.isConfirmed) {// if (result.dismiss === Swal.DismissReason.close) {
      //   // El botón de cierre (X) fue presionado
      //   Swal.fire("Operación cancelada", "", "error");
      // } else if (result.target.id === "accion1") {
      //   // El botón "Acción 1" fue presionado
      //   Swal.fire("Acción 1 realizada", "", "success");
      // } else if (result.target.id === "accion2") {
      //   // El botón "Acción 2" fue presionado
      //   Swal.fire("Acción 2 realizada", "", "success");
      // } else if (result.target.id === "accion3") {
      //   // El botón "Acción 3" fue presionado
      //   Swal.fire("Acción 3 realizada", "", "success");
      // }
    } else {
      // El botón "Cancelar" fue presionado
      Swal.fire("Reporte cancelado", "", "success");
    }
  });
};

function vistaFactura(tipo) {
  var recaudacionesReporte, datos, encabezado, datosTotales;
  return regeneratorRuntime.async(function vistaFactura$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          recaudacionesReporte = []; // Supongamos que tienes un arreglo de objetos
          // Define la condición de filtro (por ejemplo, objetos con id mayor que 2)

          datos = {
            mensaje: "Hola desde pagina1",
            otroDato: 12345
          };
          encabezado = {
            servicio: servicioTit.textContent,
            fechaD: "2023-10-01",
            fechaH: "2023-10-31"
          };
          datosTotales = {
            pendiente: valorRecaudado.textContent,
            recaudado: valorPendiente.textContent,
            totalFinal: valorTotal.textContent
          };

          if (tipo == "cancelados") {
            recaudacionesReporte = [];
            recaudacionesReporte = recaudaciones.filter(function (recaudacion) {
              return recaudacion.detalleEstado == "Cancelado";
            });
            console.log("rp: Cancelados ", recaudacionesReporte);
          } else if (tipo == "sinCancelar") {
            recaudacionesReporte = [];
            recaudacionesReporte = recaudaciones.filter(function (recaudacion) {
              return recaudacion.detalleEstado == "Por cancelar";
            });
            console.log("rp Sin cancelar: ", recaudacionesReporte);
          } else {
            recaudacionesReporte = [];
            recaudacionesReporte = recaudaciones;
            console.log("rp general: ", recaudacionesReporte);
          }

          _context22.next = 7;
          return regeneratorRuntime.awrap(ipcRenderer.send("datos-a-pagina3", datos, encabezado, recaudacionesReporte, datosTotales));

        case 7:
        case "end":
          return _context22.stop();
      }
    }
  });
}

function mostrarSeccion(id) {
  var seccion1 = document.getElementById("seccion1");
  var seccion2 = document.getElementById("seccion2");

  if (id === "seccion1") {
    seccion1.classList.add("active");
    seccion2.classList.remove("active");
  } else {
    seccion1.classList.remove("active");
    seccion2.classList.add("active");
  }
}

function cargarDescuentosList() {
  var descuentosDisponibles;
  return regeneratorRuntime.async(function cargarDescuentosList$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getDescuentos"));

        case 2:
          descuentosDisponibles = _context23.sent;
          descuentoDg.innerHTML = "";
          descuentosDisponibles.forEach(function (descuentoDisponible) {
            var option = document.createElement("option");
            option.textContent = descuentoDisponible.descripcion + " (" + descuentoDisponible.valor + "%)";
            option.value = descuentoDisponible.id;
            option.setAttribute("value-descuento", [descuentoDisponible.valor]);
            descuentoDg.appendChild(option);
          });

        case 5:
        case "end":
          return _context23.stop();
      }
    }
  });
}

var servicioOpcionesdg = function servicioOpcionesdg(usuario, servicio) {
  var subtotal, total, porcentaje, descuento, aplazable, cancelados, pendientes, valorCancelado, valorPago, valorSaldo, numeroPagosDf, descuentoDf, editableSn, servicioContratado, servicioDetalles, descuentoSeleccionado, valorSeleccionado, valorPagoSeleccionado;
  return regeneratorRuntime.async(function servicioOpcionesdg$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          _context27.next = 2;
          return regeneratorRuntime.awrap(cargarDescuentosList());

        case 2:
          errortextAbono.textContent = "Error";
          errContainer.style.display = "none";
          abonarDg.readOnly = true;
          subtotal = 0;
          total = 0;
          porcentaje = 0;
          descuento = 0;
          aplazable = "No aplazable";
          cancelados = 0;
          pendientes = 0;
          valorCancelado = 0;
          valorPago = 0;
          valorSaldo = 0;
          numeroPagosDf = 1;
          descuentoDf = 1;
          editableSn = false; // Datos del servicio independientes

          servicioDg.textContent = servicio.nombre;
          descripcionDg.textContent = servicio.descripcion;
          detallesDg.textContent = servicio.tipo + " | " + aplazable;
          servicioValorDg.textContent = "Valor: $" + servicio.valor;

          if (servicioDg.aplazableSn === "Si") {
            aplazable = "Aplazable";
          } // Verifico si el servicio ha sido contratado


          console.log("Contratado?: " + servicio.id, usuario.contratosId);
          _context27.next = 26;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratadoByServicioContrato", servicio.id, usuario.contratosId));

        case 26:
          servicioContratado = _context27.sent;

          if (!(servicioContratado[0] !== undefined)) {
            _context27.next = 53;
            break;
          }

          console.log("El servicio ha sido contratado: " + servicioContratado[0]); // Si el servicio ya ha sido contratado

          if (servicioContratado[0].valorIndividual !== null) {
            subtotal = servicioContratado[0].valorIndividual;
          }

          subtotalDg.value = subtotal;

          if (servicioContratado[0].descuentosId !== null) {
            descuentoDf = servicioContratado[0].descuentosId;
          }

          descuentoDg.value = descuentoDf;

          if (servicioContratado[0].valorDescuento !== null) {
            descuento = servicioContratado[0].valorDescuento;
          } // el valor del descuento es el que ya esta guardado.


          descuentoValDg.value = descuento;

          if (servicioContratado[0].numeroPagosIndividual !== null) {
            numeroPagosDf = servicioContratado[0].numeroPagosIndividual;
          }

          numPagosDg.value = numeroPagosDf;

          if (servicioContratado[0].valorPagosIndividual !== null) {
            valorPago = servicioContratado[0].valorPagosIndividual;
          } // el valor de los pagos es el que ya esta guardado.


          valPagosDg.value = valorPago;
          total = subtotal - descuento;
          totalDg.value = total; // Si esta contratado pero, esta cancelado ?

          _context27.next = 43;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getDetallesByContratadoId", servicioContratado[0].serviciosContratadosId));

        case 43:
          servicioDetalles = _context27.sent;

          if (servicioDetalles.length > 0) {
            console.log("Existe el detalle de servicios: ", servicioDetalles);
            servicioDetalles.forEach(function (servicioDetalle) {
              console.log("Detalles: " + servicioDetalle.estado);

              if (servicioDetalle.estado === "Cancelado") {
                cancelados++;
                valorCancelado += servicioDetalle.abono;
              }

              if (cancelados > 0) {
                editableSn = false;
                descuentoDg.disabled = false;
              }
            }); //Cambiar valor or valorIndividual

            contratarDg.textContent = "Descontratar";

            contratarDg.onclick = function _callee12() {
              return regeneratorRuntime.async(function _callee12$(_context24) {
                while (1) {
                  switch (_context24.prev = _context24.next) {
                    case 0:
                      _context24.next = 2;
                      return regeneratorRuntime.awrap(desContratarServicio(servicioContratado[0].serviciosContratadosId, usuario, servicio));

                    case 2:
                    case "end":
                      return _context24.stop();
                  }
                }
              });
            };
          }

          contratarDg.textContent = "Descontratar";

          contratarDg.onclick = function _callee13() {
            return regeneratorRuntime.async(function _callee13$(_context25) {
              while (1) {
                switch (_context25.prev = _context25.next) {
                  case 0:
                    _context25.next = 2;
                    return regeneratorRuntime.awrap(desContratarServicio(servicioContratado[0].serviciosContratadosId, usuario, servicio));

                  case 2:
                  case "end":
                    return _context25.stop();
                }
              }
            });
          };

          canceladosDg.textContent = cancelados;
          pendientesDg.textContent = numeroPagosDf - cancelados;
          abonadoDg.textContent = valorCancelado;
          saldoDg.textContent = total - valorCancelado;
          _context27.next = 81;
          break;

        case 53:
          // En caso de que el servicio no este contratado cargamos los valores
          // por defecto del servicio.
          if (servicio.valor !== null) {
            subtotal = servicio.valor;
          }

          subtotalDg.value = subtotal;
          descuentoDg.value = descuentoDf;
          descuentoDg.disabled = false;
          descuentoValDg.value = descuento; //----------------------------------------------------------------
          // funcion del select descuentos

          descuentoDg.onchange = function () {
            var descuentoSeleccionado = descuentoDg.options[descuentoDg.selectedIndex];
            var valorSeleccionado = descuentoSeleccionado.getAttribute("value-descuento");
            console.log("Atributo seleccionado:", valorSeleccionado);
            porcentaje = parseInt(valorSeleccionado) / 100;
            console.log("Porcentaje: " + subtotal, porcentaje);
            descuento = subtotal * porcentaje;
            descuentoValDg.value = parseFloat(descuento).toFixed(2); // total = servicio.valor - descuento;

            total = subtotal - descuento;
            totalDg.value = parseFloat(total).toFixed(2); //Incluimos la programacion del select numPagos

            if (total !== 0) {
              numPagosDg.disabled = false;
              var _valorPagoSeleccionado = numPagosDg.options[numPagosDg.selectedIndex].value;
              console.log("Valor pagos seleccionado:", _valorPagoSeleccionado);
              valorPago = total / _valorPagoSeleccionado;
            } else {
              numPagosDg.value = 1;
              numPagosDg.disabled = true;
              var _valorPagoSeleccionado2 = numPagosDg.options[numPagosDg.selectedIndex].value;
              console.log("Valor pagos seleccionado:", _valorPagoSeleccionado2);
              valorPago = total / _valorPagoSeleccionado2;
            }

            valPagosDg.value = parseFloat(valorPago).toFixed(2);
          };

          descuentoSeleccionado = descuentoDg.options[descuentoDg.selectedIndex];
          valorSeleccionado = descuentoSeleccionado.getAttribute("value-descuento");
          console.log("Atributo seleccionado:", valorSeleccionado);
          porcentaje = parseInt(valorSeleccionado) / 100;
          console.log("Porcentaje: " + subtotal, porcentaje);
          descuento = subtotal * porcentaje;
          descuentoValDg.value = parseFloat(descuento).toFixed(2);
          total = servicio.valor - descuento;
          totalDg.value = parseFloat(total).toFixed(2); // totalDg.value = subtotal - descuento;
          //----------------------------------------------------------------

          if (servicio.numeroPagos !== null) {
            numeroPagosDf = servicio.numeroPagos;
          } //----------------------------------------------------------------
          // funcion del select numero de pagos


          numPagosDg.value = numeroPagosDf;
          valorPagoSeleccionado = numPagosDg.options[numPagosDg.selectedIndex].value;
          console.log("Valor pagos seleccionado:", valorPagoSeleccionado);
          valorPago = total / valorPagoSeleccionado;
          valPagosDg.value = parseFloat(valorPago).toFixed(2); // if (servicio.valorPagos !== null) {
          //   valorPago = servicio.valorPagos;
          // }
          // valPagosDg.value = valorPago;
          //----------------------------------------------------------------

          canceladosDg.textContent = "No contratado";
          pendientesDg.textContent = "No contratado";
          saldoDg.textContent = "No contratado";
          abonadoDg.textContent = "No contratado";
          contratarDg.textContent = "Contratar";

          contratarDg.onclick = function _callee14() {
            var newServicioContratado;
            return regeneratorRuntime.async(function _callee14$(_context26) {
              while (1) {
                switch (_context26.prev = _context26.next) {
                  case 0:
                    newServicioContratado = {
                      fechaEmision: formatearFecha(new Date()),
                      estado: "Sin aplicar",
                      valorIndividual: subtotal,
                      numeroPagosIndividual: numPagosDg.value,
                      valorPagosIndividual: valorPago,
                      descuentoValor: descuento,
                      descuentosId: descuentoDg.value,
                      serviciosId: servicio.id,
                      contratosId: usuario.contratosId
                    };
                    _context26.next = 3;
                    return regeneratorRuntime.awrap(contratarServicio(newServicioContratado, usuario, servicio));

                  case 3:
                  case "end":
                    return _context26.stop();
                }
              }
            });
          };

          if (servicio.valoresDistintosSn == "Si") {
            console.log("Valores distintos: " + servicio.valoresDistintosSn);
            subtotalText.textContent = "Subtotal(Individual)";
            editableSn = true;
          } else {
            subtotalText.textContent = "Subtotal(General)";
            editableSn = false;
          }

        case 81:
          // Si el servicio tiene valores distintos.
          if (!editableSn) {
            subtotalDg.readOnly = true; // descuentoDg.disabled = true;

            numPagosDg.disabled = true;
          } else {
            subtotalDg.readOnly = false; // descuentoDg.disabled = false;

            numPagosDg.disabled = false;

            subtotalDg.oninput = function () {
              if (subtotalDg.value !== "") {
                subtotal = subtotalDg.value;
                var _descuentoSeleccionado = descuentoDg.options[descuentoDg.selectedIndex];

                var _valorSeleccionado = _descuentoSeleccionado.getAttribute("value-descuento");

                console.log("Atributo seleccionado:", _valorSeleccionado);
                porcentaje = parseInt(_valorSeleccionado) / 100;
                console.log("Porcentaje: " + subtotal, porcentaje);
                descuento = subtotal * porcentaje;
                descuentoValDg.value = parseFloat(descuento).toFixed(2); // total = servicio.valor - descuento;

                total = subtotal - descuento;
                totalDg.value = parseFloat(total).toFixed(2); //Incluimos la programacion del select numPagos

                if (total !== 0) {
                  var _valorPagoSeleccionado3 = numPagosDg.options[numPagosDg.selectedIndex].value;
                  console.log("Valor pagos seleccionado:", _valorPagoSeleccionado3);
                  valorPago = total / _valorPagoSeleccionado3;
                } else {
                  numPagosDg.value = 1;
                  var _valorPagoSeleccionado4 = numPagosDg.options[numPagosDg.selectedIndex].value;
                  console.log("Valor pagos seleccionado:", _valorPagoSeleccionado4);
                  valorPago = total / _valorPagoSeleccionado4;
                }

                valPagosDg.value = parseFloat(valorPago).toFixed(2);
              } else {
                subtotal = servicio.valor;
                var _descuentoSeleccionado2 = descuentoDg.options[descuentoDg.selectedIndex];

                var _valorSeleccionado2 = _descuentoSeleccionado2.getAttribute("value-descuento");

                console.log("Atributo seleccionado:", _valorSeleccionado2);
                porcentaje = parseInt(_valorSeleccionado2) / 100;
                console.log("Porcentaje: " + subtotal, porcentaje);
                descuento = subtotal * porcentaje;
                descuentoValDg.value = parseFloat(descuento).toFixed(2); // total = servicio.valor - descuento;

                total = subtotal - descuento;
                totalDg.value = parseFloat(total).toFixed(2); //Incluimos la programacion del select numPagos

                if (total !== 0) {
                  numPagosDg.disabled = false;
                  var _valorPagoSeleccionado5 = numPagosDg.options[numPagosDg.selectedIndex].value;
                  console.log("Valor pagos seleccionado:", _valorPagoSeleccionado5);
                  valorPago = total / _valorPagoSeleccionado5;
                } else {
                  numPagosDg.value = 1;
                  numPagosDg.disabled = true;
                  var _valorPagoSeleccionado6 = numPagosDg.options[numPagosDg.selectedIndex].value;
                  console.log("Valor pagos seleccionado:", _valorPagoSeleccionado6);
                  valorPago = total / _valorPagoSeleccionado6;
                }

                valPagosDg.value = parseFloat(valorPago).toFixed(2);
              }
            };

            numPagosDg.onchange = function () {
              if (total !== 0) {
                var _valorPagoSeleccionado7 = numPagosDg.options[numPagosDg.selectedIndex].value;
                console.log("Valor pagos seleccionado:", _valorPagoSeleccionado7);
                valorPago = total / _valorPagoSeleccionado7;
              } else {
                numPagosDg.value = 1;
                var _valorPagoSeleccionado8 = numPagosDg.options[numPagosDg.selectedIndex].value;
                console.log("Valor pagos seleccionado:", _valorPagoSeleccionado8);
                valorPago = total / _valorPagoSeleccionado8;
              }

              valPagosDg.value = parseFloat(valorPago).toFixed(2);
            };
          }

          if (servicio.aplazableSn == "Si") {
            numPagosDg.disabled = false;
          } else {
            numPagosDg.disabled = true;
          } // ----------------------------------------------------------------
          // Borramos Código :|
          // Borramos Codigo :|


          if (dialogOpciones.close) {
            dialogOpciones.showModal();
          }

        case 84:
        case "end":
          return _context27.stop();
      }
    }
  });
};

var desContratarServicio = function desContratarServicio(detalleDescontratar, usuario, servicio) {
  return regeneratorRuntime.async(function desContratarServicio$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          CerrarFormOpciones();
          Swal.fire({
            title: "¿Quieres eliminar este servicio para este contrato?",
            text: "El valor del servicio se restara, si este aún no ha sido cancelado",
            icon: "question",
            iconColor: "#f8c471",
            showCancelButton: true,
            confirmButtonColor: "#2874A6",
            cancelButtonColor: "#EC7063 ",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
            customClass: "question-contratar"
          }).then(function _callee15(result) {
            var contratado;
            return regeneratorRuntime.async(function _callee15$(_context28) {
              while (1) {
                switch (_context28.prev = _context28.next) {
                  case 0:
                    if (!result.isConfirmed) {
                      _context28.next = 8;
                      break;
                    }

                    _context28.next = 3;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("deleteContratadoDetalle", detalleDescontratar));

                  case 3:
                    contratado = _context28.sent;
                    console.log("Resultado de contratar el servicio: " + contratado);
                    mostrarEstadisticas(servicio.id); // servicioOpcionesdg(usuario, servicio);

                    _context28.next = 9;
                    break;

                  case 8:
                    servicioOpcionesdg(usuario, servicio);

                  case 9:
                  case "end":
                    return _context28.stop();
                }
              }
            });
          });

        case 2:
        case "end":
          return _context29.stop();
      }
    }
  });
};

var contratarServicio = function contratarServicio(servicioContratar, usuario, servicio) {
  return regeneratorRuntime.async(function contratarServicio$(_context31) {
    while (1) {
      switch (_context31.prev = _context31.next) {
        case 0:
          CerrarFormOpciones();
          Swal.fire({
            title: "¿Quieres aplicar este contrato a este servicio?",
            text: "El valor del servicio se aplicara en la planilla vigente.",
            icon: "question",
            iconColor: "#f8c471",
            showCancelButton: true,
            confirmButtonColor: "#2874A6",
            cancelButtonColor: "#EC7063 ",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar"
          }).then(function _callee16(result) {
            var contratado, _result3;

            return regeneratorRuntime.async(function _callee16$(_context30) {
              while (1) {
                switch (_context30.prev = _context30.next) {
                  case 0:
                    if (!result.isConfirmed) {
                      _context30.next = 17;
                      break;
                    }

                    dialogOpciones.style.width = "fit-content";
                    dialogOpciones.style.height = "fit-content"; // Aquí puedes realizar la acción que desees cuando el usuario confirme.

                    _context30.next = 5;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("createServicioContratado", servicioContratar, usuario.sociosId, servicio.IndividualSn));

                  case 5:
                    contratado = _context30.sent;
                    console.log("Resultado de contratar el servicio: " + contratado);

                    if (!(contratado !== undefined)) {
                      _context30.next = 14;
                      break;
                    }

                    console.log("Pasamos a crear Planilla o comprobante"); // Llamamos a  create planilla asi nos aseguramos de que en caso de no existir la planilla
                    // correspondiente a ese mes se la cree asi como tambien nos aseguramos de que el detalle
                    // no se aplique dos veces. Los detalles se aplicaran en las planillas vigentes de acuerdo
                    // al mes correspondiente.

                    _context30.next = 11;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("createPlanilla"));

                  case 11:
                    _result3 = _context30.sent;
                    // const resultComprobante = await ipcRenderer.invoke("createComprobante");
                    console.log(_result3); // console.log(resultComprobante);

                    mostrarEstadisticas(servicio.id); // servicioOpcionesdg(usuario, servicio);

                  case 14:
                    mostrarEstadisticas(servicio.id);
                    _context30.next = 18;
                    break;

                  case 17:
                    servicioOpcionesdg(usuario, servicio);

                  case 18:
                  case "end":
                    return _context30.stop();
                }
              }
            });
          });

        case 2:
        case "end":
          return _context31.stop();
      }
    }
  });
};

cancelarForm.onclick = function () {
  resetForm();
};

function mostrarFormOpciones() {
  console.log("MostrarFormOpciones");

  if (dialogOpciones.close) {
    dialogOpciones.showModal();
  }
}

function CerrarFormOpciones() {
  dialogOpciones.close();
} // funciones del navbar


var abrirInicio = function abrirInicio() {
  var url;
  return regeneratorRuntime.async(function abrirInicio$(_context32) {
    while (1) {
      switch (_context32.prev = _context32.next) {
        case 0:
          url = "src/ui/principal.html";
          _context32.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context32.stop();
      }
    }
  });
};

var abrirSocios = function abrirSocios() {
  var url;
  return regeneratorRuntime.async(function abrirSocios$(_context33) {
    while (1) {
      switch (_context33.prev = _context33.next) {
        case 0:
          url = "src/ui/socios.html";
          _context33.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context33.stop();
      }
    }
  });
};

var abrirUsuarios = function abrirUsuarios() {
  var url;
  return regeneratorRuntime.async(function abrirUsuarios$(_context34) {
    while (1) {
      switch (_context34.prev = _context34.next) {
        case 0:
          url = "src/ui/usuarios.html";
          _context34.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context34.stop();
      }
    }
  });
};

var abrirPagos = function abrirPagos() {
  var url;
  return regeneratorRuntime.async(function abrirPagos$(_context35) {
    while (1) {
      switch (_context35.prev = _context35.next) {
        case 0:
          url = "src/ui/planillas.html";
          _context35.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context35.stop();
      }
    }
  });
};

var abrirPlanillas = function abrirPlanillas() {
  var url;
  return regeneratorRuntime.async(function abrirPlanillas$(_context36) {
    while (1) {
      switch (_context36.prev = _context36.next) {
        case 0:
          url = "src/ui/planillas-cuotas.html";
          _context36.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context36.stop();
      }
    }
  });
};

var abrirParametros = function abrirParametros() {
  var url;
  return regeneratorRuntime.async(function abrirParametros$(_context37) {
    while (1) {
      switch (_context37.prev = _context37.next) {
        case 0:
          url = "src/ui/parametros.html";
          _context37.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context37.stop();
      }
    }
  });
};

var abrirImplementos = function abrirImplementos() {
  var url;
  return regeneratorRuntime.async(function abrirImplementos$(_context38) {
    while (1) {
      switch (_context38.prev = _context38.next) {
        case 0:
          url = "src/ui/implementos.html";
          _context38.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context38.stop();
      }
    }
  });
};

var abrirContratos = function abrirContratos() {
  var url;
  return regeneratorRuntime.async(function abrirContratos$(_context39) {
    while (1) {
      switch (_context39.prev = _context39.next) {
        case 0:
          url = "src/ui/medidores.html";
          _context39.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context39.stop();
      }
    }
  });
};

init();