// ----------------------------------------------------------------
// Librerias
// ----------------------------------------------------------------
const { ipcRenderer } = require("electron");
const validator = require("validator");
const Swal = require("sweetalert2");
// ----------------------------------------------------------------
const servicioCreacion = document.getElementById("fechaCreacion");
const servicioNombre = document.getElementById("nombre");
const servicioDescripcion = document.getElementById("descripcion");
// const servicioTipo = document.getElementById("tipo");
const servicioValor = document.getElementById("valor");
const serviciosList = document.getElementById("servicios");
const usuariosList = document.getElementById("usuarios");
const buscarServicios = document.getElementById("buscarServicios");
const criterio = document.getElementById("criterio");
const criterioContent = document.getElementById("criterio-content");
// ----------------------------------------------------------------
const servicioCreacionBn = document.getElementById("fechaCreacion-bn");
const servicioNombreBn = document.getElementById("nombre-bn");
const servicioDescripcionBn = document.getElementById("descripcion-bn");
const servicioValorBn = document.getElementById("valor-bn");
const buscarBeneficiarios = document.getElementById("buscarBeneficiarios");
const criterioBn = document.getElementById("criterio-bn");
const criterioContentBn = document.getElementById("criterio-bn-content");

let servicios = [];
let usuarios = [];
let contratados = [];
let editingStatus = false;
let editServicioId = "";
servicioForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // var estadoParametro = "Innactivo";
  // if (parametroEstado.checked) {
  //   estadoParametro = "Activo";
  // }
  if (validator.isEmpty(servicioCreacion.value)) {
    mensajeError.textContent = "Ingresa una fecha de creación válida.";
    servicioCreacion.focus();
  } else if (validator.isEmpty(servicioNombre.value)) {
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
      fechaCreacion: servicioCreacion.value,
      nombre: servicioNombre.value,
      descripcion: servicioDescripcion.value,
      tipo: "Servicio fijo",
      valor: servicioValor.value,
      aplazableSn: "No",
    };
    if (!editingStatus) {
      const result = await ipcRenderer.invoke(
        "createServiciosFijos",
        newServicio
      );
      console.log(result);
    } else {
      console.log("Editing parametro with electron");

      Swal.fire({
        title: "¿Quieres guardar los cambios?",
        text: "No podrás deshacer esta acción.",
        icon: "question",
        iconColor: "#f8c471",
        showCancelButton: true,
        confirmButtonColor: "#2874A6",
        cancelButtonColor: "#EC7063 ",
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Aquí puedes realizar la acción que desees cuando el usuario confirme.
          const result = await ipcRenderer.invoke(
            "updateServiciosFijos",
            editServicioId,
            newServicio
          );
          editingStatus = false;
          editServicioId = "";
          console.log(result);
        }
      });
    }
  }
});
function renderServiciosFijos(serviciosFijos) {
  serviciosList.innerHTML = "";
  serviciosFijos.forEach((servicioFijo) => {
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
    h6CardTitle.textContent = servicioFijo.nombre;

    divContainerTitle.appendChild(h6CardTitle);

    const divContainerSocios = document.createElement("div");
    divContainerSocios.className =
      "row container-socios d-flex align-items-center";

    const pDescription = document.createElement("p");
    pDescription.textContent = servicioFijo.descripcion;

    divContainerSocios.appendChild(pDescription);

    const divContainerDetalles = document.createElement("div");
    divContainerDetalles.className = "row container-detalles";

    const detalles = [
      { label: "Valor:", value: servicioFijo.valor },
      { label: "Tipo:", value: servicioFijo.tipo },
      { label: "Aplazable:", value: servicioFijo.aplazableSn },
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

    // const buttons = ["fa-file-pen", "fa-trash", "fa-chart-simple"];
    const btnEditServicio = document.createElement("button");
    btnEditServicio.className =
      "btn-servicios-custom d-flex justify-content-center align-items-center";
    const iconEdit = document.createElement("i");
    iconEdit.className = "fa fa-file-pen";
    btnEditServicio.appendChild(iconEdit);
    btnEditServicio.onclick = function () {
      console.log("Editar ...");
    };
    const btnDeleteServicio = document.createElement("button");
    btnDeleteServicio.className =
      "btn-servicios-custom d-flex justify-content-center align-items-center";
    const iconDelete = document.createElement("i");
    iconDelete.className = "fa fa-trash";
    btnDeleteServicio.appendChild(iconDelete);
    btnDeleteServicio.onclick = () => {
      console.log("Eliminar ...");
    };
    const btnEstadistics = document.createElement("button");
    btnEstadistics.className =
      "btn-servicios-custom d-flex justify-content-center align-items-center";
    const iconStadistics = document.createElement("i");
    iconStadistics.className = "fa fa-chart-simple";
    btnEstadistics.appendChild(iconStadistics);
    btnEstadistics.onclick = () => {
      console.log("Estadisticas del servicio: " + servicioFijo.id);
      mostrarEstadisticas(servicioFijo.id);

      mostrarSeccion("seccion2");
    };
    divCol1.appendChild(btnEditServicio);
    btnEditServicio.onclick = () => {
      console.log("Detalles del servicio: " + servicioFijo.id);
      editServicio(servicioFijo.id);
    };
    divCol1.appendChild(btnDeleteServicio);
    divCol1.appendChild(btnEstadistics);
    // Se puede crear botones con un ciclo forEach pero, no son muy manejables
    // buttons.forEach((iconClass) => {
    //   const button = document.createElement("button");
    //   button.className =
    //     "btn-servicios-custom d-flex justify-content-center align-items-center";

    //   const icon = document.createElement("i");
    //   icon.className = `fa ${iconClass}`;

    //   button.appendChild(icon);
    //   divCol1.appendChild(button);
    // });

    divRowG0.appendChild(divCol2);
    divRowG0.appendChild(divCol9);
    divRowG0.appendChild(divCol1);

    divCol6.appendChild(divRowG0);
    serviciosList.appendChild(divCol6);
  });
}
async function renderUsuarios(usuarios, servicioId) {
  let ct = [];
  const contratadosId = await ipcRenderer.invoke(
    "getContratadosById",
    servicioId
  );
  console.log("Contratados: " + contratadosId);
  contratadosId.forEach((contratadoId) => {
    ct.push(contratadoId.contratosId);
  });
  contratados = console.log("Contratados", contratados);
  // await getContratados(servicioId);
  usuariosList.innerHTML = "";
  usuarios.forEach(async (usuario) => {
    const divCol4 = document.createElement("div");
    divCol4.className = "col-4 card mx-2 my-2";
    divCol4.style.maxWidth = "30%";
    divCol4.style.width = "30%";
    divCol4.style.height = "fit-content";
    divCol4.style.maxHeight = "fit-content";

    const divRowG0 = document.createElement("div");
    divRowG0.className = "row g-0";

    const divCol2 = document.createElement("div");
    divCol2.className =
      "col-2 d-flex justify-content-center align-items-center";

    const img = document.createElement("img");
    img.src = "../assets/fonts/usuario-rounded48x48.png";
    img.className = "img-fluid rounded-start";
    img.alt = "not found";

    divCol2.appendChild(img);

    const divCol8 = document.createElement("div");
    divCol8.className =
      "col-8 d-flex justify-content-center align-items-center text-center";

    const divCardBody = document.createElement("div");
    divCardBody.className = "card-body text-center";

    const containerTitle = document.createElement("div");
    containerTitle.className = "d-flex align-items-baseline container-title";

    const h6Contrato = document.createElement("h6");
    h6Contrato.className = "card-title";
    h6Contrato.textContent = "Contrato:";

    const pContrato = document.createElement("p");
    pContrato.className = "text-white";
    pContrato.textContent = "-";

    const pContratoValue = document.createElement("p");
    pContratoValue.textContent = usuario.codigo;

    containerTitle.appendChild(h6Contrato);
    containerTitle.appendChild(pContrato);
    containerTitle.appendChild(pContratoValue);

    const containerSocios = document.createElement("div");
    containerSocios.className = "container-socios d-flex align-items-baseline";

    const h6Socio = document.createElement("h6");
    h6Socio.textContent = "Socio:";

    const pSocio = document.createElement("p");
    pSocio.className = "text-white";
    pSocio.textContent = "-";

    const pSocioValue = document.createElement("p");
    pSocioValue.textContent = usuario.socio;

    containerSocios.appendChild(h6Socio);
    containerSocios.appendChild(pSocio);
    containerSocios.appendChild(pSocioValue);

    divCardBody.appendChild(containerTitle);
    divCardBody.appendChild(containerSocios);

    divCol8.appendChild(divCardBody);

    const divCol2Estado = document.createElement("div");
    divCol2Estado.className = "col-2 flex-column d-flex align-items-center ";

    const divEstado = document.createElement("div");
    divEstado.className = "col-12 text-center";

    const pEstado = document.createElement("p");
    pEstado.className = "mt-3";
    pEstado.innerHTML = "<small>Estado</small>";

    const divCustomCheckbox = document.createElement("div");
    divCustomCheckbox.className =
      "custom-checkbox d-flex justify-content-center align-items-center";
    divCustomCheckbox.style.marginTop = "0";
    divCustomCheckbox.style.padding = "0 25%";
    divCustomCheckbox.style.width = "100%";

    const inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.className = "circular-checkbox ";
    console.log("Cotratados comparar: " + ct);
    if (ct.includes(usuario.contratosId)) {
      inputCheckbox.checked = true;
    } else {
      inputCheckbox.checked = false;
    }

    inputCheckbox.style.width = "40%";
    inputCheckbox.style.height = "40%";
    inputCheckbox.disabled = true;

    const labelCheckbox = document.createElement("label");
    labelCheckbox.for = "miCheckbox";
    labelCheckbox.className =
      "text-white d-flex align-items-center justify-content-center";

    const iCheckbox = document.createElement("i");
    iCheckbox.className = "fa fa-check";

    labelCheckbox.appendChild(iCheckbox);
    divCustomCheckbox.appendChild(inputCheckbox);
    divCustomCheckbox.appendChild(labelCheckbox);

    divEstado.appendChild(pEstado);
    divEstado.appendChild(divCustomCheckbox);

    divCol2Estado.appendChild(divEstado);

    divRowG0.appendChild(divCol2);
    divRowG0.appendChild(divCol8);
    divRowG0.appendChild(divCol2Estado);

    divCol4.appendChild(divRowG0);
    usuariosList.appendChild(divCol4);
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
  servicioCreacion.value = formatearFecha(servicio.fechaCreacion);
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
  Swal.fire({
    title: "¿Quieres borrar el servicio de " + socioNombre + " ?",
    text: "No podrás deshacer esta acción.",
    icon: "question",
    iconColor: "#f8c471",
    showCancelButton: true,
    confirmButtonColor: "#2874A6",
    cancelButtonColor: "#EC7063 ",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Aquí puedes realizar la acción que desees cuando el usuario confirme.
      console.log("id from parametros.js");
      const result = await ipcRenderer.invoke("deleteServiciosFijos", id);
      console.log("Resultado servicios.js", result);
    }
  });
};
// ----------------------------------------------------------------
// Funcion que muestra las estadisticas de un servicio
// ----------------------------------------------------------------
const mostrarEstadisticas = async (servicioId) => {
  // await getContratados(servicioId);
  const servicio = await ipcRenderer.invoke(
    "getServiciosFijosById",
    servicioId
  );
  servicioCreacionBn.value = formatearFecha(servicio.fechaCreacion);
  servicioNombreBn.value = servicio.nombre;
  servicioDescripcionBn.value = servicio.descripcion;
  servicioValorBn.value = servicio.valor;
  editingStatus = true;
  editServicioId = servicio.id;
  console.log(servicio);
  let criterioBuscar = "all";
  let criterioContentBuscar = "all";
  await getBeneficiarios(criterioBuscar, criterioContentBuscar, servicioId);
};
const getBeneficiarios = async (criterio, criterioContent, servicioId) => {
  usuarios = await ipcRenderer.invoke(
    "getContratos",
    criterio,
    criterioContent
  );
  console.log("Beneficiarios: ", usuarios);
  renderUsuarios(usuarios, servicioId);
};
const getServicios = async (criterio, criterioContent) => {
  servicios = await ipcRenderer.invoke(
    "getServiciosFijos",
    criterio,
    criterioContent
  );
  console.log(servicios);
  renderServiciosFijos(servicios);
};
criterio.onchange = async () => {
  let criterioSeleccionado = criterio.value;
  console.log("Seleccionado: ", criterioSeleccionado);
  if (criterioSeleccionado === "all") {
    // criterioContent.textContent = "";
    criterioContent.value = "";
    criterioContent.readOnly = true;
    let criterioBuscar = "all";
    let criterioContentBuscar = "all";
    await getServicios(criterioBuscar, criterioContentBuscar);
  } else {
    criterioContent.readOnly = false;
  }
};
buscarServicios.onclick = async () => {
  let criterioBuscar = criterio.value;
  let criterioContentBuscar = criterioContent.value;
  console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
  await getServicios(criterioBuscar, criterioContentBuscar);
};
criterioBn.onchange = async () => {
  let criterioSeleccionado = criterioBn.value;
  console.log("Seleccionado: ", criterioSeleccionado);
  if (criterioSeleccionado === "all") {
    // criterioContent.textContent = "";
    criterioContentBn.value = "";
    criterioContentBn.readOnly = true;
    let criterioBuscar = "all";
    let criterioContentBuscar = "all";
    await getBeneficiarios(
      criterioBuscar,
      criterioContentBuscar,
      editServicioId
    );
  } else {
    criterioContentBn.readOnly = false;
  }
};
buscarBeneficiarios.onclick = async () => {
  let criterioBuscar = criterioBn.value;
  let criterioContentBuscar = criterioContentBn.value;
  console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
  await getBeneficiarios(criterioBuscar, criterioContentBuscar, editServicioId);
};
const getContratados = async (servicioId) => {
  // Buscamos los contratos que hayan contratado el servicio segun el id del servicio
  // que se recibe!
  const contratadosId = await ipcRenderer.invoke(
    "getContratadosById",
    servicioId
  );
  contratadosId.forEach((contratadoId) => {
    contratados.push(contratadoId.id);
  });
  contratados = console.log("Contratados", contratados);
};
async function init() {
  fechaCreacion.value = formatearFecha(new Date());
  let criterioBuscar = "all";
  let criterioContentBuscar = "all";
  await getServicios(criterioBuscar, criterioContentBuscar);
}
ipcRenderer.on("Notificar", (event, response) => {
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
async function resetFormAfterUpdate() {
  let criterioBuscar = criterio.value;
  let criterioContentBuscar = criterioContent.value;
  console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
  console;
  await getServicios(criterioBuscar, criterioContentBuscar);
  mensajeError.textContent = "";
}
async function resetFormAfterSave() {
  let criterioBuscar = criterio.value;
  let criterioContentBuscar = criterioContent.value;
  console.log("Buscando: " + criterioBuscar + "|" + criterioContentBuscar);
  console;
  await getServicios(criterioBuscar, criterioContentBuscar);
  editingStatus = false;
  editServicioId = "";
  servicioForm.reset();
  mensajeError.textContent = "";
}
function resetForm() {
  editingStatus = false;
  editServicioId = "";
  servicioForm.reset();
  mensajeError.textContent = "";
  servicioCreacion.value = formatearFecha(new Date());
}
function formatearFecha(fecha) {
  const fechaOriginal = new Date(fecha);
  const year = fechaOriginal.getFullYear();
  const month = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
  const day = String(fechaOriginal.getDate()).padStart(2, "0");
  const fechaFormateada = `${year}-${month}-${day}`;
  return fechaFormateada;
}
function mostrarSeccion(id) {
  const seccion1 = document.getElementById("seccion1");
  const seccion2 = document.getElementById("seccion2");

  if (id === "seccion1") {
    seccion1.classList.add("active");
    seccion2.classList.remove("active");
  } else {
    seccion1.classList.remove("active");
    seccion2.classList.add("active");
  }
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
