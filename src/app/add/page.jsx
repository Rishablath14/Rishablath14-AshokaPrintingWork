import React from 'react'
import UserAdd from '../_components/UserAdd'

const page = () => {
  return (
    <div className='page-shell space-y-6'>
      <section className='page-hero'>
        <h1 className='page-title md:text-4xl'>Create New Order</h1>
        <p className='page-copy'>Input customer details, job specifications, and billing information.</p>
      </section>
      <UserAdd/>
    </div>
  )
}

export default page
