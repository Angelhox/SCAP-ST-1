// const puppeteer = require("puppeteer");
const pdf = require("html-pdf");
const printer = require("pdf-to-printer");
const { ipcRenderer } = require("electron");
const socioNombres = document.getElementById("socioNombres");
const socioCedula = document.getElementById("socioCedula");
const socioTelefono = document.getElementById("socioTelefono");
const contrato = document.getElementById("contrato");
const planilla = document.getElementById("planilla");
const fechaEmision = document.getElementById("fechaEmision");
const dataAgua = document.getElementById("data-agua");
const dataServicios = document.getElementById("data-servicios");
const lecturaAnterior = document.getElementById("lecturaAnterior");
const lecturaActual = document.getElementById("lecturaActual");
const consumo = document.getElementById("consumo");
const tarifa = document.getElementById("tarifa");
const total = document.getElementById("total");
const subtotal = document.getElementById("subtotal");
const descuento = document.getElementById("descuento");
const totalPagar = document.getElementById("total-pagar");
const detailsList = document.getElementById("servicios-details");
let aguaSn = false;

async function imprimirYGuardarPDF() {
  //   // Configura las opciones para la generación de PDF
  //   const content = document.querySelector(".invoice");
  //   const pdfOptions = {
  //     path: "X:/FacturasSCAP/respaldo.pdf", // Nombre del archivo PDF de salida
  //     format: "A4", // Formato de página
  //     margin: {
  //       top: "10mm",
  //       bottom: "10mm",
  //       left: "10mm",
  //       right: "10mm",
  //     },
  //   };

  //   try {
  //     // Crea una instancia de navegador
  //     const browser = await puppeteer.launch();
  //     const page = await browser.newPage();

  //     // Contenido HTML que deseas convertir en PDF
  //     const contenidoHTML =
  //       "<html><body><h1>Mi contenido HTML</h1></body></html>";

  //     // Configura la página como página sin margen
  //     await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 2 });

  //     // Carga el contenido HTML en la página
  //     await page.setContent(content.outerHTML);

  //     // Genera el PDF
  //     await page.pdf(pdfOptions);

  //     // Cierra el navegador
  //     await browser.close();
  //     await window.print();
  //     console.log("PDF generado y guardado correctamente.");
  //   } catch (error) {
  //     console.error("Error al generar el PDF:", error);
  //   }
  const content = document.querySelector(".invoice");
  const timestamp = new Date().getTime(); // Obtener el timestamp actual
  const fileName = `documento_${timestamp}.pdf`;
  const filePath = "X:/FacturasSCAP/" + fileName;
  pdf.create(content.outerHTML).toFile(filePath, async (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Archivo PDF creado: ", res.filename);
    // Enviamos el archivo a la cola de impresion
    printer
      .print(filePath)
      // window
      //   .print()
      .then(() => {
        printer.print(filePath);
        // Impresión exitosa
        abrirPagos();
        console.log("El PDF se ha enviado a la cola de impresión.");
      })
      // try {
      //   await imprime().then(() => {
      //     window.print();
      //   });
      //   abrirPagos();
      //   console.log("El PDF se ha enviado a la cola de impresión.");
      // } catch (error) {
      //   // Error de impresión
      //   abrirPagos();
      //   console.error("Error al imprimir el PDF:", error);
      // }

      .catch((error) => {
        // Error de impresión
        abrirPagos();
        console.error("Error al imprimir el PDF:", error);
      });
  });
}
async function imprime() {
  window.print();
}
ipcRenderer.on(
  "datos-a-pagina2",
  (
    event,
    datos,
    encabezado,
    serviciosFijos,
    otrosServicios,
    datosAgua,
    datosTotales
  ) => {
    console.log("Llego Petición");
    // Hacer algo con los datos recibidos
    console.log(datos, encabezado);

    // Por ejemplo, mostrarlos en un elemento HTML
    // const mensajeElement = document.getElementById("mensaje");
    // mensajeElement.textContent = datos.mensaje;
    const socioNode = document.createTextNode(encabezado.socio);
    socioNombres.appendChild(socioNode);
    // const stSocio = document.createElement("strong");
    //   stSocio.textContent = "Socio: ";
    //   socioNombres.appendChild(stSocio);
    //   socioNombres.TEXT_NODE = encabezado.socio;
    const cedulaNode = document.createTextNode(encabezado.cedula);
    socioCedula.appendChild(cedulaNode);
    const planillaNode = document.createTextNode(encabezado.planilla);
    planilla.appendChild(planillaNode);
    const contratoNode = document.createTextNode(encabezado.contrato);
    contrato.appendChild(contratoNode);
    const fechaNode = document.createTextNode(encabezado.fecha);
    fechaEmision.appendChild(fechaNode);
    if (serviciosFijos !== null && serviciosFijos !== undefined) {
      serviciosFijos.forEach((servicioFijo) => {
        if (servicioFijo.nombre === "Agua Potable") {
          aguaSn = true;
          console.log("Tiene agua");
          lecturaAnterior.textContent = datosAgua.lecturaAnterior;
          lecturaActual.textContent = datosAgua.lecturaActual;
          consumo.textContent =
            datosAgua.lecturaActual - datosAgua.lecturaAnterior;
          tarifa.textContent = datosAgua.tarifaConsumo;
          total.textContent = datosAgua.valorConsumo;
        } else {
          renderDetalles(servicioFijo);
        }
      });
    }
    if (otrosServicios !== null && otrosServicios !== undefined) {
      otrosServicios.forEach((otroServicio) => {
        // if (otroServicio.nombre === "Agua Potable") {
        //   aguaSn = true;
        //   console.log("Tiene agua");
        //   lecturaAnterior.textContent = datosAgua.lecturaAnterior;
        //   lecturaActual.textContent = datosAgua.lecturaActual;
        //   consumo.textContent =
        //     datosAgua.lecturaActual - datosAgua.lecturaAnterior;
        //   tarifa.textContent = datosAgua.tarifaConsumo;
        //   total.textContent = datosAgua.valorConsumo;
        // } else {
        renderDetalles(otroServicio);
        // }
      });
    }
    subtotal.textContent = "$" + datosTotales.totalPagar;
    descuento.textContent = "$0.0";
    totalPagar.textContent = "$" + datosTotales.totalPagar;
  }
);
function renderDetalles(servicio) {
  // contratosList.innerHTML = "";
  // datosContratos.forEach((contrato) => {
  detailsList.innerHTML += `
      <tr>
      <td>${servicio.nombre}</td>
        <td>${servicio.descripcion}</td>
        <td>${servicio.total}</td>
     </tr>
        `;
  // });
}
const abrirPagos = async () => {
  const url = "src/ui/cobros.html";
  await ipcRenderer.send("abrirInterface", url);
};
