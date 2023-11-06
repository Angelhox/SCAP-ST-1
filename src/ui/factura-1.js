const puppeteer = require("puppeteer");
const Swal = require("sweetalert2");
// const pdf = require("html-pdf");
const printer = require("pdf-to-printer");
// const html2pdf = require("html2pdf.js");
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
let planillaCancelarId = "";
let encabezadoCancelarId = "";
let serviciosCancelar = [];

document.addEventListener("DOMContentLoaded", () => {
  // async function imprimirYGuardarPDF() {
  const boton = document.getElementById("boton");
  boton.addEventListener("click", async () => {
    await cancelarServicios(
      planillaCancelarId,
      serviciosCancelar,
      encabezadoCancelarId
    );
    // Configura las opciones para la generación de PDF
    const content = document.querySelector(".invoice");
    const scale = 0.7;
    const scaleX = 0.9; // Escala en el eje X (80%)
    const scaleY = 0.9; // Escala en el eje Y (120%)

    const pdfOptions = {
      path: "X:/FacturasSCAP/respaldo.pdf", // Nombre del archivo PDF de salida
      format: "A4", // Formato de página
      width: "210mm",
      height: "297mm",
      scale: scale,
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "0mm",
        right: "10mm",
      },
    };
    try {
      // Crea una instancia de navegador
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      // Agrega un manejador para los mensajes de la consola
      page.on("console", (msg) => {
        console.log(`Mensaje de la consola: ${msg.text()}`);
      });

      // Contenido HTML que deseas convertir en PDF
      // Configura la página como página sin margen
      //await page.setViewport({ width: 100, height: 100, deviceScaleFactor: 1 }); // No hace caso :(
      // Carga el contenido HTML en la página
      await page.setContent(content.outerHTML);
      await page.addStyleTag({
        content: `
          body {
           margin:0;
           padding:0;
           background-color:black;
          }
        `,
      });
      // Función para agregar una imagen a la página
      // await page.evaluate(() => {
      //   const img = document.createElement("img");
      //   img.src = "src/assets/fonts/bg.jpg"; // Ruta a tu imagen
      //   img.alt = "Descripción de la imagen"; // Texto alternativo para la imagen
      //   document.body.appendChild(img); // Agrega la imagen al cuerpo de la página
      // });
      // Genera el PDF
      await page
        .pdf({
          path: pdfOptions.path,
          format: pdfOptions.format,
          width: pdfOptions.width,
          scale: pdfOptions.scale,
          height: pdfOptions.height,
          margin: pdfOptions.margin,
        })
        .then(() => {
          printer.print(pdfOptions.path);
          // Impresión exitosa
          abrirPagos();
          console.log("El PDF se ha enviado a la cola de impresión.");
        })
        .catch((error) => {
          // Error de impresión
          // abrirPagos();
          console.error("Error al imprimir el PDF:", error);
        });
      // Cierra el navegador
      await browser.close();
      //await window.print();
      console.log("PDF generado y guardado correctamente.");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
    // const content = document.querySelector(".invoice");
    // const timestamp = new Date().getTime(); // Obtener el timestamp actual
    // const fileName = `documento_${timestamp}.pdf`;
    // const filePath = "X:/FacturasSCAP/" + fileName;
    // await pdf.create(content.outerHTML).toFile(filePath, (err, res) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log("Archivo PDF creado: ", res.filename);
    //   // Enviamos el archivo a la cola de impresion
    //   printer
    //     .print(filePath)
    //     // window
    //     //   .print()
    //     .then(() => {
    //       printer.print(filePath);
    //       // Impresión exitosa
    //       abrirPagos();
    //       console.log("El PDF se ha enviado a la cola de impresión.");
    //     })
    //     .catch((error) => {
    //       // Error de impresión
    //       abrirPagos();
    //       console.error("Error al imprimir el PDF:", error);
    //     });
    // });
  });
});
ipcRenderer.on(
  "datos-a-pagina2",
  (
    event,
    datos,
    encabezado,
    serviciosFijos,
    otrosServicios,
    datosAgua,
    datosTotales,
    editados
  ) => {
    console.log("Llego Petición");
    // Hacer algo con los datos recibidos
    console.log(datos, encabezado);
    planillaCancelarId = datosAgua.planillaId;
    encabezadoCancelarId = encabezado.encabezadoId;
    console.log(
      "Recibido par cancelar" + encabezadoCancelarId + " " + planillaCancelarId
    );
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
          serviciosCancelar.push(servicioFijo);
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
      otrosServicios.forEach(async (otroServicio) => {
        console.log("Edita2: " + editados);
        const servicioEditado = await editados.find(
          (editado) => editado.id === otroServicio.id
        );
        if (servicioEditado) {
          console.log(`Se encontró un objeto con el ID ${otroServicio.id}`);
          console.log("Nuevo abono: " + servicioEditado.valor);
          console.log("Total: " + otroServicio.total);
          console.log("Saldo: " + otroServicio.saldo);
          otroServicio.abono = servicioEditado.valor;
          otroServicio.saldo=otroServicio.total-servicioEditado.valor;
        } else {
          console.log(`No se encontró un objeto con el ID ${otroServicio.id}`);
        }
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
  serviciosCancelar.push(servicio);
  console.log("Servicios a cancelar: " + serviciosCancelar);
  // contratosList.innerHTML = "";
  // datosContratos.forEach((contrato) => {
  detailsList.innerHTML += `
      <tr>
      <td>${servicio.nombre}</td>
        <td>${servicio.descripcion}</td>
        <td     style="
        text-align: center;
        padding: 5px;
        
        font-size: 15px;
      ">${parseFloat(servicio.total).toFixed(2)}</td>
        <td     style="
        text-align: center;
        padding: 5px;
        
        font-size: 15px;
      ">${parseFloat(servicio.descuento).toFixed(2)}</td>
        <td     style="
        text-align: center;
        padding: 5px;
 
        font-size: 15px;
      ">${parseFloat(servicio.saldo).toFixed(2)}</td>
        <td     style="
        text-align: center;
        padding: 5px;
        
        font-size: 15px;
      ">${parseFloat(servicio.abono).toFixed(2)}</td>
     </tr>
        `;
  // });
}
const cancelarServicios = async (
  planillaCancelarId,
  servicios,
  encabezadoCancelarId
) => {
  console.log(
    "Enviar a cancelar: " + encabezadoCancelarId + " " + planillaCancelarId
  );
  await ipcRenderer.invoke(
    "cancelarServicios",
    planillaCancelarId,
    encabezadoCancelarId,
    serviciosCancelar
  );
};
ipcRenderer.on("Notificar", (event, response) => {
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
// ipcRenderer.on("Notificar", (event, response) => {
//   console.log("Response: " + response);

//   const swalOptions = {
//     title: response.title,
//     text: response.message,
//     icon: response.success ? "success" : "error",
//     confirmButtonColor: "#f8c471",
//     showCancelButton: true, // Mostrar botón de cancelar
//     confirmButtonText: "Confirmar",
//     cancelButtonText: "Cancelar",
//   };

//   // Registra un evento de clic en el botón "Confirm"
//   swalOptions.onBeforeOpen = () => {
//     const confirmButton = document.querySelector(".swal2-confirm");
//     if (confirmButton) {
//       confirmButton.addEventListener("click", () => {
//         // Aquí puedes colocar la acción que deseas realizar al hacer clic en "Confirm"
//         console.log("Se hizo clic en Confirm");
//         // Realiza tu acción aquí
//       });
//     }
//   };

//   Swal.fire(swalOptions);
// });

async function imprimirYGuardarPDFfinal() {
  const elemento = document.body;
  html2pdf()
    .set({
      margin: 1,
      filename: "doculmento.pdf",
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 3,
        letterRendering: true,
      },
      jsPDF: {
        unit: "in",
        format: "a3",
        orientation: "portrait",
      },
    })
    .from(elemento)
    .save()
    .catch((error) => {
      console.log("Error: " + error);
    });
}
const abrirPagos = async () => {
  const acceso=sessionStorage.getItem("acceso");
  const url = "Pagos";
  await ipcRenderer.send("abrirInterface", url,acceso);
};
