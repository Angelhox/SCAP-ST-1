const { ipcRenderer } = require("electron");
const validator = require("validator");
const mensajeError = document.getElementById("mensajeError");
const usuarioPrimerNombre = document.getElementById("primernombre");
const usuarioSegundoNombre = document.getElementById("segundonombre");
const usuarioPrimerApellido = document.getElementById("primerapellido");
const usuarioSegundoApellido = document.getElementById("segundoapellido");
const usuarioCedula = document.getElementById("cedula");
const usuarioCargo = document.getElementById("cargo");
const usuarioDescripcionCargo = document.getElementById("descripcioncargo");
const usuarioTelefono = document.getElementById("telefono");
const usuarioCorreo = document.getElementById("correo");
const usuarioUsuario = document.getElementById("usuario");
const usuarioClave = document.getElementById("clave");
const usuarioModificacion = document.getElementById("fechamodificacion");
const usuarioAcceso = document.getElementById("acceso");
const usuarioDescripcionAcceso = document.getElementById("descripcionacceso");
const usuariosList = document.getElementById("usuarios");
const empleadosList = document.getElementById("empleados");
const usuarioaccesosn = document.getElementById("accesosn");
const usuarioDarBaja = document.getElementById("bajausuario");
let usuarios = [];
let empleados = [];
let editingStatus = false;
let editUsuarioId = "";
usuarioForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  var segundoNombreUsuariodf = "NA";
  var segundoApellidoUsuariodf = "NA";
  if (
    usuarioSegundoNombre.value !== null &&
    usuarioSegundoNombre.value !== ""
  ) {
    segundoNombreUsuariodf = usuarioSegundoNombre.value;
  }
  if (
    usuarioSegundoApellido.value !== null &&
    usuarioSegundoApellido.value !== ""
  ) {
    segundoApellidoUsuariodf = usuarioSegundoApellido.value;
  }

  if (validator.isEmpty(usuarioPrimerNombre.value)) {
    mensajeError.textContent = "El primer nombre es obligatorio.";
    usuarioPrimerNombre.focus();
  } else if (validator.isEmpty(usuarioPrimerApellido.value)) {
    mensajeError.textContent = "El primer apellido es obligatorio.";
    usuarioPrimerApellido.focus();
  } else if (validator.isEmpty(usuarioCedula.value)) {
    mensajeError.textContent = "La cedula es obligatoria.";
    socioCedula.focus();
  } else if (validator.isEmpty(usuarioTelefono.value)) {
    mensajeError.textContent = "el teléfono es obligatorio.";
    usuarioTelefono.focus();
  } else if (validator.isEmpty(usuarioCorreo.value)) {
    mensajeError.textContent = "El correo es obligatorio.";
    usuarioCorreo.focus();
  } else if (usuarioCargo.value === "0") {
    mensajeError.textContent = "El cargo es obligatorio.";
    usuarioCargo.focus();
  } else if (usuarioDescripcionCargo.value === "Seleccione un cargo") {
    mensajeError.textContent = "La descripción del cargo es obligatoria.";
    usuarioDescripcionCargo.focus();
  } else {
    if (
      usuarioaccesosn.checked &&
      usuarioUsuario !== null &&
      usuarioUsuario !== " " &&
      usuarioClave !== null &&
      usuarioClave !== " " &&
      usuarioAcceso !== null &&
      usuarioAcceso !== " " &&
      usuarioDescripcionAcceso !== null &&
      usuarioDescripcionAcceso !== " "
    ) {
      if (validator.isEmpty(usuarioUsuario.value)) {
        mensajeError.textContent = "El usuario es obligatorio.";
        usuarioUsuario.focus();
      } else if (validator.isEmpty(usuarioClave.value)) {
        mensajeError.textContent = "La Contraseña es es obligatoria.";
        usuarioClave.focus();
      } else if (validator.isEmpty(usuarioAcceso.value)) {
        mensajeError.textContent = "El Acceso es obligatorio.";
        usuarioAcceso.focus();
      } else if (validator.isEmpty(usuarioDescripcionAcceso.value)) {
        mensajeError.textContent = "La descripcion del acceso es obligatoria.";
        usuarioDescripcionAcceso.focus();
      } else {
        const newEmpleado = {
          primerNombre: usuarioPrimerNombre.value,
          segundoNombre: segundoNombreUsuariodf,
          primerApellido: usuarioPrimerApellido.value,
          segundoApellido: segundoApellidoUsuariodf,
          cedula: usuarioCedula.value,
          telefono: usuarioTelefono.value,
          correo: usuarioCorreo.value,
          usuariosn: "Si",
          cargosId: usuarioCargo.value,
        };
        // const newCargo = {
        //   cargo: usuarioCargo.value,
        //   cargoDescripcion: usuarioDescripcionCargo.value,
        // };
        const newUsuario = {
          usuario: usuarioUsuario.value,
          clave: usuarioClave.value,
          rol: usuarioAcceso.value,
          rolDescripcion: usuarioDescripcionAcceso.value,
          fechaModificacion: usuarioModificacion.value,
        };
        if (!editingStatus) {
          const result = await ipcRenderer.invoke(
            "createUsuario",
            newEmpleado,
            // newCargo,
            newUsuario
          );
          console.log(result);
        } else {
          console.log("Editing usuario with electron");
          const result = await ipcRenderer.invoke(
            "updateUsuario",
            editUsuarioId,
            newEmpleado,
            newUsuario
            // newCargo
          );
          editingStatus = false;
          editUsuarioId = "";
          console.log(result);
        }
        getUsuarios();
        getEmpleados();
        resetForm();
        usuarioPrimerNombre.focus();
      }
    } else {
      console.log("Creando un empleado");
      //En caso de no haber seleccionado crear usuario no agregamos datos en la tabla usuario
      const newEmpleado = {
        primerNombre: usuarioPrimerNombre.value,
        segundoNombre: segundoNombreUsuariodf,
        primerApellido: usuarioPrimerApellido.value,
        segundoApellido: segundoApellidoUsuariodf,
        cedula: usuarioCedula.value,
        telefono: usuarioTelefono.value,
        correo: usuarioCorreo.value,
        usuariosn: "No",
        cargosId: usuarioCargo.value,
      };
      // Remplazamos esta parte del codigo para tener los
      // cargos de los empleados creados previamente en una
      // tabla aparte
      // const newCargo = {
      //   cargo: usuarioCargo.value,
      //   cargoDescripcion: usuarioDescripcionCargo.value,
      // };

      if (!editingStatus) {
        const result = await ipcRenderer.invoke(
          "createEmpleado",
          newEmpleado
          // newCargo
        );
        console.log(result);
      } else {
        console.log("Editing empleado with electron");
        const result = await ipcRenderer.invoke(
          "updateEmpleado",
          editUsuarioId,
          newEmpleado
          // newCargo
        );
        editingStatus = false;
        editUsuarioId = "";
        console.log(result);
      }
      getUsuarios();
      getEmpleados();
      getCargos();

      resetForm();
      usuarioPrimerNombre.focus();
    }
  }
});
// ----------------------------------------------------------------
// Renderizamos los usuarios del sistema
// ----------------------------------------------------------------
function renderUsuarios(usuarios) {
  usuariosList.innerHTML = "";
  usuarios.forEach((usuario) => {
    usuariosList.innerHTML += `
       <tr>
       
      <td>${usuario.primerNombre + " " + usuario.segundoNombre}</td>
      <td>${usuario.primerApellido + " " + usuario.segundoApellido}</td>
      <td>${usuario.cedula}</td>
      <td>${usuario.telefono}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.cargo}</td>
      <td>${usuario.rol}</td>
      <td>${usuario.usuario}</td>
   
 
     
      <td>
      <button onclick="editUsuario('${usuario.id}')" class="btn ">
      <i class="fa-solid fa-user-pen"></i>
      </button>
      </td>
   </tr>
      `;
  });
}
// ----------------------------------------------------------------
// Renderizamos los empleados no usuarios del sistema
// ----------------------------------------------------------------
function renderEmpleados(empleados) {
  empleadosList.innerHTML = "";
  empleados.forEach((empleado) => {
    empleadosList.innerHTML += `
       <tr>    
      <td>${empleado.primerNombre + " " + empleado.segundoNombre}</td>
      <td>${empleado.primerApellido + " " + empleado.segundoApellido}</td>
      <td>${empleado.cedula}</td>
      <td>${empleado.telefono}</td>
      <td>${empleado.correo}</td>
      <td>${empleado.cargo}</td>
      <td>${empleado.cargoDescripcion}</td>
      <td>
      <button onclick="deleteEmpleado('${empleado.id}')" class="btn "> 
      <i class="fa-solid fa-user-minus"></i>
      </button>
      </td>
      <td>
      <button onclick="editEmpleado('${empleado.id}')" class="btn ">
      <i class="fa-solid fa-user-pen"></i>
      </button>
      </td>
   </tr>
      `;
  });
}
// ----------------------------------------------------------------
// Cargamos los datos del usuario a editar en los inputs
// ----------------------------------------------------------------
const editUsuario = async (id) => {
  resetForm();
  const usuario = await ipcRenderer.invoke("getUsuarioById", id);
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
  usuarioCargo.value = usuario[0].cargo;
  usuarioDescripcionCargo.value = usuario[0].cargoDescripcion;
  usuarioAcceso.value = usuario[0].rol;
  usuarioDescripcionAcceso.value = usuario[0].rolDescripcion;
  usuarioModificacion.value = formatearFecha(usuario[0].fechaModificacion);
  editingStatus = true;
  editUsuarioId = usuario[0].id;
  console.log(usuario[0]);
};
// ----------------------------------------------------------------
// Cargamos los datos del empleado a editar en los inputs
// ----------------------------------------------------------------
const editEmpleado = async (id) => {
  resetForm();
  const usuario = await ipcRenderer.invoke("getEmpleadoById", id);
  usuarioPrimerNombre.value = usuario[0].primerNombre;
  usuarioSegundoNombre.value = usuario[0].segundoNombre;
  usuarioPrimerApellido.value = usuario[0].primerApellido;
  usuarioSegundoApellido.value = usuario[0].segundoApellido;
  usuarioCedula.value = usuario[0].cedula;
  usuarioTelefono.value = usuario[0].telefono;
  usuarioCorreo.value = usuario[0].correo;
  usuarioCargo.value = usuario[0].cargo;
  usuarioDescripcionCargo.value = usuario[0].cargoDescripcion;
  editingStatus = true;
  editUsuarioId = usuario[0].id;
  console.log(usuario[0]);
};
// ----------------------------------------------------------------
// Eliminar un usuario del sistema
// ----------------------------------------------------------------
const deleteUsuario = async (id) => {
  const response = confirm(
    "Estas seguro de eliminar este usuario de forma permanente?"
  );
  if (response) {
    console.log("id from usuarios.js");
    const result = await ipcRenderer.invoke("deleteUsuario", id);
    console.log("Resultado usuarios.js", result);
    getUsuarios();
    getEmpleados();
    getCargos();
    resetForm();
  }
};
// ----------------------------------------------------------------
// Dar baja un usuario del sistema
// ----------------------------------------------------------------
const bajaUsuario = async () => {
  if (editingStatus) {
    if (editUsuarioId !== null) {
      const response = confirm(
        "Estas seguro en dar de baja a este usuario de forma permanente?"
      );
      if (response) {
        console.log("id from usuarios.js");
        const result = await ipcRenderer.invoke("deleteUsuario", editUsuarioId);
        console.log("Resultado usuarios.js", result);
        getUsuarios();
        getEmpleados();
        getCargos();
        resetForm();
      }
    }
  }
};
// ----------------------------------------------------------------
// Eliminar un empleado del sistema
// ----------------------------------------------------------------
const deleteEmpleado = async (id) => {
  const response = confirm(
    "Estas seguro de eliminar un empleado de forma permanente?"
  );
  if (response) {
    console.log("id from usuarios.js");
    const result = await ipcRenderer.invoke("deleteEmpleado", id);
    console.log("Resultado usuarios.js", result);
    getUsuarios();
    getEmpleados();
    resetForm();
  }
};
// ----------------------------------------------------------------
// Obtenemos los usuarios del sistema
// ----------------------------------------------------------------
const getUsuarios = async () => {
  usuarios = await ipcRenderer.invoke("getUsuarios");
  console.log(usuarios);
  renderUsuarios(usuarios);
};
// ----------------------------------------------------------------
// Obtenemos los empleados no usuarios del sistema
// ----------------------------------------------------------------
const getEmpleados = async () => {
  empleados = await ipcRenderer.invoke("getEmpleados");
  console.log(empleados);
  renderEmpleados(empleados);
};
// ----------------------------------------------------------------
// Obtenemos los cargos disponibles desde la base de datos
// ----------------------------------------------------------------
const getCargos = async () => {
  cargos = await ipcRenderer.invoke("getCargos");
  console.log(cargos);
  cargos.forEach((cargo) => {
    const option = document.createElement("option");
    option.id = cargo.id;
    option.value = cargo.id;
    option.textContent = cargo.cargo;
    option.setAttribute("data-values", cargo.cargoDescripcion);
    usuarioCargo.appendChild(option);
    document.getElementById(cargo.id).addEventListener("select", (event) => {
      alert("Has hecho clic en la Opción 3");
    });
  });
};
usuarioCargo.addEventListener("change", (event) => {
  let seleccionado = usuarioCargo.options[usuarioCargo.selectedIndex];
  let dataValues = seleccionado.getAttribute("data-values");
  let selected = usuarioCargo.value;
  usuarioDescripcionCargo.value = dataValues;
  console.log("Seleccionado: ", selected, dataValues);
});
async function init() {
  usuarioModificacion.value = formatearFecha(new Date());
  await getUsuarios();
  await getEmpleados();
  await getCargos();
}
function formatearFecha(fecha) {
  const fechaOriginal = new Date(fecha);
  const year = fechaOriginal.getFullYear();
  const month = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
  const day = String(fechaOriginal.getDate()).padStart(2, "0");
  const fechaFormateada = `${year}-${month}-${day}`;
  return fechaFormateada;
}
function habilitarUsuario() {
  console.log("Habilitar Usuario");
  if (usuarioaccesosn.checked) {
    usuarioUsuario.disabled = false;
    usuarioClave.disabled = false;
    usuarioAcceso.disabled = false;
    usuarioDescripcionAcceso.disabled = false;
    //usuarioModificacion.disabled = false;
  } else {
    usuarioUsuario.disabled = true;
    usuarioClave.disabled = true;
    usuarioAcceso.disabled = true;
    usuarioDescripcionAcceso.disabled = true;
    //usuarioModificacion.disabled = true;
  }
}
// ----------------------------------------------------------------
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
  mensajeError.textContent = "";
  usuarioModificacion.value = formatearFecha(new Date());
}
// ----------------------------------------------------------------
// funciones del navbar
const abrirInicio = async () => {
  const url = "src/ui/principal.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirSocios = async () => {
  const url = "src/ui/socios.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirUsuarios = async () => {
  const url = "src/ui/usuarios.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirPagos = async () => {
  const url = "src/ui/planillas.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirPlanillas = async () => {
  const url = "src/ui/planillas-cuotas.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirParametros = async () => {
  const url = "src/ui/parametros.html";
  await ipcRenderer.send("abrirInterface", url);
};
const abrirImplementos = async () => {
  const url = "src/ui/implementos.html";
  await ipcRenderer.send("abrirInterface", url);
};
function mostrarLogin() {
  const dialog = document.getElementById("loginDialog");
  dialog.showModal();
}
const abrirContratos = async () => {
  const url = "src/ui/medidores.html";
  await ipcRenderer.send("abrirInterface", url);
};
init();
