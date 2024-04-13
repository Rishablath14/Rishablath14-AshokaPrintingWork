"use client"
import { CustomerContext } from '@/app/_components/CustomerContext'
import { getOneCustomer, updateCustomer } from '@/app/actions/customer.action'
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"

const page = ({params}) => {
  const { getCustomercont,updateCustomercont } = React.useContext(CustomerContext);
   const [formData,setFormData] = useState(null);
   const [loading,setLoading] = useState(false);
   const [initialData,setInitialData] = useState(null);
   useEffect(()=>{getCustomercont(params.id).then((data)=>{const oneCustomer = data[0]; const uporddate = new Date(oneCustomer.date).toISOString().split('T')[0];const updeldata = new Date(oneCustomer.expectedDeliveryDate).toISOString().split('T')[0];const updata = {...oneCustomer,date:uporddate,expectedDeliveryDate:updeldata};setFormData(updata);setInitialData(updata)})},[]) 
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
  const handleUpdate = async (e)=>{
    e.preventDefault();
    const toastid = toast.loading("Updating...");
    if(initialData===formData){toast.info("No Changes to Update",{id:toastid});return}
    const orderDate = new Date(formData.date);
    const deliveryDate = new Date(formData.expectedDeliveryDate);
    if (orderDate > deliveryDate) {toast.error("order date must be less than or equal to delivery date",{id:toastid});return}
    setLoading(true);
    try{
      const dataup = {id:params.id,...formData};
      await updateCustomercont(params.id,dataup);
      toast.success("Customer Updated Successfully",{id:toastid});
    }catch(e){console.log("error",e)}finally{setLoading(false)}
  }
  if(!formData) return <div className='flex justify-center items-center min-h-[calc(100vh-96px)]'>Loading...</div>
  return (
    <div className="w-full min-h-screen p-4 md:p-8">
        <form className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 place-items-center gap-4' onSubmit={handleUpdate}>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Order Date:&nbsp;</label>
        <input autoFocus className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="date" min={new Date().toISOString().split('T')[0]} name='date' value={formData.date} required={true} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Delivery Date:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="date" name='expectedDeliveryDate' min={new Date().toISOString().split('T')[0]} value={formData.expectedDeliveryDate} required={true} onChange={handleChange}/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Work Status&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black text-center' type="text" name='isCompleted' value={formData.isCompleted} onChange={handleChange}>
        <option value="progress">Progress</option>
        <option value="completed">Completed</option>
        <option value="canceled">Canceled</option>
        </select>
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
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Comapny:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black text-center' type="text" name='company' value={formData.company} onChange={handleChange}>
        <option value="apw">APW</option>
        <option value="sre">SRE</option>
        </select>
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
        <option value="">Select Side</option>  
        <option value="single">Single Side</option>
        <option value="both">Both Side</option>
        </select>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Watermark Printing:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black text-center' type="text" name='fileDetails.watermarkPage' value={formData.fileDetails.watermarkPage} onChange={handleChange}>
        <option value="">Select Yes/No</option>
        <option value='true'>Yes</option>
        <option value='false'>No</option>
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
        <option value="">Select Colour Type</option>  
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
        <option value="">Select perforation type</option>  
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
        <option value="">Select Paper Cut</option>  
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
        <option value="">Select Bind Type</option>
        <option value="2">Top Cover, Bottom Yellow Board & Cloth Patti / Normal</option>
        <option value="1">Top Cover, Bottom Yellow Board/ Spring</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Both Side Craft Binding:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.binding.bothSideCraft' value={formData.fileDetails.binding.bothSideCraft} onChange={handleChange}>
        <option value="">Select Yes/No</option>
        <option value='true'>Yes</option>
        <option value='false'>No</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Pad:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.binding.pad' value={formData.fileDetails.binding.pad} onChange={handleChange}>
        <option value="">Select Binding Pad Type</option>  
        <option value="normal">Normal</option>
        <option value="perforated">Perforated</option>
        <option value="packet">Packet</option>
        <option value="plastic">Plastic Pack</option>
        </select>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Register:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.binding.register' value={formData.fileDetails.binding.register} onChange={handleChange}>
        <option value="">Select Register Type</option>  
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
        <option value="">Select Yes/No</option>
        <option value='true'>yes</option>
        <option value='false'>No</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>V.Cards Multi Colour:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.vCardsMCol' value={formData.fileDetails.vCardsMCol} onChange={handleChange}>
        <option value="">Select Yes/No</option>
        <option value='true'>yes</option>
        <option value='false'>No</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>V.cards Side:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.vCardsBothSide' value={formData.fileDetails.vCardsBothSide} onChange={handleChange}>
        <option value="">Select Side</option>
        <option value='true'>Double Side</option>
        <option value='false'>Single Side</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>V.cards Colour Xerox:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.vCardsXeroxCol' value={formData.fileDetails.vCardsXeroxCol} onChange={handleChange} placeholder='300/PVC GSM'/>
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>V.cards Lamination:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.vCardsLamination' value={formData.fileDetails.vCardsLamination} onChange={handleChange}>
        <option value="">Select Vcard Lamination</option>  
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
        <option value="">Select Yes/No</option>
        <option value='true'>Yes</option>
        <option value='false'>No</option>
        </select>
        </span>
        {
        formData.fileDetails.laminationAdd === "true" &&
        (
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>V.cards Lamination Addon:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.vCardsLaminationAdd' value={formData.fileDetails.vCardsLaminationAdd} onChange={handleChange}>
        <option value="">Select Vcard Lamination Addon</option>  
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
        <option value="">Select Type</option>
        <option value='false'>Black&White</option>
        <option value='true'>Colour</option>
        </select>  
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Xerox Side:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.xerox.singleSide' value={formData.fileDetails.xerox.singleSide} onChange={handleChange}>
        <option value='true'>Single Side</option>
        <option value='false'>Double Side</option>
        <option value="">Select Side</option>
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
        <option value="">Select Side</option>
        <option value='true'>Single</option>
        <option value='false'>Both</option>
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
        <option value="">Select Bind Type</option>
        <option value='true'>Spiral Binding</option>
        <option value='false'>Hard Bind</option>
        </select>    
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>ID Card Type:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.idCard.idType' value={formData.fileDetails.idCard.idType} onChange={handleChange}>
        <option value="">Select ID Card Type</option>
        <option value='pvc'>PVC</option>
        <option value='board'>Board</option>
        </select>    
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>ID Card Side:&nbsp;</label>
        <select className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.idCard.side' value={formData.fileDetails.idCard.side} onChange={handleChange}>
        <option value="">Select ID Card Side</option>
        <option value='single'>Single Side</option>
        <option value='both'>Both Side</option>
        </select>    
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>ID Card Quantity:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="number" name='fileDetails.idCard.quantity' value={formData.fileDetails.idCard.quantity} onChange={handleChange}/>    
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Other Jobs:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.pdfPigmentation.otherJobs' value={formData.fileDetails.pdfPigmentation.otherJobs} onChange={handleChange}/>    
        </span>
        <span className='flex flex-col gap-2 w-full'>
        <label className='text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center'>Other Jobs Quantity:&nbsp;</label>
        <input className='p-1 border dark:border-white dark:bg-slate-950 border-black' type="text" name='fileDetails.pdfPigmentation.otherQuantity' value={formData.fileDetails.pdfPigmentation.otherQuantity} onChange={handleChange}/>    
        </span>
        <button type='submit' disabled={loading} className='w-full p-2 border-[1px] border-b-[4px] dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900 hover:border-b-[1px] hover:bg-slate-50/80 transition-all dark:border-white border-zinc-950/90 block text-lg bg-slate-50 rounded-md text-black shadow-md font-bold col-span-1 sm:col-span-2 md:col-span-3'>Update Customer</button>
        </form>
    </div>
  )
}

export default page