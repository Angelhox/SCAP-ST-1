declare const html2pdf: any;
function imprimir() {
  window.print();
  // Importa la biblioteca html2pdf

  // Obtiene el elemento que deseas convertir en PDF
  const content = document.querySelector(".invoice");

  // Configura las opciones para la generación de PDF
  const pdfOptions = {
    margin: 10,
    filename: "respaldo.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  // Genera el PDF y guárdalo
  html2pdf()
    .from(content)
    .set(pdfOptions)
    .outputPdf((pdf) => {
      console.log("saliendo...");
      pdf.save();
    });
}
