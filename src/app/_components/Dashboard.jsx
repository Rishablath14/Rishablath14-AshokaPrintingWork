"use client"
import React, { useContext, useEffect, useState } from 'react'
import { BadgeIndianRupee,IndianRupee,BookUser,User } from "lucide-react"
import DashTableDemo from './DashTable'
import { CustomerContext } from './CustomerContext';

const Dashboard = () => {
   const { customers } = useContext(CustomerContext); 
   const [aggregateData, setAggregateData] = useState({totalSales: 0, totalCustomers: 0,totalBalance:0});
   useEffect(()=>{
      const totalValues = async () => {
         let amount = 0;
         customers.map((cus)=>amount+=Number(cus.totalAmount));
         let custNum = customers.length;
         let balance = 0;
         customers.map((cus)=>balance+=Number(cus.balance));
         const data = {totalSales: amount, totalCustomers: custNum,totalBalance:balance}
         setAggregateData(data);
     }
     totalValues();
   },[customers])
  return (
    <div>
    <div className='flex justify-around gap-2 md:gap-4 items-center mb-6'>
    <div className='w-full shadow-md border border-black dark:border-white p-2 md:p-4 rounded-lg'>
     <div className='flex justify-between w-full'>
        <h2 className=''>Total Revenue</h2>
        <span className=''><BadgeIndianRupee /></span>
     </div>
     <h3 className='font-bold text-xl md:text-3xl mt-3 flex items-center'>
     <IndianRupee />{aggregateData.totalSales}
     </h3>
    </div>
    <div className='w-full shadow-md border border-black dark:border-white p-2 md:p-4 rounded-lg'>
     <div className='flex justify-between w-full'>
        <h2 className=''>Total Customers</h2>
        <span className=''><BookUser /></span>
     </div>
     <h3 className='font-bold text-xl md:text-3xl mt-3 flex gap-1 items-center'>
     <User />{aggregateData.totalCustomers}
     </h3>
    </div>
    <div className='w-full shadow-md border border-black dark:border-white p-2 md:p-4 rounded-lg'>
     <div className='flex justify-between w-full'>
        <h2 className=''>Total Balance</h2>
        <span className=''><BadgeIndianRupee /></span>
     </div>
     <h3 className='font-bold text-xl md:text-3xl mt-3 flex  items-center'>
     <IndianRupee />{aggregateData.totalBalance}
     </h3>
    </div>
    </div>
    <DashTableDemo/>
    </div>
  )
}

export default Dashboard