const { timeStamp } = require("console");
const { ipcRenderer, remote } = require("electron");
const printer = require("pdf-to-printer");
// ----------------------------------------------------------------
const pdf = require("html-pdf");
const nombre = "Angelho Client";
const imprimirPDF = async () => {
  const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
  <style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }

  .invoice {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
  }

  .invoice-header {
    display: flex;
    text-align: center;
    margin-bottom: 20px;
  }

  .invoice-header h1 {
    align-self: center;
    margin: 0 auto;
    color: #333;
    font-size: 24px;
  }
  .invoice-header h4 {
    align-self: center;
    margin: 0 auto;
    color: #333;
    font-size: 24px;
  }
  .invoice-items-header {
    align-self: center;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
  }
  .invoice-details {
    display: flex;
    margin-top: 0;
    padding: 0;
    justify-content: space-evenly;
  }
  .invoice-details p {
    display: flex;
    margin-top: 0;
    padding: 0;
    justify-content: space-evenly;
  }
  .invoice-details .label {
    font-weight: bold;
    font-size: 20rem;
  }

  .invoice-items {
    width: 100%;
  }

  .invoice-items th,
  .invoice-items td {
    text-align: center;
    padding: 5px;
    border-bottom: 1px solid #ccc;
    font-size: 15px;
  }
  .invoice-items .titles {
    text-align: left;
  }
  .logo {
    align-self: start;
    width: 15%;
    filter: grayscale(100%);
  }
  table {
    margin-bottom: 10px;
  }
  .signatures {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .signature {
    margin: 15px 0;
    border-top: 1px dotted #000;
    width: 250px;
    text-align: center;
  }

</style>
  </head>
  <body>
  <div class="invoice">
    <div class="invoice-header">
      <img class="logo" src="../src/assets/fonts/logo.png" alt="Not found" />
      <div style="align-self: center; margin: 0 auto">
        <h1>RECAUDACION DE CONSUMO DE AGUA POTABLE Y SERVICIOS</h1>
        <p>Santo domingo N°1</p>
        <div class="invoice-items-header">
          <p><strong>N° Comprobante:</strong>100200300</p>
          <p><strong>Fecha:</strong>100200300</p>
        </div>
      </div>
    </div>

    <div class="invoice-details">
      <p><strong>Socio:</strong> ${nombre}</p>
      <p><strong>Cedula-Ruc:</strong> 15 de enero de 2022</p>
      <p><strong>Telefono:</strong>0984760554</p>
      <p><strong>Direccion</strong>Cayambe</p>
    </div>
    <hr class="separator" />
    <div class="invoice-details">
      <p><strong>Planilla:</strong> 9999999999</p>
      <p><strong>Medidor:</strong> NA</p>
      <p><strong>Ubicacion:</strong>Barrio Central, Floresta y Buenavista</p>
    </div>
    <hr class="separator" />
    <table class="invoice-items">
      <thead>
        <tr>
          <th colspan="5" class="titles">Agua potable</th>
        </tr>
        <tr>
          <th>Anterior</th>
          <th>Actual</th>
          <th>Consumo</th>
          <th>Tarifa</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>000000075</td>
          <td>000000175</td>
          <td>100</td>
          <td>Industrial</td>
          <td>$20</td>
        </tr>
      </tbody>
    </table>
    <table class="invoice-items">
      <thead>
        <tr>
          <th colspan="3" class="titles">Servicios</th>
        </tr>
        <tr>
          <th>Servicios</th>
          <th>Descripcion</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Desechos</td>
          <td>Recoleccion semanal de desechos</td>
          <td>$1.00</td>
        </tr>
        <tr>
          <td>Fiestas</td>
          <td>Fiesta de San Pedro</td>
          <td>$10</td>
        </tr>
      </tbody>
    </table>
    <table class="invoice-items">
      <thead>
        <tr>
          <th colspan="5" class="titles">Cuotas</th>
        </tr>
        <tr>
          <th>Cuotas</th>
          <th>Descripcion</th>
          <th>Total</th>
          <th>Abono</th>
          <th>Saldo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Multa</td>
          <td>Multa por falta a mingas</td>
          <td>$20</td>
          <td>$10</td>
          <td>$10</td>
        </tr>
        <tr>
          <td>Fiestas</td>
          <td>Fiesta de San Pedro</td>
          <td>$10</td>
          <td>$10</td>
          <td>$0</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="signatures">
    <div class="signature">Entregado</div>

  </div>
</body>
</html>
`;
  const timestamp = new Date().getTime(); // Obtener el timestamp actual
  const fileName = `documento_${timestamp}.pdf`;
  const filePath = "X:/FacturasSCAP/" + fileName;
  await pdf.create(htmlContent).toFile(filePath, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Archivo PDF creado: ", res.filename);
    // Enviamos el archivo a la cola de impresion
    printer
      .print(filePath)
      .then(() => {
        // Impresión exitosa
        console.log("El PDF se ha enviado a la cola de impresión.");
      })
      .catch((error) => {
        // Error de impresión
        console.error("Error al imprimir el PDF:", error);
      });
  });
};

// ----------------------------------------------------------------
// Funciona hay que diseñar el reporte con PDFKit
// const fs = require("fs");
// const PDFDocument = require("pdfkit");
// const printer = require("pdf-to-printer");

// const imprimirPDF = async () => {
//   // const doc = new PDFDocument();
//   // doc.text("Contenido del PDF a imprimir ZASS");

//   // Tratamos de personalizar la factura****************************
//   const facturaTable = document.querySelector(".table-factura");
//   const filas = facturaTable.querySelectorAll("tr");

//   // Crear el documento PDF
//   const doc = new PDFDocument();

//   // Insertar el logo de la factura
//   doc.image("src/assets/fonts/logo.png", {
//     fit: [100, 100],
//     align: "left",
//     valign: "top",
//     y: 50,
//     y: 50,
//   });

//   // Personalizar el contenido de la factura
//   doc
//     .font("Helvetica-Bold")
//     .fontSize(10)
//     .text("RECAUDACION DE AGUA POTABLE CUOTAS Y SERVICIOS", {
//       align: "right",
//       x: 80,
//       y: 80,
//     });
//   doc
//     .font("Helvetica")
//     .fontSize(10)
//     .text("Santo Domingo N°1", { align: "center" });
//     doc.moveDown();
//     doc
//     .font("Helvetica")
//     .fontSize(10)
//     .text("Santo Domingo N°1",{x:600,y:500});
//   doc
//     .font("Helvetica")
//     .fontSize(10)
//     .text("Factura", {align:"center",continued:true});
//   doc
//     .font("Helvetica-Bold")
//     .fontSize(10)

//   doc.text(" : ", { continued: true });
//   doc.font("Helvetica").fontSize(10).text("0000000001", { continued: true });

//   // Recorrer las filas de la tabla y agregar los datos al PDF
//   filas.forEach((fila) => {
//     const celdas = fila.querySelectorAll("td");

//     celdas.forEach((celda) => {
//       doc.text(celda.innerText, { continued: true });

//       doc.moveUp();
//       doc.text(" : ", { continued: true });
//       doc.moveDown();
//     });

//     doc.moveDown();
//   });

//   const timestamp = new Date().getTime(); // Obtener el timestamp actual
//   const fileName = `documento_${timestamp}.pdf`; // Agregar el timestamp al nombre del archivo

//   const filePath = `C:/Users/USE/Documents/${fileName}`;
//   const writeStream = fs.createWriteStream(filePath);
//   doc.pipe(writeStream);
//   doc.end();

//   writeStream.on("finish", () => {
//     printer
//       .print(filePath)
//       .then(() => {
//         // Impresión exitosa
//         console.log("El PDF se ha enviado a la cola de impresión.");
//       })
//       .catch((error) => {
//         // Error de impresión
//         console.error("Error al imprimir el PDF:", error);
//       });
//   });
// };
// ----------------------------------------------------------------
// remote es de esta funcion
// Esta funciona :)
// const fs = require("fs");
// const PDFDocument = require("pdfkit");

// const imprimirPDF = async () => {
//   const doc = new PDFDocument();
//   doc.text("Contenido del PDF a imprimir");
//   const timestamp = new Date().getTime(); // Obtener el timestamp actual
//   const fileName = `factura_${timestamp}.pdf`
//   // const filePath = await ipcRenderer.invoke("getDocumentsPath", "/documentos") + "/documento.pdf";
//   const filePath = "C:/Users/USE/Documents" + "/"+fileName;
//   const writeStream = fs.createWriteStream(filePath);
//   doc.pipe(writeStream);
//   doc.end();

//   // writeStream.on("finish", () => {
//   //   const printWindow = new remote.BrowserWindow({ show: false });
//   //   printWindow.loadURL(`file://${filePath}`);
//   //   printWindow.webContents.on("did-finish-load", () => {
//   //     printWindow.webContents.print({ silent: true });
//   //     printWindow.close();
//   //   });
//   // });
//   writeStream.on("finish", () => {
//     ipcRenderer.send("printPDF", filePath);
//     console.log('filePath: ' + filePath);
//   });
// };

// Escuchar respuesta del proceso principal
ipcRenderer.on("printPDFComplete", (event, message) => {
  console.log(message); // Imprimir mensaje de confirmación desde el proceso principal
});

// };

// ----------------------------------------------------------------

const socioCedula = document.getElementById("cedula");
const socioApellido = document.getElementById("apellido");
const socioNombre = document.getElementById("nombre");
const medidorCodigo = document.getElementById("codigomedidor");
const medidorUbicacion = document.getElementById("ubicacionmedidor");
const planillaEdicion = document.getElementById("edicionPlanilla");
const planillaFecha = document.getElementById("fechaPlanilla");
const planillaEstado = document.getElementById("estadoPlanilla");
const planillaFechaUp = document.getElementById("fechaEmisionPlanilla");
const socioCedulaUp = document.getElementById("cedulaUp");
const socioNombresUp = document.getElementById("nombrecompletoUp");
const planillaEstadoUp = document.getElementById("estadocuentaUp");
const planillaEdicionUp = document.getElementById("estadoedicionUp");
const medidorCodigoUp = document.getElementById("codigomedidorUp");
const medidorUbicacionUp = document.getElementById("ubicacionmedidorUp");
const totalSinServicios = document.getElementById("subtotalsinservicios");
// Listas para el renderizado
const planillasList = document.getElementById("planillas");
const serviciosList = document.getElementById("servicios");
const inFormServiciosList = document.getElementById("inFormServicios");
const inFormCuotasList = document.getElementById("inFormCuotas");
const multasdescList = document.getElementById("multasdesc");
const cuotasList = document.getElementById("cuotas");
// ----------------------------------------------------------------
// constantes para el mantenimiento de los servicios de la planilla
const servicioServicio = document.getElementById("servicio");
const servicioFecha = document.getElementById("fechaservicio");
const servicioDescripcion = document.getElementById("descripcionservicio");
const servicioValor = document.getElementById("valorservicio");
const totalservicios = document.getElementById("subtotalservicios");
// ----------------------------------------------------------------
// Constantes para el mantenimeinto de las planillas
const planillaLecturaActual = document.getElementById("lecturaActual");
const planillaLecturaAnterior = document.getElementById("lecturaAnterior");
const planillaValorTotal = document.getElementById("totalpagar");
// -----------------------------------------------------------------
// Constantes para el mantenimiento de las cuotas
const cuotaFecha = document.getElementById("fechacuota");
const cuotaCuota = document.getElementById("cuota");
const cuotaMotivo = document.getElementById("motivocuota");
const cuotaValor = document.getElementById("valorcuota");
const valorcuotas = document.getElementById("subtotalcuotas");
let cuotas = [];
let editingCuotaStatus = false;
let editCuotaId = "";
// ----------------------------------------------------------------
let planillas = [];
let servicios = [];
let multasdesc = [];
let implementos = [];
let editingStatus = false;
let editingServiciosStatus = false;
let editingImplementoStatus = false;
let editPlanillaId = "";

planillaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newPlanilla = {
    // Los unicos valores que se modifican son lectura Actual, lectura Anterior estado de edicion y valor
    estadoEdicion: planillaEdicionUp.value,
    lecturaActual: planillaLecturaActual.value,
    valor: planillaValorTotal.value,
  };
  if (editingStatus) {
    console.log("Editing planilla with electron");
    const result = await ipcRenderer.invoke(
      "updatePlanilla",
      editPlanillaId,
      newPlanilla
    );
    editingStatus = false;
    // editMedidorId = "";
    console.log(result);
  }
  // getPlanillas();
  // planillaForm.reset();
  // medidorCodigo.focus();
});

// Al momento contemplamos que las planillas se generen de manera automatica mensualmente
// planillaForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const newMedidor = {
//     codigo: medidorCodigo.value,
//     fechaInstalacion: medidorInstalacion.value,
//     marca: medidorMarca.value,
//     barrio: medidorBarrio.value,
//     callePrincipal: medidorPrincipal.value,
//     calleSecundaria: medidorSecundaria.value,
//     numeroCasa: medidorNumeroCasa.value,
//     referencia: medidorReferencia.value,
//     observacion: medidorObservacion.value,
//     // Obtenemos el id del socio
//     inventarioId: 1,
//   };
//   if (!editingStatus) {
//     const result = await ipcRenderer.invoke("createMedidor", newMedidor);
//     console.log(result);
//   } else {
//     console.log("Editing implemento with electron");
//     const result = await ipcRenderer.invoke(
//       "updateMedidor",
//       editMedidorId,
//       newMedidor
//     );
//     editingStatus = false;
//     editMedidorId = "";
//     console.log(result);
//   }
//   getPlanillas();
//   planillaForm.reset();
//   medidorCodigo.focus();
// });

// Renderizamos las planillas en la tabla
function renderPlanillas(datosPlanillas) {
  planillasList.innerHTML = "";
  datosPlanillas.forEach((datosPlanilla) => {
    planillasList.innerHTML += `
       <tr>
       <td>${datosPlanilla.codigoPlanillas}</td>
       <td>${formatearFecha(datosPlanilla.fecha)}</td>
       <td>${datosPlanilla.valor}</td>
       <td>${datosPlanilla.estadoEdicion}</td>
       <td>${datosPlanilla.estado}</td>
       <td>${datosPlanilla.lecturaAnterior}</td>
       <td>${datosPlanilla.lecturaActual}</td>     
      <td>
      <button onclick="editPlanilla('${datosPlanilla.id}')" class="btn ">
      <i class="fa-solid fa-user-pen"></i>
      </button>
      </td>
   </tr>
      `;
  });
}
const editPlanilla = async (planillaId) => {
  const datosPlanilla = await ipcRenderer.invoke(
    "getDatosPlanillaById",
    planillaId
  );
  console.log("resuesta: ", datosPlanilla);
  planillaFechaUp.value = formatearFecha(datosPlanilla[0].fecha);
  socioCedulaUp.value = datosPlanilla[0].cedula;
  socioNombresUp.value =
    datosPlanilla[0].nombre + " " + datosPlanilla[0].apellido;
  planillaEstadoUp.value = datosPlanilla[0].estado;
  // Seleccionamos el valor de edicion en el select
  console.log("TAMAÑO DEL SELECT: ", planillaEdicionUp.options.length);

  for (var i = 0; i < planillaEdicionUp.options.length; i++) {
    console.log(
      "select: " + planillaEdicionUp.options[i].value,
      " ",
      datosPlanilla[0].estadoEdicion
    );
    if (planillaEdicionUp.options[i].value == datosPlanilla[0].estadoEdicion) {
      planillaEdicionUp.selectedIndex = i;
      break;
    }
  }
  // ----------------------------------------------------------------

  //planillaEdicionUp.value = datosPlanilla[0].estadoEdicion;
  medidorCodigoUp.value = datosPlanilla[0].codigoMedidores;
  medidorUbicacionUp.value = datosPlanilla[0].ubicacion;
  planillaLecturaAnterior.value = datosPlanilla[0].lecturaActual;
  totalSinServicios.value = datosPlanilla[0].valor;
  console.log("btn1");
  seccion1.classList.remove("active");
  seccion2.classList.add("active");
  editingStatus = true;
  editPlanillaId = datosPlanilla[0].id;
  console.log(datosPlanilla[0].id);
  getServiciosByPlanillaId(editPlanillaId);
  getCuotasByPlanillaId(editPlanillaId);
  calcularValorPorConsumo();
  sumartotalplanillas();
  //getMultasDescByPlanillaId(editPlanillaId);
};
// ----------------------------------------------------------------
// Funcion que calcula el valor de la factura de acuerdo a la lectura del medidor
// ----------------------------------------------------------------
function calcularValorPorConsumo() {
  var anterior = planillaLecturaAnterior.value;
  var actual = planillaLecturaActual.value;
  var totalMetrosConsumo = actual - anterior;
  var totalConsumo = 2.0;
  if (totalMetrosConsumo >= 0 && totalMetrosConsumo <= 15) {
    totalConsumo = 2.0;
  } else if (totalMetrosConsumo > 15 && totalMetrosConsumo <= 50) {
    var exeso = (totalMetrosConsumo - 15) * 0.35;
    totalConsumo = 2.0 + exeso;
  } else if (totalMetrosConsumo > 50) {
    var exeso = (totalMetrosConsumo - 15) * 0.4;
    totalConsumo = 2.0 + exeso;
  }
  totalSinServicios.value = totalConsumo;
  sumartotalplanillas();
}
// Funcion que carga los servicios de acuerdo al id de la planilla
const getServiciosByPlanillaId = async (planillaId) => {
  servicios = await ipcRenderer.invoke("getServiciosByPlanillaId", planillaId);
  console.log("Respuesta a servicios: ", servicios);
  renderServicios(servicios);
};
function renderServicios(servicios) {
  serviciosList.innerHTML = "";
  servicios.forEach((servicio) => {
    serviciosList.innerHTML += `
       <tr>
       <td>${formatearFecha(servicio.fecha)}</td>
       <td>${servicio.servicio}</td>
       <td>${servicio.descripcion}</td>
       <td>${servicio.valor}</td>   
      <td>
      <button onclick="editPlanilla('${servicio.id}')" class="btn ">
      <i class="fa-solid fa-user-pen"></i>
      </button>
      </td>
      <td>
      <button onclick="deletePlanilla('${servicio.id}')" class="btn ">
      <i class="fa-solid fa-user-minus"></i>
      </button>
      </td>
   </tr>
      `;
  });
  sumarservicios();
}
// Funcion que carga las cuotas de acuerdo al id de la planilla
const getCuotasByPlanillaId = async (planillaId) => {
  cuotas = await ipcRenderer.invoke("getCuotasByPlanillaId", planillaId);
  console.log("Respuesta a cuotas: ", cuotas);
  renderCuotas(cuotas);
};
function renderCuotas(cuotas) {
  cuotasList.innerHTML = "";
  cuotas.forEach((cuota) => {
    cuotasList.innerHTML += `
       <tr>
       <td>${formatearFecha(cuota.fecha)}</td>
       <td>${cuota.servicio}</td>
       <td>${cuota.valor}</td>
       <td>${cuota.estado}</td>   
      <td>
      <button onclick="editCuota('${cuota.id}')" class="btn ">
      <i class="fa-solid fa-user-pen"></i>
      </button>
      </td>
      <td>
      <button onclick="deleteCuota('${cuota.id}')" class="btn ">
      <i class="fa-solid fa-user-minus"></i>
      </button>
      </td>
   </tr>
      `;
  });
  sumarcuotas();
}
// Funcion que carga multas y descuentos de acuerdo al id de la planilla
const getMultasDescByPlanillaId = async (planillaId) => {
  multasdesc = await ipcRenderer.invoke(
    "getMultasDescByPlanillaId",
    planillaId
  );
  console.log("Respuesta a multas y descuentos: ", multasdesc);
  renderMultasDesc(multasdesc);
};
function renderMultasDesc(servicios) {
  multasdescList.innerHTML = "";
  multasdesc.forEach((multadesc) => {
    multasdescList.innerHTML += `
       <tr>
       <td>${formatearFecha(multadesc.fecha)}</td>
       <td>${multadesc.tipo}</td>
       <td>${multadesc.motivo}</td>
       <td>${multadesc.valor}</td>   
      <td>
      <button onclick="editPlanilla('${multadesc.id}')" class="btn ">
      <i class="fa-solid fa-user-pen"></i>
      </button>
      </td>
      <td>
      <button onclick="deletePlanilla('${multadesc.id}')" class="btn ">
      <i class="fa-solid fa-user-minus"></i>
      </button>
      </td>
   </tr>
      `;
  });
}
// Funcion que abre el formulario para el mantenimiento de los servicios
function mostrarFormServicios() {
  if (editingStatus == true) {
    console.log("MostrarFormServicios");
    const dialog = document.getElementById("formServicios");
    dialog.showModal();
    inFormGetServiciosByPlanillaId(editPlanillaId);
  }
}
// Funcion que carga los servicios de acuerdo al id de la planilla
const inFormGetServiciosByPlanillaId = async (planillaId) => {
  servicios = await ipcRenderer.invoke("getServiciosByPlanillaId", planillaId);
  console.log("Respuesta a servicios: ", servicios);
  inFormRenderServicios(servicios);
};
function inFormRenderServicios(servicios) {
  inFormServiciosList.innerHTML = "";
  servicios.forEach((servicio) => {
    inFormServiciosList.innerHTML += `
       <tr>
       <td>${formatearFecha(servicio.fecha)}</td>
       <td>${servicio.servicio}</td>
       <td>${servicio.descripcion}</td>
       <td>${servicio.valor}</td>   
      <td>
      <button onclick="editPlanilla('${servicio.id}')" class="btn ">
      <i class="fa-solid fa-user-pen"></i>
      </button>
      </td>
      <td>
      <button onclick="deletePlanilla('${servicio.id}')" class="btn ">
      <i class="fa-solid fa-user-minus"></i>
      </button>
      </td>
   </tr>
      `;
  });
}
// Funcion que crea un nuevo servicio asignandolo a una planilla mediante su id
servicioForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!editPlanillaId == "") {
    const newServicio = {
      estado: "Por cobrar",
      tipo: "servicio",
      servicio: servicioServicio.value,
      fecha: servicioFecha.value,
      descripcion: servicioDescripcion.value,
      valor: servicioValor.value,
    };
    if (!editingServiciosStatus) {
      const result = await ipcRenderer.invoke(
        "createServicio",
        newServicio,
        editPlanillaId
      );
      console.log("Muestro resultado de insertar servicio: ", result);
    } else {
      console.log("Editing servicio with electron");
      const result = await ipcRenderer.invoke(
        "updateServicio",
        editServicioId,
        newServicio
      );
      editingServiciosStatus = false;
      editServicioId = "";
      console.log(result);
    }
    getServiciosByPlanillaId(editPlanillaId);
    inFormGetServiciosByPlanillaId(editPlanillaId);
    sumarservicios();
    sumartotalplanillas();
    servicioForm.reset();
    servicioServicio.focus();
  }
});
// Funcion que registra implementos asignandolo a un servicio mediante su id
implementoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!editPlanillaId == "") {
    const newImplemento = {
      servicio: servicioServicio.value,
      fecha: servicioFecha.value,
      descripcion: servicioDescripcion.value,
      valor: servicioValor.value,
      planillaId: editPlanillaId,
    };
    if (!editingServiciosStatus) {
      const result = await ipcRenderer.invoke("createServicio", newServicio);
      console.log("Muestro resultado de insertar servicio: ", result);
    } else {
      console.log("Editing servicio with electron");
      const result = await ipcRenderer.invoke(
        "updateServicio",
        editServicioId,
        newServicio
      );
      editingServiciosStatus = false;
      editServicioId = "";
      console.log(result);
    }
    getServiciosByPlanillaId(editPlanillaId);
    inFormGetServiciosByPlanillaId(editPlanillaId);
    servicioForm.reset();
    servicioServicio.focus();
  }
});
//const deleteMedidor = async (id) => {
// const response = confirm("Estas seguro de eliminar este medidor?");
// if (response) {
//   console.log("id from medidores.js");
//   const result = await ipcRenderer.invoke("deleteMedidor", id);
//   console.log("Resultado medidores.js", result);
//   getPlanillas();
// }
//};
const getPlanillas = async () => {
  planillas = await ipcRenderer.invoke("getDatosPlanillas");
  console.log(planillas);
  renderPlanillas(planillas);
};
// Funcion que carga las planillas de acuerdo al codigo del medidor
const getPlanillasByCodigo = async () => {
  // var select = document.getElementById("provincia");
  // select.addEventListener("change", function () {
  // var edicionPlanillaselected = this.options[planillaEdicion.selectedIndex].value;
  // console.log(
  //   edicionPlanillaselected
  // );
  // });
  var estadoEdicion = planillaEdicion.value;
  var fechaPlanilla = planillaFecha.value;
  var estadoPlanilla = planillaEstado.value;
  var codigoMedidor = medidorCodigo.value;
  planillas = await ipcRenderer.invoke(
    "getDatosPlanillasByCodigo",
    codigoMedidor,
    fechaPlanilla,
    estadoPlanilla,
    estadoEdicion
  );

  try {
    console.log(planillas);
    renderPlanillas(planillas);
    socioNombre.value = planillas[0].nombre;
    socioApellido.value = planillas[0].apellido;
    medidorUbicacion.value = planillas[0].ubicacion;
    socioCedula.value = planillas[0].cedula;
    getCuotasByCodigo();
  } catch (error) {
    console.log(error);
  }
};
// ----------------------------------------------------------------
// Funcion que carga las cuotas de acuero al codigo del medidor
const getCuotasByCodigo = async () => {
  // var select = document.getElementById("provincia");
  // select.addEventListener("change", function () {
  // var edicionPlanillaselected = this.options[planillaEdicion.selectedIndex].value;
  // console.log(
  //   edicionPlanillaselected
  // );
  // });
  // var estadoEdicion = planillaEdicion.value;
  // var fechaPlanilla = planillaFecha.value;
  // var estadoPlanilla = planillaEstado.value;
  var codigoMedidor = medidorCodigo.value;
  cuotas = await ipcRenderer.invoke(
    "getDatosCuotasByCodigo",
    codigoMedidor
    // fechaPlanilla,
    // estadoPlanilla,
    // estadoEdicion
  );

  try {
    console.log(cuotas);
    renderCuotas(cuotas);
  } catch (error) {
    console.log(error);
  }
};
// Funcion que renderiza las cuotas  en la tabla cuotas
// function renderCuotas(cuotas) {
//   cuotasList.innerHTML = "";
//   cuotas.forEach((cuota) => {
//     cuotasList.innerHTML += `
//        <tr>
//        <td>${formatearFecha(cuota.fecha)}</td>
//        <td>${cuota.servicio}</td>
//        <td>${cuota.descripcion}</td>
//        <td>${cuota.valor}</td>
//        <td>${cuota.estado}</td>
//       <td>
//       <button onclick="editPlanilla('${cuota.id}')" class="btn ">
//       <i class="fa-solid fa-user-pen"></i>
//       </button>
//       </td>
//       <td>
//       <button onclick="deletePlanilla('${cuota.id}')" class="btn ">
//       <i class="fa-solid fa-user-minus"></i>
//       </button>
//       </td>
//    </tr>
//       `;
//   });
// }
// ----------------------------------------------------------------
// Funciones de las cuotas
function mostrarFormCuotas() {
  console.log("MostrarFormCuotas");
  const dialog = document.getElementById("formCuotas");
  dialog.showModal();
}
cuotaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // if (!editPlanillaId == "") {
  const newCuota = {
    estado: "Por cobrar",
    tipo: "cuota",
    servicio: cuotaCuota.value,
    fecha: formatearFecha(cuotaFecha.value),
    descripcion: cuotaMotivo.value,
    valor: cuotaValor.value,
  };
  if (!editingCuotaStatus) {
    const result = await ipcRenderer.invoke(
      "createCuota",
      newCuota,
      editPlanillaId
    );
    console.log("Muestro resultado de insertar cuota: ", result);
  } else {
    console.log("Editing servicio with electron");
    const result = await ipcRenderer.invoke(
      "updateCuota",
      editCuotaId,
      newCuota
    );
    editingCuotaStatus = false;
    editCuotaId = "";
    console.log(result);
  }
  getCuotasByCodigo();
  inFormGetCuotasByCodigo();
  cuotaForm.reset();
  cuotaCuota.focus();
  sumarcuotas();
  sumartotalplanillas();
  // }
});
const inFormGetCuotasByCodigo = async () => {
  var codigoMedidor = medidorCodigo.value;
  cuotas = await ipcRenderer.invoke(
    "getDatosCuotasByCodigo",
    codigoMedidor
    // fechaPlanilla,
    // estadoPlanilla,
    // estadoEdicion
  );

  try {
    console.log(cuotas);
    inFormRenderCuotas(cuotas);
  } catch (error) {
    console.log(error);
  }
};

const getCuotasByPlanilla = async () => {
  var idPlanilla = editPlanillaId;
  cuotas = await ipcRenderer.invoke(
    "getDatosCuotasByPlanilla",
    idPlanilla
    // fechaPlanilla,
    // estadoPlanilla,
    // estadoEdicion
  );

  try {
    console.log(cuotas);
    inFormRenderCuotas(cuotas);
  } catch (error) {
    console.log(error);
  }
};
// Funcion que renderiza las cuotas  en la tabla cuotas
function inFormRenderCuotas(cuotas) {
  inFormCuotasList.innerHTML = "";
  cuotas.forEach((cuota) => {
    inFormCuotasList.innerHTML += `
       <tr>
       <td>${formatearFecha(cuota.fecha)}</td>
       <td>${cuota.servicio}</td>
       <td>${cuota.descripcion}</td>
       <td id="valorescuotas">${cuota.valor}</td>
       <td>${cuota.estado}</td>  
      <td>
      <button onclick="editPlanilla('${cuota.id}')" class="btn ">
      <i class="fa-solid fa-user-pen"></i>
      </button>
      </td>
      <td>
      <button onclick="deletePlanilla('${cuota.id}')" class="btn ">
      <i class="fa-solid fa-user-minus"></i>
      </button>
      </td>
   </tr>
      `;
  });
  sumarcuotas();
}
// ----------------------------------------------------------------
// Funcion que calcula el total de las planillas
// ----------------------------------------------------------------
function sumartotalplanillas() {
  console.log("sumando todos los valores ");
  var tfservicios = 0.0;
  var tfcuotas = 0.0;
  var tfsinservicios = 0.0;
  tfservicios = parseFloat(totalservicios.value).toFixed(2);
  console.log("tfservicios: " + tfservicios);
  tfcuotas = parseFloat(valorcuotas.value).toFixed(2);
  console.log("tfcuotas: " + tfcuotas);
  tfsinservicios = parseFloat(totalSinServicios.value).toFixed(2);
  console.log("tf: " + tfsinservicios);
  var totalfinal =
    parseFloat(tfcuotas) + parseFloat(tfservicios) + parseFloat(tfsinservicios);
  planillaValorTotal.value = parseFloat(totalfinal).toFixed(2);
}
// ----------------------------------------------------------------
// Funcion que calcula el total de las cuotas
// ----------------------------------------------------------------
function sumarcuotas() {
  console.log("sumando las cuotas ");
  var table = document.getElementById("cuotas");
  // var cells = table.getElementsById("valorescuotas");
  var rows = table.getElementsByTagName("tr");
  var columnCells = [];
  var sum = 0;
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");
    if (cells.length > 1) {
      // Asegúrate de que hay al menos dos celdas en la fila
      columnCells.push(cells[2]); // Agrega la celda de la segunda columna al arreglo
    }
  }
  for (var i = 0; i < columnCells.length; i++) {
    var cellValue = parseFloat(columnCells[i].textContent);
    if (!isNaN(cellValue)) {
      sum += cellValue;
    }
  }

  console.log("La suma de los valores de la columna es: " + sum);
  valorcuotas.value = sum;
  // for (var i = 0; i < columnCells.length; i++) {
  //   var cellValue = parseFloat(columnCells[i].textContent);
  //   if (!isNaN(cellValue)) {
  //     sum += cellValue;
  //   }
  // }

  // console.log("La suma de los valores de la columna es: " + sum);
}
// ----------------------------------------------------------------
// Funcion que calcula el total de los servicios
// ----------------------------------------------------------------
function sumarservicios() {
  console.log("sumando las cuotas ");
  var table = document.getElementById("servicios");
  // var cells = table.getElementsById("valorescuotas");
  var rows = table.getElementsByTagName("tr");
  var columnCells = [];
  var sum = 0;
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");
    if (cells.length > 1) {
      // Asegúrate de que hay al menos dos celdas en la fila
      columnCells.push(cells[3]); // Agrega la celda de la segunda columna al arreglo
    }
  }
  for (var i = 0; i < columnCells.length; i++) {
    var cellValue = parseFloat(columnCells[i].textContent);
    if (!isNaN(cellValue)) {
      sum += cellValue;
    }
  }

  console.log("La suma de los servicios es: " + sum);
  totalservicios.value = sum;
  sumartotalplanillas();
  // for (var i = 0; i < columnCells.length; i++) {
  //   var cellValue = parseFloat(columnCells[i].textContent);
  //   if (!isNaN(cellValue)) {
  //     sum += cellValue;
  //   }
  // }

  // console.log("La suma de los valores de la columna es: " + sum);
}
// ----------------------------------------------------------------
const printDocument = async () => {
  console.log("Llamando a la funcion Imprimir");
  // Enviar un mensaje al proceso principal para iniciar la impresión
  await ipcRenderer.invoke("print");
};
// ----------------------------------------------------------------
async function init() {
  await getPlanillas();
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
async function generarPlanillas() {
  const result = await ipcRenderer.invoke("createPlanillas");
  console.log(result);
  getPlanillas();
}
// Transicion entre las secciones de la vista
var btnSeccion1 = document.getElementById("btnSeccion1");
var btnSeccion2 = document.getElementById("btnSeccion2");
var seccion1 = document.getElementById("seccion1");
var seccion2 = document.getElementById("seccion2");

btnSeccion1.addEventListener("click", function () {
  console.log("btn1");
  // seccion1.classList.remove("active");
  // seccion2.classList.add("active");
  imprimirPDF();
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
  const url = "src/ui/pagos.html";
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
// Se futuriza que se precargen todas las planillas lbremente de los criterios de busqueda
//init();
