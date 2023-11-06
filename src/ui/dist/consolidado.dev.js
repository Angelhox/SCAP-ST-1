"use strict";

var puppeteer = require("puppeteer");

var Swal = require("sweetalert2"); // const pdf = require("html-pdf");


var printer = require("pdf-to-printer"); // const html2pdf = require("html2pdf.js");


var _require = require("electron"),
    ipcRenderer = _require.ipcRenderer; // const socioNombres = document.getElementById("socioNombres");
// const socioCedula = document.getElementById("socioCedula");
// const socioTelefono = document.getElementById("socioTelefono");
// const contrato = document.getElementById("contrato");
// const planilla = document.getElementById("planilla");
// const fechaEmision = document.getElementById("fechaEmision");
// const dataAgua = document.getElementById("data-agua");
// const dataServicios = document.getElementById("data-servicios");
// const lecturaAnterior = document.getElementById("lecturaAnterior");
// const lecturaActual = document.getElementById("lecturaActual");
// const consumo = document.getElementById("consumo");
// const tarifa = document.getElementById("tarifa");
// const total = document.getElementById("total");
// const subtotal = document.getElementById("subtotal");
// const descuento = document.getElementById("descuento");
// const totalPagar = document.getElementById("total-pagar");
// const detailsList = document.getElementById("servicios-details");


var fechaEmision = document.getElementById("fechaEmision");
var fechaImpresion = document.getElementById("fechaImpresion");
var nombreServicio = document.getElementById("nombreServicio");
var fechaDesde = document.getElementById("fechaDesde");
var fechaHasta = document.getElementById("fechaHasta");
var contrato = document.getElementById("contrato");
var socio = document.getElementById("socio");
var estado = document.getElementById("estado");
var total = document.getElementById("total");
var abonado = document.getElementById("abonado");
var saldo = document.getElementById("saldo");
var pendiente = document.getElementById("pendiente");
var recaudado = document.getElementById("recaudado");
var totalFinal = document.getElementById("totalFinal");
var recaudacionesList = document.getElementById("recaudaciones");
var aguaSn = false;
var planillaCancelarId = "";
var encabezadoCancelarId = "";
var serviciosCancelar = [];
document.addEventListener("DOMContentLoaded", function () {
  // async function imprimirYGuardarPDF() {
  var boton = document.getElementById("boton");
  boton.addEventListener("click", function _callee() {
    var content, scale, scaleX, scaleY, pdfOptions, browser, page;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(cancelarServicios(planillaCancelarId, serviciosCancelar, encabezadoCancelarId));

          case 2:
            // Configura las opciones para la generación de PDF
            content = document.querySelector(".invoice");
            scale = 0.7;
            scaleX = 0.9; // Escala en el eje X (80%)

            scaleY = 0.9; // Escala en el eje Y (120%)

            pdfOptions = {
              path: "X:/FacturasSCAP/recaudaciones.pdf",
              // Nombre del archivo PDF de salida
              format: "A4",
              // Formato de página
              width: "210mm",
              height: "297mm",
              scale: scale,
              margin: {
                top: "10mm",
                bottom: "10mm",
                left: "0mm",
                right: "10mm"
              }
            };
            _context.prev = 7;
            _context.next = 10;
            return regeneratorRuntime.awrap(puppeteer.launch());

          case 10:
            browser = _context.sent;
            _context.next = 13;
            return regeneratorRuntime.awrap(browser.newPage());

          case 13:
            page = _context.sent;
            // Agrega un manejador para los mensajes de la consola
            page.on("console", function (msg) {
              console.log("Mensaje de la consola: ".concat(msg.text()));
            }); // Contenido HTML que deseas convertir en PDF
            // Configura la página como página sin margen
            //await page.setViewport({ width: 100, height: 100, deviceScaleFactor: 1 }); // No hace caso :(
            // Carga el contenido HTML en la página

            _context.next = 17;
            return regeneratorRuntime.awrap(page.setContent(content.outerHTML));

          case 17:
            _context.next = 19;
            return regeneratorRuntime.awrap(page.addStyleTag({
              content: "\n          body {\n           margin:0;\n           padding:0;\n           background-color:black;\n          }\n        "
            }));

          case 19:
            _context.next = 21;
            return regeneratorRuntime.awrap(page.pdf({
              path: pdfOptions.path,
              format: pdfOptions.format,
              width: pdfOptions.width,
              scale: pdfOptions.scale,
              height: pdfOptions.height,
              margin: pdfOptions.margin
            }).then(function () {
              printer.print(pdfOptions.path); // Impresión exitosa

              abrirPagos();
              console.log("El PDF se ha enviado a la cola de impresión.");
            })["catch"](function (error) {
              // Error de impresión
              // abrirPagos();
              console.error("Error al imprimir el PDF:", error);
            }));

          case 21:
            _context.next = 23;
            return regeneratorRuntime.awrap(browser.close());

          case 23:
            //await window.print();
            console.log("PDF generado y guardado correctamente.");
            _context.next = 29;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context["catch"](7);
            console.error("Error al generar el PDF:", _context.t0);

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 26]]);
  });
});
ipcRenderer.on("datos-a-pagina3", function (event, datos, encabezado, recaudaciones, datosTotales) {
  console.log("Llego Petición"); // Hacer algo con los datos recibidos

  console.log(datos, encabezado);
  var fe = document.createTextNode(formatearFecha(new Date()));
  var fi = document.createTextNode(formatearFecha(new Date()));
  fechaEmision.appendChild(fe);
  fechaImpresion.appendChild(fi);
  nombreServicio.textContent = encabezado.servicio;
  fechaDesde.textContent = "De:-" + encabezado.fechaD;
  fechaHasta.textContent = "Hasta:-" + encabezado.fechaH;
  recaudacionesList.innerHTML = "";
  recaudaciones.forEach(function (recaudacion) {
    var abonoRp = 0;

    if (parseFloat(recaudacion.abono) == 0 && recaudacion.detalleEstado == "Cancelado") {
      abonoRp = recaudacion.total;
    } else if (recaudacion.detalleEstado == "Cancelado") {
      abonoRp = recaudacion.abono;
    } else {
      abonoRp = 0;
    }

    recaudacionesList.innerHTML += "\n      <tr>\n      <td style=\"\n      text-align: left;\n      padding: 5px;\n      \n      font-size: 15px;\n    \">".concat(recaudacion.contratosCodigo, "</td>\n      <td style=\"\n      text-align: left;\n      padding: 5px;\n      \n      font-size: 15px;\n    \">").concat(recaudacion.nombres + " " + recaudacion.apellidos, "</td>\n      <td style=\"\n      text-align: left;\n      padding: 5px;\n      \n      font-size: 15px;\n    \">").concat(recaudacion.detalleEstado, "</td>\n      <td style=\"\n      text-align: center;\n      padding: 5px;\n      \n      font-size: 15px;\n    \">").concat(parseFloat(abonoRp).toFixed(2), "</td>\n      <td style=\"\n      text-align: center;\n      padding: 5px;\n      \n      font-size: 15px;\n    \">").concat(parseFloat(recaudacion.total).toFixed(2), "</td>\n      <td style=\"\n      text-align: center;\n      padding: 5px;\n      \n      font-size: 15px;\n    \">").concat(parseFloat(recaudacion.total - abonoRp).toFixed(2), "</td>        \n  </tr>\n      ");
  });
  pendiente.textContent = datosTotales.pendiente;
  recaudado.textContent = datosTotales.recaudado;
  totalFinal.textContent = datosTotales.totalFinal; // planillaCancelarId = datosAgua.planillaId;
  // encabezadoCancelarId = encabezado.encabezadoId;
  // console.log(
  //   "Recibido par cancelar" + encabezadoCancelarId + " " + planillaCancelarId
  // );
  // Por ejemplo, mostrarlos en un elemento HTML
  // const mensajeElement = document.getElementById("mensaje");
  // mensajeElement.textContent = datos.mensaje;
  // const socioNode = document.createTextNode(encabezado.socio);
  // socioNombres.appendChild(socioNode);
  // // const stSocio = document.createElement("strong");
  // //   stSocio.textContent = "Socio: ";
  // //   socioNombres.appendChild(stSocio);
  // //   socioNombres.TEXT_NODE = encabezado.socio;
  // const cedulaNode = document.createTextNode(encabezado.cedula);
  // socioCedula.appendChild(cedulaNode);
  // const planillaNode = document.createTextNode(encabezado.planilla);
  // planilla.appendChild(planillaNode);
  // const contratoNode = document.createTextNode(encabezado.contrato);
  // contrato.appendChild(contratoNode);
  // const fechaNode = document.createTextNode(encabezado.fecha);
  // fechaEmision.appendChild(fechaNode);
  // if (serviciosFijos !== null && serviciosFijos !== undefined) {
  //   serviciosFijos.forEach((servicioFijo) => {
  //     if (servicioFijo.nombre === "Agua Potable") {
  //       serviciosCancelar.push(servicioFijo);
  //       aguaSn = true;
  //       console.log("Tiene agua");
  //       lecturaAnterior.textContent = datosAgua.lecturaAnterior;
  //       lecturaActual.textContent = datosAgua.lecturaActual;
  //       consumo.textContent =
  //         datosAgua.lecturaActual - datosAgua.lecturaAnterior;
  //       tarifa.textContent = datosAgua.tarifaConsumo;
  //       total.textContent = datosAgua.valorConsumo;
  //     } else {
  //       renderDetalles(servicioFijo);
  //     }
  //   });
  // }
  // if (otrosServicios !== null && otrosServicios !== undefined) {
  //   otrosServicios.forEach(async (otroServicio) => {
  //     console.log("Edita2: " + editados);
  //     const servicioEditado = await editados.find(
  //       (editado) => editado.id === otroServicio.id
  //     );
  //     if (servicioEditado) {
  //       console.log(`Se encontró un objeto con el ID ${otroServicio.id}`);
  //       console.log("Nuevo abono: " + servicioEditado.valor);
  //       otroServicio.abono = servicioEditado.valor;
  //     } else {
  //       console.log(`No se encontró un objeto con el ID ${otroServicio.id}`);
  //     }
  //     // if (otroServicio.nombre === "Agua Potable") {
  //     //   aguaSn = true;
  //     //   console.log("Tiene agua");
  //     //   lecturaAnterior.textContent = datosAgua.lecturaAnterior;
  //     //   lecturaActual.textContent = datosAgua.lecturaActual;
  //     //   consumo.textContent =
  //     //     datosAgua.lecturaActual - datosAgua.lecturaAnterior;
  //     //   tarifa.textContent = datosAgua.tarifaConsumo;
  //     //   total.textContent = datosAgua.valorConsumo;
  //     // } else {
  //     renderDetalles(otroServicio);
  //     // }
  // });
  //   }
  //   subtotal.textContent = "$" + datosTotales.totalPagar;
  //   descuento.textContent = "$0.0";
  //   totalPagar.textContent = "$" + datosTotales.totalPagar;
  // }
});

function renderDetalles(servicio) {
  serviciosCancelar.push(servicio);
  console.log("Servicios a cancelar: " + serviciosCancelar); // contratosList.innerHTML = "";
  // datosContratos.forEach((contrato) => {

  detailsList.innerHTML += "\n      <tr>\n      <td>".concat(servicio.nombre, "</td>\n        <td>").concat(servicio.descripcion, "</td>\n        <td     style=\"\n        text-align: center;\n        padding: 5px;\n        \n        font-size: 15px;\n      \">").concat(parseFloat(servicio.total).toFixed(2), "</td>\n        <td     style=\"\n        text-align: center;\n        padding: 5px;\n        \n        font-size: 15px;\n      \">").concat(parseFloat(servicio.descuento).toFixed(2), "</td>\n        <td     style=\"\n        text-align: center;\n        padding: 5px;\n \n        font-size: 15px;\n      \">").concat(parseFloat(servicio.saldo).toFixed(2), "</td>\n        <td     style=\"\n        text-align: center;\n        padding: 5px;\n        \n        font-size: 15px;\n      \">").concat(parseFloat(servicio.abono).toFixed(2), "</td>\n     </tr>\n        "); // });
}

var cancelarServicios = function cancelarServicios(planillaCancelarId, servicios, encabezadoCancelarId) {
  return regeneratorRuntime.async(function cancelarServicios$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("Enviar a cancelar: " + encabezadoCancelarId + " " + planillaCancelarId);
          _context2.next = 3;
          return regeneratorRuntime.awrap(ipcRenderer.invoke("cancelarServicios", planillaCancelarId, encabezadoCancelarId, serviciosCancelar));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

ipcRenderer.on("Notificar", function (event, response) {
  console.log("Response: " + response);

  if (response.success) {
    Swal.fire({
      title: response.title,
      text: response.message,
      icon: "success",
      confirmButtonColor: "#f8c471"
    });
  } else {
    Swal.fire({
      title: response.title,
      text: response.message,
      icon: "error",
      confirmButtonColor: "#f8c471"
    });
  }
}); // ipcRenderer.on("Notificar", (event, response) => {
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

function imprimirYGuardarPDFfinal() {
  var elemento;
  return regeneratorRuntime.async(function imprimirYGuardarPDFfinal$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
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
          return _context3.stop();
      }
    }
  });
}

function formatearFecha(fecha) {
  var fechaOriginal = new Date(fecha);
  var year = fechaOriginal.getFullYear();
  var month = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
  var day = String(fechaOriginal.getDate()).padStart(2, "0");
  var fechaFormateada = "".concat(year, "-").concat(month, "-").concat(day);
  return fechaFormateada;
}

var abrirPagos = function abrirPagos() {
  var acceso, url;
  return regeneratorRuntime.async(function abrirPagos$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          acceso = sessionStorage.getItem("acceso");
          url = "Servicios ocacionales";
          _context4.next = 4;
          return regeneratorRuntime.awrap(ipcRenderer.send("abrirInterface", url, acceso));

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
};