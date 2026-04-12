import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PdfComp = ({ formData }) => {
  const data = formData || {};

  const fieldLabels = {
    date: 'Order Date',
    partyName: 'Party Name',
    billNumber: 'Bill Number',
    totalBookQuantity: 'Book Quantity',
    leavesPerBook: 'Leaves Per Pad',
    padQuantity: 'Pad Quantity',
    leavesPerPad: 'Leaves Per Pad',
    paperSize: 'Paper Size',
    paperQuality: 'Paper Quantity',
    gramWeightOfPaper: 'Gram Weight Paper',
    quantity: 'Quantity',
    sides: 'Printing Side',
    watermarkPage: 'Watermark Printing',
    inkColor: 'Ink Color',
    firstCopy: 'Paper Colour 1',
    secondCopy: 'Paper Colour 2',
    thirdCopy: 'Paper Colour 3',
    fourthCopy: 'Paper Colour 4',
    fifthCopy: 'Paper Colour 5',
    graph: 'Graph',
    serialNumFrom: 'Serial Number From',
    serialNumTo: 'Serial Number To',
    bookNumFrom: 'Book Number From',
    bookNumTo: 'Book Number To',
    perforation: 'Perforation Type',
    perforationCopy: 'Perforation Copy',
    PaperCutSize: 'Paper Cut Type',
    paperCSize:'Paper Cut Size',
    plateNumber: 'Plate Number',
    bindType: 'Binding Type',
    bothSideCraft: 'Both Side Binding',
    pad: 'Binding Pad Type',
    register: 'Binding Register Type',
    single: 'PDF Printing Single Side',
    size: 'PDF Size',
    spiralBinding: 'PDF Binding',
    otherJobs: 'Other Jobs',
    otherSize: 'Other Jobs Size',
    otherQuantity: 'Other Job Quantity',
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Order Summary', 15, 20, { align: 'left' });

    doc.setFontSize(9);
    const generatedAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    doc.text(`Generated on: ${generatedAt}`, pageWidth - 15, 20, { align: 'right' });
    doc.setLineWidth(0.5);
    doc.line(15, 24, pageWidth - 15, 24);

    const tableColumn = ["Field", "Value"];
    const tableRows = [];

    const prettifyLabel = (key) => {
      if (key === 'isCompleted') return 'Status';
      if (fieldLabels[key]) return fieldLabels[key];
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
    };

    const formatFieldValue = (key, value) => {
      if (key === 'isCompleted') {
        if (typeof value === 'string') {
          const normalized = value.toLowerCase();
          if (normalized === 'completed') return 'Completed';
          if (normalized === 'canceled') return 'Canceled';
          if (normalized === 'progress' || normalized === 'pending' || normalized === 'in progress') return 'In Progress';
          return normalized.replace(/^./, (str) => str.toUpperCase());
        }
        return value ? 'Completed' : 'Pending';
      }
      return value;
    };

    const flattenData = (value, prefix = '') => {
      if (value === null || value === undefined || value === '') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          flattenData(item, `${prefix}${index + 1}. `);
        });
        return;
      }

      if (typeof value === 'object') {
        for (const key in value) {
          if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
          if (key === 'id' || key === '_id') continue;

          const item = value[key];
          if (item === null || item === undefined || item === '') continue;

          const label = prettifyLabel(key);
          if (typeof item === 'object') {
            flattenData(item, `${prefix}${label} `);
          } else {
            tableRows.push([`${prefix}${label}`, String(formatFieldValue(key, item))]);
          }
        }
        return;
      }

      tableRows.push([prefix.trim(), String(value)]);
    };

    const baseData = { ...data };
    const fileDetails = baseData.fileDetails;
    const mediaDetails = baseData.mediaDetails;
    delete baseData.fileDetails;
    delete baseData.mediaDetails;

    if (Object.keys(baseData).length > 0) {
      tableRows.push(["Customer Details", ""]);
      flattenData(baseData);
    }

    if (fileDetails) {
      tableRows.push(["Order Details", ""]);
      flattenData(fileDetails);
    }

    if (Array.isArray(mediaDetails) && mediaDetails.length > 0) {
      tableRows.push(["Media Details", ""]);
      flattenData(mediaDetails, "Media Details ");
    }

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'striped',
      didParseCell: (data) => {
        const rowHeader = data.row.raw[0];
        if (rowHeader === 'Customer Details' || rowHeader === 'Order Details' || rowHeader === 'Media Details') {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [245, 245, 245];
        }
      },
    });

    doc.setLineWidth(0.5);
    doc.setTextColor(120);
    doc.setFontSize(9);
    doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
    doc.text('Ashoka Printing • Professional printing solutions', pageWidth / 2, pageHeight - 12, { align: 'center' });

    doc.save(`${data.partyName || 'customer'}-customer_data.pdf`);
  };

  return (
    <div className="flex justify-end mt-2">
      <button
        className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300"
        onClick={generatePDF}
      >
        Download PDF
      </button>
  </div>
  );
};

export default PdfComp;
