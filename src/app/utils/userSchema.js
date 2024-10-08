import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  date: Date,
  expectedDeliveryDate: Date,
  partyName: String,
  address: String,
  mobile: String,
  email: String,
  gstNo: String,
  company:String,
  totalAmount: Number,
  advance: Number,
  isCompleted:String,
  fileDetails: {
    pc: String,
    fileName: String,
    software: String,
    totalBookQuantity: Number,
    leavesPerBook: Number,
    padQuantity: Number,
    leavesPerPad: Number,
    paperSize: String,
    paperQuality: String,
    gramWeightOfPaper: Number,
    printCopies: {
      quantity: Number,
      sides: String,
    },
    watermarkPage: String,
    inkColor: String,
    paperColor: {
      firstCopy: String,
      secondCopy: String,
      thirdCopy: String,
      fourthCopy: String,
      fifthCopy: String,
    },
    graph: Number,
    printType: String,
    screenPrintingColor: String,
    stickerSheetColor: String,
    stickerSheetSize: String,
    serialNumFrom: Number,
    serialNumTo: Number,
    bookNumFrom: Number,
    bookNumTo: Number,
    perforation: String,
    perforationCopy: String,
    PaperCutSize: String,
    plateNumber: Number,
    binding: {
      bindType:String,  
      bothSideCraft: String,
      pad:String,
      register:String,
    },
    vinylSize: String,
    sunBoardSize: String,
    rediumSize:String,
    stickerMultiCol: String, 
    vCardsMCol: String,
    vCardsBothSide: String,
    vCardsXeroxCol: String,
    vCardsLamination: String,
    laminationAdd:String,
    vCardsLaminationAdd:String,
    xerox:{
        colorXerox: String,
        singleSide:String,
        quantity:String,
        size:String,
    },
    idCard:{
     idType:String,
     side:String,
     quantity:Number
    },
    pdfPigmentation: {
      single: String,
      size: String,
      quantity: Number,
      spiralBinding: String,
      otherJobs: String,
      otherSize:String,
      otherQuantity:String,
    },
  },
});

// const userDetails = mongoose.model('userDetails', userSchema);
const Customers = mongoose.models.Customers || mongoose.model('Customers', userSchema);

export default Customers;
