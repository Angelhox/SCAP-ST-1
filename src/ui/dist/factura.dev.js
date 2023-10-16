"use strict";

// const puppeteer = require("puppeteer");
var pdf = require("html-pdf");

var printer = require("pdf-to-printer"); // const html2pdf = require("html2pdf.js");


var _require = require("electron"),
    ipcRenderer = _require.ipcRenderer;

var socioNombres = document.getElementById("socioNombres");
var socioCedula = document.getElementById("socioCedula");
var socioTelefono = document.getElementById("socioTelefono");
var contrato = document.getElementById("contrato");
var planilla = document.getElementById("planilla");
var fechaEmision = document.getElementById("fechaEmision");
var dataAgua = document.getElementById("data-agua");
var dataServicios = document.getElementById("data-servicios");
var lecturaAnterior = document.getElementById("lecturaAnterior");
var lecturaActual = document.getElementById("lecturaActual");
var consumo = document.getElementById("consumo");
var tarifa = document.getElementById("tarifa");
var total = document.getElementById("total");
var subtotal = document.getElementById("subtotal");
var descuento = document.getElementById("descuento");
var totalPagar = document.getElementById("total-pagar");
var detailsList = document.getElementById("servicios-details");
var aguaSn = false;
document.addEventListener("DOMContentLoaded", function () {
  // async function imprimirYGuardarPDF() {
  var boton = document.getElementById("boton");
  boton.addEventListener("click", function _callee() {
    var content, timestamp, fileName, filePath;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // // Configura las opciones para la generación de PDF
            // const content = document.querySelector(".invoice");
            // const pdfOptions = {
            //   path: "X:/FacturasSCAP/respaldo.pdf", // Nombre del archivo PDF de salida
            //   format: "A4", // Formato de página
            //   margin: {
            //     top: "10mm",
            //     bottom: "10mm",
            //     left: "10mm",
            //     right: "10mm",
            //   },
            // };
            // try {
            //   // Crea una instancia de navegador
            //   const browser = await puppeteer.launch();
            //   const page = await browser.newPage();
            //   // Contenido HTML que deseas convertir en PDF
            //   const contenidoHTML =
            //     "<html><body><h1>Mi contenido HTML</h1></body></html>";
            //   // Configura la página como página sin margen
            //   await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 2 });
            //   // Carga el contenido HTML en la página
            //   await page.setContent(content.outerHTML);
            //   // Genera el PDF
            //   await page.pdf(pdfOptions);
            //   // Cierra el navegador
            //   await browser.close();
            //   await window.print();
            //   console.log("PDF generado y guardado correctamente.");
            // } catch (error) {
            //   console.error("Error al generar el PDF:", error);
            // }
            content = document.querySelector(".invoice");
            timestamp = new Date().getTime(); // Obtener el timestamp actual

            fileName = "documento_".concat(timestamp, ".pdf");
            filePath = "X:/FacturasSCAP/" + fileName;
            _context.next = 6;
            return regeneratorRuntime.awrap(pdf.create(content.outerHTML).toFile(filePath, function (err, res) {
              if (err) {
                console.error(err);
                return;
              }

              console.log("Archivo PDF creado: ", res.filename); // Enviamos el archivo a la cola de impresion

              printer.print(filePath) // window
              //   .print()
              .then(function () {
                printer.print(filePath); // Impresión exitosa

                abrirPagos();
                console.log("El PDF se ha enviado a la cola de impresión.");
              })["catch"](function (error) {
                // Error de impresión
                abrirPagos();
                console.error("Error al imprimir el PDF:", error);
              });
            }));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  });
});
ipcRenderer.on("datos-a-pagina2", function (event, datos, encabezado, serviciosFijos, otrosServicios, datosAgua, datosTotales, editados) {
  console.log("Llego Petición"); // Hacer algo con los datos recibidos

  console.log(datos, encabezado, serviciosFijos, otrosServicios);
  console.log(-"servicios: ", serviciosFijos, otrosServicios); // Por ejemplo, mostrarlos en un elemento HTML
  // const mensajeElement = document.getElementById("mensaje");
  // mensajeElement.textContent = datos.mensaje;

  var socioNode = document.createTextNode(encabezado.socio);
  socioNombres.appendChild(socioNode); // const stSocio = document.createElement("strong");
  //   stSocio.textContent = "Socio: ";
  //   socioNombres.appendChild(stSocio);
  //   socioNombres.TEXT_NODE = encabezado.socio;

  var cedulaNode = document.createTextNode(encabezado.cedula);
  socioCedula.appendChild(cedulaNode);
  var planillaNode = document.createTextNode(encabezado.planilla);
  planilla.appendChild(planillaNode);
  var contratoNode = document.createTextNode(encabezado.contrato);
  contrato.appendChild(contratoNode);
  var fechaNode = document.createTextNode(encabezado.fecha);
  fechaEmision.appendChild(fechaNode);

  if (serviciosFijos !== null && serviciosFijos !== undefined) {
    serviciosFijos.forEach(function (servicioFijo) {
      if (servicioFijo.nombre === "Agua Potable") {
        aguaSn = true;
        console.log("Tiene agua");
        lecturaAnterior.textContent = datosAgua.lecturaAnterior;
        lecturaActual.textContent = datosAgua.lecturaActual;
        consumo.textContent = datosAgua.lecturaActual - datosAgua.lecturaAnterior;
        tarifa.textContent = datosAgua.tarifaConsumo;
        total.textContent = datosAgua.valorConsumo;
      } else {
        renderDetalles(servicioFijo);
      }
    });
  }

  if (otrosServicios !== null && otrosServicios !== undefined) {
    otrosServicios.forEach(function (otroServicio) {
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
      renderDetalles(otroServicio); // }
    });
  }

  subtotal.textContent = "$" + datosTotales.totalPagar;
  descuento.textContent = "$0.0";
  totalPagar.textContent = "$" + datosTotales.totalPagar;
});

function renderDetalles(servicio) {
  // contratosList.innerHTML = "";
  // datosContratos.forEach((contrato) => {
  detailsList.innerHTML += "\n      <tr>\n      <td>".concat(servicio.nombre, "</td>\n        <td>").concat(servicio.descripcion, "</td>\n        <td>").concat(servicio.total, "</td>\n        <td>").concat(servicio.descuento, "</td>\n        <td>").concat(servicio.saldo, "</td>\n        <td>").concat(servicio.abono, "</td>\n     </tr>\n        "); // });
}

function imprimirYGuardarPDFfinal() {
  var elemento;
  return regeneratorRuntime.async(function imprimirYGuardarPDFfinal$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          elemento = document.body;
          html2pdf().set({
            margin: 1,
            filename: "doculmento.pdf",
            image: {
              type: "jpeg",
              quality: 0.98
            },
            html2canvas: {
              scale: 3,
              letterRendering: true
            },
            jsPDF: {
              unit: "in",
              format: "a3",
              orientation: "portrait"
            }
          }).from(elemento).save()["catch"](function (error) {
            console.log("Error: " + error);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}

var abrirPagos = function abrirPagos() {
  var url;
  return regeneratorRuntime.async(function abrirPagos$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          url = "src/ui/cobros.html";
          _context3.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url));

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
};