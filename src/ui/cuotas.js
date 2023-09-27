// ----------------------------------------------------------------
// Librerias
// ----------------------------------------------------------------
const { ipcRenderer } = require("electron");
const validator = require("validator");
const Swal = require("sweetalert2");
// ----------------------------------------------------------------
const servicioNombre = document.getElementById("nombre");
const servicioDescripcion = document.getElementById("descripcion");
// const servicioTipo = document.getElementById("tipo");
const servicioValor = document.getElementById("valor");
const servicioAplazableSn = document.getElementById("aplazablesn");
const serviciosList = document.getElementById("servicios");
const servicioFechaCreacion = document.getElementById("fechacreacion");
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
    const newCuota = {
      nombre: servicioNombre.value,
      descripcion: servicioDescripcion.value,
      tipo: "Cuota",
      valor: servicioValor.value,
      aplazableSn: servicioAplazableSn.value,
    };
    if (!editingStatus) {
      const result = await ipcRenderer.invoke("createCuotas", newCuota);
      console.log(result);
    } else {
      console.log("Editing cuota with electron");
      const result = await ipcRenderer.invoke(
        "updateCuotas",
        editServicioId,
        newCuota
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
function renderCuotas(cuotas) {
  serviciosList.innerHTML = "";
  cuotas.forEach((cuota) => {
    const divCol6 = document.createElement("div");
    divCol6.className = "col-6 card mx-2 my-2 card-servicios";
    divCol6.style.width = "48%";
    divCol6.style.maxWidth = "48%";
    divCol6.style.height = "fit-content";
    divCol6.style.maxHeight = "fit-content";
    divCol6.style.margin = "0";

    const divRowG0 = document.createElement("div");
    divRowG0.className = "row g-0";

    const divCol2 = document.createElement("div");
    divCol2.className =
      "col-2 d-flex justify-content-center align-items-center container-img";

    const imgServicios = document.createElement("img");
    imgServicios.src = "../assets/fonts/servicioIcon64x64.png";
    imgServicios.className = "img-fluid rounded-start img-servicios";
    imgServicios.alt = "not found";

    divCol2.appendChild(imgServicios);

    const divCol9 = document.createElement("div");
    divCol9.className =
      "col-9 d-flex justify-content-center align-items-center";

    const divCardBody = document.createElement("div");
    divCardBody.className = "card-body";

    const divContainerTitle = document.createElement("div");
    divContainerTitle.className = "row container-title";

    const h6CardTitle = document.createElement("h6");
    h6CardTitle.className = "card-title";
    h6CardTitle.textContent = cuota.nombre;

    divContainerTitle.appendChild(h6CardTitle);

    const divContainerSocios = document.createElement("div");
    divContainerSocios.className =
      "row container-socios d-flex align-items-center";

    const pDescription = document.createElement("p");
    pDescription.textContent = cuota.descripcion;

    divContainerSocios.appendChild(pDescription);

    const divContainerDetalles = document.createElement("div");
    divContainerDetalles.className = "row container-detalles";

    const detalles = [
      { label: "Valor:", value: cuota.valor },
      { label: "Tipo:", value: cuota.tipo },
      { label: "Aplazable:", value: cuota.aplazableSn },
    ];

    detalles.forEach((detalle) => {
      const divDetalle = document.createElement("div");
      divDetalle.className = "d-flex align-items-baseline col-4 pm-0";

      const h6Label = document.createElement("h6");
      h6Label.textContent = detalle.label;

      const pValue = document.createElement("p");
      pValue.textContent = detalle.value;

      divDetalle.appendChild(h6Label);
      divDetalle.appendChild(pValue);
      divContainerDetalles.appendChild(divDetalle);
    });

    divCardBody.appendChild(divContainerTitle);
    divCardBody.appendChild(divContainerSocios);
    divCardBody.appendChild(divContainerDetalles);
    divCol9.appendChild(divCardBody);

    const divCol1 = document.createElement("div");
    divCol1.className = "col-1 d-flex flex-column justify-content-center";

    const buttons = ["fa-file-pen", "fa-trash", "fa-chart-simple"];

    buttons.forEach((iconClass) => {
      const button = document.createElement("button");
      button.className =
        "btn-servicios-custom d-flex justify-content-center align-items-center";

      const icon = document.createElement("i");
      icon.className = `fa ${iconClass}`;

      button.appendChild(icon);
      divCol1.appendChild(button);
    });

    divRowG0.appendChild(divCol2);
    divRowG0.appendChild(divCol9);
    divRowG0.appendChild(divCol1);

    divCol6.appendChild(divRowG0);
    serviciosList.appendChild(divCol6);
  });
}

// function renderServicios(servicios) {
//   serviciosList.innerHTML = "";
//   servicios.forEach((servicio) => {
//     serviciosList.innerHTML += `
//        <tr>
//       <td>${servicio.nombre}</td>
//       <td>${servicio.descripcion}</td>

//       <td>${servicio.valor}</td>
//       <td>
//       <button onclick="deleteServicio('${servicio.id}')" class="btn ">
//       <i class="fa-solid fa-user-minus"></i>
//       </button>
//       </td>
//       <td>
//       <button onclick="editServicio('${servicio.id}')" class="btn ">
//       <i class="fa-solid fa-user-pen"></i>
//       </button>
//       </td>
//    </tr>
//       `;
//   });
// }
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
  cuotas = await ipcRenderer.invoke("getCuotas");
  console.log(cuotas);
  renderCuotas(cuotas);
};
async function init() {
  servicioFechaCreacion.value = formatearFecha(new Date());
  await getServicios();
}
ipcRenderer.on("Notificar", (event, response) => {
  if (response.title === "Borrado!") {
    // resetFormAfterSave();
  } else if (response.title === "Actualizado!") {
    // resetFormAfterUpdate();
  } else if (response.title === "Guardado!") {
    // resetFormAfterSave();
  } else if (response.title === "Usuario eliminado!") {
    // resetFormAfterSave();
  }
  console.log("Response: " + response);
  if (response.success) {
    Swal.fire({
      title: response.title,
      text: response.message,
      icon: "success",
      confirmButtonColor: "#f8c471",
    });
  } else {
    Swal.fire({
      title: response.title,
      text: response.message,
      icon: "error",
      confirmButtonColor: "#f8c471",
    });
  }
});

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
