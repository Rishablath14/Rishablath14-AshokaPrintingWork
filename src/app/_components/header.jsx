"use client"
import React from 'react'
import Link from 'next/link'
import { ModeToggle } from './toggleMode'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const Header = () => {
  const path = usePathname();
  const navLinks = 
  [
   {label:'Home',link:'/'},
   {label:'Add',link:'/add'},
   {label:'All',link:'/customers'},
  ]
  return (
    <div className='w-full fixed h-16 shadow-lg bg-slate-50 dark:bg-slate-900 flex justify-between items-center px-4 md:px-8'>
      {/* <Image src="/asp_logo.webp" alt="APW LOGO" fetchPriority='high' width={50} height={50} className='hidden md:block'/> */}
      <Image src="/asp_logo.webp" alt="APW LOGO" fetchPriority='high' width={50} height={50} className='block mix-blend-luminosity'/>
      <div className='flex gap-4 md:gap-12 justify-center items-center'>
        {navLinks.map((nav,idx)=>(<a key={idx} href={nav.link} className={cn('text-lg font-medium dark:border-white border-black px-2 rounded-md',path===nav.link?'border':'')}>{nav.label}</a>))}
      </div>
      <ModeToggle/>
    </div>
  )
}

export default Header