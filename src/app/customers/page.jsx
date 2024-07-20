import React from 'react'
import DataTableDemo from '../_components/CustomersTable'
export const dynamic = 'force-dynamic';
const page = () => {
  return (
    <div className='p-2 md:p-4'>
      <DataTableDemo/>
    </div>
  )
}

export default page