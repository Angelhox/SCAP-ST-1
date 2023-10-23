"use strict";

var _require = require("electron"),
    ipcRenderer = _require.ipcRenderer;

var validator = require("validator");

var Swal = require("sweetalert2");

var mensajeError = document.getElementById("mensajeError");
var socioPrimerNombre = document.getElementById("primernombre");
var socioSegundoNombre = document.getElementById("segundonombre");
var socioPrimerApellido = document.getElementById("primerapellido");
var socioSegundoApellido = document.getElementById("segundoapellido");
var socioCedula = document.getElementById("cedula");
var socioNacimiento = document.getElementById("nacimiento");
var socioFijo = document.getElementById("fijo");
var socioMovil = document.getElementById("movil");
var socioCorreo = document.getElementById("correo");
var socioProvincia = document.getElementById("provincia");
var socioCanton = document.getElementById("canton");
var socioParroquia = document.getElementById("parroquia");
var socioBarrio = document.getElementById("barrio");
var socioPrincipal = document.getElementById("principal");
var socioSecundaria = document.getElementById("secundaria");
var socioCasa = document.getElementById("numerocasa");
var socioReferencia = document.getElementById("referencia");
var sociosList = document.getElementById("socios");
var buscarSocios = document.getElementById("buscarSocios");
var criterio = document.getElementById("criterio");
var criterioContent = document.getElementById("criterio-content");
var socios = [];
var editingStatus = false;
var editSocioId = "";
socioForm.addEventListener("submit", function _callee2(e) {
  var segundoNombreSociodf, segundoApellidoSociodf, correoSociodf, fijoSociodf, movilSociodf, casaSociodf, barrioSociodf, principalSociodf, secundariaSociodf, parroquiaSociodf, newSocio, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          e.preventDefault();
          segundoNombreSociodf = "NA";
          segundoApellidoSociodf = "NA";
          correoSociodf = "actualizarCorreo@mail.com";
          fijoSociodf = "9999999999";
          movilSociodf = "9999999999";
          casaSociodf = "NA";
          barrioSociodf = "NA";
          principalSociodf = "Principal";
          secundariaSociodf = "Secundaria";
          parroquiaSociodf = "Ayora";

          if (socioSegundoNombre.value !== null && socioSegundoNombre.value !== "") {
            segundoNombreSociodf = socioSegundoNombre.value;
          }

          if (socioSegundoApellido.value !== null && socioSegundoApellido.value !== "") {
            segundoApellidoSociodf = socioSegundoApellido.value;
          }

          if (socioCorreo.value !== null && socioCorreo.value !== "") {
            correoSociodf = socioCorreo.value;
          }

          if (socioFijo.value !== null && socioFijo.value !== "") {
            fijoSociodf = socioFijo.value;
          }

          if (socioMovil.value !== null && socioMovil.value !== "") {
            movilSociodf = socioMovil.value;
          }

          if (socioCasa.value !== null && socioCasa.value !== "") {
            casaSociodf = socioCasa.value;
          }

          if (socioBarrio.value !== null && socioBarrio.value !== "") {
            barrioSociodf = socioBarrio.value;
          }

          if (socioPrincipal.value !== null && socioPrincipal.value !== "") {
            principalSociodf = socioPrincipal.value;
          }

          if (socioSecundaria.value !== null && socioSecundaria.value !== "") {
            secundariaSociodf = socioSecundaria.value;
          }

          if (socioParroquia.value !== null && socioParroquia.value !== "") {
            parroquiaSociodf = socioParroquia.value;
          }

          if (!validator.isEmpty(socioPrimerNombre.value)) {
            _context2.next = 26;
            break;
          }

          mensajeError.textContent = "El primer nombre es obligatorio.";
          socioPrimerNombre.focus();
          _context2.next = 66;
          break;

        case 26:
          if (!validator.isEmpty(socioPrimerApellido.value)) {
            _context2.next = 31;
            break;
          }

          mensajeError.textContent = "El primer apellido es obligatorio.";
          socioPrimerApellido.focus();
          _context2.next = 66;
          break;

        case 31:
          if (!(validator.isEmpty(socioCedula.value) || !validator.isLength(socioCedula.value, {
            max: 13,
            min: 10
          }))) {
            _context2.next = 36;
            break;
          }

          mensajeError.textContent = "Ingresa un número de cédula válido.";
          socioCedula.focus();
          _context2.next = 66;
          break;

        case 36:
          if (!validator.isEmpty(socioNacimiento.value)) {
            _context2.next = 41;
            break;
          }

          mensajeError.textContent = "Ingresa una fecha de nacimiento válida.";
          socioNacimiento.focus();
          _context2.next = 66;
          break;

        case 41:
          if (!validator.isEmpty(socioProvincia.value)) {
            _context2.next = 46;
            break;
          }

          mensajeError.textContent = "Ingresa una provincia válida";
          socioProvincia.focus();
          _context2.next = 66;
          break;

        case 46:
          if (!validator.isEmpty(socioCanton.value)) {
            _context2.next = 51;
            break;
          }

          mensajeError.textContent = "Ingresa un canton válido.";
          socioCanton.focus();
          _context2.next = 66;
          break;

        case 51:
          if (!(validator.isEmpty(socioReferencia.value) || !validator.isLength(socioReferencia.value, {
            min: 0,
            max: 45
          }))) {
            _context2.next = 56;
            break;
          }

          mensajeError.textContent = "Ingresa una referencia valida de máximo 45 caracteres.";
          socioReferencia.focus(); // } else if (!validator.isEmail(socioCorreo.value)) {
          //   mensajeError.textContent = "Ingresa un correo válido.";
          //   socioCorreo.focus();
          // } else if (!validator.isLength(socioMovil.value, { max: 10, min: 10 })) {
          //   mensajeError.textContent = "Ingresa un télefono móvil válido.";
          //   socioMovil.focus();

          _context2.next = 66;
          break;

        case 56:
          newSocio = {
            primerNombre: socioPrimerNombre.value,
            segundoNombre: segundoNombreSociodf,
            primerApellido: socioPrimerApellido.value,
            segundoApellido: segundoApellidoSociodf,
            cedulaPasaporte: socioCedula.value,
            fechaNacimiento: socioNacimiento.value,
            telefonoMovil: movilSociodf,
            telefonoFijo: fijoSociodf,
            correo: correoSociodf,
            provincia: socioProvincia.value,
            canton: socioCanton.value,
            parroquia: parroquiaSociodf,
            barrio: barrioSociodf,
            callePrincipal: principalSociodf,
            calleSecundaria: secundariaSociodf,
            numeroCasa: casaSociodf,
            referencia: socioReferencia.value
          };

          if (editingStatus) {
            _context2.next = 64;
            break;
          }

          _context2.next = 60;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("createSocio", newSocio));

        case 60:
          result = _context2.sent;
          console.log(result);
          _context2.next = 66;
          break;

        case 64:
          console.log("Editing socio with electron");
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
                      _context.next = 7;
                      break;
                    }

                    _context.next = 3;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("updateSocio", editSocioId, newSocio));

                  case 3:
                    _result = _context.sent;
                    editingStatus = false;
                    editSocioId = "";
                    console.log(_result);

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 66:
        case "end":
          return _context2.stop();
      }
    }
  });
});

function renderSocios(socios) {
  sociosList.innerHTML = "";
  socios.forEach(function (socio) {
    var telefonoValido = socio.telefonoMovil;

    if (telefonoValido == null || telefonoValido == " ") {
      telefonoValido = socio.telefonoFijo;
    }

    sociosList.innerHTML += "\n       <tr>\n   \n       <td>".concat(socio.primerApellido + " " + socio.segundoApellido, "</td>\n      <td>").concat(socio.primerNombre + " " + socio.segundoNombre, "</td>\n      <td>").concat(socio.cedulaPasaporte, "</td>\n      <td>").concat(telefonoValido, "</td>\n      <td>").concat(socio.correo, "</td>\n      <td>").concat(calcularEdad(socio.fechaNacimiento), "</td>\n      <td>").concat(socio.provincia + ", " + socio.canton + ", " + socio.parroquia + ", " + socio.barrio, "</td>\n      <td>\n      <button onclick=\"deleteSocio('").concat(socio.id, "','").concat(socio.primerNombre + " " + socio.primerApellido + " " + socio.segundoApellido, "')\" class=\"btn \"> \n      <i class=\"fa-solid fa-user-minus\"></i>\n      </button>\n      </td>\n      <td>\n      <button onclick=\"editSocio('").concat(socio.id, "')\" class=\"btn \">\n      <i class=\"fa-solid fa-user-pen\"></i>\n      </button>\n      </td>\n   </tr>\n      ");
  });
}

var editSocio = function editSocio(id) {
  var socio;
  return regeneratorRuntime.async(function editSocio$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getSocioById", id));

        case 2:
          socio = _context3.sent;
          socioPrimerNombre.value = socio.primerNombre;
          socioSegundoNombre.value = socio.segundoNombre;
          socioPrimerApellido.value = socio.primerApellido;
          socioSegundoApellido.value = socio.segundoApellido;
          socioCedula.value = socio.cedulaPasaporte;
          socioNacimiento.value = formatearFecha(socio.fechaNacimiento);
          socioFijo.value = socio.telefonoFijo;
          socioMovil.value = socio.telefonoMovil;
          socioCorreo.value = socio.correo;
          socioProvincia.value = socio.provincia;
          socioCanton.value = socio.canton;
          socioParroquia.value = socio.parroquia;
          socioBarrio.value = socio.barrio;
          socioPrincipal.value = socio.callePrincipal;
          socioSecundaria.value = socio.calleSecundaria;
          socioCasa.value = socio.numeroCasa;
          socioReferencia.value = socio.referencia;
          editingStatus = true;
          editSocioId = socio.id;
          console.log(socio);

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var deleteSocio = function deleteSocio(id, socioNombre) {
  return regeneratorRuntime.async(function deleteSocio$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          Swal.fire({
            title: "¿Quieres borrar el registro de " + socioNombre + " ?",
            text: "No podrás deshacer esta acción.",
            icon: "question",
            iconColor: "#f8c471",
            showCancelButton: true,
            confirmButtonColor: "#2874A6",
            cancelButtonColor: "#EC7063 ",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar"
          }).then(function _callee3(result) {
            var _result2;

            return regeneratorRuntime.async(function _callee3$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!result.isConfirmed) {
                      _context4.next = 6;
                      break;
                    }

                    // Aquí puedes realizar la acción que desees cuando el usuario confirme.
                    console.log("id from usuarios.js");
                    _context4.next = 4;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("deleteSocio", id));

                  case 4:
                    _result2 = _context4.sent;
                    console.log("Resultado socios.js", _result2);

                  case 6:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          });

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var getSocios = function getSocios(criterio, criterioContent) {
  return regeneratorRuntime.async(function getSocios$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getSocios", criterio, criterioContent));

        case 2:
          socios = _context6.sent;
          console.log(socios);
          renderSocios(socios);

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  });
};

criterio.onchange = function _callee4() {
  var criterioSeleccionado, criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function _callee4$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          criterioSeleccionado = criterio.value;
          console.log("Seleccionado: ", criterioSeleccionado);

          if (!(criterioSeleccionado === "all")) {
            _context7.next = 11;
            break;
          }

          // criterioContent.textContent = "";
          criterioContent.value = "";
          criterioContent.readOnly = true;
          criterioBuscar = "all";
          criterioContentBuscar = "all";
          _context7.next = 9;
          return regeneratorRuntime.awrap(getSocios(criterioBuscar, criterioContentBuscar));

        case 9:
          _context7.next = 12;
          break;

        case 11:
          criterioContent.readOnly = false;

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  });
};

buscarSocios.onclick = function _callee5() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function _callee5$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          criterioBuscar = criterio.value;
          criterioContentBuscar = criterioContent.value;
          console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
          _context8.next = 5;
          return regeneratorRuntime.awrap(getSocios(criterioBuscar, criterioContentBuscar));

        case 5:
        case "end":
          return _context8.stop();
      }
    }
  });
};

function init() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function init$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          criterioBuscar = "all";
          criterioContentBuscar = "all";
          _context9.next = 4;
          return regeneratorRuntime.awrap(getSocios(criterioBuscar, criterioContentBuscar));

        case 4:
        case "end":
          return _context9.stop();
      }
    }
  });
}

function calcularEdad(fechaNacimiento) {
  var fechaActual = new Date();
  var fechaNacimientoDate = new Date(fechaNacimiento);
  var edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear(); // Verificar si aún no ha pasado el cumpleaños de este año.

  var mesActual = fechaActual.getMonth();
  var diaActual = fechaActual.getDate();
  var mesNacimiento = fechaNacimientoDate.getMonth();
  var diaNacimiento = fechaNacimientoDate.getDate();

  if (mesActual < mesNacimiento || mesActual === mesNacimiento && diaActual < diaNacimiento) {
    edad--;
  }

  return edad;
}

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
  return regeneratorRuntime.async(function resetFormAfterUpdate$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          criterioBuscar = criterio.value;
          criterioContentBuscar = criterioContent.value;
          console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
          console;
          _context10.next = 6;
          return regeneratorRuntime.awrap(getSocios(criterioBuscar, criterioContentBuscar));

        case 6:
          socioPrimerNombre.focus();
          mensajeError.textContent = "";

        case 8:
        case "end":
          return _context10.stop();
      }
    }
  });
}

function resetFormAfterSave() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function resetFormAfterSave$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          criterioBuscar = criterio.value;
          criterioContentBuscar = criterioContent.value;
          console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
          console;
          _context11.next = 6;
          return regeneratorRuntime.awrap(getSocios(criterioBuscar, criterioContentBuscar));

        case 6:
          editingStatus = false;
          editSocioId = "";
          socioForm.reset();
          socioPrimerNombre.focus();
          mensajeError.textContent = "";

        case 11:
        case "end":
          return _context11.stop();
      }
    }
  });
}

function resetForm() {
  editingStatus = false;
  editSocioId = "";
  socioForm.reset();
  socioPrimerNombre.focus();
  mensajeError.textContent = "";
}

function formatearFecha(fecha) {
  var fechaOriginal = new Date(fecha);
  var year = fechaOriginal.getFullYear();
  var month = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
  var day = String(fechaOriginal.getDate()).padStart(2, "0");
  var fechaFormateada = "".concat(year, "-").concat(month, "-").concat(day);
  return fechaFormateada;
}

function imprimir() {
  window.print();
} // funciones del navbar


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

function mostrarLogin() {
  var dialog = document.getElementById("loginDialog");
  dialog.showModal();
}

init();