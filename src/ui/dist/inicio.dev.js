"use strict";

var _require = require("electron"),
    ipcRenderer = _require.ipcRenderer;

var _require2 = require("original-fs"),
    access = _require2.access; // const abrirInterface = async()=> {
//    const result=  ipcRenderer.send('abrirInterface',"src/ui/index.html");
//   }


var usuarioUsuario = document.getElementById("usuario");
var usuarioClave = document.getElementById("clave"); // Funcion de inicio de session
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
          _context.next = 5;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("validarUsuarios", {
            usuario: usuario,
            clave: clave
          }));

        case 5:
          loginForm.reset();
          usuarioUsuario.focus();

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funcion de recepcion de respuesta al intentar logearse
// ----------------------------------------------------------------

ipcRenderer.on("loginResponse", function (event, response) {
  if (response.success) {
    console.log("Incio de session correcto");
  } else {
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
  }
}); // ----------------------------------------------------------------
// Funciones de cierre de sesion
// ----------------------------------------------------------------

function cerrarSesion() {
  ipcRenderer.send("cerrarSesion");
}

ipcRenderer.on("sesionCerrada", function _callee2() {
  var acceso, url;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Login";
          _context2.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Esta funcion abre el formulario para el inicio de sesion
// ----------------------------------------------------------------

function mostrarLogin() {
  var dialog = document.getElementById("loginDialog");
  dialog.showModal();
} // loginForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const url = "src/ui/usuarios.html";
//   const result = ipcRenderer.send("abrirInterface", url);
// });


var abrirInicio = function abrirInicio() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirInicio$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Inicio";
          _context3.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var abrirSocios = function abrirSocios() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirSocios$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Socios";
          _context4.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var abrirUsuarios = function abrirUsuarios() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirUsuarios$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Usuarios";
          _context5.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var abrirPagos = function abrirPagos() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirPagos$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Pagos";
          _context6.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
};

var abrirPlanillas = function abrirPlanillas() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirPlanillas$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Planillas";
          _context7.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  });
};

var abrirContratos = function abrirContratos() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirContratos$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Contratos";
          _context8.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context8.stop();
      }
    }
  });
};

var abrirServicios = function abrirServicios() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirServicios$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Servicios fijos";
          _context9.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context9.stop();
      }
    }
  });
};

var abrirCuotas = function abrirCuotas() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirCuotas$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Servicios ocacionales";
          _context10.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context10.stop();
      }
    }
  });
};