const { ipcRenderer } = require("electron");
// ----------------------------------------------------------------
// Varibles de las planillas
// ----------------------------------------------------------------
const planillaEmision = document.getElementById("planillaEmision");
const planillaCodigo = document.getElementById("planillaCodigo");
const planillaEstado = document.getElementById("planillaEstado");
const lecturaAnterior = document.getElementById("lecturaAnterior");
const lecturaActual = document.getElementById("lecturaActual");
const valorConsumo = document.getElementById("valorConsumo");
const tarifaConsumo = document.getElementById("tarifaConsumo");
const planillasList = document.getElementById("planillas");
// ----------------------------------------------------------------
// Variables del socio
// ----------------------------------------------------------------
const socioNombres = document.getElementById("socioNombres");
const socioCedula = document.getElementById("socioCedula");
// ----------------------------------------------------------------
// Variables del contrato/medidor
// ----------------------------------------------------------------
const contratoCodigo = document.getElementById("contratoCodigo");
// ----------------------------------------------------------------
// Variables de los servicios
// ----------------------------------------------------------------
const serviciosFijosList = document.getElementById("serviciosFijos");
const otrosServiciosList = document.getElementById("otrosServicios");
const otrosAplazablesList = document.getElementById("otrosAplazables");
const mesBusqueda = document.getElementById("mesBusqueda");
const anioBusqueda = document.getElementById("anioBusqueda");
const errortextAbono = document.getElementById("errorTextAbono");
const errContainer = document.getElementById("err-container");
// ----------------------------------------------------------------
// Variables del los totales de la planilla
// ----------------------------------------------------------------
let totalFinal = 0.0;
let totalConsumo = 0.0;
let tarifaAplicada = "Familiar";
let valorTarifa = 2.0;
const valorSubtotal = document.getElementById("valorSubtotal");
const valorTotalDescuento = document.getElementById("valorTotalDescuento");
const valorTotalPagar = document.getElementById("valorTotalPagar");
// Variables del dialogo de los servicios
const dialogServicios = document.getElementById("formServicios");
const servicioDg = document.getElementById("title-dg");
const descripcionDg = document.getElementById("descripcion-dg");
const detallesDg = document.getElementById("detalles-dg");
const subtotalDg = document.getElementById("subtotal-dg");
const descuentoDg = document.getElementById("descuento-dg");
const totalDg = document.getElementById("total-dg");
const numPagosDg = document.getElementById("numPagos-dg");
const canceladosDg = document.getElementById("cancelados-dg");
const pendientesDg = document.getElementById("pendientes-dg");
const saldoDg = document.getElementById("saldo-dg");
const abonadoDg = document.getElementById("abonado-dg");
const abonarDg = document.getElementById("abonar-dg");
const guardarDg = document.getElementById("btnGuardar-dg");
const administrarDg = document.getElementById("btnAdministrar-dg");
let abonarStatus = false;
let valorAbonoEdit = 0;
let planillas = [];
let datosServicios = [];
let serviciosFijos = [];
let otrosServicios = [];
let editingStatus = false;
let editPlanillaId = "";
let editDetalleId = "";
planillaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newPlanilla = {
    valor: valorConsumo.value,
    lecturaAnterior: lecturaAnterior.value,
    lecturaActual: lecturaActual.value,
    observacion: "NA",
    tarifa: tarifaAplicada,
    tarifaValor: valorTarifa,
  };
  const newDetalleServicio = {
    subtotal: valorConsumo.value,
    total: valorConsumo.value,
    saldo: valorConsumo.value,
    abono: 0.0,
  };
  if (!editingStatus) {
    const result = await ipcRenderer.invoke("createPlanilla");
    console.log(result);
  } else {
    console.log("Editing planilla with electron");
    const result = await ipcRenderer.invoke(
      "updatePlanilla",
      editPlanillaId,
      newPlanilla
    );
    const resultDetalle = await ipcRenderer.invoke(
      "updateDetalle",
      editDetalleId,
      newDetalleServicio
    );
    editingStatus = false;
    editPlanillaId = "";
    console.log(result, resultDetalle);
  }
  getPlanillas();
  planillaForm.reset();
  //medidorCodigo.focus();
});
// function renderPlanillas(datosPlanillas) {
//   planillasList.innerHTML = "";
//   datosPlanillas.forEach((datosPlanilla) => {
//     planillasList.innerHTML += `
//        <tr>
//        <td>${datosPlanilla.codigoPlanilla}</td>
//        <td>${datosPlanilla.codigoMedidor}</td>
//        <td>${datosPlanilla.nombre + " " + datosPlanilla.apellido}</td>
//        <td>${datosPlanilla.cedula}</td>
//        <td>${formatearFecha(datosPlanilla.fecha)}</td>
//        <td>${datosPlanilla.valor}</td>
//        <td>${datosPlanilla.estado}</td>
//        <td>${datosPlanilla.lecturaAnterior}</td>
//        <td>${datosPlanilla.lecturaActual}</td>
//       <td>
//       <button onclick="deleteMedidor('${datosPlanilla.id}')" class="btn ">
//       <i class="fa-solid fa-user-minus"></i>
//       </button>
//       </td>
//       <td>
//       <button onclick="editPlanilla('${datosPlanilla.id}')" class="btn ">
//       <i class="fa-solid fa-user-pen"></i>
//       </button>
//       </td>
//    </tr>
//       `;
//   });
// }
function renderPlanillas(datosPlanillas) {
  planillasList.innerHTML = "";
  datosPlanillas.forEach(async (datosPlanilla) => {
    // Crear el elemento div principal con las clases y el estilo
    const cardDiv = document.createElement("div");
    cardDiv.className = "col-6 mx-1 card mb-3 border-info card-planilla";
    cardDiv.style.maxWidth = "48%";
    // Crear el elemento div para el encabezado de la tarjeta con la clase y el estilo
    const headerDiv = document.createElement("div");
    headerDiv.className = "card-header row d-flex ";
    headerDiv.style.backgroundColor = "#85c1e9";

    // Crear el elemento div para la información del contrato
    const contratoDiv = document.createElement("div");
    contratoDiv.className = "d-flex col-6 titulo-detalles header-planilla";
    const contratoP = document.createElement("p");
    contratoP.textContent = "Contrato: ";
    const contratoValor = document.createTextNode(datosPlanilla.codigo);
    contratoDiv.appendChild(contratoP);
    contratoDiv.appendChild(contratoValor);

    // Crear el elemento div para la información de "Cancelado"
    const canceladoDiv = document.createElement("div");
    canceladoDiv.className =
      "d-flex col-6 titulo-detalles header-planilla positive justify-content-end";
    const canceladoP = document.createElement("p");
    canceladoP.textContent = "Cancelado: ";
    const canceladoValor = document.createTextNode(datosPlanilla.estado);
    canceladoDiv.appendChild(canceladoP);
    canceladoDiv.appendChild(canceladoValor);

    // Agregar los elementos de contrato y cancelado al encabezado
    headerDiv.appendChild(contratoDiv);
    headerDiv.appendChild(canceladoDiv);

    // Crear el elemento div para el cuerpo de la tarjeta
    const bodyDiv = document.createElement("div");
    bodyDiv.className = "card-body cuerpo";

    // Crear el elemento div para el título del socio
    const socioDiv = document.createElement("div");
    socioDiv.className = "card-title d-flex titulo-socio";
    const socioH5 = document.createElement("h5");
    socioH5.textContent = "Socio: ";
    const socioP = document.createTextNode(datosPlanilla.nombre);
    socioDiv.appendChild(socioH5);
    socioDiv.appendChild(socioP);

    // Crear el elemento para la fecha de emisión
    const fechaEmisionDiv = document.createElement("div");
    fechaEmisionDiv.className = "d-flex";
    const fechaEmisionP = document.createElement("p");
    fechaEmisionP.textContent = "Fecha emisión: ";
    const fechaEmisionSp = document.createTextNode("-");

    const fechaEmisionValor = document.createTextNode(
      formatearFecha(datosPlanilla.fechaEmision)
    );
    fechaEmisionDiv.appendChild(fechaEmisionP);
    fechaEmisionDiv.appendChild(fechaEmisionSp);
    fechaEmisionDiv.appendChild(fechaEmisionValor);

    // Crear el elemento para la sección de servicios
    const serviciosDiv = document.createElement("div");
    serviciosDiv.className = "row";
    const serviciosP = document.createElement("p");
    serviciosP.className = "text-center titulo-servicios-positive";
    serviciosP.textContent = "Agua Potable";
    const serviciosTituloP = document.createElement("p");
    serviciosTituloP.className = "text-center titulo-servicios-positive";
    serviciosTituloP.textContent = "Servicios";
    // Agrega la fecha de Emision y el Socio
    serviciosDiv.appendChild(socioDiv);
    serviciosDiv.appendChild(fechaEmisionDiv);
    serviciosDiv.appendChild(serviciosP);

    // Crear el elemento para la lista de servicios
    const listaServiciosDiv = document.createElement("div");
    listaServiciosDiv.className = "lista-servicios";
    // Crear la lista ul con la clase
    const listaUl = document.createElement("ul");
    listaUl.className = "list-group list-group-flush";

    //Consulta los servicios a cancelar de acuerdo al id del contrato
    datosServicios = await ipcRenderer.invoke(
      "getDatosServiciosByContratoId",
      datosPlanilla.contratosId,
      formatearFecha(datosPlanilla.fechaEmision),
      "all"
    );
    console.log("Servicios encontrados: " + datosServicios);
    // Crear elementos para los detalles de servicios (Consumo, Tarifa, Valor)
    var valorAguaPotable = null;
    var totalPagar = 0.0;
    const consumoDiv = document.createElement("div");
    consumoDiv.className = "col-4 d-flex titulo-detalles";
    const consumoP = document.createElement("p");
    consumoP.textContent = "Consumo:";
    const tarifaDiv = document.createElement("div");
    tarifaDiv.className = "col-4 d-flex titulo-detalles";
    const tarifaP = document.createElement("p");
    tarifaP.textContent = "Tarifa:";
    const valorDiv = document.createElement("div");
    valorDiv.className = "col-4 d-flex titulo-detalles";
    const valorP = document.createElement("p");
    valorP.textContent = "Valor: $";

    datosServicios.forEach((datosServicio) => {
      if (datosServicio.nombre === "Agua Potable") {
        valorAguaPotable = datosServicio.total;
        tarifaAguaPotable = datosServicio.tarifa;
        totalPagar += datosServicio.total;
      } else {
        // Crear elementos de la lista de servicios (Alcantarillado, Recolección de desechos, Riego Agrícola, Bomberos)

        if (datosServicio.aplazableSn === "Si") {
          const alcantarilladoLi = document.createElement("li");
          alcantarilladoLi.className = "titulo-detalles d-flex detalles";
          const alcantarilladoP = document.createElement("p");
          alcantarilladoP.textContent = datosServicio.nombre + ": ";
          const alcantarilladoValor = document.createTextNode(
            datosServicio.abono
          );
          totalPagar += datosServicio.abono;
          alcantarilladoLi.appendChild(alcantarilladoP);
          alcantarilladoLi.appendChild(alcantarilladoValor);
          listaUl.appendChild(alcantarilladoLi);
        } else {
          const alcantarilladoLi = document.createElement("li");
          alcantarilladoLi.className = "titulo-detalles d-flex detalles";
          const alcantarilladoP = document.createElement("p");
          alcantarilladoP.textContent = datosServicio.nombre + ": ";
          const alcantarilladoValor = document.createTextNode(
            datosServicio.total
          );
          totalPagar += datosServicio.total;
          alcantarilladoLi.appendChild(alcantarilladoP);
          alcantarilladoLi.appendChild(alcantarilladoValor);
          listaUl.appendChild(alcantarilladoLi);
        }
      }

      // Agregar los elementos de servicios al contenedor de servicios

      serviciosDiv.appendChild(consumoDiv);
      serviciosDiv.appendChild(tarifaDiv);
      serviciosDiv.appendChild(valorDiv);
      serviciosDiv.appendChild(serviciosTituloP);

      // Agregar la lista ul al contenedor de lista de servicios
      listaServiciosDiv.appendChild(listaUl);
    });
    console.log("valor agua: " + valorAguaPotable);

    if (
      valorAguaPotable === null ||
      valorAguaPotable === undefined ||
      valorAguaPotable === "null"
    ) {
      console.log("Asignando NA");
      const consumoValor = document.createTextNode("NA");
      consumoDiv.appendChild(consumoP);
      consumoDiv.appendChild(consumoValor);
      const tarifaValor = document.createTextNode("NA");
      tarifaDiv.appendChild(tarifaP);
      tarifaDiv.appendChild(tarifaValor);
      const valorValor = document.createTextNode("NA");
      valorDiv.appendChild(valorP);
      valorDiv.appendChild(valorValor);
    } else {
      lectura = await getDatosLecturas(
        datosPlanilla.contratosId,
        formatearFecha(datosPlanilla.fechaEmision)
      );
      console.log("Datos Lecturas: ", lectura);
      const consumoValor = document.createTextNode(
        lectura[0].lecturaActual - lectura[0].lecturaAnterior
      );
      consumoDiv.appendChild(consumoP);
      consumoDiv.appendChild(consumoValor);
      const tarifaValor = document.createTextNode(
        " " + "(" + lectura[0].tarifaValor + ")"
      );
      // const tarifaValor = document.createTextNode(
      //   lectura[0].tarifa + "(" + lectura[0].tarifaValor + ")"
      // );
      tarifaDiv.appendChild(tarifaP);
      tarifaDiv.appendChild(tarifaValor);
      // tarifaDiv.className = "d-flex";
      const valorValor = document.createTextNode(lectura[0].valor);
      valorDiv.appendChild(valorP);
      valorDiv.appendChild(valorValor);
    }
    // --->
    bodyDiv.appendChild(serviciosDiv);
    bodyDiv.appendChild(listaServiciosDiv);
    // Crear el elemento para el pie de la tarjeta
    const footerDiv = document.createElement("div");
    footerDiv.className = "card-footer row d-flex";
    // Crear elemento para el total
    const totalDiv = document.createElement("div");
    totalDiv.className = "col-6 titulo-detalles d-flex";
    const totalP = document.createElement("p");
    totalP.textContent = "Total: $";
    const totalValor = document.createTextNode(totalPagar);
    totalDiv.appendChild(totalP);
    totalDiv.appendChild(totalValor);

    // Crear el botón con la clase y el ícono
    const button = document.createElement("button");
    button.className = "btn-planilla-positive col-6";
    // Añadir un evento onclick
    button.onclick = function () {
      editPlanilla(
        datosPlanilla.planillasId,
        datosPlanilla.contratosId,
        formatearFecha(datosPlanilla.fechaEmision)
      );
      console.log(
        "¡Hiciste clic en el botón!",
        datosPlanilla.planillasId,
        datosPlanilla.contratosId,
        formatearFecha(datosPlanilla.fechaEmision)
      );
    };

    const buttonIcon = document.createElement("i");
    buttonIcon.className = "fa-solid fa-file-pen";
    button.appendChild(buttonIcon);

    // Agregar elementos al pie de la tarjeta
    footerDiv.appendChild(totalDiv);
    footerDiv.appendChild(button);

    // Agregar todos los elementos a la tarjeta principal
    cardDiv.appendChild(headerDiv);
    cardDiv.appendChild(bodyDiv);
    // cardDiv.appendChild(serviciosDiv);
    // cardDiv.appendChild(listaServiciosDiv);
    cardDiv.appendChild(footerDiv);

    // Agregar la tarjeta al documento (por ejemplo, al elemento con el id "planillasList")
    // const planillasList = document.getElementById("planillasList");
    planillasList.appendChild(cardDiv);
  });
}
const getDatosLecturas = async (contratoId, fechaEmision) => {
  console.log("Parámetros de busqueda: " + contratoId, fechaEmision);
  const lectura = await ipcRenderer.invoke(
    "getLecturasByFecha",
    contratoId,
    fechaEmision
  );
  return lectura;
};
const editPlanilla = async (planillaId, contratoId, fechaEmision) => {
  editingStatus = true;
  editPlanillaId = planillaId;
  console.log("Planilla a editar: " + planillaId);
  totalFinal = 0.0;
  totalConsumo = 0.0;
  console.log(
    "LLamando funcion editPlanilla: " + planillaId,
    contratoId,
    fechaEmision
  );
  const planilla = await ipcRenderer.invoke("getPlanillaById", planillaId);
  // ----------------------------------------------------------------
  // Datos del encabezado de la planilla a editar
  planillaEmision.textContent = formatearFecha(planilla[0].fechaEmision);
  planillaCodigo.textContent = planilla[0].planillasCodigo;
  planillaEstado.textContent = planilla[0].estado;
  socioNombres.textContent = planilla[0].nombre;
  socioCedula.textContent = planilla[0].cedulaPasaporte;
  // ----------------------------------------------------------------
  // Datos del consumo de agua potable de la planilla
  lecturaActual.value = planilla[0].lecturaActual;
  lecturaAnterior.value = planilla[0].lecturaAnterior;
  valorConsumo.value = planilla[0].valor;
  console.log("total consumo: ", totalConsumo);
  totalConsumo += planilla[0].valor;
  console.log("total consumo: ", totalConsumo);
  console.log(planilla[0]);
  serviciosFijosList.innerHTML = "";
  otrosServiciosList.innerHTML = "";
  otrosAplazablesList.innerHTML = "";
  serviciosFijos = await ipcRenderer.invoke(
    "getDatosServiciosByContratoId",
    contratoId,
    formatearFecha(fechaEmision),
    "fijos"
  );
  if (serviciosFijos[0] !== undefined) {
    renderServicios(serviciosFijos, "fijos");
  } else {
    serviciosFijosList.innerHTML = "";
  }
  otrosServicios = await ipcRenderer.invoke(
    "getDatosServiciosByContratoId",
    contratoId,
    formatearFecha(fechaEmision),
    "otros"
  );
  if (otrosServicios[0] !== undefined) {
    renderServicios(otrosServicios, "otros");
  } else {
    otrosServiciosList.innerHTML = "";
  }
  calcularConsumo();
  valorTotalPagar.value = totalFinal + totalConsumo;
};
function renderServicios(servicios, tipo) {
  let totalPagarEdit = 0.0;
  console.log("Servicios a renderizard: ", servicios, tipo);

  servicios.forEach((servicio) => {
    // Crear el div principal
    if (servicio.nombre !== "Agua Potable") {
      const tr = document.createElement("tr");
      tr.id = servicio.id;
      const tdServicio = document.createElement("td");
      tdServicio.textContent = servicio.nombre;
      const tdAplazable = document.createElement("td");
      tdAplazable.textContent = servicio.aplazableSn;
      const tdSubtotal = document.createElement("td");
      tdSubtotal.textContent = servicio.valor;
      const tdDescuento = document.createElement("td");
      tdDescuento.textContent = servicio.descuento;
      const tdTotal = document.createElement("td");
      tdTotal.textContent = servicio.total;
      const tdSaldo = document.createElement("td");
      tdSaldo.textContent = servicio.total;
      const tdAbono = document.createElement("td");
      tdAbono.className = "valorAbono";

      tdAbono.textContent = servicio.abono;
      if (servicio.aplazableSn === "Si") {
        totalPagarEdit += servicio.abono;
      } else {
        totalPagarEdit += servicio.total;
      }
      const tdBtnGestionar = document.createElement("td");
      const btnGestionar = document.createElement("button");
      btnGestionar.className = "btn";
      btnGestionar.type = "button";
      btnGestionar.onclick = () => {
        detallesServiciodg(servicio);
        valorAbonoEdit = servicio.id;
      };
      const iconGestionar = document.createElement("i");
      iconGestionar.className = "fa-solid fa-ellipsis-vertical";
      btnGestionar.appendChild(iconGestionar);
      tdBtnGestionar.appendChild(btnGestionar);
      if (tipo == "fijos") {
        tr.appendChild(tdServicio);
        tr.appendChild(tdSubtotal);
        tr.appendChild(tdDescuento);
        tr.appendChild(tdTotal);
        tr.appendChild(tdBtnGestionar);
        serviciosFijosList.appendChild(tr);
      } else {
        if (servicio.aplazableSn === "Si") {
          tr.appendChild(tdServicio);
          tr.appendChild(tdSubtotal);
          tr.appendChild(tdDescuento);
          tr.appendChild(tdTotal);
          tr.appendChild(tdSaldo);
          tr.appendChild(tdAbono);
          tr.appendChild(tdBtnGestionar);
          otrosAplazablesList.appendChild(tr);
        } else {
          tr.appendChild(tdServicio);
          tr.appendChild(tdSubtotal);
          tr.appendChild(tdDescuento);
          tr.appendChild(tdTotal);
          tr.appendChild(tdBtnGestionar);
          otrosServiciosList.appendChild(tr);
        }
      }
    } else if (servicio.nombre === "Agua Potable") {
      editDetalleId = servicio.id;
      console.log("Id del detalle Agua: " + editDetalleId);
    }
  });
  totalFinal += totalPagarEdit;
}
// function renderServicios(servicios, tipo) {
//   let totalPagarEdit = 0.0;
//   console.log("Servicios a renderizard: ", servicios, tipo);

//   servicios.forEach((servicio) => {
//     // Crear el div principal
//     if (servicio.nombre !== "Agua Potable") {
//       const divPrincipal = document.createElement("div");
//       divPrincipal.className = "col-12 card border-info mb-2 ";
//       divPrincipal.style.maxWidth = "100%";
//       divPrincipal.style.maxHeight = "45%";
//       divPrincipal.style.minHeight = "45%";
//       divPrincipal.style.padding = "0";

//       // Crear el div para el encabezado
//       const divEncabezado = document.createElement("div");
//       divEncabezado.className = "card-header titulo-detalles";
//       divEncabezado.style.margin = "0";
//       divEncabezado.style.padding = "0.5%";
//       divEncabezado.style.backgroundColor = "#85c1e9";
//       const encabezadoTexto = document.createElement("p");
//       encabezadoTexto.textContent = servicio.nombre;
//       divEncabezado.appendChild(encabezadoTexto);

//       // Crear el div para el cuerpo de la tarjeta
//       const divCuerpo = document.createElement("div");
//       divCuerpo.className = "card-body card-cuerpo card-s-cuerpo";
//       divCuerpo.style.padding = "1em";

//       // Crear el div con las columnas
//       const divColumnas = document.createElement("div");
//       divColumnas.className = "col-12";
//       const divFila = document.createElement("div");
//       divFila.className = "row";

//       // Crear las columnas con sus contenidos
//       totalPagarEdit += servicio.total;
//       const columnas = [
//         { titulo: "Valor:", contenido: servicio.valor },
//         { titulo: "Desc:", contenido: servicio.tipodescuento },
//         { titulo: "Valor desc:", contenido: servicio.descuento },
//         { titulo: "Total:", contenido: servicio.total },
//       ];

//       columnas.forEach((columna) => {
//         const divColumna = document.createElement("div");
//         divColumna.className = "col-3 card-cuerpo";
//         const pTitulo = document.createElement("p");
//         pTitulo.textContent = columna.titulo;
//         const pContenido = document.createElement("p");
//         pContenido.textContent = columna.contenido;
//         divColumna.appendChild(pTitulo);
//         divColumna.appendChild(pContenido);
//         divFila.appendChild(divColumna);
//       });

//       divColumnas.appendChild(divFila);
//       divCuerpo.appendChild(divColumnas);

//       // Agregar los elementos al div principal
//       divPrincipal.appendChild(divEncabezado);
//       divPrincipal.appendChild(divCuerpo);

//       // Agregar el div principal al documento (por ejemplo, al cuerpo del documento)
//       // document.body.appendChild(divPrincipal);
//       if (tipo == "fijos") {
//         serviciosFijosList.appendChild(divPrincipal);
//       } else {
//         otrosServiciosList.appendChild(divPrincipal);
//       }
//     } else if (servicio.nombre === "Agua Potable") {
//       editDetalleId = servicio.id;
//       console.log("Id del detalle Agua: " + editDetalleId);
//     }
//   });
//   totalFinal += totalPagarEdit;
// }
guardarDg.onclick = function () {
  let totalRc = totalFinal;
  console.log("Total Rc: " + totalRc);
  console.log("Fila a editar: " + valorAbonoEdit);
  if (abonarStatus) {
    let nuevoAbono = abonarDg.value;
    const fila = document.getElementById(valorAbonoEdit);
    const valorAnterior = fila.querySelector(".valorAbono").textContent;
    console.log("Valor anterior: " + valorAnterior);
    if (valorAnterior !== nuevoAbono) {
      console.log("Compara: " + valorAnterior + " | " + nuevoAbono);
      fila.querySelector(".valorAbono").textContent = nuevoAbono;
      totalRc = totalFinal - valorAnterior;
      console.log("Total rc: " + totalRc);
      totalFinal = totalRc + parseFloat(nuevoAbono);
      console.log("Total final: " + totalFinal);
      valorTotalPagar.value = aproximarDosDecimales(
        totalFinal + parseFloat(totalConsumo)
      );
      CerrarFormServicios();
    } else {
      CerrarFormServicios();
    }
  }
};

const getPlanillas = async () => {
  planillas = await ipcRenderer.invoke("getDatosPlanillas");
  console.log(planillas);
  renderPlanillas(planillas);
};
async function init() {
  await getPlanillas();
  cargarAnioBusquedas();
  cargarMesActual();
}
async function calcularConsumo() {
  console.log("Consultando tarifas ...");
  let consumo = Math.round(lecturaActual.value - lecturaAnterior.value);
  let preValorConsumo = 0.0;
  let base = 0.0;
  let limitebase = 15.0;
  console.log("Consumo: " + consumo);
  const tarifas = await ipcRenderer.invoke("getTarifas");
  if (tarifas[0] !== undefined) {
    tarifas.forEach((tarifa) => {
      if (consumo >= tarifa.desde && consumo <= tarifa.hasta) {
        tarifaAplicada = tarifa.tarifa;
        valorTarifa = tarifa.valor;
        console.log("Tarifa aplicada: " + tarifaAplicada);
      }
      if (tarifa.tarifa === "Familiar") {
        base = tarifa.valor;
        limitebase = tarifa.hasta;
      }
    });
  }
  if (tarifaAplicada === "Familiar") {
    valorConsumo.value = valorTarifa.toFixed(2);
    totalConsumo = valorTarifa.toFixed(2);
    console.log("totalConsumo 1: " + totalConsumo);
  } else {
    console.log("Entrando else");
    if (consumo <= 0) {
      totalConsumo = base;
    } else {
      totalConsumo = (consumo - limitebase) * valorTarifa;
      preValorConsumo = totalConsumo + base;
      console.log("totalConsumo 2: " + preValorConsumo);
      totalConsumo = preValorConsumo;
      valorConsumo.value = totalConsumo.toFixed(2);
    }
  }

  tarifaConsumo.value = tarifaAplicada + "($" + valorTarifa + ")";

  console.log("Tarifa: " + tarifaAplicada + "(" + valorTarifa + ")");
}
async function vistaFactura() {
  let socio = socioNombres.textContent;
  console.log("Encabezado a enviar: " + socio);
  const datos = {
    mensaje: "Hola desde pagina1",
    otroDato: 12345,
  };
  const encabezado = {
    socio: socioNombres.textContent,
    fecha: formatearFecha(planillaEmision.textContent),
    cedula: socioCedula.textContent,
    contrato: contratoCodigo.textContent,
    planilla: planillaCodigo.textContent,
  };
  const datosAgua = {
    lecturaAnterior: lecturaAnterior.value,
    lecturaActual: lecturaActual.value,
    tarifaConsumo: tarifaConsumo.value,
    valorConsumo: valorConsumo.value,
  };
  const datosTotales = {
    subtotal: valorSubtotal.value,
    descuento: valorTotalDescuento.value,
    totalPagar: valorTotalPagar.value,
  };
  await ipcRenderer.send(
    "datos-a-pagina2",
    datos,
    encabezado,
    serviciosFijos,
    otrosServicios,
    datosAgua,
    datosTotales
  );
}
async function recalcularConsumo() {
  await calcularConsumo();
  console.log("tf-tc: " + totalFinal, totalConsumo);
  let totalRecalculado = totalFinal;
  console.log("totalRecalculado: " + totalRecalculado);
  console.log("Valor consumo: " + valorConsumo.value);
  totalRecalculado += parseFloat(valorConsumo.value);
  totalFinal = parseFloat(totalRecalculado).toFixed(2);
  valorTotalPagar.value = totalFinal;
}
function formatearFecha(fecha) {
  const fechaOriginal = new Date(fecha);
  const year = fechaOriginal.getFullYear();
  const month = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
  const day = String(fechaOriginal.getDate()).padStart(2, "0");
  const fechaFormateada = `${year}-${month}-${day}`;
  return fechaFormateada;
}
// Generar Planillas
async function generarPlanilla() {
  console.log("js");
  const result = await ipcRenderer.invoke("createPlanilla");
  console.log(result);
  //getPlanillas();
}
function cargarMesActual() {
  mesBusqueda.innerHTML = "";
  // Obtén el mes actual (0-indexed, enero es 0, diciembre es 11)
  const mesActual = new Date().getMonth();
  // Array de nombres de meses
  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  // Llena el select con las opciones de los meses
  for (let i = 0; i < nombresMeses.length; i++) {
    const option = document.createElement("option");
    option.value = i - 1; // El valor es el índice del mes
    option.textContent = nombresMeses[i];
    mesBusqueda.appendChild(option);
  }

  // Establece el mes actual como seleccionado
  mesBusqueda.value = mesActual;
}
function cargarAnioBusquedas() {
  anioBusqueda.innerHTML = "";
  // Obtener el año actual
  var anioActual = new Date().getFullYear();
  // Crear opciones de años desde el año actual hacia atrás
  for (var i = anioActual; i >= 2020; i--) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;
    if (i === anioActual) {
      option.selected = true;
    }

    anioBusqueda.appendChild(option);
  }
}
const detallesServiciodg = async (servicio) => {
  abonarStatus = true;
  errortextAbono.textContent = "Error";
  errContainer.style.display = "none";
  abonarDg.readOnly = true;
  let aplazable = "No aplazable";
  let cancelados = 0;
  let pendientes = 0;
  let valorCancelado = 0;
  let valorAbonar = 0;
  let valorSaldo = 0;
  console.log("Servicio al Dg: " + servicio.contratadosId);
  servicioDg.textContent = servicio.nombre;
  descripcionDg.textContent = servicio.descripcion;
  if (servicioDg.aplazableSn === "Si") {
    aplazable = "Aplazable";
  }
  detallesDg.textContent = servicio.tipo + " | " + aplazable;
  subtotalDg.textContent = servicio.subtotal;
  descuentoDg.textContent = servicio.descuento;
  totalDg.textContent = servicio.total;
  numPagosDg.textContent = servicio.numeroPagos;
  if (servicio.estadoDetalle !== "Cancelado") {
    pendientes + 1;
  }
  const pagosAnteriores = await ipcRenderer.invoke(
    "getDetallesByContratadoId",
    servicio.contratadosId
  );
  pagosAnteriores.forEach((pagoAnterior) => {
    if (pagoAnterior !== null || pagoAnterior !== undefined) {
      if (pagoAnterior.estado === "Cancelado") {
        valorCancelado += pagoAnterior.abono;
        cancelados++;
      } else {
        pendientes++;
      }
    }
  });

  canceladosDg.textContent = cancelados;
  pendientesDg.textContent = pendientes;
  valorSaldo = servicio.total - valorCancelado;
  saldoDg.textContent = valorSaldo;
  abonadoDg.textContent = valorCancelado;
  if (valorSaldo - valorCancelado < servicio.valorPagos) {
    valorAbonar = valorSaldo - valorCancelado;
  } else {
    if (servicio.valorPagos !== null) {
      valorAbonar = servicio.valorPagos;
    } else {
      valorAbonar = valorSaldo - valorCancelado;
    }
  }
  console.log("Abonar: " + valorAbonar);
  if (servicio.tipo !== "Servicio fijo" && servicio.aplazableSn === "Si") {
    abonarDg.readOnly = false;
  }
  abonarDg.value = valorAbonar;
  abonarDg.placeHolder = "" + valorAbonar;
  abonarDg.oninput = () => {
    if (abonarDg.value < valorAbonar) {
      abonarStatus = false;
      errContainer.style.display = "flex";
      errortextAbono.textContent =
        "El abono no puede ser menor a " + valorAbonar;
    } else if (abonarDg.value > valorSaldo) {
      abonarStatus = false;
      errContainer.style.display = "flex";
      errortextAbono.textContent =
        "El abono no puede ser mayor a " + valorSaldo;
    } else {
      abonarStatus = true;
      errortextAbono.textContent = "Error";
      errContainer.style.display = "none";
    }
  };
  if (dialogServicios.close) {
    dialogServicios.showModal();
  }
};

function mostrarFormServicios() {
  console.log("MostrarFormServicios");
  if (dialogServicios.close) {
    dialogServicios.showModal();
  }
}
function CerrarFormServicios() {
  dialogServicios.close();
}
function aproximarDosDecimales(numero) {
  // Redondea el número hacia arriba
  const numeroRedondeado = Math.ceil(numero * 100) / 100;
  return numeroRedondeado.toFixed(2);
}
// Transicion entre las secciones de la vista
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
