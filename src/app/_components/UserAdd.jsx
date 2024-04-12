"use client"
import React, { useState, useEffect } from 'react';
import { toast } from "sonner"
import { addCustomer } from '../actions/customer.action';

const UserAdd = () => {
  const [loading,setLoading] = useState(false);
  const [formData, setFormData] = useState({
  date: '',
  expectedDeliveryDate: '',
  partyName: '',
  address: '',
  mobile: '',
  email: '',
  gstNo: '',
  totalAmount: 0,
  advance: 0,
  balance: 0,
  isCompleted:'progress',
  fileDetails: {
    pc: '1',
    fileName: '',
    software: '',
    totalBookQuantity: 0,
    leavesPerBook: 0,
    padQuantity: 0,
    leavesPerPad: 0,
    paperSize: '',
    paperQuality: '',
    gramWeightOfPaper: 0,
    printCopies: {
      quantity: 0,
      sides: 'single',
    },
    watermarkPage: false,
    inkColor: '',
    paperColor: {
      firstCopy: '',
      secondCopy: '',
      thirdCopy: '',
      fourthCopy: '',
      fifthCopy: '',
    },
    graph: 0,
    printType: 'single',
    screenPrintingColor: '',
    stickerSheetSize: '',
    stickerSheetColor: '',
    serialNumFrom: 0,
    serialNumTo: 0,
    bookNumFrom: 0,
    bookNumTo: 0,
    perforation: 'normal',
    perforationCopy: '',
    PaperCutSize: 'hori',
    plateNumber: 0,
    binding: {
      bindType:'1',
      bothSideCraft: false,
      pad:'normal',
      register:'clothcorner',
    },
    vinylSize: '',
    sunBoardSize: '',
    rediumSize:'',
    stickerMultiCol: false, 
    vCardsMCol: false,
    vCardsBothSide: false,
    vCardsXeroxCol: '',
    vCardsLamination: 'single',
    laminationAdd:false,
    vCardsLaminationAdd:'uv',
    xerox:{
        colorXerox: false,
        singleSide:false,
        quantity:'',
        size:'',
    },
    pdfPigmentation: {
      single: false,
      size: '',
      quantity: 0,
      spiralBinding: false,
      otherJobs: '',
      otherQuantity:'',
    }}
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const res = name.split('.');
      if(res.length>2){
        const [parent,section, key] = res;
          setFormData((prevFormData) => ({
            ...prevFormData,
            [parent]: {
              ...prevFormData[parent],
              [section]: {
                ...prevFormData[section],
                [key]: value,
              },
            },
          }));
      }
      else{
        const [section, key] = res;
          setFormData((prevFormData) => ({
            ...prevFormData,
            [section]: {
              ...prevFormData[section],
              [key]: value,
            },
          }));
      }} else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastid=toast.loading("Adding..");
    const orderDate = new Date(formData.date);
    const deliveryDate = new Date(formData.expectedDeliveryDate);
    if (orderDate > deliveryDate) {toast.error("order date must be less than or equal to delivery date",{id:toastid});setLoading(false);return}
    try {
      const response = await addCustomer(formData);
      if (response) {
        toast.success("Customer Saved Successfully",{id:toastid})
        setFormData({
            date: '',
            expectedDeliveryDate: '',
            partyName: '',
            address: '',
            mobile: '',
            email: '',
            gstNo: '',
            totalAmount: 0,
            advance: 0,
            balance: 0,
            isCompleted:'progress',
            fileDetails: {
              pc: '1',
              fileName: '',
              software: '',
              totalBookQuantity: 0,
              leavesPerBook: 0,
              padQuantity: 0,
              leavesPerPad: 0,
              paperSize: '',
              paperQuality: '',
              gramWeightOfPaper: 0,
              printCopies: {
                quantity: 0,
                sides: 'single',
              },
              watermarkPage: false,
              inkColor: '',
              paperColor: {
                firstCopy: '',
                secondCopy: '',
                thirdCopy: '',
                fourthCopy: '',
                fifthCopy: '',
              },
              graph: 0,
              printType: 'single',
              screenPrintingColor: '',
              stickerSheetSize: '',
              stickerSheetColor: '',
              serialNumFrom: 0,
              serialNumTo: 0,
              bookNumFrom: 0,
              bookNumTo: 0,
              perforation: 'normal',
              perforationCopy: '',
              PaperCutSize: 'hori',
              plateNumber: 0,
              binding: {
                type:'1',
                bothSideCraft: false,
                pad:'normal',
                register:'clothcorner',
              },
              vinylSize: '',
              sunBoardSize: '',
              rediumSize:'',
              stickerMultiCol: false, 
              vCardsMCol: false,
              vCardsBothSide: false,
              vCardsXeroxCol: '',
              vCardsLamination: 'single',
              laminationAdd:false,
              vCardsLaminationAdd:'uv',
              xerox:{
                  colorXerox: false,
                  singleSide:false,
                  quantity:'',
                  size:'',
              },
              pdfPigmentation: {
                single: false,
                size: '',
                quantity: 0,
                spiralBinding: false,
                otherJobs: '',
                otherQuantity:'',
              }}
        });
      } else {
        console.error('Error creating user detail');
      }
    } catch (error) {
      console.error('Error creating user detail:', error);
    }finally{setLoading(false)}
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8">
      <form className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 place-items-center gap-4' onSubmit={handleCreate}>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Order Date:&nbsp;</label>
        <input autoFocus className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="date" min={new Date().toISOString().split('T')[0]} name='date' value={formData.date} required={true} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Delivery Date:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="date" name='expectedDeliveryDate' min={new Date().toISOString().split('T')[0]} value={formData.expectedDeliveryDate} required={true} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Party Name:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='partyName' value={formData.partyName} required={true} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Address:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='address' value={formData.address} required={true} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Contact Number:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='mobile' value={formData.mobile} required={true} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Email:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="email" name='email' value={formData.email} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Gst No.:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='gstNo' value={formData.gstNo} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Total Amount:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='totalAmount' value={formData.totalAmount} required={true} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Advance:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='advance' value={formData.advance} required={true} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Balance:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='balance' value={formData.balance} required={true} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Work PC:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black text-center' type="text" name='fileDetails.pc' value={formData.fileDetails.pc} onChange={handleChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>File Name:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.fileName' value={formData.fileDetails.fileName} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Softwares:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.software' value={formData.fileDetails.software} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Total Book Quantity:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.totalBookQuantity' value={formData.fileDetails.totalBookQuantity} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Leaves Per Book:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.leavesPerBook' value={formData.fileDetails.leavesPerBook} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Total Pad Quantity:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.padQuantity' value={formData.fileDetails.padQuantity} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Leaves Per Pad/pkt.:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.leavesPerPad' value={formData.fileDetails.leavesPerPad} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Paper Size:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.paperSize' value={formData.fileDetails.paperSize} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Paper Quality:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.paperQuality' value={formData.fileDetails.paperQuality} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Gram Weight Of Paper:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.gramWeightOfPaper' value={formData.fileDetails.gramWeightOfPaper} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Print Copies:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.printCopies.quantity' value={formData.fileDetails.printCopies.quantity} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Printing:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black text-center' type="text" name='fileDetails.printCopies.sides' value={formData.fileDetails.printCopies.sides} onChange={handleChange}>
        <option value="single">Single Side</option>
        <option value="both">Both Side</option>
        </select>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Watermark Printing:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black text-center' type="text" name='fileDetails.watermarkPage' value={formData.fileDetails.watermarkPage} onChange={handleChange}>
        <option value={true}>Yes</option>
        <option value={false}>No</option>
        </select>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Printing Ink Colour:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.inkColor' value={formData.fileDetails.inkColor} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Colour of Paper 1:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.paperColor.firstCopy' value={formData.fileDetails.paperColor.firstCopy} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Colour of Paper 2:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.paperColor.secondCopy' value={formData.fileDetails.paperColor.secondCopy} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Colour of Paper 3:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.paperColor.thirdCopy' value={formData.fileDetails.paperColor.thirdCopy} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Colour of Paper 4:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.paperColor.fourthCopy' value={formData.fileDetails.paperColor.fourthCopy} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Colour of Paper 5:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.paperColor.fifthCopy' value={formData.fileDetails.paperColor.fifthCopy} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Graph:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.graph' value={formData.fileDetails.graph} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Printing Type:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.printType' value={formData.fileDetails.printType} onChange={handleChange}>
        <option value="single">Single Colour</option>
        <option value="double">Double Colour</option>
        <option value="multi">Multi Colour</option>
        </select>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Screen Printing Color:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.screenPrintingColor' value={formData.fileDetails.screenPrintingColor} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>sticker Sheet Color:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.stickerSheetColor' value={formData.fileDetails.stickerSheetColor} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Sticker Sheet Size:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.stickerSheetSize' value={formData.fileDetails.stickerSheetSize} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Serial No. From:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.serialNumFrom' value={formData.fileDetails.serialNumFrom} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Serial No. To:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.serialNumTo' value={formData.fileDetails.serialNumTo} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Book Number From:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.bookNumFrom' value={formData.fileDetails.bookNumFrom} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Book Number To:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.bookNumTo' value={formData.fileDetails.bookNumTo} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Perforation:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.perforation' value={formData.fileDetails.perforation} onChange={handleChange}>
        <option value="normal">Normal</option>
        <option value="micro">Micro</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Perforation Copy:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.perforationCopy' value={formData.fileDetails.perforationCopy} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Paper Cut Size:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.PaperCutSize' value={formData.fileDetails.PaperCutSize} onChange={handleChange}>
        <option value="ver">Vertical</option> 
        <option value="hori">Horizontal</option> 
        </select> 
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Plate Number:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.plateNumber' value={formData.fileDetails.plateNumber} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Binding:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.binding.bindType' value={formData.fileDetails.binding.bindType} onChange={handleChange}>
        <option value="2">Top Cover, Bottom Yellow Board & Cloth Patti / Normal</option>
        <option value="1">Top Cover, Bottom Yellow Board/ Spring</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Both Side Craft Binding:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.binding.bothSideCraft' value={formData.fileDetails.binding.bothSideCraft} onChange={handleChange}>
        <option value={true}>Yes</option>
        <option value={false}>No</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Pad:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.binding.pad' value={formData.fileDetails.binding.pad} onChange={handleChange}>
        <option value="normal">Normal</option>
        <option value="perforated">Perforated</option>
        <option value="packet">Packet</option>
        <option value="plastic">Plastic Pack</option>
        </select>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Register:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.binding.register' value={formData.fileDetails.binding.register} onChange={handleChange}>
        <option value="clothcorner">Cloth Corner & patti</option>
        <option value="fullcloth">Full Cloth</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>vinyl Size:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.vinylSize' value={formData.fileDetails.vinylSize} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Sun Board Size:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.sunBoardSize' value={formData.fileDetails.sunBoardSize} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Redium Size:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.rediumSize' value={formData.fileDetails.rediumSize} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Sticker Multi Colour:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.stickerMultiCol' value={formData.fileDetails.stickerMultiCol} onChange={handleChange}>
        <option value={true}>yes</option>
        <option value={false}>No</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>V.Cards Multi Colour:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.vCardsMCol' value={formData.fileDetails.vCardsMCol} onChange={handleChange}>
        <option value={true}>yes</option>
        <option value={false}>No</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>V.cards Side:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.vCardsBothSide' value={formData.fileDetails.vCardsBothSide} onChange={handleChange}>
        <option value={true}>Double Side</option>
        <option value={false}>Single Side</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>V.cards Colour Xerox:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.vCardsXeroxCol' value={formData.fileDetails.vCardsXeroxCol} onChange={handleChange} placeholder='300/PVC GSM'/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>V.cards Lamination:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.vCardsLamination' value={formData.fileDetails.vCardsLamination} onChange={handleChange}>
        <option value="single">single Side</option>
        <option value="double">Double Side</option>
        <option value="uv">UV</option>
        <option value="gloss">Gloss</option>
        <option value="mat">Mat</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Add More:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.laminationAdd' value={formData.fileDetails.laminationAdd} onChange={handleChange}>
        <option value={true}>Yes</option>
        <option value={false}>No</option>
        </select>
        </span>
        {
        formData.fileDetails.laminationAdd === "true" &&
        (
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>V.cards Lamination Addon:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.vCardsLaminationAdd' value={formData.fileDetails.vCardsLaminationAdd} onChange={handleChange}>
        <option value="uv">UV</option>
        <option value="gloss">Gloss</option>
        <option value="mat">Mat</option>
        </select>  
        </span>
        )
        }
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Xerox:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.xerox.colorXerox' value={formData.fileDetails.xerox.colorXerox} onChange={handleChange}>
        <option value={false}>Black&White</option>
        <option value={true}>Colour</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Xerox Side:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.xerox.singleSide' value={formData.fileDetails.xerox.singleSide} onChange={handleChange}>
        <option value={false}>Double Side</option>
        <option value={true}>Single Side</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Xerox Quantity:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.xerox.quantity' value={formData.fileDetails.xerox.quantity} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Xerox Size:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.xerox.size' value={formData.fileDetails.xerox.size} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>PDF Printing Side:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.pdfPigmentation.single' value={formData.fileDetails.pdfPigmentation.single} onChange={handleChange}>
        <option value={true}>Single</option>
        <option value={false}>Both</option>
        </select>    
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>PDF Size:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.pdfPigmentation.size' value={formData.fileDetails.pdfPigmentation.size} onChange={handleChange}/>    
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>PDF Quantity:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.pdfPigmentation.quantity' value={formData.fileDetails.pdfPigmentation.quantity} onChange={handleChange}/>    
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>PDF Binding:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.pdfPigmentation.spiralBinding' value={formData.fileDetails.pdfPigmentation.spiralBinding} onChange={handleChange}>
        <option value={true}>Spiral Binding</option>
        <option value={false}>Hard Bind</option>
        </select>    
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Other Jobs:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.pdfPigmentation.otherJobs' value={formData.fileDetails.pdfPigmentation.otherJobs} onChange={handleChange}/>    
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Other Jobs Quantity:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.pdfPigmentation.otherQuantity' value={formData.fileDetails.pdfPigmentation.otherQuantity} onChange={handleChange}/>    
        </span>
        <button type='submit' disabled={loading} className='w-full p-2 border-[1px] border-b-[4px] dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900 hover:border-b-[1px] hover:bg-slate-50/80 transition-all dark:border-white border-zinc-950/90 block text-lg bg-slate-50 rounded-md text-black shadow-md font-bold col-span-1 sm:col-span-2 md:col-span-3'>Add Customer</button>
        </form>
    </div>
  );
};

export default UserAdd;
