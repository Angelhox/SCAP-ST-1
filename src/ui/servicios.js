// ----------------------------------------------------------------
// Librerias
// ----------------------------------------------------------------
const { ipcRenderer } = require("electron");
const validator = require("validator");
// ----------------------------------------------------------------
const servicioNombre = document.getElementById("nombre");
const servicioDescripcion = document.getElementById("descripcion");
// const servicioTipo = document.getElementById("tipo");
const servicioValor = document.getElementById("valor");
const serviciosList = document.getElementById("servicios");
let servicios = [];
let editingStatus = false;
let editServicioId = "";
servicioForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // var estadoParametro = "Innactivo";
  // if (parametroEstado.checked) {
  //   estadoParametro = "Activo";
  // }

  if (validator.isEmpty(servicioNombre.value)) {
    mensajeError.textContent = "El nombre del servicio es obligatorio.";
    servicioNombre.focus();
  } else if (validator.isEmpty(servicioDescripcion.value)) {
    mensajeError.textContent = "La descripcion del servicio es obligatoria.";
    servicioDescripcion.focus();
    // } else if (validator.isEmpty(servicioTipo.value)) {
    //   mensajeError.textContent = "El tipo de servicio es obligatorio.";
    //   servicioTipo.focus();
    // }
  } else if (validator.isEmpty(servicioValor.value)) {
    mensajeError.textContent = "El valor el servicio es obligatorio.";
    servicioValor.focus();
  } else {
    const newServicio = {
      nombre: servicioNombre.value,
      descripcion: servicioDescripcion.value,
      tipo: 'Servicio fijo',
      valor: servicioValor.value,
    };
    if (!editingStatus) {
      const result = await ipcRenderer.invoke(
        "createServiciosFijos",
        newServicio
      );
      console.log(result);
    } else {
      console.log("Editing parametro with electron");
      const result = await ipcRenderer.invoke(
        "updateServiciosFijos",
        editServicioId,
        newServicio
      );
      editingStatus = false;
      editServicioId = "";
      console.log(result);
    }
    getServicios();
    servicioForm.reset();
    servicioNombre.focus();
  }
});
function renderServicios(servicios) {
  serviciosList.innerHTML = "";
  servicios.forEach((servicio) => {
    serviciosList.innerHTML += `
       <tr>
      <td>${servicio.nombre}</td>
      <td>${servicio.descripcion}</td>
 
      <td>${servicio.valor}</td>
      <td>
      <button onclick="deleteServicio('${servicio.id}')" class="btn "> 
      <i class="fa-solid fa-user-minus"></i>
      </button>
      </td>
      <td>
      <button onclick="editServicio('${servicio.id}')" class="btn ">
      <i class="fa-solid fa-user-pen"></i>
      </button>
      </td>
   </tr>
      `;
  });
}
const editServicio = async (id) => {
  const servicio = await ipcRenderer.invoke("getServiciosFijosById", id);
  servicioNombre.value = servicio.nombre;
  servicioDescripcion.value = servicio.descripcion;
  // if (parametro.estado == "Activo") {
  //   parametroEstado.checked=true;
  // } else {
  //   parametroEstado.checked = false;
  // }
  //servicioTipo.value = servicio.tipo;
  servicioValor.value = servicio.valor;
  editingStatus = true;
  editServicioId = servicio.id;
  console.log(servicio);
};
const deleteServicio = async (id) => {
  const response = confirm("Estas seguro de eliminar este parametro?");
  if (response) {
    console.log("id from parametros.js");
    const result = await ipcRenderer.invoke("deleteServiciosFijos", id);
    console.log("Resultado parametros.js", result);
    getServicios();
  }
};
const getServicios = async () => {
  servicios = await ipcRenderer.invoke("getServiciosFijos");
  console.log(servicios);
  renderServicios(servicios);
};
async function init() {
  await getServicios();
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
init();
