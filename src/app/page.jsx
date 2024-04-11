import React from 'react'
import Dashboard from './_components/Dashboard'
import { getCustomerProgress, totalBalance, totalCustomer, totalRevenue } from './actions/customer.action'

const page = async () => {
  const total = await totalRevenue();
  const NumOfCust = await totalCustomer();
  const balance = await totalBalance();
  const customers = await getCustomerProgress();
  return (
    <div className='mt-4 mx-2 md:mx-4'>
      <Dashboard total={total} totalCust={NumOfCust} balance={balance} customers={customers}/>
    </div>
  )
}

export default page