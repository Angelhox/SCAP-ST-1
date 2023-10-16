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
var labelEstadoContrato = document.getElementById("labelEstadoContrato"); //Indica si se ha seleccionado el servicio de agua con medidor

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

var editContratoId = ""; // ----------------------------------------------------------------
// Esta funcion obtiene los id de los servicios disponibles
// los manipula como elementos del DOM asignandoles el evento de marcado y desmarcado
// para validar si se ha seleccionado al menos un servicio a contratar.
// ----------------------------------------------------------------

function eventoServiciosId(serviciosFijos) {
  return regeneratorRuntime.async(function eventoServiciosId$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
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
                  inHabilitarFormMedidor();
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

        case 1:
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
  var newMedidor, contratoEstadoDf, medidorDf, callePrincipalDf, calleSecundariaDf, numeroCasaDf, observacionDf, newContrato, resultContrato, result, _resultContrato, resultMedidor;

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
          _context2.next = 123;
          break;

        case 8:
          if (!validator.isEmpty(contratoFecha.value)) {
            _context2.next = 14;
            break;
          }

          errorContainer.style.color = "red";
          mensajeError.textContent = "Ingresa una fecha de contrato válida.";
          contratoFecha.focus();
          _context2.next = 123;
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

          _context2.next = 123;
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

          _context2.next = 123;
          break;

        case 26:
          if (!validator.isEmpty(medidorReferencia.value)) {
            _context2.next = 32;
            break;
          }

          errorContainer.style.color = "red";
          mensajeError.textContent = "Ingresa una referencia válida.";
          medidorReferencia.focus();
          _context2.next = 123;
          break;

        case 32:
          if (!(contratoConMedidor && validator.isEmpty(medidorInstalacion.value))) {
            _context2.next = 38;
            break;
          }

          errorContainer.style.color = "red";
          mensajeError.textContent = "Ingresa una fecha de instalación válida.";
          medidorInstalacion.focus();
          _context2.next = 123;
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

          _context2.next = 123;
          break;

        case 44:
          if (!(serviciosDisponiblesAContratar.length === 0)) {
            _context2.next = 49;
            break;
          }

          errorContainer.style.color = "red";
          mensajeError.textContent = "Selecciona al menos un servicio a contratar.";
          _context2.next = 123;
          break;

        case 49:
          if (!(serviciosMarcados.length === 0)) {
            _context2.next = 54;
            break;
          }

          errorContainer.style.color = "red";
          mensajeError.textContent = "Selecciona al menos un servicio a contratar.";
          _context2.next = 123;
          break;

        case 54:
          console.log("Servicios a contratar: " + serviciosDisponiblesAContratar);

          if (!(!socioContratanteId == "")) {
            _context2.next = 122;
            break;
          }

          contratoEstadoDf = "Activo";
          medidorDf = "No";
          callePrincipalDf = "SN";
          calleSecundariaDf = "SN";
          numeroCasaDf = "SN";
          observacionDf = "SN";

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
          newContrato = {
            fecha: contratoFecha.value,
            estado: contratoEstadoDf,
            codigo: contratoCodigo.value,
            sociosId: socioContratanteId,
            medidorSn: medidorDf,
            barrio: medidorBarrio.value,
            callePrincipal: callePrincipalDf,
            calleSecundaria: calleSecundariaDf,
            numeroCasa: numeroCasaDf,
            referencia: medidorReferencia.value // contratosId: contratoId,

          };

          if (editingStatus) {
            _context2.next = 95;
            break;
          }

          _context2.prev = 71;
          _context2.next = 74;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("createContrato", newContrato, numero, sectorId));

        case 74:
          resultContrato = _context2.sent;
          console.log("Muestro resultado de insertar contrato: ", resultContrato);
          contratoId = resultContrato.id;
          console.log("Muestro id resultado de insertar contrato: ", contratoId);

          if (!(!contratoId == "" || !contratoId == undefined)) {
            _context2.next = 88;
            break;
          }

          _context2.next = 81;
          return regeneratorRuntime.awrap(contratarServicios(serviciosDisponiblesAContratar, contratoId));

        case 81:
          if (!contratoConMedidor) {
            _context2.next = 88;
            break;
          }

          console.log("vamos a crear un medidor");
          newMedidor.contratosId = contratoId;
          _context2.next = 86;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("createMedidor", newMedidor));

        case 86:
          result = _context2.sent;
          console.log(result);

        case 88:
          _context2.next = 93;
          break;

        case 90:
          _context2.prev = 90;
          _context2.t0 = _context2["catch"](71);
          console.log("Error al registrar el contrato: ", _context2.t0);

        case 93:
          _context2.next = 114;
          break;

        case 95:
          console.log("Editing contrato with electron");
          newMedidor.contratosId = editContratoId;
          _context2.prev = 97;
          _context2.next = 100;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("updateContrato", editContratoId, newContrato));

        case 100:
          _resultContrato = _context2.sent;

          if (!contratoConMedidor) {
            _context2.next = 105;
            break;
          }

          _context2.next = 104;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("updateMedidor", editContratoId, newMedidor));

        case 104:
          resultMedidor = _context2.sent;

        case 105:
          contratarServicios(serviciosDisponiblesAContratar, editContratoId);
          console.log(_resultContrato);
          _context2.next = 112;
          break;

        case 109:
          _context2.prev = 109;
          _context2.t1 = _context2["catch"](97);
          console.log("Error al editar el contrato: ", _context2.t1);

        case 112:
          editingStatus = false;
          editContratoId = "";

        case 114:
          getContratos();
          contratoId = "";
          editContratoId = "";
          contratoConMedidor = false;
          contratoForm.reset();
          socioContratanteCedula.focus();
          _context2.next = 123;
          break;

        case 122:
          console.log("Socio not found");

        case 123:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[71, 90], [97, 109]]);
}); // ----------------------------------------------------------------
// Funcion que recibe los id de servicios a contratar y los relaciona con el id del contrato
// ----------------------------------------------------------------

function contratarServicios(serviciosAContratar, contratoId) {
  console.log("Contratando Servicios para: " + contratoId);
  var conteoRegistros = serviciosAContratar.length;

  try {
    serviciosAContratar.forEach(function _callee2(servicioAContratar) {
      var adquiridoSn, resultServiciosContratados;
      return regeneratorRuntime.async(function _callee2$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              adquiridoSn = "";

              if (document.getElementById(servicioAContratar).checked) {
                adquiridoSn = "Activo";
              } else {
                adquiridoSn = "Innactivo";
              }

              _context3.next = 4;
              return regeneratorRuntime.awrap(ipcRenderer.invoke("createServiciosContratados", servicioAContratar, contratoId, 1, adquiridoSn));

            case 4:
              resultServiciosContratados = _context3.sent;
              console.log("Resultado de contratar servicios: ", resultServiciosContratados);
              conteoRegistros = conteoRegistros - 1;
              console.log("conteo: " + conteoRegistros);

            case 8:
            case "end":
              return _context3.stop();
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
} // function renderContratosSinMedidor(datosContratosSinMedidor) {
//   contratosSinMedidorList.innerHTML = "";
//   const cardContainer = document.createElement("div");
//   cardContainer.classList.add("card-container-horizontal");
//   datosContratosSinMedidor.forEach((contratosinmedidor) => {
//     const card = document.createElement("div");
//     card.classList.add("card");
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
// function renderServiciosContratos(serviciosContratados) {
//   servicosContratadosList.innerHTML = "";
//   serviciosContratados.forEach((servicioContratado) => {
//     serviciosCheck[servicioContratado.id] = servicioContratado.id;
//     serviciosFijosList.push(servicioContratado.id);
//     servicosContratadosList.innerHTML += `
//     <div class="col-6 text-center">
//     <div class="card card-fondo my-2" style="height: 18rem;">
//       <div class="card-zona-img"></div>
//       <div class="card-body col-12 card-contenido">
//         <div class="col-12">
//           <h5 class="card-title">${servicioContratado.nombre}</h5>
//         </div>
//         <div class="col-12 card-zona-desc" >
//           <p class="card-text">
//             ${servicioContratado.descripcion}
//           </p>
//         </div>
//         <div
//           class="col-12 d-flex justify-content-center align-items-center"
//         >
//           <input
//             type="checkbox"
//             class="btn-check"
//             name="options-outlined"
//             id="${servicioContratado.id}"
//             autocomplete="off"
//           />
//           <label
//             style="width: 40%"
//             class="btn btn-outline-success"
//             for="${servicioContratado.id}"
//             >Adquirido</label
//           >
//         </div>
//       </div>
//     </div>
//   </div>
//       `;
//     //const servicio = ;
//   });
//   console.log(serviciosCheck);
//   console.log(serviciosFijosList[0]);
// }
// ----------------------------------------------------------------
// Funcion que crea las cards de los servicios registrados segun el id
// del contrato seleccionado
// ----------------------------------------------------------------


function renderServiciosContratados(serviciosContratados) {
  serviciosContratadosList.innerHTML = "";
  serviciosContratados.forEach(function (servicioContratado) {
    serviciosContratadosList.innerHTML += "\n     \n    <div class=\"col-12 text-center \">\n    <div class=\"card card-fondo card-espacios\" style=\"height: 12rem\">\n      <div class=\"card-zona-img\"></div>\n      <div class=\"card-body col-12 card-contenido\">\n        <div class=\"col-12\">\n          <h5 class=\"card-title\">".concat(servicioContratado.nombre, "</h5>\n        </div>\n        <div class=\"col-12 card-zona-desc-ct\">\n          <p class=\"card-text\">\n            ").concat(servicioContratado.descripcion, "\n          </p>\n        </div>\n        <div\n          class=\"col-12 d-flex justify-content-center align-items-center\"\n        ></div>\n      </div>\n    </div>\n  </div>\n      ");
  });
  console.log(serviciosDisponiblesAContratar[0]);
} // ----------------------------------------------------------------
// Funcion que crea las cards de los servicios disponibles para los nuevos contratos
// ----------------------------------------------------------------


function renderServiciosDisponibles(serviciosDisponibles) {
  servicosDisponiblesList.innerHTML = "";

  for (var i = 0; i < serviciosDisponibles.length; i++) {
    console.log("Servicios: ", serviciosDisponibles[i]); //serviciosContratados.forEach((servicioContratado) => {

    serviciosDisponiblesAContratar.push(serviciosDisponibles[i].id);
    var cardContainer = document.createElement("div");
    cardContainer.classList.add("col-6", "text-center");
    var card = document.createElement("div");
    card.classList.add("card", "card-fondo", "my-2");
    card.style.height = "18rem";
    var cardImage = document.createElement("div");
    cardImage.classList.add("card-zona-img");
    var cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "col-12", "card-contenido");
    var title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = serviciosDisponibles[i].nombre;
    var description = document.createElement("p");
    description.classList.add("card-text");
    description.textContent = serviciosDisponibles[i].descripcion;
    var checkboxDiv = document.createElement("div");
    checkboxDiv.classList.add("col-12", "d-flex", "justify-content-center", "align-items-center");
    var checkbox = document.createElement("input"); //checkbox.checked = "false";

    checkbox.type = "checkbox";
    checkbox.classList.add("btn-check"); //checkbox.name = "options-outlined";

    checkbox.id = serviciosDisponibles[i].id; // checkbox.autocomplete = "off";

    checkbox.checked = false;
    var label = document.createElement("label");
    label.style.width = "40%";
    label.classList.add("btn", "btn-outline-warning");
    label.setAttribute("for", serviciosDisponibles[i].id);
    label.textContent = "Adquirido";
    checkboxDiv.appendChild(checkbox);
    checkboxDiv.appendChild(label);
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(checkboxDiv);
    card.appendChild(cardImage);
    card.appendChild(cardBody);
    cardContainer.appendChild(card);
    servicosDisponiblesList.appendChild(cardContainer);
  }

  marcarServiciosContratados();
  console.log(serviciosDisponiblesAContratar[0]);
}

function marcarServiciosContratados() {
  if (serviciosEditar !== null) {
    console.log("Marcando servicios: " + serviciosEditar);

    for (var i = 0; i < serviciosEditar.length; i++) {
      document.getElementById(serviciosEditar[i].serviciosId).checked = true;
    }
  }
} // ----------------------------------------------------------------
// Funcion que muestra los detalles de los contratos registrados
// segun se los seleccione
// ----------------------------------------------------------------


var detallesContratos = function detallesContratos(id) {
  var serviciosContratos;
  return regeneratorRuntime.async(function detallesContratos$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log("Detallles de : " + id);
          contratoForm.reset();
          _context4.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getServiciosContratadosById", id));

        case 4:
          serviciosContratos = _context4.sent;
          renderServiciosContratados(serviciosContratos);
          console.log(serviciosContratos);
          return _context4.abrupt("return", serviciosContratos);

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que carga los datos de los contratos registrados y los muestra en
// el formulario para editarlos
// ----------------------------------------------------------------


var editContrato = function editContrato(id) {
  var contrato, conMedidor;
  return regeneratorRuntime.async(function editContrato$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          contratoForm.reset();
          _context5.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getDatosContratosById", id));

        case 3:
          contrato = _context5.sent;
          console.log("Recibido: " + contrato);
          conMedidor = contrato.medidorSn;

          if (conMedidor == "Si") {
            console.log("conMedidor");
            habilitarFormMedidor();
            contratoFecha.value = formatearFecha(contrato.fecha);
            socioContratanteCedula.value = contrato.cedulaPasaporte;
            socioContratanteApellido.value = contrato.primerApellido + " " + contrato.segundoApellido;
            socioContratanteNombre.value = contrato.primerNombre + " " + contrato.segundoNombre;
            contratoCodigo.value = contrato.codigo;
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
            medidorObservacion.disabled = false; // Inhabilitamos los campos que no se deben editar

            contratoFecha.readOnly = true;
            socioContratanteCedula.readOnly = true;
            socioContratanteApellido.readOnly = true;
            socioContratanteNombre.readOnly = true; // ~~~~~~~~~~~~~~~~

            editContratoId = contrato.id;
          } else {
            console.log("sinMedidor");
            inHabilitarFormMedidor();
            contratoCodigo.value = contrato.codigo;
            contratoFecha.value = formatearFecha(contrato.fecha);
            socioContratanteCedula.value = contrato.cedulaPasaporte;
            socioContratanteApellido.value = contrato.primerApellido + " " + contrato.segundoApellido;
            socioContratanteNombre.value = contrato.primerNombre + " " + contrato.segundoNombre; // if (medidor.pagoRecoleccionDesechos == "Si") {
            //   contratoPagoRecoleccion.checked = true;
            // } else {
            //   contratoPagoRecoleccion.checked = false;
            // }
            // if (medidor.pagoAlcanterillado == "Si") {
            //   contratoPagoAlcanterillado.checked = true;
            // } else {
            //   contratoPagoAlcanterillado.checked = false;
            // }
            // if (medidor.pagoEscrituras == "Si") {
            //   contratoPagoEscrituras.checked = true;
            // } else {
            //   contratoPagoEscrituras.checked = false;
            // }
            // if (medidor.pagoAguaPotable == "Si") {
            //   contratoPagoAguaPotable.checked = true;
            // } else {
            //   contratoPagoAguaPotable.checked = false;
            // }
            // medidorCodigo.value = medidor.codigo;
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
              medidorInstalacion.value = formatearFecha(contrato.fechaInstalacion);
              medidorMarca.value = contrato.marca;
              medidorObservacion.value = contrato.observacion;
            }

            contratoFecha.readOnly = true;
            socioContratanteCedula.readOnly = true;
            socioContratanteApellido.readOnly = true;
            socioContratanteNombre.readOnly = true; // ~~~~~~~~~~~~~~~~

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

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que carga los servicios contratados segun el id del contrato
// y los muestra en el formulario para editarlos
// ----------------------------------------------------------------


function editarServiciosContratados(id) {
  return regeneratorRuntime.async(function editarServiciosContratados$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getServiciosContratadosById", id));

        case 3:
          serviciosEditar = _context6.sent;
          //serviciosContratadosList.push(serviciosContratados.serviciosFijosId);
          console.log("Servicios a editar: ", serviciosEditar);
          _context6.next = 10;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          console.log("Error al cargar los servicios contratados para " + id + " : " + _context6.t0);

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
} // ----------------------------------------------------------------
// Funcion que elimina un contrato segun el id
// ----------------------------------------------------------------


var deleteMedidor = function deleteMedidor(id) {
  var response, result;
  return regeneratorRuntime.async(function deleteMedidor$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          response = confirm("Estas seguro de eliminar este medidor?");

          if (!response) {
            _context7.next = 8;
            break;
          }

          console.log("id from medidores.js");
          _context7.next = 5;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("deleteMedidor", id));

        case 5:
          result = _context7.sent;
          console.log("Resultado medidores.js", result);
          getContratos();

        case 8:
        case "end":
          return _context7.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que consulta los contratos con medidor
// ----------------------------------------------------------------


var getContratos = function getContratos() {
  return regeneratorRuntime.async(function getContratos$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratosConMedidor"));

        case 2:
          datosContratos = _context8.sent;
          console.log(datosContratos);
          renderContratosConMedidor(datosContratos);

        case 5:
        case "end":
          return _context8.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que consulta los contratos sin medidor
// ----------------------------------------------------------------


var getContratosSinMedidor = function getContratosSinMedidor() {
  return regeneratorRuntime.async(function getContratosSinMedidor$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratosSinMedidor"));

        case 2:
          datosContratosSinMedidor = _context9.sent;
          console.log("Here: ", datosContratosSinMedidor);
          renderContratosSinMedidor(datosContratosSinMedidor);

        case 5:
        case "end":
          return _context9.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que consulta los servicios disponibles para el contrato
// ----------------------------------------------------------------


var getServiciosDisponibles = function getServiciosDisponibles() {
  return regeneratorRuntime.async(function getServiciosDisponibles$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getServiciosDisponibles"));

        case 2:
          serviciosDisponibles = _context10.sent;
          console.log(serviciosDisponibles);
          renderServiciosDisponibles(serviciosDisponibles);
          eventoServiciosId(serviciosDisponibles);

        case 6:
        case "end":
          return _context10.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Funcion que carga los eventos iniciales de la interfaz
// ----------------------------------------------------------------


function init() {
  return regeneratorRuntime.async(function init$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(getContratos());

        case 2:
          _context11.next = 4;
          return regeneratorRuntime.awrap(getContratosSinMedidor());

        case 4:
          _context11.next = 6;
          return regeneratorRuntime.awrap(getServiciosDisponibles());

        case 6:
        case "end":
          return _context11.stop();
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


var inputSugerencias = document.getElementById("cedulaSocioContratante");
var listaSugerencias = document.getElementById("lista-sugerencias");
var sugerencias = []; // ----------------------------------------------------------------
// Obtener las sugerencias desde la base de datos
// ----------------------------------------------------------------

function obtenerSugerencias() {
  var cedulasSugerencias;
  return regeneratorRuntime.async(function obtenerSugerencias$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getSocios"));

        case 3:
          cedulasSugerencias = _context12.sent;
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
          _context12.next = 10;
          break;

        case 7:
          _context12.prev = 7;
          _context12.t0 = _context12["catch"](0);
          console.error("Error al obtener las sugerencias:", _context12.t0);

        case 10:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

inputSugerencias.addEventListener("input", function () {
  var textoIngresado = inputSugerencias.value;
  var sugerenciasFiltradas = sugerencias.filter(function (sugerencia) {
    return sugerencia.cedulaPasaporte.startsWith(textoIngresado);
  });
  mostrarSugerencias(sugerenciasFiltradas);
});

function mostrarSugerencias(sugerencias) {
  listaSugerencias.innerHTML = "";
  sugerencias.forEach(function (sugerencia) {
    var li = document.createElement("li");
    li.textContent = sugerencia.cedulaPasaporte + " (" + sugerencia.primerNombre + " " + sugerencia.primerApellido + " " + sugerencia.segundoApellido + ")";
    li.addEventListener("click", function () {
      inputSugerencias.value = sugerencia.cedulaPasaporte;
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
  return regeneratorRuntime.async(function obtenerDatosSocioContratante$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          console.log("Se llamo a la carga de datos del contratante", cedula);
          _context13.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratanteByCedula", cedula));

        case 3:
          socioContratante = _context13.sent;
          socioContratanteNombre.value = socioContratante.primerNombre + " " + socioContratante.segundoNombre;
          socioContratanteApellido.value = socioContratante.primerApellido + " " + socioContratante.segundoApellido;
          socioContratanteId = socioContratante.id;
          console.log(socioContratante);
          verificarContratosAnteriores(cedula);

        case 9:
        case "end":
          return _context13.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// funcion que notifica si el usuario presenta contratos anteriores
// ----------------------------------------------------------------


var verificarContratosAnteriores = function verificarContratosAnteriores(cedula) {
  var contratos;
  return regeneratorRuntime.async(function verificarContratosAnteriores$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          console.log("Se llamo a la verificacion de contratos", cedula);
          _context14.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getContratosAnterioresByCedula", cedula));

        case 3:
          contratos = _context14.sent;
          console.log(contratos);

        case 5:
        case "end":
          return _context14.stop();
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
  fechaInstalacion.disabled = false;
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
  return regeneratorRuntime.async(function generarCodigo$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          codigoGenerado = "error";
          barrio = "No seleccionado";
          _context15.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getSectores"));

        case 4:
          sectores = _context15.sent;
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
          return _context15.stop();
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
});
btnSeccion2.addEventListener("click", function () {
  console.log("btn2");
  seccion1.classList.remove("active");
  seccion2.classList.add("active");
}); // ----------------------------------------------------------------
// funciones de trancision entre interfaces
// ----------------------------------------------------------------

var abrirInicio = function abrirInicio() {
  var url;
  return regeneratorRuntime.async(function abrirInicio$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          url = "src/ui/principal.html";
          _context16.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context16.stop();
      }
    }
  });
};

var abrirSocios = function abrirSocios() {
  var url;
  return regeneratorRuntime.async(function abrirSocios$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          url = "src/ui/socios.html";
          _context17.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context17.stop();
      }
    }
  });
};

var abrirUsuarios = function abrirUsuarios() {
  var url;
  return regeneratorRuntime.async(function abrirUsuarios$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          url = "src/ui/usuarios.html";
          _context18.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context18.stop();
      }
    }
  });
};

var abrirPagos = function abrirPagos() {
  var url;
  return regeneratorRuntime.async(function abrirPagos$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          url = "src/ui/planillas.html";
          _context19.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context19.stop();
      }
    }
  });
};

var abrirPlanillas = function abrirPlanillas() {
  var url;
  return regeneratorRuntime.async(function abrirPlanillas$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          url = "src/ui/planillas.html";
          _context20.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context20.stop();
      }
    }
  });
};

var abrirParametros = function abrirParametros() {
  var url;
  return regeneratorRuntime.async(function abrirParametros$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          url = "src/ui/parametros.html";
          _context21.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context21.stop();
      }
    }
  });
};

var abrirImplementos = function abrirImplementos() {
  var url;
  return regeneratorRuntime.async(function abrirImplementos$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          url = "src/ui/implementos.html";
          _context22.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context22.stop();
      }
    }
  });
};

var abrirContratos = function abrirContratos() {
  var url;
  return regeneratorRuntime.async(function abrirContratos$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          url = "src/ui/medidores.html";
          _context23.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context23.stop();
      }
    }
  });
};

function mostrarLogin() {
  var dialog = document.getElementById("loginDialog");
  dialog.showModal();
}

init();