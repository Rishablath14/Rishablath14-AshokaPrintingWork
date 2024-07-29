import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PdfComp = ({ formData }) => {
  const data = {
    date: formData.date,
    partyName: formData.partyName,
    fileDetails: {
      totalBookQuantity: formData.fileDetails.totalBookQuantity,
      leavesPerBook: formData.fileDetails.leavesPerBook,
      padQuantity: formData.fileDetails.padQuantity,
      leavesPerPad: formData.fileDetails.leavesPerPad,
      paperSize: formData.fileDetails.paperSize,
      paperQuality: formData.fileDetails.paperQuality,
      gramWeightOfPaper: formData.fileDetails.gramWeightOfPaper,
      printCopies: {
        quantity: formData.fileDetails.printCopies.quantity,
        sides: formData.fileDetails.printCopies.sides,
      },
      watermarkPage: formData.fileDetails.watermarkPage,
      inkColor: formData.fileDetails.inkColor,
      paperColor: {
        firstCopy: formData.fileDetails.paperColor.firstCopy,
        secondCopy: formData.fileDetails.paperColor.secondCopy,
        thirdCopy: formData.fileDetails.paperColor.thirdCopy,
        fourthCopy: formData.fileDetails.paperColor.fourthCopy,
        fifthCopy: formData.fileDetails.paperColor.fifthCopy,
      },
      graph: formData.fileDetails.graph,
      serialNumFrom: formData.fileDetails.serialNumFrom,
      serialNumTo: formData.fileDetails.serialNumTo,
      bookNumFrom: formData.fileDetails.bookNumFrom,
      bookNumTo: formData.fileDetails.bookNumTo,
      perforation: formData.fileDetails.perforation,
      perforationCopy: formData.fileDetails.perforationCopy,
      PaperCutSize: formData.fileDetails.PaperCutSize,
      plateNumber: formData.fileDetails.plateNumber,
      binding: {
        bindType: formData.fileDetails.binding.bindType,
        bothSideCraft: formData.fileDetails.binding.bothSideCraft,
        pad: formData.fileDetails.binding.pad,
        register: formData.fileDetails.binding.register,
      },
      pdfPigmentation: {
        single: formData.fileDetails.pdfPigmentation.single,
        size: formData.fileDetails.pdfPigmentation.size,
        quantity: formData.fileDetails.pdfPigmentation.quantity,
        spiralBinding: formData.fileDetails.pdfPigmentation.spiralBinding,
        otherJobs: formData.fileDetails.pdfPigmentation.otherJobs,
        otherSize: formData.fileDetails.pdfPigmentation.otherSize,
        otherQuantity: formData.fileDetails.pdfPigmentation.otherQuantity,
      }
    }
  };

  const fieldLabels = {
    date: 'Order Date',
    partyName: 'Party Name',
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

    doc.setFontSize(18);
    const titleText = `${formData.partyName} Order Data -> ${formData.date}`;
    const titleWidth = doc.getStringUnitWidth(titleText) * doc.internal.scaleFactor;
  const pageWidth = doc.internal.pageSize.getWidth();
  const x = (pageWidth - titleWidth-40) / 2;
    doc.text(titleText, x, 10,);

    const tableColumn = ["Field", "Value"];
    const tableRows = [];

    // Helper function to flatten and filter data
    const flattenData = (data, prefix = '') => {
      for (const key in data) {
        if (data.hasOwnProperty(key) && key !== 'mediaDetails' && key !== 'fileDetails') {
          const value = data[key];
          const label = fieldLabels[key] || key;

          if (value === null || value === undefined || value === '') {
            continue; // Skip empty values
          }

          if (typeof value === 'object') {
            flattenData(value, `${prefix}${label} `);
          } else {
            tableRows.push([label, value]);
          }
        }
      }
    };

    flattenData(data);
    if (data.fileDetails) {
      tableRows.push(["-----------------------Order Details---------------------", ""]);
      flattenData(data.fileDetails);
    }

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 15,
      theme: 'striped',
    });

    doc.save(`${data.partyName}-customer_data.pdf`);
  };

  return (
    <div>
      <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={generatePDF}>
        Download PDF
      </button>
    </div>
  );
};

export default PdfComp;
