import React from 'react'
import Dashboard from './_components/Dashboard'

export const revalidate = 10;

const page = async () => {
  return (
    <div className='mt-4 mx-2 md:mx-4'>
      <Dashboard/>
    </div>
  )
}

export default page