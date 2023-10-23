"use strict";

// ----------------------------------------------------------------
// Librerias
// ----------------------------------------------------------------
var _require = require("electron"),
    ipcRenderer = _require.ipcRenderer;

var validator = require("validator");

var Swal = require("sweetalert2"); // ----------------------------------------------------------------


var servicioCreacion = document.getElementById("fechaCreacion");
var servicioNombre = document.getElementById("nombre");
var servicioDescripcion = document.getElementById("descripcion"); // const servicioTipo = document.getElementById("tipo");

var servicioValor = document.getElementById("valor");
var serviciosList = document.getElementById("servicios");
var usuariosList = document.getElementById("usuarios");
var buscarServicios = document.getElementById("buscarServicios");
var criterio = document.getElementById("criterio");
var criterioContent = document.getElementById("criterio-content"); // ----------------------------------------------------------------

var buscarBeneficiarios = document.getElementById("buscarBeneficiarios");
var criterioBn = document.getElementById("criterio-bn");
var criterioContentBn = document.getElementById("criterio-bn-content");
var servicioTit = document.getElementById("servicio-tit");
var servicioDesc = document.getElementById("servicio-desc");
var servicioDet = document.getElementById("servicio-det");
var servicioVal = document.getElementById("servicio-val");
var btnVolver = document.getElementById("btn-volver"); // ----------------------------------------------------------------
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
var btnReporte = document.getElementById("btnReporte");
var recaudaciones = [];
var servicios = [];
var usuarios = [];
var contratados = [];
var editingStatus = false;
var editServicioId = "";
servicioForm.addEventListener("submit", function _callee2(e) {
  var newServicio, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          e.preventDefault(); // var estadoParametro = "Innactivo";
          // if (parametroEstado.checked) {
          //   estadoParametro = "Activo";
          // }

          if (!validator.isEmpty(servicioCreacion.value)) {
            _context2.next = 6;
            break;
          }

          mensajeError.textContent = "Ingresa una fecha de creación válida.";
          servicioCreacion.focus();
          _context2.next = 30;
          break;

        case 6:
          if (!validator.isEmpty(servicioNombre.value)) {
            _context2.next = 11;
            break;
          }

          mensajeError.textContent = "El nombre del servicio es obligatorio.";
          servicioNombre.focus();
          _context2.next = 30;
          break;

        case 11:
          if (!validator.isEmpty(servicioDescripcion.value)) {
            _context2.next = 16;
            break;
          }

          mensajeError.textContent = "La descripcion del servicio es obligatoria.";
          servicioDescripcion.focus(); // } else if (validator.isEmpty(servicioTipo.value)) {
          //   mensajeError.textContent = "El tipo de servicio es obligatorio.";
          //   servicioTipo.focus();
          // }

          _context2.next = 30;
          break;

        case 16:
          if (!validator.isEmpty(servicioValor.value)) {
            _context2.next = 21;
            break;
          }

          mensajeError.textContent = "El valor el servicio es obligatorio.";
          servicioValor.focus();
          _context2.next = 30;
          break;

        case 21:
          newServicio = {
            fechaCreacion: servicioCreacion.value,
            nombre: servicioNombre.value,
            descripcion: servicioDescripcion.value,
            tipo: "Servicio fijo",
            valor: servicioValor.value,
            aplazableSn: "No",
            numeroPagos: 1,
            valorPagos: servicioValor.value,
            individualSn: "Si",
            valoresDistintosSn: "No"
          };

          if (editingStatus) {
            _context2.next = 29;
            break;
          }

          _context2.next = 25;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("createServiciosFijos", newServicio));

        case 25:
          result = _context2.sent;
          console.log(result);
          _context2.next = 30;
          break;

        case 29:
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
                      _context.next = 4;
                      break;
                    }

                    _context.next = 3;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("updateServiciosFijos", editServicioId, newServicio));

                  case 3:
                    _result = _context.sent;

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  });
});

function renderServiciosFijos(serviciosFijos) {
  serviciosList.innerHTML = "";
  serviciosFijos.forEach(function (servicioFijo) {
    var divContainer = document.createElement("div");
    divContainer.className = "col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-1";
    divContainer.style.height = "fit-content";
    divContainer.style.maxHeight = "fit-content";
    var divCol6 = document.createElement("div");
    divCol6.className = "clase col-6 card  card-servicios";
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
    h6CardTitle.textContent = servicioFijo.nombre;
    divContainerTitle.appendChild(h6CardTitle);
    var divContainerSocios = document.createElement("div");
    divContainerSocios.className = "row container-socios d-flex align-items-center";
    var pDescription = document.createElement("p");
    pDescription.textContent = servicioFijo.descripcion;
    divContainerSocios.appendChild(pDescription);
    var divContainerDetalles = document.createElement("div");
    divContainerDetalles.className = "row container-detalles";
    var detalles = [{
      label: "Valor:$",
      value: parseFloat(servicioFijo.valor).toFixed(2)
    }, {
      label: "Tipo:",
      value: servicioFijo.tipo
    }, {
      label: "Aplazable:",
      value: servicioFijo.aplazableSn
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
      console.log("Estadisticas del servicio: " + servicioFijo.id);
      mostrarEstadisticas(servicioFijo.id);
      mostrarSeccion("seccion2");
    };

    divCol1.appendChild(btnEditServicio);

    btnEditServicio.onclick = function () {
      console.log("Editar ...");
      console.log("Detalles del servicio: " + servicioFijo.id);
      editServicio(servicioFijo.id);
    };

    divCol1.appendChild(btnDeleteServicio);
    divCol1.appendChild(btnEstadistics); // Se puede crear botones con un ciclo forEach pero, no son muy manejables
    // buttons.forEach((iconClass) => {
    //   const button = document.createElement("button");
    //   button.className =
    //     "btn-servicios-custom d-flex justify-content-center align-items-center";
    //   const icon = document.createElement("i");
    //   icon.className = `fa ${iconClass}`;
    //   button.appendChild(icon);
    //   divCol1.appendChild(button);
    // });

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
      console.log("Editar ...");
      console.log("Detalles del servicio: " + servicioFijo.id);
      editServicio(servicioFijo.id);
    };

    serviciosList.appendChild(divContainer);
  });
}

function renderUsuarios(usuarios, servicioId) {
  var ct, contratadosId;
  return regeneratorRuntime.async(function renderUsuarios$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          ct = [];
          _context4.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratadosById", servicioId));

        case 3:
          contratadosId = _context4.sent;
          console.log("Contratados: " + contratadosId);
          contratadosId.forEach(function (contratadoId) {
            ct.push(contratadoId.contratosId);
          });
          contratados = console.log("Contratados", contratados); // await getContratados(servicioId);

          usuariosList.innerHTML = "";
          usuarios.forEach(function _callee3(usuario) {
            var divCol4, divRowG0, divCol2, img, divCol8, divCardBody, containerTitle, h6Contrato, pContrato, pContratoValue, containerSocios, h6Socio, pSocio, pSocioValue, divCol2Estado, divEstado, pEstado, divCustomCheckbox, inputCheckbox, labelCheckbox, iCheckbox;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    divCol4 = document.createElement("div");
                    divCol4.className = "col-4 card mx-2 my-2";
                    divCol4.style.maxWidth = "30%";
                    divCol4.style.width = "30%";
                    divCol4.style.height = "fit-content";
                    divCol4.style.maxHeight = "fit-content";
                    divRowG0 = document.createElement("div");
                    divRowG0.className = "row g-0";
                    divCol2 = document.createElement("div");
                    divCol2.className = "col-2 d-flex justify-content-center align-items-center";
                    img = document.createElement("img");
                    img.src = "../assets/fonts/usuario-rounded48x48.png";
                    img.className = "img-fluid rounded-start";
                    img.alt = "not found";
                    divCol2.appendChild(img);
                    divCol8 = document.createElement("div");
                    divCol8.className = "col-8 d-flex justify-content-center align-items-center text-center";
                    divCardBody = document.createElement("div");
                    divCardBody.className = "card-body text-center";
                    containerTitle = document.createElement("div");
                    containerTitle.className = "d-flex align-items-baseline container-title";
                    h6Contrato = document.createElement("h6");
                    h6Contrato.className = "card-title";
                    h6Contrato.textContent = "Contrato:";
                    pContrato = document.createElement("p");
                    pContrato.className = "text-white";
                    pContrato.textContent = "-";
                    pContratoValue = document.createElement("p");
                    pContratoValue.textContent = usuario.codigo;
                    containerTitle.appendChild(h6Contrato);
                    containerTitle.appendChild(pContrato);
                    containerTitle.appendChild(pContratoValue);
                    containerSocios = document.createElement("div");
                    containerSocios.className = "container-socios d-flex align-items-baseline";
                    h6Socio = document.createElement("h6");
                    h6Socio.textContent = "Socio:";
                    pSocio = document.createElement("p");
                    pSocio.className = "text-white";
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
                    divCol2Estado.className = "col-2 flex-column d-flex align-items-center ";
                    divEstado = document.createElement("div");
                    divEstado.className = "col-12 text-center";
                    pEstado = document.createElement("p");
                    pEstado.className = "mt-3";
                    pEstado.innerHTML = "<small>Estado</small>";
                    divCustomCheckbox = document.createElement("div");
                    divCustomCheckbox.className = "custom-checkbox d-flex justify-content-center align-items-center";
                    divCustomCheckbox.style.marginTop = "0";
                    divCustomCheckbox.style.padding = "0 25%";
                    divCustomCheckbox.style.width = "100%";
                    inputCheckbox = document.createElement("input");
                    inputCheckbox.type = "checkbox";
                    inputCheckbox.className = "circular-checkbox ";
                    console.log("Cotratados comparar: " + ct);

                    if (ct.includes(usuario.contratosId)) {
                      inputCheckbox.checked = true;
                    } else {
                      inputCheckbox.checked = false;
                    }

                    inputCheckbox.style.width = "40%";
                    inputCheckbox.style.height = "40%";
                    inputCheckbox.disabled = true;
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
                    usuariosList.appendChild(divCol4);

                  case 83:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          });

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
} // function renderServicios(servicios) {
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
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getServiciosFijosById", id));

        case 2:
          servicio = _context5.sent;
          servicioCreacion.value = formatearFecha(servicio.fechaCreacion);
          servicioNombre.value = servicio.nombre;
          servicioDescripcion.value = servicio.descripcion; // if (parametro.estado == "Activo") {
          //   parametroEstado.checked=true;
          // } else {
          //   parametroEstado.checked = false;
          // }
          //servicioTipo.value = servicio.tipo;

          servicioValor.value = servicio.valor;
          editingStatus = true;
          editServicioId = servicio.id;
          console.log(servicio);

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var deleteServicio = function deleteServicio(id) {
  return regeneratorRuntime.async(function deleteServicio$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          Swal.fire({
            title: "¿Quieres borrar el servicio " + socioNombre + " ?",
            text: "No podrás deshacer esta acción.",
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
                    console.log("id from parametros.js");
                    _context6.next = 4;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("deleteServiciosFijos", id));

                  case 4:
                    _result2 = _context6.sent;
                    console.log("Resultado servicios.js", _result2);

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
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getServiciosFijosById", servicioId));

        case 2:
          servicio = _context8.sent;
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
          _context8.next = 16;
          return regeneratorRuntime.awrap(getBeneficiarios(criterioBuscar, criterioContentBuscar, servicioId));

        case 16:
          _context8.next = 18;
          return regeneratorRuntime.awrap(getRecaudaciones(servicioId));

        case 18:
        case "end":
          return _context8.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que muestra los estados de recaudacion de un servic.
// ----------------------------------------------------------------


var getRecaudaciones = function getRecaudaciones() {
  var valoresRecaudados, valoresPendientes, valoresTotales, fechaDesde, fechaHasta, anioD, mesD, anioH, mesH, diaD, diaH, _diaD, _diaD2;

  return regeneratorRuntime.async(function getRecaudaciones$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
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

          _context9.next = 13;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getRecaudaciones", editServicioId, fechaDesde, fechaHasta));

        case 13:
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

        case 20:
        case "end":
          return _context9.stop();
      }
    }
  });
};

var getBeneficiarios = function getBeneficiarios(criterio, criterioContent, servicioId) {
  return regeneratorRuntime.async(function getBeneficiarios$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratos", criterio, criterioContent));

        case 2:
          usuarios = _context10.sent;
          console.log("Beneficiarios: ", usuarios);
          renderUsuarios(usuarios, servicioId);

        case 5:
        case "end":
          return _context10.stop();
      }
    }
  });
};

var getServicios = function getServicios(criterio, criterioContent) {
  return regeneratorRuntime.async(function getServicios$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getServiciosFijos", criterio, criterioContent));

        case 2:
          servicios = _context11.sent;
          console.log(servicios);
          renderServiciosFijos(servicios);

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
}; // const getContratados = async (servicioId) => {
//   // Buscamos los contratos que hayan contratado el servicio segun el id del servicio
//   // que se recibe!
//   const contratadosId = await ipcRenderer.invoke(
//     "getContratadosById",
//     servicioId
//   );
//   contratadosId.forEach((contratadoId) => {
//     contratados.push(contratadoId.id);
//   });
//   contratados = console.log("Contratados", contratados);
// };


function init() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function init$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          fechaCreacion.value = formatearFecha(new Date());
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

ipcRenderer.on("datos-a-servicios", function _callee11() {
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
  } else if (response.title === "Usuario eliminado!") {
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

        case 7:
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
          fechaCreacion.value = formatearFecha(new Date());

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
} // btnReporte.onclick = async () => {
//   await abrirConsolidado();
// };
// Ejemplo: Obtener el primer y último día de septiembre de 2023


var resultado = obtenerPrimerYUltimoDiaDeMes("2023", 1); // 8 representa septiembre (0-indexed)

console.log("Primer día:", formatearFecha(resultado.primerDia));
console.log("Último día:", formatearFecha(resultado.ultimoDia));

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

function vistaFactura() {
  var datos, encabezado, datosTotales;
  return regeneratorRuntime.async(function vistaFactura$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
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
          _context22.next = 5;
          return regeneratorRuntime.awrap(ipcRenderer.send("datos-a-pagina3", datos, encabezado, recaudaciones, datosTotales));

        case 5:
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
} // funciones del navbar


var abrirInicio = function abrirInicio() {
  var url;
  return regeneratorRuntime.async(function abrirInicio$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          url = "src/ui/principal.html";
          _context23.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context23.stop();
      }
    }
  });
};

var abrirSocios = function abrirSocios() {
  var url;
  return regeneratorRuntime.async(function abrirSocios$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          url = "src/ui/socios.html";
          _context24.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context24.stop();
      }
    }
  });
};

var abrirUsuarios = function abrirUsuarios() {
  var url;
  return regeneratorRuntime.async(function abrirUsuarios$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          url = "src/ui/usuarios.html";
          _context25.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context25.stop();
      }
    }
  });
};

var abrirPagos = function abrirPagos() {
  var url;
  return regeneratorRuntime.async(function abrirPagos$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          url = "src/ui/planillas.html";
          _context26.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context26.stop();
      }
    }
  });
};

var abrirPlanillas = function abrirPlanillas() {
  var url;
  return regeneratorRuntime.async(function abrirPlanillas$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          url = "src/ui/planillas-cuotas.html";
          _context27.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context27.stop();
      }
    }
  });
};

var abrirParametros = function abrirParametros() {
  var url;
  return regeneratorRuntime.async(function abrirParametros$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          url = "src/ui/parametros.html";
          _context28.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context28.stop();
      }
    }
  });
};

var abrirImplementos = function abrirImplementos() {
  var url;
  return regeneratorRuntime.async(function abrirImplementos$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          url = "src/ui/implementos.html";
          _context29.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context29.stop();
      }
    }
  });
};

var abrirContratos = function abrirContratos() {
  var url;
  return regeneratorRuntime.async(function abrirContratos$(_context30) {
    while (1) {
      switch (_context30.prev = _context30.next) {
        case 0:
          url = "src/ui/medidores.html";
          _context30.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context30.stop();
      }
    }
  });
};

var abrirConsolidado = function abrirConsolidado() {
  var url;
  return regeneratorRuntime.async(function abrirConsolidado$(_context31) {
    while (1) {
      switch (_context31.prev = _context31.next) {
        case 0:
          url = "src/ui/consolidado.html";
          _context31.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context31.stop();
      }
    }
  });
};

init();