import React from 'react'
import DataTableDemo from '../_components/CustomersTable'

const page = () => {
  return (
    <div className='page-shell space-y-6'>
      <section className='page-hero'>
        <h1 className='page-title md:text-4xl'>Job Registry</h1>
        <p className='page-copy'>Search all records, update job statuses, and manage customer accounts.</p>
      </section>
      <DataTableDemo/>
    </div>
  )
}

export default page
