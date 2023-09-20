const { ipcRenderer } = require("electron");
const validator = require("validator");

const mensajeError = document.getElementById("mensajeError");
const socioPrimerNombre = document.getElementById("primernombre");
const socioSegundoNombre = document.getElementById("segundonombre");
const socioPrimerApellido = document.getElementById("primerapellido");
const socioSegundoApellido = document.getElementById("segundoapellido");
const socioCedula = document.getElementById("cedula");
const socioNacimiento = document.getElementById("nacimiento");
const socioFijo = document.getElementById("fijo");
const socioMovil = document.getElementById("movil");
const socioCorreo = document.getElementById("correo");
const socioProvincia = document.getElementById("provincia");
const socioCanton = document.getElementById("canton");
const socioParroquia = document.getElementById("parroquia");
const socioBarrio = document.getElementById("barrio");
const socioPrincipal = document.getElementById("principal");
const socioSecundaria = document.getElementById("secundaria");
const socioCasa = document.getElementById("numerocasa");
const socioReferencia = document.getElementById("referencia");
const sociosList = document.getElementById("socios");
let socios = [];
let editingStatus = false;
let editSocioId = "";
socioForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  var segundoNombreSociodf = "NA";
  var segundoApellidoSociodf = "NA";
  var correoSociodf = "NA";
  var fijoSociodf = "9999999999";
  var movilSociodf = "9999999999";
  var casaSociodf = "NA";
  var barrioSociodf = "NA";
  var principalSociodf = "NA";
  var secundariaSociodf = "NA";
  var parroquiaSociodf = "NA";

  if (socioSegundoNombre.value !== null && socioSegundoNombre.value !== "") {
    segundoNombreSociodf = socioSegundoNombre.value;
  }

  if (
    socioSegundoApellido.value !== null &&
    socioSegundoApellido.value !== ""
  ) {
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
  if (validator.isEmpty(socioPrimerNombre.value)) {
    mensajeError.textContent = "El primer nombre es obligatorio.";
    socioPrimerNombre.focus();
  } else if (validator.isEmpty(socioPrimerApellido.value)) {
    mensajeError.textContent = "El primer apellido es obligatorio.";
    socioPrimerApellido.focus();
  } else if (validator.isEmpty(socioCedula.value)) {
    mensajeError.textContent = "La cedula es obligatoria.";
    socioCedula.focus();
  } else if (validator.isEmpty(socioNacimiento.value)) {
    mensajeError.textContent = "La fecha de nacimiento es obligatoria.";
    socioNacimiento.focus();
  } else if (validator.isEmpty(socioProvincia.value)) {
    mensajeError.textContent = "La provincia es obligatoria.";
    socioProvincia.focus();
  } else if (validator.isEmpty(socioCanton.value)) {
    mensajeError.textContent = "El cantón es obligatorio.";
    socioCanton.focus();
  } else if (validator.isEmpty(socioReferencia.value)) {
    mensajeError.textContent = "La referencia es obligatoria.";
    socioReferencia.focus();
  } else {
    const newSocio = {
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
      referencia: socioReferencia.value,
    };
    if (!editingStatus) {
      const result = await ipcRenderer.invoke("createSocio", newSocio);
      console.log(result);
    } else {
      console.log("Editing socio with electron");
      const result = await ipcRenderer.invoke(
        "updateSocio",
        editSocioId,
        newSocio
      );
      editingStatus = false;
      editSocioId = "";
      console.log(result);
    }
    getSocios();
    socioForm.reset();
    socioPrimerNombre.focus();
  }
});
function renderSocios(socios) {
  sociosList.innerHTML = "";
  socios.forEach((socio) => {
    var telefonoValido = socio.telefonoMovil;
    if (telefonoValido == null || telefonoValido == " ") {
      telefonoValido = socio.telefonoFijo;
    }
    sociosList.innerHTML += `
       <tr>
   
      <td>${socio.primerNombre + " " + socio.segundoNombre}</td>
      <td>${socio.primerApellido + " " + socio.segundoApellido}</td>
      <td>${socio.cedulaPasaporte}</td>
      <td>${telefonoValido}</td>
      <td>${socio.correo}</td>
      <td>${calcularEdad(socio.fechaNacimiento)}</td>
      <td>${
        socio.provincia +
        ", " +
        socio.canton +
        ", " +
        socio.parroquia +
        ", " +
        socio.barrio
      }</td>
      <td>
      <button onclick="deleteSocio('${socio.id}')" class="btn "> 
      <i class="fa-solid fa-user-minus"></i>
      </button>
      </td>
      <td>
      <button onclick="editSocio('${socio.id}')" class="btn ">
      <i class="fa-solid fa-user-pen"></i>
      </button>
      </td>
   </tr>
      `;
  });
}
const editSocio = async (id) => {
  const socio = await ipcRenderer.invoke("getSocioById", id);
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
};
const deleteSocio = async (id) => {
  const response = confirm("Estas seguro de eliminar este socio?");
  if (response) {
    console.log("id from socios.js");
    const result = await ipcRenderer.invoke("deleteSocio", id);
    console.log("Resultado socios.js", result);
    getSocios();
  }
};
const getSocios = async () => {
  socios = await ipcRenderer.invoke("getSocios");
  console.log(socios);
  renderSocios(socios);
};
async function init() {
  await getSocios();
}
function calcularEdad(fechaNacimiento) {
  const fechaActual = new Date();
  const fechaNacimientoDate = new Date(fechaNacimiento);

  let edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();

  // Verificar si aún no ha pasado el cumpleaños de este año.
  const mesActual = fechaActual.getMonth();
  const diaActual = fechaActual.getDate();
  const mesNacimiento = fechaNacimientoDate.getMonth();
  const diaNacimiento = fechaNacimientoDate.getDate();

  if (
    mesActual < mesNacimiento ||
    (mesActual === mesNacimiento && diaActual < diaNacimiento)
  ) {
    edad--;
  }

  return edad;
}
function formatearFecha(fecha) {
  const fechaOriginal = new Date(fecha);
  const year = fechaOriginal.getFullYear();
  const month = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
  const day = String(fechaOriginal.getDate()).padStart(2, "0");
  const fechaFormateada = `${year}-${month}-${day}`;
  return fechaFormateada;
}
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
const abrirContratos = async () => {
  const url = "src/ui/medidores.html";
  await ipcRenderer.send("abrirInterface", url);
};
function mostrarLogin() {
  const dialog = document.getElementById("loginDialog");
  dialog.showModal();
}
init();
