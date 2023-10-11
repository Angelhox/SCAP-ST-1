"use strict";

// ----------------------------------------------------------------
// Librerias
// ----------------------------------------------------------------
var _require = require("electron"),
    ipcRenderer = _require.ipcRenderer;

var validator = require("validator");

var Swal = require("sweetalert2"); // ----------------------------------------------------------------


var servicioNombre = document.getElementById("nombre");
var servicioDescripcion = document.getElementById("descripcion"); // const servicioTipo = document.getElementById("tipo");

var servicioValor = document.getElementById("valor");
var servicioAplazableSn = document.getElementById("aplazablesn");
var serviciosList = document.getElementById("servicios");
var servicioCreacion = document.getElementById("fechacreacion");
var usuariosList = document.getElementById("usuarios");
var buscarServicios = document.getElementById("buscarServicios");
var criterio = document.getElementById("criterio");
var criterioContent = document.getElementById("criterio-content");
var aplazableOptions = document.getElementById("aplazable-options");
var numeroPagos = document.getElementById("numero-pagos");
var valorPagos = document.getElementById("valor-pagos");
var servicioIndividualSn = document.getElementById("individualSn");
var servicioCreacionBn = document.getElementById("fechaCreacion-bn");
var servicioNombreBn = document.getElementById("nombre-bn");
var servicioDescripcionBn = document.getElementById("descripcion-bn");
var servicioValorBn = document.getElementById("valor-bn");
var buscarBeneficiarios = document.getElementById("buscarBeneficiarios");
var criterioBn = document.getElementById("criterio-bn");
var criterioContentBn = document.getElementById("criterio-bn-content");
var porContratar = [];
var servicios = [];
var valorIndividual = 0.0;
var editingStatus = false;
var editServicioId = "";
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
          _context2.next = 25;
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

          _context2.next = 25;
          break;

        case 11:
          if (!validator.isEmpty(servicioValor.value)) {
            _context2.next = 16;
            break;
          }

          mensajeError.textContent = "El valor el servicio es obligatorio.";
          servicioValor.focus();
          _context2.next = 25;
          break;

        case 16:
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
            valoresDistintosSn: "No"
          };

          if (editingStatus) {
            _context2.next = 24;
            break;
          }

          _context2.next = 20;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("createCuotas", newCuota));

        case 20:
          result = _context2.sent;
          console.log(result);
          _context2.next = 25;
          break;

        case 24:
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

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  });
});

function renderCuotas(cuotas) {
  serviciosList.innerHTML = "";
  cuotas.forEach(function (cuota) {
    var divCol6 = document.createElement("div");
    divCol6.className = "col-6 card mx-2 my-2 card-servicios";
    divCol6.style.width = "48%";
    divCol6.style.maxWidth = "48%";
    divCol6.style.height = "fit-content";
    divCol6.style.maxHeight = "fit-content";
    divCol6.style.margin = "0";
    var divRowG0 = document.createElement("div");
    divRowG0.className = "row g-0";
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
      label: "Valor:",
      value: cuota.valor
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
      var h6Label = document.createElement("h6");
      h6Label.textContent = detalle.label;
      var pValue = document.createElement("p");
      pValue.textContent = detalle.value;
      divDetalle.appendChild(h6Label);
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
    serviciosList.appendChild(divCol6);
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
          }); // contratados = console.log("Contratados", contratados);
          // await getContratados(servicioId);

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
                    inputCheckbox.style.height = "40%"; // inputCheckbox.disabled = true;
                    // await let contratosIds = usuario.contratosId;
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
                    usuariosList.appendChild(divCol4);

                  case 83:
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
}

var contratar = function contratar() {
  return regeneratorRuntime.async(function contratar$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          porContratar.forEach(function _callee4(contratando) {
            var contratado;
            return regeneratorRuntime.async(function _callee4$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    newServicioContratado = {
                      fechaEmision: formatearFecha(new Date()),
                      estado: "Sin aplicar",
                      serviciosId: editServicioId,
                      contratosId: contratando,
                      descuentosId: 1,
                      valorIndividual: valorIndividual
                    };
                    _context5.next = 3;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("createSercicioContratado", newServicioContratado));

                  case 3:
                    contratado = _context5.sent;
                    return _context5.abrupt("return", contratado);

                  case 5:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          });

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
}; // function renderServicios(servicios) {
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
  return regeneratorRuntime.async(function editServicio$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getCuotasById", id));

        case 2:
          servicio = _context7.sent;
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

          if (!servicio.numeroPagos == "null") {
            numeroPagos.value = servicio.numeroPagos;
          }

          servicioValor.value = servicio.valor;
          valorPagos.value = servicio.valorPagos;
          editingStatus = true;
          editServicioId = servicio.id;
          console.log(servicio);

        case 15:
        case "end":
          return _context7.stop();
      }
    }
  });
};

var deleteServicio = function deleteServicio(id, servicioNombre) {
  return regeneratorRuntime.async(function deleteServicio$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
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
          }).then(function _callee5(result) {
            var _result2;

            return regeneratorRuntime.async(function _callee5$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    if (!result.isConfirmed) {
                      _context8.next = 6;
                      break;
                    }

                    // Aquí puedes realizar la acción que desees cuando el usuario confirme.
                    console.log("id from parametros.js"); // Eliminamos el registro de la tabla servicios de tipo ocacional.

                    _context8.next = 4;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("deleteCuotas", id));

                  case 4:
                    _result2 = _context8.sent;
                    console.log("Resultado parametros.js", _result2);

                  case 6:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          });

        case 1:
        case "end":
          return _context9.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que muestra las estadisticas de un servicio
// ----------------------------------------------------------------


var mostrarEstadisticas = function mostrarEstadisticas(servicioId) {
  var servicio, criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function mostrarEstadisticas$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getCuotasById", servicioId));

        case 2:
          servicio = _context10.sent;
          console.log("Estadisticas: " + servicio);
          servicioCreacionBn.value = formatearFecha(servicio.fechaCreacion);
          servicioNombreBn.value = servicio.nombre;
          servicioDescripcionBn.value = servicio.descripcion;
          servicioValorBn.value = servicio.valor;
          editingStatus = true;
          editServicioId = servicio.id;
          valorIndividual = servicio.valor;
          console.log(servicio);
          criterioBuscar = "all";
          criterioContentBuscar = "all";
          _context10.next = 16;
          return regeneratorRuntime.awrap(getBeneficiarios(criterioBuscar, criterioContentBuscar, servicioId));

        case 16:
        case "end":
          return _context10.stop();
      }
    }
  });
};

var getBeneficiarios = function getBeneficiarios(criterio, criterioContent, servicioId) {
  return regeneratorRuntime.async(function getBeneficiarios$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratos", criterio, criterioContent));

        case 2:
          usuarios = _context11.sent;
          console.log("Beneficiarios: ", usuarios);
          renderUsuarios(usuarios, servicioId);

        case 5:
        case "end":
          return _context11.stop();
      }
    }
  });
};

criterio.onchange = function _callee6() {
  var criterioSeleccionado, criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function _callee6$(_context12) {
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

buscarServicios.onclick = function _callee7() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function _callee7$(_context13) {
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

criterioBn.onchange = function _callee8() {
  var criterioSeleccionado, criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function _callee8$(_context14) {
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

buscarBeneficiarios.onclick = function _callee9() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function _callee9$(_context15) {
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

var getServicios = function getServicios() {
  return regeneratorRuntime.async(function getServicios$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getCuotas"));

        case 2:
          cuotas = _context16.sent;
          console.log(cuotas);
          renderCuotas(cuotas);

        case 5:
        case "end":
          return _context16.stop();
      }
    }
  });
};

function init() {
  return regeneratorRuntime.async(function init$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          servicioCreacion.value = formatearFecha(new Date());
          _context17.next = 3;
          return regeneratorRuntime.awrap(getServicios());

        case 3:
        case "end":
          return _context17.stop();
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

ipcRenderer.on("datos-a-ocacionales", function _callee10() {
  var datos;
  return regeneratorRuntime.async(function _callee10$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("pido-datos"));

        case 2:
          datos = _context18.sent;
          console.log("Estos: " + datos.id);
          mostrarEstadisticas(datos.id);
          mostrarSeccion("seccion2"); // console.log("Id recibido: " + servicioRv.id);
          // await mostrarEstadisticas(servicioRv.id);
          // mostrarSeccion("seccion2");

        case 6:
        case "end":
          return _context18.stop();
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
  return regeneratorRuntime.async(function resetFormAfterUpdate$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          criterioBuscar = criterio.value;
          criterioContentBuscar = criterioContent.value;
          console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
          console;
          _context19.next = 6;
          return regeneratorRuntime.awrap(getServicios(criterioBuscar, criterioContentBuscar));

        case 6:
          mensajeError.textContent = "";

        case 7:
        case "end":
          return _context19.stop();
      }
    }
  });
}

function resetFormAfterSave() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function resetFormAfterSave$(_context20) {
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
          editingStatus = false;
          editServicioId = "";
          servicioForm.reset();
          mensajeError.textContent = "";
          servicioCreacion.value = formatearFecha(new Date());

        case 11:
        case "end":
          return _context20.stop();
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

function formatearFecha(fecha) {
  var fechaOriginal = new Date(fecha);
  var year = fechaOriginal.getFullYear();
  var month = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
  var day = String(fechaOriginal.getDate()).padStart(2, "0");
  var fechaFormateada = "".concat(year, "-").concat(month, "-").concat(day);
  return fechaFormateada;
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
  return regeneratorRuntime.async(function abrirInicio$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          url = "src/ui/principal.html";
          _context21.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context21.stop();
      }
    }
  });
};

var abrirSocios = function abrirSocios() {
  var url;
  return regeneratorRuntime.async(function abrirSocios$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          url = "src/ui/socios.html";
          _context22.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context22.stop();
      }
    }
  });
};

var abrirUsuarios = function abrirUsuarios() {
  var url;
  return regeneratorRuntime.async(function abrirUsuarios$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          url = "src/ui/usuarios.html";
          _context23.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context23.stop();
      }
    }
  });
};

var abrirPagos = function abrirPagos() {
  var url;
  return regeneratorRuntime.async(function abrirPagos$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          url = "src/ui/planillas.html";
          _context24.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context24.stop();
      }
    }
  });
};

var abrirPlanillas = function abrirPlanillas() {
  var url;
  return regeneratorRuntime.async(function abrirPlanillas$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          url = "src/ui/planillas-cuotas.html";
          _context25.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context25.stop();
      }
    }
  });
};

var abrirParametros = function abrirParametros() {
  var url;
  return regeneratorRuntime.async(function abrirParametros$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          url = "src/ui/parametros.html";
          _context26.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context26.stop();
      }
    }
  });
};

var abrirImplementos = function abrirImplementos() {
  var url;
  return regeneratorRuntime.async(function abrirImplementos$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          url = "src/ui/implementos.html";
          _context27.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context27.stop();
      }
    }
  });
};

var abrirContratos = function abrirContratos() {
  var url;
  return regeneratorRuntime.async(function abrirContratos$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          url = "src/ui/medidores.html";
          _context28.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context28.stop();
      }
    }
  });
};

init();