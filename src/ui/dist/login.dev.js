"use strict";

var _require = require("electron"),
    ipcRenderer = _require.ipcRenderer; // const SecureElectronStore = require('secure-electron-store');


var validator = require("validator");

var Swal = require("sweetalert2"); // const abrirInterface = async()=> {
//    const result=  ipcRenderer.send('abrirInterface',"src/ui/index.html");
//   }


var usuarioUsuario = document.getElementById("usuario");
var usuarioClave = document.getElementById("clave");
var mensajeError = document.getElementById("mensajeError"); // const store = SecureElectronStore().getInstance();
// ----------------------------------------------------------------
// Funcion de inicio de session
// ----------------------------------------------------------------

loginForm.addEventListener("submit", function _callee(e) {
  var usuario, clave;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          e.preventDefault();
          usuario = usuarioUsuario.value;
          clave = usuarioClave.value;

          if (!(validator.isEmpty(usuario) || validator.isEmpty(clave))) {
            _context.next = 7;
            break;
          }

          mensajeError.textContent = "Todos los campos son obligatorios.";
          _context.next = 15;
          break;

        case 7:
          if (validator.isLength(clave, {
            max: 20
          })) {
            _context.next = 11;
            break;
          }

          mensajeError.textContent = "La contraseña tiene un maximo de 20 caracteres.";
          _context.next = 15;
          break;

        case 11:
          // Si los campos son válidos, puedes enviar el formulario aquí
          mensajeError.textContent = "";
          _context.next = 14;
          return regeneratorRuntime.awrap(ipcRenderer.send("validarUsuarios", {
            usuario: usuario,
            clave: clave
          }));

        case 14:
          console.log("Formulario válido, se puede enviar.");

        case 15:
          usuarioUsuario.focus();

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funcion de recepcion de respuesta al intentar logearse
// ----------------------------------------------------------------

ipcRenderer.on("loginResponse", function _callee2(event, response) {
  var acceso, url;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          acceso = "";

          if (!response.success) {
            _context2.next = 9;
            break;
          }

          console.log("Incio de session correcto");
          url = "Inicio";

          try {
            acceso = response.data;
            sessionStorage.setItem("acceso", acceso);
            console.log(sessionStorage.getItem("acceso"));
          } catch (error) {
            console.log(error);
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 7:
          _context2.next = 10;
          break;

        case 9:
          if (response.message === "No existe este usuario") {
            console.log("Usuario incorrecto");
            usuarioUsuario.focus();
          } else if (response.message === "Credenciales incorrectas") {
            console.log("Contraseña incorrecta");
            usuarioClave.value = "";
          } else {
            console.log("mensaje", response.message);
            console.log("No se ha podido iniciar session");
          }

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funcion para mostrar el formulario de Login
// ----------------------------------------------------------------

function mostrarLogin() {
  var dialog = document.getElementById("loginDialog");
  dialog.showModal();
} // ----------------------------------------------------------------
// Funcion para ocultar el formulario de Login
// ----------------------------------------------------------------


function cancelar() {
  var dialog = document.getElementById("loginDialog");
  dialog.close();
} // ----------------------------------------------------------------
// Funcion para salir de la aplicacion
// ----------------------------------------------------------------


function salir() {
  ipcRenderer.send("salir");
}

document.getElementById("outButton").addEventListener("click", function () {
  Swal.fire({
    title: "¿Quieres salir de la aplicación?",
    icon: "question",
    iconColor: "#f8c471",
    showCancelButton: true,
    confirmButtonColor: "#2874A6",
    cancelButtonColor: "#EC7063 ",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar"
  }).then(function (result) {
    if (result.isConfirmed) {
      // Aquí puedes realizar la acción que desees cuando el usuario confirme.
      ipcRenderer.send("salir");
    }
  });
}); // loginForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const url = "src/ui/usuarios.html";
//   const result = ipcRenderer.send("abrirInterface", url);
// });