"use strict";

var _require = require("electron"),
    BrowserWindow = _require.BrowserWindow,
    Notification = _require.Notification,
    dialog = _require.dialog;

var Notifications = require("electron-notification-shim");

var _require2 = require("electron"),
    app = _require2.app,
    ipcMain = _require2.ipcMain;

var _require3 = require("./database"),
    getConnection = _require3.getConnection,
    cerrarConnection = _require3.cerrarConnection;

var path = require("path");

var url = require("url");

var _require4 = require("console"),
    error = _require4.error;

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
}); //Funciones de inicio de sesion

ipcMain.on("validarUsuarios", function _callee2(event, _ref) {
  var usuario, clave, conn, _usuarioPeticion;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          usuario = _ref.usuario, clave = _ref.clave;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(getConnection());

        case 4:
          conn = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(conn.query("SELECT usuario FROM usuarios WHERE usuario = ?", usuario, function (error, results) {
            if (error) {
              event.reply("loginResponse", {
                success: false,
                message: "Error en la consulta a la base de datos"
              });
            } else if (results.length > 0) {
              console.log("usuario en peticion ");
              conn.query("SELECT * from usuarios where usuario=? and clave=?", [usuario, clave], function (error, results) {
                if (error) {
                  event.sender.send("loginResponse", {
                    success: false,
                    message: "Error en la consulta a la base de datos"
                  });
                  var notification = new Notification({
                    title: "No se ha podido iniciar session!",
                    body: "Ocurrio un error al consultar en la base de datos, si el problema persiste solicite soporte tecnico",
                    icon: "/path/to/icon.png"
                  });
                  notification.show();
                } else if (results.length > 0) {
                  event.sender.send("loginResponse", {
                    success: true,
                    message: "Credenciales correctas"
                  });

                  var _notification = new Notification({
                    title: "Credenciales correctas!",
                    body: "Bienvenido usuario: " + usuario,
                    icon: "/path/to/icon.png"
                  });

                  _notification.show();
                } else {
                  event.sender.send("loginResponse", {
                    success: false,
                    message: "Credenciales incorrectas"
                  }); // event.sender.send(
                  //   "showAlert",
                  //   "¡Este es un mensaje de alerta!"
                  // );

                  var _notification2 = new Notification({
                    title: "Error de credenciales!",
                    body: "La contraseña es incorrecta",
                    icon: "/path/to/icon.png"
                  });

                  _notification2.show();
                }
              });
            } else {
              event.sender.send("loginResponse", {
                success: false,
                message: "No existe este usuario"
              });
              var notification = new Notification({
                title: "Error de credenciales!",
                body: "No hay un usuario registrado para " + usuario,
                icon: "/path/to/icon.png"
              });
              notification.show();
            }
          }));

        case 7:
          _usuarioPeticion = _context2.sent;
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](1);
          console.log("Error al iniciar session: ", _context2.t0);

        case 13:
          return _context2.abrupt("return", usuarioPeticion);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 10]]);
}); // ----------------------------------------------------------------
// Funciones para el cierre de sesion
// ----------------------------------------------------------------

ipcMain.on("cerrarSesion", function _callee3(event) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // await cerrarConnection();
          event.sender.send("sesionCerrada");

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funcion para el cierre de la aplicacion
// ----------------------------------------------------------------

ipcMain.on("salir", function _callee4(event) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          app.quit();

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // ipcMain.on("loginResponse", (event, response) => {
//   console.log("en uso login response");
//   // Envía la respuesta de inicio de sesión al proceso de renderizado
//   event.sender.send("loginResponse", response);
// });
// ----------------------------------------------------------------No funciono :(
// ipcMain.on("printPDF", (event, filePath) => {
//   console.log("llamando a la accion printPDF");
//   const printWindow = new BrowserWindow({ show: false });
//   printWindow.loadURL(`file://${filePath}`).catch(error=>console.log(error));
//   console.log(`file://${filePath}`);
//   try {
//   printWindow.webContents.on("did-finish-load", () => {
//     printWindow.webContents.print({ silent: true }, (success, errorType) => {
//       if (success) {
//         console.log("Success");
//         // Enviar confirmación al proceso de renderizado
//         event.sender.send(
//           "printPDFComplete",
//           "El PDF se ha enviado a la cola de impresión."
//         );
//       } else {
//         // Enviar error al proceso de renderizado
//         event.sender.send(
//           "printPDFComplete",
//           "Error al imprimir el PDF: " + errorType
//           );
//           console.log("Error: ", errorType);
//       }
//       console.log("Exit");
//       printWindow.close();
//     });
//   });
// } catch (error) {
//     console.log('Error: ',error);
// }
// });
// ----------------------------------------------------------------
// Al utilizar ipcMain.handle
// en lugar de ipcMain.on, estás creando una
// función que devuelve un valor y que puede
// ser invocada desde el proceso de representación
// mediante ipcRenderer.invoke.

ipcMain.handle("createProduct", function _callee5(event, product) {
  var conn, _result;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context5.sent;
          console.log("Recibido: ", product);
          product.price = parseFloat(product.price);
          _context5.next = 8;
          return regeneratorRuntime.awrap(conn.query("Insert into producto set ?", product));

        case 8:
          _result = _context5.sent;
          console.log(_result);
          new Notification({
            title: "Electrom Mysql",
            body: "New product saved succesfully"
          }).show();
          product.id = _result.insertId;
          return _context5.abrupt("return", product);

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
ipcMain.handle("getProducts", function _callee6() {
  var conn, results;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context6.sent;
          results = conn.query("Select * from producto order by id desc;");
          console.log(results);
          return _context6.abrupt("return", results);

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
});
ipcMain.handle("getProductById", function _callee7(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context7.sent;
          _context7.next = 5;
          return regeneratorRuntime.awrap(conn.query("Select * from producto where id = ?", id));

        case 5:
          result = _context7.sent;
          console.log(result[0]);
          return _context7.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context7.stop();
      }
    }
  });
});
ipcMain.handle("updateProduct", function _callee8(event, id, product) {
  var conn, result;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context8.sent;
          _context8.next = 5;
          return regeneratorRuntime.awrap(conn.query("UPDATE producto set ? where id = ?", [product, id]));

        case 5:
          result = _context8.sent;
          console.log(result);
          return _context8.abrupt("return", result);

        case 8:
        case "end":
          return _context8.stop();
      }
    }
  });
});
ipcMain.handle("deleteProduct", function _callee9(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context9.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context9.sent;
          _context9.next = 6;
          return regeneratorRuntime.awrap(conn.query("Delete from producto where id = ?", id));

        case 6:
          result = _context9.sent;
          console.log(result);
          return _context9.abrupt("return", result);

        case 9:
        case "end":
          return _context9.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// ipcMain.handle("print", () => {
//   console.log("Llego la orden de imprimir");
//   // Generar el documento para imprimir
//   // window.webContents.on("dom-ready", () => {
//   window.webContents.printToPDF({}, (error, data) => {
//     console.log("Entro la orden de imprimir");
//     if (error) throw error;
//     const filePath = path.join(app.getPath("documents"), "documento.pdf");
//     fs.writeFile(filePath, data, (err) => {
//       if (err) throw err;
//       console.log("Documento generado y guardado en: " + filePath);
//     });
//     // });
//   });
// });
// ----------------------------------------------------------------
// ipcMain.on('abrirUsuarios', () => {
//     const newWindow = new BrowserWindow({
//       width: 800,
//       height: 600,
//       webPreferences: {
//         nodeIntegration: true,
//         contextIsolation: false,
//       }
//     });
//     newWindow.loadFile('src/ui/index.html');
//   });

var window;

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
  ipcMain.on("datos-a-servicios", function _callee10(event, servicio) {
    return regeneratorRuntime.async(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            console.log("Datos a enviar: " + servicio.id);
            servicioEnviar = servicio; // pagina2Window = new BrowserWindow({ show: false });

            _context10.next = 4;
            return regeneratorRuntime.awrap(window.loadFile("src/ui/servicios.html"));

          case 4:
            _context10.next = 6;
            return regeneratorRuntime.awrap(window.show());

          case 6:
            _context10.next = 8;
            return regeneratorRuntime.awrap(window.webContents.send("datos-a-servicios"));

          case 8:
          case "end":
            return _context10.stop();
        }
      }
    });
  });
  ipcMain.on("datos-a-ocacionales", function _callee11(event, servicio) {
    return regeneratorRuntime.async(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            console.log("Datos a enviar: " + servicio.id);
            servicioEnviar = servicio; // pagina2Window = new BrowserWindow({ show: false });

            _context11.next = 4;
            return regeneratorRuntime.awrap(window.loadFile("src/ui/cuotas.html"));

          case 4:
            _context11.next = 6;
            return regeneratorRuntime.awrap(window.show());

          case 6:
            _context11.next = 8;
            return regeneratorRuntime.awrap(window.webContents.send("datos-a-ocacionales"));

          case 8:
          case "end":
            return _context11.stop();
        }
      }
    });
  }); // ipcMain.on("datos-a-servicios", async (event, servicio) => {
  //   console.log("Datos a enviar: " + servicio.id);
  //   // Cargar la página primero
  //   window.loadFile("src/ui/servicios.html");
  //   // Esperar a que la página se cargue completamente
  //   window.webContents.once("did-finish-load", async () => {
  //     // Enviar los datos a la página cargada
  //     console.log(":) " + servicio.id);
  //     window.webContents.send("datos-a-servicios", servicio);
  //     window.show();
  //     // Mostrar la ventana después de enviar los datos
  //   });
  // });

  window.loadFile("src/ui/principal.html");
}

ipcMain.on("abrirInterface", function (event, interfaceName) {
  try {
    console.log("interface name desde main", interfaceName);
    window.loadFile(interfaceName);
  } catch (err) {
    console.log("Error de window" + err);
  }
}); // ----------------------------------------------------------------
// Funciones de las facturas
// ----------------------------------------------------------------
// Define una función para abrir pagina2
// ipcMain.on("abrir-pagina2", () => {
//   // pagina2Window = new BrowserWindow({ show: false });
//   window.loadFile("src/ui/factura.html");
//   window.show();
// });F
// Define una función para enviar datos a pagina2

ipcMain.on("datos-a-pagina2", function _callee12(event, datos, encabezado, serviciosFijos, otrosServicios, datosAgua, datosTotales, editados) {
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          console.log("Datos a enviar: " + datos.mensaje); // pagina2Window = new BrowserWindow({ show: false });

          _context12.next = 3;
          return regeneratorRuntime.awrap(window.loadFile("src/ui/factura.html"));

        case 3:
          _context12.next = 5;
          return regeneratorRuntime.awrap(window.show());

        case 5:
          _context12.next = 7;
          return regeneratorRuntime.awrap(window.webContents.send("datos-a-pagina2", datos, encabezado, serviciosFijos, otrosServicios, datosAgua, datosTotales, editados));

        case 7:
        case "end":
          return _context12.stop();
      }
    }
  });
});
ipcMain.on("datos-a-pagina3", function _callee13(event, datos, encabezado, recaudaciones, datosTotales) {
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          console.log("Datos a enviar: " + datos.mensaje); // pagina2Window = new BrowserWindow({ show: false });

          _context13.next = 3;
          return regeneratorRuntime.awrap(window.loadFile("src/ui/consolidado.html"));

        case 3:
          _context13.next = 5;
          return regeneratorRuntime.awrap(window.show());

        case 5:
          _context13.next = 7;
          return regeneratorRuntime.awrap(window.webContents.send("datos-a-pagina3", datos, encabezado, recaudaciones, datosTotales));

        case 7:
        case "end":
          return _context13.stop();
      }
    }
  });
}); // Recibe la peticion de la pagina de planillas para
// enviar a la pagina de servicios.
// ipcMain.on("datos-a-servicios", async (event, servicio) => {
//   console.log("Datos a enviar: " + servicio.id);
//   servicioEnviar = servicio;
//   window.loadFile("src/ui/servicios.html");
//   await window.webContents.send("datos-a-servicios", servicioEnviar);
//   window.show();
// });
// ----------------------------------------------------------------
// Funciones de los cargos
// ----------------------------------------------------------------

ipcMain.handle("pido-datos", function _callee14() {
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          return _context14.abrupt("return", servicioEnviar);

        case 1:
        case "end":
          return _context14.stop();
      }
    }
  });
});
ipcMain.handle("getCargos", function _callee15() {
  var conn, results;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context15.sent;
          results = conn.query("SELECT * FROM cargosempleados");
          console.log(results);
          return _context15.abrupt("return", results);

        case 6:
        case "end":
          return _context15.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funciones de los accesos
// ----------------------------------------------------------------

ipcMain.handle("getAccesos", function _callee16() {
  var conn, results;
  return regeneratorRuntime.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context16.sent;
          results = conn.query("SELECT * FROM roles");
          console.log(results);
          return _context16.abrupt("return", results);

        case 6:
        case "end":
          return _context16.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funciones de los usuarios
// ----------------------------------------------------------------

ipcMain.handle("getUsuarios", function _callee17(event, criterio, criterioContent) {
  var conn, results, _results;

  return regeneratorRuntime.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context17.sent;
          _context17.prev = 3;

          if (!(criterio === "all")) {
            _context17.next = 10;
            break;
          }

          results = conn.query("SELECT * FROM viewUsuarios");
          console.log(results);
          return _context17.abrupt("return", results);

        case 10:
          _results = conn.query("SELECT * FROM viewUsuarios WHERE " + criterio + " like '%" + criterioContent + "%';");
          console.log(_results);
          return _context17.abrupt("return", _results);

        case 13:
          _context17.next = 18;
          break;

        case 15:
          _context17.prev = 15;
          _context17.t0 = _context17["catch"](3);
          console.log(_context17.t0);

        case 18:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[3, 15]]);
}); // ----------------------------------------------------------------
// Obtenemos los datos de los empleados que no son usuarios del sistema
// ----------------------------------------------------------------

ipcMain.handle("getEmpleados", function _callee18(event, criterio, criterioContent) {
  var conn, results, _results2;

  return regeneratorRuntime.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context18.sent;
          _context18.prev = 3;

          if (!(criterio === "all")) {
            _context18.next = 10;
            break;
          }

          results = conn.query("SELECT * FROM viewEmpleados;");
          console.log(results);
          return _context18.abrupt("return", results);

        case 10:
          _results2 = conn.query("SELECT * FROM viewEmpleados WHERE " + criterio + " like '%" + criterioContent + "%';");
          console.log(_results2);
          return _context18.abrupt("return", _results2);

        case 13:
          _context18.next = 18;
          break;

        case 15:
          _context18.prev = 15;
          _context18.t0 = _context18["catch"](3);
          console.log(_context18.t0);

        case 18:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[3, 15]]);
});
ipcMain.handle("createUsuario", function _callee19(event, empleado, usuario) {
  var conn, resultEmpleado, resultUsuario;
  return regeneratorRuntime.async(function _callee19$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          _context19.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context19.sent;
          console.log("Recibido: ", usuario); //   product.price = parseFloat(product.price);
          // const resultCargo = await conn.query(
          //   "Insert into cargosempleados set ? ;",
          //   cargo
          // );
          //empleado.cargosId = resultCargo.insertId;

          _context19.next = 7;
          return regeneratorRuntime.awrap(conn.query("Insert into empleados set ? ;", empleado));

        case 7:
          resultEmpleado = _context19.sent;
          usuario.empleadosId = resultEmpleado.insertId;
          _context19.next = 11;
          return regeneratorRuntime.awrap(conn.query("Insert into usuarios set ?", usuario));

        case 11:
          resultUsuario = _context19.sent;
          console.log(resultUsuario);
          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Se ha guardado el nuevo registro."
          });
          usuario.id = resultUsuario.insertId;
          return _context19.abrupt("return", usuario);

        case 18:
          _context19.prev = 18;
          _context19.t0 = _context19["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al guardar el registro."
          });
          console.log(_context19.t0);

        case 22:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
ipcMain.handle("createEmpleado", function _callee20(event, empleado) {
  var conn, resultEmpleado;
  return regeneratorRuntime.async(function _callee20$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          _context20.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context20.sent;
          console.log("Recibido: ", empleado); // const resultCargo = await conn.query(
          //   "Insert into cargosempleados set ? ;",
          //   cargo
          // );
          // console.log("Se inserto el cargo" + resultCargo.insertId);
          //empleado.cargosId = resultCargo.insertId;

          _context20.next = 7;
          return regeneratorRuntime.awrap(conn.query("Insert into empleados set ? ;", empleado));

        case 7:
          resultEmpleado = _context20.sent;
          console.log(resultEmpleado);
          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Se ha guardado el nuevo registro."
          });
          empleado.id = resultEmpleado.insertId;
          return _context20.abrupt("return", empleado);

        case 14:
          _context20.prev = 14;
          _context20.t0 = _context20["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al guardar el registro."
          });
          console.error("Ha ocurrido un error: ", _context20.t0);

        case 18:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[0, 14]]);
}); // ----------------------------------------------------------------
// Obtenemos los datos del empleado usuario del sistema
// ----------------------------------------------------------------

ipcMain.handle("getUsuarioById", function _callee21(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee21$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context21.sent;
          result = conn.query("select empleados.id,empleados.cedula," + "empleados.primerNombre,empleados.segundoNombre,empleados.primerApellido," + "empleados.segundoApellido,empleados.telefono,empleados.correo," + "cargosempleados.id as cargosId,cargosempleados.cargo," + "cargosempleados.cargoDescripcion," + " usuarios.id as usuariosId,roles.id as rolesId,roles.rol,roles.rolDescripcion," + " usuarios.usuario,usuarios.clave,usuarios.fechaModificacion " + "from empleados join usuarios on empleados.id=usuarios.empleadosId join " + "cargosempleados on cargosempleados.id=empleados.cargosId " + "join roles on roles.id=usuarios.rolesId where empleados.id=?;", id);
          console.log(result);
          return _context21.abrupt("return", result);

        case 6:
        case "end":
          return _context21.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Obtenemos los datos del empleado no usuario del sistema
// ----------------------------------------------------------------

ipcMain.handle("getEmpleadoById", function _callee22(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee22$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          _context22.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context22.sent;
          result = conn.query("select empleados.id,empleados.cedula," + "empleados.primerNombre,empleados.segundoNombre,empleados.primerApellido," + "empleados.segundoApellido,empleados.telefono,empleados.correo," + "cargosempleados.id as cargosId,cargosempleados.cargo," + "cargosempleados.cargoDescripcion " + "from empleados join " + "cargosempleados on cargosempleados.id=empleados.cargosId where empleados.id=? ;", id);
          console.log(result);
          return _context22.abrupt("return", result);

        case 6:
        case "end":
          return _context22.stop();
      }
    }
  });
});
ipcMain.handle("updateUsuario", function _callee23(event, id, empleado, usuario) {
  var conn, resultEmpleado, usuarioExist, resultUsuario, _resultUsuario;

  return regeneratorRuntime.async(function _callee23$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context23.sent;
          _context23.prev = 3;
          _context23.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE empleados set ? where id = ?", [empleado, id]));

        case 6:
          resultEmpleado = _context23.sent;
          console.log(resultEmpleado);

          if (!(usuario.usuario !== null && usuario.usuario !== " " && usuario.clave !== null && usuario.clave !== " " && usuario.rol !== null && usuario.rol !== " " && usuario.rolDescripcion !== null && usuario.rolDescripcion !== " ")) {
            _context23.next = 25;
            break;
          }

          _context23.next = 11;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM usuarios WHERE usuarios.empleadosId=? order by usuarios.id desc limit 1;", id));

        case 11:
          usuarioExist = _context23.sent;

          if (!(usuarioExist.length > 0 && usuarioExist[0].id !== null)) {
            _context23.next = 20;
            break;
          }

          console.log("existe el usuario: " + usuarioExist[0].id);
          _context23.next = 16;
          return regeneratorRuntime.awrap(conn.query("UPDATE usuarios set ? where empleadosId = ?;", [usuario, id]));

        case 16:
          resultUsuario = _context23.sent;
          console.log("Se actualizó el usuario", resultUsuario);
          _context23.next = 25;
          break;

        case 20:
          usuario.empleadosId = id;
          _context23.next = 23;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO usuarios SET ?", usuario));

        case 23:
          _resultUsuario = _context23.sent;
          console.log("Se creó el usuario", _resultUsuario);

        case 25:
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se ha actualizado el registro."
          });
          _context23.next = 31;
          break;

        case 28:
          _context23.prev = 28;
          _context23.t0 = _context23["catch"](3);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al actualizar el registro."
          });

        case 31:
        case "end":
          return _context23.stop();
      }
    }
  }, null, null, [[3, 28]]);
}); // ----------------------------------------------------------------
// ----------------------------------------------------------------

ipcMain.handle("updateEmpleado", function _callee24(event, id, empleado) {
  var conn, resultEmpleado, usuarioExist;
  return regeneratorRuntime.async(function _callee24$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          _context24.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context24.sent;
          resultEmpleado = null;
          _context24.prev = 4;
          _context24.next = 7;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM usuarios WHERE usuarios.empleadosId=? order by usuarios.id desc limit 1;", id));

        case 7:
          usuarioExist = _context24.sent;

          if (!(usuarioExist.length > 0 && usuarioExist[0].id !== null)) {
            _context24.next = 17;
            break;
          }

          console.log("existe el usuario: " + usuarioExist[0].id);
          empleado.usuariosn = "Si";
          _context24.next = 13;
          return regeneratorRuntime.awrap(conn.query("UPDATE empleados set ? where id = ?", [empleado, id]));

        case 13:
          resultEmpleado = _context24.sent;
          console.log(resultEmpleado);
          _context24.next = 22;
          break;

        case 17:
          empleado.usuariosn = "No";
          _context24.next = 20;
          return regeneratorRuntime.awrap(conn.query("UPDATE empleados set ? where id = ?", [empleado, id]));

        case 20:
          resultEmpleado = _context24.sent;
          console.log(resultEmpleado);

        case 22:
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se ha actualizado el registro."
          });
          return _context24.abrupt("return", resultEmpleado);

        case 26:
          _context24.prev = 26;
          _context24.t0 = _context24["catch"](4);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al actualizar el registro."
          });
          console.log(_context24.t0);

        case 30:
        case "end":
          return _context24.stop();
      }
    }
  }, null, null, [[4, 26]]);
}); // ----------------------------------------------------------------
// Eliminar un usuario del sistema
// ----------------------------------------------------------------

ipcMain.handle("deleteUsuario", function _callee25(event, id) {
  var conn, resultUsuario, resultEmpleado;
  return regeneratorRuntime.async(function _callee25$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context25.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context25.sent;
          _context25.prev = 4;
          _context25.next = 7;
          return regeneratorRuntime.awrap(conn.query("DELETE FROM usuarios WHERE  empleadosId=?", id));

        case 7:
          resultUsuario = _context25.sent;
          _context25.next = 10;
          return regeneratorRuntime.awrap(conn.query("UPDATE empleados SET usuariosn='No' WHERE id =?;", id));

        case 10:
          resultEmpleado = _context25.sent;
          console.log(resultEmpleado);
          event.sender.send("Notificar", {
            success: true,
            title: "Usuario eliminado!",
            message: "Se ha actualizado el registro."
          });
          return _context25.abrupt("return", resultEmpleado);

        case 16:
          _context25.prev = 16;
          _context25.t0 = _context25["catch"](4);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al actualizar el registro."
          });
          console.log(_context25.t0);

        case 20:
        case "end":
          return _context25.stop();
      }
    }
  }, null, null, [[4, 16]]);
}); // ----------------------------------------------------------------
// Eliminar un empleado
// ----------------------------------------------------------------

ipcMain.handle("deleteEmpleado", function _callee26(event, id) {
  var conn, resultEmpleado;
  return regeneratorRuntime.async(function _callee26$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context26.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context26.sent;
          _context26.prev = 4;
          _context26.next = 7;
          return regeneratorRuntime.awrap(conn.query("DELETE FROM empleados WHERE id =?;", id));

        case 7:
          resultEmpleado = _context26.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Borrado!",
            message: "Se ha eliminado el usuario."
          });
          console.log(resultEmpleado);
          return _context26.abrupt("return", resultEmpleado);

        case 13:
          _context26.prev = 13;
          _context26.t0 = _context26["catch"](4);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al elimiar el registro."
          });

        case 16:
        case "end":
          return _context26.stop();
      }
    }
  }, null, null, [[4, 13]]);
}); // Funciones de los socios

ipcMain.handle("getSocios", function _callee27(event, criterio, criterioContent) {
  var conn, results, _results3;

  return regeneratorRuntime.async(function _callee27$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          _context27.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context27.sent;
          _context27.prev = 3;

          if (!(criterio === "all" || criterio === undefined)) {
            _context27.next = 10;
            break;
          }

          results = conn.query("SELECT * FROM viewSocios order by primerApellido;");
          console.log(results);
          return _context27.abrupt("return", results);

        case 10:
          _results3 = conn.query("SELECT * FROM viewSocios where " + criterio + " like '%" + criterioContent + "%';");
          console.log(_results3);
          return _context27.abrupt("return", _results3);

        case 13:
          _context27.next = 18;
          break;

        case 15:
          _context27.prev = 15;
          _context27.t0 = _context27["catch"](3);
          console.log(_context27.t0);

        case 18:
        case "end":
          return _context27.stop();
      }
    }
  }, null, null, [[3, 15]]);
});
ipcMain.handle("createSocio", function _callee28(event, socio) {
  var conn, _result2;

  return regeneratorRuntime.async(function _callee28$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          _context28.prev = 0;
          _context28.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context28.sent;
          console.log("Recibido: ", socio);
          _context28.next = 7;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO socios SET ?", socio));

        case 7:
          _result2 = _context28.sent;
          console.log(_result2); // new Notification({
          //   title: "Regístro guardado",
          //   body: "Se registró al nuevo socio con exito!",
          // }).show();serviserviciosId

          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Se ha guardado el registro."
          });
          socio.id = _result2.insertId;
          return _context28.abrupt("return", socio);

        case 14:
          _context28.prev = 14;
          _context28.t0 = _context28["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al guardar el registro."
          });
          console.log(_context28.t0);

        case 18:
        case "end":
          return _context28.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
ipcMain.handle("getSocioById", function _callee29(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee29$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          _context29.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context29.sent;
          _context29.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM socios WHERE id = ?", id));

        case 5:
          result = _context29.sent;
          console.log(result[0]);
          return _context29.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context29.stop();
      }
    }
  });
});
ipcMain.handle("getContratanteByCedula", function _callee30(event, cedula) {
  var conn, result;
  return regeneratorRuntime.async(function _callee30$(_context30) {
    while (1) {
      switch (_context30.prev = _context30.next) {
        case 0:
          _context30.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context30.sent;
          _context30.next = 5;
          return regeneratorRuntime.awrap(conn.query("Select * from socios where socios.cedulaPasaporte = ?", cedula));

        case 5:
          result = _context30.sent;
          console.log(result[0]);
          return _context30.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context30.stop();
      }
    }
  });
});
ipcMain.handle("updateSocio", function _callee31(event, id, socio) {
  var conn, _result3;

  return regeneratorRuntime.async(function _callee31$(_context31) {
    while (1) {
      switch (_context31.prev = _context31.next) {
        case 0:
          _context31.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context31.sent;
          _context31.prev = 3;
          _context31.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE socios SET ? WHERE id = ?", [socio, id]));

        case 6:
          _result3 = _context31.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se ha actualizado el registro."
          });
          console.log(_result3);
          return _context31.abrupt("return", _result3);

        case 12:
          _context31.prev = 12;
          _context31.t0 = _context31["catch"](3);
          console.log(_context31.t0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al actualizar el registro."
          });

        case 16:
        case "end":
          return _context31.stop();
      }
    }
  }, null, null, [[3, 12]]);
});
ipcMain.handle("deleteSocio", function _callee32(event, id) {
  var conn, _result4;

  return regeneratorRuntime.async(function _callee32$(_context32) {
    while (1) {
      switch (_context32.prev = _context32.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context32.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context32.sent;
          _context32.prev = 4;
          _context32.next = 7;
          return regeneratorRuntime.awrap(conn.query("DELETE FROM socios WHERE id = ?", id));

        case 7:
          _result4 = _context32.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Borrado!",
            message: "Se ha eliminado el usuario."
          });
          console.log(_result4);
          return _context32.abrupt("return", _result4);

        case 13:
          _context32.prev = 13;
          _context32.t0 = _context32["catch"](4);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al elimiar el registro."
          });
          console.log(_context32.t0);

        case 17:
        case "end":
          return _context32.stop();
      }
    }
  }, null, null, [[4, 13]]);
}); // ----------------------------------------------------------------
// Funciones de los implementos
// Esta tabla esta relacionada de uno a muchos con inventario
// ----------------------------------------------------------------

ipcMain.handle("getImplementos", function _callee33() {
  var conn, results;
  return regeneratorRuntime.async(function _callee33$(_context33) {
    while (1) {
      switch (_context33.prev = _context33.next) {
        case 0:
          _context33.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context33.sent;
          results = conn.query("SELECT * FROM viewimplementosinvenatrio order by implementosId desc;");
          console.log(results);
          return _context33.abrupt("return", results);

        case 6:
        case "end":
          return _context33.stop();
      }
    }
  });
});
ipcMain.handle("createImplemento", function _callee34(event, implemento, inventario) {
  var conn, resultImplemento, resulInventario;
  return regeneratorRuntime.async(function _callee34$(_context34) {
    while (1) {
      switch (_context34.prev = _context34.next) {
        case 0:
          _context34.prev = 0;
          _context34.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context34.sent;
          console.log("Recibido: ", implemento, inventario); //   product.price = parseFloat(product.price);

          _context34.next = 7;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO implementos set ?;", implemento));

        case 7:
          resultImplemento = _context34.sent;
          inventario.implementosId = resultImplemento.insertId;
          _context34.next = 11;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO inventario set ?;", inventario));

        case 11:
          resulInventario = _context34.sent;
          console.log(resultImplemento, resulInventario);
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: implemento.nombre + " se há registrado :)"
          }).show();
          implemento.id = result.insertId;
          return _context34.abrupt("return", resulInventario);

        case 18:
          _context34.prev = 18;
          _context34.t0 = _context34["catch"](0);
          console.log(_context34.t0);

        case 21:
        case "end":
          return _context34.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
ipcMain.handle("getImplementoById", function _callee35(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee35$(_context35) {
    while (1) {
      switch (_context35.prev = _context35.next) {
        case 0:
          _context35.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context35.sent;
          _context35.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewimplementosinvenatrio where implementosId = ?", id));

        case 5:
          result = _context35.sent;
          console.log("Resultado", result[0]);
          return _context35.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context35.stop();
      }
    }
  });
});
ipcMain.handle("updateImplemento", function _callee36(event, id, implemento, inventario) {
  var conn, resultImplemento, resultInventario;
  return regeneratorRuntime.async(function _callee36$(_context36) {
    while (1) {
      switch (_context36.prev = _context36.next) {
        case 0:
          _context36.prev = 0;
          _context36.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context36.sent;
          _context36.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE implementos SET ? where id = ?", [implemento, id]));

        case 6:
          resultImplemento = _context36.sent;
          _context36.next = 9;
          return regeneratorRuntime.awrap(conn.query("UPDATE inventario SET ? where implementosId = ?", [inventario, id]));

        case 9:
          resultInventario = _context36.sent;
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: implemento.nombre + " se ha actualizado :)"
          }).show();
          console.log(resultInventario, resultImplemento);
          return _context36.abrupt("return", resultImplemento);

        case 15:
          _context36.prev = 15;
          _context36.t0 = _context36["catch"](0);
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "Ha ocurrido un error en la actualización :("
          }).show();
          console.log(_context36.t0);

        case 19:
        case "end":
          return _context36.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
ipcMain.handle("deleteImplemento", function _callee37(event, id) {
  var conn, resultInventario, resultImplemento;
  return regeneratorRuntime.async(function _callee37$(_context37) {
    while (1) {
      switch (_context37.prev = _context37.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context37.prev = 1;
          _context37.next = 4;
          return regeneratorRuntime.awrap(getConnection());

        case 4:
          conn = _context37.sent;
          _context37.next = 7;
          return regeneratorRuntime.awrap(conn.query("DELETE FROM inventario WHERE implementosId = ?", id));

        case 7:
          resultInventario = _context37.sent;
          _context37.next = 10;
          return regeneratorRuntime.awrap(conn.query("DELETE from implementos where id = ?", id));

        case 10:
          resultImplemento = _context37.sent;
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "Se há eliminado el registro :)"
          }).show();
          console.log(resultInventario, resultImplemento);
          return _context37.abrupt("return", resultInventario);

        case 16:
          _context37.prev = 16;
          _context37.t0 = _context37["catch"](1);
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "Ha ocurrido un error al eliminar el registro :("
          }).show();
          console.log(_context37.t0);

        case 20:
        case "end":
          return _context37.stop();
      }
    }
  }, null, null, [[1, 16]]);
}); // ----------------------------------------------------------------
// Funciones de los servicios fijos
// ----------------------------------------------------------------

ipcMain.handle("getServiciosFijos", function _callee38(event, criterio, criterioContent) {
  var conn, results, _results4;

  return regeneratorRuntime.async(function _callee38$(_context38) {
    while (1) {
      switch (_context38.prev = _context38.next) {
        case 0:
          _context38.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context38.sent;
          _context38.prev = 3;

          if (!(criterio === "all")) {
            _context38.next = 10;
            break;
          }

          results = conn.query("SELECT * FROM viewServicios where tipo='Servicio fijo'order by id asc;");
          console.log(results);
          return _context38.abrupt("return", results);

        case 10:
          _results4 = conn.query("SELECT * FROM viewServicios where " + criterio + " like '%" + criterioContent + "%'" + " and tipo='Servicio fijo'order by id asc;");
          console.log(_results4);
          return _context38.abrupt("return", _results4);

        case 13:
          _context38.next = 18;
          break;

        case 15:
          _context38.prev = 15;
          _context38.t0 = _context38["catch"](3);
          console.log(_context38.t0);

        case 18:
        case "end":
          return _context38.stop();
      }
    }
  }, null, null, [[3, 15]]);
});
ipcMain.handle("createServiciosFijos", function _callee39(event, servicio) {
  var conn, resultServicio;
  return regeneratorRuntime.async(function _callee39$(_context39) {
    while (1) {
      switch (_context39.prev = _context39.next) {
        case 0:
          _context39.prev = 0;
          _context39.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context39.sent;
          console.log("Recibido: ", servicio);
          _context39.next = 7;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO servicios set ?;", servicio));

        case 7:
          resultServicio = _context39.sent;
          servicio.id = resultServicio.insertId;
          console.log(resultServicio);
          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Se ha guardado un nuevo servicio fijo."
          });
          return _context39.abrupt("return", resultServicio);

        case 14:
          _context39.prev = 14;
          _context39.t0 = _context39["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al guardar el servicio."
          });
          console.log(_context39.t0);

        case 18:
        case "end":
          return _context39.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
ipcMain.handle("getServiciosFijosById", function _callee40(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee40$(_context40) {
    while (1) {
      switch (_context40.prev = _context40.next) {
        case 0:
          _context40.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context40.sent;
          _context40.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewServicios where id = ?", id));

        case 5:
          result = _context40.sent;
          console.log("Resultado", result[0]);
          return _context40.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context40.stop();
      }
    }
  });
}); // ipcMain.handle("getServiciosContratados", async (event) => {
//   const conn = await getConnection();
//   const result = await conn.query("SELECT * FROM viewServiciosFijos");
//   console.log("Resultado", result);
//   return result;
// });

ipcMain.handle("getServiciosDisponibles", function _callee41(event) {
  var conn, result;
  return regeneratorRuntime.async(function _callee41$(_context41) {
    while (1) {
      switch (_context41.prev = _context41.next) {
        case 0:
          _context41.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context41.sent;
          _context41.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewServicios where tipo='Servicio fijo';"));

        case 5:
          result = _context41.sent;
          console.log("Resultado", result);
          return _context41.abrupt("return", result);

        case 8:
        case "end":
          return _context41.stop();
      }
    }
  });
});
ipcMain.handle("updateServiciosFijos", function _callee42(event, id, servicio) {
  var conn, resultServicio;
  return regeneratorRuntime.async(function _callee42$(_context42) {
    while (1) {
      switch (_context42.prev = _context42.next) {
        case 0:
          _context42.prev = 0;
          _context42.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context42.sent;
          _context42.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE servicios SET ? where id = ?", [servicio, id]));

        case 6:
          resultServicio = _context42.sent;
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: servicio.nombre + " se ha actualizado :)"
          }).show();
          console.log(resultServicio);
          return _context42.abrupt("return", resultServicio);

        case 12:
          _context42.prev = 12;
          _context42.t0 = _context42["catch"](0);
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "Ha ocurrido un error en la actualización :("
          }).show();
          console.log(_context42.t0);

        case 16:
        case "end":
          return _context42.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
ipcMain.handle("deleteServiciosFijos", function _callee43(event, id) {
  var conn, resultServicio;
  return regeneratorRuntime.async(function _callee43$(_context43) {
    while (1) {
      switch (_context43.prev = _context43.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context43.prev = 1;
          _context43.next = 4;
          return regeneratorRuntime.awrap(getConnection());

        case 4:
          conn = _context43.sent;
          _context43.next = 7;
          return regeneratorRuntime.awrap(conn.query("DELETE FROM servicios WHERE id = ?", id));

        case 7:
          resultServicio = _context43.sent;
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "Se há eliminado el registro :)"
          }).show();
          console.log(resultServicio);
          return _context43.abrupt("return", resultServicio);

        case 13:
          _context43.prev = 13;
          _context43.t0 = _context43["catch"](1);
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "Ha ocurrido un error al eliminar el registro :("
          }).show();
          console.log(_context43.t0);

        case 17:
        case "end":
          return _context43.stop();
      }
    }
  }, null, null, [[1, 13]]);
});
ipcMain.handle("getServiciosContratadosById", function _callee44(event, id) {
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
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewServiciosContratados where id =" + id + " and tipo='Servicio fijo' and estado='Activo';"));

        case 5:
          result = _context44.sent;
          console.log("Resultado", result);
          return _context44.abrupt("return", result);

        case 8:
        case "end":
          return _context44.stop();
      }
    }
  });
});
ipcMain.handle("getContratos", function _callee45(event, criterio, criterioContent) {
  var conn, _result5, _result6;

  return regeneratorRuntime.async(function _callee45$(_context45) {
    while (1) {
      switch (_context45.prev = _context45.next) {
        case 0:
          _context45.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context45.sent;
          _context45.prev = 3;

          if (!(criterio === "all" || criterio === undefined)) {
            _context45.next = 12;
            break;
          }

          _context45.next = 7;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewContratos ;"));

        case 7:
          _result5 = _context45.sent;
          console.log("Resultado: ", _result5);
          return _context45.abrupt("return", _result5);

        case 12:
          _context45.next = 14;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewContratos  WHERE " + criterio + " like '%" + criterioContent + "%';"));

        case 14:
          _result6 = _context45.sent;
          console.log("Resultado: ", _result6);
          return _context45.abrupt("return", _result6);

        case 17:
          _context45.next = 22;
          break;

        case 19:
          _context45.prev = 19;
          _context45.t0 = _context45["catch"](3);
          console.log(_context45.t0);

        case 22:
        case "end":
          return _context45.stop();
      }
    }
  }, null, null, [[3, 19]]);
});
ipcMain.handle("getContratadosById", function _callee46(event, servicioId) {
  var conn, result;
  return regeneratorRuntime.async(function _callee46$(_context46) {
    while (1) {
      switch (_context46.prev = _context46.next) {
        case 0:
          _context46.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context46.sent;
          _context46.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT contratosId FROM serviciosContratados WHERE NOT estado='Innactivo' and " + "serviciosId=? ;", servicioId));

        case 5:
          result = _context46.sent;
          console.log("Resultado: ", result);
          return _context46.abrupt("return", result);

        case 8:
        case "end":
          return _context46.stop();
      }
    }
  });
});
ipcMain.handle("getRecaudaciones", function _callee47(event, servicioId, desde, hasta) {
  var conn, _result7, _result8;

  return regeneratorRuntime.async(function _callee47$(_context47) {
    while (1) {
      switch (_context47.prev = _context47.next) {
        case 0:
          _context47.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context47.sent;
          console.log("Buscando: " + desde + " " + hasta);
          _context47.prev = 4;

          if (!(desde === "all" || desde === undefined)) {
            _context47.next = 13;
            break;
          }

          _context47.next = 8;
          return regeneratorRuntime.awrap(conn.query("CALL selectRecaudaciones(" + servicioId + ",'2023-01-01',now()); "));

        case 8:
          _result7 = _context47.sent;
          console.log("Resultado: ", _result7[0]);
          return _context47.abrupt("return", _result7[0]);

        case 13:
          _context47.next = 15;
          return regeneratorRuntime.awrap(conn.query("CALL selectRecaudaciones(" + servicioId + ",'" + desde + "','" + hasta + "'); "));

        case 15:
          _result8 = _context47.sent;
          console.log("Resultado: ", _result8[0]);
          return _context47.abrupt("return", _result8[0]);

        case 18:
          _context47.next = 23;
          break;

        case 20:
          _context47.prev = 20;
          _context47.t0 = _context47["catch"](4);
          console.log(_context47.t0);

        case 23:
        case "end":
          return _context47.stop();
      }
    }
  }, null, null, [[4, 20]]);
}); // ----------------------------------------------------------------
// Funciones de las cuotas
// ----------------------------------------------------------------

ipcMain.handle("getCuotas", function _callee48() {
  var conn, results;
  return regeneratorRuntime.async(function _callee48$(_context48) {
    while (1) {
      switch (_context48.prev = _context48.next) {
        case 0:
          _context48.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context48.sent;
          results = conn.query("SELECT * FROM viewServicios where tipo='Cuota'order by id asc;");
          console.log(results);
          return _context48.abrupt("return", results);

        case 6:
        case "end":
          return _context48.stop();
      }
    }
  });
});
ipcMain.handle("getCuotasById", function _callee49(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee49$(_context49) {
    while (1) {
      switch (_context49.prev = _context49.next) {
        case 0:
          _context49.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context49.sent;
          _context49.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewServicios where id = ?", id));

        case 5:
          result = _context49.sent;
          console.log("Resultado", result[0]);
          return _context49.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context49.stop();
      }
    }
  });
});
ipcMain.handle("createCuotas", function _callee50(event, cuota) {
  var conn, resultServicio;
  return regeneratorRuntime.async(function _callee50$(_context50) {
    while (1) {
      switch (_context50.prev = _context50.next) {
        case 0:
          _context50.prev = 0;
          _context50.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context50.sent;
          console.log("Recibido: ", cuota);
          _context50.next = 7;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO servicios set ?;", cuota));

        case 7:
          resultServicio = _context50.sent;
          cuota.id = resultServicio.insertId;
          console.log(resultServicio);
          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Se ha guardado un nuevo servicio ocacional."
          });
          return _context50.abrupt("return", resultServicio);

        case 14:
          _context50.prev = 14;
          _context50.t0 = _context50["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al guardar el servicio ocacional."
          });
          console.log(_context50.t0);

        case 18:
        case "end":
          return _context50.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
ipcMain.handle("createSercicioContratado", function _callee51(event, contratar) {
  var conn, resultServicio;
  return regeneratorRuntime.async(function _callee51$(_context51) {
    while (1) {
      switch (_context51.prev = _context51.next) {
        case 0:
          _context51.prev = 0;
          _context51.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context51.sent;
          console.log("Recibido: ", contratar);
          _context51.next = 7;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO serviciosContratados set ?;", contratar));

        case 7:
          resultServicio = _context51.sent;
          contratar.id = resultServicio.insertId;
          console.log(resultServicio);
          event.sender.send("Notificar", {
            success: true,
            title: "Guardado!",
            message: "Contratado."
          });
          return _context51.abrupt("return", resultServicio);

        case 14:
          _context51.prev = 14;
          _context51.t0 = _context51["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al contratar."
          });
          console.log(_context51.t0);

        case 18:
        case "end":
          return _context51.stop();
      }
    }
  }, null, null, [[0, 14]]);
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
  var conn, _result9;

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
          _result9 = _context53.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Borrado!",
            message: "Se ha eliminado el servicio ocacional."
          });
          console.log(_result9);
          return _context53.abrupt("return", _result9);

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
}); // ----------------------------------------------------------------
//   funciones de los Medidores
// ----------------------------------------------------------------

ipcMain.handle("getMedidores", function _callee54() {
  var conn, results;
  return regeneratorRuntime.async(function _callee54$(_context54) {
    while (1) {
      switch (_context54.prev = _context54.next) {
        case 0:
          _context54.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context54.sent;
          results = conn.query("Select * from medidores order by id desc;");
          console.log(results);
          return _context54.abrupt("return", results);

        case 6:
        case "end":
          return _context54.stop();
      }
    }
  });
});
ipcMain.handle("getMedidoresDisponibles", function _callee55() {
  var conn, results;
  return regeneratorRuntime.async(function _callee55$(_context55) {
    while (1) {
      switch (_context55.prev = _context55.next) {
        case 0:
          _context55.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context55.sent;
          results = conn.query("Select * from implementos where implementos.nombre='Medidor' and implementos.stock>0 order by id desc;");
          console.log(results);
          return _context55.abrupt("return", results);

        case 6:
        case "end":
          return _context55.stop();
      }
    }
  });
});
ipcMain.handle("getMedidorDisponibleById", function _callee56(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee56$(_context56) {
    while (1) {
      switch (_context56.prev = _context56.next) {
        case 0:
          _context56.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context56.sent;
          _context56.next = 5;
          return regeneratorRuntime.awrap(conn.query("Select * from implementos where id = ?", id));

        case 5:
          result = _context56.sent;
          console.log(result[0]);
          return _context56.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context56.stop();
      }
    }
  });
});
ipcMain.handle("createMedidor", function _callee57(event, medidor) {
  var conn, _result10;

  return regeneratorRuntime.async(function _callee57$(_context57) {
    while (1) {
      switch (_context57.prev = _context57.next) {
        case 0:
          _context57.prev = 0;
          _context57.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context57.sent;
          console.log("Recibido: ", medidor); //   product.price = parseFloat(product.price);

          _context57.next = 7;
          return regeneratorRuntime.awrap(conn.query("Insert into medidores set ?", medidor));

        case 7:
          _result10 = _context57.sent;
          console.log(_result10);
          new Notification({
            title: "Electrom Mysql",
            body: "New medidor saved succesfully"
          }).show();
          medidor.id = _result10.insertId;
          return _context57.abrupt("return", medidor);

        case 14:
          _context57.prev = 14;
          _context57.t0 = _context57["catch"](0);
          console.log(_context57.t0);

        case 17:
        case "end":
          return _context57.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
ipcMain.handle("getMedidorById", function _callee58(event, id) {
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
          return regeneratorRuntime.awrap(conn.query("Select * from medidores where id = ?", id));

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

ipcMain.handle("getDatosContratosById", function _callee59(event, id) {
  var conn, mensaje, result;
  return regeneratorRuntime.async(function _callee59$(_context59) {
    while (1) {
      switch (_context59.prev = _context59.next) {
        case 0:
          _context59.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context59.sent;
          mensaje = "NM: ";
          result = "";
          _context59.next = 7;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewcontratosconmedidor where id=" + id + ";"));

        case 7:
          result = _context59.sent;

          if (!(!result.length == 0)) {
            _context59.next = 12;
            break;
          }

          mensaje = "Datos contrato con medidor: ";
          _context59.next = 16;
          break;

        case 12:
          _context59.next = 14;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewcontratossinmedidor where id=" + id + ";"));

        case 14:
          result = _context59.sent;

          if (!result.length == 0) {
            mensaje = "Datos contrato sin medidor: ";
          } else {
            mensaje = "No se encontraron datos: ";
          }

        case 16:
          console.log(mensaje, result[0]);
          return _context59.abrupt("return", result[0]);

        case 18:
        case "end":
          return _context59.stop();
      }
    }
  });
});
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
  var sinMedidor, conMedidor, contratos, conn, sinMedidores, conMedidores;
  return regeneratorRuntime.async(function _callee62$(_context62) {
    while (1) {
      switch (_context62.prev = _context62.next) {
        case 0:
          conMedidor = 0;
          contratos = 0;
          _context62.next = 4;
          return regeneratorRuntime.awrap(getConnection());

        case 4:
          conn = _context62.sent;
          _context62.prev = 5;
          _context62.next = 8;
          return regeneratorRuntime.awrap(conn.query("select count(contratos.id)as sinMedidor,contratos.fecha,socios.cedulaPasaporte from contratos " + "join socios on socios.id=contratos.sociosId where " + "contratos.medidorSn='No' and socios.cedulaPasaporte='" + cedula + "' ; "));

        case 8:
          sinMedidores = _context62.sent;
          _context62.next = 11;
          return regeneratorRuntime.awrap(conn.query("select count(contratos.id)as conMedidor,contratos.fecha,socios.cedulaPasaporte from contratos " + "join socios on socios.id=contratos.sociosId  join medidores on contratos.id=medidores.contratosId where " + " contratos.medidorSn='Si' and socios.cedulaPasaporte='" + cedula + "'; "));

        case 11:
          conMedidores = _context62.sent;
          sinMedidor = sinMedidores[0].sinMedidor;
          conMedidor = conMedidores[0].conMedidor;
          contratos = {
            sinMedidor: sinMedidor,
            conMedidor: conMedidor
          };
          _context62.next = 20;
          break;

        case 17:
          _context62.prev = 17;
          _context62.t0 = _context62["catch"](5);
          console.log(_context62.t0);

        case 20:
          if (sinMedidor == 0 && conMedidor > 0) {
            event.sender.send("showAlertMedidoresExistentes", "Este usuario ya registra " + conMedidor + " contratos con Medidor\nVerifica el registro de contratos antes de crear uno nuevo!");
          } else if (sinMedidor > 0 && conMedidor == 0) {
            event.sender.send("showAlertMedidoresExistentes", "Este usuario ya registra " + sinMedidor + " contratos sin Medidor\nVerifica el registro de contratos antes de crear uno nuevo!");
          } else if (sinMedidor > 0 && conMedidor > 0) {
            event.sender.send("showAlertMedidoresExistentes", "Este usuario ya registra " + sinMedidor + " contratos sin Medidor y " + conMedidor + " contratos con medidor\nVerifica el registro de contratos antes de crear uno nuevo!");
          }

          console.log(contratos);
          return _context62.abrupt("return", contratos);

        case 23:
        case "end":
          return _context62.stop();
      }
    }
  }, null, null, [[5, 17]]);
});
ipcMain.handle("getContratosConMedidor", function _callee63() {
  var contratosConMedidor, conn;
  return regeneratorRuntime.async(function _callee63$(_context63) {
    while (1) {
      switch (_context63.prev = _context63.next) {
        case 0:
          _context63.prev = 0;
          _context63.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context63.sent;
          contratosConMedidor = conn.query("SELECT * from viewContratos where medidorSn='Si' order by contratosId desc;");
          _context63.next = 10;
          break;

        case 7:
          _context63.prev = 7;
          _context63.t0 = _context63["catch"](0);
          Console.log(_context63.t0);

        case 10:
          console.log(contratosConMedidor);
          return _context63.abrupt("return", contratosConMedidor);

        case 12:
        case "end":
          return _context63.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
ipcMain.handle("getContratosSinMedidor", function _callee64() {
  var contratosSinMedidor, conn;
  return regeneratorRuntime.async(function _callee64$(_context64) {
    while (1) {
      switch (_context64.prev = _context64.next) {
        case 0:
          _context64.prev = 0;
          _context64.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context64.sent;
          contratosSinMedidor = conn.query("SELECT * from viewContratos where medidorSn='No' order by contratosId desc;");
          _context64.next = 10;
          break;

        case 7:
          _context64.prev = 7;
          _context64.t0 = _context64["catch"](0);
          console.log(_context64.t0);

        case 10:
          console.log(contratosSinMedidor);
          return _context64.abrupt("return", contratosSinMedidor);

        case 12:
        case "end":
          return _context64.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
ipcMain.handle("createContrato", function _callee65(event, contrato, numero, sectorId) {
  var conn, _result11;

  return regeneratorRuntime.async(function _callee65$(_context65) {
    while (1) {
      switch (_context65.prev = _context65.next) {
        case 0:
          _context65.prev = 0;
          console.log("Recibido:", event, contrato, numero, sectorId);
          _context65.next = 4;
          return regeneratorRuntime.awrap(getConnection());

        case 4:
          conn = _context65.sent;
          console.log("Recibido: ", contrato);
          _context65.next = 8;
          return regeneratorRuntime.awrap(conn.query("Insert into contratos set ?", contrato));

        case 8:
          _result11 = _context65.sent;
          sumarSociosSectores(numero, sectorId);
          console.log(_result11);
          new Notification({
            title: "Registró guardado",
            body: "Se registró un nuevo contrato con éxito"
          }).show();
          contrato.id = _result11.insertId;
          return _context65.abrupt("return", contrato);

        case 16:
          _context65.prev = 16;
          _context65.t0 = _context65["catch"](0);
          console.log(_context65.t0);

        case 19:
        case "end":
          return _context65.stop();
      }
    }
  }, null, null, [[0, 16]]);
});

function sumarSociosSectores(numero, sectorId) {
  var conn, _result12;

  return regeneratorRuntime.async(function sumarSociosSectores$(_context66) {
    while (1) {
      switch (_context66.prev = _context66.next) {
        case 0:
          console.log("Recibido sectores: " + numero + " " + sectorId);
          _context66.prev = 1;
          _context66.next = 4;
          return regeneratorRuntime.awrap(getConnection());

        case 4:
          conn = _context66.sent;
          _context66.next = 7;
          return regeneratorRuntime.awrap(conn.query("Update sectores set numeroSocios=? WHERE id= ?", [numero, sectorId]));

        case 7:
          _result12 = _context66.sent;
          console.log(_result12);
          new Notification({
            title: "Registró guardado",
            body: "Se registró un nuevo sector con éxito"
          }).show();
          return _context66.abrupt("return", _result12);

        case 13:
          _context66.prev = 13;
          _context66.t0 = _context66["catch"](1);
          console.log(_context66.t0);

        case 16:
        case "end":
          return _context66.stop();
      }
    }
  }, null, null, [[1, 13]]);
}

ipcMain.handle("updateContrato", function _callee66(event, id, contrato) {
  var conn, result;
  return regeneratorRuntime.async(function _callee66$(_context67) {
    while (1) {
      switch (_context67.prev = _context67.next) {
        case 0:
          _context67.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context67.sent;
          _context67.prev = 3;
          _context67.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE contratos  set ? where id = ?", [contrato, id]));

        case 6:
          result = _context67.sent;
          _context67.next = 12;
          break;

        case 9:
          _context67.prev = 9;
          _context67.t0 = _context67["catch"](3);
          console.log(_context67.t0);

        case 12:
          console.log(result);
          return _context67.abrupt("return", result);

        case 14:
        case "end":
          return _context67.stop();
      }
    }
  }, null, null, [[3, 9]]);
});
ipcMain.handle("updateMedidor", function _callee67(event, id, medidor) {
  var conn, medidorExistente, result;
  return regeneratorRuntime.async(function _callee67$(_context68) {
    while (1) {
      switch (_context68.prev = _context68.next) {
        case 0:
          _context68.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context68.sent;
          _context68.prev = 3;
          _context68.next = 6;
          return regeneratorRuntime.awrap(conn.query("SELECT id FROM medidores  WHERE contratosId=" + id + ";"));

        case 6:
          medidorExistente = _context68.sent;
          console.log("resultado de buscar el medidor: " + medidorExistente[0]);

          if (!(medidorExistente[0] != undefined)) {
            _context68.next = 16;
            break;
          }

          console.log("ejecutando if");
          _context68.next = 12;
          return regeneratorRuntime.awrap(conn.query("UPDATE medidores set ? where id = ?", [medidor, medidorExistente[0].id]));

        case 12:
          result = _context68.sent;
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "El medidor " + medidor.codigo + " se há actualizado :)"
          }).show();
          _context68.next = 21;
          break;

        case 16:
          console.log("ejecutando else: ", medidor);
          _context68.next = 19;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO medidores set ?", medidor));

        case 19:
          result = _context68.sent;
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "El medidor " + medidor.codigo + " se ha registrado :)"
          }).show();

        case 21:
          _context68.next = 27;
          break;

        case 23:
          _context68.prev = 23;
          _context68.t0 = _context68["catch"](3);
          new Notification({
            title: "SCAP Santo Domingo No.1",
            body: "Ha ocurrido un error en la actualización :("
          }).show();
          console.log("Error al actualizar el medidor: ", _context68.t0);

        case 27:
          console.log(result);
          return _context68.abrupt("return", result);

        case 29:
        case "end":
          return _context68.stop();
      }
    }
  }, null, null, [[3, 23]]);
});
ipcMain.handle("createServiciosContratados", function _callee68(event, servicioId, contratoId, descuentosId, adquiridoSn) {
  var conn, resultContratarServicio;
  return regeneratorRuntime.async(function _callee68$(_context69) {
    while (1) {
      switch (_context69.prev = _context69.next) {
        case 0:
          _context69.prev = 0;
          _context69.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context69.sent;
          console.log("Recibido: ", servicioId);
          _context69.next = 7;
          return regeneratorRuntime.awrap(conn.query("CALL insertServiciosContratados (" + servicioId + "," + contratoId + "," + descuentosId + ",'" + adquiridoSn + "');"));

        case 7:
          resultContratarServicio = _context69.sent;
          console.log(resultContratarServicio); // new Notification({
          //   title: "Regístro guardado",
          //   body: "Se registro el servicio",
          // }).show();

          event.sender.send("notifyContratarServicios");
          resultContratarServicio.id = resultContratarServicio.insertId;
          return _context69.abrupt("return", resultContratarServicio);

        case 14:
          _context69.prev = 14;
          _context69.t0 = _context69["catch"](0);
          console.log(_context69.t0);

        case 17:
        case "end":
          return _context69.stop();
      }
    }
  }, null, null, [[0, 14]]);
}); // ----------------------------------------------------------------
// Funciones de las planillas
// ----------------------------------------------------------------

ipcMain.handle("createPlanilla", function _callee70(event) {
  var conn;
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
          return regeneratorRuntime.awrap(conn.query("select medidores.id,medidores.codigo,medidores.fechaInstalacion,contratos.id as contratosId " + "from medidores join contratos on contratos.id=medidores.contratosId " + "where contratos.medidorSn='Si'; "));

        case 6:
          medidoresActivos = _context71.sent;

          if (medidoresActivos[0] !== undefined) {
            medidoresActivos.forEach(function _callee69(contratoActivo) {
              var lecturaAnterior, lecturaConsulta, tarifaBase, newPlanilla, resultadoPlanillas;
              return regeneratorRuntime.async(function _callee69$(_context70) {
                while (1) {
                  switch (_context70.prev = _context70.next) {
                    case 0:
                      console.log("Contrato a buscar: " + contratoActivo.id);
                      _context70.next = 3;
                      return regeneratorRuntime.awrap(conn.query("SELECT count(planillas.id) as existe from planillas where month" + "(planillas.fechaEmision)=month(now()) and year(planillas.fechaEmision)=year(now()) " + "and  planillas.medidoresId=" + contratoActivo.id + ";"));

                    case 3:
                      planillaExiste = _context70.sent;
                      console.log("existe: " + planillaExiste[0].existe); // Si no existe la planilla correspondiente a la fecha se crea a planilla

                      if (!(planillaExiste[0].existe === 0)) {
                        _context70.next = 19;
                        break;
                      }

                      // Obtenemos el valor de la lectura anterior en caso de existir
                      lecturaAnterior = 0.0;
                      _context70.next = 9;
                      return regeneratorRuntime.awrap(conn.query(" SELECT planillas.lecturaActual from planillas where " + "medidoresId=" + contratoActivo.id + " order by planillas.fechaEmision desc limit 1;"));

                    case 9:
                      lecturaConsulta = _context70.sent;

                      if (lecturaConsulta[0] !== undefined) {
                        console.log("lectura Anterior: " + lecturaConsulta[0].lecturaActual);
                        lecturaAnterior = lecturaConsulta[0].lecturaActual;
                      }

                      _context70.next = 13;
                      return regeneratorRuntime.awrap(conn.query("SELECT * FROM tarifas where tarifa='Familiar';"));

                    case 13:
                      tarifaBase = _context70.sent;
                      newPlanilla = {
                        //fechaEmision: "now()",
                        valor: tarifaBase[0].valor,
                        estado: "Por cobrar",
                        lecturaActual: 0.0,
                        lecturaAnterior: lecturaAnterior,
                        Observacion: "NA",
                        medidoresId: contratoActivo.id,
                        tarifa: "Familiar",
                        tarifaValor: tarifaBase[0].valor
                      };
                      _context70.next = 17;
                      return regeneratorRuntime.awrap(conn.query("INSERT INTO planillas set ?", newPlanilla));

                    case 17:
                      resultadoPlanillas = _context70.sent;
                      console.log("Resultado de crear planillas: " + resultadoPlanillas); // return resultadoPlanillas;

                    case 19:
                      createCuentaServicios(contratoActivo.contratosId);

                    case 20:
                    case "end":
                      return _context70.stop();
                  }
                }
              });
            });
          }

          _context71.next = 13;
          break;

        case 10:
          _context71.prev = 10;
          _context71.t0 = _context71["catch"](3);
          console.log("Error al crear planillas: " + _context71.t0);

        case 13:
        case "end":
          return _context71.stop();
      }
    }
  }, null, null, [[3, 10]]);
});

function createCuentaServicios(contratoId) {
  var conn, encabezadoId, encabezadoExiste, resultEncabezado, serviciosContratados, otrosValores;
  return regeneratorRuntime.async(function createCuentaServicios$(_context72) {
    while (1) {
      switch (_context72.prev = _context72.next) {
        case 0:
          console.log("Consultando encabezado para: " + contratoId);
          _context72.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context72.sent;
          _context72.prev = 4;
          _context72.next = 7;
          return regeneratorRuntime.awrap(conn.query("select count(id) as existe, id from viewEncabezados WHERE tipo='planilla' and   " + "month(fechaEmisionEncabezado)=month(now())" + " and year(fechaEmisionEncabezado)=year(now()) and contratosId=" + contratoId + ";"));

        case 7:
          encabezadoExiste = _context72.sent;

          if (!(encabezadoExiste[0].existe === 0)) {
            _context72.next = 17;
            break;
          }

          console.log("Existe encabezado: ", encabezadoExiste[0].existe); // Si no existe un encabezado para la fecha actual se procede a crear uno

          newEncabezado = {
            fechaPago: null,
            tipo: "planilla"
          };
          _context72.next = 13;
          return regeneratorRuntime.awrap(conn.query("INSERT INTO encabezado set ?;", newEncabezado));

        case 13:
          resultEncabezado = _context72.sent;
          encabezadoId = resultEncabezado.insertId;
          _context72.next = 18;
          break;

        case 17:
          // Si existe el encabezado obtenemos el id del encabezado existente
          encabezadoId = encabezadoExiste[0].id;

        case 18:
          _context72.next = 20;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewServiciosCancelar WHERE contratosId=" + contratoId + " AND estado='Activo' AND tipo='Servicio fijo' AND aplazableSn='No';"));

        case 20:
          serviciosContratados = _context72.sent;
          createDetallesServicios(serviciosContratados, encabezadoId); // Consultamos los servicios ocacionales, las cuotas y las multas que no son aplazables para
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

          _context72.next = 24;
          return regeneratorRuntime.awrap(conn.query( // "SELECT serviciosContratados.id,serviciosContratados.estado," +
          //   "serviciosContratados.fechaEmision,serviciosContratados.valorIndividual,servicios.id as serviciosId," +
          //   "servicios.aplazableSn,servicios.nombre,servicios.descripcion,servicios.tipo,servicios.valor,servicios.valorPagos," +
          //   "tiposdescuento.descripcion as descripcionDescuento,tiposdescuento.valor as valorDescuento " +
          //   "from serviciosContratados join servicios on servicios.id=serviciosContratados.serviciosId join " +
          //   "tiposdescuento on tiposdescuento.id=serviciosContratados.descuentosId " +
          //   "where serviciosContratados.contratosId=" +
          //   contratoId +
          //   " and serviciosContratados.estado='Sin aplicar' and not servicios.tipo='Servicio fijo'"
          "SELECT * FROM viewServiciosCancelar WHERE contratosId=" + contratoId + " AND estado='Sin aplicar' AND NOT tipo='Servicio fijo';"));

        case 24:
          otrosValores = _context72.sent;
          createDetallesServicios(otrosValores, encabezadoId);
          _context72.next = 31;
          break;

        case 28:
          _context72.prev = 28;
          _context72.t0 = _context72["catch"](4);
          console.log("Error al crear cuentaservicios: " + _context72.t0);

        case 31:
        case "end":
          return _context72.stop();
      }
    }
  }, null, null, [[4, 28]]);
}

function createDetallesServicios(serviciosContratados, encabezadoId) {
  var conn;
  return regeneratorRuntime.async(function createDetallesServicios$(_context74) {
    while (1) {
      switch (_context74.prev = _context74.next) {
        case 0:
          _context74.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context74.sent;
          serviciosContratados.forEach(function _callee71(servicioContratado) {
            var valorPagos, total, newDetalleServicios, resultadoDetalleServicio, modificaEstado;
            return regeneratorRuntime.async(function _callee71$(_context73) {
              while (1) {
                switch (_context73.prev = _context73.next) {
                  case 0:
                    console.log("Servicio contratado a buscar: " + servicioContratado.id); // Mediante la fecha consultamos si ya se ha creado un detalle para el servicio en determinado mes.
                    // para evitar que el servicio se aplique dos veces.

                    _context73.next = 3;
                    return regeneratorRuntime.awrap(conn.query("SELECT count(detallesServicio.id) as existe from detallesServicio where month" + "(detallesServicio.fechaEmision)=month(now()) and year(detallesServicio.fechaEmision)=year(now()) " + "and  detallesServicio.serviciosContratadosId=" + servicioContratado.id + ";"));

                  case 3:
                    detalleServicioExiste = _context73.sent;
                    console.log("Detalle servicio existe: " + detalleServicioExiste[0].existe); // Si no existen los detalles de servicios correspondiente a la fecha se crean y se añaden al encabezado

                    if (!(detalleServicioExiste[0].existe === 0)) {
                      _context73.next = 19;
                      break;
                    }

                    valorPagos = 0.0;
                    total = 0.0; // El descuento esta en veremos :(

                    if (servicioContratado.valoresDistintos === "Si") {
                      if (serviciosContratado.aplazableSn === "Si") {
                        total = servicioContratado.valorIndividual;
                        valorPagos = servicioContratados.valorPagosindividual - servicioContratado.valorDescuento;
                      } else {
                        total = servicioContratado.valorIndividual;
                        valorPagos = servicioContratado.valorIndividual - servicioContratado.valorDescuento;
                      }
                    } else {
                      if (servicioContratado.aplazableSn === "Si") {
                        total = servicioContratado.valor;
                        valorPagos = servicioContratado.valorPagos - servicioContratado.valorDescuento;
                      } else {
                        total = servicioContratado.valor;
                        valorPagos = servicioContratado.valorPagos - servicioContratado.valorDescuento;
                      }
                    }

                    newDetalleServicios = {
                      serviciosContratadosId: servicioContratado.id,
                      descuento: servicioContratado.valorDescuento,
                      subtotal: total,
                      total: total - servicioContratado.valorDescuento,
                      saldo: total - servicioContratado.valorDescuento,
                      abono: valorPagos,
                      encabezadosId: encabezadoId,
                      estado: "Por cancelar" //fechaEmision

                    };
                    _context73.next = 12;
                    return regeneratorRuntime.awrap(conn.query("INSERT INTO detallesServicio set ?", newDetalleServicios));

                  case 12:
                    resultadoDetalleServicio = _context73.sent;

                    if (!(!servicioContratado.tipo == "Servicio fijo")) {
                      _context73.next = 17;
                      break;
                    }

                    _context73.next = 16;
                    return regeneratorRuntime.awrap(conn.query("UPDATE serviciosContratados SET estado='Aplicado' WHERE serviciosContratados.id=" + servicioContratado.id + ";"));

                  case 16:
                    modificaEstado = _context73.sent;

                  case 17:
                    console.log("Resultado de crear planillas: " + resultadoDetalleServicio);
                    return _context73.abrupt("return", resultadoDetalleServicio);

                  case 19:
                  case "end":
                    return _context73.stop();
                }
              }
            });
          });

        case 4:
        case "end":
          return _context74.stop();
      }
    }
  });
} // Cargamos las planillas disponibles


ipcMain.handle("getDatosPlanillas", function _callee72(event, criterio, criterioContent, estado, anio, mes) {
  var conn, results, _results5;

  return regeneratorRuntime.async(function _callee72$(_context75) {
    while (1) {
      switch (_context75.prev = _context75.next) {
        case 0:
          console.log("Recibo parametros planillas: " + criterio, criterioContent, estado, anio, mes);
          _context75.prev = 1;
          _context75.next = 4;
          return regeneratorRuntime.awrap(getConnection());

        case 4:
          conn = _context75.sent;

          if (estado === "all" || estado == undefined) {
            estado = "";
          }

          if (!(criterio === "all" || criterio == undefined)) {
            _context75.next = 14;
            break;
          }

          _context75.next = 9;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewPlanillas WHERE " + "estado='" + estado + "' and " + " year(fechaEmision) = '" + anio + "' and month(fechaEmision) = '" + mes + "' order by fechaEmision desc"));

        case 9:
          results = _context75.sent;
          console.log(results);
          return _context75.abrupt("return", results);

        case 14:
          _context75.next = 16;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewPlanillas WHERE " + criterio + " = " + criterioContent + " and estado='" + estado + "' and " + " year(fechaEmision) = '" + anio + "' and month(fechaEmision) = '" + mes + "' order by fechaEmision desc"));

        case 16:
          _results5 = _context75.sent;
          console.log("Con parametros", _results5);
          return _context75.abrupt("return", _results5);

        case 19:
          _context75.next = 24;
          break;

        case 21:
          _context75.prev = 21;
          _context75.t0 = _context75["catch"](1);
          console.log("Error en la busqueda de planillas: " + _context75.t0);

        case 24:
        case "end":
          return _context75.stop();
      }
    }
  }, null, null, [[1, 21]]);
}); // Funcion que carga los datos de la planilla para editarlos

ipcMain.handle("getPlanillaById", function _callee73(event, planillaId) {
  var conn, results;
  return regeneratorRuntime.async(function _callee73$(_context76) {
    while (1) {
      switch (_context76.prev = _context76.next) {
        case 0:
          _context76.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context76.sent;
          results = conn.query("SELECT * FROM viewPlanillas where planillasId=" + planillaId + ";");
          console.log(results);
          return _context76.abrupt("return", results);

        case 6:
        case "end":
          return _context76.stop();
      }
    }
  });
}); // Funcion que relaiza un filtro entre las planillas de acuerdo al codigo del medidor

ipcMain.handle("getDatosPlanillasByCodigo", function _callee74(event, codigoMedidor, fechaPlanilla, estadoPlanilla, estadoEdicion) {
  var conn, results, parametrosDesechos, notification, _notification3;

  return regeneratorRuntime.async(function _callee74$(_context77) {
    while (1) {
      switch (_context77.prev = _context77.next) {
        case 0:
          _context77.prev = 0;
          _context77.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context77.sent;
          conn.query("SET lc_time_names = 'es_ES';");
          results = conn.query("select planillas.id,planillas.fecha,planillas.valor,planillas.estado,planillas.estadoEdicion," + "planillas.lecturaActual,planillas.lecturaAnterior,planillas.observacion," + "planillas.codigo as codigoPlanillas," + "medidores.codigo as codigoMedidores,socios.cedula, socios.nombre, socios.apellido," + "concat(medidores.barrio,', ',medidores.callePrincipal,' y ',medidores.calleSecundaria,', casa: '," + "medidores.numeroCasa,' ',medidores.referencia,'-') as ubicacion " + "from planillas " + "join contratos on contratos.id=planillas.contratosId join medidores on " + "contratos.id=medidores.contratosId join socios on socios.id=contratos.sociosId " + "where medidores.codigo ='" + codigoMedidor + "' and monthname(planillas.fecha)like '%" + fechaPlanilla + "%' " + "and planillas.estado like'%" + estadoPlanilla + "%' and planillas.estadoEdicion like'%" + estadoEdicion + "%';");
          _context77.next = 8;
          return regeneratorRuntime.awrap(conn.query("select * from parametros where nombreParametro='Tarifa recolección de desechos';"));

        case 8:
          parametrosDesechos = _context77.sent;
          console.log("Consulta de los parametrso de desechos: ", parametrosDesechos);
          notification = new Notification({
            title: "Exito",
            body: "Se muestran los datos del medidor" // icon: "/path/to/icon.png",
            // onClick: () => {
            //   // Acción a realizar al hacer clic en la notificación
            // },

          });
          notification.show();
          console.log(results);
          return _context77.abrupt("return", results);

        case 16:
          _context77.prev = 16;
          _context77.t0 = _context77["catch"](0);
          _notification3 = new Notification({
            title: "Error",
            body: "Es posible que el medidor proporcionado no exista" // icon: "/path/to/icon.png",
            // onClick: () => {
            //   // Acción a realizar al hacer clic en la notificación
            // },

          });

          _notification3.show();

        case 20:
        case "end":
          return _context77.stop();
      }
    }
  }, null, null, [[0, 16]]);
}); // ----------------------------------------------------------------
// Funciones de las lecturas(Planillas)
// ----------------------------------------------------------------

ipcMain.handle("getLecturasByFecha", function _callee75(event, contratosId, fechaEmision) {
  var conn, results;
  return regeneratorRuntime.async(function _callee75$(_context78) {
    while (1) {
      switch (_context78.prev = _context78.next) {
        case 0:
          _context78.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context78.sent;
          _context78.prev = 3;
          _context78.next = 6;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewplanillas WHERE contratosId=" + contratosId + " and month(fechaEmision)=month('" + fechaEmision + "') and " + " year(fechaEmision)=year('" + fechaEmision + "');"));

        case 6:
          results = _context78.sent;
          console.log(results[0]);
          return _context78.abrupt("return", results);

        case 11:
          _context78.prev = 11;
          _context78.t0 = _context78["catch"](3);
          console.log(_context78.t0);

        case 14:
        case "end":
          return _context78.stop();
      }
    }
  }, null, null, [[3, 11]]);
}); // ----------------------------------------------------------------
// Funcion que relaiza un filtro entre las cuotas de acuerdo al codigo del medidor

ipcMain.handle("getDatosCuotasByCodigo", function _callee76(event, codigoMedidor) {
  var conn, results, notification, _notification4;

  return regeneratorRuntime.async(function _callee76$(_context79) {
    while (1) {
      switch (_context79.prev = _context79.next) {
        case 0:
          _context79.prev = 0;
          _context79.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context79.sent;
          conn.query("SET lc_time_names = 'es_ES';");
          results = conn.query("select servicios.id,servicios.fecha,servicios.servicio,servicios.descripcion,servicios.valor," + "servicios.estado from servicios join extrasplanilla on servicios.Id=extrasplanilla.serviciosId " + "join planillas on planillas.id=extrasplanilla.planillasId join " + "contratos on contratos.id=planillas.contratosId join medidores " + "on contratos.id=medidores.contratosId where servicios.tipo='cuota'and medidores.codigo='" + codigoMedidor + "'; ");
          notification = new Notification({
            title: "Exito",
            body: "Se muestran los datos del medidor"
          });
          notification.show();
          console.log(results);
          return _context79.abrupt("return", results);

        case 12:
          _context79.prev = 12;
          _context79.t0 = _context79["catch"](0);
          _notification4 = new Notification({
            title: "Error",
            body: "Es posible que el medidor proporcionado no exista"
          });

          _notification4.show();

        case 16:
        case "end":
          return _context79.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); // ----------------------------------------------------------------
// Funciones de los detalles
// ----------------------------------------------------------------
// Funcion que carga los servicios de acuerdo al id de la planilla

ipcMain.handle("getDatosServiciosByContratoId", function _callee77(event, contratoId, fechaEmision, criterio) {
  var conn, _result13, _result14, _result15;

  return regeneratorRuntime.async(function _callee77$(_context80) {
    while (1) {
      switch (_context80.prev = _context80.next) {
        case 0:
          _context80.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context80.sent;

          if (!(criterio === "otros")) {
            _context80.next = 11;
            break;
          }

          _context80.next = 6;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewDetallesServicio WHERE contratosId = " + contratoId + " and month(fechaEmision) = month('" + fechaEmision + "') and year(fechaEmision)= year('" + fechaEmision + "') and not tipo='Servicio fijo';"));

        case 6:
          _result13 = _context80.sent;
          console.log("resultado de buscar servicios: ", _result13);
          return _context80.abrupt("return", _result13);

        case 11:
          if (!(criterio === "fijos")) {
            _context80.next = 19;
            break;
          }

          _context80.next = 14;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewDetallesServicio WHERE contratosId = " + contratoId + " and month(fechaEmision) = month('" + fechaEmision + "') and year(fechaEmision)= year('" + fechaEmision + "') and  tipo='Servicio fijo';"));

        case 14:
          _result14 = _context80.sent;
          console.log("resultado de buscar servicios: ", _result14);
          return _context80.abrupt("return", _result14);

        case 19:
          _context80.next = 21;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM viewDetallesServicio WHERE contratosId = " + contratoId + " and month(fechaEmision) = month('" + fechaEmision + "') and year(fechaEmision)= year('" + fechaEmision + "');"));

        case 21:
          _result15 = _context80.sent;
          console.log("resultado de buscar servicios: ", _result15);
          return _context80.abrupt("return", _result15);

        case 24:
          console.log("fechaEmision recibida: ", fechaEmision, contratoId); // const result = await conn.query(
          //   "SELECT * FROM viewservicioscontratados WHERE id = " +
          //     contratoId +
          //     " and month(fechaEmision) = month('" +
          //     fechaEmision +
          //     "') and estado ='Activo';"
          // );

        case 25:
        case "end":
          return _context80.stop();
      }
    }
  });
});
ipcMain.handle("updateDetalle", function _callee78(event, id, detalle) {
  var conn, result;
  return regeneratorRuntime.async(function _callee78$(_context81) {
    while (1) {
      switch (_context81.prev = _context81.next) {
        case 0:
          _context81.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context81.sent;
          console.log("Actualizando detalle: " + id + detalle);
          _context81.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE detallesServicio set ? where id = ?", [detalle, id]));

        case 6:
          result = _context81.sent;
          console.log(result);
          return _context81.abrupt("return", result);

        case 9:
        case "end":
          return _context81.stop();
      }
    }
  });
});
ipcMain.handle("getDetallesByContratadoId", function _callee79(event, contratadoId) {
  var conn, result;
  return regeneratorRuntime.async(function _callee79$(_context82) {
    while (1) {
      switch (_context82.prev = _context82.next) {
        case 0:
          _context82.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context82.sent;
          _context82.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM detallesServicio WHERE detallesServicio.serviciosContratadosId=" + contratadoId + ";"));

        case 5:
          result = _context82.sent;
          console.log(result);
          return _context82.abrupt("return", result);

        case 8:
        case "end":
          return _context82.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funcion de cancelado
// ----------------------------------------------------------------

ipcMain.handle("cancelarServicios", function _callee81(event, planillaCancelarId, encabezadoCancelarId, serviciosCancelar) {
  var conn, _result16;

  return regeneratorRuntime.async(function _callee81$(_context84) {
    while (1) {
      switch (_context84.prev = _context84.next) {
        case 0:
          _context84.prev = 0;
          _context84.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context84.sent;
          console.log("Actualizando detalle: ", planillaCancelarId, encabezadoCancelarId, serviciosCancelar);
          serviciosCancelar.forEach(function _callee80(servicioCancelar) {
            var abono;
            return regeneratorRuntime.async(function _callee80$(_context83) {
              while (1) {
                switch (_context83.prev = _context83.next) {
                  case 0:
                    abono = parseFloat(servicioCancelar.abono).toFixed(2);
                    _context83.next = 3;
                    return regeneratorRuntime.awrap(conn.query("UPDATE detallesServicio set estado='Cancelado',abono=" + abono + " WHERE id = ? ;", servicioCancelar.id));

                  case 3:
                  case "end":
                    return _context83.stop();
                }
              }
            });
          });
          _context84.next = 8;
          return regeneratorRuntime.awrap(conn.query("UPDATE planillas set estado='Cancelado' WHERE id = ? ;", planillaCancelarId));

        case 8:
          _context84.next = 10;
          return regeneratorRuntime.awrap(conn.query("UPDATE encabezado set estado='Cancelado',fechaPago=Now() WHERE id = ? ;", encabezadoCancelarId));

        case 10:
          _result16 = _context84.sent;
          event.sender.send("Notificar", {
            success: true,
            title: "Actualizado!",
            message: "Se ha cancelado la planilla."
          });
          console.log(_result16);
          return _context84.abrupt("return", _result16);

        case 16:
          _context84.prev = 16;
          _context84.t0 = _context84["catch"](0);
          event.sender.send("Notificar", {
            success: false,
            title: "Error!",
            message: "Ha ocurrido un error al cancelar la planilla."
          });
          console.log("Error al cancelar: ", _context84.t0);

        case 20:
        case "end":
          return _context84.stop();
      }
    }
  }, null, null, [[0, 16]]);
}); // ----------------------------------------------------------------
// Funcion que consulta las tarifas por el servicio de agua potable
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Funcion que carga los servicios de acuerdo al id de la planilla
// ----------------------------------------------------------------

ipcMain.handle("getTarifas", function _callee82() {
  var conn, result;
  return regeneratorRuntime.async(function _callee82$(_context85) {
    while (1) {
      switch (_context85.prev = _context85.next) {
        case 0:
          _context85.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context85.sent;
          _context85.next = 5;
          return regeneratorRuntime.awrap(conn.query("SELECT * FROM tarifas;"));

        case 5:
          result = _context85.sent;
          console.log(result);
          return _context85.abrupt("return", result);

        case 8:
        case "end":
          return _context85.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funcion que carga las cuotas de acuerdo al id de la planilla

ipcMain.handle("getCuotasByPlanillaId", function _callee83(event, planillaId) {
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
          return regeneratorRuntime.awrap(conn.query("select planillas.codigo,servicios.id," + "servicios.servicio,servicios.descripcion,servicios.fecha,servicios.valor,servicios.estado " + "from servicios join extrasplanilla on servicios.id=extrasplanilla.serviciosId " + "join planillas on planillas.id=extrasplanilla.planillasId " + "where servicios.tipo='cuota' and planillas.id=?;", planillaId));

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

ipcMain.handle("createCuota", function _callee84(event, cuota, planillaId) {
  var conn, _result17, idNuevoServicio, newExtrasPlanilla, result1;

  return regeneratorRuntime.async(function _callee84$(_context87) {
    while (1) {
      switch (_context87.prev = _context87.next) {
        case 0:
          _context87.prev = 0;
          _context87.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context87.sent;
          console.log("Cuota recibida: ", cuota);
          _context87.next = 7;
          return regeneratorRuntime.awrap(conn.query("Insert into servicios set ?", cuota));

        case 7:
          _result17 = _context87.sent;
          idNuevoServicio = _result17.insertId;
          console.log(_result17.insertId);
          newExtrasPlanilla = {
            serviciosId: idNuevoServicio,
            planillasId: planillaId,
            descuentosId: 3
          };
          _context87.next = 13;
          return regeneratorRuntime.awrap(conn.query("Insert into extrasplanilla set ?", newExtrasPlanilla));

        case 13:
          result1 = _context87.sent;
          console.log(result1);
          new Notification({
            title: "Electrom Mysql",
            body: "New servicio saved succesfully"
          }).show();
          servicio.id = _result17.insertId;
          return _context87.abrupt("return", servicio);

        case 20:
          _context87.prev = 20;
          _context87.t0 = _context87["catch"](0);
          console.log(_context87.t0);

        case 23:
        case "end":
          return _context87.stop();
      }
    }
  }, null, null, [[0, 20]]);
}); // Funcion que carga multas y descuentos de acuerdo al id de la planilla

ipcMain.handle("getMultasDescByPlanillaId", function _callee85(event, planillaId) {
  var conn, result;
  return regeneratorRuntime.async(function _callee85$(_context88) {
    while (1) {
      switch (_context88.prev = _context88.next) {
        case 0:
          _context88.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context88.sent;
          _context88.next = 5;
          return regeneratorRuntime.awrap(conn.query("select planillas.codigo,multasdescuentos.id,multasdescuentos.tipo," + "multasdescuentos.motivo,multasdescuentos.fecha,multasdescuentos.valor from " + "multasdescuentos join planillas on planillas.id=multasdescuentos.planillaId " + "where planillas.id=?;", planillaId));

        case 5:
          result = _context88.sent;
          console.log(result);
          return _context88.abrupt("return", result);

        case 8:
        case "end":
          return _context88.stop();
      }
    }
  });
}); // Funcion que edita los valores permitidos de la planilla

ipcMain.handle("updatePlanilla", function _callee86(event, id, planilla) {
  var conn, result;
  return regeneratorRuntime.async(function _callee86$(_context89) {
    while (1) {
      switch (_context89.prev = _context89.next) {
        case 0:
          _context89.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context89.sent;
          console.log("Actualizando planilla: " + planilla);
          _context89.next = 6;
          return regeneratorRuntime.awrap(conn.query("UPDATE planillas set ? where id = ?", [planilla, id]));

        case 6:
          result = _context89.sent;
          console.log(result);
          return _context89.abrupt("return", result);

        case 9:
        case "end":
          return _context89.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Funciones de los parametros

ipcMain.handle("createParametro", function _callee87(event, parametro) {
  var conn, _result18;

  return regeneratorRuntime.async(function _callee87$(_context90) {
    while (1) {
      switch (_context90.prev = _context90.next) {
        case 0:
          _context90.prev = 0;
          _context90.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context90.sent;
          console.log("Recibido: ", parametro);
          parametro.valor = parseFloat(parametro.valor);
          _context90.next = 8;
          return regeneratorRuntime.awrap(conn.query("Insert into parametros set ?", parametro));

        case 8:
          _result18 = _context90.sent;
          console.log(_result18);
          new Notification({
            title: "Electrom Mysql",
            body: "New parametro saved succesfully"
          }).show();
          parametro.id = _result18.insertId;
          return _context90.abrupt("return", parametro);

        case 15:
          _context90.prev = 15;
          _context90.t0 = _context90["catch"](0);
          console.log(_context90.t0);

        case 18:
        case "end":
          return _context90.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
ipcMain.handle("getParametros", function _callee88() {
  var conn, results;
  return regeneratorRuntime.async(function _callee88$(_context91) {
    while (1) {
      switch (_context91.prev = _context91.next) {
        case 0:
          _context91.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context91.sent;
          results = conn.query("Select * from parametros order by id desc;");
          console.log(results);
          return _context91.abrupt("return", results);

        case 6:
        case "end":
          return _context91.stop();
      }
    }
  });
});
ipcMain.handle("getParametroById", function _callee89(event, id) {
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
          return regeneratorRuntime.awrap(conn.query("Select * from parametros where id = ?", id));

        case 5:
          result = _context92.sent;
          console.log(result[0]);
          return _context92.abrupt("return", result[0]);

        case 8:
        case "end":
          return _context92.stop();
      }
    }
  });
});
ipcMain.handle("updateParametro", function _callee90(event, id, parametro) {
  var conn, result;
  return regeneratorRuntime.async(function _callee90$(_context93) {
    while (1) {
      switch (_context93.prev = _context93.next) {
        case 0:
          _context93.next = 2;
          return regeneratorRuntime.awrap(getConnection());

        case 2:
          conn = _context93.sent;
          _context93.next = 5;
          return regeneratorRuntime.awrap(conn.query("UPDATE parametros set ? where id = ?", [parametro, id]));

        case 5:
          result = _context93.sent;
          console.log(result);
          return _context93.abrupt("return", result);

        case 8:
        case "end":
          return _context93.stop();
      }
    }
  });
});
ipcMain.handle("deleteParametro", function _callee91(event, id) {
  var conn, result;
  return regeneratorRuntime.async(function _callee91$(_context94) {
    while (1) {
      switch (_context94.prev = _context94.next) {
        case 0:
          console.log("id from main.js: ", id);
          _context94.next = 3;
          return regeneratorRuntime.awrap(getConnection());

        case 3:
          conn = _context94.sent;
          _context94.next = 6;
          return regeneratorRuntime.awrap(conn.query("Delete from parametros where id = ?", id));

        case 6:
          result = _context94.sent;
          console.log(result);
          return _context94.abrupt("return", result);

        case 9:
        case "end":
          return _context94.stop();
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