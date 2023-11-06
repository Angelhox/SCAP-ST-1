"use strict";

var _require = require("electron"),
    ipcRenderer = _require.ipcRenderer;

var validator = require("validator");

var Swal = require("sweetalert2");

var mensajeError = document.getElementById("mensajeError");
var usuarioPrimerNombre = document.getElementById("primernombre");
var usuarioSegundoNombre = document.getElementById("segundonombre");
var usuarioPrimerApellido = document.getElementById("primerapellido");
var usuarioSegundoApellido = document.getElementById("segundoapellido");
var usuarioCedula = document.getElementById("cedula");
var usuarioCargo = document.getElementById("cargo");
var usuarioDescripcionCargo = document.getElementById("descripcioncargo");
var usuarioTelefono = document.getElementById("telefono");
var usuarioCorreo = document.getElementById("correo");
var usuarioUsuario = document.getElementById("usuario");
var usuarioClave = document.getElementById("clave");
var usuarioModificacion = document.getElementById("fechamodificacion");
var usuarioAcceso = document.getElementById("accesos");
var usuarioDescripcionAcceso = document.getElementById("descripcionacceso");
var usuariosList = document.getElementById("usuarios");
var empleadosList = document.getElementById("empleados");
var usuarioaccesosn = document.getElementById("accesosn");
var usuarioDarBaja = document.getElementById("bajausuario");
var buscarUsuarios = document.getElementById("buscarUsuarios");
var criterio = document.getElementById("criterio");
var criterioContent = document.getElementById("criterio-content");
var usuarios = [];
var empleados = [];
var editingStatus = false;
var editUsuarioId = "";
var usuarioProceso = "";
usuarioForm.addEventListener("submit", function _callee3(e) {
  var segundoNombreUsuariodf, segundoApellidoUsuariodf, newEmpleado, newUsuario, result, _newEmpleado, _result2;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          e.preventDefault();
          segundoNombreUsuariodf = "NA";
          segundoApellidoUsuariodf = "NA";

          if (usuarioSegundoNombre.value !== null && usuarioSegundoNombre.value !== "") {
            segundoNombreUsuariodf = usuarioSegundoNombre.value;
          }

          if (usuarioSegundoApellido.value !== null && usuarioSegundoApellido.value !== "") {
            segundoApellidoUsuariodf = usuarioSegundoApellido.value;
          }

          if (!validator.isEmpty(usuarioPrimerNombre.value)) {
            _context3.next = 10;
            break;
          }

          mensajeError.textContent = "El primer nombre es obligatorio.";
          usuarioPrimerNombre.focus();
          _context3.next = 94;
          break;

        case 10:
          if (!validator.isEmpty(usuarioPrimerApellido.value)) {
            _context3.next = 15;
            break;
          }

          mensajeError.textContent = "El primer apellido es obligatorio.";
          usuarioPrimerApellido.focus();
          _context3.next = 94;
          break;

        case 15:
          if (!(validator.isEmpty(usuarioCedula.value) || !validator.isLength(usuarioCedula.value, {
            max: 10,
            min: 10
          }))) {
            _context3.next = 20;
            break;
          }

          mensajeError.textContent = "Ingresa un número de cédula válido.";
          usuarioCedula.focus();
          _context3.next = 94;
          break;

        case 20:
          if (!(usuarioCargo.value === "0")) {
            _context3.next = 25;
            break;
          }

          mensajeError.textContent = "Selecciona un cargo válido.";
          usuarioCargo.focus();
          _context3.next = 94;
          break;

        case 25:
          if (!(validator.isEmpty(usuarioDescripcionCargo.value) || usuarioDescripcionCargo.value === "Seleccione un cargo" || !validator.isLength(usuarioDescripcionCargo.value, {
            max: 45
          }))) {
            _context3.next = 30;
            break;
          }

          mensajeError.textContent = "Ingresa una descripción válida.";
          usuarioDescripcionCargo.focus();
          _context3.next = 94;
          break;

        case 30:
          if (!(validator.isEmpty(usuarioTelefono.value) || !validator.isLength(usuarioTelefono.value, {
            min: 10,
            max: 10
          }))) {
            _context3.next = 35;
            break;
          }

          mensajeError.textContent = "Ingresa un número de télefono válido.";
          usuarioTelefono.focus();
          _context3.next = 94;
          break;

        case 35:
          if (!(validator.isEmpty(usuarioCorreo.value) || !validator.isEmail(usuarioCorreo.value))) {
            _context3.next = 40;
            break;
          }

          mensajeError.textContent = "Ingresa un correo electrónico válido.";
          usuarioCorreo.focus();
          _context3.next = 94;
          break;

        case 40:
          if (!(usuarioaccesosn.checked && usuarioUsuario !== null && usuarioUsuario !== " " && usuarioClave !== null && usuarioClave !== " " && usuarioAcceso !== null && usuarioAcceso !== " " && usuarioDescripcionAcceso !== null && usuarioDescripcionAcceso !== " ")) {
            _context3.next = 83;
            break;
          }

          if (!(validator.isEmpty(usuarioUsuario.value) || !validator.isLength(usuarioUsuario.value, {
            min: 10,
            max: 20
          }))) {
            _context3.next = 46;
            break;
          }

          mensajeError.textContent = "Ingresa un nombre de usuario de 10 a 20 caracteres.";
          usuarioUsuario.focus();
          _context3.next = 81;
          break;

        case 46:
          if (!validator.isEmpty(usuarioClave.value)) {
            _context3.next = 51;
            break;
          }

          mensajeError.textContent = "La Contraseña es es obligatoria.";
          usuarioClave.focus();
          _context3.next = 81;
          break;

        case 51:
          if (validator.isLength(usuarioClave.value, {
            min: 10
          })) {
            _context3.next = 56;
            break;
          }

          mensajeError.textContent = "La contraseña debe tener un mínimo de 10 caracteres";
          usuarioClave.focus();
          _context3.next = 81;
          break;

        case 56:
          if (validator.isLength(usuarioClave.value, {
            max: 20
          })) {
            _context3.next = 61;
            break;
          }

          mensajeError.textContent = "La contraseña debe tener un máximo de 20 caracteres";
          usuarioClave.focus();
          _context3.next = 81;
          break;

        case 61:
          if (!(usuarioAcceso.value === "0")) {
            _context3.next = 66;
            break;
          }

          mensajeError.textContent = "Selecciona un nivel de acceso válido.";
          usuarioAcceso.focus();
          _context3.next = 81;
          break;

        case 66:
          if (!(validator.isEmpty(usuarioDescripcionAcceso.value) || usuarioDescripcionAcceso.value === "Seleccione un cargo" || !validator.isLength(usuarioDescripcionAcceso.value, {
            max: 45
          }))) {
            _context3.next = 71;
            break;
          }

          mensajeError.textContent = "Ingresa una descripción de acceso válida.";
          usuarioDescripcionAcceso.focus();
          _context3.next = 81;
          break;

        case 71:
          newEmpleado = {
            primerNombre: usuarioPrimerNombre.value,
            segundoNombre: segundoNombreUsuariodf,
            primerApellido: usuarioPrimerApellido.value,
            segundoApellido: segundoApellidoUsuariodf,
            cedula: usuarioCedula.value,
            telefono: usuarioTelefono.value,
            correo: usuarioCorreo.value,
            usuariosn: "Si",
            cargosId: usuarioCargo.value
          }; // const newCargo = {
          //   cargo: usuarioCargo.value,
          //   cargoDescripcion: usuarioDescripcionCargo.value,
          // };

          newUsuario = {
            usuario: usuarioUsuario.value,
            clave: usuarioClave.value,
            rolesId: usuarioAcceso.value,
            fechaModificacion: usuarioModificacion.value
          };

          if (editingStatus) {
            _context3.next = 80;
            break;
          }

          _context3.next = 76;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("createUsuario", newEmpleado, // newCargo,
          newUsuario));

        case 76:
          result = _context3.sent;
          console.log(result);
          _context3.next = 81;
          break;

        case 80:
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
                      _context.next = 8;
                      break;
                    }

                    // Aquí puedes realizar la acción que desees cuando el usuario confirme.
                    console.log("Editing usuario with electron");
                    _context.next = 4;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("updateUsuario", editUsuarioId, newEmpleado, newUsuario // newCargo
                    ));

                  case 4:
                    _result = _context.sent;
                    editingStatus = false;
                    editUsuarioId = "";
                    console.log(_result);

                  case 8:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 81:
          _context3.next = 94;
          break;

        case 83:
          console.log("Creando un empleado"); //En caso de no haber seleccionado crear usuario no agregamos datos en la tabla usuario

          _newEmpleado = {
            primerNombre: usuarioPrimerNombre.value,
            segundoNombre: segundoNombreUsuariodf,
            primerApellido: usuarioPrimerApellido.value,
            segundoApellido: segundoApellidoUsuariodf,
            cedula: usuarioCedula.value,
            telefono: usuarioTelefono.value,
            correo: usuarioCorreo.value,
            usuariosn: "No",
            cargosId: usuarioCargo.value
          }; // Remplazamos esta parte del codigo para tener los
          // cargos de los empleados creados previamente en una
          // tabla aparte
          // const newCargo = {
          //   cargo: usuarioCargo.value,
          //   cargoDescripcion: usuarioDescripcionCargo.value,
          // };

          if (editingStatus) {
            _context3.next = 92;
            break;
          }

          _context3.next = 88;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("createEmpleado", _newEmpleado // newCargo
          ));

        case 88:
          _result2 = _context3.sent;
          console.log(_result2);
          _context3.next = 94;
          break;

        case 92:
          console.log("Editing empleado with electron");
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
          }).then(function _callee2(result) {
            var _result3;

            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!result.isConfirmed) {
                      _context2.next = 7;
                      break;
                    }

                    _context2.next = 3;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("updateEmpleado", editUsuarioId, _newEmpleado // newCargo
                    ));

                  case 3:
                    _result3 = _context2.sent;
                    editingStatus = false;
                    editUsuarioId = "";
                    console.log(_result3);

                  case 7:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          });

        case 94:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // ----------------------------------------------------------------
// Renderizamos los usuarios del sistema
// ----------------------------------------------------------------

function renderUsuarios(usuarios) {
  usuariosList.innerHTML = "";
  usuarios.forEach(function (usuario) {
    usuariosList.innerHTML += "\n       <tr>\n       \n      <td>".concat(usuario.primerNombre + " " + usuario.segundoNombre, "</td>\n      <td>").concat(usuario.primerApellido + " " + usuario.segundoApellido, "</td>\n      <td>").concat(usuario.cedula, "</td>\n      <td>").concat(usuario.telefono, "</td>\n      <td>").concat(usuario.correo, "</td>\n      <td>").concat(usuario.cargo, "</td>\n      <td>").concat(usuario.rol, "</td>\n      <td>").concat(usuario.usuario, "</td>\n   \n \n     \n      <td>\n      <button onclick=\"editUsuario('").concat(usuario.id, "')\" class=\"btn \">\n      <i class=\"fa-solid fa-user-pen\"></i>\n      </button>\n      </td>\n   </tr>\n      ");
  });
} // ----------------------------------------------------------------
// Renderizamos los empleados no usuarios del sistema
// ----------------------------------------------------------------


function renderEmpleados(empleados) {
  empleadosList.innerHTML = "";
  empleados.forEach(function (empleado) {
    empleadosList.innerHTML += "\n       <tr>    \n      <td>".concat(empleado.primerNombre + " " + empleado.segundoNombre, "</td>\n      <td>").concat(empleado.primerApellido + " " + empleado.segundoApellido, "</td>\n      <td>").concat(empleado.cedula, "</td>\n      <td>").concat(empleado.telefono, "</td>\n      <td>").concat(empleado.correo, "</td>\n      <td>").concat(empleado.cargo, "</td>\n      <td>").concat(empleado.cargoDescripcion, "</td>\n      <td>\n      <button onclick=\"deleteEmpleado('").concat(empleado.id, "','").concat(empleado.primerNombre + " " + empleado.primerApellido, "')\" class=\"btn \"> \n      <i class=\"fa-solid fa-user-minus\"></i>\n      </button>\n      </td>\n      <td>\n      <button onclick=\"editEmpleado('").concat(empleado.id, "','").concat(empleado.primerNombre + " " + empleado.primerApellido, "')\" class=\"btn \">\n      <i class=\"fa-solid fa-user-pen\"></i>\n      </button>\n      </td>\n   </tr>\n      ");
  });
} // ----------------------------------------------------------------
// Cargamos los datos del usuario a editar en los inputs
// ----------------------------------------------------------------


var editUsuario = function editUsuario(id) {
  var usuario;
  return regeneratorRuntime.async(function editUsuario$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          resetForm();
          _context4.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getUsuarioById", id));

        case 3:
          usuario = _context4.sent;
          usuarioDarBaja.disabled = false;
          usuarioaccesosn.checked = true;
          usuarioUsuario.disabled = false;
          usuarioClave.disabled = false;
          usuarioDescripcionAcceso.disabled = false;
          usuarioAcceso.disabled = false;
          usuarioDescripcionAcceso.value = usuario[0].rolDescripcion;
          usuarioPrimerNombre.value = usuario[0].primerNombre;
          usuarioSegundoNombre.value = usuario[0].segundoNombre;
          usuarioPrimerApellido.value = usuario[0].primerApellido;
          usuarioSegundoApellido.value = usuario[0].segundoApellido;
          usuarioCedula.value = usuario[0].cedula;
          usuarioTelefono.value = usuario[0].telefono;
          usuarioCorreo.value = usuario[0].correo;
          usuarioUsuario.value = usuario[0].usuario;
          usuarioClave.value = usuario[0].clave;
          usuarioCargo.selectedIndex = usuario[0].cargosId;
          usuarioDescripcionCargo.value = usuario[0].cargoDescripcion;
          usuarioAcceso.selectedIndex = usuario[0].rolesId;
          usuarioDescripcionAcceso.value = usuario[0].rolDescripcion;
          usuarioModificacion.value = formatearFecha(usuario[0].fechaModificacion);
          usuarioProceso = usuario[0].primerNombre + " " + usuario[0].primerApellido;
          editingStatus = true;
          editUsuarioId = usuario[0].id;
          console.log(usuario[0]);

        case 29:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Cargamos los datos del empleado a editar en los inputs
// ----------------------------------------------------------------


var editEmpleado = function editEmpleado(id) {
  var usuario;
  return regeneratorRuntime.async(function editEmpleado$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          resetForm();
          _context5.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getEmpleadoById", id));

        case 3:
          usuario = _context5.sent;
          console.log("Id del cargo: ", usuario[0].cargosId);
          usuarioPrimerNombre.value = usuario[0].primerNombre;
          usuarioSegundoNombre.value = usuario[0].segundoNombre;
          usuarioPrimerApellido.value = usuario[0].primerApellido;
          usuarioSegundoApellido.value = usuario[0].segundoApellido;
          usuarioCedula.value = usuario[0].cedula;
          usuarioTelefono.value = usuario[0].telefono;
          usuarioCorreo.value = usuario[0].correo;
          usuarioCargo.selectedIndex = usuario[0].cargosId;
          usuarioDescripcionCargo.value = usuario[0].cargoDescripcion;
          editingStatus = true;
          editUsuarioId = usuario[0].id;
          console.log(usuario[0]);

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Eliminar un usuario del sistema
// ----------------------------------------------------------------


var deleteUsuario = function deleteUsuario(id, usuarioNombre) {
  return regeneratorRuntime.async(function deleteUsuario$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log("Recibido: " + id, usuarioNombre);
          Swal.fire({
            title: "¿Quieres borrar el registro de " + usuarioNombre + " ?",
            text: "No podrás deshacer esta acción.",
            icon: "question",
            iconColor: "#f8c471",
            showCancelButton: true,
            confirmButtonColor: "#2874A6",
            cancelButtonColor: "#EC7063 ",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar"
          }).then(function _callee4(result) {
            var _result4;

            return regeneratorRuntime.async(function _callee4$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    if (!result.isConfirmed) {
                      _context6.next = 6;
                      break;
                    }

                    // Aquí puedes realizar la acción que desees cuando el usuario confirme.
                    console.log("id from usuarios.js");
                    _context6.next = 4;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("deleteUsuario", id));

                  case 4:
                    _result4 = _context6.sent;
                    console.log("Resultado usuarios.js", _result4);

                  case 6:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          });

        case 2:
        case "end":
          return _context7.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Dar baja un usuario del sistema
// ----------------------------------------------------------------


var bajaUsuario = function bajaUsuario() {
  return regeneratorRuntime.async(function bajaUsuario$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          if (editingStatus) {
            if (editUsuarioId !== null) {
              Swal.fire({
                title: "¿Quieres dar de baja el usuario de " + usuarioProceso + " ?",
                text: "No podrás deshacer esta acción.",
                icon: "question",
                iconColor: "#f8c471",
                showCancelButton: true,
                confirmButtonColor: "#2874A6",
                cancelButtonColor: "#EC7063 ",
                confirmButtonText: "Sí, continuar",
                cancelButtonText: "Cancelar"
              }).then(function _callee5(result) {
                var _result5;

                return regeneratorRuntime.async(function _callee5$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        if (!result.isConfirmed) {
                          _context8.next = 6;
                          break;
                        }

                        // Aquí puedes realizar la acción que desees cuando el usuario confirme.
                        console.log("id from usuarios.js");
                        _context8.next = 4;
                        return regeneratorRuntime.awrap(ipcRenderer.invoke("deleteUsuario", editUsuarioId));

                      case 4:
                        _result5 = _context8.sent;
                        console.log("Resultado usuarios.js", _result5);

                      case 6:
                      case "end":
                        return _context8.stop();
                    }
                  }
                });
              });
            }
          }

        case 1:
        case "end":
          return _context9.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Eliminar un empleado del sistema
// ----------------------------------------------------------------


var deleteEmpleado = function deleteEmpleado(id, usuarioNombre) {
  return regeneratorRuntime.async(function deleteEmpleado$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          console.log("Recibido: " + id, usuarioNombre);
          Swal.fire({
            title: "¿Quieres borrar el registro de " + usuarioNombre + " ?",
            text: "No podrás deshacer esta acción.",
            icon: "question",
            iconColor: "#f8c471",
            showCancelButton: true,
            confirmButtonColor: "#2874A6",
            cancelButtonColor: "#EC7063 ",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar"
          }).then(function _callee6(result) {
            var _result6;

            return regeneratorRuntime.async(function _callee6$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    if (!result.isConfirmed) {
                      _context10.next = 6;
                      break;
                    }

                    // Aquí puedes realizar la acción que desees cuando el usuario confirme.
                    console.log("id from usuarios.js");
                    _context10.next = 4;
                    return regeneratorRuntime.awrap(ipcRenderer.invoke("deleteEmpleado", id));

                  case 4:
                    _result6 = _context10.sent;
                    console.log("Resultado usuarios.js", _result6);

                  case 6:
                  case "end":
                    return _context10.stop();
                }
              }
            });
          });

        case 2:
        case "end":
          return _context11.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Obtenemos los usuarios del sistema
// ----------------------------------------------------------------


var getUsuarios = function getUsuarios(criterio, criterioContent) {
  return regeneratorRuntime.async(function getUsuarios$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getUsuarios", criterio, criterioContent));

        case 2:
          usuarios = _context12.sent;
          console.log(usuarios);
          renderUsuarios(usuarios);

        case 5:
        case "end":
          return _context12.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Obtenemos los empleados no usuarios del sistema
// ----------------------------------------------------------------


var getEmpleados = function getEmpleados(criterio, criterioContent) {
  return regeneratorRuntime.async(function getEmpleados$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getEmpleados", criterio, criterioContent));

        case 2:
          empleados = _context13.sent;
          console.log(empleados);
          renderEmpleados(empleados);

        case 5:
        case "end":
          return _context13.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Obtenemos los cargos disponibles desde la base de datos
// ----------------------------------------------------------------


var getCargos = function getCargos() {
  return regeneratorRuntime.async(function getCargos$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getCargos"));

        case 2:
          cargos = _context14.sent;
          console.log(cargos);
          cargos.forEach(function (cargo) {
            var option = document.createElement("option");
            option.id = cargo.id;
            option.value = cargo.id;
            option.textContent = cargo.cargo;
            option.setAttribute("data-values", cargo.cargoDescripcion);
            usuarioCargo.appendChild(option);
          });

        case 5:
        case "end":
          return _context14.stop();
      }
    }
  });
}; // ----------------------------------------------------------------
// Obtenemos los cargos disponibles desde la base de datos
// ----------------------------------------------------------------


var getAccesos = function getAccesos() {
  return regeneratorRuntime.async(function getAccesos$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("getAccesos"));

        case 2:
          roles = _context15.sent;
          console.log(roles);
          roles.forEach(function (rol) {
            var option = document.createElement("option");
            option.id = rol.id;
            option.value = rol.id;
            option.textContent = rol.rol;
            option.setAttribute("data-values", rol.rolDescripcion);
            usuarioAcceso.appendChild(option);
          });

        case 5:
        case "end":
          return _context15.stop();
      }
    }
  });
};

usuarioCargo.addEventListener("change", function (event) {
  var seleccionado = usuarioCargo.options[usuarioCargo.selectedIndex];
  var dataValues = seleccionado.getAttribute("data-values");
  var selected = usuarioCargo.value;
  usuarioDescripcionCargo.value = dataValues;
  console.log("Seleccionado: ", selected, dataValues);
});
usuarioAcceso.addEventListener("change", function (event) {
  var seleccionado = usuarioAcceso.options[usuarioAcceso.selectedIndex];
  var dataValues = seleccionado.getAttribute("data-values");
  var selected = usuarioAcceso.value;
  usuarioDescripcionAcceso.value = dataValues;
  console.log("Seleccionado: ", selected, dataValues);
});

criterio.onchange = function _callee7() {
  var criterioSeleccionado, criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function _callee7$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          criterioSeleccionado = criterio.value;
          console.log("Seleccionado: ", criterioSeleccionado);

          if (!(criterioSeleccionado === "all")) {
            _context16.next = 13;
            break;
          }

          // criterioContent.textContent = "";
          criterioContent.value = "";
          criterioContent.readOnly = true;
          criterioBuscar = "all";
          criterioContentBuscar = "all";
          _context16.next = 9;
          return regeneratorRuntime.awrap(getEmpleados(criterioBuscar, criterioContentBuscar));

        case 9:
          _context16.next = 11;
          return regeneratorRuntime.awrap(getUsuarios(criterioBuscar, criterioContentBuscar));

        case 11:
          _context16.next = 14;
          break;

        case 13:
          criterioContent.readOnly = false;

        case 14:
        case "end":
          return _context16.stop();
      }
    }
  });
};

buscarUsuarios.onclick = function _callee8() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function _callee8$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          criterioBuscar = criterio.value;
          criterioContentBuscar = criterioContent.value;
          console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
          _context17.next = 5;
          return regeneratorRuntime.awrap(getEmpleados(criterioBuscar, criterioContentBuscar));

        case 5:
          _context17.next = 7;
          return regeneratorRuntime.awrap(getUsuarios(criterioBuscar, criterioContentBuscar));

        case 7:
        case "end":
          return _context17.stop();
      }
    }
  });
};

function init() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function init$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          usuarioModificacion.value = formatearFecha(new Date());
          criterioBuscar = "all";
          criterioContentBuscar = "all";
          getUsuarios(criterioBuscar, criterioContentBuscar);
          getEmpleados(criterioBuscar, criterioContentBuscar);
          _context18.next = 7;
          return regeneratorRuntime.awrap(getCargos());

        case 7:
          _context18.next = 9;
          return regeneratorRuntime.awrap(getAccesos());

        case 9:
        case "end":
          return _context18.stop();
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

function habilitarUsuario() {
  console.log("Habilitar Usuario");

  if (usuarioaccesosn.checked) {
    usuarioUsuario.disabled = false;
    usuarioClave.disabled = false;
    usuarioAcceso.disabled = false;
    usuarioDescripcionAcceso.disabled = false; //usuarioModificacion.disabled = false;
  } else {
    usuarioUsuario.disabled = true;
    usuarioClave.disabled = true;
    usuarioAcceso.disabled = true;
    usuarioDescripcionAcceso.disabled = true; //usuarioModificacion.disabled = true;
  }
} // ----------------------------------------------------------------
// Resetear el formulario despues de actualizar


function resetFormAfterUpdate() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function resetFormAfterUpdate$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          criterioBuscar = criterio.value;
          criterioContentBuscar = criterioContent.value;
          console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
          _context19.next = 5;
          return regeneratorRuntime.awrap(getUsuarios(criterioBuscar, criterioContentBuscar));

        case 5:
          _context19.next = 7;
          return regeneratorRuntime.awrap(getEmpleados(criterioBuscar, criterioContentBuscar));

        case 7:
          mensajeError.textContent = "";

        case 8:
        case "end":
          return _context19.stop();
      }
    }
  });
} // ----------------------------------------------------------------
// Resetear el formulario despues de guardar o eliminar


function resetFormAfterSave() {
  var criterioBuscar, criterioContentBuscar;
  return regeneratorRuntime.async(function resetFormAfterSave$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          criterioBuscar = criterio.value;
          criterioContentBuscar = criterioContent.value;
          console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
          _context20.next = 5;
          return regeneratorRuntime.awrap(getEmpleados(criterioBuscar, criterioContentBuscar));

        case 5:
          _context20.next = 7;
          return regeneratorRuntime.awrap(getUsuarios(criterioBuscar, criterioContentBuscar));

        case 7:
          editingStatus = false;
          editUsuarioId = "";
          usuarioDarBaja.disabled = true;
          usuarioForm.reset();
          usuarioUsuario.disabled = true;
          usuarioClave.disabled = true;
          usuarioDescripcionAcceso.disabled = true;
          usuarioAcceso.disabled = true;
          usuarioAcceso.selectedIndex = 0;
          mensajeError.textContent = "";
          usuarioModificacion.value = formatearFecha(new Date());

        case 18:
        case "end":
          return _context20.stop();
      }
    }
  });
} // ----------------------------------------------------------------
// Resetear el formulario


function resetForm() {
  editingStatus = false;
  editUsuarioId = "";
  usuarioDarBaja.disabled = true;
  usuarioForm.reset();
  usuarioUsuario.disabled = true;
  usuarioClave.disabled = true;
  usuarioDescripcionAcceso.disabled = true;
  usuarioAcceso.disabled = true;
  usuarioAcceso.selectedIndex = 0;
  mensajeError.textContent = "";
  usuarioModificacion.value = formatearFecha(new Date());
} // ----------------------------------------------------------------
// funciones del navbar


function cerrarSesion() {
  ipcRenderer.send("cerrarSesion");
}

ipcRenderer.on("sesionCerrada", function _callee9() {
  var acceso, url;
  return regeneratorRuntime.async(function _callee9$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Login";
          _context21.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context21.stop();
      }
    }
  });
});

var abrirInicio = function abrirInicio() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirInicio$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Inicio";
          _context22.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context22.stop();
      }
    }
  });
};

var abrirSocios = function abrirSocios() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirSocios$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Socios";
          _context23.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context23.stop();
      }
    }
  });
};

var abrirUsuarios = function abrirUsuarios() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirUsuarios$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Usuarios";
          _context24.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context24.stop();
      }
    }
  });
};

var abrirPagos = function abrirPagos() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirPagos$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Pagos";
          _context25.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context25.stop();
      }
    }
  });
};

var abrirPlanillas = function abrirPlanillas() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirPlanillas$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Planillas";
          _context26.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context26.stop();
      }
    }
  });
};

var abrirContratos = function abrirContratos() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirContratos$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Contratos";
          _context27.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context27.stop();
      }
    }
  });
};

var abrirServicios = function abrirServicios() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirServicios$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Servicios fijos";
          _context28.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context28.stop();
      }
    }
  });
};

var abrirCuotas = function abrirCuotas() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirCuotas$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Servicios ocacionales";
          _context29.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context29.stop();
      }
    }
  });
};

init();