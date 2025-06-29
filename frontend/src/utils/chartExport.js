import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export chart canvas as PNG
 * @param {HTMLCanvasElement} canvas - Chart canvas element
 * @param {string} filename - File name without extension
 */
export const exportChartAsPNG = (canvas, filename = 'chart') => {
  const link = document.createElement('a');
  link.download = `${filename}-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

/**
 * Export chart container as PDF
 * @param {HTMLElement} container - Chart container element
 * @param {string} filename - File name without extension
 * @param {Object} options - PDF options
 */
export const exportChartAsPDF = async (container, filename = 'chart', options = {}) => {
  const {
    orientation = 'landscape',
    format = 'a4',
    scale = 2,
    backgroundColor = '#ffffff'
  } = options;

  const canvas = await html2canvas(container, {
    backgroundColor,
    scale,
    useCORS: true,
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format
  });
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = (pdfHeight - imgHeight * ratio) / 2;
  
  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
  pdf.save(`${filename}-${Date.now()}.pdf`);
};

/**
 * Generate chart filename based on configuration
 * @param {string} chartType - Type of chart
 * @param {string} xAxis - X-axis column name
 * @param {string} yAxis - Y-axis column name
 */
export const generateChartFilename = (chartType, xAxis, yAxis) => {
  const sanitize = (str) => str.replace(/[^a-zA-Z0-9]/g, '_');
  return `${chartType}_${sanitize(xAxis)}_vs_${sanitize(yAxis)}`;
};
