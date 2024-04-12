"use client"
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import { cn } from '@/lib/utils';
import Link from 'next/link'
import { CustomerContext } from "@/app/_components/CustomerContext";



const page = ({params}) => {
  const { getCustomercont, customers, deleteCustomercont } = useContext(CustomerContext);
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  useEffect(()=>
  {
  const getData = async()=>{
  const data = await getCustomercont(params.id);
  setCustomer(data[0]);
  }
  getData();
  },[params.id,customers])
  const formattedDate = (date)=>{
    const udate = new Date(date);
    const formattedDate = `${udate.getDate()} / ${udate.getMonth() + 1} / ${udate.getFullYear()}`;
    return formattedDate;
  }
  const handleDelete = async()=>{
    const toastid = toast.loading("deleting..");
    try {
      await deleteCustomercont(params.id);
      toast.success('Customer deleted successfully!',{id:toastid});
      router.push("/customers");
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('An error occurred while deleting customer!',{id:toastid});
    }
  }
  if(!customer) return <div className='w-full min-h-[calc(100vh-96px)] flex justify-center items-center'>Loading...</div>
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="pb-4 flex justify-start items-center">
        <Link href="/customers">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Customers
          </Button>
        </Link>
        { customer &&
        <>
        <Link href={`${params.id}/update`} className='mx-1 md:mx-2'>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </Link>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </>
          }
      </div>
      {customer ? (
        <div>
          <div className="bg-white dark:bg-slate-900 dark:text-white shadow overflow-auto sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Personal Information</h3>
            </div>
            <div className="border-t border-slate-800 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer?.partyName}{console.log(customer)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">GST No.</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer?.gstNo}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer?.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer?.mobile}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer?.address}</dd>
                </div>
                {/* Add more personal information fields as needed */}
              </dl>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 dark:text-white shadow overflow-auto sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Work Information</h3>
            </div>
            <div className="border-t border-slate-800 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formattedDate(customer?.date)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivery Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formattedDate(customer?.expectedDeliveryDate)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Work Status</dt>
                  <dd className={cn(customer.isCompleted==='progress' ? 'text-yellow-500' : customer.isCompleted==='completed' ? 'text-green-500' : 'text-red-500',"mt-1 text-sm")}>{customer.isCompleted}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">₹{customer.totalAmount}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Advance</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">₹{customer.advance}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Balance</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">₹{customer.balance}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Work PC</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.fileDetails?.pc}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">File Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.fileDetails?.fileName}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Software</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.fileDetails?.software}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Book Quantity</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.fileDetails?.totalBookQuantity}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Leaves Per Book</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.fileDetails?.leavesPerBook}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pad Quantity</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.fileDetails?.padQuantity}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Leaves Per Pad</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.fileDetails?.leavesPerPad}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Paper Size</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.fileDetails?.paperSize}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Paper Quality</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.fileDetails?.paperQuality}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight Of Paper</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.fileDetails?.gramWeightOfPaper}</dd>
                </div>
                {customer.fileDetails?.printCopies.quantity>0 && 
                  <>
                  <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Print Copies</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.fileDetails?.printCopies.quantity}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Printing Side</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.fileDetails?.printCopies.sides}</dd>
                </div>
                </>
                }
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Watermark Printing</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white' name='fileDetails?.watermarkPage' value={customer.fileDetails?.watermarkPage}>
        {customer.fileDetails?.watermarkPage==true?"YES":"NO"}
        </dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Printing Ink Colour</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.inkColor}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Colour of Paper 1</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.paperColor.firstCopy}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Colour of Paper 2</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.paperColor.secondCopy}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Colour of Paper 3</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.paperColor.thirdCopy}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Colour of Paper 4</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.paperColor.fourthCopy}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Colour of Paper 5</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.paperColor.fifthCopy}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Graph</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.graph}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Printing Type</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.printType==='single'?"Single Colour":customer.fileDetails?.printType==='double'?"Double Colour":"Multi Colour"}
        </dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Screen Printing Color</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.screenPrintingColor}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>sticker Sheet Color</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'> {customer.fileDetails?.stickerSheetColor}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Sticker Sheet Size</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.stickerSheetSize}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Serial No. From</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.serialNumFrom}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Serial No. To</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.serialNumTo}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Book Number From</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.bookNumFrom}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Book Number To</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.bookNumTo}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Perforation</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.perforation==='normal'?"Normal":"Micro"}
        </dd>  
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Perforation Copy</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.perforationCopy}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Paper Cut Size</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.PaperCutSize==='ver'?"Vertical":"Horizontal"}
        </dd> 
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Plate Number</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.plateNumber}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Binding</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.binding.bindType==='1'?"Top Cover, Bottom Yellow Board/ Spring":"Top Cover, Bottom Yellow Board & Cloth Patti / Normal"} 
        </dd>  
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Both Side Craft Binding</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.binding.bothSideCraft==true?"YES":"NO"}
        </dd>  
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Pad</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.binding.pad==='normal'?"Normal":customer.fileDetails?.binding.pad=='packet'?"Packet":customer.fileDetails?.binding.pad=='plastic'?"Plastic":"Perforated"}
        </dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Register</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.binding.register==='fullcloth'?"Full Cloth":"Cloth Corner & Patti"}
        </dd>  
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>vinyl Size</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.vinylSize}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Sun Board Size</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.sunBoardSize}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Redium Size</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.rediumSize}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Sticker Multi Colour</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.stickerMultiCol==true?"YES":"NO"}
        </dd>  
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>V.Cards Multi Colour</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.vCardsMCol==true?"YES":"NO"}
        </dd>  
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>V.cards Side</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.vCardsBothSide==true?"Double Side":"Single Side"}
        </dd>  
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>V.cards Colour Xerox</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.vCardsXeroxCol}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>V.cards Lamination</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.vCardsLamination==='uv'?"UV":customer.fileDetails?.vCardsLamination==='mat'?"Mat":customer.fileDetails?.vCardsLamination==='gloss'?"Gloss":customer.fileDetails?.vCardsLamination==='single'?"Single Side":"Double Side"}
        </dd>  
        </div>
        {
        customer.fileDetails?.laminationAdd === "true" &&
        (
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>V.cards Lamination Addon</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.vCardsLaminationAdd==='uv'?"UV":customer.fileDetails?.vCardsLaminationAdd==='mat'?"Mat":"Gloss"}
        </dd>  
        </div>
        )
        }
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Xerox</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.xerox.colorXerox==true?"Colour":"Black & White"}
        </dd>  
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Xerox Side</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.xerox.singleSide==true?"Single Side":"Double Side"}
        </dd>  
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Xerox Quantity</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.xerox.quantity}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Xerox Size</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.xerox.size}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>PDF Printing Side</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.pdfPigmentation.single==true?"Single":"Both"}
        </dd>    
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>PDF Size</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.pdfPigmentation.size}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>PDF Quantity</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.pdfPigmentation.quantity}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>PDF Binding</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>
        {customer.fileDetails?.pdfPigmentation.spiralBinding==true?"Spiral Binding":"Hard Binding"}
        </dd>    
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Other Jobs</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.pdfPigmentation.otherJobs}</dd>
        </div>
        <div className='sm:col-span-1'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Other Jobs Quantity</dt>
        <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{customer.fileDetails?.pdfPigmentation.otherQuantity}</dd>
        </div>
              </dl>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full min-h-[calc(100vh-196px)]">No customer found</div>
      )}
    </div>
  );
}
 
export default page


