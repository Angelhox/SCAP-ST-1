const { ipcRenderer, electron, remote } = require("electron");
const Swal= require("sweetalert2");
const validator = require("validator");

// const { Notification } = remote;
// ----------------------------------------------------------------
// Librerias
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Variables funciones
// ----------------------------------------------------------------
const mensajeError = document.getElementById("mensajeError");
let editingStatus = false;
// ----------------------------------------------------------------
// Variables del contrato
// ----------------------------------------------------------------
const contratoCodigo = document.getElementById("codigocontrato");
const contratoFecha = document.getElementById("fechaContrato");
const contratoEstado = document.getElementById("estadoContrato");
//Indica si se ha seleccionado el servicio de agua con medidor
var contratoConMedidor = false;
// Tabla de contratos con medidor
const contratosList = document.getElementById("contratosconmedidor");
// Tabla de contratos sin medidor
const contratosSinMedidorList = document.getElementById("contratossinmedidor");
// ----------------------------------------------------------------
// Variables de los servicios
// ----------------------------------------------------------------
// Tabla de servicios disponibles para el contrato
const servicosDisponiblesList = document.getElementById(
  "servicios-disponibles"
);
// Tabla de servicios contratados se muestran segun el contrato seleccionado
const serviciosContratadosList = document.getElementById(
  "servicios-contratados"
);
// Arreglo para almacenar los servicios disponibles|
let serviciosDisponibles = [];
// Variable que indica los servicios contratados para editar
var serviciosEditar = null;
// Variable que almacena id de los servicios que se van a contratar
let serviciosDisponiblesAContratar = [];
// ----------------------------------------------------------------
// Variables del socio contratante
// ----------------------------------------------------------------
const socioContratanteCedula = document.getElementById(
  "cedulaSocioContratante"
);
const socioContratanteNombre = document.getElementById(
  "nombreSocioContratante"
);
const socioContratanteApellido = document.getElementById(
  "apellidoSocioContratante"
);
// Indica si se va a editar el contrato
let socioContratanteId = "";
// Obtiene el id del contrato que se esta manipulando
let contratoId = "";
// ----------------------------------------------------------------
// Variables del medidor
// ----------------------------------------------------------------
const medidorInstalacion = document.getElementById("fechaInstalacion");
const medidorMarca = document.getElementById("marca");
const medidorBarrio = document.getElementById("barrio");
const medidorPrincipal = document.getElementById("principal");
const medidorSecundaria = document.getElementById("secundaria");
const medidorNumeroCasa = document.getElementById("numerocasa");
const medidorReferencia = document.getElementById("referencia");
const medidorObservacion = document.getElementById("observacion");
//Variable que indica el medidor a editar Borrar
let editContratoId = "";
// ----------------------------------------------------------------
// Esta funcion obtiene los id de los servicios disponibles
// los manipula como elementos del DOM asignandoles el evento de marcado y desmarcado
// ----------------------------------------------------------------
async function eventoServiciosId(serviciosFijos) {
  serviciosFijos.forEach((servicioFijo) => {
    document
      .getElementById(servicioFijo.id)
      .addEventListener("change", (event) => {
        if (servicioFijo.nombre == "Agua Potable") {
          if (event.target.checked) {
            habilitarFormMedidor();
            contratoConMedidor = true;
            console.log("Marcado Agua: " + servicioFijo.nombre);
          } else {
            inHabilitarFormMedidor();
            contratoConMedidor = false;
            console.log("Desmarcado Agua: " + servicioFijo.nombre);
          }
        } else {
          if (event.target.checked) {
            console.log("Marcado: " + servicioFijo.nombre);
          } else {
            console.log("Desmarcado: " + servicioFijo.nombre);
          }
        }
      });
  });
}
// ----------------------------------------------------------------
// Funcion donde se insertan datos del contratato de los servicios a contratar
// ademas del medidor de ser necesario
// ----------------------------------------------------------------
contratoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  var newMedidor = {};
  if (validator.isEmpty(contratoFecha.value)) {
    mensajeError.textContent = "La fecha del contrato es Obligatoria";
    contratoFecha.focus();
  } else if (validator.isEmpty(contratoCodigo.value)) {
    mensajeError.textContent = "El código del contrato es Obligatorio";
    contratoCodigo.focus();
  } else if (
    contratoConMedidor &&
    validator.isEmpty(medidorInstalacion.value)
  ) {
    mensajeError.textContent = "La fecha instalación es Obligatoria";
    medidorInstalacion.focus();
  } else if (contratoConMedidor && validator.isEmpty(medidorMarca.value)) {
    mensajeError.textContent = "El marca del medidor es Obligatoria";
    medidorMarca.focus();
  } else if (contratoConMedidor && validator.isEmpty(medidorNumeroCasa.value)) {
    mensajeError.textContent = "El número de casa es Obligatorio";
    medidorNumeroCasa.focus();
  } else if (contratoConMedidor && validator.isEmpty(medidorBarrio.value)) {
    mensajeError.textContent = "El nombre del barrio es Obligatorio";
    medidorBarrio.focus();
  } else if (contratoConMedidor && validator.isEmpty(medidorPrincipal.value)) {
    mensajeError.textContent = "La calle principal es Obligatoria";
    medidorPrincipal.focus();
  } else if (contratoConMedidor && validator.isEmpty(medidorSecundaria.value)) {
    mensajeError.textContent = "La calle secundaria es Obligatoria";
    medidorSecundaria.focus();
  } else if (contratoConMedidor && validator.isEmpty(medidorReferencia.value)) {
    mensajeError.textContent = "Indicar una referencia es Obligatorio";
    medidorReferencia.focus();
  } else if (
    contratoConMedidor &&
    validator.isEmpty(medidorObservacion.value)
  ) {
    mensajeError.textContent = "Indicar una observacion es Obligatorio";
    medidorObservacion.focus();
  } else {
    if (!socioContratanteId == "") {
      var contratoEstadoDf = "Innactivo";
      var medidorDf = "No";
      if (contratoConMedidor) {
        medidorDf = "Si";
      }
      if ((contratoEstado.checked = true)) {
        contratoEstadoDf = "Activo";
      }
      newMedidor = {
        codigo: contratoCodigo.value,
        fechaInstalacion: medidorInstalacion.value,
        marca: medidorMarca.value,
        barrio: medidorBarrio.value,
        callePrincipal: medidorPrincipal.value,
        calleSecundaria: medidorSecundaria.value,
        numeroCasa: medidorNumeroCasa.value,
        referencia: medidorReferencia.value,
        observacion: medidorObservacion.value,
        contratosId: contratoId,
      };
      const newContrato = {
        fecha: contratoFecha.value,
        estado: contratoEstadoDf,
        codigo: contratoCodigo.value,
        sociosId: socioContratanteId,
        medidorSn: medidorDf,
      };

      if (!editingStatus) {
        try {
          const resultContrato = await ipcRenderer.invoke(
            "createContrato",
            newContrato
          );
          console.log(
            "Muestro resultado de insertar contrato: ",
            resultContrato
          );
          contratoId = resultContrato.id;
          console.log(
            "Muestro id resultado de insertar contrato: ",
            contratoId
          );
          if (!contratoId == "") {
            contratarServicios(serviciosDisponiblesAContratar, contratoId);
            if (contratoConMedidor) {
              console.log("vamos a crear un medidor");
              newMedidor.contratosId = contratoId;
              const result = await ipcRenderer.invoke(
                "createMedidor",
                newMedidor
              );

              console.log(result);
            }
          }
        } catch (e) {
          console.log("Error al registrar el contrato: ", e);
        }
      } else {
        console.log("Editing contrato with electron");
        newMedidor.contratosId = editContratoId;
        try {
          const resultContrato = await ipcRenderer.invoke(
            "updateContrato",
            editContratoId,
            newContrato
          );
          if (contratoConMedidor) {
            const resultMedidor = await ipcRenderer.invoke(
              "updateMedidor",
              editContratoId,
              newMedidor
            );
          }
          contratarServicios(serviciosDisponiblesAContratar, editContratoId);
          console.log(resultContrato);
        } catch (error) {
          console.log("Error al editar el contrato: ", error);
        }
        editingStatus = false;
        editContratoId = "";
      }

      getContratos();
      contratoId = "";
      editContratoId = "";
      contratoConMedidor = false;
      contratoForm.reset();
      socioContratanteCedula.focus();
    } else {
      console.log("Socio not found");
    }
  }
});
// ----------------------------------------------------------------
// Funcion que recibe los id de servicios a contratar y los relaciona con el id del contrato
// ----------------------------------------------------------------
function contratarServicios(serviciosAContratar, contratoId) {
  console.log("Contrato ID: " + contratoId);
  var conteoRegistros = serviciosAContratar.length;
  try {
    serviciosAContratar.forEach(async (servicioAContratar) => {
      var adquiridoSn = "";
      if (document.getElementById(servicioAContratar).checked) {
        adquiridoSn = "Activo";
      } else {
        adquiridoSn = "Innactivo";
      }
      var resultServiciosContratados = await ipcRenderer.invoke(
        "createServiciosContratados",
        servicioAContratar,
        contratoId,
        1,
        adquiridoSn
      );

      console.log(
        "Resultado de contratar servicios: ",
        resultServiciosContratados
      );
      conteoRegistros = conteoRegistros - 1;
      console.log("conteo: " + conteoRegistros);
    });
    ipcRenderer.on("notifyContratarServicios", (event) => {
      if (conteoRegistros == 1) {
        const NOTIFICATION_TITLE = "Servicios Contratados ";
        new window.Notification(NOTIFICATION_TITLE, {
          body: "Comprueba los detalles en la lista de servicios !",
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
}
// ----------------------------------------------------------------
// Funcion que crea las filas en la tabla de contratos registrados con servicio
// de agua potable por ende con medidor
// ----------------------------------------------------------------
function renderContratosConMedidor(datosContratos) {
  contratosList.innerHTML = "";
  datosContratos.forEach((contrato) => {
    contratosList.innerHTML += `
    <tr class="fila-md">
    <td>${contrato.codigo}</td>
       <td>${formatearFecha(contrato.fecha)}</td>
      <td>${
        contrato.primerNombre +
        " " +
        contrato.segundoNombre +
        " " +
        contrato.primerApellido +
        " " +
        contrato.segundoApellido
      }</td>
      <td>${contrato.cedulaPasaporte}</td>
      <td>${contrato.estado}</td>
      <td>
      <button onclick="detallesContratos('${contrato.id}')" class="btn "> 
      <i class="fa-solid fa-circle-info" style="color: #511f1f;"></i>
      </button>
      </td>
      <td>
      <button onclick="editContrato('${contrato.id}')" class="btn ">
      <i class="fa-solid fa-user-pen"></i>
      </button>
      </td>
   </tr>
      `;
  });
}
// function renderContratosSinMedidor(datosContratosSinMedidor) {
//   contratosSinMedidorList.innerHTML = "";

//   const cardContainer = document.createElement("div");
//   // cardContainer.classList.add("card-container-horizontal");

//   datosContratosSinMedidor.forEach((contratosinmedidor) => {
//     const card = document.createElement("div");
//     card.classList.add("card");
//     card.classList.add("cardmd");

//     card.innerHTML = `
//       <div class="card-content">
//         <div class="card-header">${contratosinmedidor.codigo}</div>
//         <div class="card-body">
//           <p>${formatearFecha(contratosinmedidor.fecha)}</p>
//           <p>${
//             contratosinmedidor.primerNombre +
//             " " +
//             contratosinmedidor.segundoNombre +
//             " " +
//             contratosinmedidor.primerApellido +
//             " " +
//             contratosinmedidor.segundoApellido
//           }</p>
//           <p>${contratosinmedidor.cedulaPasaporte}</p>
//           <p>${contratosinmedidor.estado}</p>
//         </div>
//         <div class="card-footer">
//           <button onclick="detallesContratos('${
//             contratosinmedidor.id
//           }')" class="btn ">
//             <i class="fa-solid fa-circle-info" style="color: #511f1f;"></i>
//           </button>
//           <button onclick="editMedidor('${
//             contratosinmedidor.id
//           }')" class="btn ">
//             <i class="fa-solid fa-user-pen"></i>
//           </button>
//         </div>
//       </div>
//     `;

//     cardContainer.appendChild(card);
//   });

//   contratosSinMedidorList.appendChild(cardContainer);
// }
function renderContratosSinMedidor(datosContratosSinMedidor) {
  contratosSinMedidorList.innerHTML = "";
  datosContratosSinMedidor.forEach((contratosinmedidor) => {
    contratosSinMedidorList.innerHTML += `
       <tr class="fila-md">
       <td>${contratosinmedidor.codigo}</td>
       <td>${formatearFecha(contratosinmedidor.fecha)}</td>
      <td>${
        contratosinmedidor.primerNombre +
        " " +
        contratosinmedidor.segundoNombre +
        " " +
        contratosinmedidor.primerApellido +
        " " +
        contratosinmedidor.segundoApellido
      }</td>
      <td>${contratosinmedidor.cedulaPasaporte}</td>
      <td>${contratosinmedidor.estado}</td>
      <td>
      <button onclick="detallesContratos('${
        contratosinmedidor.id
      }')" class="btn ">
      <i class="fa-solid fa-circle-info" style="color: #511f1f;"></i>
      </button>
      </td>
      <td>
      <button onclick="editContrato('${contratosinmedidor.id}')" class="btn ">
      <i class="fa-solid fa-user-pen"></i>
      </button>
      </td>
   </tr>
      `;
  });
}
// function renderContratosSinMedidor(datosContratosSinMedidor) {
//   contratosSinMedidorList.innerHTML = "";

//   const cardContainer = document.createElement("div");
//   cardContainer.classList.add("card-container-horizontal");

//   datosContratosSinMedidor.forEach((contratosinmedidor) => {
//     const card = document.createElement("div");
//     card.classList.add("card");

//     card.innerHTML = `
//       <div class="card-content">
//         <div class="card-header">${contratosinmedidor.codigo}</div>
//         <div class="card-body">
//           <p>${formatearFecha(contratosinmedidor.fecha)}</p>
//           <p>${
//             contratosinmedidor.primerNombre +
//             " " +
//             contratosinmedidor.segundoNombre +
//             " " +
//             contratosinmedidor.primerApellido +
//             " " +
//             contratosinmedidor.segundoApellido
//           }</p>
//           <p>${contratosinmedidor.cedulaPasaporte}</p>
//           <p>${contratosinmedidor.estado}</p>
//         </div>
//         <div class="card-footer">
//           <button onclick="detallesContratos('${
//             contratosinmedidor.id
//           }')" class="btn ">
//             <i class="fa-solid fa-circle-info" style="color: #511f1f;"></i>
//           </button>
//           <button onclick="editMedidor('${
//             contratosinmedidor.id
//           }')" class="btn ">
//             <i class="fa-solid fa-user-pen"></i>
//           </button>
//         </div>
//       </div>
//     `;

//     cardContainer.appendChild(card);
//   });

//   contratosSinMedidorList.appendChild(cardContainer);
// }
// function renderServiciosContratos(serviciosContratados) {
//   servicosContratadosList.innerHTML = "";
//   serviciosContratados.forEach((servicioContratado) => {
//     serviciosCheck[servicioContratado.id] = servicioContratado.id;
//     serviciosFijosList.push(servicioContratado.id);
//     servicosContratadosList.innerHTML += `

//     <div class="col-6 text-center">
//     <div class="card card-fondo my-2" style="height: 18rem;">
//       <div class="card-zona-img"></div>
//       <div class="card-body col-12 card-contenido">
//         <div class="col-12">
//           <h5 class="card-title">${servicioContratado.nombre}</h5>
//         </div>
//         <div class="col-12 card-zona-desc" >
//           <p class="card-text">
//             ${servicioContratado.descripcion}
//           </p>
//         </div>
//         <div
//           class="col-12 d-flex justify-content-center align-items-center"
//         >
//           <input
//             type="checkbox"
//             class="btn-check"
//             name="options-outlined"
//             id="${servicioContratado.id}"
//             autocomplete="off"

//           />
//           <label
//             style="width: 40%"
//             class="btn btn-outline-success"
//             for="${servicioContratado.id}"
//             >Adquirido</label
//           >
//         </div>
//       </div>
//     </div>
//   </div>
//       `;
//     //const servicio = ;
//   });

//   console.log(serviciosCheck);
//   console.log(serviciosFijosList[0]);
// }
// ----------------------------------------------------------------
// Funcion que crea las cards de los servicios registrados segun el id
// del contrato seleccionado
// ----------------------------------------------------------------
function renderServiciosContratados(serviciosContratados) {
  serviciosContratadosList.innerHTML = "";
  serviciosContratados.forEach((servicioContratado) => {
    serviciosContratadosList.innerHTML += `
     
    <div class="col-12 text-center ">
    <div class="card card-fondo card-espacios" style="height: 12rem">
      <div class="card-zona-img"></div>
      <div class="card-body col-12 card-contenido">
        <div class="col-12">
          <h5 class="card-title">${servicioContratado.nombre}</h5>
        </div>
        <div class="col-12 card-zona-desc-ct">
          <p class="card-text">
            ${servicioContratado.descripcion}
          </p>
        </div>
        <div
          class="col-12 d-flex justify-content-center align-items-center"
        ></div>
      </div>
    </div>
  </div>
      `;
  });
  console.log(serviciosDisponiblesAContratar[0]);
}
// ----------------------------------------------------------------
// Funcion que crea las cards de los servicios disponibles para los nuevos contratos
// ----------------------------------------------------------------
function renderServiciosDisponibles(serviciosDisponibles) {
  servicosDisponiblesList.innerHTML = "";
  for (let i = 0; i < serviciosDisponibles.length; i++) {
    console.log("Servicios: ", serviciosDisponibles[i]);
    //serviciosContratados.forEach((servicioContratado) => {

    serviciosDisponiblesAContratar.push(serviciosDisponibles[i].id);

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("col-6", "text-center");

    const card = document.createElement("div");
    card.classList.add("card", "card-fondo", "my-2");
    card.style.height = "18rem";

    const cardImage = document.createElement("div");
    cardImage.classList.add("card-zona-img");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "col-12", "card-contenido");

    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = serviciosDisponibles[i].nombre;

    const description = document.createElement("p");
    description.classList.add("card-text");
    description.textContent = serviciosDisponibles[i].descripcion;

    const checkboxDiv = document.createElement("div");
    checkboxDiv.classList.add(
      "col-12",
      "d-flex",
      "justify-content-center",
      "align-items-center"
    );

    const checkbox = document.createElement("input");
    //checkbox.checked = "false";
    checkbox.type = "checkbox";
    checkbox.classList.add("btn-check");
    //checkbox.name = "options-outlined";
    checkbox.id = serviciosDisponibles[i].id;
    // checkbox.autocomplete = "off";
    checkbox.checked = false;

    const label = document.createElement("label");
    label.style.width = "40%";
    label.classList.add("btn", "btn-outline-success");
    label.setAttribute("for", serviciosDisponibles[i].id);
    label.textContent = "Adquirido";

    checkboxDiv.appendChild(checkbox);
    checkboxDiv.appendChild(label);
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(checkboxDiv);

    card.appendChild(cardImage);
    card.appendChild(cardBody);
    cardContainer.appendChild(card);
    servicosDisponiblesList.appendChild(cardContainer);
  }
  marcarServiciosContratados();
  console.log(serviciosDisponiblesAContratar[0]);
}
function marcarServiciosContratados() {
  if (serviciosEditar !== null) {
    for (let i = 0; i < serviciosEditar.length; i++) {
      document.getElementById(
        serviciosEditar[i].serviciosId
      ).checked = true;
    }
  }
}
// ----------------------------------------------------------------
// Funcion que muestra los detalles de los contratos registrados
// segun se los seleccione
// ----------------------------------------------------------------
const detallesContratos = async (id) => {
  contratoForm.reset();
  const serviciosContratos = await ipcRenderer.invoke(
    "getServiciosContratadosById",
    id
  );
  renderServiciosContratados(serviciosContratos);
  console.log(serviciosContratos);
  return serviciosContratos;
};
// ----------------------------------------------------------------
// Funcion que carga los datos de los contratos registrados y los muestra en
// el formulario para editarlos
// ----------------------------------------------------------------
const editContrato = async (id) => {
  contratoForm.reset();
  const contrato = await ipcRenderer.invoke("getDatosContratosById", id);
  console.log("Recibido: " + contrato);

  var conMedidor = contrato.medidorSn;
  if (conMedidor == "Si") {
    console.log("conMedidor");
    contratoFecha.value = formatearFecha(contrato.fecha);
    socioContratanteCedula.value = contrato.cedulaPasaporte;
    socioContratanteApellido.value =
      contrato.primerApellido + " " + contrato.segundoApellido;
    socioContratanteNombre.value =
      contrato.primerNombre + " " + contrato.segundoNombre;
    // if (medidor.pagoRecoleccionDesechos == "Si") {
    //   contratoPagoRecoleccion.checked = true;
    // } else {
    //   contratoPagoRecoleccion.checked = false;
    // }
    // if (medidor.pagoAlcanterillado == "Si") {
    //   contratoPagoAlcanterillado.checked = true;
    // } else {
    //   contratoPagoAlcanterillado.checked = false;
    // }
    // if (medidor.pagoEscrituras == "Si") {
    //   contratoPagoEscrituras.checked = true;
    // } else {
    //   contratoPagoEscrituras.checked = false;
    // }
    // if (medidor.pagoAguaPotable == "Si") {
    //   contratoPagoAguaPotable.checked = true;
    // } else {
    //   contratoPagoAguaPotable.checked = false;
    // }
    contratoCodigo.value = contrato.codigo;
    contratoConMedidor = true;
    //medidorCodigo.value = contrato.codigoMedidor;
    medidorInstalacion.value = formatearFecha(contrato.fechaInstalacion);
    medidorMarca.value = contrato.marca;
    medidorBarrio.value = contrato.barrio;
    medidorPrincipal.value = contrato.callePrincipal;
    medidorSecundaria.value = contrato.calleSecundaria;
    medidorNumeroCasa.value = contrato.numeroCasa;
    medidorReferencia.value = contrato.referencia;
    medidorObservacion.value = contrato.observacion;
    // Permitimos editar los datos del medidor
    // medidorCodigo.disabled = false;
    medidorInstalacion.readOnly = true;
    medidorInstalacion.disabled = false;
    medidorMarca.disabled = false;
    medidorBarrio.disabled = false;
    medidorPrincipal.disabled = false;
    medidorSecundaria.disabled = false;
    medidorNumeroCasa.disabled = false;
    medidorReferencia.disabled = false;
    medidorObservacion.disabled = false;
    // Inhabilitamos los campos que no se deben editar
    contratoFecha.readOnly = true;
    socioContratanteCedula.readOnly = true;
    socioContratanteApellido.readOnly = true;
    socioContratanteNombre.readOnly = true;
    // ~~~~~~~~~~~~~~~~
    editContratoId = contrato.id;
  } else {
    console.log("sinMedidor");
    contratoCodigo.value = contrato.codigo;
    contratoFecha.value = formatearFecha(contrato.fecha);

    socioContratanteCedula.value = contrato.cedulaPasaporte;
    socioContratanteApellido.value =
      contrato.primerApellido + " " + contrato.segundoApellido;
    socioContratanteNombre.value =
      contrato.primerNombre + " " + contrato.segundoNombre;
    // if (medidor.pagoRecoleccionDesechos == "Si") {
    //   contratoPagoRecoleccion.checked = true;
    // } else {
    //   contratoPagoRecoleccion.checked = false;
    // }
    // if (medidor.pagoAlcanterillado == "Si") {
    //   contratoPagoAlcanterillado.checked = true;
    // } else {
    //   contratoPagoAlcanterillado.checked = false;
    // }
    // if (medidor.pagoEscrituras == "Si") {
    //   contratoPagoEscrituras.checked = true;
    // } else {
    //   contratoPagoEscrituras.checked = false;
    // }
    // if (medidor.pagoAguaPotable == "Si") {
    //   contratoPagoAguaPotable.checked = true;
    // } else {
    //   contratoPagoAguaPotable.checked = false;
    // }
    // medidorCodigo.value = medidor.codigo;
    // medidorInstalacion.value = formatearFecha(medidor.fechaInstalacion);
    // medidoresDisponibles.selectedIndex = 0;
    // medidorMarca.value = medidor.marca;
    // medidorBarrio.value = medidor.barrio;
    // medidorPrincipal.value = medidor.callePrincipal;
    // medidorSecundaria.value = medidor.calleSecundaria;
    // medidorNumeroCasa.value = medidor.numeroCasa;
    // medidorReferencia.value = medidor.referencia;
    // medidorObservacion.value = medidor.observacion;
    // Inhabilitamos los campos que no se deben editar
    if (contrato.codigoMedidor != undefined) {
      medidorInstalacion.value = formatearFecha(contrato.fechaInstalacion);
      medidorMarca.value = contrato.marca;
      medidorBarrio.value = contrato.barrio;
      medidorPrincipal.value = contrato.callePrincipal;
      medidorSecundaria.value = contrato.calleSecundaria;
      medidorNumeroCasa.value = contrato.numeroCasa;
      medidorReferencia.value = contrato.referencia;
      medidorObservacion.value = contrato.observacion;
    }

    contratoFecha.readOnly = true;
    socioContratanteCedula.readOnly = true;
    socioContratanteApellido.readOnly = true;
    socioContratanteNombre.readOnly = true;
    // ~~~~~~~~~~~~~~~~
    editContratoId = contrato.id;
  }
  socioContratanteId = contrato.sociosId;
  editingStatus = true;
  console.log(contrato);
  console.log("btn1");
  editarServiciosContratados(id);
  getServiciosDisponibles();
  seccion1.classList.remove("active");
  seccion2.classList.add("active");
};
// ----------------------------------------------------------------
// Funcion que carga los servicios contratados segun el id del contrato
// y los muestra en el formulario para editarlos
// ----------------------------------------------------------------
async function editarServiciosContratados(id) {
  try {
    serviciosEditar = await ipcRenderer.invoke(
      "getServiciosContratadosById",
      id
    );

    //serviciosContratadosList.push(serviciosContratados.serviciosFijosId);
    console.log("Servicios a editar: ", serviciosEditar);
  } catch (error) {
    console.log(
      "Error al cargar los servicios contratados para " + id + " : " + error
    );
  }
}
// ----------------------------------------------------------------
// Funcion que elimina un contrato segun el id
// ----------------------------------------------------------------
const deleteMedidor = async (id) => {
  const response = confirm("Estas seguro de eliminar este medidor?");
  if (response) {
    console.log("id from medidores.js");
    const result = await ipcRenderer.invoke("deleteMedidor", id);
    console.log("Resultado medidores.js", result);
    getContratos();
  }
};
// ----------------------------------------------------------------
// Funcion que consulta los contratos con medidor
// ----------------------------------------------------------------
const getContratos = async () => {
  datosContratos = await ipcRenderer.invoke("getContratosConMedidor");
  console.log(datosContratos);
  renderContratosConMedidor(datosContratos);
};
// ----------------------------------------------------------------
// Funcion que consulta los contratos sin medidor
// ----------------------------------------------------------------
const getContratosSinMedidor = async () => {
  datosContratosSinMedidor = await ipcRenderer.invoke("getContratosSinMedidor");
  console.log("Here: ", datosContratosSinMedidor);
  renderContratosSinMedidor(datosContratosSinMedidor);
};
// ----------------------------------------------------------------
// Funcion que consulta los servicios disponibles para el contrato
// ----------------------------------------------------------------
const getServiciosDisponibles = async () => {
  serviciosDisponibles = await ipcRenderer.invoke("getServiciosDisponibles");
  console.log(serviciosDisponibles);
  renderServiciosDisponibles(serviciosDisponibles);
  eventoServiciosId(serviciosDisponibles);
};
// ----------------------------------------------------------------
// Funcion que carga los eventos iniciales de la interfaz
// ----------------------------------------------------------------
async function init() {
  await getContratos();
  await getContratosSinMedidor();
  await getServiciosDisponibles();
  // await getMedidoresDisponibles();
}
function formatearFecha(fecha) {
  const fechaOriginal = new Date(fecha);
  const year = fechaOriginal.getFullYear();
  const month = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
  const day = String(fechaOriginal.getDate()).padStart(2, "0");
  const fechaFormateada = `${year}-${month}-${day}`;
  return fechaFormateada;
}
// ----------------------------------------------------------------
// Cargar datos de los socios registrados
// ----------------------------------------------------------------
var inputSugerencias = document.getElementById("cedulaSocioContratante");
var listaSugerencias = document.getElementById("lista-sugerencias");
var sugerencias = [];
// ----------------------------------------------------------------
// Obtener las sugerencias desde la base de datos
// ----------------------------------------------------------------
async function obtenerSugerencias() {
  try {
    var cedulasSugerencias = await ipcRenderer.invoke("getSocios");
    sugerencias = cedulasSugerencias.map(function (objeto) {
      return objeto;
      // objeto.cedulaPasaporte +
      // " " +
      // objeto.primerNombre +
      // " " +
      // objeto.segundoNombre +
      // " " +
      // objeto.primerApellido +
      // " " +
      // objeto.segundoApellido
    });
  } catch (error) {
    console.error("Error al obtener las sugerencias:", error);
  }
}

inputSugerencias.addEventListener("input", function () {
  var textoIngresado = inputSugerencias.value;
  var sugerenciasFiltradas = sugerencias.filter(function (sugerencia) {
    return sugerencia.cedulaPasaporte.startsWith(textoIngresado);
  });

  mostrarSugerencias(sugerenciasFiltradas);
});

function mostrarSugerencias(sugerencias) {
  listaSugerencias.innerHTML = "";
  sugerencias.forEach(function (sugerencia) {
    var li = document.createElement("li");

    li.textContent =
      sugerencia.cedulaPasaporte +
      " (" +
      sugerencia.primerNombre +
      " " +
      sugerencia.primerApellido +
      " " +
      sugerencia.segundoApellido +
      ")";
    li.addEventListener("click", function () {
      inputSugerencias.value = sugerencia.cedulaPasaporte;
      obtenerDatosSocioContratante(sugerencia.cedulaPasaporte);
      listaSugerencias.innerHTML = "";
    });

    li.style.padding = "1px";
    li.style.cursor = "pointer";
    li.style.listStyle = "none";
    listaSugerencias.appendChild(li);
  });
}
// ----------------------------------------------------------------
// Obtener las sugerencias desde la base de datos al cargar la página
// ----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  obtenerSugerencias()
    .then(function () {
      console.log("Sugerencias obtenidas:", sugerencias);
    })
    .catch(function (error) {
      console.error("Error al obtener las sugerencias:", error);
    });
});
const obtenerDatosSocioContratante = async (cedula) => {
  console.log("Se llamo a la carga de datos del contratante", cedula);
  const socioContratante = await ipcRenderer.invoke(
    "getContratanteByCedula",
    cedula
  );
  socioContratanteNombre.value =
    socioContratante.primerNombre + " " + socioContratante.segundoNombre;
  socioContratanteApellido.value =
    socioContratante.primerApellido + " " + socioContratante.segundoApellido;
  socioContratanteId = socioContratante.id;
  console.log(socioContratante);
  verificarContratosAnteriores(cedula);
};
// ----------------------------------------------------------------
// funcion que notifica si el usuario presenta contratos anteriores
// ----------------------------------------------------------------
const verificarContratosAnteriores = async (cedula) => {
  console.log("Se llamo a la verificacion de contratos", cedula);
  const contratos = await ipcRenderer.invoke(
    "getContratosAnterioresByCedula",
    cedula
  );
  console.log(contratos);
};
ipcRenderer.on("showAlertMedidoresExistentes", (event, message) => {
  Swal.fire({
    title: 'Contratos anteriores',
    text: message,
    icon: 'info', // Puedes usar 'success', 'error', 'warning', 'info', etc.
  });
  //alert(message);
 // window.showErrorBox("Título", "Contenido del mensaje");
});
// ----------------------------------------------------------------
// Habilitar o desabilitar el formulario del
//medidor en funcion de si el socio solicita el servicio de agua potable
// ----------------------------------------------------------------
function habilitarFormMedidor() {
  fechaInstalacion.disabled = false;
  medidorMarca.disabled = false;

  (medidorNumeroCasa.disabled = false), (medidorBarrio.disabled = false);
  medidorPrincipal.disabled = false;
  medidorSecundaria.disabled = false;
  medidorReferencia.disabled = false;
  medidorObservacion.disabled = false;
}
function inHabilitarFormMedidor() {
  fechaInstalacion.disabled = true;
  medidorMarca.disabled = true;

  (medidorNumeroCasa.disabled = true), (medidorBarrio.disabled = true);
  medidorPrincipal.disabled = true;
  medidorSecundaria.disabled = true;
  medidorReferencia.disabled = true;
  medidorObservacion.disabled = true;
}
// ----------------------------------------------------------------
// Transicion entre las secciones de la vista
// ----------------------------------------------------------------
var btnSeccion1 = document.getElementById("btnSeccion1");
var btnSeccion2 = document.getElementById("btnSeccion2");
var seccion1 = document.getElementById("seccion1");
var seccion2 = document.getElementById("seccion2");

btnSeccion1.addEventListener("click", function () {
  console.log("btn1");
  seccion1.classList.remove("active");
  seccion2.classList.add("active");
});

btnSeccion2.addEventListener("click", function () {
  console.log("btn2");
  seccion2.classList.remove("active");
  seccion1.classList.add("active");
});
// ----------------------------------------------------------------
// funciones de trancision entre interfaces
// ----------------------------------------------------------------
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
  const url = "src/ui/planillas.html";
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
