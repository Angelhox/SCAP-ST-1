const { ipcRenderer } = require("electron");
const validator = require("validator");
const Swal = require("sweetalert2");
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
// Varibles de busqueda de las planillas
// ----------------------------------------------------------------
const mesBusqueda = document.getElementById("mesBusqueda");
const anioBusqueda = document.getElementById("anioBusqueda");
const estadoBuscar = document.getElementById("estado");
const criterioBuscar = document.getElementById("criterio");
const criterioContent = document.getElementById("criterioContent");
const btnBuscar = document.getElementById("btnBuscar");
// ----------------------------------------------------------------
// Variables del socio
// ----------------------------------------------------------------
const socioNombres = document.getElementById("socioNombres");
const socioCedula = document.getElementById("socioCedula");
// ----------------------------------------------------------------
// Variables del contrato/medidor
// ----------------------------------------------------------------
const contratoCodigo = document.getElementById("contratatoCodigo");
// ----------------------------------------------------------------
// Variables de los servicios
// ----------------------------------------------------------------
const serviciosFijosList = document.getElementById("serviciosFijos");
const otrosServiciosList = document.getElementById("otrosServicios");
const otrosAplazablesList = document.getElementById("otrosAplazables");
const errortextAbono = document.getElementById("errorTextAbono");
const errContainer = document.getElementById("err-container");
// ----------------------------------------------------------------
// Variables del los totales de la planilla
let totalFinal = 0.0;
let totalConsumo = 0.0;
let tarifaAplicada = "Familiar";
let valorTarifa = 2.0;
let lecturaActualEdit = 0;
let lecturaAnteriorEdit = 0;
let valorConsumoEdit = 0;
// ----------------------------------------------------------------
const valorSubtotal = document.getElementById("valorSubtotal");
const valorTotalDescuento = document.getElementById("valorTotalDescuento");
const valorTotalPagar = document.getElementById("valorTotalPagar");
// ----------------------------------------------------------------
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
//----------------------------------------------------------------
// Variables de los elementos de la pagina
const mostrarLecturas = document.getElementById("mostrar-lecturas");
const contenedorLecturas = document.getElementById("contenedor-lecturas");
const collapse = document.getElementById("collapse");
const calcularConsumoBt = document.getElementById("calcular-consumo");
const cancelarForm = document.getElementById("cancelarForm");
// ----------------------------------------------------------------
// Variables contenedoras
let tarifasDisponibles = [];
// const socioNombre = document.getElementById("nombrecompleto");
// const medidorCodigo = document.getElementById("codigo");
// const medidorMarca = document.getElementById("marca");
// const medidorBarrio = document.getElementById("barrio");
// const medidorPrincipal = document.getElementById("principal");
// const medidorSecundaria = document.getElementById("secundaria");
// const medidorNumeroCasa = document.getElementById("numerocasa");
// const medidorReferencia = document.getElementById("referencia");
// const medidorObservacion = document.getElementById("observacion");

let planillas = [];
let editingStatus = false;
let planillaMedidorSn = false;
let editPlanillaId = "";
let editDetalleId = "";
let fechaEmisionEdit = "";
let editContratoId = "";
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
    saldo: 0.0,
    abono: valorConsumo.value,
  };
  if (!editingStatus) {
    console.log("Can not create planilla");
  } else {
    if (!planillaMedidorSn) {
      console.log("Guardado :) ");
    } else {
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
          console.log("Update planilla wait...");
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
          console.log(result, resultDetalle);
        }
      });
    }
  }
});

function renderPlanillas(datosPlanillas) {
  planillasList.innerHTML = "";
  datosPlanillas.forEach(async (datosPlanilla) => {
    // Crear el elemento div principal con las clases y el estilo
    const divContainer = document.createElement("div");
    divContainer.className = "col-xl-6 col-lg-12 col-md-12 col-sm-12 px-1";
    divContainer.style.height = "fit-content";
    divContainer.style.maxHeight = "fit-content";
    // divContainer.style.backgroundColor = "black";
    const cardDiv = document.createElement("div");
    cardDiv.className =
      "clase col-xl-12 col-lg-12 col-md-12 col-sm-12 my-1 mx-1 card card-planilla";
    cardDiv.style.backgroundColor = "red";

    cardDiv.style.width = "100%";
    // cardDiv.style.maxWidth = "100%";
    cardDiv.style.padding = "0.3em";
    cardDiv.style.backgroundColor = "#d6eaf8";
    cardDiv.style.height = "30em";
    cardDiv.style.minHeight = "30em";
    cardDiv.style.maxHeight = "30em";
    // Crear el elemento div para el encabezado de la tarjeta con la clase y el estilo
    const headerDiv = document.createElement("div");
    headerDiv.className = "card-header d-flex ";
    headerDiv.style.backgroundColor = "#85c1e9";

    // Crear el elemento div para la información del contrato
    const contratoDiv = document.createElement("div");
    contratoDiv.className = "d-flex col-6 titulo-detalles header-planilla";

    const contratoP = document.createElement("p");
    contratoP.textContent = "Contrato: ";
    const espace = document.createElement("p");
    espace.textContent = "-";
    espace.className = "trans";
    const contratoValor = document.createElement("p");
    contratoValor.textContent = datosPlanilla.codigo;
    contratoValor.className = "title-contrato ";
    contratoDiv.appendChild(contratoP);
    contratoDiv.appendChild(espace);
    contratoDiv.appendChild(contratoValor);

    // Crear el elemento div para la información de "Cancelado"
    const canceladoDiv = document.createElement("div");
    canceladoDiv.className =
      "d-flex col-6 titulo-detalles header-planilla positive justify-content-end";
    const canceladoP = document.createElement("p");
    canceladoP.textContent = "Cancelado: ";
    const canceladoValor = document.createTextNode(datosPlanilla.estado);
    // canceladoDiv.appendChild(canceladoP);
    canceladoDiv.appendChild(canceladoValor);

    // Agregar los elementos de contrato y cancelado al encabezado
    headerDiv.appendChild(contratoDiv);
    headerDiv.appendChild(canceladoDiv);

    // Crear el elemento div para el cuerpo de la tarjeta
    const bodyDiv = document.createElement("div");
    bodyDiv.className = "card-body cuerpo";
    bodyDiv.style.backgroundColor = "white";
    // Crear el elemento div para el título del socio
    const socioDiv = document.createElement("div");
    socioDiv.className = "card-title d-flex  mp-0";
    const socioH5 = document.createElement("p");
    socioH5.className = "mp-0 titulos";
    socioH5.textContent = "Socio: ";
    const espace1 = document.createElement("p");
    espace1.textContent = "-";
    espace1.className = "trans mp-0";
    const socioP = document.createTextNode(datosPlanilla.nombre);
    socioDiv.appendChild(socioH5);
    socioDiv.appendChild(espace1);
    socioDiv.appendChild(socioP);

    // Crear el elemento para la fecha de emisión
    const fechaEmisionDiv = document.createElement("div");
    fechaEmisionDiv.className = "d-flex ";
    const fechaEmisionP = document.createElement("p");
    fechaEmisionP.className = "titulos mp-0";
    fechaEmisionP.textContent = "Fecha emisión: ";
    const fechaEmisionSp = document.createElement("p");
    fechaEmisionSp.textContent = "-";
    fechaEmisionSp.className = "trans mp-0";
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
    const datosServicios = await ipcRenderer.invoke(
      "getDatosServiciosByContratoId",
      datosPlanilla.contratosId,
      formatearFecha(datosPlanilla.fechaEmision),
      "all"
    );
    console.log("Servicios encontrados: " + datosServicios);
    // Crear elementos para los detalles de servicios (Consumo, Tarifa, Valor)
    var rpValorAguaPotable = null;
    var rpTotalPagar = 0.0;
    // Contenedor y contenido de consumo
    const consumoDiv = document.createElement("div");
    consumoDiv.className = "col-4 d-flex titulo-detalles";
    const consumoP = document.createElement("p");
    consumoP.textContent = "Consumo:";
    const consumoSp = document.createElement("p");
    consumoSp.textContent = "-";
    consumoSp.className = "trans mp-0";
    // Contenedor y contenido de tarifa
    const tarifaDiv = document.createElement("div");
    tarifaDiv.className = "col-4 d-flex titulo-detalles";
    const tarifaP = document.createElement("p");
    tarifaP.textContent = "Tarifa:";
    const tarifaSp = document.createElement("p");
    tarifaSp.textContent = "-";
    tarifaSp.className = "trans mp-0";
    // Contenedor y contenido de valor consumo
    const valorDiv = document.createElement("div");
    valorDiv.className = "col-4 d-flex titulo-detalles";
    const valorP = document.createElement("p");
    valorP.textContent = "Valor:$ ";
    const valorSp = document.createElement("p");
    valorSp.textContent = "-";
    valorSp.className = "trans mp-0";
    if (datosServicios.length > 0) {
      datosServicios.forEach((datosServicio) => {
        if (datosServicio.nombre === "Agua Potable") {
          rpValorAguaPotable = datosServicio.total;
          tarifaAguaPotable = datosServicio.tarifa;
          // el total de servicio agua al total a pagar de rp
          rpTotalPagar += datosServicio.total;
        } else {
          // Crear elementos de la lista de servicios (Alcantarillado, Recolección de desechos, Riego Agrícola, Bomberos)
          if (datosServicio.aplazableSn === "Si") {
            const alcantarilladoLi = document.createElement("li");
            alcantarilladoLi.className = "titulo-detalles d-flex detalles";
            const alcantarilladoP = document.createElement("p");
            alcantarilladoP.textContent = datosServicio.nombre + ": ";
            const servicioSp = document.createElement("p");
            servicioSp.textContent = "-";
            servicioSp.className = "trans mp-0";
            const alcantarilladoValor = document.createTextNode(
              // en esta parte esta seliendo null
              parseFloat(datosServicio.abono).toFixed(2) + "$"
            );
            // si el servicio es aplazable sumo el abono al total a pagar de rp
            rpTotalPagar += datosServicio.abono;
            alcantarilladoLi.appendChild(alcantarilladoP);
            alcantarilladoLi.appendChild(servicioSp);
            alcantarilladoLi.appendChild(alcantarilladoValor);
            listaUl.appendChild(alcantarilladoLi);
          } else {
            const alcantarilladoLi = document.createElement("li");
            alcantarilladoLi.className = "titulo-detalles d-flex detalles";
            const alcantarilladoP = document.createElement("p");
            alcantarilladoP.textContent = datosServicio.nombre + ": ";
            const servicioSp = document.createElement("p");
            servicioSp.textContent = "-";
            servicioSp.className = "trans mp-0";
            const alcantarilladoValor = document.createTextNode(
              parseFloat(datosServicio.total).toFixed(2) + "$"
            );
            // Si el servicio no es aplazable (fijo u ocacional) sumo el total al total
            // a pagar de rp
            rpTotalPagar += datosServicio.total;
            alcantarilladoLi.appendChild(alcantarilladoP);
            alcantarilladoLi.appendChild(servicioSp);
            alcantarilladoLi.appendChild(alcantarilladoValor);
            listaUl.appendChild(alcantarilladoLi);
          }
        }

        // Agregar los elementos de servicios al contenedor de servicios

        serviciosDiv.appendChild(consumoDiv);
        serviciosDiv.appendChild(tarifaDiv);
        serviciosDiv.appendChild(valorDiv);
        serviciosDiv.appendChild(serviciosTituloP);
        listaServiciosDiv.appendChild(listaUl);
      });
      console.log("valor agua: " + rpValorAguaPotable);
      if (
        rpValorAguaPotable === null ||
        rpValorAguaPotable === undefined ||
        rpValorAguaPotable === "null"
      ) {
        // Si despues de almacenar el valor de agua potable la variable sique siendo null
        // no existe el servicio de agua potable asignamos No aplica
        console.log("Valor de agua= " + rpValorAguaPotable);
        console.log("Asignando NA");
        const consumoValor = document.createTextNode("NA");
        consumoDiv.appendChild(consumoP);
        consumoDiv.appendChild(consumoSp);
        consumoDiv.appendChild(consumoValor);
        const tarifaValor = document.createTextNode("NA");
        tarifaDiv.appendChild(tarifaP);
        tarifaDiv.appendChild(tarifaSp);
        tarifaDiv.appendChild(tarifaValor);
        const valorValor = document.createTextNode("0.0");
        valorDiv.appendChild(valorP);
        valorDiv.appendChild(valorSp);
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
        consumoDiv.appendChild(consumoSp);
        consumoDiv.appendChild(consumoValor);
        const tarifaValor = document.createTextNode(
          " " + "(" + lectura[0].tarifaValor + ")"
        );
        // const tarifaValor = document.createTextNode(
        //   lectura[0].tarifa + "(" + lectura[0].tarifaValor + ")"
        // );
        tarifaDiv.appendChild(tarifaP);
        tarifaDiv.appendChild(tarifaSp);
        tarifaDiv.appendChild(tarifaValor);
        // tarifaDiv.className = "d-flex";
        const valorValor = document.createTextNode(
          parseFloat(lectura[0].valor).toFixed(2)
        );
        valorDiv.appendChild(valorP);
        valorDiv.appendChild(valorSp);
        valorDiv.appendChild(valorValor);
      }
      // --->
      bodyDiv.appendChild(serviciosDiv);
      bodyDiv.appendChild(listaServiciosDiv);
    } else {
      // En caso de que no existan servicios cargados a la planilla
      console.log("Asignando NA para planillas vacias");
      const consumoValor = document.createTextNode("NA");
      consumoDiv.appendChild(consumoP);
      consumoDiv.appendChild(consumoSp);
      consumoDiv.appendChild(consumoValor);
      const tarifaValor = document.createTextNode("NA");
      tarifaDiv.appendChild(tarifaP);
      tarifaDiv.appendChild(tarifaSp);
      tarifaDiv.appendChild(tarifaValor);
      const valorValor = document.createTextNode("NA");
      valorDiv.appendChild(valorP);
      valorDiv.appendChild(valorSp);
      valorDiv.appendChild(valorValor);

      const alcantarilladoLi = document.createElement("li");
      alcantarilladoLi.className = "titulo-detalles d-flex detalles";
      const alcantarilladoP = document.createElement("p");
      alcantarilladoP.textContent = "Sin servicios adeudados" + ": ";
      const servicioSp = document.createElement("p");
      servicioSp.textContent = "-";
      servicioSp.className = "trans mp-0";
      const alcantarilladoValor = document.createTextNode(
        parseFloat(0).toFixed(2) + "$"
      );
      // El total a pagar de planillas sera cero
      rpTotalPagar += 0.0;
      alcantarilladoLi.appendChild(alcantarilladoP);
      alcantarilladoLi.appendChild(servicioSp);
      alcantarilladoLi.appendChild(alcantarilladoValor);

      serviciosDiv.appendChild(consumoDiv);
      serviciosDiv.appendChild(tarifaDiv);
      serviciosDiv.appendChild(valorDiv);

      serviciosDiv.appendChild(serviciosTituloP);
      listaUl.appendChild(alcantarilladoLi);
      listaServiciosDiv.appendChild(listaUl);

      bodyDiv.appendChild(serviciosDiv);
      bodyDiv.appendChild(listaServiciosDiv);
    }

    // Crear el elemento para el pie de la tarjeta
    const footerDiv = document.createElement("div");
    footerDiv.className = "card-footer row d-flex";
    footerDiv.style.border = "none";
    // Crear elemento para el total
    const totalDiv = document.createElement("div");
    totalDiv.className = "col-6 titulo-detalles d-flex";
    const totalP = document.createElement("p");
    totalP.textContent = "Total:$";
    const totalSp = document.createElement("p");
    totalSp.textContent = "-";
    totalSp.className = "trans mp-0";
    // Mostramos en el pie de la planilla el total que se calculo durante rp
    const totalValor = document.createTextNode(
      parseFloat(rpTotalPagar).toFixed(2)
    );
    totalDiv.appendChild(totalP);
    totalDiv.appendChild(totalSp);
    totalDiv.appendChild(totalValor);

    // Crear el botón con la clase y el ícono
    const button = document.createElement("button");
    button.className = "btn-planilla-positive col-6";
    // Añadir un evento onclick
    button.onclick = function () {
      // Elimina la clase "selected" de todos los elementos
      const elementos = document.querySelectorAll(".clase"); // Reemplaza con la clase real de tus elementos
      elementos.forEach((elemento) => {
        elemento.classList.remove("bg-secondary");
      });

      // Agrega la clase "selected" al elemento que se hizo clic
      cardDiv.classList.add("bg-secondary");
      // detallesContratos(datosContrato.contratosId);
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
    divContainer.appendChild(cardDiv);

    // Agregar la tarjeta al documento (por ejemplo, al elemento con el id "planillasList")
    // const planillasList = document.getElementById("planillasList");
    planillasList.appendChild(divContainer);
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
  fechaEmisionEdit = fechaEmision;
  editContratoId = contratoId;
  // Resetea las variables globales del calculo del total final para editPlanilla (ep)
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
  if (planilla[0].medidorSn !== "No") {
    planillaMedidorSn = true;

    lecturaActual.value = planilla[0].lecturaActual;
    lecturaActualEdit = planilla[0].lecturaActual;
    lecturaAnterior.value = planilla[0].lecturaAnterior;
    lecturaAnteriorEdit = planilla[0].lecturaAnterior;
    valorConsumo.value = planilla[0].valor;
    valorConsumoEdit = planilla[0].valor;
    console.log("total consumo reseteado: ", totalConsumo);
    // Asignamos a totalConsumo el valor de agua desde planilla
    totalConsumo += planilla[0].valor;
    console.log("total consumo con valor de ep: ", totalConsumo);
    console.log(planilla[0]);
    calcularConsumo();
    calcularConsumoBt.disabled = false;
    mostrarLecturas.disabled = false;
    mostrarLecturas.innerHTML = "";
    mostrarLecturas.innerHTML =
      "Servicio de agua potable" +
      '<i id="collapse" class="fs-3 fa-solid fa-caret-up"></i>';
    contenedorLecturas.style.display = "flex";
    collapse.classList.remove("fa-caret-down");
    collapse.classList.add("fa-caret-up");
  } else {
    planillaMedidorSn = false;
    lecturaActual.value = "";
    lecturaActual.placeHolder = "NA";
    lecturaAnterior.value = "";
    lecturaAnterior.placeHolder = "NA";
    valorConsumo.value = "";
    valorConsumo.placeHolder = "NA";
    tarifaConsumo.value = "";
    // calcularConsumo();
    console.log("total consumo: ", totalConsumo);
    // totalConsumo += planilla[0].valor;
    console.log("total consumo: ", totalConsumo);
    console.log(planilla[0]);
    calcularConsumoBt.disabled = true;
    mostrarLecturas.disabled = true;
    mostrarLecturas.innerHTML = "";
    mostrarLecturas.innerHTML =
      "No aplica servicio de agua potable" +
      '<i id="collapse" class="fs-3 fa-solid fa-caret-down"></i>';
    contenedorLecturas.style.display = "none";
    collapse.classList.add("fa-caret-down");
    collapse.classList.remove("fa-caret-up");
  }
  // Datos del consumo de agua potable de la planilla

  serviciosFijosList.innerHTML = "";
  otrosServiciosList.innerHTML = "";
  otrosAplazablesList.innerHTML = "";
  const serviciosFijos = await ipcRenderer.invoke(
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
  const otrosServicios = await ipcRenderer.invoke(
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
  recalcularConsumo();
  valorTotalPagar.value = totalFinal + totalConsumo;
};
function renderServicios(servicios, tipo) {
  let totalPagarEdit = 0.0;
  console.log("Servicios a renderizard: ", servicios, tipo);

  servicios.forEach((servicio) => {
    // Crear el div principal
    if (servicio.nombre !== "Agua Potable") {
      const tr = document.createElement("tr");
      const tdServicio = document.createElement("td");
      tdServicio.textContent = servicio.nombre;
      const tdAplazable = document.createElement("td");
      tdAplazable.textContent = servicio.aplazableSn;
      const tdSubtotal = document.createElement("td");
      tdSubtotal.textContent = servicio.valorIndividual;
      const tdDescuento = document.createElement("td");
      tdDescuento.textContent = servicio.descuentoValor;
      const tdTotal = document.createElement("td");
      tdTotal.textContent = servicio.total;
      const tdSaldo = document.createElement("td");
      tdSaldo.textContent = servicio.saldo;
      const tdAbono = document.createElement("td");

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
  console.log("Total de edit: ", totalFinal);
  recalcularConsumo();
}

const getPlanillas = async (criterio, criterioContent, estado, anio, mes) => {
  planillas = await ipcRenderer.invoke(
    "getDatosPlanillas",
    criterio,
    criterioContent,
    estado,
    anio,
    mes
  );
  console.log(planillas);
  renderPlanillas(planillas);
};
async function init() {
  // let fechaActual = new Date();
  // let anioEnviar = fechaActual.getFullYear();
  // let mesEnviar = fechaActual.getMonth() + 1;
  // let criterioEnviar = criterioBuscar.value;
  // let criterioContentEnviar = criterioContent.value;
  // let estadoEnviar = estadoBuscar.value;
  // console.log("error", mesEnviar, anioEnviar);
  // await getPlanillas(
  //   criterioEnviar,
  //   criterioContentEnviar,
  //   estadoEnviar,
  //   anioEnviar,
  //   mesEnviar
  // );
  buscarPlanillas();
  getTarifasDisponibles();
  cargarAnioBusquedas();
  cargarMesActual();
}
ipcRenderer.on("Notificar", (event, response) => {
  if (response.title === "Borrado!") {
    // resetFormAfterSave();
  } else if (response.title === "Actualizado!") {
    resetFormAfterUpdate();
  } else if (response.title === "Guardado!") {
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
lecturaActual.addEventListener("input", function () {
  recalcularConsumo();
});
async function getTarifasDisponibles() {
  tarifasDisponibles = await ipcRenderer.invoke("getTarifas");
  console.log("Tartifas disponibles :", tarifasDisponibles);
}
async function calcularConsumo() {
  console.log("Consultando tarifas ...");
  totalConsumo = 0;
  let consumo = Math.round(lecturaActual.value - lecturaAnterior.value);
  let base = 0.0;
  let limitebase = 15.0;
  console.log("Consumo redondeado cC: " + consumo);

  console.log("Tarifas: " + tarifasDisponibles);
  if (tarifasDisponibles[0] !== undefined) {
    tarifasDisponibles.forEach((tarifa) => {
      if (consumo >= tarifa.desde && consumo <= tarifa.hasta) {
        tarifaAplicada = tarifa.tarifa;
        valorTarifa = tarifa.valor;
        console.log(
          "VAlores que se asignaran: ",
          tarifaAplicada + "|" + valorTarifa
        );
      }
      if (tarifa.tarifa == "Familiar") {
        base = tarifa.valor;
        limitebase = tarifa.hasta;
        console.log("Bases: ", base + "|" + limitebase);
      }
    });
  }
  if (tarifaAplicada === "Familiar") {
    console.log("Aplicando tarifa familiar: " + valorTarifa.toFixed(2));
    valorConsumo.value = valorTarifa.toFixed(2);
  } else {
    totalConsumo = (consumo - limitebase) * valorTarifa;
    console.log(
      "Total consumo que excede la base: ",
      totalConsumo + "|" + base
    );

    valorConsumo.value = (totalConsumo + base).toFixed(2);
  }

  valorConsumo.value = (totalConsumo + base).toFixed(2);

  tarifaConsumo.value = tarifaAplicada + "($" + valorTarifa + ")";

  console.log("Tarifa: " + tarifaAplicada + "(" + valorTarifa + ")");
}
async function recalcularConsumo() {
  if (planillaMedidorSn) {
    await calcularConsumo();
    console.log("tf-tc: " + totalFinal, totalConsumo);
    let totalRecalculado = totalFinal;
    console.log("totalRecalculado: " + totalRecalculado);
    console.log("Valor consumo: " + valorConsumo.value);
    totalRecalculado += parseFloat(valorConsumo.value);
    valorTotalPagar.value = totalRecalculado.toFixed(2);
  } else {
    console.log("tf-tc: " + totalFinal, totalConsumo);
    let totalRecalculado = totalFinal;
    console.log("totalRecalculado: " + totalRecalculado);
    console.log("Valor consumo: " + valorConsumo.value);
    totalRecalculado += parseFloat(valorConsumo.value);
    valorTotalPagar.value = totalRecalculado.toFixed(2);
  }
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
function obtenerRangoFecha() {
  let anioD = parseInt(anioBusqueda.value);
  let mesD = parseInt(mesBusqueda.value);
  let fechaDesde = "all";
  let fechaHasta = "all";
  let fechaRango = obtenerPrimerYUltimoDiaDeMes(anioD, mesD);
  return fechaRango;
}
function obtenerPrimerYUltimoDiaDeMes(anio, mes) {
  // Meses en JavaScript se numeran de 0 a 11 (enero es 0, diciembre es 11)
  const primerDia = new Date(anio, mes, 1);
  const ultimoDia = new Date(anio, mes + 1, 0);
  return {
    primerDia,
    ultimoDia,
  };
}
function cargarMesActual() {
  mesBusqueda.innerHTML = '<option value="all" selected>Todo mes</option>';
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
    option.value = i + 1; // El valor es el índice del mes
    option.textContent = nombresMeses[i];
    if (i === mesActual) {
      console.log("seleccionando: " + mesActual);
      // option.selected = true;
    }

    mesBusqueda.appendChild(option);
  }

  // Establece el mes actual como seleccionado
  // mesBusqueda.value = mesActual;
}
function cargarAnioBusquedas() {
  anioBusqueda.innerHTML = '<option value="all" selected>Todo año</option>';
  // Obtener el año actual
  var anioActual = new Date().getFullYear();
  // Crear opciones de años desde el año actual hacia atrás
  for (var i = anioActual; i >= 2020; i--) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;
    if (i === anioActual) {
      // option.selected = true;
    }
    anioBusqueda.appendChild(option);
  }
}
criterioBuscar.addEventListener("change", function () {
  if (criterioBuscar.value == "all") {
    buscarPlanillas();
    criterioContent.value = "";
    criterioContent.readOnly = true;
  } else {
    criterioContent.readOnly = false;
  }
});
btnBuscar.addEventListener("click", function () {
  buscarPlanillas();
});
async function buscarPlanillas() {
  let mesBuscar = mesBusqueda.value;
  let anioBuscar = anioBusqueda.value;
  let criterioABuscar = criterioBuscar.value;
  let criterioContentABuscar = criterioContent.value;
  let estadoABuscar = estadoBuscar.value;
  await getPlanillas(
    criterioABuscar,
    criterioContentABuscar,
    estadoABuscar,
    anioBuscar,
    mesBuscar
  );
}
const administrarServicios = async (servicioId, tipo) => {
  if (tipo === "Servicio fijo") {
    await ipcRenderer.send("datos-a-servicios", servicioId);
  } else {
    await ipcRenderer.send("datos-a-ocacionales", servicioId);
  }
};
const detallesServiciodg = async (servicio) => {
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
  administrarDg.onclick = async () => {
    const servicioEnviar = {
      id: servicio.serviciosId,
    };
    console.log("Administrar: " + servicioEnviar, servicio.tipo);
    await administrarServicios(servicioEnviar, servicio.tipo);
  };
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
      errContainer.style.display = "flex";
      errortextAbono.textContent =
        "El abono no puede ser menor a " + valorAbonar;
    } else if (abonarDg.value > valorSaldo) {
      errContainer.style.display = "flex";
      errortextAbono.textContent =
        "El abono no puede ser mayor a " + valorSaldo;
    } else {
      errortextAbono.textContent = "Error";
      errContainer.style.display = "none";
    }
  };
  if (dialogServicios.close) {
    dialogServicios.showModal();
  }
};
function resetForm() {
  planillaForm.reset();
  lecturaActualEdit = 0;
  lecturaAnteriorEdit = 0;
  valorConsumoEdit = 0;
  totalFinal = 0.0;
  totalConsumo = 0.0;
  tarifaAplicada = "Familiar";
  valorTarifa = 2.0;
  calcularConsumoBt.disabled = true;
  editDetalleId = "";
  editPlanillaId = "";
  editContratoId = "";
  fechaEmisionEdit = "";
  editingStatus = false;
  planillaMedidorSn = false;
  serviciosFijosList.innerHTML = "";
  otrosServiciosList.innerHTML = "";
  otrosAplazablesList.innerHTML = "";
  mostrarLecturas.innerHTML = "";
  mostrarLecturas.innerHTML =
    "No aplica servicio de agua potable" +
    '<i id="collapse" class="fs-3 fa-solid fa-caret-down"></i>';
  contenedorLecturas.style.display = "none";
  collapse.classList.add("fa-caret-down");
  collapse.classList.remove("fa-caret-up");
}
function resetFormAfterUpdate() {
  editPlanilla(editPlanillaId, editContratoId, fechaEmisionEdit);
  recalcularConsumo();
}
cancelarForm.addEventListener("click", function () {
  console.log("Borrando form");
  resetForm();
});

mostrarLecturas.onclick = () => {
  if (contenedorLecturas.style.display == "none") {
    collapse.classList.remove("fa-caret-down");
    collapse.classList.add("fa-caret-up");
    contenedorLecturas.style.display = "flex";
  } else {
    contenedorLecturas.style.display = "none";
    collapse.classList.add("fa-caret-down");
    collapse.classList.remove("fa-caret-up");
  }
};
calcularConsumoBt.onclick = () => {
  lecturaActual.value = lecturaActualEdit;
  lecturaAnterior.value = lecturaAnteriorEdit;
  valorConsumo.value = valorConsumoEdit;
  calcularConsumo();
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

const abrirContratos = async () => {
  const url = "src/ui/medidores.html";
  await ipcRenderer.send("abrirInterface", url);
};

init();
