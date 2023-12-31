"use strict";

var _require = require("electron"),
    ipcRenderer = _require.ipcRenderer,
    electron = _require.electron,
    remote = _require.remote;

var Swal = require("sweetalert2");

var validator = require("validator"); // const { Notification } = remote;
// ----------------------------------------------------------------
// Librerias
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Variables funciones
// ----------------------------------------------------------------


var mensajeError = document.getElementById("mensajeError");
var editingStatus = false; // ----------------------------------------------------------------
// Variables del contrato
// ----------------------------------------------------------------

var contratoCodigo = document.getElementById("codigocontrato");
var contratoFecha = document.getElementById("fechaContrato");
var contratoEstado = document.getElementById("estadoContrato");
var labelEstadoContrato = document.getElementById("labelEstadoContrato");
var contratoPrincipalSn = document.getElementById("principalSn");
var serviciosCompartidos = document.getElementById("serviciosCompartidos"); //Indica si se ha seleccionado el servicio de agua con medidor

var contratoConMedidor = false; // Tabla de contratos con medidor

var contratosList = document.getElementById("contratosconmedidor"); // Tabla de contratos sin medidor

var contratosSinMedidorList = document.getElementById("contratossinmedidor"); // ----------------------------------------------------------------
// Variables de los servicios
// ----------------------------------------------------------------
// Tabla de servicios disponibles para el contrato

var servicosDisponiblesList = document.getElementById("servicios-disponibles"); // Tabla de servicios contratados se muestran segun el contrato seleccionado

var serviciosContratadosList = document.getElementById("servicios-contratados"); // Arreglo para almacenar los servicios disponibles|

var serviciosDisponibles = []; // Variable que indica los servicios contratados para editar

var serviciosEditar = null; // Variable que almacena id de los servicios que se van a contratar

var serviciosDisponiblesAContratar = []; // VAriable  para validar si se ha seleccionado al menos un servicio a contratar.

var serviciosMarcados = [];
var sectorId = "";
var numero = "1"; // ----------------------------------------------------------------
// Variables del socio contratante
// ----------------------------------------------------------------

var socioContratanteCedula = document.getElementById("cedulaSocioContratante");
var socioContratanteNombre = document.getElementById("nombreSocioContratante");
var socioContratanteApellido = document.getElementById("apellidoSocioContratante"); // Indica si se va a editar el contrato

var socioContratanteId = ""; // Obtiene el id del contrato que se esta manipulando

var contratoId = ""; // ----------------------------------------------------------------
// Variables del medidor
// ----------------------------------------------------------------

var medidorInstalacion = document.getElementById("fechaInstalacion");
var medidorMarca = document.getElementById("marca");
var medidorBarrio = document.getElementById("barrio");
var medidorPrincipal = document.getElementById("principal");
var medidorSecundaria = document.getElementById("secundaria");
var medidorNumeroCasa = document.getElementById("numerocasa");
var medidorReferencia = document.getElementById("referencia");
var medidorObservacion = document.getElementById("observacion");
var errorContainer = document.getElementById("container-error");
var medidorSinMedidor = document.getElementById("medidorSinMedidor");
var conMedidor = document.getElementById("conMedidor");
var sinMedidor = document.getElementById("sinMedidor");
var titleContratos = document.getElementById("title-contratos"); //Variable que indica el medidor a editar Borrar

var editContratoId = "";
var editSocioId = ""; // ----------------------------------------------------------------
// Variables componentes del formulario.
// ----------------------------------------------------------------

var cancelarContrato = document.getElementById("cancelar-contrato");
var generarCodigoBt = document.getElementById("generar-codigo");
var listaSugerencias = document.getElementById("lista-sugerencias");
var sugerencias = []; // ----------------------------------------------------------------
// Esta funcion obtiene los id de los servicios disponibles
// los manipula como elementos del DOM asignandoles el evento de marcado y desmarcado
// para validar si se ha seleccionado al menos un servicio a contratar.
// ----------------------------------------------------------------

function eventoServiciosId(serviciosFijos) {
  return regeneratorRuntime.async(function eventoServiciosId$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('Servicios here: ' + serviciosFijos);
          serviciosFijos.forEach(function (servicioFijo) {
            document.getElementById(servicioFijo.id).addEventListener("change", function (event) {
              if (servicioFijo.nombre == "Agua Potable") {
                if (event.target.checked) {
                  habilitarFormMedidor();
                  contratoConMedidor = true;
                  serviciosMarcados.push(servicioFijo);
                  console.log("Servicios Marcados: ", serviciosMarcados);
                  console.log("Marcado Agua: " + servicioFijo.nombre);
                } else {
                  // inHabilitarFormMedidor();
                  contratoConMedidor = false;
                  var idABuscar = servicioFijo.id; //--> El ID que deseas buscar y eliminar

                  var elementoAEliminar = serviciosMarcados.find(function (elemento) {
                    return elemento.id === idABuscar;
                  });

                  if (elementoAEliminar) {
                    //--> Si se encontró el elemento, elimínalo
                    var indiceAEliminar = serviciosMarcados.indexOf(elementoAEliminar);
                    serviciosMarcados.splice(indiceAEliminar, 1);
                    console.log("Elemento con ID ".concat(idABuscar, " ha sido eliminado."));
                  } else {
                    console.log("Elemento con ID ".concat(idABuscar, " no se encontr\xF3 en el arreglo."));
                  }

                  console.log("Servicios Marcados: ", serviciosMarcados); //--> El arreglo actualizado sin el elemento eliminado

                  console.log("Desmarcado Agua: " + servicioFijo.nombre);
                }
              } else {
                if (event.target.checked) {
                  serviciosMarcados.push(servicioFijo);
                  console.log("Servicios Marcados: ", serviciosMarcados);
                  console.log("Marcado: " + servicioFijo.nombre);
                } else {
                  console.log("Desmarcado: " + servicioFijo.nombre);
                  var _idABuscar = servicioFijo.id; //--> El ID que deseas buscar y eliminar

                  var _elementoAEliminar = serviciosMarcados.find(function (elemento) {
                    return elemento.id === _idABuscar;
                  });

                  if (_elementoAEliminar) {
                    //--> Si se encontró el elemento, elimínalo
                    var _indiceAEliminar = serviciosMarcados.indexOf(_elementoAEliminar);

                    serviciosMarcados.splice(_indiceAEliminar, 1);
                    console.log("Elemento con ID ".concat(_idABuscar, " ha sido eliminado."));
                  } else {
                    console.log("Elemento con ID ".concat(_idABuscar, " no se encontr\xF3 en el arreglo."));
                  }

                  console.log("Servicios Marcados: ", serviciosMarcados); //--> El arreglo actualizado sin el elemento eliminado
                }
              }
            });
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
} // ----------------------------------------------------------------
// Funcion donde se validan e ingresan datos del contratato de los servicios a contratar
// ademas del medidor de ser necesario.
// ----------------------------------------------------------------


contratoForm.addEventListener("submit", function _callee(e) {
  var newMedidor, contratoEstadoDf, medidorDf, callePrincipalDf, calleSecundariaDf, numeroCasaDf, observacionDf, principalDf, serviciosCompartidosDf, _newContrato, fakeMedidor, resultContrato, result, _resultContrato, resultMedidor;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          e.preventDefault();
          newMedidor = {};

          if (!(validator.isEmpty(socioContratanteCedula.value) || validator.isEmpty(socioContratanteNombre.value) || validator.isEmpty(socioContratanteApellido.value))) {
            _context2.next = 8;
            break;
          }

          errorContainer.style.color = "red";
          mensajeError.textContent = "Ingresa un número de cédula correspondiente a un socio registrado.";
          socioContratanteCedula.focus();
          _context2.next = 105;
          break;

        case 8:
          if (!validator.isEmpty(contratoFecha.value)) {
            _context2.next = 14;
            break;
          }

          errorContainer.style.color = "red";
          mensajeError.textContent = "Ingresa una fecha de contrato válida.";
          contratoFecha.focus();
          _context2.next = 105;
          break;

        case 14:
          if (!validator.isEmpty(contratoCodigo.value)) {
            _context2.next = 20;
            break;
          }

          errorContainer.style.color = "red";
          mensajeError.textContent = "Genera un código de contrato válido.";
          contratoCodigo.focus(); // } else if (validator.isEmpty(medidorNumeroCasa.value)) {
          //   mensajeError.textContent = "Ingresa un numero de casa válido.";
          //   medidorNumeroCasa.focus();

          _context2.next = 105;
          break;

        case 20:
          if (!validator.isEmpty(medidorBarrio.value)) {
            _context2.next = 26;
            break;
          }

          errorContainer.style.color = "red";
          mensajeError.textContent = "Genera un código de contrato para indicar un barrio válido.";
          medidorBarrio.focus(); // } else if (validator.isEmpty(medidorPrincipal.value)) {
          //   mensajeError.textContent = "Ingresa una calle principal válida.";
          //   medidorPrincipal.focus();
          // } else if ( validator.isEmpty(medidorSecundaria.value)) {
          //   mensajeError.textContent = "Ingresa una calle secundaria válida.";
          //   medidorSecundaria.focus();

          _context2.next = 105;
          break;

        case 26:
          if (!validator.isEmpty(medidorReferencia.value)) {
            _context2.next = 32;
            break;
          }

          errorContainer.style.color = "red";
          mensajeError.textContent = "Ingresa una referencia válida.";
          medidorReferencia.focus();
          _context2.next = 105;
          break;

        case 32:
          if (!(contratoConMedidor && validator.isEmpty(medidorInstalacion.value))) {
            _context2.next = 38;
            break;
          }

          errorContainer.style.color = "red";
          mensajeError.textContent = "Ingresa una fecha de instalación válida.";
          medidorInstalacion.focus();
          _context2.next = 105;
          break;

        case 38:
          if (!(contratoConMedidor && validator.isEmpty(medidorMarca.value))) {
            _context2.next = 44;
            break;
          }

          errorContainer.style.color = "red";
          mensajeError.textContent = "Ingresa una marca del medidor.";
          medidorMarca.focus(); // } else if (
          //   contratoConMedidor &&
          //   validator.isEmpty(medidorObservacion.value)
          // ) {
          //   mensajeError.textContent = "Ingresa una observación válida.";
          //   medidorObservacion.focus();
          // } else if (serviciosDisponiblesAContratar.length === 0) {
          //   errorContainer.style.color = "red";
          //   mensajeError.textContent = "Selecciona al menos un servicio a contratar.";
          // } else if (serviciosMarcados.length === 0) {
          //   errorContainer.style.color = "red";
          //   mensajeError.textContent = "Selecciona al menos un servicio a contratar.";

          _context2.next = 105;
          break;

        case 44:
          console.log("Servicios a contratar: " + serviciosDisponiblesAContratar);

          if (!(!socioContratanteId == "")) {
            _context2.next = 104;
            break;
          }

          contratoEstadoDf = "Activo";
          medidorDf = "No";
          callePrincipalDf = "SN";
          calleSecundariaDf = "SN";
          numeroCasaDf = "SN";
          observacionDf = "NA";
          principalDf = "Si";
          serviciosCompartidosDf = 0;

          if (contratoConMedidor) {
            medidorDf = "Si";
          }

          if (contratoEstado.checked = true) {
            contratoEstadoDf = "Activo";
          }

          if (!validator.isEmpty(medidorNumeroCasa.value)) {
            numeroCasaDf = medidorNumeroCasa.value;
          }

          if (!validator.isEmpty(medidorPrincipal.value)) {
            callePrincipalDf = medidorPrincipal.value;
          }

          if (!validator.isEmpty(medidorSecundaria.value)) {
            calleSecundariaDf = medidorSecundaria.value;
          }

          if (!validator.isEmpty(medidorObservacion.value)) {
            observacionDf = medidorObservacion.value;
          }

          if (!validator.isEmpty(contratoPrincipalSn.value)) {
            principalDf = contratoPrincipalSn.value;
          }

          if (serviciosCompartidos.value !== "0") {
            serviciosCompartidosDf = parseInt(serviciosCompartidos.value);
          }

          newMedidor = {
            codigo: contratoCodigo.value,
            fechaInstalacion: medidorInstalacion.value,
            marca: medidorMarca.value,
            observacion: observacionDf,
            // barrio: medidorBarrio.value,
            // callePrincipal: medidorPrincipal.value,
            // calleSecundaria: medidorSecundaria.value,
            // numeroCasa: medidorNumeroCasa.value,
            // referencia: medidorReferencia.value,
            contratosId: contratoId
          };
          _newContrato = {
            fecha: contratoFecha.value,
            estado: contratoEstadoDf,
            codigo: contratoCodigo.value,
            sociosId: socioContratanteId,
            medidorSn: medidorDf,
            barrio: medidorBarrio.value,
            callePrincipal: callePrincipalDf,
            calleSecundaria: calleSecundariaDf,
            numeroCasa: numeroCasaDf,
            referencia: medidorReferencia.value,
            principalSn: principalDf,
            serviciosCompartidos: serviciosCompartidosDf // contratosId: contratoId,

          };
          fakeMedidor = {
            codigo: contratoCodigo.value,
            fechaInstalacion: null,
            marca: "NA",
            observacion: "NA"
          };

          if (editingStatus) {
            _context2.next = 86;
            break;
          }

          _context2.prev = 66;
          _context2.next = 69;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("createContrato", _newContrato, numero, sectorId));

        case 69:
          resultContrato = _context2.sent;
          console.log("Muestro resultado de insertar contrato: ", resultContrato);
          contratoId = resultContrato.id;
          console.log("Muestro id resultado de insertar contrato: ", contratoId);
          fakeMedidor.contratosId = contratoId;
          _context2.next = 76;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("updateMedidor", contratoId, fakeMedidor));

        case 76:
          result = _context2.sent;
          console.log("resultado de crearMedidor: ", result);
          editContrato(contratoId); // if (!contratoId == "" || !contratoId == undefined) {
          //   await contratarServicios(
          //     serviciosDisponiblesAContratar,
          //     contratoId
          //   );
          //   // if (contratoConMedidor) {
          //   //   console.log("vamos a crear un medidor");
          //   //   newMedidor.contratosId = contratoId;
          //   //   const result = await ipcRenderer.invoke(
          //   //     "createMedidor",
          //   //     newMedidor
          //   //   );
          //   //   console.log(result);
          //   // }
          // }

          _context2.next = 84;
          break;

        case 81:
          _context2.prev = 81;
          _context2.t0 = _context2["catch"](66);
          console.log("Error al registrar el contrato: ", _context2.t0);

        case 84:
          _context2.next = 102;
          break;

        case 86:
          console.log("Editing contrato with electron");
          newMedidor.contratosId = editContratoId;
          _context2.prev = 88;
          _context2.next = 91;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("updateContrato", editContratoId, _newContrato));

        case 91:
          _resultContrato = _context2.sent;

          if (!contratoConMedidor) {
            _context2.next = 96;
            break;
          }

          _context2.next = 95;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("updateMedidor", editContratoId, newMedidor));

        case 95:
          resultMedidor = _context2.sent;

        case 96:
          // contratarServicios(serviciosDisponiblesAContratar, editContratoId);
          console.log(_resultContrato);
          _context2.next = 102;
          break;

        case 99:
          _context2.prev = 99;
          _context2.t1 = _context2["catch"](88);
          console.log("Error al editar el contrato: ", _context2.t1);

        case 102:
          _context2.next = 105;
          break;

        case 104:
          console.log("Socio not found");

        case 105:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[66, 81], [88, 99]]);
}); // ----------------------------------------------------------------
// Funcion que recibe el id del servicio a contratar y los relaciona con el id del contrato
// Registra un servicio contratado a la vez.
// ----------------------------------------------------------------

function contratarServicio(servicioAContratar, contratoId) {
  var adquiridoSn, resultServiciosContratados;
  return regeneratorRuntime.async(function contratarServicio$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log("Contratando Servicios para: " + contratoId + "|" + servicioAContratar);
          _context3.prev = 1;
          adquiridoSn = "Innactivo";

          if (document.getElementById(servicioAContratar).checked) {
            adquiridoSn = "Activo";
          }

          _context3.next = 6;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("createServicioFijoContratado", servicioAContratar, contratoId, 1, adquiridoSn));

        case 6:
          resultServiciosContratados = _context3.sent;
          console.log("Resultado de contratar servicios: ", resultServiciosContratados);
          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](1);
          console.log(_context3.t0);

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 10]]);
} // ----------------------------------------------------------------
// Funcion que recibe los id de servicios a contratar y los relaciona con el id del contrato
// Registra varios servicios contratados a la vez
// ----------------------------------------------------------------


function contratarServicios(serviciosAContratar, contratoId) {
  console.log("Contratando Servicios para: " + contratoId);
  var conteoRegistros = serviciosAContratar.length;

  try {
    serviciosAContratar.forEach(function _callee2(servicioAContratar) {
      var adquiridoSn, resultServiciosContratados;
      return regeneratorRuntime.async(function _callee2$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              adquiridoSn = "";

              if (document.getElementById(servicioAContratar).checked) {
                adquiridoSn = "Activo";
              } else {
                adquiridoSn = "Innactivo";
              }

              _context4.next = 4;
              return regeneratorRuntime.awrap(ipcRenderer.invoke("createServiciosContratados", servicioAContratar, contratoId, 1, adquiridoSn));

            case 4:
              resultServiciosContratados = _context4.sent;
              console.log("Resultado de contratar servicios: ", resultServiciosContratados);
              conteoRegistros = conteoRegistros - 1;
              console.log("conteo: " + conteoRegistros);

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
    ipcRenderer.on("notifyContratarServicios", function (event) {
      if (conteoRegistros == 1) {
        var NOTIFICATION_TITLE = "Servicios Contratados ";
        new window.Notification(NOTIFICATION_TITLE, {
          body: "Comprueba los detalles en la lista de servicios !"
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
} // ----------------------------------------------------------------
// Funcion que crea las filas en la tabla de contratos registrados con servicio
// de agua potable por ende con medidor
// ----------------------------------------------------------------


function renderContratosConMedidor(datosContratos) {
  contratosList.innerHTML = ""; // datosContratos.forEach((contrato) => {
  //   contratosList.innerHTML += `
  //   <tr class="fila-md ">
  //   <td>${contrato.codigo}</td>
  //      <td>${formatearFecha(contrato.fecha)}</td>
  //     <td>${
  //       contrato.primerNombre +
  //       " " +
  //       contrato.segundoNombre +
  //       " " +
  //       contrato.primerApellido +
  //       " " +
  //       contrato.segundoApellido
  //     }</td>
  //     <td>${contrato.cedulaPasaporte}</td>
  //     <td>${contrato.estado}</td>
  //     <td>
  //     <button onclick="detallesContratos('${
  //       contrato.contratosId
  //     }')" class="btn ">
  //     <i class="fa-solid fa-circle-info" style="color: #511f1f;"></i>
  //     </button>
  //     </td>
  //     <td>
  //     <button onclick="editContrato('${contrato.contratosId}')" class="btn ">
  //     <i class="fa-solid fa-user-pen"></i>
  //     </button>
  //     </td>
  //  </tr>
  //     `;
  // });

  datosContratos.forEach(function (datosContrato) {
    // Crea un nuevo div con la clase "col-xl-6 col-lg-6 col-md-6 col-sm-12"
    var divCol = document.createElement("div"); // divCol.style.backgroundColor = "black";

    divCol.className = " col-xl-6 col-lg-6 col-md-6 col-sm-12 px-1"; // Crea el div con la clase "card" y estilos

    var divCard = document.createElement("div");
    divCard.className = "clase col-lg-12 col-md-12 col-sm-12 my-1 mx-1 card";
    divCard.style.padding = "0.3em";
    divCard.style.width = "100%";
    divCard.style.backgroundColor = "#d6eaf8"; // Crea el div del encabezado con la clase "card-header" y estilos

    var divCardHeader = document.createElement("div");
    divCardHeader.className = "card-header d-flex justify-content-between align-items-center mp-0";
    divCardHeader.style.backgroundColor = "#85c1e9"; // Crea el primer conjunto de elementos de texto

    var divText1 = document.createElement("div");
    divText1.className = "d-flex mp-0";
    var pText1 = document.createElement("p");
    pText1.className = "mp-0 fs-5";
    pText1.textContent = "Contrato:";
    var pTrans1 = document.createElement("p");
    pTrans1.className = "trans mp-0";
    pTrans1.textContent = "-";
    var pText2 = document.createElement("p");
    pText2.className = "mp-0 text-white fs-5";
    pText2.textContent = datosContrato.codigo;
    divText1.appendChild(pText1);
    divText1.appendChild(pTrans1);
    divText1.appendChild(pText2); // Crea el segundo conjunto de elementos de texto

    var divText2 = document.createElement("div");
    divText2.className = "d-flex mp-0";
    var pText3 = document.createElement("p");
    pText3.className = "mp-0 fs-5";
    pText3.textContent = "Socio:";
    var pTrans2 = document.createElement("p");
    pTrans2.textContent = "-";
    pTrans2.className = "trans mp-0";
    var pText4 = document.createElement("p");
    pText4.className = "mp-0 mt-1";
    pText4.style.fontSize = "1em";
    pText4.textContent = datosContrato.socio;
    divText2.appendChild(pText3);
    divText2.appendChild(pTrans2);
    divText2.appendChild(pText4); // Agrega los conjuntos de elementos de texto al div del encabezado

    divCardHeader.appendChild(divText1);
    divCardHeader.appendChild(divText2); // Crea el div del cuerpo con la clase "card-body" y estilos

    var divCardBody = document.createElement("div");
    divCardBody.className = "card-body";
    divCardBody.style.backgroundColor = "white";
    var divDateSt = document.createElement("div");
    divDateSt.className = "d-flex justify-content-between"; // Crea un div para la fecha de contrato y agrega contenido

    var divFechaContrato = document.createElement("div");
    divFechaContrato.className = "col-9 d-flex";
    var h6FechaContrato = document.createElement("h6");
    h6FechaContrato.innerHTML = '<i style="color: #85c1e9" class="fa-regular fa-calendar-days mx-2"></i>Fecha de contrato:';
    var pFechaContrato = document.createElement("p");
    var spaceFechaContrato = document.createElement("p");
    spaceFechaContrato.className = "trans";
    spaceFechaContrato.textContent = "-";
    pFechaContrato.textContent = formatearFecha(datosContrato.fecha);
    divFechaContrato.appendChild(h6FechaContrato);
    divFechaContrato.appendChild(spaceFechaContrato);
    divFechaContrato.appendChild(pFechaContrato); // Crea un div para el estado "Activo" y agrega contenido

    var divEstadoActivo = document.createElement("div");
    divEstadoActivo.className = "col-3 d-flex justify-content-end align-items-baseline";
    var pEstadoActivo = document.createElement("p"); // pEstadoActivo.classList.add("trans");
    // pEstadoActivo.textContent = "-";

    pEstadoActivo.textContent = datosContrato.estado;
    var iconActivo = document.createElement("i");
    iconActivo.classList.add("mx-2", "fa-solid", "fa-toggle-on");
    iconActivo.style.color = "#85c1e9";
    divEstadoActivo.appendChild(pEstadoActivo);
    divEstadoActivo.appendChild(iconActivo);
    divDateSt.appendChild(divFechaContrato);
    divDateSt.appendChild(divEstadoActivo); // Crea un div para la ubicación y agrega contenido

    var divUbicacion = document.createElement("div");
    divUbicacion.className = "col-12 text-center";
    var h6Ubicacion = document.createElement("h6");
    h6Ubicacion.textContent = "Ubicacion";
    var pUbicacion = document.createElement("p");
    var icoLocation = document.createElement("i");
    icoLocation.style.color = "#85c1e9";
    icoLocation.className = "mx-2 fa-solid fa-location-dot";
    pUbicacion.appendChild(icoLocation);
    var locationText = document.createTextNode("Barrio " + datosContrato.barrio + ", " + datosContrato.callePrincipal + " y " + datosContrato.calleSecundaria + ", " + datosContrato.numeroCasa + ".");
    pUbicacion.appendChild(locationText); // pUbicacion.innerHTML =
    //   '<i style="color: #85c1e9" class="mx-2 fa-solid fa-location-dot"></i>
    //   Barrio Los Laureles, Buenavista y La troncal, N-201';

    divUbicacion.appendChild(h6Ubicacion);
    divUbicacion.appendChild(pUbicacion); // Crea un div para el botón

    var divBoton = document.createElement("div");
    divBoton.classList.add("col-12", "d-flex", "justify-content-end");
    var boton = document.createElement("button");
    boton.classList.add("btn-custom");
    boton.innerHTML = 'Actualizar <i class="mx-1 fa-solid fa-file-pen"></i>';

    boton.onclick = function () {
      editContrato(datosContrato.contratosId);
    };

    divBoton.appendChild(boton); // Agrega los elementos al cuerpo

    divCardBody.appendChild(divDateSt);
    divCardBody.appendChild(divUbicacion);
    divCardBody.appendChild(divBoton); // Agrega el encabezado y el cuerpo al div de la tarjeta

    divCard.appendChild(divCardHeader);
    divCard.appendChild(divCardBody); // Agrega el div de la tarjeta al div de columna

    divCol.appendChild(divCard);

    divCol.onclick = function () {
      // Elimina la clase "selected" de todos los elementos
      var elementos = document.querySelectorAll(".clase"); // Reemplaza con la clase real de tus elementos

      elementos.forEach(function (elemento) {
        elemento.classList.remove("bg-secondary");
      }); // Agrega la clase "selected" al elemento que se hizo clic

      divCard.classList.add("bg-secondary");
      detallesContratos(datosContrato.contratosId);
    }; // Agrega el div de columna al documento


    contratosList.appendChild(divCol);
  });
} // function renderContratosSinMedidor(datosContratosSinMedidor) {
//   contratosSinMedidorList.innerHTML = "";
//   const cardContainer = document.createElement("div");
//   // cardContainer.classList.add("card-container-horizontal");
//   datosContratosSinMedidor.forEach((contratosinmedidor) => {
//     const card = document.createElement("div");
//     card.classList.add("card");
//     card.classList.add("cardmd");
//     card.innerHTML = `
//       <div class="card-content">
//         <div class="card-header">${contratosinmedidor.codigo}</div>
//         <div class="card-body">
//           <p>${formatearFecha(contratosinmedidor.fecha)}</p>
//           <p>${
//             contratosinmedidor.primerNombre +
//             " " +
//             contratosinmedidor.segundoNombre +
//             " " +
//             contratosinmedidor.primerApellido +
//             " " +
//             contratosinmedidor.segundoApellido
//           }</p>
//           <p>${contratosinmedidor.cedulaPasaporte}</p>
//           <p>${contratosinmedidor.estado}</p>
//         </div>
//         <div class="card-footer">
//           <button onclick="detallesContratos('${
//             contratosinmedidor.id
//           }')" class="btn ">
//             <i class="fa-solid fa-circle-info" style="color: #511f1f;"></i>
//           </button>
//           <button onclick="editMedidor('${
//             contratosinmedidor.id
//           }')" class="btn ">
//             <i class="fa-solid fa-user-pen"></i>
//           </button>
//         </div>
//       </div>
//     `;
//     cardContainer.appendChild(card);
//   });
//   contratosSinMedidorList.appendChild(cardContainer);
// }


function renderContratosSinMedidor(datosContratosSinMedidor) {
  contratosSinMedidorList.innerHTML = ""; // datosContratosSinMedidor.forEach((contratosinmedidor) => {
  //   contratosSinMedidorList.innerHTML += `
  //     <tr class="fila-md">
  //     <td>${contratosinmedidor.codigo}</td>
  //     <td>${formatearFecha(contratosinmedidor.fecha)}</td>
  //     <td>${
  //       contratosinmedidor.primerNombre +
  //       " " +
  //       contratosinmedidor.segundoNombre +
  //       " " +
  //       contratosinmedidor.primerApellido +
  //       " " +
  //       contratosinmedidor.segundoApellido
  //     }</td>
  //     <td>${contratosinmedidor.cedulaPasaporte}</td>
  //     <td>${contratosinmedidor.estado}</td>
  //     <td>
  //     <button onclick="detallesContratos('${
  //       contratosinmedidor.contratosId
  //     }')" class="btn ">
  //     <i class="fa-solid fa-circle-info" style="color: #511f1f;"></i>
  //     </button>
  //     </td>
  //     <td>
  //     <button onclick="editContrato('${
  //       contratosinmedidor.contratosId
  //     }')" class="btn ">
  //     <i class="fa-solid fa-user-pen"></i>
  //     </button>
  //     </td>
  // </tr>
  //     `;
  // });

  datosContratosSinMedidor.forEach(function (datosContrato) {
    // Crea un nuevo div con la clase "col-xl-6 col-lg-6 col-md-6 col-sm-12"
    var divCol = document.createElement("div"); // divCol.style.backgroundColor = "black";

    divCol.className = " col-xl-6 col-lg-6 col-md-6 col-sm-12 px-1"; // Crea el div con la clase "card" y estilos

    var divCard = document.createElement("div");
    divCard.className = "clase col-lg-12 col-md-12 col-sm-12 my-1 mx-1 card";
    divCard.style.padding = "0.3em";
    divCard.style.width = "100%";
    divCard.style.backgroundColor = "#d6eaf8"; // Crea el div del encabezado con la clase "card-header" y estilos

    var divCardHeader = document.createElement("div");
    divCardHeader.className = "card-header d-flex justify-content-between align-items-center mp-0";
    divCardHeader.style.backgroundColor = "#85c1e9"; // Crea el primer conjunto de elementos de texto

    var divText1 = document.createElement("div");
    divText1.className = "d-flex mp-0";
    var pText1 = document.createElement("p");
    pText1.className = "mp-0 fs-5";
    pText1.textContent = "Contrato:";
    var pTrans1 = document.createElement("p");
    pTrans1.className = "trans mp-0";
    pTrans1.textContent = "-";
    var pText2 = document.createElement("p");
    pText2.className = "mp-0 text-white fs-5";
    pText2.textContent = datosContrato.codigo;
    divText1.appendChild(pText1);
    divText1.appendChild(pTrans1);
    divText1.appendChild(pText2); // Crea el segundo conjunto de elementos de texto

    var divText2 = document.createElement("div");
    divText2.className = "d-flex mp-0";
    var pText3 = document.createElement("p");
    pText3.className = "mp-0 fs-5";
    pText3.textContent = "Socio:";
    var pTrans2 = document.createElement("p");
    pTrans2.classList.Name = "trans mp-0";
    pTrans2.textContent = "-";
    var pText4 = document.createElement("p");
    pText4.className = "mp-0 mt-1";
    pText4.style.fontSize = "1em";
    pText4.textContent = datosContrato.socio;
    divText2.appendChild(pText3);
    divText2.appendChild(pTrans2);
    divText2.appendChild(pText4); // Agrega los conjuntos de elementos de texto al div del encabezado

    divCardHeader.appendChild(divText1);
    divCardHeader.appendChild(divText2); // Crea el div del cuerpo con la clase "card-body" y estilos

    var divCardBody = document.createElement("div");
    divCardBody.className = "card-body";
    divCardBody.style.backgroundColor = "white";
    var divDateSt = document.createElement("div");
    divDateSt.className = "d-flex justify-content-between"; // Crea un div para la fecha de contrato y agrega contenido

    var divFechaContrato = document.createElement("div");
    divFechaContrato.className = "col-9 d-flex";
    var h6FechaContrato = document.createElement("h6");
    h6FechaContrato.innerHTML = '<i style="color: #85c1e9" class="fa-regular fa-calendar-days mx-2"></i>Fecha de contrato:';
    var pFechaContrato = document.createElement("p");
    var spaceFechaContrato = document.createElement("p");
    spaceFechaContrato.className = "trans";
    spaceFechaContrato.textContent = "-";
    pFechaContrato.textContent = formatearFecha(datosContrato.fecha);
    divFechaContrato.appendChild(h6FechaContrato);
    divFechaContrato.appendChild(spaceFechaContrato);
    divFechaContrato.appendChild(pFechaContrato); // Crea un div para el estado "Activo" y agrega contenido

    var divEstadoActivo = document.createElement("div");
    divEstadoActivo.className = "col-3 d-flex justify-content-end align-items-baseline";
    var pEstadoActivo = document.createElement("p"); // pEstadoActivo.classList.add("trans");
    // pEstadoActivo.textContent = "-";

    pEstadoActivo.textContent = datosContrato.estado;
    var iconActivo = document.createElement("i");
    iconActivo.classList.add("mx-2", "fa-solid", "fa-toggle-on");
    iconActivo.style.color = "#85c1e9";
    divEstadoActivo.appendChild(pEstadoActivo);
    divEstadoActivo.appendChild(iconActivo);
    divDateSt.appendChild(divFechaContrato);
    divDateSt.appendChild(divEstadoActivo); // Crea un div para la ubicación y agrega contenido

    var divUbicacion = document.createElement("div");
    divUbicacion.className = "col-12 text-center";
    var h6Ubicacion = document.createElement("h6");
    h6Ubicacion.textContent = "Ubicacion";
    var pUbicacion = document.createElement("p");
    var icoLocation = document.createElement("i");
    icoLocation.style.color = "#85c1e9";
    icoLocation.className = "mx-2 fa-solid fa-location-dot";
    pUbicacion.appendChild(icoLocation);
    var locationText = document.createTextNode("Barrio " + datosContrato.barrio + ", " + datosContrato.callePrincipal + " y " + datosContrato.calleSecundaria + ", " + datosContrato.numeroCasa + ".");
    pUbicacion.appendChild(locationText); // pUbicacion.innerHTML =
    //   '<i style="color: #85c1e9" class="mx-2 fa-solid fa-location-dot"></i>
    //   Barrio Los Laureles, Buenavista y La troncal, N-201';

    divUbicacion.appendChild(h6Ubicacion);
    divUbicacion.appendChild(pUbicacion); // Crea un div para el botón

    var divBoton = document.createElement("div");
    divBoton.classList.add("col-12", "d-flex", "justify-content-end");
    var boton = document.createElement("button");
    boton.classList.add("btn-custom");
    boton.innerHTML = 'Actualizar <i class="mx-1 fa-solid fa-file-pen"></i>';

    boton.onclick = function () {
      editContrato(datosContrato.contratosId);
    };

    divBoton.appendChild(boton); // Agrega los elementos al cuerpo

    divCardBody.appendChild(divDateSt);
    divCardBody.appendChild(divUbicacion);
    divCardBody.appendChild(divBoton); // Agrega el encabezado y el cuerpo al div de la tarjeta

    divCard.appendChild(divCardHeader);
    divCard.appendChild(divCardBody); // Agrega el div de la tarjeta al div de columna

    divCol.appendChild(divCard);

    divCol.onclick = function () {
      // Elimina la clase "selected" de todos los elementos
      var elementos = document.querySelectorAll(".clase"); // Reemplaza con la clase real de tus elementos

      elementos.forEach(function (elemento) {
        elemento.classList.remove("bg-secondary");
      }); // Agrega la clase "selected" al elemento que se hizo clic

      divCard.classList.add("bg-secondary");
      detallesContratos(datosContrato.contratosId);
    }; // Agrega el div de columna al documento


    contratosSinMedidorList.appendChild(divCol);
  });
} // ----------------------------------------------------------------
// Funcion que crea las cards de los servicios registrados segun el id
// del contrato seleccionado
// ----------------------------------------------------------------


function renderServiciosContratados(serviciosContratados) {
  serviciosContratadosList.innerHTML = "";
  serviciosContratados.forEach(function (servicioContratado) {
    serviciosContratadosList.innerHTML += "\n     \n    <div class=\"col-12 text-center  my-1\">\n    <div class=\"card card-fondo card-espacios mx-2\" style=\"height: 12rem; width:100%\">\n      <div class=\"card-zona-img\"></div>\n      <div class=\"card-body col-12 card-contenido\">\n        <div class=\"col-12\">\n          <h5 class=\"card-title\">".concat(servicioContratado.nombre, "</h5>\n        </div>\n        <div class=\"col-12 card-zona-desc-ct\">\n          <p class=\"card-text\">\n            ").concat(servicioContratado.descripcion, "\n          </p>\n        </div>\n        <div\n          class=\"col-12 d-flex justify-content-center align-items-center\"\n        ></div>\n      </div>\n    </div>\n  </div>\n      ");
  });
  console.log(serviciosDisponiblesAContratar[0]);
} // ----------------------------------------------------------------
// Funcion que crea las cards de los servicios disponibles para los nuevos contratos
// ----------------------------------------------------------------


function renderServiciosDisponibles(serviciosDisponibles) {
  var _loop, i;

  return regeneratorRuntime.async(function renderServiciosDisponibles$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          serviciosDisponiblesAContratar = [];
          servicosDisponiblesList.innerHTML = "";

          _loop = function _loop(i) {
            var cardContainer, card, cardImage, cardBody, title, description, divValue, divRowBtn, pValue, checkboxDiv, checkbox, label, compartidoSn, compartidoAnteriorSn, compartidoContratado;
            return regeneratorRuntime.async(function _loop$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    console.log("Servicios: ", serviciosDisponibles[i]); //serviciosContratados.forEach((servicioContratado) => {

                    serviciosDisponiblesAContratar.push(serviciosDisponibles[i].id);
                    cardContainer = document.createElement("div");
                    cardContainer.classList.add("col-6", "text-center");
                    card = document.createElement("div");
                    card.classList.add("card", "card-fondo", "my-2");
                    card.style.height = "18rem";
                    cardImage = document.createElement("div");
                    cardImage.classList.add("card-zona-img");
                    cardBody = document.createElement("div");
                    cardBody.classList.add("card-body", "col-12", "card-contenido");
                    title = document.createElement("h5");
                    title.classList.add("card-title");
                    title.textContent = serviciosDisponibles[i].nombre;
                    description = document.createElement("p");
                    description.classList.add("card-text");
                    description.textContent = serviciosDisponibles[i].descripcion;
                    divValue = document.createElement("div");
                    divRowBtn = document.createElement("div");
                    divRowBtn.className = "row";
                    divValue.className = "col-2 mp-0 text-center";
                    pValue = document.createElement("p");
                    pValue.className = "mp-0 value-disponibles";
                    pValue.textContent = "$" + parseFloat(serviciosDisponibles[i].valor).toFixed(2);
                    divValue.appendChild(pValue);
                    checkboxDiv = document.createElement("div");
                    checkboxDiv.classList.add("col-8", "d-flex", "justify-content-center", "align-items-center");
                    checkbox = document.createElement("input"); //checkbox.checked = "false";

                    checkbox.type = "checkbox";
                    checkbox.classList.add("btn-check"); //checkbox.name = "options-outlined";

                    checkbox.id = serviciosDisponibles[i].id;
                    checkbox.autocomplete = "off";
                    checkbox.checked = false;
                    label = document.createElement("label");
                    label.style.width = "100%";
                    label.classList.add("btn", "btn-outline-warning");
                    label.setAttribute("for", serviciosDisponibles[i].id);
                    label.textContent = "Contratar";
                    compartidoSn = false;
                    compartidoAnteriorSn = false;

                    if (!(serviciosDisponibles[i].IndividualSn == "Compartido")) {
                      _context8.next = 48;
                      break;
                    }

                    compartidoSn = true;
                    label.innerHTML = 'Contratar<i class="mx-2 fa-solid fa-share-nodes"></i>';
                    _context8.next = 45;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("getCompartidosContratados", serviciosDisponibles[i].id, editSocioId));

                  case 45:
                    compartidoContratado = _context8.sent;
                    console.log('CompartidoSn: ' + compartidoContratado.length);

                    if (compartidoContratado.length > 0) {
                      compartidoAnteriorSn = true;
                    }

                  case 48:
                    checkbox.onclick = function () {
                      if (serviciosDisponibles[i].nombre === "Agua Potable") {
                        habilitarFormMedidor();

                        if (validator.isEmpty(medidorInstalacion.value)) {
                          errorContainer.style.color = "red";
                          mensajeError.textContent = "Debes ingresar una fecha de instalacion válida.";
                          medidorInstalacion.focus();
                          checkbox.checked = false;
                        } else if (validator.isEmpty(medidorMarca.value)) {
                          errorContainer.style.color = "red";
                          mensajeError.textContent = "Debes ingresar una marca valida para el medidor.";
                          medidorMarca.focus();
                          checkbox.checked = false;
                        } else {
                          Swal.fire({
                            title: "¿Quieres contratar este servicio para este contrato?",
                            text: "El valor se cargara en la planilla a partir del mes próximo.",
                            icon: "question",
                            iconColor: "#f8c471",
                            showCancelButton: true,
                            confirmButtonColor: "#2874A6",
                            cancelButtonColor: "#EC7063 ",
                            confirmButtonText: "Sí, continuar",
                            cancelButtonText: "Cancelar"
                          }).then(function _callee3(result) {
                            var observacionDf, resultContrato, _result;

                            return regeneratorRuntime.async(function _callee3$(_context5) {
                              while (1) {
                                switch (_context5.prev = _context5.next) {
                                  case 0:
                                    if (!result.isConfirmed) {
                                      _context5.next = 20;
                                      break;
                                    }

                                    // Aquí puedes realizar la acción que desees cuando el usuario confirme.
                                    // checkbox.checked = true;
                                    observacionDf = "SN";

                                    if (!validator.isEmpty(medidorObservacion.value)) {
                                      observacionDf = medidorObservacion.value;
                                    }

                                    newContrato = {
                                      medidorSn: "Si"
                                    };
                                    newMedidor = {
                                      codigo: contratoCodigo.value,
                                      fechaInstalacion: medidorInstalacion.value,
                                      marca: medidorMarca.value,
                                      observacion: observacionDf,
                                      // barrio: medidorBarrio.value,
                                      // callePrincipal: medidorPrincipal.value,
                                      // calleSecundaria: medidorSecundaria.value,
                                      // numeroCasa: medidorNumeroCasa.value,
                                      // referencia: medidorReferencia.value,
                                      contratosId: editContratoId
                                    };
                                    _context5.next = 7;
                                    return regeneratorRuntime.awrap(ipcRenderer.invoke("updateContrato", editContratoId, newContrato));

                                  case 7:
                                    resultContrato = _context5.sent;
                                    console.log("vamos a crear un medidor");
                                    _context5.next = 11;
                                    return regeneratorRuntime.awrap(ipcRenderer.invoke("updateMedidor", editContratoId, newMedidor));

                                  case 11:
                                    _result = _context5.sent;
                                    console.log("Resultado del medidor: " + _result);

                                    if (_result.id !== undefined) {
                                      console.log("Muestro result del medior: " + _result.id);
                                      contratarServicio(serviciosDisponibles[i].id, editContratoId);
                                    }

                                    _context5.next = 16;
                                    return regeneratorRuntime.awrap(editContrato(editContratoId));

                                  case 16:
                                    _context5.next = 18;
                                    return regeneratorRuntime.awrap(editContrato(editContratoId));

                                  case 18:
                                    _context5.next = 22;
                                    break;

                                  case 20:
                                    checkbox.checked = false;
                                    inHabilitarFormMedidor();

                                  case 22:
                                  case "end":
                                    return _context5.stop();
                                }
                              }
                            });
                          });
                        }
                      } else {
                        if (compartidoAnteriorSn && compartidoSn) {
                          Swal.fire({
                            title: "¿Quieres contratar este servicio para este contrato?",
                            text: "Este servicio es compartido y ha sido adquirido en un contrato anterior \n" + "¿Deseas contratarlo de  todas formas? \n El valor se cargará en la planilla a partir del mes próximo.",
                            icon: "question",
                            iconColor: "#f8c471",
                            showCancelButton: true,
                            confirmButtonColor: "#2874A6",
                            cancelButtonColor: "#EC7063 ",
                            confirmButtonText: "Sí, continuar",
                            cancelButtonText: "Cancelar"
                          }).then(function _callee4(result) {
                            return regeneratorRuntime.async(function _callee4$(_context6) {
                              while (1) {
                                switch (_context6.prev = _context6.next) {
                                  case 0:
                                    if (!result.isConfirmed) {
                                      _context6.next = 8;
                                      break;
                                    }

                                    // Aquí puedes realizar la acción que desees cuando el usuario confirme.
                                    // checkbox.checked = true;
                                    contratarServicio(serviciosDisponibles[i].id, editContratoId);
                                    _context6.next = 4;
                                    return regeneratorRuntime.awrap(editContrato(editContratoId));

                                  case 4:
                                    _context6.next = 6;
                                    return regeneratorRuntime.awrap(editContrato(editContratoId));

                                  case 6:
                                    _context6.next = 9;
                                    break;

                                  case 8:
                                    checkbox.checked = false;

                                  case 9:
                                  case "end":
                                    return _context6.stop();
                                }
                              }
                            });
                          });
                        } else {
                          Swal.fire({
                            title: "¿Quieres contratar este servicio para este contrato?",
                            text: "El valor se cargara en la planilla a partir del mes próximo.",
                            icon: "question",
                            iconColor: "#f8c471",
                            showCancelButton: true,
                            confirmButtonColor: "#2874A6",
                            cancelButtonColor: "#EC7063 ",
                            confirmButtonText: "Sí, continuar",
                            cancelButtonText: "Cancelar"
                          }).then(function _callee5(result) {
                            return regeneratorRuntime.async(function _callee5$(_context7) {
                              while (1) {
                                switch (_context7.prev = _context7.next) {
                                  case 0:
                                    if (!result.isConfirmed) {
                                      _context7.next = 8;
                                      break;
                                    }

                                    // Aquí puedes realizar la acción que desees cuando el usuario confirme.
                                    // checkbox.checked = true;
                                    contratarServicio(serviciosDisponibles[i].id, editContratoId);
                                    _context7.next = 4;
                                    return regeneratorRuntime.awrap(editContrato(editContratoId));

                                  case 4:
                                    _context7.next = 6;
                                    return regeneratorRuntime.awrap(editContrato(editContratoId));

                                  case 6:
                                    _context7.next = 9;
                                    break;

                                  case 8:
                                    checkbox.checked = false;

                                  case 9:
                                  case "end":
                                    return _context7.stop();
                                }
                              }
                            });
                          });
                        }
                      }
                    };

                    checkboxDiv.appendChild(checkbox);
                    checkboxDiv.appendChild(label);
                    divRowBtn.appendChild(divValue);
                    divRowBtn.appendChild(checkboxDiv);
                    cardBody.appendChild(title);
                    cardBody.appendChild(description);
                    cardBody.appendChild(divRowBtn); // cardBody.appendChild(divValue);
                    // cardBody.appendChild(checkboxDiv);

                    card.appendChild(cardImage);
                    card.appendChild(cardBody);
                    cardContainer.appendChild(card);
                    servicosDisponiblesList.appendChild(cardContainer);

                  case 60:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          };

          i = 0;

        case 4:
          if (!(i < serviciosDisponibles.length)) {
            _context9.next = 10;
            break;
          }

          _context9.next = 7;
          return regeneratorRuntime.awrap(_loop(i));

        case 7:
          i++;
          _context9.next = 4;
          break;

        case 10:
          marcarServiciosContratados();
          console.log(serviciosDisponiblesAContratar[0]);

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  });
}

function marcarServiciosContratados() {
  var _loop2, i;

  return regeneratorRuntime.async(function marcarServiciosContratados$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          if (serviciosEditar !== null) {
            console.log("Marcando servicios: " + serviciosEditar);

            _loop2 = function _loop2(i) {
              var checkContratados = document.getElementById(serviciosEditar[i].serviciosId);
              checkContratados.checked = true;
              var labelElement = document.querySelector('label[for="' + serviciosEditar[i].serviciosId + '"]');
              labelElement.textContent = "Contratado";
              console.log('Compartido: ', serviciosEditar[i]);
              var compartidoSn = false;

              if (serviciosEditar[i].IndividualSn == "Compartido") {
                compartidoSn = true;
                labelElement.innerHTML = 'Contratado<i class="mx-2 fa-solid fa-share-nodes"></i>'; // const compartidoContratado = await ipcRenderer.invoke(
                //   "getCompartidosContratados",
                //   serviciosEditar[i].id,
                //   editSocioId
                // );
                // if (compartidoContratado.length > 0) {
                //   compartidoAnteriorSn = true;
                // }
              }

              checkContratados.onclick = function () {
                // checkContratados.checked = false;
                if (compartidoSn) {
                  Swal.fire({
                    title: "¿Quieres quitar este servicio de este contrato?",
                    text: "Este servicio es compartido al descontratarlo el resto de contratos \n" + "relacionados con el socio no se beneficiaran de el.\n" + "El valor no se cargara en la planilla a partir del mes próximo.",
                    icon: "question",
                    iconColor: "#f8c471",
                    showCancelButton: true,
                    confirmButtonColor: "#2874A6",
                    cancelButtonColor: "#EC7063 ",
                    confirmButtonText: "Sí, continuar",
                    cancelButtonText: "Cancelar"
                  }).then(function _callee6(result) {
                    var _newContrato2, resultContrato;

                    return regeneratorRuntime.async(function _callee6$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            if (!result.isConfirmed) {
                              _context10.next = 16;
                              break;
                            }

                            if (!(serviciosEditar[i].nombre === "Agua Potable")) {
                              _context10.next = 9;
                              break;
                            }

                            _newContrato2 = {
                              medidorSn: "No"
                            };
                            _context10.next = 5;
                            return regeneratorRuntime.awrap(ipcRenderer.invoke("updateContrato", editContratoId, _newContrato2));

                          case 5:
                            resultContrato = _context10.sent;
                            contratarServicio(serviciosEditar[i].serviciosId, editContratoId);
                            _context10.next = 10;
                            break;

                          case 9:
                            contratarServicio(serviciosEditar[i].serviciosId, editContratoId);

                          case 10:
                            _context10.next = 12;
                            return regeneratorRuntime.awrap(editContrato(editContratoId));

                          case 12:
                            _context10.next = 14;
                            return regeneratorRuntime.awrap(editContrato(editContratoId));

                          case 14:
                            _context10.next = 17;
                            break;

                          case 16:
                            checkContratados.checked = true;

                          case 17:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    });
                  });
                } else {
                  Swal.fire({
                    title: "¿Quieres quitar este servicio de este contrato?",
                    text: "El valor no se cargara en la planilla a partir del mes próximo.",
                    icon: "question",
                    iconColor: "#f8c471",
                    showCancelButton: true,
                    confirmButtonColor: "#2874A6",
                    cancelButtonColor: "#EC7063 ",
                    confirmButtonText: "Sí, continuar",
                    cancelButtonText: "Cancelar"
                  }).then(function _callee7(result) {
                    var _newContrato3, resultContrato;

                    return regeneratorRuntime.async(function _callee7$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            if (!result.isConfirmed) {
                              _context11.next = 16;
                              break;
                            }

                            if (!(serviciosEditar[i].nombre === "Agua Potable")) {
                              _context11.next = 9;
                              break;
                            }

                            _newContrato3 = {
                              medidorSn: "No"
                            };
                            _context11.next = 5;
                            return regeneratorRuntime.awrap(ipcRenderer.invoke("updateContrato", editContratoId, _newContrato3));

                          case 5:
                            resultContrato = _context11.sent;
                            contratarServicio(serviciosEditar[i].serviciosId, editContratoId);
                            _context11.next = 10;
                            break;

                          case 9:
                            contratarServicio(serviciosEditar[i].serviciosId, editContratoId);

                          case 10:
                            _context11.next = 12;
                            return regeneratorRuntime.awrap(editContrato(editContratoId));

                          case 12:
                            _context11.next = 14;
                            return regeneratorRuntime.awrap(editContrato(editContratoId));

                          case 14:
                            _context11.next = 17;
                            break;

                          case 16:
                            checkContratados.checked = true;

                          case 17:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    });
                  });
                }
              };
            };

            for (i = 0; i < serviciosEditar.length; i++) {
              _loop2(i);
            }
          }

        case 1:
        case "end":
          return _context12.stop();
      }
    }
  });
} // ----------------------------------------------------------------
// Funcion que muestra los detalles de los contratos registrados
// segun se los seleccione
// ----------------------------------------------------------------


var detallesContratos = function detallesContratos(id) {
  var serviciosContratos;
  return regeneratorRuntime.async(function detallesContratos$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          console.log("Detallles de : " + id);
          contratoForm.reset(); // resetForm();

          _context13.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getServiciosContratadosById", id));

        case 4:
          serviciosContratos = _context13.sent;
          renderServiciosContratados(serviciosContratos);
          console.log(serviciosContratos);
          return _context13.abrupt("return", serviciosContratos);

        case 8:
        case "end":
          return _context13.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que carga los datos de los contratos registrados y los muestra en
// el formulario para editarlos
// ----------------------------------------------------------------


var editContrato = function editContrato(id) {
  var principalSn, contrato, conMedidor;
  return regeneratorRuntime.async(function editContrato$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          principalSn = "undefined";
          contratoForm.reset();
          _context16.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getDatosContratosById", id));

        case 4:
          contrato = _context16.sent;
          console.log("Recibido: " + contrato.sociosId);
          editSocioId = contrato.sociosId;
          console.log('Editosocio' + editSocioId);
          getServiciosDisponibles();
          _context16.next = 11;
          return regeneratorRuntime.awrap(getContratosSimilares(editSocioId, contrato.id));

        case 11:
          if (contrato.serviciosCompartidos !== 0) {
            serviciosCompartidos.value = contrato.serviciosCompartidos;
          } else {
            serviciosCompartidos.value = "0";
          }

          conMedidor = contrato.medidorSn;

          if (conMedidor == "Si") {
            contratoConMedidor = true;
            console.log("conMedidor");
            habilitarFormMedidor();
            contratoFecha.value = formatearFecha(contrato.fecha);
            socioContratanteCedula.value = contrato.cedulaPasaporte;
            socioContratanteApellido.value = contrato.primerApellido + " " + contrato.segundoApellido;
            socioContratanteNombre.value = contrato.primerNombre + " " + contrato.segundoNombre;
            contratoCodigo.value = contrato.codigo;

            if (contrato.principalSn == "No") {
              principalSn = "Secundario";
              contratoPrincipalSn.value = principalSn;

              contratoPrincipalSn.onclick = function () {
                Swal.fire({
                  title: "¿Quieres realizar cambios?",
                  text: "Este contrato es " + principalSn + " por lo que no presentara valores por socio " + "puedes hacer de este un contrato principal actualizando el resto de contratos " + "de este socio a secundarios.",
                  icon: "question",
                  iconColor: "#f8c471",
                  showCancelButton: true,
                  confirmButtonColor: "#2874A6",
                  cancelButtonColor: "#EC7063 ",
                  confirmButtonText: "Cambiar a principal",
                  cancelButtonText: "Cancelar"
                }).then(function _callee8(result) {
                  return regeneratorRuntime.async(function _callee8$(_context14) {
                    while (1) {
                      switch (_context14.prev = _context14.next) {
                        case 0:
                          if (result.isConfirmed) {
                            Swal.fire({
                              title: "Quieres confirmar esta accion?",
                              text: "Actualizaremos este contrato como principal.",
                              showCancelButton: true,
                              confirmButtonText: "Aceptar",
                              cancelButtonText: "Cancelar"
                            }).then(function (result) {
                              if (result.isConfirmed) {
                                // Aquí puedes realizar la acción que desees cuando el usuario confirme.
                                cambiarContratoPrincipal(contrato.id, contrato.sociosId);
                              }
                            });
                          }

                        case 1:
                        case "end":
                          return _context14.stop();
                      }
                    }
                  });
                });
              };
            } else {
              principalSn = "Principal";
              contratoPrincipalSn.value = principalSn; // ----------------------------------------------------------------
              // Cambiar el contrato principal.
              // ----------------------------------------------------------------

              contratoPrincipalSn.onclick = function () {
                Swal.fire({
                  title: "Contrato principal",
                  text: "Los valores por socio se" + "cargaran en las planillas de este contrato.",
                  icon: "info",
                  iconColor: "green",
                  showConfirmButton: true,
                  confirmButtonText: "Sandy",
                  confirmButtonColor: "green"
                });
              };
            }

            contratoConMedidor = true; //medidorCodigo.value = contrato.codigoMedidor;

            medidorInstalacion.value = formatearFecha(contrato.fechaInstalacion);
            medidorMarca.value = contrato.marca;
            medidorObservacion.value = contrato.observacion;
            medidorBarrio.value = contrato.barrio;
            medidorPrincipal.value = contrato.callePrincipal;
            medidorSecundaria.value = contrato.calleSecundaria;
            medidorNumeroCasa.value = contrato.numeroCasa;
            medidorReferencia.value = contrato.referencia; // Permitimos editar los datos del medidor
            // medidorCodigo.disabled = false;

            medidorInstalacion.readOnly = true;
            medidorInstalacion.disabled = false;
            medidorMarca.disabled = false;
            medidorObservacion.disabled = false;
            serviciosCompartidos.disabled = false; // Inhabilitamos los campos que no se deben editar

            contratoFecha.readOnly = true;
            socioContratanteCedula.readOnly = true;
            socioContratanteApellido.readOnly = true;
            socioContratanteNombre.readOnly = true;
            generarCodigoBt.disabled = true; // ~~~~~~~~~~~~~~~~

            editContratoId = contrato.id;
          } else {
            console.log("sinMedidor");
            contratoConMedidor = false;
            inHabilitarFormMedidor();
            contratoCodigo.value = contrato.codigo;

            if (contrato.fecha !== null) {
              contratoFecha.value = formatearFecha(contrato.fecha);
            }

            if (contrato.principalSn == "No") {
              principalSn = "Secundario";
              contratoPrincipalSn.value = principalSn;

              contratoPrincipalSn.onclick = function () {
                Swal.fire({
                  title: "¿Quieres realizar cambios?",
                  text: "Este contrato es " + principalSn + " por lo que no presentara valores por socio " + "puedes hacer de este un contrato principal actualizando el resto de contratos " + "de este socio a secundarios.",
                  icon: "question",
                  iconColor: "#f8c471",
                  showCancelButton: true,
                  confirmButtonColor: "#2874A6",
                  cancelButtonColor: "#EC7063 ",
                  confirmButtonText: "Cambiar a principal",
                  cancelButtonText: "Cancelar"
                }).then(function _callee9(result) {
                  return regeneratorRuntime.async(function _callee9$(_context15) {
                    while (1) {
                      switch (_context15.prev = _context15.next) {
                        case 0:
                          if (result.isConfirmed) {
                            Swal.fire({
                              title: "Quieres confirmar esta accion?",
                              text: "Actualizaremos este contrato como principal.",
                              showCancelButton: true,
                              confirmButtonText: "Aceptar",
                              cancelButtonText: "Cancelar"
                            }).then(function (result) {
                              if (result.isConfirmed) {
                                cambiarContratoPrincipal(contrato.id, contrato.sociosId); // Aquí puedes realizar la acción que desees cuando el usuario confirme.
                              }
                            });
                          }

                        case 1:
                        case "end":
                          return _context15.stop();
                      }
                    }
                  });
                });
              };
            } else {
              principalSn = "Principal";
              contratoPrincipalSn.value = principalSn; // ----------------------------------------------------------------
              // Cambiar el contrato principal.
              // ----------------------------------------------------------------

              contratoPrincipalSn.onclick = function () {
                Swal.fire({
                  title: "Contrato principal",
                  text: "Los valores por socio se" + "cargaran en las planillas de este contrato.",
                  icon: "info",
                  iconColor: "green",
                  showConfirmButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: "green"
                });
              };
            }

            socioContratanteCedula.value = contrato.cedulaPasaporte;
            socioContratanteApellido.value = contrato.primerApellido + " " + contrato.segundoApellido;
            socioContratanteNombre.value = contrato.primerNombre + " " + contrato.segundoNombre; // medidorCodigo.value = medidor.codigo;
            // medidorInstalacion.value = formatearFecha(medidor.fechaInstalacion);
            // medidoresDisponibles.selectedIndex = 0;
            // medidorMarca.value = medidor.marca;
            // medidorBarrio.value = medidor.barrio;
            // medidorObservacion.value = medidor.observacion;

            medidorBarrio.value = contrato.barrio;
            medidorPrincipal.value = contrato.callePrincipal;
            medidorSecundaria.value = contrato.calleSecundaria;
            medidorNumeroCasa.value = contrato.numeroCasa;
            medidorReferencia.value = contrato.referencia; // Permitimos editar los datos del medidor
            // medidorCodigo.disabled = false;
            // Inhabilitamos los campos que no se deben editar

            if (contrato.codigoMedidor != undefined) {
              if (contrato.fechaInstalacion != undefined) {
                medidorInstalacion.value = formatearFecha(contrato.fechaInstalacion);
              }

              medidorMarca.value = contrato.marca;
              medidorObservacion.value = contrato.observacion;
            }

            serviciosCompartidos.disabled = false;
            contratoFecha.readOnly = true;
            socioContratanteCedula.readOnly = true;
            socioContratanteApellido.readOnly = true;
            socioContratanteNombre.readOnly = true;
            generarCodigoBt.disabled = true; // ~~~~~~~~~~~~~~~~

            editContratoId = contrato.id;
          }

          socioContratanteId = contrato.sociosId;
          editingStatus = true;
          console.log(contrato);
          console.log("btn1");
          editarServiciosContratados(id);
          getServiciosDisponibles();
          seccion2.classList.remove("active");
          seccion1.classList.add("active");

        case 22:
        case "end":
          return _context16.stop();
      }
    }
  });
};

function cambiarContratoPrincipal(contratoId, socioId) {
  var cambioPrincipal;
  return regeneratorRuntime.async(function cambiarContratoPrincipal$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _context17.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("updatePrincipal", contratoId, socioId));

        case 3:
          cambioPrincipal = _context17.sent;
          editContrato(contratoId);
          _context17.next = 10;
          break;

        case 7:
          _context17.prev = 7;
          _context17.t0 = _context17["catch"](0);
          console.log(_context17.t0);

        case 10:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 7]]);
} // ----------------------------------------------------------------
// Funcion que carga los servicios contratados segun el id del contrato
// y los muestra en el formulario para editarlos
// ----------------------------------------------------------------


function editarServiciosContratados(id) {
  return regeneratorRuntime.async(function editarServiciosContratados$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          _context18.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getServiciosContratadosById", id));

        case 3:
          serviciosEditar = _context18.sent;
          //serviciosContratadosList.push(serviciosContratados.serviciosFijosId);
          console.log("Servicios a editar: ", serviciosEditar);
          _context18.next = 10;
          break;

        case 7:
          _context18.prev = 7;
          _context18.t0 = _context18["catch"](0);
          console.log("Error al cargar los servicios contratados para " + id + " : " + _context18.t0);

        case 10:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 7]]);
} // ----------------------------------------------------------------
// Funcion que elimina un contrato segun el id
// ----------------------------------------------------------------


var deleteMedidor = function deleteMedidor(id) {
  var response, result;
  return regeneratorRuntime.async(function deleteMedidor$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          response = confirm("Estas seguro de eliminar este medidor?");

          if (!response) {
            _context19.next = 8;
            break;
          }

          console.log("id from medidores.js");
          _context19.next = 5;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("deleteMedidor", id));

        case 5:
          result = _context19.sent;
          console.log("Resultado medidores.js", result);
          getContratos();

        case 8:
        case "end":
          return _context19.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que carga los contratos relacionados con el socio.
// ----------------------------------------------------------------


var getContratosSimilares = function getContratosSimilares(socioId, contratoId) {
  var contratosSimilares;
  return regeneratorRuntime.async(function getContratosSimilares$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratosSimilares", socioId));

        case 2:
          contratosSimilares = _context20.sent;
          console.log(contratosSimilares);
          renderContratosSimilares(contratosSimilares, contratoId);

        case 5:
        case "end":
          return _context20.stop();
      }
    }
  });
};

function renderContratosSimilares(contratosSimilares, contratoId) {
  return regeneratorRuntime.async(function renderContratosSimilares$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          // serviciosCompartidos.innerHTML = "";
          serviciosCompartidos.innerHTML = '<option value="0" selected>Sin servicios compartidos</option>';
          contratosSimilares.forEach(function (contratosSimilar) {
            var option = document.createElement("option");
            option.value = contratosSimilar.id;
            option.text = contratosSimilar.codigo + " ( " + contratosSimilar.barrio + ", " + contratosSimilar.callePrincipal + ", " + contratosSimilar.calleSecundaria + ", " + contratosSimilar.numeroCasa + " ).";

            if (contratoId !== undefined) {
              console.log("Comparar: " + contratoId, " | ", contratosSimilar.id);

              if (contratoId !== contratosSimilar.id) {
                serviciosCompartidos.appendChild(option);
              }
            } else {
              serviciosCompartidos.appendChild(option);
            }
          });

        case 2:
        case "end":
          return _context21.stop();
      }
    }
  });
} // ----------------------------------------------------------------
// Funcion que consulta los contratos con medidor
// ----------------------------------------------------------------


var getContratos = function getContratos() {
  return regeneratorRuntime.async(function getContratos$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          _context22.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratosConMedidor"));

        case 2:
          datosContratos = _context22.sent;
          console.log(datosContratos);
          renderContratosConMedidor(datosContratos);

        case 5:
        case "end":
          return _context22.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que consulta los contratos sin medidor
// ----------------------------------------------------------------


var getContratosSinMedidor = function getContratosSinMedidor() {
  return regeneratorRuntime.async(function getContratosSinMedidor$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratosSinMedidor"));

        case 2:
          datosContratosSinMedidor = _context23.sent;
          console.log("Here: ", datosContratosSinMedidor);
          renderContratosSinMedidor(datosContratosSinMedidor);

        case 5:
        case "end":
          return _context23.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que consulta los servicios disponibles para el contrato
// ----------------------------------------------------------------


var getServiciosDisponibles = function getServiciosDisponibles() {
  return regeneratorRuntime.async(function getServiciosDisponibles$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          _context24.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getServiciosDisponibles"));

        case 2:
          serviciosDisponibles = _context24.sent;
          console.log('srv dsp', serviciosDisponibles);
          _context24.next = 6;
          return regeneratorRuntime.awrap(renderServiciosDisponibles(serviciosDisponibles));

        case 6:
          _context24.next = 8;
          return regeneratorRuntime.awrap(eventoServiciosId(serviciosDisponibles));

        case 8:
        case "end":
          return _context24.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que carga los eventos iniciales de la interfaz
// ----------------------------------------------------------------


function init() {
  return regeneratorRuntime.async(function init$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          _context25.next = 2;
          return regeneratorRuntime.awrap(getContratos());

        case 2:
          _context25.next = 4;
          return regeneratorRuntime.awrap(getContratosSinMedidor());

        case 4:
        case "end":
          return _context25.stop();
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
} // ----------------------------------------------------------------
// Cargar datos de los socios registrados
// ----------------------------------------------------------------
// var inputSugerencias = document.getElementById("cedulaSocioContratante");
// var listaSugerencias = document.getElementById("lista-sugerencias");
// var sugerencias = [];
// ----------------------------------------------------------------
// Obtener las sugerencias desde la base de datos
// ----------------------------------------------------------------


function obtenerSugerencias() {
  var cedulasSugerencias;
  return regeneratorRuntime.async(function obtenerSugerencias$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          _context26.prev = 0;
          _context26.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getSocios"));

        case 3:
          cedulasSugerencias = _context26.sent;
          sugerencias = cedulasSugerencias.map(function (objeto) {
            return objeto; // objeto.cedulaPasaporte +
            // " " +
            // objeto.primerNombre +
            // " " +
            // objeto.segundoNombre +
            // " " +
            // objeto.primerApellido +
            // " " +
            // objeto.segundoApellido
          });
          _context26.next = 10;
          break;

        case 7:
          _context26.prev = 7;
          _context26.t0 = _context26["catch"](0);
          console.error("Error al obtener las sugerencias:", _context26.t0);

        case 10:
        case "end":
          return _context26.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

socioContratanteCedula.addEventListener("input", function () {
  socioContratanteNombre.value = "";
  socioContratanteApellido.value = "";
  var textoIngresado = socioContratanteCedula.value;
  var sugerenciasFiltradas = sugerencias.filter(function (sugerencia) {
    return sugerencia.cedulaPasaporte.startsWith(textoIngresado);
  });

  if (socioContratanteCedula.value !== "") {
    mostrarSugerencias(sugerenciasFiltradas);
  } else {
    listaSugerencias.style.display = "none";
  }
});
socioContratanteApellido.addEventListener("input", function () {
  socioContratanteNombre.value = "";
  socioContratanteCedula.value = "";
  var textoIngresado = socioContratanteApellido.value;
  var sugerenciasFiltradas = sugerencias.filter(function (sugerencia) {
    return sugerencia.primerApellido.startsWith(textoIngresado), sugerencia.segundoApellido.startsWith(textoIngresado);
  });

  if (socioContratanteApellido.value !== "") {
    mostrarSugerencias(sugerenciasFiltradas);
  } else {
    listaSugerencias.style.display = "none";
  }
});
socioContratanteNombre.addEventListener("input", function () {
  socioContratanteApellido.value = "";
  socioContratanteCedula.value = "";
  var textoIngresado = socioContratanteNombre.value;
  var sugerenciasFiltradas = sugerencias.filter(function (sugerencia) {
    return sugerencia.primerNombre.startsWith(textoIngresado), sugerencia.segundoNombre.startsWith(textoIngresado);
  });

  if (socioContratanteNombre.value !== "") {
    mostrarSugerencias(sugerenciasFiltradas);
  } else {
    listaSugerencias.style.display = "none";
  }
});

function mostrarSugerencias(sugerencias) {
  listaSugerencias.innerHTML = "";
  listaSugerencias.style.display = "block";
  sugerencias.forEach(function (sugerencia) {
    var li = document.createElement("li");
    li.textContent = sugerencia.cedulaPasaporte + " (" + sugerencia.primerNombre + " " + sugerencia.segundoNombre + " " + sugerencia.primerApellido + " " + sugerencia.segundoApellido + ")";
    li.addEventListener("click", function () {
      socioContratanteCedula.value = sugerencia.cedulaPasaporte;
      obtenerDatosSocioContratante(sugerencia.cedulaPasaporte);
      listaSugerencias.innerHTML = "";
    });
    li.style.padding = "1px";
    li.style.cursor = "pointer";
    li.style.listStyle = "none";
    listaSugerencias.appendChild(li);
  });
} // ----------------------------------------------------------------
// Obtener las sugerencias desde la base de datos al cargar la página
// ----------------------------------------------------------------


document.addEventListener("DOMContentLoaded", function () {
  obtenerSugerencias().then(function () {
    console.log("Sugerencias obtenidas:", sugerencias);
  })["catch"](function (error) {
    console.error("Error al obtener las sugerencias:", error);
  });
});

var obtenerDatosSocioContratante = function obtenerDatosSocioContratante(cedula) {
  var socioContratante;
  return regeneratorRuntime.async(function obtenerDatosSocioContratante$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          console.log("Se llamo a la carga de datos del contratante", cedula);
          _context27.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratanteByCedula", cedula));

        case 3:
          socioContratante = _context27.sent;
          socioContratanteCedula.value = cedula;
          socioContratanteNombre.value = socioContratante.primerNombre + " " + socioContratante.segundoNombre;
          socioContratanteApellido.value = socioContratante.primerApellido + " " + socioContratante.segundoApellido;
          socioContratanteId = socioContratante.id;
          console.log(socioContratante);
          verificarContratosAnteriores(cedula);

        case 10:
        case "end":
          return _context27.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// funcion que notifica si el usuario presenta contratos anteriores
// ----------------------------------------------------------------


var verificarContratosAnteriores = function verificarContratosAnteriores(cedula) {
  var contratos;
  return regeneratorRuntime.async(function verificarContratosAnteriores$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          console.log("Se llamo a la verificacion de contratos", cedula);
          _context28.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratosAnterioresByCedula", cedula));

        case 3:
          contratos = _context28.sent;
          console.log(contratos);
          renderContratosSimilares(contratos);

        case 6:
        case "end":
          return _context28.stop();
      }
    }
  });
};

ipcRenderer.on("showAlertMedidoresExistentes", function (event, message) {
  Swal.fire({
    title: "Contratos anteriores",
    text: message,
    icon: "info" // Puedes usar 'success', 'error', 'warning', 'info', etc.

  }); //alert(message);
  // window.showErrorBox("Título", "Contenido del mensaje");
}); // ----------------------------------------------------------------
// Habilitar o desabilitar el formulario del
//medidor en funcion de si el socio solicita el servicio de agua potable
// ----------------------------------------------------------------

function habilitarFormMedidor() {
  console.log("Habilitando form medidor");
  fechaInstalacion.disabled = false;
  fechaInstalacion.readOnly = false;
  medidorMarca.disabled = false; // (medidorNumeroCasa.disabled = false), (medidorBarrio.disabled = false);
  // medidorPrincipal.disabled = false;
  // medidorSecundaria.disabled = false;
  // medidorReferencia.disabled = false;

  medidorObservacion.disabled = false;
}

function inHabilitarFormMedidor() {
  fechaInstalacion.disabled = true;
  medidorMarca.disabled = true; // (medidorNumeroCasa.disabled = true), (medidorBarrio.disabled = true);
  // medidorPrincipal.disabled = true;
  // medidorSecundaria.disabled = true;
  // medidorReferencia.disabled = true;

  medidorObservacion.disabled = true;
} // async function generarCodigo() {
//   const sectores =await ipcRenderer.invoke("getSectores");
//   Swal.fire({
//     title: "Código de contrato.",
//     html: `
//         <label for="opciones">Barrio:</label>
//         <select id="sectorNombre" class="form-select">
//         </select>
//         <br>
//         <label for="texto">Numero de contrato:</label>
//         <input type="text" id="numeroContrato" class="form-control" ">
//     `,
//     confirmButtonText: "Aceptar",
//     confirmButtonColor: " #f8c471",
//     showCancelButton: true,
//     cancelButtonText: "Cancelar",
//     preConfirm: () => {
//       const sectorNombre = document.getElementById("sectorNombre").value;
//       const numeroContrato = document.getElementById("numeroContrato").value;
//       return { sector: sectorNombre, numero: numeroContrato };
//     },
//   }).then((result) => {
//     if (result.isConfirmed) {
//       // Aquí puedes usar result.value.opcion y result.value.texto
//       const sector = result.value.sector;
//       const numero = result.value.numero;
//       // Realiza acciones con los valores obtenidos
//       console.log("Código del contrato:", sector + numero);
//       contratoCodigo.value = sector + numero;
//       // console.log("Texto ingresado:", texto);
//     }
//   });
// }


function generarCodigo() {
  var codigoGenerado, barrio, sectores, selectElement, numeroContrato, select, codigoInput;
  return regeneratorRuntime.async(function generarCodigo$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          codigoGenerado = "error";
          barrio = "No seleccionado";
          _context29.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getSectores"));

        case 4:
          sectores = _context29.sent;
          selectElement = document.createElement("select");
          selectElement.id = "sectorNombre";
          selectElement.classList.add("form-select"); // Itera sobre la lista de sectores y agrega opciones al select

          numeroContrato = document.createElement("input");
          numeroContrato.type = "text";
          numeroContrato.id = "numeroContrato";
          numeroContrato.classList.add("form-control");
          numeroContrato.readOnly = true;
          sectores.forEach(function (sector) {
            var optionElement = document.createElement("option");
            optionElement.value = sector.id; // Valor de la opción

            optionElement.setAttribute("data-values", [sector.abreviatura + sector.codigo + sector.numeroSocios]);
            optionElement.setAttribute("barrio", sector.barrio);
            optionElement.textContent = sector.barrio + " (" + sector.abreviatura + sector.codigo + ")"; // Texto visible de la opción

            selectElement.appendChild(optionElement);
          });
          Swal.fire({
            title: "Código de contrato.",
            width: 600,
            html: "\n      <label for=\"opciones\">Barrio:</label>\n      ".concat(selectElement.outerHTML, " <!-- Inserta el select aqu\xED -->\n      <br>\n      <label for=\"texto\">Numero de contrato:</label>\n      <p id=\"mensaje-codigo-error\" class=\"fs-6 my-1 mx-1\n       d-flex justify-content-center align-items-baseline\" \n       style=\"color:#21618C; \"><i class=\" mx-2 fa-solid fa-circle-info\" style=\"color:#21618C; \">\n       </i>Selecciona un sector para generar un c\xF3digo.</p>\n\n      ").concat(numeroContrato.outerHTML, "\n  \n        \n     \n   \n    "),
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#85C1E9",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: " #D98880",
            preConfirm: function preConfirm() {
              // const sectorNombre = document.getElementById("sectorNombre").value;
              num = document.getElementById("numeroContrato").value;
              return {
                codigo: num,
                barrio: barrio
              };
            }
          }).then(function (result) {
            if (result.isConfirmed) {
              var codigo = result.value.codigo;
              console.log("Código del contrato:", codigo);
              contratoCodigo.value = codigo;
              medidorBarrio.value = result.value.barrio;
            }
          }); // Obtén el select por su id

          select = document.getElementById("sectorNombre");
          codigoInput = document.getElementById("numeroContrato");

          select.onchange = function () {
            numero = 1;
            var selectedOption = select.options[select.selectedIndex];
            var atributoValor = selectedOption.getAttribute("data-values");

            if (atributoValor[2] != "0") {
              numero = parseInt(atributoValor[2]) + 1;
            }

            var numeroConRelleno = numero.toString().padStart(4, "0");
            codigoGenerado = atributoValor[1] + atributoValor[0] + numeroConRelleno;
            sectorId = select.value;
            barrio = selectedOption.getAttribute("barrio");
            console.log("Valor del atributo seleccionado:", atributoValor[0], atributoValor[1], atributoValor[2], barrio, sectorId);
            codigoInput.value = codigoGenerado;
          };

        case 18:
        case "end":
          return _context29.stop();
      }
    }
  });
} // ----------------------------------------------------------------
// La fecha de contrato siempre este en la fecha actual.
// ----------------------------------------------------------------


contratoFecha.value = formatearFecha(new Date()); // ----------------------------------------------------------------
// Cambiar de texto si el checkbox es 'Check' y viceversa.
// ----------------------------------------------------------------

contratoEstado.onchange = function () {
  if (contratoEstado.checked) {
    labelEstadoContrato.textContent = "Activo";
  } else {
    labelEstadoContrato.textContent = "Innactivo";
  }
};

medidorSinMedidor.onchange = function () {
  if (medidorSinMedidor.value == "medidor") {
    conMedidor.classList.remove("innactive-list");
    conMedidor.classList.add("active-list");
    sinMedidor.classList.remove("active-list");
    sinMedidor.classList.add("innactive-list");
    titleContratos.innerHTML = "Contratos con medidor" + '<i class="fs-1 fa-solid fa-file-signature mx-2 my-2"></i>';
  } else {
    sinMedidor.classList.remove("innactive-list");
    sinMedidor.classList.add("active-list");
    conMedidor.classList.remove("active-list");
    conMedidor.classList.add("innactive-list");
    titleContratos.innerHTML = "Contratos sin medidor" + '<i class="fs-1 fa-solid fa-file-signature mx-2 my-2"></i>';
  }
};

ipcRenderer.on("contrato-desde-socios", function _callee10(event, socioId, socioCedula) {
  return regeneratorRuntime.async(function _callee10$(_context30) {
    while (1) {
      switch (_context30.prev = _context30.next) {
        case 0:
          console.log("Socio id recibido: " + socioId, socioCedula);
          obtenerDatosSocioContratante(socioCedula);

        case 2:
        case "end":
          return _context30.stop();
      }
    }
  });
});
ipcRenderer.on("Notificar", function (event, response) {
  if (response.title === "Borrado!") {
    resetForm();
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
  return regeneratorRuntime.async(function resetFormAfterUpdate$(_context31) {
    while (1) {
      switch (_context31.prev = _context31.next) {
        case 0:
          _context31.next = 2;
          return regeneratorRuntime.awrap(getContratos());

        case 2:
          _context31.next = 4;
          return regeneratorRuntime.awrap(getContratosSinMedidor());

        case 4:
          mensajeError.textContent = "";
          errorContainer.style.color = "white";

        case 6:
        case "end":
          return _context31.stop();
      }
    }
  });
}

function resetFormAfterSave() {
  return regeneratorRuntime.async(function resetFormAfterSave$(_context32) {
    while (1) {
      switch (_context32.prev = _context32.next) {
        case 0:
          _context32.next = 2;
          return regeneratorRuntime.awrap(getContratos());

        case 2:
          _context32.next = 4;
          return regeneratorRuntime.awrap(getContratosSinMedidor());

        case 4:
          // editingStatus = false;
          // editContratoId = "";
          // contratoForm.reset();
          mensajeError.textContent = "";
          errorContainer.style.color = "white"; // fechaCreacion.value = formatearFecha(new Date());

        case 6:
        case "end":
          return _context32.stop();
      }
    }
  });
}

function resetForm() {
  serviciosCompartidos.disabled = true;
  editingStatus = false;
  editContratoId = "";
  editSocioId = "";
  contratoForm.reset();
  mensajeError.textContent = "";
  inHabilitarFormMedidor();
  ocultarServiciosDisponibles();
  habilitarNuevoContrato();
  errorContainer.style.color = "white";
  contratoFecha.value = formatearFecha(new Date());
}

function habilitarNuevoContrato() {
  serviciosCompartidos.disabled = true;
  socioContratanteCedula.readOnly = false;
  socioContratanteApellido.readOnly = false;
  socioContratanteNombre.readOnly = false;
  generarCodigoBt.disabled = false;
  contratoFecha.readOnly = false;
  listaSugerencias.style.display = "none";
}

function ocultarServiciosDisponibles() {
  servicosDisponiblesList.innerHTML = "";
  var divNoServiciosContainer = document.createElement("div");
  divNoServiciosContainer.className = "col-12 text-center d-flex justify-content-center align-items-center";
  var divNoServiciosText = document.createElement("div");
  var noServiciosTitle = document.createElement("h3");
  noServiciosTitle.className = "text-secondary";
  noServiciosTitle.textContent = "Registra el contrato para " + "poder acceder a los servicios disponibles";
  var noServiciosText = document.createElement("p");
  noServiciosText.innerHTML = '<i class="text-secondary fs-1 fa-solid fa-gears"></i>';
  divNoServiciosText.appendChild(noServiciosTitle);
  divNoServiciosText.appendChild(noServiciosText);
  divNoServiciosContainer.appendChild(divNoServiciosText);
  servicosDisponiblesList.appendChild(divNoServiciosContainer);
}

generarCodigoBt.onclick = function () {
  generarCodigo();
};

cancelarContrato.onclick = function () {
  resetForm();
}; // ----------------------------------------------------------------
// Transicion entre las secciones de la vista
// ----------------------------------------------------------------


var btnSeccion1 = document.getElementById("btnSeccion1");
var btnSeccion2 = document.getElementById("btnSeccion2");
var seccion1 = document.getElementById("seccion1");
var seccion2 = document.getElementById("seccion2");
btnSeccion1.addEventListener("click", function () {
  console.log("btn1");
  seccion2.classList.remove("active");
  seccion1.classList.add("active");
  resetForm();
});
btnSeccion2.addEventListener("click", function () {
  console.log("btn2");
  seccion1.classList.remove("active");
  seccion2.classList.add("active");
}); // ----------------------------------------------------------------
// funciones de trancision entre interfaces
// ----------------------------------------------------------------

function cerrarSesion() {
  ipcRenderer.send("cerrarSesion");
}

ipcRenderer.on("sesionCerrada", function _callee11() {
  var acceso, url;
  return regeneratorRuntime.async(function _callee11$(_context33) {
    while (1) {
      switch (_context33.prev = _context33.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Login";
          _context33.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context33.stop();
      }
    }
  });
});

var abrirInicio = function abrirInicio() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirInicio$(_context34) {
    while (1) {
      switch (_context34.prev = _context34.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Inicio";
          _context34.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context34.stop();
      }
    }
  });
};

var abrirSocios = function abrirSocios() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirSocios$(_context35) {
    while (1) {
      switch (_context35.prev = _context35.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Socios";
          _context35.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context35.stop();
      }
    }
  });
};

var abrirUsuarios = function abrirUsuarios() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirUsuarios$(_context36) {
    while (1) {
      switch (_context36.prev = _context36.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Usuarios";
          _context36.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context36.stop();
      }
    }
  });
};

var abrirPagos = function abrirPagos() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirPagos$(_context37) {
    while (1) {
      switch (_context37.prev = _context37.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Pagos";
          _context37.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context37.stop();
      }
    }
  });
};

var abrirPlanillas = function abrirPlanillas() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirPlanillas$(_context38) {
    while (1) {
      switch (_context38.prev = _context38.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Planillas";
          _context38.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context38.stop();
      }
    }
  });
};

var abrirContratos = function abrirContratos() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirContratos$(_context39) {
    while (1) {
      switch (_context39.prev = _context39.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Contratos";
          _context39.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context39.stop();
      }
    }
  });
};

var abrirServicios = function abrirServicios() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirServicios$(_context40) {
    while (1) {
      switch (_context40.prev = _context40.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Servicios fijos";
          _context40.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context40.stop();
      }
    }
  });
};

var abrirCuotas = function abrirCuotas() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirCuotas$(_context41) {
    while (1) {
      switch (_context41.prev = _context41.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Servicios ocacionales";
          _context41.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context41.stop();
      }
    }
  });
};

init();