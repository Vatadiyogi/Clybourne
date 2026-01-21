// pdfUtils.js
import html2pdf from 'html2pdf.js';

export const generatePdf = async (reportRef) => {
  const element = reportRef.current; // Get the report element

  const opt = {
    margin: 1,
    filename: 'report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, scrollX: 0, scrollY: 0 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');
  return pdfBlob; // Return the generated PDF blob
};
