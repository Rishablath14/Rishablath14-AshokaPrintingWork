import React from 'react'
import { BadgeIndianRupee,IndianRupee,BookUser,User } from "lucide-react"
import DashTableDemo from './DashTable'

const Dashboard = ({total,totalCust,balance,customers}) => {
  return (
    <div>
    <div className='flex justify-around gap-2 md:gap-4 items-center mb-6'>
    <div className='w-full shadow-md border border-black dark:border-white p-2 md:p-4 rounded-lg'>
     <div className='flex justify-between w-full'>
        <h2 className=''>Total Revenue</h2>
        <span className=''><BadgeIndianRupee /></span>
     </div>
     <h3 className='font-bold text-xl md:text-3xl mt-3 flex items-center'>
     <IndianRupee />{total}
     </h3>
    </div>
    <div className='w-full shadow-md border border-black dark:border-white p-2 md:p-4 rounded-lg'>
     <div className='flex justify-between w-full'>
        <h2 className=''>Total Customers</h2>
        <span className=''><BookUser /></span>
     </div>
     <h3 className='font-bold text-xl md:text-3xl mt-3 flex gap-1 items-center'>
     <User />{totalCust}
     </h3>
    </div>
    <div className='w-full shadow-md border border-black dark:border-white p-2 md:p-4 rounded-lg'>
     <div className='flex justify-between w-full'>
        <h2 className=''>Total Balance</h2>
        <span className=''><BadgeIndianRupee /></span>
     </div>
     <h3 className='font-bold text-xl md:text-3xl mt-3 flex  items-center'>
     <IndianRupee />{balance}
     </h3>
    </div>
    </div>
    <DashTableDemo customers={customers}/>
    </div>
  )
}

export default Dashboard