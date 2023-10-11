const { BrowserWindow, Notification, dialog } = require("electron");
const Notifications = require("electron-notification-shim");
const { app, ipcMain } = require("electron");
const { getConnection, cerrarConnection } = require("./database");
const path = require("path");
const url = require("url");
const { error } = require("console");
let servicioEnviar = [];

ipcMain.on("hello", () => {
  console.log("Hello from renderer process");
});

// ----------------------------------------------------------------
ipcMain.handle("getDocumentsPath", async (event, documentsPath) => {
  //const documentsPath = app.getPath('documentos');
  console.log("ruta:", documentsPath);
  await event.sender.send("documentsPath", documentsPath);
});

// ----------------------------------------------------------------
ipcMain.on("printPDF", (event, filePath) => {
  const printWindow = new BrowserWindow({ show: true });
  printWindow.loadURL(`file://${filePath}`);
  printWindow.webContents.on("did-finish-load", () => {
    printWindow.webContents.print({ silent: true });
    //printWindow.close();

    // Enviar confirmación al proceso de renderizado
    event.sender.send(
      "printPDFComplete",
      "El PDF se ha impreso correctamente."
    );
  });
});
//Funciones de inicio de sesion
ipcMain.on("validarUsuarios", async (event, { usuario, clave }) => {
  try {
    const conn = await getConnection();
    const usuarioPeticion = await conn.query(
      "SELECT usuario FROM usuarios WHERE usuario = ?",
      usuario,
      (error, results) => {
        if (error) {
          event.reply("loginResponse", {
            success: false,
            message: "Error en la consulta a la base de datos",
          });
        } else if (results.length > 0) {
          console.log("usuario en peticion ");
          conn.query(
            "SELECT * from usuarios where usuario=? and clave=?",
            [usuario, clave],
            (error, results) => {
              if (error) {
                event.sender.send("loginResponse", {
                  success: false,
                  message: "Error en la consulta a la base de datos",
                });
                const notification = new Notification({
                  title: "No se ha podido iniciar session!",
                  body: "Ocurrio un error al consultar en la base de datos, si el problema persiste solicite soporte tecnico",
                  icon: "/path/to/icon.png",
                });

                notification.show();
              } else if (results.length > 0) {
                event.sender.send("loginResponse", {
                  success: true,
                  message: "Credenciales correctas",
                });
                const notification = new Notification({
                  title: "Credenciales correctas!",
                  body: "Bienvenido usuario: " + usuario,
                  icon: "/path/to/icon.png",
                });

                notification.show();
              } else {
                event.sender.send("loginResponse", {
                  success: false,
                  message: "Credenciales incorrectas",
                });
                // event.sender.send(
                //   "showAlert",
                //   "¡Este es un mensaje de alerta!"
                // );
                const notification = new Notification({
                  title: "Error de credenciales!",
                  body: "La contraseña es incorrecta",
                  icon: "/path/to/icon.png",
                });

                notification.show();
              }
            }
          );
        } else {
          event.sender.send("loginResponse", {
            success: false,
            message: "No existe este usuario",
          });
          const notification = new Notification({
            title: "Error de credenciales!",
            body: "No hay un usuario registrado para " + usuario,
            icon: "/path/to/icon.png",
          });

          notification.show();
        }
      }
    );
  } catch (error) {
    console.log("Error al iniciar session: ", error);
  }
  return usuarioPeticion;
});
// ----------------------------------------------------------------
// Funciones para el cierre de sesion
// ----------------------------------------------------------------
ipcMain.on("cerrarSesion", async (event) => {
  // await cerrarConnection();
  event.sender.send("sesionCerrada");
});
// ----------------------------------------------------------------
// Funcion para el cierre de la aplicacion
// ----------------------------------------------------------------
ipcMain.on("salir", async (event) => {
  app.quit();
});

// ipcMain.on("loginResponse", (event, response) => {
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
ipcMain.handle("createProduct", async (event, product) => {
  try {
    const conn = await getConnection();
    console.log("Recibido: ", product);
    product.price = parseFloat(product.price);
    const result = await conn.query("Insert into producto set ?", product);
    console.log(result);
    new Notification({
      title: "Electrom Mysql",
      body: "New product saved succesfully",
    }).show();
    product.id = result.insertId;
    return product;
  } catch (error) {
    console.log(error);
  }
});
ipcMain.handle("getProducts", async () => {
  const conn = await getConnection();
  const results = conn.query("Select * from producto order by id desc;");
  console.log(results);
  return results;
});
ipcMain.handle("getProductById", async (event, id) => {
  const conn = await getConnection();
  const result = await conn.query("Select * from producto where id = ?", id);
  console.log(result[0]);
  return result[0];
});
ipcMain.handle("updateProduct", async (event, id, product) => {
  const conn = await getConnection();
  const result = await conn.query("UPDATE producto set ? where id = ?", [
    product,
    id,
  ]);
  console.log(result);
  return result;
});
ipcMain.handle("deleteProduct", async (event, id) => {
  console.log("id from main.js: ", id);
  const conn = await getConnection();
  const result = await conn.query("Delete from producto where id = ?", id);
  console.log(result);
  return result;
});

// ----------------------------------------------------------------
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
let window;
function createWindow() {
  app.commandLine.appendSwitch("allow-file-access-from-files");

  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  ipcMain.on("datos-a-servicios", async (event, servicio) => {
    console.log("Datos a enviar: " + servicio.id);
    servicioEnviar = servicio;
    // pagina2Window = new BrowserWindow({ show: false });
    await window.loadFile("src/ui/servicios.html");
    // window.send("datos-a-pagina2", datos);
    await window.show();
    await window.webContents.send("datos-a-servicios");
  });
  ipcMain.on("datos-a-ocacionales", async (event, servicio) => {
    console.log("Datos a enviar: " + servicio.id);
    servicioEnviar = servicio;
    // pagina2Window = new BrowserWindow({ show: false });
    await window.loadFile("src/ui/cuotas.html");
    // window.send("datos-a-pagina2", datos);
    await window.show();
    await window.webContents.send("datos-a-ocacionales");
  });
  // ipcMain.on("datos-a-servicios", async (event, servicio) => {
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
ipcMain.on("abrirInterface", (event, interfaceName) => {
  try {
    console.log("interface name desde main", interfaceName);
    window.loadFile(interfaceName);
  } catch (err) {
    console.log("Error de window" + err);
  }
});
// ----------------------------------------------------------------
// Funciones de las facturas
// ----------------------------------------------------------------
// Define una función para abrir pagina2
// ipcMain.on("abrir-pagina2", () => {
//   // pagina2Window = new BrowserWindow({ show: false });
//   window.loadFile("src/ui/factura.html");
//   window.show();
// });F

// Define una función para enviar datos a pagina2
ipcMain.on(
  "datos-a-pagina2",
  async (
    event,
    datos,
    encabezado,
    serviciosFijos,
    otrosServicios,
    datosAgua,
    datosTotales
  ) => {
    console.log("Datos a enviar: " + datos.mensaje);
    // pagina2Window = new BrowserWindow({ show: false });
    await window.loadFile("src/ui/factura.html");
    // window.send("datos-a-pagina2", datos);
    await window.show();
    await window.webContents.send(
      "datos-a-pagina2",
      datos,
      encabezado,
      serviciosFijos,
      otrosServicios,
      datosAgua,
      datosTotales
    );
  }
);
// Recibe la peticion de la pagina de planillas para
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
ipcMain.handle("pido-datos", async () => {
  return servicioEnviar;
});
ipcMain.handle("getCargos", async () => {
  const conn = await getConnection();
  const results = conn.query("SELECT * FROM cargosempleados");
  console.log(results);
  return results;
});
// ----------------------------------------------------------------
// Funciones de los accesos
// ----------------------------------------------------------------
ipcMain.handle("getAccesos", async () => {
  const conn = await getConnection();
  const results = conn.query("SELECT * FROM roles");
  console.log(results);
  return results;
});
// ----------------------------------------------------------------
// Funciones de los usuarios
// ----------------------------------------------------------------
ipcMain.handle("getUsuarios", async (event, criterio, criterioContent) => {
  const conn = await getConnection();
  try {
    if (criterio === "all") {
      const results = conn.query("SELECT * FROM viewUsuarios");
      console.log(results);
      return results;
    } else {
      const results = conn.query(
        "SELECT * FROM viewUsuarios WHERE " +
          criterio +
          " like '%" +
          criterioContent +
          "%';"
      );
      console.log(results);
      return results;
    }
  } catch (error) {
    console.log(error);
  }
});
// ----------------------------------------------------------------
// Obtenemos los datos de los empleados que no son usuarios del sistema
// ----------------------------------------------------------------
ipcMain.handle("getEmpleados", async (event, criterio, criterioContent) => {
  const conn = await getConnection();
  try {
    if (criterio === "all") {
      const results = conn.query("SELECT * FROM viewEmpleados;");
      console.log(results);
      return results;
    } else {
      const results = conn.query(
        "SELECT * FROM viewEmpleados WHERE " +
          criterio +
          " like '%" +
          criterioContent +
          "%';"
      );
      console.log(results);
      return results;
    }
  } catch (error) {
    console.log(error);
  }
});
ipcMain.handle("createUsuario", async (event, empleado, usuario) => {
  try {
    const conn = await getConnection();
    console.log("Recibido: ", usuario);
    //   product.price = parseFloat(product.price);
    // const resultCargo = await conn.query(
    //   "Insert into cargosempleados set ? ;",
    //   cargo
    // );
    //empleado.cargosId = resultCargo.insertId;
    const resultEmpleado = await conn.query(
      "Insert into empleados set ? ;",
      empleado
    );
    usuario.empleadosId = resultEmpleado.insertId;
    const resultUsuario = await conn.query(
      "Insert into usuarios set ?",
      usuario
    );
    console.log(resultUsuario);
    event.sender.send("Notificar", {
      success: true,
      title: "Guardado!",
      message: "Se ha guardado el nuevo registro.",
    });
    usuario.id = resultUsuario.insertId;
    return usuario;
  } catch (error) {
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al guardar el registro.",
    });
    console.log(error);
  }
});
ipcMain.handle("createEmpleado", async (event, empleado) => {
  try {
    const conn = await getConnection();
    console.log("Recibido: ", empleado);
    // const resultCargo = await conn.query(
    //   "Insert into cargosempleados set ? ;",
    //   cargo
    // );
    // console.log("Se inserto el cargo" + resultCargo.insertId);
    //empleado.cargosId = resultCargo.insertId;
    const resultEmpleado = await conn.query(
      "Insert into empleados set ? ;",
      empleado
    );
    console.log(resultEmpleado);
    event.sender.send("Notificar", {
      success: true,
      title: "Guardado!",
      message: "Se ha guardado el nuevo registro.",
    });
    empleado.id = resultEmpleado.insertId;
    return empleado;
  } catch (error) {
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al guardar el registro.",
    });
    console.error("Ha ocurrido un error: ", error);
  }
});
// ----------------------------------------------------------------
// Obtenemos los datos del empleado usuario del sistema
// ----------------------------------------------------------------

ipcMain.handle("getUsuarioById", async (event, id) => {
  const conn = await getConnection();
  const result = conn.query(
    "select empleados.id,empleados.cedula," +
      "empleados.primerNombre,empleados.segundoNombre,empleados.primerApellido," +
      "empleados.segundoApellido,empleados.telefono,empleados.correo," +
      "cargosempleados.id as cargosId,cargosempleados.cargo," +
      "cargosempleados.cargoDescripcion," +
      " usuarios.id as usuariosId,roles.id as rolesId,roles.rol,roles.rolDescripcion," +
      " usuarios.usuario,usuarios.clave,usuarios.fechaModificacion " +
      "from empleados join usuarios on empleados.id=usuarios.empleadosId join " +
      "cargosempleados on cargosempleados.id=empleados.cargosId " +
      "join roles on roles.id=usuarios.rolesId where empleados.id=?;",
    id
  );
  console.log(result);
  return result;
});
// ----------------------------------------------------------------
// Obtenemos los datos del empleado no usuario del sistema
// ----------------------------------------------------------------
ipcMain.handle("getEmpleadoById", async (event, id) => {
  const conn = await getConnection();
  const result = conn.query(
    "select empleados.id,empleados.cedula," +
      "empleados.primerNombre,empleados.segundoNombre,empleados.primerApellido," +
      "empleados.segundoApellido,empleados.telefono,empleados.correo," +
      "cargosempleados.id as cargosId,cargosempleados.cargo," +
      "cargosempleados.cargoDescripcion " +
      "from empleados join " +
      "cargosempleados on cargosempleados.id=empleados.cargosId where empleados.id=? ;",
    id
  );
  console.log(result);
  return result;
});
ipcMain.handle("updateUsuario", async (event, id, empleado, usuario) => {
  const conn = await getConnection();
  try {
    const resultEmpleado = await conn.query(
      "UPDATE empleados set ? where id = ?",
      [empleado, id]
    );
    console.log(resultEmpleado);
    if (
      usuario.usuario !== null &&
      usuario.usuario !== " " &&
      usuario.clave !== null &&
      usuario.clave !== " " &&
      usuario.rol !== null &&
      usuario.rol !== " " &&
      usuario.rolDescripcion !== null &&
      usuario.rolDescripcion !== " "
    ) {
      const usuarioExist = await conn.query(
        "SELECT * FROM usuarios WHERE usuarios.empleadosId=? order by usuarios.id desc limit 1;",
        id
      );
      if (usuarioExist.length > 0 && usuarioExist[0].id !== null) {
        console.log("existe el usuario: " + usuarioExist[0].id);
        const resultUsuario = await conn.query(
          "UPDATE usuarios set ? where empleadosId = ?;",
          [usuario, id]
        );
        console.log("Se actualizó el usuario", resultUsuario);
      } else {
        usuario.empleadosId = id;
        const resultUsuario = await conn.query(
          "INSERT INTO usuarios SET ?",
          usuario
        );
        console.log("Se creó el usuario", resultUsuario);
      }
    }
    event.sender.send("Notificar", {
      success: true,
      title: "Actualizado!",
      message: "Se ha actualizado el registro.",
    });
  } catch (error) {
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al actualizar el registro.",
    });
  }
});
// ----------------------------------------------------------------
// ----------------------------------------------------------------
ipcMain.handle("updateEmpleado", async (event, id, empleado) => {
  const conn = await getConnection();
  let resultEmpleado = null;
  try {
    const usuarioExist = await conn.query(
      "SELECT * FROM usuarios WHERE usuarios.empleadosId=? order by usuarios.id desc limit 1;",
      id
    );
    if (usuarioExist.length > 0 && usuarioExist[0].id !== null) {
      console.log("existe el usuario: " + usuarioExist[0].id);
      empleado.usuariosn = "Si";
      resultEmpleado = await conn.query("UPDATE empleados set ? where id = ?", [
        empleado,
        id,
      ]);
      console.log(resultEmpleado);
    } else {
      empleado.usuariosn = "No";
      resultEmpleado = await conn.query("UPDATE empleados set ? where id = ?", [
        empleado,
        id,
      ]);
      console.log(resultEmpleado);
    }
    event.sender.send("Notificar", {
      success: true,
      title: "Actualizado!",
      message: "Se ha actualizado el registro.",
    });
    return resultEmpleado;
  } catch (error) {
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al actualizar el registro.",
    });
    console.log(error);
  }
});
// ----------------------------------------------------------------
// Eliminar un usuario del sistema
// ----------------------------------------------------------------
ipcMain.handle("deleteUsuario", async (event, id) => {
  console.log("id from main.js: ", id);
  const conn = await getConnection();
  try {
    const resultUsuario = await conn.query(
      "DELETE FROM usuarios WHERE  empleadosId=?",
      id
    );
    const resultEmpleado = await conn.query(
      "UPDATE empleados SET usuariosn='No' WHERE id =?;",
      id
    );
    console.log(resultEmpleado);
    event.sender.send("Notificar", {
      success: true,
      title: "Usuario eliminado!",
      message: "Se ha actualizado el registro.",
    });
    return resultEmpleado;
  } catch (error) {
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al actualizar el registro.",
    });
    console.log(error);
  }
});
// ----------------------------------------------------------------
// Eliminar un empleado
// ----------------------------------------------------------------
ipcMain.handle("deleteEmpleado", async (event, id) => {
  console.log("id from main.js: ", id);
  const conn = await getConnection();
  try {
    const resultEmpleado = await conn.query(
      "DELETE FROM empleados WHERE id =?;",
      id
    );
    event.sender.send("Notificar", {
      success: true,
      title: "Borrado!",
      message: "Se ha eliminado el usuario.",
    });
    console.log(resultEmpleado);
    return resultEmpleado;
  } catch (error) {
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al elimiar el registro.",
    });
  }
});

// Funciones de los socios
ipcMain.handle("getSocios", async (event, criterio, criterioContent) => {
  const conn = await getConnection();
  try {
    if (criterio === "all" || criterio === undefined) {
      const results = conn.query("SELECT * FROM viewSocios;");
      console.log(results);
      return results;
    } else {
      const results = conn.query(
        "SELECT * FROM viewSocios where " +
          criterio +
          " like '%" +
          criterioContent +
          "%';"
      );
      console.log(results);
      return results;
    }
  } catch (error) {
    console.log(error);
  }
});
ipcMain.handle("createSocio", async (event, socio) => {
  try {
    const conn = await getConnection();
    console.log("Recibido: ", socio);
    const result = await conn.query("INSERT INTO socios SET ?", socio);
    console.log(result);
    // new Notification({
    //   title: "Regístro guardado",
    //   body: "Se registró al nuevo socio con exito!",
    // }).show();serviserviciosId
    event.sender.send("Notificar", {
      success: true,
      title: "Guardado!",
      message: "Se ha guardado el registro.",
    });
    socio.id = result.insertId;
    return socio;
  } catch (error) {
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al guardar el registro.",
    });
    console.log(error);
  }
});
ipcMain.handle("getSocioById", async (event, id) => {
  const conn = await getConnection();
  const result = await conn.query("SELECT * FROM socios WHERE id = ?", id);
  console.log(result[0]);
  return result[0];
});
ipcMain.handle("getContratanteByCedula", async (event, cedula) => {
  const conn = await getConnection();
  const result = await conn.query(
    "Select * from socios where socios.cedulaPasaporte = ?",
    cedula
  );
  console.log(result[0]);
  return result[0];
});
ipcMain.handle("updateSocio", async (event, id, socio) => {
  const conn = await getConnection();
  try {
    const result = await conn.query("UPDATE socios SET ? WHERE id = ?", [
      socio,
      id,
    ]);
    event.sender.send("Notificar", {
      success: true,
      title: "Actualizado!",
      message: "Se ha actualizado el registro.",
    });
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al actualizar el registro.",
    });
  }
});
ipcMain.handle("deleteSocio", async (event, id) => {
  console.log("id from main.js: ", id);
  const conn = await getConnection();
  try {
    const result = await conn.query("DELETE FROM socios WHERE id = ?", id);
    event.sender.send("Notificar", {
      success: true,
      title: "Borrado!",
      message: "Se ha eliminado el usuario.",
    });
    console.log(result);
    return result;
  } catch (error) {
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al elimiar el registro.",
    });
    console.log(error);
  }
});
// ----------------------------------------------------------------
// Funciones de los implementos
// Esta tabla esta relacionada de uno a muchos con inventario
// ----------------------------------------------------------------
ipcMain.handle("getImplementos", async () => {
  const conn = await getConnection();
  const results = conn.query(
    "SELECT * FROM viewimplementosinvenatrio order by implementosId desc;"
  );
  console.log(results);
  return results;
});
ipcMain.handle("createImplemento", async (event, implemento, inventario) => {
  try {
    const conn = await getConnection();
    console.log("Recibido: ", implemento, inventario);
    //   product.price = parseFloat(product.price);
    const resultImplemento = await conn.query(
      "INSERT INTO implementos set ?;",
      implemento
    );
    inventario.implementosId = resultImplemento.insertId;
    const resulInventario = await conn.query(
      "INSERT INTO inventario set ?;",
      inventario
    );
    console.log(resultImplemento, resulInventario);
    new Notification({
      title: "SCAP Santo Domingo No.1",
      body: implemento.nombre + " se há registrado :)",
    }).show();
    implemento.id = result.insertId;
    return resulInventario;
  } catch (error) {
    console.log(error);
  }
});
ipcMain.handle("getImplementoById", async (event, id) => {
  const conn = await getConnection();
  const result = await conn.query(
    "SELECT * FROM viewimplementosinvenatrio where implementosId = ?",
    id
  );
  console.log("Resultado", result[0]);
  return result[0];
});
ipcMain.handle(
  "updateImplemento",
  async (event, id, implemento, inventario) => {
    try {
      const conn = await getConnection();
      const resultImplemento = await conn.query(
        "UPDATE implementos SET ? where id = ?",
        [implemento, id]
      );
      const resultInventario = await conn.query(
        "UPDATE inventario SET ? where implementosId = ?",
        [inventario, id]
      );
      new Notification({
        title: "SCAP Santo Domingo No.1",
        body: implemento.nombre + " se ha actualizado :)",
      }).show();
      console.log(resultInventario, resultImplemento);
      return resultImplemento;
    } catch (error) {
      new Notification({
        title: "SCAP Santo Domingo No.1",
        body: "Ha ocurrido un error en la actualización :(",
      }).show();
      console.log(error);
    }
  }
);
ipcMain.handle("deleteImplemento", async (event, id) => {
  console.log("id from main.js: ", id);
  try {
    const conn = await getConnection();
    const resultInventario = await conn.query(
      "DELETE FROM inventario WHERE implementosId = ?",
      id
    );
    const resultImplemento = await conn.query(
      "DELETE from implementos where id = ?",
      id
    );
    new Notification({
      title: "SCAP Santo Domingo No.1",
      body: "Se há eliminado el registro :)",
    }).show();
    console.log(resultInventario, resultImplemento);
    return resultInventario;
  } catch (error) {
    new Notification({
      title: "SCAP Santo Domingo No.1",
      body: "Ha ocurrido un error al eliminar el registro :(",
    }).show();
    console.log(error);
  }
});

// ----------------------------------------------------------------
// Funciones de los servicios fijos
// ----------------------------------------------------------------
ipcMain.handle(
  "getServiciosFijos",
  async (event, criterio, criterioContent) => {
    const conn = await getConnection();
    try {
      if (criterio === "all") {
        const results = conn.query(
          "SELECT * FROM viewServicios where tipo='Servicio fijo'order by id asc;"
        );
        console.log(results);
        return results;
      } else {
        const results = conn.query(
          "SELECT * FROM viewServicios where " +
            criterio +
            " like '%" +
            criterioContent +
            "%'" +
            " and tipo='Servicio fijo'order by id asc;"
        );
        console.log(results);
        return results;
      }
    } catch (error) {
      console.log(error);
    }
  }
);
ipcMain.handle("createServiciosFijos", async (event, servicio) => {
  try {
    const conn = await getConnection();
    console.log("Recibido: ", servicio);
    const resultServicio = await conn.query(
      "INSERT INTO servicios set ?;",
      servicio
    );
    servicio.id = resultServicio.insertId;
    console.log(resultServicio);
    event.sender.send("Notificar", {
      success: true,
      title: "Guardado!",
      message: "Se ha guardado un nuevo servicio fijo.",
    });
    return resultServicio;
  } catch (error) {
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al guardar el servicio.",
    });
    console.log(error);
  }
});
ipcMain.handle("getServiciosFijosById", async (event, id) => {
  const conn = await getConnection();
  const result = await conn.query(
    "SELECT * FROM viewServicios where id = ?",
    id
  );

  console.log("Resultado", result[0]);
  return result[0];
});
// ipcMain.handle("getServiciosContratados", async (event) => {
//   const conn = await getConnection();
//   const result = await conn.query("SELECT * FROM viewServiciosFijos");

//   console.log("Resultado", result);
//   return result;
// });
ipcMain.handle("getServiciosDisponibles", async (event) => {
  const conn = await getConnection();
  const result = await conn.query(
    "SELECT * FROM viewServicios where tipo='Servicio fijo';"
  );
  console.log("Resultado", result);
  return result;
});
ipcMain.handle("updateServiciosFijos", async (event, id, servicio) => {
  try {
    const conn = await getConnection();
    const resultServicio = await conn.query(
      "UPDATE servicios SET ? where id = ?",
      [servicio, id]
    );

    new Notification({
      title: "SCAP Santo Domingo No.1",
      body: servicio.nombre + " se ha actualizado :)",
    }).show();
    console.log(resultServicio);
    return resultServicio;
  } catch (error) {
    new Notification({
      title: "SCAP Santo Domingo No.1",
      body: "Ha ocurrido un error en la actualización :(",
    }).show();
    console.log(error);
  }
});
ipcMain.handle("deleteServiciosFijos", async (event, id) => {
  console.log("id from main.js: ", id);
  try {
    const conn = await getConnection();
    const resultServicio = await conn.query(
      "DELETE FROM servicios WHERE id = ?",
      id
    );

    new Notification({
      title: "SCAP Santo Domingo No.1",
      body: "Se há eliminado el registro :)",
    }).show();
    console.log(resultServicio);
    return resultServicio;
  } catch (error) {
    new Notification({
      title: "SCAP Santo Domingo No.1",
      body: "Ha ocurrido un error al eliminar el registro :(",
    }).show();
    console.log(error);
  }
});

ipcMain.handle("getServiciosContratadosById", async (event, id) => {
  const conn = await getConnection();
  const result = await conn.query(
    "SELECT * FROM viewServiciosContratados where id =" +
      id +
      " and estado='Activo';"
  );

  console.log("Resultado", result);
  return result;
});

ipcMain.handle("getContratos", async (event, criterio, criterioContent) => {
  const conn = await getConnection();
  try {
    if (criterio === "all" || criterio === undefined) {
      const result = await conn.query("SELECT * FROM viewContratos ;");
      console.log("Resultado: ", result);
      return result;
    } else {
      const result = await conn.query(
        "SELECT * FROM viewContratos  WHERE " +
          criterio +
          " like '%" +
          criterioContent +
          "%';"
      );
      console.log("Resultado: ", result);
      return result;
    }
  } catch (error) {
    console.log(error);
  }
});
ipcMain.handle("getContratadosById", async (event, servicioId) => {
  const conn = await getConnection();
  const result = await conn.query(
    "SELECT contratosId FROM serviciosContratados WHERE NOT estado='Innactivo' and " +
      "serviciosId=? ;",
    servicioId
  );

  console.log("Resultado: ", result);
  return result;
});
ipcMain.handle("getRecaudaciones", async (event, servicioId, desde, hasta) => {
  const conn = await getConnection();
  console.log("Buscando: " + desde + " " + hasta);
  try {
    if (desde === "all" || desde === undefined) {
      const result = await conn.query(
        "CALL selectRecaudaciones(" + servicioId + ",'2023-01-01',now()); "
      );
      console.log("Resultado: ", result[0]);
      return result[0];
    } else {
      const result = await conn.query(
        "CALL selectRecaudaciones(" +
          servicioId +
          ",'" +
          desde +
          "','" +
          hasta +
          "'); "
      );
      console.log("Resultado: ", result[0]);
      return result[0];
    }
  } catch (error) {
    console.log(error);
  }
});

// ----------------------------------------------------------------
// Funciones de las cuotas
// ----------------------------------------------------------------
ipcMain.handle("getCuotas", async () => {
  const conn = await getConnection();
  const results = conn.query(
    "SELECT * FROM viewServicios where tipo='Cuota'order by id asc;"
  );
  console.log(results);
  return results;
});
ipcMain.handle("getCuotasById", async (event, id) => {
  const conn = await getConnection();
  const result = await conn.query(
    "SELECT * FROM viewServicios where id = ?",
    id
  );

  console.log("Resultado", result[0]);
  return result[0];
});
ipcMain.handle("createCuotas", async (event, cuota) => {
  try {
    const conn = await getConnection();
    console.log("Recibido: ", cuota);
    const resultServicio = await conn.query(
      "INSERT INTO servicios set ?;",
      cuota
    );
    cuota.id = resultServicio.insertId;
    console.log(resultServicio);
    event.sender.send("Notificar", {
      success: true,
      title: "Guardado!",
      message: "Se ha guardado un nuevo servicio ocacional.",
    });
    return resultServicio;
  } catch (error) {
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al guardar el servicio ocacional.",
    });
    console.log(error);
  }
});
ipcMain.handle("createSercicioContratado", async (event, contratar) => {
  try {
    const conn = await getConnection();
    console.log("Recibido: ", contratar);
    const resultServicio = await conn.query(
      "INSERT INTO serviciosContratados set ?;",
      contratar
    );
    contratar.id = resultServicio.insertId;
    console.log(resultServicio);
    event.sender.send("Notificar", {
      success: true,
      title: "Guardado!",
      message: "Contratado.",
    });
    return resultServicio;
  } catch (error) {
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al contratar.",
    });
    console.log(error);
  }
});
ipcMain.handle("updateCuotas", async (event, id, cuota) => {
  try {
    const conn = await getConnection();
    const resultServicio = await conn.query(
      "UPDATE servicios SET ? where id = ?",
      [cuota, id]
    );
    event.sender.send("Notificar", {
      success: true,
      title: "Actualizado!",
      message: "Se ha actualizado el servicio ocacional.",
    });
    console.log(resultServicio);
    return resultServicio;
  } catch (error) {
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al actualizar el servicio ocacional.",
    });
    console.log(error);
  }
});
ipcMain.handle("deleteCuotas", async (event, id) => {
  console.log("id from main.js: ", id);
  const conn = await getConnection();
  try {
    const result = await conn.query("DELETE FROM servicios WHERE id = ?", id);
    event.sender.send("Notificar", {
      success: true,
      title: "Borrado!",
      message: "Se ha eliminado el servicio ocacional.",
    });
    console.log(result);
    return result;
  } catch (error) {
    event.sender.send("Notificar", {
      success: false,
      title: "Error!",
      message: "Ha ocurrido un error al elimiar el registro.",
    });
    console.log(error);
  }
});

// ----------------------------------------------------------------
//   funciones de los Medidores
// ----------------------------------------------------------------
ipcMain.handle("getMedidores", async () => {
  const conn = await getConnection();
  const results = conn.query("Select * from medidores order by id desc;");
  console.log(results);
  return results;
});
ipcMain.handle("getMedidoresDisponibles", async () => {
  const conn = await getConnection();
  const results = conn.query(
    "Select * from implementos where implementos.nombre='Medidor' and implementos.stock>0 order by id desc;"
  );
  console.log(results);
  return results;
});
ipcMain.handle("getMedidorDisponibleById", async (event, id) => {
  const conn = await getConnection();
  const result = await conn.query("Select * from implementos where id = ?", id);
  console.log(result[0]);
  return result[0];
});
ipcMain.handle("createMedidor", async (event, medidor) => {
  try {
    const conn = await getConnection();
    console.log("Recibido: ", medidor);
    //   product.price = parseFloat(product.price);
    const result = await conn.query("Insert into medidores set ?", medidor);
    console.log(result);
    new Notification({
      title: "Electrom Mysql",
      body: "New medidor saved succesfully",
    }).show();
    medidor.id = result.insertId;
    return medidor;
  } catch (error) {
    console.log(error);
  }
});
ipcMain.handle("getMedidorById", async (event, id) => {
  const conn = await getConnection();
  const result = await conn.query("Select * from medidores where id = ?", id);
  console.log(result[0]);
  return result[0];
});
// Borrar en caso de no usar
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
ipcMain.handle("getDatosContratosById", async (event, id) => {
  const conn = await getConnection();
  var mensaje = "NM: ";
  var result = "";
  result = await conn.query(
    "SELECT * FROM viewcontratosconmedidor where id=" + id + ";"
  );

  if (!result.length == 0) {
    mensaje = "Datos contrato con medidor: ";
  } else {
    result = await conn.query(
      "SELECT * FROM viewcontratossinmedidor where id=" + id + ";"
    );
    if (!result.length == 0) {
      mensaje = "Datos contrato sin medidor: ";
    } else {
      mensaje = "No se encontraron datos: ";
    }
  }
  console.log(mensaje, result[0]);
  return result[0];
});

ipcMain.handle("deleteMedidor", async (event, id) => {
  console.log("id from main.js: ", id);
  const conn = await getConnection();
  const result = await conn.query("DELETE from medidores where id = ?", id);
  console.log(result);
  return result;
});
// ----------------------------------------------------------------
// Funciones de los contratos
// ----------------------------------------------------------------
// Verificar contratos anteriores de los socios
ipcMain.handle("getContratosAnterioresByCedula", async (event, cedula) => {
  var sinMedidor;
  var conMedidor = 0;
  var contratos = 0;
  const conn = await getConnection();
  try {
    const sinMedidores = await conn.query(
      "select count(contratos.id)as sinMedidor,contratos.fecha,socios.cedulaPasaporte from contratos " +
        "join socios on socios.id=contratos.sociosId where " +
        "contratos.medidorSn='No' and socios.cedulaPasaporte='" +
        cedula +
        "' ; "
    );
    const conMedidores = await conn.query(
      "select count(contratos.id)as conMedidor,contratos.fecha,socios.cedulaPasaporte from contratos " +
        "join socios on socios.id=contratos.sociosId  join medidores on contratos.id=medidores.contratosId where " +
        " contratos.medidorSn='Si' and socios.cedulaPasaporte='" +
        cedula +
        "'; "
    );
    sinMedidor = sinMedidores[0].sinMedidor;
    conMedidor = conMedidores[0].conMedidor;
    contratos = {
      sinMedidor: sinMedidor,
      conMedidor: conMedidor,
    };
  } catch (err) {
    console.log(err);
  }
  if (sinMedidor == 0 && conMedidor > 0) {
    event.sender.send(
      "showAlertMedidoresExistentes",
      "Este usuario ya registra " +
        conMedidor +
        " contratos con Medidor\nVerifica el registro de contratos antes de crear uno nuevo!"
    );
  } else if (sinMedidor > 0 && conMedidor == 0) {
    event.sender.send(
      "showAlertMedidoresExistentes",
      "Este usuario ya registra " +
        sinMedidor +
        " contratos sin Medidor\nVerifica el registro de contratos antes de crear uno nuevo!"
    );
  } else if (sinMedidor > 0 && conMedidor > 0) {
    event.sender.send(
      "showAlertMedidoresExistentes",
      "Este usuario ya registra " +
        sinMedidor +
        " contratos sin Medidor y " +
        conMedidor +
        " contratos con medidor\nVerifica el registro de contratos antes de crear uno nuevo!"
    );
  }
  console.log(contratos);
  return contratos;
});

ipcMain.handle("getContratosConMedidor", async () => {
  var contratosConMedidor;
  try {
    const conn = await getConnection();
    contratosConMedidor = conn.query(
      "SELECT * from viewContratos where medidorSn='Si' order by contratosId desc;"
    );
  } catch (e) {
    Console.log(e);
  }
  console.log(contratosConMedidor);
  return contratosConMedidor;
});
ipcMain.handle("getContratosSinMedidor", async () => {
  var contratosSinMedidor;
  try {
    const conn = await getConnection();
    contratosSinMedidor = conn.query(
      "SELECT * from viewContratos where medidorSn='No' order by contratosId desc;"
    );
  } catch (e) {
    console.log(e);
  }
  console.log(contratosSinMedidor);
  return contratosSinMedidor;
});
ipcMain.handle("createContrato", async (event, contrato) => {
  try {
    const conn = await getConnection();
    console.log("Recibido: ", contrato);
    const result = await conn.query("Insert into contratos set ?", contrato);
    console.log(result);
    new Notification({
      title: "Registró guardado",
      body: "Se registró un nuevo contrato con éxito",
    }).show();
    contrato.id = result.insertId;
    return contrato;
  } catch (error) {
    console.log(error);
  }
});
ipcMain.handle("updateContrato", async (event, id, contrato) => {
  const conn = await getConnection();
  var result;
  try {
    result = await conn.query("UPDATE contratos  set ? where id = ?", [
      contrato,
      id,
    ]);
  } catch (e) {
    console.log(e);
  }
  console.log(result);
  return result;
});
ipcMain.handle("updateMedidor", async (event, id, medidor) => {
  const conn = await getConnection();
  try {
    var medidorExistente = await conn.query(
      "SELECT id FROM medidores  WHERE contratosId=" + id + ";"
    );
    console.log("resultado de buscar el medidor: " + medidorExistente[0]);
    if (medidorExistente[0] != undefined) {
      console.log("ejecutando if");
      var result = await conn.query("UPDATE medidores set ? where id = ?", [
        medidor,
        medidorExistente[0].id,
      ]);
      new Notification({
        title: "SCAP Santo Domingo No.1",
        body: "El medidor " + medidor.codigo + " se há actualizado :)",
      }).show();
    } else {
      console.log("ejecutando else: ", medidor);
      result = await conn.query("INSERT INTO medidores set ?", medidor);
      new Notification({
        title: "SCAP Santo Domingo No.1",
        body: "El medidor " + medidor.codigo + " se ha registrado :)",
      }).show();
    }
  } catch (e) {
    new Notification({
      title: "SCAP Santo Domingo No.1",
      body: "Ha ocurrido un error en la actualización :(",
    }).show();
    console.log("Error al actualizar el medidor: ", e);
  }
  console.log(result);
  return result;
});

ipcMain.handle(
  "createServiciosContratados",
  async (event, servicioId, contratoId, descuentosId, adquiridoSn) => {
    try {
      const conn = await getConnection();
      console.log("Recibido: ", servicioId);
      const resultContratarServicio = await conn.query(
        "CALL insertServiciosContratados (" +
          servicioId +
          "," +
          contratoId +
          "," +
          descuentosId +
          ",'" +
          adquiridoSn +
          "');"
      );
      console.log(resultContratarServicio);
      // new Notification({
      //   title: "Regístro guardado",
      //   body: "Se registro el servicio",
      // }).show();
      event.sender.send("notifyContratarServicios");
      resultContratarServicio.id = resultContratarServicio.insertId;
      return resultContratarServicio;
    } catch (error) {
      console.log(error);
    }
  }
);

// ----------------------------------------------------------------
// Funciones de las planillas
// ----------------------------------------------------------------
ipcMain.handle("createPlanilla", async (event) => {
  const conn = await getConnection();
  try {
    // Consultamos cuales son los medidores que se encuentran activos para crear el registro de lecturas
    medidoresActivos = await conn.query(
      "select medidores.id,medidores.codigo,medidores.fechaInstalacion,contratos.id as contratosId " +
        "from medidores join contratos on contratos.id=medidores.contratosId " +
        "where contratos.medidorSn='Si'; "
    );
    if (medidoresActivos[0] !== undefined) {
      medidoresActivos.forEach(async (contratoActivo) => {
        console.log("Contrato a buscar: " + contratoActivo.id);
        planillaExiste = await conn.query(
          "SELECT count(planillas.id) as existe from planillas where month" +
            "(planillas.fechaEmision)=month(now()) and year(planillas.fechaEmision)=year(now()) " +
            "and  planillas.medidoresId=" +
            contratoActivo.id +
            ";"
        );
        console.log("existe: " + planillaExiste[0].existe);
        // Si no existe la planilla correspondiente a la fecha se crea a planilla
        if (planillaExiste[0].existe === 0) {
          // Obtenemos el valor de la lectura anterior en caso de existir
          var lecturaAnterior = 0.0;
          const lecturaConsulta = await conn.query(
            " SELECT planillas.lecturaActual from planillas where " +
              "medidoresId=" +
              contratoActivo.id +
              " order by planillas.fechaEmision desc limit 1;"
          );
          if (lecturaConsulta[0] !== undefined) {
            console.log(
              "lectura Anterior: " + lecturaConsulta[0].lecturaActual
            );
            lecturaAnterior = lecturaConsulta[0].lecturaActual;
          }
          const tarifaBase = await conn.query(
            "SELECT * FROM tarifas where tarifa='Familiar';"
          );
          const newPlanilla = {
            //fechaEmision: "now()",
            valor: tarifaBase[0].valor,
            estado: "Por cobrar",
            lecturaActual: 0.0,
            lecturaAnterior: lecturaAnterior,
            Observacion: "NA",
            medidoresId: contratoActivo.id,
            tarifa: "Familiar",
            tarifaValor: tarifaBase[0].valor,
          };
          const resultadoPlanillas = await conn.query(
            "INSERT INTO planillas set ?",
            newPlanilla
          );
          console.log("Resultado de crear planillas: " + resultadoPlanillas);
          // return resultadoPlanillas;
        }
        createCuentaServicios(contratoActivo.contratosId);
      });
    }
  } catch (error) {
    console.log("Error al crear planillas: " + error);
  }
});
async function createCuentaServicios(contratoId) {
  console.log("Consultando encabezado para: " + contratoId);
  const conn = await getConnection();
  let encabezadoId;
  try {
    // Consultamos si existe un encabezado con los detalles de los servicios contratados segun el contrato
    const encabezadoExiste = await conn.query(
      "select count(id) as existe, id from viewEncabezados WHERE tipo='planilla' and   " +
        "month(fechaEmisionEncabezado)=month(now())" +
        " and year(fechaEmisionEncabezado)=year(now()) and contratosId=" +
        contratoId +
        ";"
    );
    if (encabezadoExiste[0].existe === 0) {
      console.log("Existe encabezado: ", encabezadoExiste[0].existe);
      // Si no existe un encabezado para la fecha actual se procede a crear uno
      newEncabezado = {
        fechaPago: null,
        tipo: "planilla",
      };
      const resultEncabezado = await conn.query(
        "INSERT INTO encabezado set ?;",
        newEncabezado
      );
      encabezadoId = resultEncabezado.insertId;
    } else {
      // Si existe el encabezado obtenemos el id del encabezado existente
      encabezadoId = encabezadoExiste[0].id;
    }
    // Consultamos los servicios fijos contratados segun el id del contrato
    const serviciosContratados = await conn.query(
      "SELECT * FROM viewServiciosCancelar WHERE contratosId=" +
        contratoId +
        " AND estado='Activo' AND tipo='Servicio fijo' AND aplazableSn='No';"
    );
    createDetallesServicios(serviciosContratados, encabezadoId);
    // Consultamos los servicios ocacionales, las cuotas y las multas que no son aplazables para
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
    const otrosValores = await conn.query(
      // "SELECT serviciosContratados.id,serviciosContratados.estado," +
      //   "serviciosContratados.fechaEmision,serviciosContratados.valorIndividual,servicios.id as serviciosId," +
      //   "servicios.aplazableSn,servicios.nombre,servicios.descripcion,servicios.tipo,servicios.valor,servicios.valorPagos," +
      //   "tiposdescuento.descripcion as descripcionDescuento,tiposdescuento.valor as valorDescuento " +
      //   "from serviciosContratados join servicios on servicios.id=serviciosContratados.serviciosId join " +
      //   "tiposdescuento on tiposdescuento.id=serviciosContratados.descuentosId " +
      //   "where serviciosContratados.contratosId=" +
      //   contratoId +
      //   " and serviciosContratados.estado='Sin aplicar' and not servicios.tipo='Servicio fijo'"
      "SELECT * FROM viewServiciosCancelar WHERE contratosId=" +
        contratoId +
        " AND estado='Sin aplicar' AND NOT tipo='Servicio fijo';"
    );

    createDetallesServicios(otrosValores, encabezadoId);
  } catch (error) {
    console.log("Error al crear cuentaservicios: " + error);
  }
}
async function createDetallesServicios(serviciosContratados, encabezadoId) {
  const conn = await getConnection();
  serviciosContratados.forEach(async (servicioContratado) => {
    console.log("Servicio contratado a buscar: " + servicioContratado.id);
    // Mediante la fecha consultamos si ya se ha creado un detalle para el servicio en determinado mes.
    // para evitar que el servicio se aplique dos veces.
    detalleServicioExiste = await conn.query(
      "SELECT count(detallesServicio.id) as existe from detallesServicio where month" +
        "(detallesServicio.fechaEmision)=month(now()) and year(detallesServicio.fechaEmision)=year(now()) " +
        "and  detallesServicio.serviciosContratadosId=" +
        servicioContratado.id +
        ";"
    );
    console.log("Detalle servicio existe: " + detalleServicioExiste[0].existe);
    // Si no existen los detalles de servicios correspondiente a la fecha se crean y se añaden al encabezado
    if (detalleServicioExiste[0].existe === 0) {
      let valorPagos = 0.0;
      let total = 0.0;
      // El descuento esta en veremos :(
      if (servicioContratado.valoresDistintos === "Si") {
        if (serviciosContratado.aplazableSn === "Si") {
          total = servicioContratado.valorIndividual;
          valorPagos =
            servicioContratados.valorPagosindividual -
            servicioContratado.valorDescuento;
        } else {
          total = servicioContratado.valorIndividual;
          valorPagos =
            servicioContratado.valorIndividual -
            servicioContratado.valorDescuento;
        }
      } else {
        if (servicioContratado.aplazableSn === "Si") {
          total = servicioContratado.valor;
          valorPagos =
            servicioContratado.valorPagos - servicioContratado.valorDescuento;
        } else {
          total = servicioContratado.valor;
          valorPagos =
            servicioContratado.valorPagos - servicioContratado.valorDescuento;
        }
      }

      const newDetalleServicios = {
        serviciosContratadosId: servicioContratado.id,
        descuento: servicioContratado.valorDescuento,
        subtotal: total,
        total: total - servicioContratado.valorDescuento,
        saldo: total - servicioContratado.valorDescuento,
        abono: valorPagos,
        encabezadosId: encabezadoId,
        estado: "Por cancelar",
        //fechaEmision
      };
      const resultadoDetalleServicio = await conn.query(
        "INSERT INTO detallesServicio set ?",
        newDetalleServicios
      );
      if (!servicioContratado.tipo == "Servicio fijo") {
        const modificaEstado = await conn.query(
          "UPDATE serviciosContratados SET estado='Aplicado' WHERE serviciosContratados.id=" +
            servicioContratado.id +
            ";"
        );
      }

      console.log("Resultado de crear planillas: " + resultadoDetalleServicio);
      return resultadoDetalleServicio;
    }
  });
}

// Cargamos las planillas disponibles
ipcMain.handle("getDatosPlanillas", async () => {
  const conn = await getConnection();
  const results = conn.query(
    "SELECT * FROM viewPlanillas order by fechaEmision desc"
  );
  console.log(results);
  return results;
});
// Funcion que carga los datos de la planilla para editarlos
ipcMain.handle("getPlanillaById", async (event, planillaId) => {
  const conn = await getConnection();
  const results = conn.query(
    "SELECT * FROM viewPlanillas where planillasId=" + planillaId + ";"
  );
  console.log(results);
  return results;
});
// Funcion que relaiza un filtro entre las planillas de acuerdo al codigo del medidor
ipcMain.handle(
  "getDatosPlanillasByCodigo",
  async (
    event,
    codigoMedidor,
    fechaPlanilla,
    estadoPlanilla,
    estadoEdicion
  ) => {
    try {
      const conn = await getConnection();
      conn.query("SET lc_time_names = 'es_ES';");
      const results = conn.query(
        "select planillas.id,planillas.fecha,planillas.valor,planillas.estado,planillas.estadoEdicion," +
          "planillas.lecturaActual,planillas.lecturaAnterior,planillas.observacion," +
          "planillas.codigo as codigoPlanillas," +
          "medidores.codigo as codigoMedidores,socios.cedula, socios.nombre, socios.apellido," +
          "concat(medidores.barrio,', ',medidores.callePrincipal,' y ',medidores.calleSecundaria,', casa: '," +
          "medidores.numeroCasa,' ',medidores.referencia,'-') as ubicacion " +
          "from planillas " +
          "join contratos on contratos.id=planillas.contratosId join medidores on " +
          "contratos.id=medidores.contratosId join socios on socios.id=contratos.sociosId " +
          "where medidores.codigo ='" +
          codigoMedidor +
          "' and monthname(planillas.fecha)like '%" +
          fechaPlanilla +
          "%' " +
          "and planillas.estado like'%" +
          estadoPlanilla +
          "%' and planillas.estadoEdicion like'%" +
          estadoEdicion +
          "%';"
      );
      const parametrosDesechos = await conn.query(
        "select * from parametros where nombreParametro='Tarifa recolección de desechos';"
      );
      console.log(
        "Consulta de los parametrso de desechos: ",
        parametrosDesechos
      );
      const notification = new Notification({
        title: "Exito",
        body: "Se muestran los datos del medidor",
        // icon: "/path/to/icon.png",
        // onClick: () => {
        //   // Acción a realizar al hacer clic en la notificación
        // },
      });
      notification.show();

      console.log(results);
      return results;
    } catch (error) {
      const notification = new Notification({
        title: "Error",
        body: "Es posible que el medidor proporcionado no exista",
        // icon: "/path/to/icon.png",
        // onClick: () => {
        //   // Acción a realizar al hacer clic en la notificación
        // },
      });
      notification.show();
    }
  }
);

// ----------------------------------------------------------------
// Funciones de las lecturas(Planillas)
// ----------------------------------------------------------------
ipcMain.handle(
  "getLecturasByFecha",
  async (event, contratosId, fechaEmision) => {
    const conn = await getConnection();
    try {
      const results = await conn.query(
        "SELECT * FROM viewplanillas WHERE contratosId=" +
          contratosId +
          " and month(fechaEmision)=month('" +
          fechaEmision +
          "') and " +
          " year(fechaEmision)=year('" +
          fechaEmision +
          "');"
      );
      console.log(results[0]);
      return results;
    } catch (error) {
      console.log(error);
    }
  }
);
// ----------------------------------------------------------------
// Funcion que relaiza un filtro entre las cuotas de acuerdo al codigo del medidor
ipcMain.handle("getDatosCuotasByCodigo", async (event, codigoMedidor) => {
  try {
    const conn = await getConnection();
    conn.query("SET lc_time_names = 'es_ES';");
    const results = conn.query(
      "select servicios.id,servicios.fecha,servicios.servicio,servicios.descripcion,servicios.valor," +
        "servicios.estado from servicios join extrasplanilla on servicios.Id=extrasplanilla.serviciosId " +
        "join planillas on planillas.id=extrasplanilla.planillasId join " +
        "contratos on contratos.id=planillas.contratosId join medidores " +
        "on contratos.id=medidores.contratosId where servicios.tipo='cuota'and medidores.codigo='" +
        codigoMedidor +
        "'; "
    );
    const notification = new Notification({
      title: "Exito",
      body: "Se muestran los datos del medidor",
    });
    notification.show();

    console.log(results);
    return results;
  } catch (error) {
    const notification = new Notification({
      title: "Error",
      body: "Es posible que el medidor proporcionado no exista",
    });
    notification.show();
  }
});
// ----------------------------------------------------------------
// Funciones de los detalles
// ----------------------------------------------------------------
// Funcion que carga los servicios de acuerdo al id de la planilla
ipcMain.handle(
  "getDatosServiciosByContratoId",
  async (event, contratoId, fechaEmision, criterio) => {
    const conn = await getConnection();
    if (criterio === "otros") {
      const result = await conn.query(
        "SELECT * FROM viewDetallesServicio WHERE contratosId = " +
          contratoId +
          " and month(fechaEmision) = month('" +
          fechaEmision +
          "') and year(fechaEmision)= year('" +
          fechaEmision +
          "') and not tipo='Servicio fijo';"
      );
      console.log("resultado de buscar servicios: ", result);
      return result;
    } else if (criterio === "fijos") {
      const result = await conn.query(
        "SELECT * FROM viewDetallesServicio WHERE contratosId = " +
          contratoId +
          " and month(fechaEmision) = month('" +
          fechaEmision +
          "') and year(fechaEmision)= year('" +
          fechaEmision +
          "') and  tipo='Servicio fijo';"
      );
      console.log("resultado de buscar servicios: ", result);
      return result;
    } else {
      const result = await conn.query(
        "SELECT * FROM viewDetallesServicio WHERE contratosId = " +
          contratoId +
          " and month(fechaEmision) = month('" +
          fechaEmision +
          "') and year(fechaEmision)= year('" +
          fechaEmision +
          "');"
      );
      console.log("resultado de buscar servicios: ", result);
      return result;
    }
    console.log("fechaEmision recibida: ", fechaEmision, contratoId);

    // const result = await conn.query(
    //   "SELECT * FROM viewservicioscontratados WHERE id = " +
    //     contratoId +
    //     " and month(fechaEmision) = month('" +
    //     fechaEmision +
    //     "') and estado ='Activo';"
    // );
  }
);

ipcMain.handle("updateDetalle", async (event, id, detalle) => {
  const conn = await getConnection();
  console.log("Actualizando detalle: " + id + detalle);
  const result = await conn.query(
    "UPDATE detallesServicio set ? where id = ?",
    [detalle, id]
  );
  console.log(result);
  return result;
});
ipcMain.handle("getDetallesByContratadoId", async (event, contratadoId) => {
  const conn = await getConnection();
  const result = await conn.query(
    "SELECT * FROM detallesServicio WHERE detallesServicio.serviciosContratadosId=" +
      contratadoId +
      ";"
  );
  console.log(result);
  return result;
});
// ----------------------------------------------------------------
// Funcion que consulta las tarifas por el servicio de agua potable
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// Funcion que carga los servicios de acuerdo al id de la planilla
// ----------------------------------------------------------------
ipcMain.handle("getTarifas", async () => {
  const conn = await getConnection();
  const result = await conn.query("SELECT * FROM tarifas;");
  console.log(result);
  return result;
});
// ----------------------------------------------------------------
// Funcion que carga las cuotas de acuerdo al id de la planilla
ipcMain.handle("getCuotasByPlanillaId", async (event, planillaId) => {
  const conn = await getConnection();
  const result = await conn.query(
    "select planillas.codigo,servicios.id," +
      "servicios.servicio,servicios.descripcion,servicios.fecha,servicios.valor,servicios.estado " +
      "from servicios join extrasplanilla on servicios.id=extrasplanilla.serviciosId " +
      "join planillas on planillas.id=extrasplanilla.planillasId " +
      "where servicios.tipo='cuota' and planillas.id=?;",
    planillaId
  );
  console.log(result);
  return result;
});
// ----------------------------------------------------------------

ipcMain.handle("createCuota", async (event, cuota, planillaId) => {
  try {
    const conn = await getConnection();
    console.log("Cuota recibida: ", cuota);

    const result = await conn.query("Insert into servicios set ?", cuota);
    var idNuevoServicio = result.insertId;
    console.log(result.insertId);
    const newExtrasPlanilla = {
      serviciosId: idNuevoServicio,
      planillasId: planillaId,
      descuentosId: 3,
    };
    const result1 = await conn.query(
      "Insert into extrasplanilla set ?",
      newExtrasPlanilla
    );
    console.log(result1);
    new Notification({
      title: "Electrom Mysql",
      body: "New servicio saved succesfully",
    }).show();
    servicio.id = result.insertId;
    return servicio;
  } catch (error) {
    console.log(error);
  }
});
// Funcion que carga multas y descuentos de acuerdo al id de la planilla
ipcMain.handle("getMultasDescByPlanillaId", async (event, planillaId) => {
  const conn = await getConnection();
  const result = await conn.query(
    "select planillas.codigo,multasdescuentos.id,multasdescuentos.tipo," +
      "multasdescuentos.motivo,multasdescuentos.fecha,multasdescuentos.valor from " +
      "multasdescuentos join planillas on planillas.id=multasdescuentos.planillaId " +
      "where planillas.id=?;",
    planillaId
  );
  console.log(result);
  return result;
});
// Funcion que edita los valores permitidos de la planilla
ipcMain.handle("updatePlanilla", async (event, id, planilla) => {
  const conn = await getConnection();
  console.log("Actualizando planilla: " + planilla);
  const result = await conn.query("UPDATE planillas set ? where id = ?", [
    planilla,
    id,
  ]);
  console.log(result);
  return result;
});
// ----------------------------------------------------------------
// Funciones de los parametros
ipcMain.handle("createParametro", async (event, parametro) => {
  try {
    const conn = await getConnection();
    console.log("Recibido: ", parametro);
    parametro.valor = parseFloat(parametro.valor);
    const result = await conn.query("Insert into parametros set ?", parametro);
    console.log(result);
    new Notification({
      title: "Electrom Mysql",
      body: "New parametro saved succesfully",
    }).show();
    parametro.id = result.insertId;
    return parametro;
  } catch (error) {
    console.log(error);
  }
});
ipcMain.handle("getParametros", async () => {
  const conn = await getConnection();
  const results = conn.query("Select * from parametros order by id desc;");
  console.log(results);
  return results;
});
ipcMain.handle("getParametroById", async (event, id) => {
  const conn = await getConnection();
  const result = await conn.query("Select * from parametros where id = ?", id);
  console.log(result[0]);
  return result[0];
});
ipcMain.handle("updateParametro", async (event, id, parametro) => {
  const conn = await getConnection();
  const result = await conn.query("UPDATE parametros set ? where id = ?", [
    parametro,
    id,
  ]);
  console.log(result);
  return result;
});
ipcMain.handle("deleteParametro", async (event, id) => {
  console.log("id from main.js: ", id);
  const conn = await getConnection();
  const result = await conn.query("Delete from parametros where id = ?", id);
  console.log(result);
  return result;
});
function formatearFecha(fecha) {
  const fechaOriginal = new Date(fecha);
  const year = fechaOriginal.getFullYear();
  const month = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
  const day = String(fechaOriginal.getDate()).padStart(2, "0");
  const fechaFormateada = `${year}-${month}-${day}`;
  return fechaFormateada;
}
module.exports = {
  createWindow,
};
