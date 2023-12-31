"use strict";

var _require = require("electron"),
    BrowserWindow = _require.BrowserWindow,
    Notification = _require.Notification,
    dialog = _require.dialog,
    session = _require.session;

var _require2 = require("electron"),
    app = _require2.app,
    ipcMain = _require2.ipcMain;

var _require3 = require("./database"),
    getConnection = _require3.getConnection,
    cerrarConnection = _require3.cerrarConnection;

var SecureElectronStore = require("secure-electron-store")["default"]; // const Store = require("electron-store");


var path = require("path");

var url = require("url");

var _require4 = require("console"),
    error = _require4.error;

var window;
var servicioEnviar = [];
ipcMain.on("hello", function () {
  console.log("Hello from renderer process");
}); // ----------------------------------------------------------------

ipcMain.handle("getDocumentsPath", function _callee(event, documentsPath) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //const documentsPath = app.getPath('documentos');
          console.log("ruta:", documentsPath);
          _context.next = 3;
          return regeneratorRuntime.awrap(event.sender.send("documentsPath", documentsPath));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}); // ----------------------------------------------------------------

ipcMain.on("printPDF", function (event, filePath) {
  var printWindow = new BrowserWindow({
    show: true
  });
  printWindow.loadURL("file://".concat(filePath));
  printWindow.webContents.on("did-finish-load", function () {
    printWindow.webContents.print({
      silent: true
    }); //printWindow.close();
    // Enviar confirmación al proceso de renderizado

    event.sender.send("printPDFComplete", "El PDF se ha impreso correctamente.");
  });
}); // ----------------------------------------------------------------
// Funciones para el cierre de sesion
// ----------------------------------------------------------------

ipcMain.on("cerrarSesion", function _callee2(event) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // await cerrarConnection();
          event.sender.send("sesionCerrada");

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funcion para el cierre de la aplicacion
// ----------------------------------------------------------------

ipcMain.on("salir", function _callee3(event) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          app.quit();

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
});

function createWindow() {
  app.commandLine.appendSwitch("allow-file-access-from-files");
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  window.loadFile("src/ui/login.html");
}

app.on("ready", function () {
  //Funciones de inicio de sesion
  ipcMain.on("validarUsuarios", function _callee6(event, _ref) {
    var usuario, clave, conn, user;
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            usuario = _ref.usuario, clave = _ref.clave;
            _context6.prev = 1;
            _context6.next = 4;
            return regeneratorRuntime.awrap(getConnection());

          case 4:
            conn = _context6.sent;
            _context6.next = 7;
            return regeneratorRuntime.awrap(conn.query("SELECT usuario,rol FROM viewUsuarios WHERE usuario = ?", usuario, function _callee5(error, results) {
              var _user, notification;

              return regeneratorRuntime.async(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      if (!error) {
                        _context5.next = 5;
                        break;
                      }

                      event.reply("loginResponse", {
                        success: false,
                        message: "Error en la consulta a la base de datos"
                      });
                      return _context5.abrupt("return");

                    case 5:
                      if (!(results.length > 0)) {
                        _context5.next = 12;
                        break;
                      }

                      console.log("usuario en peticion ");
                      _context5.next = 9;
                      return regeneratorRuntime.awrap(conn.query("SELECT * from viewUsuarios where usuario=? and clave=?", [usuario, clave], function _callee4(error, results) {
                        var notification, _notification, _notification2;

                        return regeneratorRuntime.async(function _callee4$(_context4) {
                          while (1) {
                            switch (_context4.prev = _context4.next) {
                              case 0:
                                if (!error) {
                                  _context4.next = 7;
                                  break;
                                }

                                event.sender.send("loginResponse", {
                                  success: false,
                                  message: "Error en la consulta a la base de datos"
                                });
                                notification = new Notification({
                                  title: "No se ha podido iniciar session!",
                                  body: "Ocurrio un error al consultar en la base de datos, si el problema persiste solicite soporte tecnico",
                                  icon: "/path/to/icon.png"
                                });
                                notification.show();
                                return _context4.abrupt("return");

                              case 7:
                                if (!(results.length > 0)) {
                                  _context4.next = 14;
                                  break;
                                }

                                console.log("Credenciales corerctas! ");
                                event.sender.send("loginResponse", {
                                  success: true,
                                  message: "Credenciales correctas",
                                  data: results[0].rol
                                });
                                _notification = new Notification({
                                  title: "Credenciales correctas!",
                                  body: "Bienvenido usuario: " + usuario,
                                  icon: "/path/to/icon.png"
                                });

                                _notification.show();

                                _context4.next = 19;
                                break;

                              case 14:
                                status: false;

                                event.sender.send("loginResponse", {
                                  success: false,
                                  message: "Credenciales incorrectas"
                                });
                                _notification2 = new Notification({
                                  title: "Error de credenciales!",
                                  body: "La contraseña es incorrecta",
                                  icon: "/path/to/icon.png"
                                });

                                _notification2.show();

                                return _context4.abrupt("return");

                              case 19:
                              case "end":
                                return _context4.stop();
                            }
                          }
                        });
                      }));

                    case 9:
                      _user = _context5.sent;
                      _context5.next = 16;
                      break;

                    case 12:
                      event.sender.send("loginResponse", {
                        success: false,
                        message: "No existe este usuario"
                      });
                      notification = new Notification({
                        title: "Error de credenciales!",
                        body: "No hay un usuario registrado para " + usuario,
                        icon: "/path/to/icon.png"
                      });
                      notification.show();
                      return _context5.abrupt("return");

                    case 16:
                    case "end":
                      return _context5.stop();
                  }
                }
              });
            }));

          case 7:
            user = _context6.sent;
            return _context6.abrupt("return", user);

          case 11:
            _context6.prev = 11;
            _context6.t0 = _context6["catch"](1);
            console.log("Error al iniciar session: ", _context6.t0);

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[1, 11]]);
  });
}); // ----------------------------------------------------------------
// Funciones de comunicacion entre paginas
// ----------------------------------------------------------------

ipcMain.on("datos-a-servicios", function _callee7(event, servicio) {
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log("Datos a enviar: " + servicio.id);
          servicioEnviar = servicio; // pagina2Window = new BrowserWindow({ show: false });

          _context7.next = 4;
          return regeneratorRuntime.awrap(window.loadFile("src/ui/servicios.html"));

        case 4:
          _context7.next = 6;
          return regeneratorRuntime.awrap(window.show());

        case 6:
          _context7.next = 8;
          return regeneratorRuntime.awrap(window.webContents.send("datos-a-servicios"));

        case 8:
        case "end":
          return _context7.stop();
      }
    }
  });
});
ipcMain.on("datos-a-ocacionales", function _callee8(event, servicio) {
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log("Datos a enviar: " + servicio.id);
          servicioEnviar = servicio; // pagina2Window = new BrowserWindow({ show: false });

          _context8.next = 4;
          return regeneratorRuntime.awrap(window.loadFile("src/ui/cuotas.html"));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(window.show());

        case 6:
          _context8.next = 8;
          return regeneratorRuntime.awrap(window.webContents.send("datos-a-ocacionales"));

        case 8:
        case "end":
          return _context8.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Manejo de rutas
// ----------------------------------------------------------------

ipcMain.on("abrirInterface", function (event, interfaceName, acceso) {
  console.log("Name: " + interfaceName);
  var url = "";

  if (interfaceName == "Inicio") {
    url = "src/ui/principal.html";
  }

  if (interfaceName == "Login") {
    url = "src/ui/login.html";
  }

  if (interfaceName == "Servicios fijos") {
    console.log(acceso);

    switch (acceso) {
      case "Auditor":
        console.log("Auditor");
        url = "src/ui/servicios.html";
        break;

      case "Cajero":
        break;

      case "Digitador":
        break;

      default:
    }
  } else if (interfaceName == "Servicios ocacionales") {
    switch (acceso) {
      case "Auditor":
        console.log("Auditor");
        url = "src/ui/cuotas.html";
        break;

      case "Cajero":
        break;

      case "Digitador":
        break;

      default:
    }
  } else if (interfaceName == "Usuarios") {
    switch (acceso) {
      case "Auditor":
        console.log("Auditor");
        url = "src/ui/usuarios.html";
        break;

      case "Cajero":
        break;

      case "Digitador":
        break;

      default:
    }
  } else if (interfaceName == "Socios") {
    switch (acceso) {
      case "Auditor":
        console.log("Auditor");
        url = "src/ui/socios.html";
        break;

      case "Cajero":
        url = "src/ui/socios.html";
        break;

      case "Digitador":
        url = "src/ui/socios.html";
        break;

      default:
    }
  } else if (interfaceName == "Contratos") {
    switch (acceso) {
      case "Auditor":
        console.log("Auditor");
        url = "src/ui/contratos.html";
        break;

      case "Cajero":
        break;

      case "Digitador":
        url = "src/ui/contratos.html";
        break;

      default:
    }
  } else if (interfaceName == "Planillas") {
    switch (acceso) {
      case "Auditor":
        console.log("Auditor");
        url = "src/ui/planillas.html";
        break;

      case "Cajero":
        break;

      case "Digitador":
        url = "src/ui/planillas.html";
        break;

      default:
    }
  } else if (interfaceName == "Pagos") {
    switch (acceso) {
      case "Auditor":
        console.log("Auditor");
        url = "src/ui/cobros.html";
        break;

      case "Cajero":
        url = "src/ui/cobros.html";
        break;

      case "Digitador":
        url = "src/ui/cobros.html";
        break;

      default:
    }
  }

  try {
    console.log("interface name desde main", interfaceName);
    console.log("url", url);

    if (url !== "") {
      window.loadFile(url);
    }
  } catch (err) {
    console.log("Error de window" + err);
  }
}); // ----------------------------------------------------------------
// Funciones de las facturas
// ----------------------------------------------------------------
// Define una función para enviar datos a pagina2

ipcMain.on("datos-a-pagina2", function _callee9(event, datos, encabezado, serviciosFijos, otrosServicios, datosAgua, datosTotales, editados) {
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          console.log("Datos a enviar: " + datos.mensaje); // pagina2Window = new BrowserWindow({ show: false });

          _context9.next = 3;
          return regeneratorRuntime.awrap(window.loadFile("src/ui/factura.html"));

        case 3:
          _context9.next = 5;
          return regeneratorRuntime.awrap(window.show());

        case 5:
          _context9.next = 7;
          return regeneratorRuntime.awrap(window.webContents.send("datos-a-pagina2", datos, encabezado, serviciosFijos, otrosServicios, datosAgua, datosTotales, editados));

        case 7:
        case "end":
          return _context9.stop();
      }
    }
  });
});
ipcMain.on("datos-a-pagina3", function _callee10(event, datos, encabezado, recaudaciones, datosTotales) {
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          console.log("Datos a enviar: " + datos.mensaje); // pagina2Window = new BrowserWindow({ show: false });

          _context10.next = 3;
          return regeneratorRuntime.awrap(window.loadFile("src/ui/consolidado.html"));

        case 3:
          _context10.next = 5;
          return regeneratorRuntime.awrap(window.show());

        case 5:
          _context10.next = 7;
          return regeneratorRuntime.awrap(window.webContents.send("datos-a-pagina3", datos, encabezado, recaudaciones, datosTotales));

        case 7:
        case "end":
          return _context10.stop();
      }
    }
  });
});
ipcMain.on("contrato-desde-socios", function _callee11(event, socioId, socioCedula) {
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          console.log("Datos a enviar: " + socioId, socioCedula); // pagina2Window = new BrowserWindow({ show: false });

          _context11.next = 3;
          return regeneratorRuntime.awrap(window.loadFile("src/ui/contratos.html"));

        case 3:
          _context11.next = 5;
          return regeneratorRuntime.awrap(window.show());

        case 5:
          _context11.next = 7;
          return regeneratorRuntime.awrap(window.webContents.send("contrato-desde-socios", socioId, socioCedula));

        case 7:
        case "end":
          return _context11.stop();
      }
    }
  });
}); // ****************************************************************
// ----------------------------------------------------------------
// Funciones de los cargos
// ----------------------------------------------------------------

ipcMain.handle("pido-datos", function _callee12() {
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          return _context12.abrupt("return", servicioEnviar);

        case 1:
        case "end":
          return _context12.stop();
      }
    }
  });
});
ipcMain.handle("getCargos", function _callee13() {
  var conn, results;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context13.sent;
          results = conn.query("SELECT * FROM cargosempleados");
          console.log(results);
          return _context13.abrupt("return", results);

        case 6:
        case "end":
          return _context13.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funciones de los accesos
// ----------------------------------------------------------------

ipcMain.handle("getAccesos", function _callee14() {
  var conn, results;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context14.sent;
          results = conn.query("SELECT * FROM roles");
          console.log(results);
          return _context14.abrupt("return", results);

        case 6:
        case "end":
          return _context14.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funciones de los usuarios
// ----------------------------------------------------------------

ipcMain.handle("getUsuarios", function _callee15(event, criterio, criterioContent) {
  var conn, _results, _results2;

  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context15.sent;
          _context15.prev = 3;

          if (!(criterio === "all")) {
            _context15.next = 10;
            break;
          }

          _results = conn.query("SELECT * FROM viewUsuarios");
          console.log(_results);
          return _context15.abrupt("return", _results);

        case 10:
          _results2 = conn.query("SELECT * FROM viewUsuarios WHERE " + criterio + " like '%" + criterioContent + "%';");
          console.log(_results2);
          return _context15.abrupt("return", _results2);

        case 13:
          _context15.next = 18;
          break;

        case 15:
          _context15.prev = 15;
          _context15.t0 = _context15["catch"](3);
          console.log(_context15.t0);

        case 18:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[3, 15]]);
}); // ----------------------------------------------------------------
// Obtenemos los datos de los empleados que no son usuarios del sistema
// ----------------------------------------------------------------

ipcMain.handle("getEmpleados", function _callee16(event, criterio, criterioContent) {
  var conn, _results3, _results4;

  return regeneratorRuntime.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context16.sent;
          _context16.prev = 3;

          if (!(criterio === "all")) {
            _context16.next = 10;
            break;
          }

          _results3 = conn.query("SELECT * FROM viewEmpleados;");
          console.log(_results3);
          return _context16.abrupt("return", _results3);

        case 10:
          _results4 = conn.query("SELECT * FROM viewEmpleados WHERE " + criterio + " like '%" + criterioContent + "%';");
          console.log(_results4);
          return _context16.abrupt("return", _results4);

        case 13:
          _context16.next = 18;
          break;

        case 15:
          _context16.prev = 15;
          _context16.t0 = _context16["catch"](3);
          console.log(_context16.t0);

        case 18:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[3, 15]]);
});
ipcMain.handle("createUsuario", function _callee17(event, empleado, usuario) {
  var conn, resultEmpleado, resultUsuario;
  return regeneratorRuntime.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _context17.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context17.sent;
          console.log("Recibido: ", usuario); //   product.price = parseFloat(product.price);
          // const resultCargo = await conn.query(
          //   "Insert into cargosempleados set ? ;",
          //   cargo
          // );
          //empleado.cargosId = resultCargo.insertId;

          _context17.next = 7;
          return regeneratorRuntime.awrap(conn.query("Insert into empleados set ? ;", empleado));

        case 7:
          resultEmpleado = _context17.sent;
          usuario.empleadosId = resultEmpleado.insertId;
          _context17.next = 11;
          return regeneratorRuntime.awrap(conn.query("Insert into usuarios set ?", usuario));

        case 11:
          resultUsuario = _context17.sent;
          console.log(resultUsuario);
          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Se ha guardado el nuevo registro."
          });
          usuario.id = resultUsuario.insertId;
          return _context17.abrupt("return", usuario);

        case 18:
          _context17.prev = 18;
          _context17.t0 = _context17["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al guardar el registro."
          });
          console.log(_context17.t0);

        case 22:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
ipcMain.handle("createEmpleado", function _callee18(event, empleado) {
  var conn, resultEmpleado;
  return regeneratorRuntime.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          _context18.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context18.sent;
          console.log("Recibido: ", empleado); // const resultCargo = await conn.query(
          //   "Insert into cargosempleados set ? ;",
          //   cargo
          // );
          // console.log("Se inserto el cargo" + resultCargo.insertId);
          //empleado.cargosId = resultCargo.insertId;

          _context18.next = 7;
          return regeneratorRuntime.awrap(conn.query("Insert into empleados set ? ;", empleado));

        case 7:
          resultEmpleado = _context18.sent;
          console.log(resultEmpleado);
          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Se ha guardado el nuevo registro."
          });
          empleado.id = resultEmpleado.insertId;
          return _context18.abrupt("return", empleado);

        case 14:
          _context18.prev = 14;
          _context18.t0 = _context18["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al guardar el registro."
          });
          console.error("Ha ocurrido un error: ", _context18.t0);

        case 18:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 14]]);
}); // ----------------------------------------------------------------
// Obtenemos los datos del empleado usuario del sistema
// ----------------------------------------------------------------

ipcMain.handle("getUsuarioById", function _callee19(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee19$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context19.sent;
          result = conn.query("select empleados.id,empleados.cedula," + "empleados.primerNombre,empleados.segundoNombre,empleados.primerApellido," + "empleados.segundoApellido,empleados.telefono,empleados.correo," + "cargosempleados.id as cargosId,cargosempleados.cargo," + "cargosempleados.cargoDescripcion," + " usuarios.id as usuariosId,roles.id as rolesId,roles.rol,roles.rolDescripcion," + " usuarios.usuario,usuarios.clave,usuarios.fechaModificacion " + "from empleados join usuarios on empleados.id=usuarios.empleadosId join " + "cargosempleados on cargosempleados.id=empleados.cargosId " + "join roles on roles.id=usuarios.rolesId where empleados.id=?;", id);
          console.log(result);
          return _context19.abrupt("return", result);

        case 6:
        case "end":
          return _context19.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Obtenemos los datos del empleado no usuario del sistema
// ----------------------------------------------------------------

ipcMain.handle("getEmpleadoById", function _callee20(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee20$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context20.sent;
          result = conn.query("select empleados.id,empleados.cedula," + "empleados.primerNombre,empleados.segundoNombre,empleados.primerApellido," + "empleados.segundoApellido,empleados.telefono,empleados.correo," + "cargosempleados.id as cargosId,cargosempleados.cargo," + "cargosempleados.cargoDescripcion " + "from empleados join " + "cargosempleados on cargosempleados.id=empleados.cargosId where empleados.id=? ;", id);
          console.log(result);
          return _context20.abrupt("return", result);

        case 6:
        case "end":
          return _context20.stop();
      }
    }
  });
});
ipcMain.handle("updateUsuario", function _callee21(event, id, empleado, usuario) {
  var conn, resultEmpleado, usuarioExist, resultUsuario, _resultUsuario;

  return regeneratorRuntime.async(function _callee21$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context21.sent;
          _context21.prev = 3;
          _context21.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE empleados set ? where id = ?", [empleado, id]));

        case 6:
          resultEmpleado = _context21.sent;
          console.log(resultEmpleado);

          if (!(usuario.usuario !== null && usuario.usuario !== " " && usuario.clave !== null && usuario.clave !== " " && usuario.rol !== null && usuario.rol !== " " && usuario.rolDescripcion !== null && usuario.rolDescripcion !== " ")) {
            _context21.next = 25;
            break;
          }

          _context21.next = 11;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM usuarios WHERE usuarios.empleadosId=? order by usuarios.id desc limit 1;", id));

        case 11:
          usuarioExist = _context21.sent;

          if (!(usuarioExist.length > 0 && usuarioExist[0].id !== null)) {
            _context21.next = 20;
            break;
          }

          console.log("existe el usuario: " + usuarioExist[0].id);
          _context21.next = 16;
          return regeneratorRuntime.awrap(conn.query("UPDATE usuarios set ? where empleadosId = ?;", [usuario, id]));

        case 16:
          resultUsuario = _context21.sent;
          console.log("Se actualizó el usuario", resultUsuario);
          _context21.next = 25;
          break;

        case 20:
          usuario.empleadosId = id;
          _context21.next = 23;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO usuarios SET ?", usuario));

        case 23:
          _resultUsuario = _context21.sent;
          console.log("Se creó el usuario", _resultUsuario);

        case 25:
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se ha actualizado el registro."
          });
          _context21.next = 31;
          break;

        case 28:
          _context21.prev = 28;
          _context21.t0 = _context21["catch"](3);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al actualizar el registro."
          });

        case 31:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[3, 28]]);
}); // ----------------------------------------------------------------
// ----------------------------------------------------------------

ipcMain.handle("updateEmpleado", function _callee22(event, id, empleado) {
  var conn, resultEmpleado, usuarioExist;
  return regeneratorRuntime.async(function _callee22$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          _context22.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context22.sent;
          resultEmpleado = null;
          _context22.prev = 4;
          _context22.next = 7;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM usuarios WHERE usuarios.empleadosId=? order by usuarios.id desc limit 1;", id));

        case 7:
          usuarioExist = _context22.sent;

          if (!(usuarioExist.length > 0 && usuarioExist[0].id !== null)) {
            _context22.next = 17;
            break;
          }

          console.log("existe el usuario: " + usuarioExist[0].id);
          empleado.usuariosn = "Si";
          _context22.next = 13;
          return regeneratorRuntime.awrap(conn.query("UPDATE empleados set ? where id = ?", [empleado, id]));

        case 13:
          resultEmpleado = _context22.sent;
          console.log(resultEmpleado);
          _context22.next = 22;
          break;

        case 17:
          empleado.usuariosn = "No";
          _context22.next = 20;
          return regeneratorRuntime.awrap(conn.query("UPDATE empleados set ? where id = ?", [empleado, id]));

        case 20:
          resultEmpleado = _context22.sent;
          console.log(resultEmpleado);

        case 22:
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se ha actualizado el registro."
          });
          return _context22.abrupt("return", resultEmpleado);

        case 26:
          _context22.prev = 26;
          _context22.t0 = _context22["catch"](4);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al actualizar el registro."
          });
          console.log(_context22.t0);

        case 30:
        case "end":
          return _context22.stop();
      }
    }
  }, null, null, [[4, 26]]);
}); // ----------------------------------------------------------------
// Eliminar un usuario del sistema
// ----------------------------------------------------------------

ipcMain.handle("deleteUsuario", function _callee23(event, id) {
  var conn, resultUsuario, resultEmpleado;
  return regeneratorRuntime.async(function _callee23$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context23.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context23.sent;
          _context23.prev = 4;
          _context23.next = 7;
          return regeneratorRuntime.awrap(conn.query("DELETE FROM usuarios WHERE  empleadosId=?", id));

        case 7:
          resultUsuario = _context23.sent;
          _context23.next = 10;
          return regeneratorRuntime.awrap(conn.query("UPDATE empleados SET usuariosn='No' WHERE id =?;", id));

        case 10:
          resultEmpleado = _context23.sent;
          console.log(resultEmpleado);
          event.sender.send("Notificar", {
            success: true,
            title: "Usuario eliminado!",
            message: "Se ha actualizado el registro."
          });
          return _context23.abrupt("return", resultEmpleado);

        case 16:
          _context23.prev = 16;
          _context23.t0 = _context23["catch"](4);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al actualizar el registro."
          });
          console.log(_context23.t0);

        case 20:
        case "end":
          return _context23.stop();
      }
    }
  }, null, null, [[4, 16]]);
}); // ----------------------------------------------------------------
// Eliminar un empleado
// ----------------------------------------------------------------

ipcMain.handle("deleteEmpleado", function _callee24(event, id) {
  var conn, resultEmpleado;
  return regeneratorRuntime.async(function _callee24$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context24.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context24.sent;
          _context24.prev = 4;
          _context24.next = 7;
          return regeneratorRuntime.awrap(conn.query("DELETE FROM empleados WHERE id =?;", id));

        case 7:
          resultEmpleado = _context24.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Borrado!",
            message: "Se ha eliminado el usuario."
          });
          console.log(resultEmpleado);
          return _context24.abrupt("return", resultEmpleado);

        case 13:
          _context24.prev = 13;
          _context24.t0 = _context24["catch"](4);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al elimiar el registro."
          });

        case 16:
        case "end":
          return _context24.stop();
      }
    }
  }, null, null, [[4, 13]]);
}); // Funciones de los socios

ipcMain.handle("getSocios", function _callee25(event, criterio, criterioContent) {
  var conn, _results5, _results6;

  return regeneratorRuntime.async(function _callee25$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          _context25.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context25.sent;
          _context25.prev = 3;

          if (!(criterio === "all" || criterio === undefined)) {
            _context25.next = 10;
            break;
          }

          _results5 = conn.query("SELECT * FROM viewSocios order by primerApellido;");
          console.log(_results5);
          return _context25.abrupt("return", _results5);

        case 10:
          _results6 = conn.query("SELECT * FROM viewSocios where " + criterio + " like '%" + criterioContent + "%';");
          console.log(_results6);
          return _context25.abrupt("return", _results6);

        case 13:
          _context25.next = 18;
          break;

        case 15:
          _context25.prev = 15;
          _context25.t0 = _context25["catch"](3);
          console.log(_context25.t0);

        case 18:
        case "end":
          return _context25.stop();
      }
    }
  }, null, null, [[3, 15]]);
});
ipcMain.handle("createSocio", function _callee26(event, socio) {
  var conn, _result;

  return regeneratorRuntime.async(function _callee26$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          _context26.prev = 0;
          _context26.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context26.sent;
          console.log("Recibido: ", socio);
          _context26.next = 7;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO socios SET ?", socio));

        case 7:
          _result = _context26.sent;
          console.log(_result); // new Notification({
          //   title: "Regístro guardado",
          //   body: "Se registró al nuevo socio con exito!",
          // }).show();serviserviciosId

          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Se ha guardado el registro."
          });
          socio.id = _result.insertId;
          return _context26.abrupt("return", socio);

        case 14:
          _context26.prev = 14;
          _context26.t0 = _context26["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al guardar el registro."
          });
          console.log(_context26.t0);

        case 18:
        case "end":
          return _context26.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
ipcMain.handle("getSocioById", function _callee27(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee27$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          _context27.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context27.sent;
          _context27.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM socios WHERE id = ?", id));

        case 5:
          result = _context27.sent;
          console.log(result[0]);
          return _context27.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context27.stop();
      }
    }
  });
});
ipcMain.handle("getContratanteByCedula", function _callee28(event, cedula) {
  var conn, result;
  return regeneratorRuntime.async(function _callee28$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          _context28.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context28.sent;
          _context28.next = 5;
          return regeneratorRuntime.awrap(conn.query("Select * from socios where socios.cedulaPasaporte = ?", cedula));

        case 5:
          result = _context28.sent;
          console.log(result[0]);
          return _context28.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context28.stop();
      }
    }
  });
});
ipcMain.handle("updateSocio", function _callee29(event, id, socio) {
  var conn, _result2;

  return regeneratorRuntime.async(function _callee29$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          _context29.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context29.sent;
          _context29.prev = 3;
          _context29.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE socios SET ? WHERE id = ?", [socio, id]));

        case 6:
          _result2 = _context29.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se ha actualizado el registro."
          });
          console.log(_result2);
          return _context29.abrupt("return", _result2);

        case 12:
          _context29.prev = 12;
          _context29.t0 = _context29["catch"](3);
          console.log(_context29.t0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al actualizar el registro."
          });

        case 16:
        case "end":
          return _context29.stop();
      }
    }
  }, null, null, [[3, 12]]);
});
ipcMain.handle("deleteSocio", function _callee30(event, id) {
  var conn, _result3;

  return regeneratorRuntime.async(function _callee30$(_context30) {
    while (1) {
      switch (_context30.prev = _context30.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context30.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context30.sent;
          _context30.prev = 4;
          _context30.next = 7;
          return regeneratorRuntime.awrap(conn.query("DELETE FROM socios WHERE id = ?", id));

        case 7:
          _result3 = _context30.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Borrado!",
            message: "Se ha eliminado el usuario."
          });
          console.log(_result3);
          return _context30.abrupt("return", _result3);

        case 13:
          _context30.prev = 13;
          _context30.t0 = _context30["catch"](4);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al elimiar el registro."
          });
          console.log(_context30.t0);

        case 17:
        case "end":
          return _context30.stop();
      }
    }
  }, null, null, [[4, 13]]);
}); // ----------------------------------------------------------------
// Funciones de los implementos
// Esta tabla esta relacionada de uno a muchos con inventario
// ----------------------------------------------------------------

ipcMain.handle("getImplementos", function _callee31() {
  var conn, results;
  return regeneratorRuntime.async(function _callee31$(_context31) {
    while (1) {
      switch (_context31.prev = _context31.next) {
        case 0:
          _context31.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context31.sent;
          results = conn.query("SELECT * FROM viewimplementosinvenatrio order by implementosId desc;");
          console.log(results);
          return _context31.abrupt("return", results);

        case 6:
        case "end":
          return _context31.stop();
      }
    }
  });
});
ipcMain.handle("createImplemento", function _callee32(event, implemento, inventario) {
  var conn, resultImplemento, resulInventario;
  return regeneratorRuntime.async(function _callee32$(_context32) {
    while (1) {
      switch (_context32.prev = _context32.next) {
        case 0:
          _context32.prev = 0;
          _context32.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context32.sent;
          console.log("Recibido: ", implemento, inventario); //   product.price = parseFloat(product.price);

          _context32.next = 7;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO implementos set ?;", implemento));

        case 7:
          resultImplemento = _context32.sent;
          inventario.implementosId = resultImplemento.insertId;
          _context32.next = 11;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO inventario set ?;", inventario));

        case 11:
          resulInventario = _context32.sent;
          console.log(resultImplemento, resulInventario);
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: implemento.nombre + " se há registrado :)"
          }).show();
          implemento.id = result.insertId;
          return _context32.abrupt("return", resulInventario);

        case 18:
          _context32.prev = 18;
          _context32.t0 = _context32["catch"](0);
          console.log(_context32.t0);

        case 21:
        case "end":
          return _context32.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
ipcMain.handle("getImplementoById", function _callee33(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee33$(_context33) {
    while (1) {
      switch (_context33.prev = _context33.next) {
        case 0:
          _context33.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context33.sent;
          _context33.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewimplementosinvenatrio where implementosId = ?", id));

        case 5:
          result = _context33.sent;
          console.log("Resultado", result[0]);
          return _context33.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context33.stop();
      }
    }
  });
});
ipcMain.handle("updateImplemento", function _callee34(event, id, implemento, inventario) {
  var conn, resultImplemento, resultInventario;
  return regeneratorRuntime.async(function _callee34$(_context34) {
    while (1) {
      switch (_context34.prev = _context34.next) {
        case 0:
          _context34.prev = 0;
          _context34.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context34.sent;
          _context34.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE implementos SET ? where id = ?", [implemento, id]));

        case 6:
          resultImplemento = _context34.sent;
          _context34.next = 9;
          return regeneratorRuntime.awrap(conn.query("UPDATE inventario SET ? where implementosId = ?", [inventario, id]));

        case 9:
          resultInventario = _context34.sent;
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: implemento.nombre + " se ha actualizado :)"
          }).show();
          console.log(resultInventario, resultImplemento);
          return _context34.abrupt("return", resultImplemento);

        case 15:
          _context34.prev = 15;
          _context34.t0 = _context34["catch"](0);
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "Ha ocurrido un error en la actualización :("
          }).show();
          console.log(_context34.t0);

        case 19:
        case "end":
          return _context34.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
ipcMain.handle("deleteImplemento", function _callee35(event, id) {
  var conn, resultInventario, resultImplemento;
  return regeneratorRuntime.async(function _callee35$(_context35) {
    while (1) {
      switch (_context35.prev = _context35.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context35.prev = 1;
          _context35.next = 4;
          return regeneratorRuntime.awrap(getConnection());

        case 4:
          conn = _context35.sent;
          _context35.next = 7;
          return regeneratorRuntime.awrap(conn.query("DELETE FROM inventario WHERE implementosId = ?", id));

        case 7:
          resultInventario = _context35.sent;
          _context35.next = 10;
          return regeneratorRuntime.awrap(conn.query("DELETE from implementos where id = ?", id));

        case 10:
          resultImplemento = _context35.sent;
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "Se há eliminado el registro :)"
          }).show();
          console.log(resultInventario, resultImplemento);
          return _context35.abrupt("return", resultInventario);

        case 16:
          _context35.prev = 16;
          _context35.t0 = _context35["catch"](1);
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "Ha ocurrido un error al eliminar el registro :("
          }).show();
          console.log(_context35.t0);

        case 20:
        case "end":
          return _context35.stop();
      }
    }
  }, null, null, [[1, 16]]);
}); // ----------------------------------------------------------------
// Funciones de los servicios fijos
// ----------------------------------------------------------------

ipcMain.handle("getServiciosFijos", function _callee36(event, criterio, criterioContent) {
  var conn, _results7, _results8;

  return regeneratorRuntime.async(function _callee36$(_context36) {
    while (1) {
      switch (_context36.prev = _context36.next) {
        case 0:
          _context36.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context36.sent;
          _context36.prev = 3;

          if (!(criterio === "all")) {
            _context36.next = 10;
            break;
          }

          _results7 = conn.query("SELECT * FROM viewServicios where tipo='Servicio fijo'order by id asc;");
          console.log(_results7);
          return _context36.abrupt("return", _results7);

        case 10:
          _results8 = conn.query("SELECT * FROM viewServicios where " + criterio + " like '%" + criterioContent + "%'" + " and tipo='Servicio fijo'order by id asc;");
          console.log(_results8);
          return _context36.abrupt("return", _results8);

        case 13:
          _context36.next = 18;
          break;

        case 15:
          _context36.prev = 15;
          _context36.t0 = _context36["catch"](3);
          console.log(_context36.t0);

        case 18:
        case "end":
          return _context36.stop();
      }
    }
  }, null, null, [[3, 15]]);
});
ipcMain.handle("createServiciosFijos", function _callee37(event, servicio) {
  var conn, resultServicio;
  return regeneratorRuntime.async(function _callee37$(_context37) {
    while (1) {
      switch (_context37.prev = _context37.next) {
        case 0:
          _context37.prev = 0;
          _context37.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context37.sent;
          console.log("Recibido: ", servicio);
          _context37.next = 7;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO servicios set ?;", servicio));

        case 7:
          resultServicio = _context37.sent;
          servicio.id = resultServicio.insertId;
          console.log(resultServicio);
          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Se ha guardado un nuevo servicio fijo."
          });
          return _context37.abrupt("return", resultServicio);

        case 14:
          _context37.prev = 14;
          _context37.t0 = _context37["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al guardar el servicio."
          });
          console.log(_context37.t0);

        case 18:
        case "end":
          return _context37.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
ipcMain.handle("getServiciosFijosById", function _callee38(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee38$(_context38) {
    while (1) {
      switch (_context38.prev = _context38.next) {
        case 0:
          _context38.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context38.sent;
          _context38.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewServicios where id = ?", id));

        case 5:
          result = _context38.sent;
          console.log("Resultado", result[0]);
          return _context38.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context38.stop();
      }
    }
  });
}); // ipcMain.handle("getServiciosContratados", async (event) => {
//   const conn = await getConnection();
//   const result = await conn.query("SELECT * FROM viewServiciosFijos");
//   console.log("Resultado", result);
//   return result;
// });

ipcMain.handle("getServiciosDisponibles", function _callee39(event) {
  var conn, result;
  return regeneratorRuntime.async(function _callee39$(_context39) {
    while (1) {
      switch (_context39.prev = _context39.next) {
        case 0:
          _context39.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context39.sent;
          _context39.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewServicios where tipo='Servicio fijo';"));

        case 5:
          result = _context39.sent;
          console.log("Resultado", result);
          return _context39.abrupt("return", result);

        case 8:
        case "end":
          return _context39.stop();
      }
    }
  });
});
ipcMain.handle("updateServiciosFijos", function _callee40(event, id, servicio) {
  var conn, resultServicio;
  return regeneratorRuntime.async(function _callee40$(_context40) {
    while (1) {
      switch (_context40.prev = _context40.next) {
        case 0:
          _context40.prev = 0;
          _context40.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context40.sent;
          _context40.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE servicios SET ? where id = ?", [servicio, id]));

        case 6:
          resultServicio = _context40.sent;
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: servicio.nombre + " se ha actualizado :)"
          }).show();
          console.log(resultServicio);
          return _context40.abrupt("return", resultServicio);

        case 12:
          _context40.prev = 12;
          _context40.t0 = _context40["catch"](0);
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "Ha ocurrido un error en la actualización :("
          }).show();
          console.log(_context40.t0);

        case 16:
        case "end":
          return _context40.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
ipcMain.handle("deleteServiciosFijos", function _callee41(event, id) {
  var conn, resultServicio;
  return regeneratorRuntime.async(function _callee41$(_context41) {
    while (1) {
      switch (_context41.prev = _context41.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context41.prev = 1;
          _context41.next = 4;
          return regeneratorRuntime.awrap(getConnection());

        case 4:
          conn = _context41.sent;
          _context41.next = 7;
          return regeneratorRuntime.awrap(conn.query("DELETE FROM servicios WHERE id = ?", id));

        case 7:
          resultServicio = _context41.sent;
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "Se há eliminado el registro :)"
          }).show();
          console.log(resultServicio);
          return _context41.abrupt("return", resultServicio);

        case 13:
          _context41.prev = 13;
          _context41.t0 = _context41["catch"](1);
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "Ha ocurrido un error al eliminar el registro :("
          }).show();
          console.log(_context41.t0);

        case 17:
        case "end":
          return _context41.stop();
      }
    }
  }, null, null, [[1, 13]]);
});
ipcMain.handle("getServiciosContratadosById", function _callee42(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee42$(_context42) {
    while (1) {
      switch (_context42.prev = _context42.next) {
        case 0:
          _context42.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context42.sent;
          _context42.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewServiciosContratados where id =" + id + " and tipo='Servicio fijo' and estado='Activo';"));

        case 5:
          result = _context42.sent;
          console.log("Resultado", result);
          return _context42.abrupt("return", result);

        case 8:
        case "end":
          return _context42.stop();
      }
    }
  });
});
ipcMain.handle("getContratos", function _callee43(event, criterio, criterioContent) {
  var conn, _result4, _result5;

  return regeneratorRuntime.async(function _callee43$(_context43) {
    while (1) {
      switch (_context43.prev = _context43.next) {
        case 0:
          _context43.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context43.sent;
          _context43.prev = 3;

          if (!(criterio === "all" || criterio === undefined)) {
            _context43.next = 12;
            break;
          }

          _context43.next = 7;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewContratos ;"));

        case 7:
          _result4 = _context43.sent;
          console.log("Resultado: ", _result4);
          return _context43.abrupt("return", _result4);

        case 12:
          _context43.next = 14;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewContratos  WHERE " + criterio + " like '%" + criterioContent + "%';"));

        case 14:
          _result5 = _context43.sent;
          console.log("Resultado: ", _result5);
          return _context43.abrupt("return", _result5);

        case 17:
          _context43.next = 22;
          break;

        case 19:
          _context43.prev = 19;
          _context43.t0 = _context43["catch"](3);
          console.log(_context43.t0);

        case 22:
        case "end":
          return _context43.stop();
      }
    }
  }, null, null, [[3, 19]]);
});
ipcMain.handle("getContratadosById", function _callee44(event, servicioId) {
  var conn, result;
  return regeneratorRuntime.async(function _callee44$(_context44) {
    while (1) {
      switch (_context44.prev = _context44.next) {
        case 0:
          _context44.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context44.sent;
          _context44.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT contratosId FROM serviciosContratados WHERE NOT estado='Innactivo' and " + "serviciosId=? ;", servicioId));

        case 5:
          result = _context44.sent;
          console.log("Resultado: ", result);
          return _context44.abrupt("return", result);

        case 8:
        case "end":
          return _context44.stop();
      }
    }
  });
});
ipcMain.handle("getRecaudaciones", function _callee45(event, servicioId, desde, hasta) {
  var conn, _result6, _result7;

  return regeneratorRuntime.async(function _callee45$(_context45) {
    while (1) {
      switch (_context45.prev = _context45.next) {
        case 0:
          _context45.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context45.sent;
          console.log("Buscando: " + desde + " " + hasta);
          _context45.prev = 4;

          if (!(desde === "all" || desde === undefined)) {
            _context45.next = 13;
            break;
          }

          _context45.next = 8;
          return regeneratorRuntime.awrap(conn.query("CALL selectRecaudaciones(" + servicioId + ",'2023-01-01',now()); "));

        case 8:
          _result6 = _context45.sent;
          console.log("Resultado: ", _result6[0]);
          return _context45.abrupt("return", _result6[0]);

        case 13:
          _context45.next = 15;
          return regeneratorRuntime.awrap(conn.query("CALL selectRecaudaciones(" + servicioId + ",'" + desde + "','" + hasta + "'); "));

        case 15:
          _result7 = _context45.sent;
          console.log("Resultado: ", _result7[0]);
          return _context45.abrupt("return", _result7[0]);

        case 18:
          _context45.next = 23;
          break;

        case 20:
          _context45.prev = 20;
          _context45.t0 = _context45["catch"](4);
          console.log(_context45.t0);

        case 23:
        case "end":
          return _context45.stop();
      }
    }
  }, null, null, [[4, 20]]);
}); // ----------------------------------------------------------------
// Funciones de las cuotas
// ----------------------------------------------------------------

ipcMain.handle("getCuotas", function _callee46() {
  var conn, results;
  return regeneratorRuntime.async(function _callee46$(_context46) {
    while (1) {
      switch (_context46.prev = _context46.next) {
        case 0:
          _context46.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context46.sent;
          results = conn.query("SELECT * FROM viewServicios where tipo='Cuota'order by id asc;");
          console.log(results);
          return _context46.abrupt("return", results);

        case 6:
        case "end":
          return _context46.stop();
      }
    }
  });
});
ipcMain.handle("getCuotasById", function _callee47(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee47$(_context47) {
    while (1) {
      switch (_context47.prev = _context47.next) {
        case 0:
          _context47.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context47.sent;
          _context47.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewServicios where id = ?", id));

        case 5:
          result = _context47.sent;
          console.log("Resultado", result[0]);
          return _context47.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context47.stop();
      }
    }
  });
});
ipcMain.handle("createCuotas", function _callee48(event, cuota) {
  var conn, resultServicio;
  return regeneratorRuntime.async(function _callee48$(_context48) {
    while (1) {
      switch (_context48.prev = _context48.next) {
        case 0:
          _context48.prev = 0;
          _context48.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context48.sent;
          console.log("Recibido: ", cuota);
          _context48.next = 7;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO servicios set ?;", cuota));

        case 7:
          resultServicio = _context48.sent;
          cuota.id = resultServicio.insertId;
          console.log(resultServicio);
          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Se ha guardado un nuevo servicio ocacional."
          });
          return _context48.abrupt("return", resultServicio);

        case 14:
          _context48.prev = 14;
          _context48.t0 = _context48["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al guardar el servicio ocacional."
          });
          console.log(_context48.t0);

        case 18:
        case "end":
          return _context48.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
ipcMain.handle("createServicioContratado", function _callee49(event, contratar, socioId, individualSn) {
  var conn, socioContratanteExiste, contratadoExiste, resultServicio, _contratadoExiste, _resultServicio;

  return regeneratorRuntime.async(function _callee49$(_context49) {
    while (1) {
      switch (_context49.prev = _context49.next) {
        case 0:
          _context49.prev = 0;
          _context49.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context49.sent;
          console.log("Recibido: ", contratar, " ", individualSn);

          if (!(individualSn == "No")) {
            _context49.next = 28;
            break;
          }

          console.log("No es individual "); // consultamos si ya existe un contrato con el id del socio que presente este valor

          _context49.next = 9;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewServiciosContratados WHERE serviciosId=" + contratar.serviciosId + " AND sociosId=" + socioId + " ;"));

        case 9:
          socioContratanteExiste = _context49.sent;

          if (!(!socioContratanteExiste.length > 0)) {
            _context49.next = 26;
            break;
          }

          console.log("No lo encontro");
          _context49.next = 14;
          return regeneratorRuntime.awrap(conn.query("SELECT count(id) as existe FROM serviciosContratados WHERE " + "serviciosId= " + contratar.serviciosId + " AND " + "contratosId= " + contratar.contratosId + ";"));

        case 14:
          contratadoExiste = _context49.sent;

          if (!(!contratadoExiste[0].existe > 0)) {
            _context49.next = 25;
            break;
          }

          _context49.next = 18;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO serviciosContratados set ?;", contratar));

        case 18:
          resultServicio = _context49.sent;
          console.log(resultServicio);
          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Contratado."
          });
          contratar.id = resultServicio.insertId;
          return _context49.abrupt("return", resultServicio);

        case 25:
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "El servicio ya ha sido registrado en este contrato."
          });

        case 26:
          _context49.next = 43;
          break;

        case 28:
          console.log("Es individual");
          _context49.next = 31;
          return regeneratorRuntime.awrap(conn.query("SELECT count(id) as existe FROM serviciosContratados WHERE " + "serviciosId= " + contratar.serviciosId + " AND " + "contratosId= " + contratar.contratosId + ";"));

        case 31:
          _contratadoExiste = _context49.sent;

          if (!(!_contratadoExiste[0].existe > 0)) {
            _context49.next = 42;
            break;
          }

          _context49.next = 35;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO serviciosContratados set ?;", contratar));

        case 35:
          _resultServicio = _context49.sent;
          console.log(_resultServicio);
          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Contratado."
          });
          contratar.id = _resultServicio.insertId;
          return _context49.abrupt("return", _resultServicio);

        case 42:
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "El servicio ya ha sido registrado en este contrato."
          });

        case 43:
          _context49.next = 49;
          break;

        case 45:
          _context49.prev = 45;
          _context49.t0 = _context49["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al contratar."
          });
          console.log(_context49.t0);

        case 49:
        case "end":
          return _context49.stop();
      }
    }
  }, null, null, [[0, 45]]);
});
ipcMain.handle("deleteContratadoDetalle", function _callee51(event, descontratar) {
  var canceladoSn, cancelados, conn, detallesServicio, canceladoExiste, resultContratado, _resultContratado;

  return regeneratorRuntime.async(function _callee51$(_context51) {
    while (1) {
      switch (_context51.prev = _context51.next) {
        case 0:
          canceladoSn = false;
          cancelados = 0;
          _context51.prev = 2;
          _context51.next = 5;
          return regeneratorRuntime.awrap(getConnection());

        case 5:
          conn = _context51.sent;
          console.log("Recibido: ", descontratar);
          _context51.next = 9;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM detallesServicio WHERE serviciosContratadosId =" + descontratar + ";"));

        case 9:
          detallesServicio = _context51.sent;

          if (!(detallesServicio.length > 0)) {
            _context51.next = 27;
            break;
          }

          console.log("Array con datos.");
          canceladoExiste = detallesServicio.find(function (cancelado) {
            return cancelado.estado === "Cancelado";
          });

          if (!canceladoExiste) {
            _context51.next = 18;
            break;
          }

          console.log("Se encontró un detalle cancelado:", canceladoExiste);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Este servicio ya ha sido cancelado por lo que no puedes eliminarlo."
          });
          _context51.next = 25;
          break;

        case 18:
          console.log("Ningún detalle cancelado fue encontrado.");
          detallesServicio.forEach(function _callee50(detalleServicio) {
            var resultDetalle;
            return regeneratorRuntime.async(function _callee50$(_context50) {
              while (1) {
                switch (_context50.prev = _context50.next) {
                  case 0:
                    _context50.next = 2;
                    return regeneratorRuntime.awrap(conn.query("DELETE FROM detallesServicio WHERE id=" + detalleServicio.id + ";"));

                  case 2:
                    resultDetalle = _context50.sent;
                    console.log(resultDetalle);

                  case 4:
                  case "end":
                    return _context50.stop();
                }
              }
            });
          });
          _context51.next = 22;
          return regeneratorRuntime.awrap(conn.query("DELETE FROM serviciosContratados WHERE id=" + descontratar + ";"));

        case 22:
          resultContratado = _context51.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Borrado!",
            message: "Se ha eliminado este servicio para este contrato."
          });
          return _context51.abrupt("return", resultContratado);

        case 25:
          _context51.next = 34;
          break;

        case 27:
          console.log("Array sin datos");
          _context51.next = 30;
          return regeneratorRuntime.awrap(conn.query("DELETE FROM serviciosContratados WHERE id= " + descontratar + ";"));

        case 30:
          _resultContratado = _context51.sent;
          console.log(_resultContratado);
          event.sender.send("Notificar", {
            success: true,
            title: "Borrado!",
            message: "Se ha eliminado este servicio para este contrato."
          });
          return _context51.abrupt("return", _resultContratado);

        case 34:
          _context51.next = 40;
          break;

        case 36:
          _context51.prev = 36;
          _context51.t0 = _context51["catch"](2);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al descontratar el servicio."
          });
          console.log(_context51.t0);

        case 40:
        case "end":
          return _context51.stop();
      }
    }
  }, null, null, [[2, 36]]);
});
ipcMain.handle("updateCuotas", function _callee52(event, id, cuota) {
  var conn, resultServicio;
  return regeneratorRuntime.async(function _callee52$(_context52) {
    while (1) {
      switch (_context52.prev = _context52.next) {
        case 0:
          _context52.prev = 0;
          _context52.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context52.sent;
          _context52.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE servicios SET ? where id = ?", [cuota, id]));

        case 6:
          resultServicio = _context52.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se ha actualizado el servicio ocacional."
          });
          console.log(resultServicio);
          return _context52.abrupt("return", resultServicio);

        case 12:
          _context52.prev = 12;
          _context52.t0 = _context52["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al actualizar el servicio ocacional."
          });
          console.log(_context52.t0);

        case 16:
        case "end":
          return _context52.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
ipcMain.handle("deleteCuotas", function _callee53(event, id) {
  var conn, _result8;

  return regeneratorRuntime.async(function _callee53$(_context53) {
    while (1) {
      switch (_context53.prev = _context53.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context53.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context53.sent;
          _context53.prev = 4;
          _context53.next = 7;
          return regeneratorRuntime.awrap(conn.query("DELETE FROM servicios WHERE id = ?", id));

        case 7:
          _result8 = _context53.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Borrado!",
            message: "Se ha eliminado el servicio ocacional."
          });
          console.log(_result8);
          return _context53.abrupt("return", _result8);

        case 13:
          _context53.prev = 13;
          _context53.t0 = _context53["catch"](4);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al elimiar el registro."
          });
          console.log(_context53.t0);

        case 17:
        case "end":
          return _context53.stop();
      }
    }
  }, null, null, [[4, 13]]);
});
ipcMain.handle("getContratadoByServicioContrato", function _callee54(event, servicioId, contratoId) {
  var conn, _result9;

  return regeneratorRuntime.async(function _callee54$(_context54) {
    while (1) {
      switch (_context54.prev = _context54.next) {
        case 0:
          _context54.prev = 0;
          _context54.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context54.sent;
          _context54.next = 6;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewServiciosContratados WHERE " + "serviciosId=" + servicioId + " AND id=" + contratoId + " ;"));

        case 6:
          _result9 = _context54.sent;
          console.log("Resultado de contratado: " + _result9[0]);
          return _context54.abrupt("return", _result9);

        case 11:
          _context54.prev = 11;
          _context54.t0 = _context54["catch"](0);
          console.log("Error :" + _context54.t0);

        case 14:
        case "end":
          return _context54.stop();
      }
    }
  }, null, null, [[0, 11]]);
}); // ----------------------------------------------------------------
//   funciones de los Descuentos
// ----------------------------------------------------------------

ipcMain.handle("getDescuentos", function _callee55() {
  var conn, results;
  return regeneratorRuntime.async(function _callee55$(_context55) {
    while (1) {
      switch (_context55.prev = _context55.next) {
        case 0:
          _context55.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context55.sent;
          results = conn.query("SELECT * FROM tiposDescuento;");
          console.log(results);
          return _context55.abrupt("return", results);

        case 6:
        case "end":
          return _context55.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
//   funciones de los Medidores
// ----------------------------------------------------------------

ipcMain.handle("getMedidores", function _callee56() {
  var conn, results;
  return regeneratorRuntime.async(function _callee56$(_context56) {
    while (1) {
      switch (_context56.prev = _context56.next) {
        case 0:
          _context56.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context56.sent;
          results = conn.query("Select * from medidores order by id desc;");
          console.log(results);
          return _context56.abrupt("return", results);

        case 6:
        case "end":
          return _context56.stop();
      }
    }
  });
});
ipcMain.handle("getMedidoresDisponibles", function _callee57() {
  var conn, results;
  return regeneratorRuntime.async(function _callee57$(_context57) {
    while (1) {
      switch (_context57.prev = _context57.next) {
        case 0:
          _context57.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context57.sent;
          results = conn.query("Select * from implementos where implementos.nombre='Medidor' and implementos.stock>0 order by id desc;");
          console.log(results);
          return _context57.abrupt("return", results);

        case 6:
        case "end":
          return _context57.stop();
      }
    }
  });
});
ipcMain.handle("getMedidorDisponibleById", function _callee58(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee58$(_context58) {
    while (1) {
      switch (_context58.prev = _context58.next) {
        case 0:
          _context58.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context58.sent;
          _context58.next = 5;
          return regeneratorRuntime.awrap(conn.query("Select * from implementos where id = ?", id));

        case 5:
          result = _context58.sent;
          console.log(result[0]);
          return _context58.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context58.stop();
      }
    }
  });
}); // No estamos usando esta función.
// ipcMain.handle("createMedidor", async (event, medidor) => {
//   try {
//     const conn = await getConnection();
//     console.log("Recibido: ", medidor);
//     //   product.price = parseFloat(product.price);
//     const result = await conn.query("Insert into medidores set ?", medidor);
//     console.log(result);
//     new Notification({
//       title: "Electrom Mysql",
//       body: "New medidor saved succesfully",
//     }).show();
//     medidor.id = result.insertId;
//     return medidor;
//   } catch (error) {
//     console.log(error);
//   }
// });

ipcMain.handle("getMedidorById", function _callee59(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee59$(_context59) {
    while (1) {
      switch (_context59.prev = _context59.next) {
        case 0:
          _context59.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context59.sent;
          _context59.next = 5;
          return regeneratorRuntime.awrap(conn.query("Select * from medidores where id = ?", id));

        case 5:
          result = _context59.sent;
          console.log(result[0]);
          return _context59.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context59.stop();
      }
    }
  });
}); // Borrar en caso de no usar
// ipcMain.handle("getDatosMedidorById", async (event, id) => {
//   const conn = await getConnection();
//   var result = "";
//   result = await conn.query(
//     "select medidores.id as medidorId,medidores.codigo,medidores.fechaInstalacion," +
//       "medidores.marca,medidores.barrio,medidores.callePrincipal,medidores.calleSecundaria," +
//       "medidores.numeroCasa,medidores.referencia,medidores.observacion,contratos.id as " +
//       "contratosId,contratos.fecha as fechaContrato,contratos.pagoEscrituras,contratos.pagoRecoleccionDesechos," +
//       "contratos.pagoAlcanterillado,contratos.pagoAguaPotable,socios.id as sociosId," +
//       "socios.nombre,socios.apellido,socios.cedula from medidores join contratos on " +
//       "contratos.id=medidores.contratosId join socios on socios.id=contratos.sociosId " +
//       "where contratos.id=?;",
//     id
//   );
//   console.log("Datos medidor: ", result[0]);
//   if (result[0] == undefined) {
//     result = await conn.query(
//       "select contratos.id as " +
//         "contratosId,contratos.fecha as fechaContrato,contratos.pagoEscrituras," +
//         "contratos.pagoRecoleccionDesechos," +
//         "contratos.pagoAlcanterillado,contratos.pagoAguaPotable,socios.id as sociosId," +
//         "socios.nombre,socios.apellido,socios.cedula from contratos join socios on " +
//         "socios.id=contratos.sociosId " +
//         "where contratos.id=?;",
//       id
//     );
//   }
//   return result[0];
// });

ipcMain.handle("deleteMedidor", function _callee60(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee60$(_context60) {
    while (1) {
      switch (_context60.prev = _context60.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context60.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context60.sent;
          _context60.next = 6;
          return regeneratorRuntime.awrap(conn.query("DELETE from medidores where id = ?", id));

        case 6:
          result = _context60.sent;
          console.log(result);
          return _context60.abrupt("return", result);

        case 9:
        case "end":
          return _context60.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funciones de los sectores
// ----------------------------------------------------------------
// Obtener los sectores y sus atributos

ipcMain.handle("getSectores", function _callee61() {
  var conn, results;
  return regeneratorRuntime.async(function _callee61$(_context61) {
    while (1) {
      switch (_context61.prev = _context61.next) {
        case 0:
          _context61.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context61.sent;
          results = conn.query("SELECT * FROM sectores;");
          console.log(results);
          return _context61.abrupt("return", results);

        case 6:
        case "end":
          return _context61.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funciones de los contratos
// ----------------------------------------------------------------
// Verificar contratos anteriores de los socios

ipcMain.handle("getContratosAnterioresByCedula", function _callee62(event, cedula) {
  var sinMedidor, conMedidor, contratos, contratosTotal, conn, sinMedidores, conMedidores, listasectores, _listasectores, _listasectores2, listasectores2;

  return regeneratorRuntime.async(function _callee62$(_context62) {
    while (1) {
      switch (_context62.prev = _context62.next) {
        case 0:
          conMedidor = 0;
          contratos = 0;
          contratosTotal = [];
          _context62.next = 5;
          return regeneratorRuntime.awrap(getConnection());

        case 5:
          conn = _context62.sent;
          _context62.prev = 6;
          _context62.next = 9;
          return regeneratorRuntime.awrap(conn.query( // "select count(contratos.id)as sinMedidor,contratos.fecha,socios.cedulaPasaporte from contratos " +
          //   "join socios on socios.id=contratos.sociosId where " +
          //   "contratos.medidorSn='No' and socios.cedulaPasaporte='" +
          //   cedula +
          //   "' ; "
          "select * from viewContratos " + "where medidorSn='No' and cedulaPasaporte='" + cedula + "' ; "));

        case 9:
          sinMedidores = _context62.sent;
          _context62.next = 12;
          return regeneratorRuntime.awrap(conn.query("select * from viewContratos " + "where medidorSn='Si' and cedulaPasaporte='" + cedula + "' ; "));

        case 12:
          conMedidores = _context62.sent;
          sinMedidor = sinMedidores.length;
          conMedidor = conMedidores.length; // sinMedidor: sinMedidor,
          // conMedidor: conMedidor,

          if (sinMedidor == 0 && conMedidor > 0) {
            listasectores = "";
            conMedidores.forEach(function (contrato) {
              listasectores = listasectores + contrato.barrio + ", ";
            });
            event.sender.send("showAlertMedidoresExistentes", "Este usuario ya registra " + conMedidor + " contrato(s) con Medidor\n" + "Sector: " + listasectores + "\nVerifica el registro de contratos antes de crear uno nuevo!");
            contratosTotal = conMedidores;
          } else if (sinMedidor > 0 && conMedidor == 0) {
            _listasectores = "";
            sinMedidores.forEach(function (contrato) {
              _listasectores = _listasectores + contrato.barrio + ", ";
            });
            event.sender.send("showAlertMedidoresExistentes", "Este usuario ya registra " + sinMedidor + " contrato(s) sin Medidor\n" + "Sector: " + _listasectores + "\nVerifica el registro de contratos antes de crear uno nuevo!");
            contratosTotal = sinMedidores;
          } else if (sinMedidor > 0 && conMedidor > 0) {
            _listasectores2 = "";
            sinMedidores.forEach(function (contrato) {
              _listasectores2 = _listasectores2 + contrato.barrio + ", ";
            });
            listasectores2 = "";
            conMedidores.forEach(function (contrato) {
              listasectores2 = listasectores2 + contrato.barrio + ", ";
            });
            event.sender.send("showAlertMedidoresExistentes", "Este usuario ya registra " + sinMedidor + " contrato(s) sin Medidor\n" + "Sector: " + _listasectores2 + "\n" + " y " + conMedidor + " contrato(s) con Medidor\n" + "  " + "Sector: " + listasectores2 + "\nVerifica el registro de contratos antes de crear uno nuevo!");
            contratosTotal += conMedidores;
            contratosTotal += sinMedidores;
          }

          console.log(contratos);
          return _context62.abrupt("return", contratosTotal);

        case 20:
          _context62.prev = 20;
          _context62.t0 = _context62["catch"](6);
          console.log(_context62.t0);

        case 23:
        case "end":
          return _context62.stop();
      }
    }
  }, null, null, [[6, 20]]);
});
ipcMain.handle("getContratosSimilares", function _callee63(event, socioId) {
  var conn, contratosSimilares;
  return regeneratorRuntime.async(function _callee63$(_context63) {
    while (1) {
      switch (_context63.prev = _context63.next) {
        case 0:
          _context63.prev = 0;
          _context63.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context63.sent;
          _context63.next = 6;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM contratos WHERE sociosId=?", socioId));

        case 6:
          contratosSimilares = _context63.sent;
          return _context63.abrupt("return", contratosSimilares);

        case 10:
          _context63.prev = 10;
          _context63.t0 = _context63["catch"](0);
          console.log("Error al cargar contratos similares: ", _context63.t0);

        case 13:
        case "end":
          return _context63.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
ipcMain.handle("getCompartidosContratados", function _callee64(event, servicioId, socioId) {
  var conn, compartidosAnteriores;
  return regeneratorRuntime.async(function _callee64$(_context64) {
    while (1) {
      switch (_context64.prev = _context64.next) {
        case 0:
          _context64.prev = 0;
          _context64.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context64.sent;
          _context64.next = 6;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewServiciosContratados where sociosId=" + socioId + " AND serviciosId=" + servicioId + " AND estado='Activo';"));

        case 6:
          compartidosAnteriores = _context64.sent;
          console.log("Compartidos anteriores: ", compartidosAnteriores);
          return _context64.abrupt("return", compartidosAnteriores);

        case 11:
          _context64.prev = 11;
          _context64.t0 = _context64["catch"](0);
          console.log(_context64.t0);

        case 14:
        case "end":
          return _context64.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
ipcMain.handle("getContratosConMedidor", function _callee65() {
  var contratosConMedidor, conn;
  return regeneratorRuntime.async(function _callee65$(_context65) {
    while (1) {
      switch (_context65.prev = _context65.next) {
        case 0:
          _context65.prev = 0;
          _context65.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context65.sent;
          contratosConMedidor = conn.query("SELECT * from viewContratos where medidorSn='Si' order by contratosId desc;");
          _context65.next = 10;
          break;

        case 7:
          _context65.prev = 7;
          _context65.t0 = _context65["catch"](0);
          Console.log(_context65.t0);

        case 10:
          console.log(contratosConMedidor);
          return _context65.abrupt("return", contratosConMedidor);

        case 12:
        case "end":
          return _context65.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
ipcMain.handle("getContratosSinMedidor", function _callee66() {
  var contratosSinMedidor, conn;
  return regeneratorRuntime.async(function _callee66$(_context66) {
    while (1) {
      switch (_context66.prev = _context66.next) {
        case 0:
          _context66.prev = 0;
          _context66.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context66.sent;
          contratosSinMedidor = conn.query("SELECT * from viewContratos where medidorSn='No' order by contratosId desc;");
          _context66.next = 10;
          break;

        case 7:
          _context66.prev = 7;
          _context66.t0 = _context66["catch"](0);
          console.log(_context66.t0);

        case 10:
          console.log(contratosSinMedidor);
          return _context66.abrupt("return", contratosSinMedidor);

        case 12:
        case "end":
          return _context66.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
ipcMain.handle("createContrato", function _callee67(event, contrato, numero, sectorId) {
  var conn, contratosAnteriores, _result10;

  return regeneratorRuntime.async(function _callee67$(_context67) {
    while (1) {
      switch (_context67.prev = _context67.next) {
        case 0:
          _context67.prev = 0;
          console.log("Recibido:", event, contrato, numero, sectorId);
          _context67.next = 4;
          return regeneratorRuntime.awrap(getConnection());

        case 4:
          conn = _context67.sent;
          _context67.next = 7;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM contratos WHERE  sociosId= ?", contrato.sociosId));

        case 7:
          contratosAnteriores = _context67.sent;

          if (contratosAnteriores.length > 0) {
            contrato.principalSn = "No";
          } else {
            contrato.principalSn = "Si";
          }

          console.log("Recibido: ", contrato);
          _context67.next = 12;
          return regeneratorRuntime.awrap(conn.query("Insert into contratos set ?", contrato));

        case 12:
          _result10 = _context67.sent;
          sumarSociosSectores(numero, sectorId);
          console.log(_result10);
          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Se ha registrado el nuevo contrato."
          });
          contrato.id = _result10.insertId;
          return _context67.abrupt("return", contrato);

        case 20:
          _context67.prev = 20;
          _context67.t0 = _context67["catch"](0);
          console.log(_context67.t0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al registrar el contrato."
          });

        case 24:
        case "end":
          return _context67.stop();
      }
    }
  }, null, null, [[0, 20]]);
});
ipcMain.handle("getDatosContratosById", function _callee68(event, id) {
  var conn, mensaje, result;
  return regeneratorRuntime.async(function _callee68$(_context68) {
    while (1) {
      switch (_context68.prev = _context68.next) {
        case 0:
          _context68.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context68.sent;
          mensaje = "NM: ";
          result = "";
          _context68.next = 7;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewcontratosconmedidor where id=" + id + ";"));

        case 7:
          result = _context68.sent;

          if (!(!result.length == 0)) {
            _context68.next = 12;
            break;
          }

          mensaje = "Datos contrato con medidor: ";
          _context68.next = 16;
          break;

        case 12:
          _context68.next = 14;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewcontratossinmedidor where id=" + id + ";"));

        case 14:
          result = _context68.sent;

          if (!result.length == 0) {
            mensaje = "Datos contrato sin medidor: ";
          } else {
            mensaje = "No se encontraron datos: ";
          }

        case 16:
          console.log(mensaje, result[0]);
          return _context68.abrupt("return", result[0]);

        case 18:
        case "end":
          return _context68.stop();
      }
    }
  });
});
ipcMain.handle("updatePrincipal", function _callee69(event, contratoId, socioId) {
  var conn, resultSecundarios, resultPrincipales;
  return regeneratorRuntime.async(function _callee69$(_context69) {
    while (1) {
      switch (_context69.prev = _context69.next) {
        case 0:
          _context69.prev = 0;
          _context69.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context69.sent;
          _context69.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE contratos SET principalSn='No' WHERE NOT contratos.id=" + contratoId + " AND contratos.sociosId=" + socioId + " ;"));

        case 6:
          resultSecundarios = _context69.sent;
          _context69.next = 9;
          return regeneratorRuntime.awrap(conn.query("UPDATE contratos SET principalSn='Si' WHERE contratos.id=" + contratoId + " AND contratos.sociosId=" + socioId + " ;"));

        case 9:
          resultPrincipales = _context69.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se han actualizado el registro del contrato."
          });
          return _context69.abrupt("return", contratoId);

        case 14:
          _context69.prev = 14;
          _context69.t0 = _context69["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al actualizar el contrato."
          });
          console.log(_context69.t0);

        case 18:
        case "end":
          return _context69.stop();
      }
    }
  }, null, null, [[0, 14]]);
});

function sumarSociosSectores(numero, sectorId) {
  var conn, _result11;

  return regeneratorRuntime.async(function sumarSociosSectores$(_context70) {
    while (1) {
      switch (_context70.prev = _context70.next) {
        case 0:
          console.log("Recibido sectores: " + numero + " " + sectorId);
          _context70.prev = 1;
          _context70.next = 4;
          return regeneratorRuntime.awrap(getConnection());

        case 4:
          conn = _context70.sent;
          _context70.next = 7;
          return regeneratorRuntime.awrap(conn.query("Update sectores set numeroSocios=? WHERE id= ?", [numero, sectorId]));

        case 7:
          _result11 = _context70.sent;
          console.log(_result11);
          new Notification({
            title: "Registró guardado",
            body: "Se registró un nuevo usuario para sectores"
          }).show();
          return _context70.abrupt("return", _result11);

        case 13:
          _context70.prev = 13;
          _context70.t0 = _context70["catch"](1);
          console.log(_context70.t0);

        case 16:
        case "end":
          return _context70.stop();
      }
    }
  }, null, null, [[1, 13]]);
}

ipcMain.handle("updateContrato", function _callee70(event, id, contrato) {
  var conn, result;
  return regeneratorRuntime.async(function _callee70$(_context71) {
    while (1) {
      switch (_context71.prev = _context71.next) {
        case 0:
          _context71.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context71.sent;
          _context71.prev = 3;
          _context71.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE contratos  set ? where id = ?", [contrato, id]));

        case 6:
          result = _context71.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se han actualizado el registro del contrato.",
            contratoId: id
          });
          return _context71.abrupt("return", result);

        case 11:
          _context71.prev = 11;
          _context71.t0 = _context71["catch"](3);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al actualizar el contrato."
          });
          console.log(_context71.t0);

        case 15:
        case "end":
          return _context71.stop();
      }
    }
  }, null, null, [[3, 11]]);
});
ipcMain.handle("updateMedidor", function _callee71(event, id, medidor) {
  var conn, medidorExistente, result;
  return regeneratorRuntime.async(function _callee71$(_context72) {
    while (1) {
      switch (_context72.prev = _context72.next) {
        case 0:
          _context72.prev = 0;
          _context72.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context72.sent;
          _context72.next = 6;
          return regeneratorRuntime.awrap(conn.query("SELECT id FROM medidores  WHERE contratosId=" + id + ";"));

        case 6:
          medidorExistente = _context72.sent;

          if (!(medidorExistente[0] !== undefined)) {
            _context72.next = 18;
            break;
          }

          console.log("resultado de buscar el medidor: " + medidorExistente[0]);
          console.log("ejecutando if");
          _context72.next = 12;
          return regeneratorRuntime.awrap(conn.query("UPDATE medidores set ? where id = ?", [medidor, medidorExistente[0].id]));

        case 12:
          result = _context72.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se han actualizado el registro del contrato.",
            contratoId: id
          });
          console.log(result);
          return _context72.abrupt("return", medidorExistente[0]);

        case 18:
          console.log("ejecutando else: ", medidor);
          _context72.next = 21;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO medidores set ?", medidor));

        case 21:
          result = _context72.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Se han actualizado el registro del contrato.",
            contratoId: id
          });
          medidor.id = result.insertId;
          console.log(result);
          return _context72.abrupt("return", medidor);

        case 26:
          _context72.next = 32;
          break;

        case 28:
          _context72.prev = 28;
          _context72.t0 = _context72["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al actualizar el medidor."
          });
          console.log("Error al actualizar el medidor: ", _context72.t0);

        case 32:
        case "end":
          return _context72.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
ipcMain.handle("createServiciosContratados", function _callee72(event, servicioId, contratoId, descuentosId, adquiridoSn) {
  var conn, resultContratarServicio;
  return regeneratorRuntime.async(function _callee72$(_context73) {
    while (1) {
      switch (_context73.prev = _context73.next) {
        case 0:
          _context73.prev = 0;
          _context73.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context73.sent;
          console.log("Recibido: ", servicioId);
          _context73.next = 7;
          return regeneratorRuntime.awrap(conn.query("CALL insertServiciosContratados (" + servicioId + "," + contratoId + "," + descuentosId + ",'" + adquiridoSn + "');"));

        case 7:
          resultContratarServicio = _context73.sent;
          console.log(resultContratarServicio); // new Notification({
          //   title: "Regístro guardado",
          //   body: "Se registro el servicio",
          // }).show();

          event.sender.send("notifyContratarServicios");
          resultContratarServicio.id = resultContratarServicio.insertId;
          return _context73.abrupt("return", resultContratarServicio);

        case 14:
          _context73.prev = 14;
          _context73.t0 = _context73["catch"](0);
          console.log(_context73.t0);

        case 17:
        case "end":
          return _context73.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
ipcMain.handle("createServicioFijoContratado", function _callee73(event, servicioId, contratoId, descuentosId, adquiridoSn) {
  var servicioValorPagos, servicioValor, servicioNumPagos, valorDescuento, conn, datosServicio, datosDescuento, contratadoExiste, newContratado, resultServicioContratado, _resultServicioContratado;

  return regeneratorRuntime.async(function _callee73$(_context74) {
    while (1) {
      switch (_context74.prev = _context74.next) {
        case 0:
          servicioValorPagos = 0;
          servicioValor = 0;
          servicioNumPagos = 1;
          valorDescuento = 0;
          _context74.prev = 4;
          _context74.next = 7;
          return regeneratorRuntime.awrap(getConnection());

        case 7:
          conn = _context74.sent;
          console.log("Recibido: ", servicioId); // Verificamos si existe el servicio en servicios contratados del contrato.

          _context74.next = 11;
          return regeneratorRuntime.awrap(conn.query("SELECT * from servicios WHERE id=" + servicioId + ";"));

        case 11:
          datosServicio = _context74.sent;
          _context74.next = 14;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM tiposDescuento WHERE id=" + descuentosId + ";"));

        case 14:
          datosDescuento = _context74.sent;

          if (datosServicio[0] !== undefined) {
            console.log("Si hay datos: " + datosServicio[0].id);
            servicioValorPagos = datosServicio[0].valorPagos;
            servicioValor = datosServicio[0].valor;
            servicioNumPagos = datosServicio[0].numeroPagos;
          }

          if (datosDescuento[0] !== undefined) {
            console.log("Si hay descuento: " + datosDescuento[0].valor);
            valorDescuento = datosDescuento[0].valor;
          }

          _context74.next = 19;
          return regeneratorRuntime.awrap(conn.query("SELECT * from serviciosContratados WHERE serviciosId=" + servicioId + " AND contratosId=" + contratoId + ";"));

        case 19:
          contratadoExiste = _context74.sent;
          newContratado = {
            estado: adquiridoSn,
            descuentosId: descuentosId,
            valorPagosindividual: servicioValorPagos,
            valorIndividual: servicioValor,
            numeroPagosindividual: servicioNumPagos,
            descuentoValor: valorDescuento
          };

          if (!(contratadoExiste[0] !== undefined)) {
            _context74.next = 30;
            break;
          }

          _context74.next = 24;
          return regeneratorRuntime.awrap(conn.query("UPDATE serviciosContratados SET ?" + " WHERE " + "serviciosId=? AND contratosId=? ;", [newContratado, servicioId, contratoId]));

        case 24:
          resultServicioContratado = _context74.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se han actualizado los servicios contratados.",
            contratoId: contratoId
          });
          console.log("Contratado actualizado: " + resultServicioContratado);
          return _context74.abrupt("return", resultServicioContratado);

        case 30:
          newContratado.fechaEmision = formatearFecha(new Date());
          newContratado.serviciosId = servicioId;
          newContratado.contratosId = contratoId;
          _context74.next = 35;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO serviciosContratados SET ?" + ";", newContratado));

        case 35:
          _resultServicioContratado = _context74.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se han actualizado los servicios contratados.",
            contratoId: contratoId
          });
          console.log("Contratado creado: " + _resultServicioContratado);
          return _context74.abrupt("return", _resultServicioContratado);

        case 39:
          _context74.next = 45;
          break;

        case 41:
          _context74.prev = 41;
          _context74.t0 = _context74["catch"](4);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al registrar los servicios contratados."
          });
          console.log(_context74.t0);

        case 45:
        case "end":
          return _context74.stop();
      }
    }
  }, null, null, [[4, 41]]);
}); // ----------------------------------------------------------------
// Funciones de las planillas
// ----------------------------------------------------------------
// ipcMain.handle("createComprobante", async (event) => {
//   const conn = await getConnection();
//   try {
//     // Consultamos cuales son los medidores que se encuentran activos para crear el registro de lecturas
//     contratosActivos = await conn.query(
//       "Select * from contratos where medidorSn='No' and estado='Activo';"
//     );
//     if (contratosActivos[0] !== undefined) {
//       contratosActivos.forEach(async (contratoActivo) => {
//         console.log("Contrato a buscar: " + contratoActivo.id);
//         createCuentaServicios(contratoActivo.id);
//       });
//     }
//   } catch (error) {
//     console.log("Error al crear comprobantes: " + error);
//   }
// });
// ----------------------------------------------------------------
// Funciones de las planillas
// ----------------------------------------------------------------

ipcMain.handle("createPlanilla", function _callee75(event, fechaCreacion) {
  var conn;
  return regeneratorRuntime.async(function _callee75$(_context76) {
    while (1) {
      switch (_context76.prev = _context76.next) {
        case 0:
          _context76.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context76.sent;
          _context76.prev = 3;
          _context76.next = 6;
          return regeneratorRuntime.awrap(conn.query("select medidores.id,medidores.codigo,medidores.fechaInstalacion,contratos.id as contratosId,contratos.medidorSn " + "from medidores join contratos on contratos.id=medidores.contratosId " + "where contratos.estado='Activo'; " // "where contratos.medidorSn='Si' AND contratos.estado='Activo'; "
          ));

        case 6:
          medidoresActivos = _context76.sent;

          if (medidoresActivos[0] !== undefined) {
            medidoresActivos.forEach(function _callee74(contratoActivo) {
              var lecturaAnterior, lecturaConsulta, tarifaBase, newPlanilla, resultadoPlanillas, _newPlanilla, _resultadoPlanillas;

              return regeneratorRuntime.async(function _callee74$(_context75) {
                while (1) {
                  switch (_context75.prev = _context75.next) {
                    case 0:
                      console.log("Contrato a buscar: " + contratoActivo.id);

                      if (!(contratoActivo.medidorSn == "Si")) {
                        _context75.next = 22;
                        break;
                      }

                      _context75.next = 4;
                      return regeneratorRuntime.awrap(conn.query( // "SELECT count(planillas.id) as existe from planillas where month" +
                      //   "(planillas.fechaEmision)=month(now()) and year(planillas.fechaEmision)=year(now()) " +
                      //   "and  planillas.medidoresId=" +
                      //   contratoActivo.id +
                      //   ";"
                      "SELECT count(planillas.id) as existe from planillas where month" + "(planillas.fechaEmision)=month('" + fechaCreacion + "') and year(planillas.fechaEmision)=year('" + fechaCreacion + "') " + "and  planillas.medidoresId=" + contratoActivo.id + ";"));

                    case 4:
                      planillaExiste = _context75.sent;
                      console.log("existe: " + planillaExiste[0].existe); // Si no existe la planilla correspondiente a la fecha se crea a planilla

                      if (!(planillaExiste[0].existe === 0)) {
                        _context75.next = 20;
                        break;
                      }

                      // Obtenemos el valor de la lectura anterior en caso de existir
                      lecturaAnterior = 0.0;
                      _context75.next = 10;
                      return regeneratorRuntime.awrap(conn.query(" SELECT planillas.lecturaActual from planillas where " + "medidoresId=" + contratoActivo.id + " order by planillas.fechaEmision desc limit 1;"));

                    case 10:
                      lecturaConsulta = _context75.sent;

                      if (lecturaConsulta[0] !== undefined) {
                        console.log("lectura Anterior: " + lecturaConsulta[0].lecturaActual);
                        lecturaAnterior = lecturaConsulta[0].lecturaActual;
                      }

                      _context75.next = 14;
                      return regeneratorRuntime.awrap(conn.query("SELECT * FROM tarifas where tarifa='Familiar';"));

                    case 14:
                      tarifaBase = _context75.sent;
                      newPlanilla = {
                        //Fecha emision va comentado
                        fechaEmision: fechaCreacion,
                        valor: tarifaBase[0].valor,
                        estado: "Por cobrar",
                        lecturaActual: 0.0,
                        lecturaAnterior: lecturaAnterior,
                        Observacion: "NA",
                        medidoresId: contratoActivo.id,
                        tarifa: "Familiar",
                        tarifaValor: tarifaBase[0].valor
                      };
                      _context75.next = 18;
                      return regeneratorRuntime.awrap(conn.query("INSERT INTO planillas set ?", newPlanilla));

                    case 18:
                      resultadoPlanillas = _context75.sent;
                      console.log("Resultado de crear planillas: " + resultadoPlanillas); // return resultadoPlanillas;

                    case 20:
                      _context75.next = 33;
                      break;

                    case 22:
                      _context75.next = 24;
                      return regeneratorRuntime.awrap(conn.query( // "SELECT count(planillas.id) as existe from planillas where month" +
                      //   "(planillas.fechaEmision)=month(now()) and year(planillas.fechaEmision)=year(now()) " +
                      //   "and  planillas.medidoresId=" +
                      //   contratoActivo.id +
                      //   ";"
                      "SELECT count(planillas.id) as existe from planillas where month" + "(planillas.fechaEmision)=month('" + fechaCreacion + "') and year(planillas.fechaEmision)=year('" + fechaCreacion + "') " + "and  planillas.medidoresId=" + contratoActivo.id + ";"));

                    case 24:
                      planillaExiste = _context75.sent;
                      console.log("existe: " + planillaExiste[0].existe); // Si no existe la planilla correspondiente a la fecha se crea a planilla

                      if (!(planillaExiste[0].existe == 0)) {
                        _context75.next = 33;
                        break;
                      }

                      // Obtenemos el valor de la lectura anterior en caso de existir
                      lecturaAnterior = 0.0; // const lecturaConsulta = await conn.query(
                      //   " SELECT planillas.lecturaActual from planillas where " +
                      //     "medidoresId=" +
                      //     contratoActivo.id +
                      //     " order by planillas.fechaEmision desc limit 1;"
                      // );
                      // if (lecturaConsulta[0] !== undefined) {
                      //   console.log(
                      //     "lectura Anterior: " + lecturaConsulta[0].lecturaActual
                      //   );
                      //   lecturaAnterior = lecturaConsulta[0].lecturaActual;
                      // }
                      // const tarifaBase = await conn.query(
                      //   "SELECT * FROM tarifas where tarifa='Familiar';"
                      // );

                      _newPlanilla = {
                        //Fecha emision va comentado
                        fechaEmision: fechaCreacion,
                        valor: 0.0,
                        estado: "Por cobrar",
                        lecturaActual: 0.0,
                        lecturaAnterior: lecturaAnterior,
                        Observacion: "NA",
                        medidoresId: contratoActivo.id,
                        tarifa: "NA",
                        tarifaValor: 0.0
                      };
                      _context75.next = 31;
                      return regeneratorRuntime.awrap(conn.query("INSERT INTO planillas set ?", _newPlanilla));

                    case 31:
                      _resultadoPlanillas = _context75.sent;
                      console.log("Resultado de crear planillas: " + _resultadoPlanillas); // return resultadoPlanillas;

                    case 33:
                      createCuentaServicios(contratoActivo.contratosId, fechaCreacion);

                    case 34:
                    case "end":
                      return _context75.stop();
                  }
                }
              });
            });
          }

          _context76.next = 13;
          break;

        case 10:
          _context76.prev = 10;
          _context76.t0 = _context76["catch"](3);
          console.log("Error al crear planillas: " + _context76.t0);

        case 13:
        case "end":
          return _context76.stop();
      }
    }
  }, null, null, [[3, 10]]);
});

function createCuentaServicios(contratoId, fechaCreacion) {
  var conn, encabezadoId, encabezadoExiste, resultEncabezado, serviciosContratados, otrosValores;
  return regeneratorRuntime.async(function createCuentaServicios$(_context77) {
    while (1) {
      switch (_context77.prev = _context77.next) {
        case 0:
          console.log("Consultando encabezado para: " + contratoId);
          _context77.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context77.sent;
          _context77.prev = 4;
          _context77.next = 7;
          return regeneratorRuntime.awrap(conn.query( // Debe ir con now()
          // "select count(id) as existe, id from viewEncabezados WHERE tipo='planilla' and   " +
          // "month(fechaEmisionEncabezado)=month('" +
          // fechaCreacion +
          // "')" +
          // " and year(fechaEmisionEncabezado)=year('" +
          // fechaCreacion +
          // "') and contratosId=" +
          // contratoId +
          // ";"
          "select count(id) as existe, id from viewEncabezados WHERE tipo='planilla' and   " + "month(fechaEmisionEncabezado)=month('" + fechaCreacion + "')" + " and year(fechaEmisionEncabezado)=year('" + fechaCreacion + "') and contratosId=" + contratoId + ";"));

        case 7:
          encabezadoExiste = _context77.sent;

          if (!(encabezadoExiste[0].existe === 0)) {
            _context77.next = 17;
            break;
          }

          console.log("Existe encabezado: ", encabezadoExiste[0].existe); // Si no existe un encabezado para la fecha actual se procede a crear uno

          newEncabezado = {
            // fechaEmision no va
            fechaEmision: fechaCreacion,
            fechaPago: null,
            tipo: "planilla"
          };
          _context77.next = 13;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO encabezado set ?;", newEncabezado));

        case 13:
          resultEncabezado = _context77.sent;
          encabezadoId = resultEncabezado.insertId;
          _context77.next = 18;
          break;

        case 17:
          // Si existe el encabezado obtenemos el id del encabezado existente
          encabezadoId = encabezadoExiste[0].id;

        case 18:
          _context77.next = 20;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewServiciosCancelar WHERE contratosId=" + contratoId + " AND estado='Activo' AND tipo='Servicio fijo' AND aplazableSn='No';"));

        case 20:
          serviciosContratados = _context77.sent;
          createDetallesServicios(serviciosContratados, encabezadoId, fechaCreacion); // Consultamos los servicios ocacionales, las cuotas y las multas que no son aplazables para
          // incluirlas en el detalle de servicios y relacionarlos con un encabezado correspondiente a la
          // cuenta de servicios de cada mes.
          // const otrosValoresNoAplazables = await conn.query(
          //   "SELECT serviciosContratados.id,serviciosContratados.estado," +
          //     "serviciosContratados.fechaEmision,servicios.id as serviciosId," +
          //     "servicios.nombre,servicios.descripcion,servicios.tipo,servicios.valor," +
          //     "tiposdescuento.descripcion as descripcionDescuento,tiposdescuento.valor as valorDescuento " +
          //     "from serviciosContratados join servicios on servicios.id=serviciosContratados.serviciosId join " +
          //     "tiposdescuento on tiposdescuento.id=serviciosContratados.descuentosId " +
          //     "where serviciosContratados.contratosId=" +
          //     contratoId +
          //     " and serviciosContratados.estado='Activo'  and not servicios.tipo='Servicio fijo' and " +
          //     "servicios.aplazableSn='No' and month(servicioscontratados.fechaEmision)=" +
          //     " month(now()) and year(servicioscontratados.fechaEmision)= year(now());"
          // );

          _context77.next = 24;
          return regeneratorRuntime.awrap(conn.query( // "SELECT serviciosContratados.id,serviciosContratados.estado," +
          //   "serviciosContratados.fechaEmision,serviciosContratados.valorIndividual,servicios.id as serviciosId," +
          //   "servicios.aplazableSn,servicios.nombre,servicios.descripcion,servicios.tipo,servicios.valor,servicios.valorPagos," +
          //   "tiposdescuento.descripcion as descripcionDescuento,tiposdescuento.valor as valorDescuento " +
          //   "from serviciosContratados join servicios on servicios.id=serviciosContratados.serviciosId join " +
          //   "tiposdescuento on tiposdescuento.id=serviciosContratados.descuentosId " +
          //   "where serviciosContratados.contratosId=" +
          //   contratoId +
          //   " and serviciosContratados.estado='Sin aplicar' and not servicios.tipo='Servicio fijo'"
          "SELECT * FROM viewServiciosCancelar WHERE contratosId=" + contratoId + // " AND estado='Sin aplicar' AND NOT tipo='Servicio fijo';"
          " AND NOT tipo='Servicio fijo';"));

        case 24:
          otrosValores = _context77.sent;
          createDetallesServicios(otrosValores, encabezadoId, fechaCreacion);
          _context77.next = 31;
          break;

        case 28:
          _context77.prev = 28;
          _context77.t0 = _context77["catch"](4);
          console.log("Error al crear cuentaservicios: " + _context77.t0);

        case 31:
        case "end":
          return _context77.stop();
      }
    }
  }, null, null, [[4, 28]]);
}

function createDetallesServicios(serviciosContratados, encabezadoId, fechaCreacion) {
  var conn;
  return regeneratorRuntime.async(function createDetallesServicios$(_context79) {
    while (1) {
      switch (_context79.prev = _context79.next) {
        case 0:
          _context79.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context79.sent;
          serviciosContratados.forEach(function _callee76(servicioContratado) {
            var valorPagos, total, abonado, abono, abonosAplicados, totalPagar, newDetalleServicios, saldo, aplicadosAnteriores, faltante, pagosRestantes, resultadoDetalleServicio, modificaEstado;
            return regeneratorRuntime.async(function _callee76$(_context78) {
              while (1) {
                switch (_context78.prev = _context78.next) {
                  case 0:
                    console.log("Servicio contratado a buscar: " + servicioContratado.id); // Mediante la fecha consultamos si ya se ha creado un detalle para el servicio en determinado mes.
                    // para evitar que el servicio se aplique dos veces.

                    _context78.next = 3;
                    return regeneratorRuntime.awrap(conn.query( // Debe ir con now()
                    // "SELECT count(detallesServicio.id) as existe from detallesServicio where month" +
                    // "(detallesServicio.fechaEmision)=month('" +
                    // fechaCreacion +
                    // "') and year(detallesServicio.fechaEmision)=year('" +
                    // fechaCreacion +
                    // "') " +
                    // "and  detallesServicio.serviciosContratadosId=" +
                    // servicioContratado.id +
                    // ";"
                    "SELECT count(detallesServicio.id) as existe from detallesServicio where month" + "(detallesServicio.fechaEmision)=month('" + fechaCreacion + "') and year(detallesServicio.fechaEmision)=year('" + fechaCreacion + "') " + "and  detallesServicio.serviciosContratadosId=" + servicioContratado.id + ";"));

                  case 3:
                    detalleServicioExiste = _context78.sent;
                    console.log("Detalle servicio existe: " + detalleServicioExiste[0].existe); // Si no existen los detalles de servicios correspondiente a la fecha se crean y se añaden al encabezado

                    if (!(detalleServicioExiste[0].existe == 0)) {
                      _context78.next = 58;
                      break;
                    }

                    console.log("Servicio a registrar: " + servicioContratado.valorIndividual, servicioContratado.valorPagosIndividual);
                    valorPagos = 0.0;
                    total = 0.0;
                    abonado = 0;
                    abono = 0;
                    abonosAplicados = 0;
                    totalPagar = servicioContratado.valorIndividual - servicioContratado.descuentoValor;
                    newDetalleServicios = {};
                    saldo = 0; // if (servicioContratado.valoresDistintos === "Si") {

                    if (!(servicioContratado.aplazableSn === "Si")) {
                      _context78.next = 38;
                      break;
                    }

                    _context78.next = 18;
                    return regeneratorRuntime.awrap(conn.query("SELECT * FROM detallesServicio WHERE serviciosContratadosId=" + servicioContratado.id + " ;"));

                  case 18:
                    aplicadosAnteriores = _context78.sent;

                    if (!(aplicadosAnteriores[0] !== undefined)) {
                      _context78.next = 34;
                      break;
                    }

                    console.log("Entro a los aplazables con anteriores"); // Si exisen detalles de este servicio aplicados anteriormente

                    aplicadosAnteriores.forEach(function (aplicadoAnterior) {
                      //Sumo los valores aplicados
                      abonado += aplicadoAnterior.abono;
                      abonosAplicados++; // saldo=aplicadoAnterior.saldo;
                    }); // total = servicioContratado.valorIndividual;

                    if (!(abonado < totalPagar)) {
                      _context78.next = 30;
                      break;
                    }

                    console.log("Entro a los aplazables que no superan el abonado");
                    faltante = totalPagar - abonado;

                    if (faltante > servicioContratado.valorPagosIndividual) {
                      console.log("Entro a los aplazables con faltante mayor a la cuota");
                      pagosRestantes = servicioContratado.numeroPagosindividual - abonosAplicados;
                      abono = servicioContratado.valorPagosIndividual;
                    } else {
                      console.log("Entro a los aplazables con faltante menor a la cuota");
                      abono = faltante;
                    }

                    saldo = totalPagar - abonado; // valorPagos = servicioContratado.valorPagosindividual;

                    newDetalleServicios = {
                      serviciosContratadosId: servicioContratado.id,
                      descuento: servicioContratado.descuentoValor,
                      subtotal: servicioContratado.valorIndividual,
                      total: totalPagar,
                      // El saldo debe ser calculado
                      // saldo: total - servicioContratado.valorDescuento,
                      saldo: saldo - abono,
                      // El abono debe ser calculado
                      abono: abono,
                      encabezadosId: encabezadoId,
                      estado: "Por cancelar",
                      // fechaEmision va comentado
                      fechaEmision: fechaCreacion
                    };
                    _context78.next = 32;
                    break;

                  case 30:
                    console.log("Entro a los aplazables que superan el abonado");
                    return _context78.abrupt("return", null);

                  case 32:
                    _context78.next = 36;
                    break;

                  case 34:
                    console.log("Entro a los aplazables sin anteriores");
                    newDetalleServicios = {
                      serviciosContratadosId: servicioContratado.id,
                      descuento: servicioContratado.descuentoValor,
                      subtotal: servicioContratado.valorIndividual,
                      total: totalPagar,
                      // El saldo debe ser calculado
                      saldo: totalPagar - servicioContratado.valorPagosIndividual,
                      // El abono debe ser calculado
                      abono: parseFloat(servicioContratado.valorPagosIndividual),
                      encabezadosId: encabezadoId,
                      estado: "Por cancelar",
                      // fechaEmision va comentado
                      fechaEmision: fechaCreacion
                    };

                  case 36:
                    _context78.next = 40;
                    break;

                  case 38:
                    console.log("Entro a los no aplazables"); // Errro No esta verificando correctamente si el servicio no ha sido aplicado dos veces.

                    newDetalleServicios = {
                      serviciosContratadosId: servicioContratado.id,
                      descuento: servicioContratado.descuentoValor,
                      subtotal: servicioContratado.valorIndividual,
                      total: totalPagar,
                      // El saldo debe ser calculado
                      saldo: totalPagar - abono,
                      // El abono debe ser calculado
                      abono: abono,
                      encabezadosId: encabezadoId,
                      estado: "Por cancelar",
                      // fechaEmision va comentado
                      fechaEmision: fechaCreacion
                    }; // Verificamos si este servicio ya ha sido detallado, al ser un no aplazable
                    // No se debe aplicar dos veces.
                    // if (servicioContratado.tipo !== "Servicio fijo") {
                    //   const noAplazableAplicado = conn.query(
                    //     "SELECT * from detallesServicio where serviciosContratadosId=" +
                    //       servicioContratado.id +
                    //       " ;"
                    //   );
                    //   console.log('Here')
                    //   // if (noAplazableAplicado.length <= 0) {
                    //     if (noAplazableAplicado[0]!== undefined) {
                    //     console.log('No se encontrarron aplicados')
                    //     abono = servicioContratado.valorPagosIndividual;
                    //     //total = servicioContratado.valorIndividual;
                    //     // valorPagos = servicioContratado.valorPagosindividual;
                    //     newDetalleServicios = {
                    //       serviciosContratadosId: servicioContratado.id,
                    //       descuento: servicioContratado.descuentoValor,
                    //       subtotal: servicioContratado.valorIndividual,
                    //       total: totalPagar,
                    //       // El saldo debe ser calculado
                    //       saldo: totalPagar - abono,
                    //       // El abono debe ser calculado
                    //       abono: abono,
                    //       encabezadosId: encabezadoId,
                    //       estado: "Por cancelar",
                    //       // fechaEmision va comentado
                    //       fechaEmision: fechaCreacion,
                    //     };
                    //   }
                    // } else {
                    //   console.log("Es no aplazable fijo");
                    //   abono = servicioContratado.valorPagosIndividual;
                    //   //total = servicioContratado.valorIndividual;
                    //   // valorPagos = servicioContratado.valorPagosindividual;
                    //   newDetalleServicios = {
                    //     serviciosContratadosId: servicioContratado.id,
                    //     descuento: servicioContratado.descuentoValor,
                    //     subtotal: servicioContratado.valorIndividual,
                    //     total: totalPagar,
                    //     // El saldo debe ser calculado
                    //     saldo: totalPagar - abono,
                    //     // El abono debe ser calculado
                    //     abono: abono,
                    //     encabezadosId: encabezadoId,
                    //     estado: "Por cancelar",
                    //     // fechaEmision va comentado
                    //     fechaEmision: fechaCreacion,
                    //   };
                    // }

                  case 40:
                    if (!(newDetalleServicios !== null)) {
                      _context78.next = 56;
                      break;
                    }

                    _context78.next = 43;
                    return regeneratorRuntime.awrap(conn.query("INSERT INTO detallesServicio set ?", newDetalleServicios));

                  case 43:
                    resultadoDetalleServicio = _context78.sent;
                    console.log("servicioContratado.tipo: ", servicioContratado.tipo);

                    if (!(servicioContratado.tipo !== "Servicio fijo")) {
                      _context78.next = 54;
                      break;
                    }

                    console.log("entrando a cambiar estado");
                    _context78.next = 49;
                    return regeneratorRuntime.awrap(conn.query("UPDATE serviciosContratados SET estado='Aplicado' WHERE serviciosContratados.id=" + servicioContratado.id + ";"));

                  case 49:
                    modificaEstado = _context78.sent;
                    console.log("Resultado de crear planillas: " + resultadoDetalleServicio);
                    return _context78.abrupt("return", resultadoDetalleServicio);

                  case 54:
                    console.log("Resultado de crear planillas: " + resultadoDetalleServicio);
                    return _context78.abrupt("return", resultadoDetalleServicio);

                  case 56:
                    _context78.next = 60;
                    break;

                  case 58:
                    console.log("Sin detalles por aplicar");
                    return _context78.abrupt("return");

                  case 60:
                  case "end":
                    return _context78.stop();
                }
              }
            });
          });

        case 4:
        case "end":
          return _context79.stop();
      }
    }
  });
} // Cargamos las planillas disponibles


ipcMain.handle("getDatosPlanillas", function _callee77(event, criterio, criterioContent, estado, anio, mes) {
  var conn, _results9, _results10, _results11, _results12, _results13, _results14, _results15, _results16;

  return regeneratorRuntime.async(function _callee77$(_context80) {
    while (1) {
      switch (_context80.prev = _context80.next) {
        case 0:
          console.log("Recibo parametros planillas: " + criterio, criterioContent, estado, anio, mes);
          _context80.prev = 1;
          _context80.next = 4;
          return regeneratorRuntime.awrap(getConnection());

        case 4:
          conn = _context80.sent;

          if (estado == undefined || estado == "all") {
            estado = "";
          }

          if (criterio == undefined) {
            criterio = "all";
          }

          if (anio == undefined) {
            anio = "all";
          }

          if (mes == undefined) {
            mes = "all";
          }

          if (!(criterio == "all")) {
            _context80.next = 46;
            break;
          }

          if (!(anio == "all" && mes == "all")) {
            _context80.next = 19;
            break;
          }

          console.log("anio all mes all");
          _context80.next = 14;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewPlanillas WHERE " + "estado like'%" + estado + "%' order by fechaEmision desc"));

        case 14:
          _results9 = _context80.sent;
          console.log(_results9);
          return _context80.abrupt("return", _results9);

        case 19:
          if (!(anio == "all" && mes !== "all")) {
            _context80.next = 28;
            break;
          }

          console.log("anio all mes df", mes);
          _context80.next = 23;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewPlanillas WHERE " + "estado like'%" + estado + "%' and month(fechaEmision) = '" + mes + "' order by fechaEmision desc ;"));

        case 23:
          _results10 = _context80.sent;
          console.log(_results10);
          return _context80.abrupt("return", _results10);

        case 28:
          if (!(anio !== "all" && mes == "all")) {
            _context80.next = 37;
            break;
          }

          console.log("mes all anio df", anio);
          _context80.next = 32;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewPlanillas WHERE " + "estado like '%" + estado + "%' and " + " year(fechaEmision) = '" + anio + "' order by fechaEmision desc ;"));

        case 32:
          _results11 = _context80.sent;
          console.log(_results11);
          return _context80.abrupt("return", _results11);

        case 37:
          if (!(anio !== "all" && mes !== "all")) {
            _context80.next = 44;
            break;
          }

          console.log("mes df anio df ", mes, anio);
          _context80.next = 41;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewPlanillas WHERE " + "estado like'%" + estado + "%' and " + " year(fechaEmision) = '" + anio + "' and month(fechaEmision) = '" + mes + "' order by fechaEmision desc ;"));

        case 41:
          _results12 = _context80.sent;
          console.log(_results12);
          return _context80.abrupt("return", _results12);

        case 44:
          _context80.next = 85;
          break;

        case 46:
          if (!(anio == "all" && mes == "all")) {
            _context80.next = 55;
            break;
          }

          console.log("C mes all anio all");
          _context80.next = 50;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewPlanillas WHERE " + criterio + " like '%" + criterioContent + "%' and estado like'%" + estado + "%' order by fechaEmision desc ;"));

        case 50:
          _results13 = _context80.sent;
          console.log(_results13);
          return _context80.abrupt("return", _results13);

        case 55:
          if (!(anio == "all" && mes !== "all")) {
            _context80.next = 64;
            break;
          }

          console.log("C anio all mes df ", mes);
          _context80.next = 59;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewPlanillas WHERE " + criterio + " like '%" + criterioContent + "%' and estado like'%" + estado + "%' and month(fechaEmision) = '" + mes + "' order by fechaEmision desc ;"));

        case 59:
          _results14 = _context80.sent;
          console.log(_results14);
          return _context80.abrupt("return", _results14);

        case 64:
          if (!(anio !== "all" && mes == "all")) {
            _context80.next = 73;
            break;
          }

          console.log("C anio df mes all ", anio);
          _context80.next = 68;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewPlanillas WHERE " + criterio + " like '%" + criterioContent + "%' and estado like'%" + estado + "%' and " + " year(fechaEmision) = '" + anio + "' order by fechaEmision desc ;"));

        case 68:
          _results15 = _context80.sent;
          console.log(_results15);
          return _context80.abrupt("return", _results15);

        case 73:
          if (!(anio !== "all" && mes !== "all")) {
            _context80.next = 82;
            break;
          }

          console.log("anio df mes df", anio, mes);
          _context80.next = 77;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewPlanillas WHERE " + criterio + " like '%" + criterioContent + "%' and estado like'%" + estado + "%' and " + " year(fechaEmision) = '" + anio + "' and month(fechaEmision) = '" + mes + "' order by fechaEmision desc ;"));

        case 77:
          _results16 = _context80.sent;
          console.log(_results16);
          return _context80.abrupt("return", _results16);

        case 82:
          Console.log("?");

        case 83:
          // const results = await conn.query(
          //   "SELECT * FROM viewPlanillas WHERE " +
          //     criterio +
          //     " = " +
          //     criterioContent +
          //     " and estado='" +
          //     estado +
          //     "' and " +
          //     " year(fechaEmision) = '" +
          //     anio +
          //     "' and month(fechaEmision) = '" +
          //     mes +
          //     "' order by fechaEmision desc"
          // );
          // results = await conn.query("SELECT * FROM viewPlanillas");
          console.log("Con parametros", results);
          return _context80.abrupt("return", results);

        case 85:
          _context80.next = 90;
          break;

        case 87:
          _context80.prev = 87;
          _context80.t0 = _context80["catch"](1);
          console.log("Error en la busqueda de planillas: " + _context80.t0);

        case 90:
        case "end":
          return _context80.stop();
      }
    }
  }, null, null, [[1, 87]]);
}); // Funcion que carga los datos de la planilla para editarlos

ipcMain.handle("getPlanillaById", function _callee78(event, planillaId) {
  var conn, results;
  return regeneratorRuntime.async(function _callee78$(_context81) {
    while (1) {
      switch (_context81.prev = _context81.next) {
        case 0:
          _context81.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context81.sent;
          results = conn.query("SELECT * FROM viewPlanillas where planillasId=" + planillaId + ";");
          console.log(results);
          return _context81.abrupt("return", results);

        case 6:
        case "end":
          return _context81.stop();
      }
    }
  });
}); // Funcion que relaiza un filtro entre las planillas de acuerdo al codigo del medidor
// ipcMain.handle(
//   "getDatosPlanillasByCodigo",
//   async (
//     event,
//     codigoMedidor,
//     fechaPlanilla,
//     estadoPlanilla,
//     estadoEdicion
//   ) => {
//     try {
//       const conn = await getConnection();
//       conn.query("SET lc_time_names = 'es_ES';");
//       const results = conn.query(
//         "select planillas.id,planillas.fecha,planillas.valor,planillas.estado,planillas.estadoEdicion," +
//           "planillas.lecturaActual,planillas.lecturaAnterior,planillas.observacion," +
//           "planillas.codigo as codigoPlanillas," +
//           "medidores.codigo as codigoMedidores,socios.cedula, socios.nombre, socios.apellido," +
//           "concat(medidores.barrio,', ',medidores.callePrincipal,' y ',medidores.calleSecundaria,', casa: '," +
//           "medidores.numeroCasa,' ',medidores.referencia,'-') as ubicacion " +
//           "from planillas " +
//           "join contratos on contratos.id=planillas.contratosId join medidores on " +
//           "contratos.id=medidores.contratosId join socios on socios.id=contratos.sociosId " +
//           "where medidores.codigo ='" +
//           codigoMedidor +
//           "' and monthname(planillas.fecha)like '%" +
//           fechaPlanilla +
//           "%' " +
//           "and planillas.estado like'%" +
//           estadoPlanilla +
//           "%' and planillas.estadoEdicion like'%" +
//           estadoEdicion +
//           "%';"
//       );
//       const parametrosDesechos = await conn.query(
//         "select * from parametros where nombreParametro='Tarifa recolección de desechos';"
//       );
//       console.log(
//         "Consulta de los parametrso de desechos: ",
//         parametrosDesechos
//       );
//       const notification = new Notification({
//         title: "Exito",
//         body: "Se muestran los datos del medidor",
//         // icon: "/path/to/icon.png",
//         // onClick: () => {
//         //   // Acción a realizar al hacer clic en la notificación
//         // },
//       });
//       notification.show();
//       console.log(results);
//       return results;
//     } catch (error) {
//       const notification = new Notification({
//         title: "Error",
//         body: "Es posible que el medidor proporcionado no exista",
//         // icon: "/path/to/icon.png",
//         // onClick: () => {
//         //   // Acción a realizar al hacer clic en la notificación
//         // },
//       });
//       notification.show();
//     }
//   }
// );
// ----------------------------------------------------------------
// Funciones de las lecturas(Planillas)
// ----------------------------------------------------------------

ipcMain.handle("getLecturasByFecha", function _callee79(event, contratosId, fechaEmision) {
  var conn, _results17;

  return regeneratorRuntime.async(function _callee79$(_context82) {
    while (1) {
      switch (_context82.prev = _context82.next) {
        case 0:
          _context82.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context82.sent;
          _context82.prev = 3;
          _context82.next = 6;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewplanillas WHERE contratosId=" + contratosId + " and month(fechaEmision)=month('" + fechaEmision + "') and " + " year(fechaEmision)=year('" + fechaEmision + "');"));

        case 6:
          _results17 = _context82.sent;
          console.log(_results17[0]);
          return _context82.abrupt("return", _results17);

        case 11:
          _context82.prev = 11;
          _context82.t0 = _context82["catch"](3);
          console.log(_context82.t0);

        case 14:
        case "end":
          return _context82.stop();
      }
    }
  }, null, null, [[3, 11]]);
}); // ----------------------------------------------------------------
// Funcion que relaiza un filtro entre las cuotas de acuerdo al codigo del medidor

ipcMain.handle("getDatosCuotasByCodigo", function _callee80(event, codigoMedidor) {
  var conn, _results18, notification, _notification3;

  return regeneratorRuntime.async(function _callee80$(_context83) {
    while (1) {
      switch (_context83.prev = _context83.next) {
        case 0:
          _context83.prev = 0;
          _context83.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context83.sent;
          conn.query("SET lc_time_names = 'es_ES';");
          _results18 = conn.query("select servicios.id,servicios.fecha,servicios.servicio,servicios.descripcion,servicios.valor," + "servicios.estado from servicios join extrasplanilla on servicios.Id=extrasplanilla.serviciosId " + "join planillas on planillas.id=extrasplanilla.planillasId join " + "contratos on contratos.id=planillas.contratosId join medidores " + "on contratos.id=medidores.contratosId where servicios.tipo='cuota'and medidores.codigo='" + codigoMedidor + "'; ");
          notification = new Notification({
            title: "Exito",
            body: "Se muestran los datos del medidor"
          });
          notification.show();
          console.log(_results18);
          return _context83.abrupt("return", _results18);

        case 12:
          _context83.prev = 12;
          _context83.t0 = _context83["catch"](0);
          _notification3 = new Notification({
            title: "Error",
            body: "Es posible que el medidor proporcionado no exista"
          });

          _notification3.show();

        case 16:
        case "end":
          return _context83.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); // ----------------------------------------------------------------
// Funciones de los detalles
// ----------------------------------------------------------------
// Funcion que carga los servicios de acuerdo al id de la planilla

ipcMain.handle("getDatosServiciosByContratoId", function _callee81(event, contratoId, fechaEmision, criterio) {
  var conn, _result12, _result13, _result14;

  return regeneratorRuntime.async(function _callee81$(_context84) {
    while (1) {
      switch (_context84.prev = _context84.next) {
        case 0:
          console.log("Fecha emision: " + fechaEmision);
          _context84.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context84.sent;

          if (!(criterio === "otros")) {
            _context84.next = 12;
            break;
          }

          _context84.next = 7;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewDetallesServicio WHERE contratosId = " + contratoId + " and month(fechaEmision) = month('" + fechaEmision + "') and year(fechaEmision)= year('" + fechaEmision + "') and not tipo='Servicio fijo';"));

        case 7:
          _result12 = _context84.sent;
          console.log("resultado de buscar servicios: ", _result12);
          return _context84.abrupt("return", _result12);

        case 12:
          if (!(criterio === "fijos")) {
            _context84.next = 20;
            break;
          }

          _context84.next = 15;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewDetallesServicio WHERE contratosId = " + contratoId + " and month(fechaEmision) = month('" + fechaEmision + "') and year(fechaEmision)= year('" + fechaEmision + "') and  tipo='Servicio fijo';"));

        case 15:
          _result13 = _context84.sent;
          console.log("resultado de buscar servicios: ", _result13);
          return _context84.abrupt("return", _result13);

        case 20:
          _context84.next = 22;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewDetallesServicio WHERE contratosId = " + contratoId + " and month(fechaEmision) = month('" + fechaEmision + "') and year(fechaEmision)= year('" + fechaEmision + "');"));

        case 22:
          _result14 = _context84.sent;
          console.log("resultado de buscar servicios: ", _result14);
          return _context84.abrupt("return", _result14);

        case 25:
          console.log("fechaEmision recibida: ", fechaEmision, contratoId); // const result = await conn.query(
          //   "SELECT * FROM viewservicioscontratados WHERE id = " +
          //     contratoId +
          //     " and month(fechaEmision) = month('" +
          //     fechaEmision +
          //     "') and estado ='Activo';"
          // );

        case 26:
        case "end":
          return _context84.stop();
      }
    }
  });
});
ipcMain.handle("updateDetalle", function _callee82(event, id, detalle) {
  var conn, result;
  return regeneratorRuntime.async(function _callee82$(_context85) {
    while (1) {
      switch (_context85.prev = _context85.next) {
        case 0:
          _context85.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context85.sent;
          console.log("Actualizando detalle: " + id + detalle);
          _context85.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE detallesServicio set ? where id = ?", [detalle, id]));

        case 6:
          result = _context85.sent;
          console.log(result);
          return _context85.abrupt("return", result);

        case 9:
        case "end":
          return _context85.stop();
      }
    }
  });
});
ipcMain.handle("getDetallesByContratadoId", function _callee83(event, contratadoId) {
  var conn, result;
  return regeneratorRuntime.async(function _callee83$(_context86) {
    while (1) {
      switch (_context86.prev = _context86.next) {
        case 0:
          _context86.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context86.sent;
          _context86.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM detallesServicio WHERE detallesServicio.serviciosContratadosId=" + contratadoId + ";"));

        case 5:
          result = _context86.sent;
          console.log(result);
          return _context86.abrupt("return", result);

        case 8:
        case "end":
          return _context86.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funcion de cancelado
// ----------------------------------------------------------------

ipcMain.handle("cancelarServicios", function _callee85(event, planillaCancelarId, encabezadoCancelarId, serviciosCancelar) {
  var conn, _result15;

  return regeneratorRuntime.async(function _callee85$(_context88) {
    while (1) {
      switch (_context88.prev = _context88.next) {
        case 0:
          _context88.prev = 0;
          _context88.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context88.sent;
          console.log("Actualizando detalle: ", planillaCancelarId, encabezadoCancelarId, serviciosCancelar);
          serviciosCancelar.forEach(function _callee84(servicioCancelar) {
            var abono, saldo;
            return regeneratorRuntime.async(function _callee84$(_context87) {
              while (1) {
                switch (_context87.prev = _context87.next) {
                  case 0:
                    abono = 0;
                    saldo = 0;

                    if (servicioCancelar.abono !== null) {
                      abono = parseFloat(servicioCancelar.abono).toFixed(2);
                    }

                    if (servicioCancelar.saldo !== null) {
                      saldo = parseFloat(servicioCancelar.saldo).toFixed(2);
                    }

                    _context87.next = 6;
                    return regeneratorRuntime.awrap(conn.query("UPDATE detallesServicio set estado='Cancelado',abono=" + abono + ", saldo=" + saldo + " WHERE id = ? ;", servicioCancelar.id));

                  case 6:
                  case "end":
                    return _context87.stop();
                }
              }
            });
          });
          _context88.next = 8;
          return regeneratorRuntime.awrap(conn.query("UPDATE planillas set estado='Cancelado' WHERE id = ? ;", planillaCancelarId));

        case 8:
          _context88.next = 10;
          return regeneratorRuntime.awrap(conn.query("UPDATE encabezado set estado='Cancelado',fechaPago=Now() WHERE id = ? ;", encabezadoCancelarId));

        case 10:
          _result15 = _context88.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se ha cancelado la planilla."
          });
          console.log(_result15);
          return _context88.abrupt("return", _result15);

        case 16:
          _context88.prev = 16;
          _context88.t0 = _context88["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al cancelar la planilla."
          });
          console.log("Error al cancelar: ", _context88.t0);

        case 20:
        case "end":
          return _context88.stop();
      }
    }
  }, null, null, [[0, 16]]);
}); // ----------------------------------------------------------------
// Funcion que consulta las tarifas por el servicio de agua potable
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Funcion que carga los servicios de acuerdo al id de la planilla
// ----------------------------------------------------------------

ipcMain.handle("getTarifas", function _callee86() {
  var conn, result;
  return regeneratorRuntime.async(function _callee86$(_context89) {
    while (1) {
      switch (_context89.prev = _context89.next) {
        case 0:
          _context89.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context89.sent;
          _context89.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM tarifas;"));

        case 5:
          result = _context89.sent;
          console.log(result);
          return _context89.abrupt("return", result);

        case 8:
        case "end":
          return _context89.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funcion que carga las cuotas de acuerdo al id de la planilla

ipcMain.handle("getCuotasByPlanillaId", function _callee87(event, planillaId) {
  var conn, result;
  return regeneratorRuntime.async(function _callee87$(_context90) {
    while (1) {
      switch (_context90.prev = _context90.next) {
        case 0:
          _context90.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context90.sent;
          _context90.next = 5;
          return regeneratorRuntime.awrap(conn.query("select planillas.codigo,servicios.id," + "servicios.servicio,servicios.descripcion,servicios.fecha,servicios.valor,servicios.estado " + "from servicios join extrasplanilla on servicios.id=extrasplanilla.serviciosId " + "join planillas on planillas.id=extrasplanilla.planillasId " + "where servicios.tipo='cuota' and planillas.id=?;", planillaId));

        case 5:
          result = _context90.sent;
          console.log(result);
          return _context90.abrupt("return", result);

        case 8:
        case "end":
          return _context90.stop();
      }
    }
  });
}); // ----------------------------------------------------------------

ipcMain.handle("createCuota", function _callee88(event, cuota, planillaId) {
  var conn, _result16, idNuevoServicio, newExtrasPlanilla, result1;

  return regeneratorRuntime.async(function _callee88$(_context91) {
    while (1) {
      switch (_context91.prev = _context91.next) {
        case 0:
          _context91.prev = 0;
          _context91.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context91.sent;
          console.log("Cuota recibida: ", cuota);
          _context91.next = 7;
          return regeneratorRuntime.awrap(conn.query("Insert into servicios set ?", cuota));

        case 7:
          _result16 = _context91.sent;
          idNuevoServicio = _result16.insertId;
          console.log(_result16.insertId);
          newExtrasPlanilla = {
            serviciosId: idNuevoServicio,
            planillasId: planillaId,
            descuentosId: 3
          };
          _context91.next = 13;
          return regeneratorRuntime.awrap(conn.query("Insert into extrasplanilla set ?", newExtrasPlanilla));

        case 13:
          result1 = _context91.sent;
          console.log(result1);
          new Notification({
            title: "Electrom Mysql",
            body: "New servicio saved succesfully"
          }).show();
          servicio.id = _result16.insertId;
          return _context91.abrupt("return", servicio);

        case 20:
          _context91.prev = 20;
          _context91.t0 = _context91["catch"](0);
          console.log(_context91.t0);

        case 23:
        case "end":
          return _context91.stop();
      }
    }
  }, null, null, [[0, 20]]);
}); // Funcion que carga multas y descuentos de acuerdo al id de la planilla

ipcMain.handle("getMultasDescByPlanillaId", function _callee89(event, planillaId) {
  var conn, result;
  return regeneratorRuntime.async(function _callee89$(_context92) {
    while (1) {
      switch (_context92.prev = _context92.next) {
        case 0:
          _context92.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context92.sent;
          _context92.next = 5;
          return regeneratorRuntime.awrap(conn.query("select planillas.codigo,multasdescuentos.id,multasdescuentos.tipo," + "multasdescuentos.motivo,multasdescuentos.fecha,multasdescuentos.valor from " + "multasdescuentos join planillas on planillas.id=multasdescuentos.planillaId " + "where planillas.id=?;", planillaId));

        case 5:
          result = _context92.sent;
          console.log(result);
          return _context92.abrupt("return", result);

        case 8:
        case "end":
          return _context92.stop();
      }
    }
  });
}); // Funcion que edita los valores permitidos de la planilla

ipcMain.handle("updatePlanilla", function _callee90(event, id, planilla) {
  var conn, planillaCancelada, _result17;

  return regeneratorRuntime.async(function _callee90$(_context93) {
    while (1) {
      switch (_context93.prev = _context93.next) {
        case 0:
          _context93.prev = 0;
          _context93.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context93.sent;
          console.log("Actualizando planilla: " + planilla);
          _context93.next = 7;
          return regeneratorRuntime.awrap(conn.query("SELECT planillas.estado FROM planillas WHERE planillas.id= " + id + " ;"));

        case 7:
          planillaCancelada = _context93.sent;

          if (!(planillaCancelada[0] !== undefined)) {
            _context93.next = 21;
            break;
          }

          if (!(planillaCancelada[0].estado == "Cancelado")) {
            _context93.next = 13;
            break;
          }

          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Esta planilla ya ha sido cancelada, no puedes editar sus valores."
          });
          _context93.next = 19;
          break;

        case 13:
          _context93.next = 15;
          return regeneratorRuntime.awrap(conn.query("UPDATE planillas set ? where id = ?", [planilla, id]));

        case 15:
          _result17 = _context93.sent;
          console.log(_result17);
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se ha hactualizado la planilla."
          });
          return _context93.abrupt("return", _result17);

        case 19:
          _context93.next = 22;
          break;

        case 21:
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "No existe una planilla, actualiza la lista de planillas e intentalo de nuevo."
          });

        case 22:
          _context93.next = 27;
          break;

        case 24:
          _context93.prev = 24;
          _context93.t0 = _context93["catch"](0);
          console.log("Error al actualizar planilla:", _context93.t0);

        case 27:
        case "end":
          return _context93.stop();
      }
    }
  }, null, null, [[0, 24]]);
}); // ----------------------------------------------------------------
// Funciones de los parametros

ipcMain.handle("createParametro", function _callee91(event, parametro) {
  var conn, _result18;

  return regeneratorRuntime.async(function _callee91$(_context94) {
    while (1) {
      switch (_context94.prev = _context94.next) {
        case 0:
          _context94.prev = 0;
          _context94.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context94.sent;
          console.log("Recibido: ", parametro);
          parametro.valor = parseFloat(parametro.valor);
          _context94.next = 8;
          return regeneratorRuntime.awrap(conn.query("Insert into parametros set ?", parametro));

        case 8:
          _result18 = _context94.sent;
          console.log(_result18);
          new Notification({
            title: "Electrom Mysql",
            body: "New parametro saved succesfully"
          }).show();
          parametro.id = _result18.insertId;
          return _context94.abrupt("return", parametro);

        case 15:
          _context94.prev = 15;
          _context94.t0 = _context94["catch"](0);
          console.log(_context94.t0);

        case 18:
        case "end":
          return _context94.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
ipcMain.handle("getParametros", function _callee92() {
  var conn, results;
  return regeneratorRuntime.async(function _callee92$(_context95) {
    while (1) {
      switch (_context95.prev = _context95.next) {
        case 0:
          _context95.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context95.sent;
          results = conn.query("Select * from parametros order by id desc;");
          console.log(results);
          return _context95.abrupt("return", results);

        case 6:
        case "end":
          return _context95.stop();
      }
    }
  });
});
ipcMain.handle("getParametroById", function _callee93(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee93$(_context96) {
    while (1) {
      switch (_context96.prev = _context96.next) {
        case 0:
          _context96.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context96.sent;
          _context96.next = 5;
          return regeneratorRuntime.awrap(conn.query("Select * from parametros where id = ?", id));

        case 5:
          result = _context96.sent;
          console.log(result[0]);
          return _context96.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context96.stop();
      }
    }
  });
});
ipcMain.handle("updateParametro", function _callee94(event, id, parametro) {
  var conn, result;
  return regeneratorRuntime.async(function _callee94$(_context97) {
    while (1) {
      switch (_context97.prev = _context97.next) {
        case 0:
          _context97.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context97.sent;
          _context97.next = 5;
          return regeneratorRuntime.awrap(conn.query("UPDATE parametros set ? where id = ?", [parametro, id]));

        case 5:
          result = _context97.sent;
          console.log(result);
          return _context97.abrupt("return", result);

        case 8:
        case "end":
          return _context97.stop();
      }
    }
  });
});
ipcMain.handle("deleteParametro", function _callee95(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee95$(_context98) {
    while (1) {
      switch (_context98.prev = _context98.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context98.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context98.sent;
          _context98.next = 6;
          return regeneratorRuntime.awrap(conn.query("Delete from parametros where id = ?", id));

        case 6:
          result = _context98.sent;
          console.log(result);
          return _context98.abrupt("return", result);

        case 9:
        case "end":
          return _context98.stop();
      }
    }
  });
});

function formatearFecha(fecha) {
  var fechaOriginal = new Date(fecha);
  var year = fechaOriginal.getFullYear();
  var month = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
  var day = String(fechaOriginal.getDate()).padStart(2, "0");
  var fechaFormateada = "".concat(year, "-").concat(month, "-").concat(day);
  return fechaFormateada;
}

module.exports = {
  createWindow: createWindow
};