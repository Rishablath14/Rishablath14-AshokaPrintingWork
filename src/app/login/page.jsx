"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import {toast} from 'sonner'
import {Eye,EyeOff} from 'lucide-react'

const login = () => {
  const router = useRouter();
  const [loading,setLoading] = useState(false);
  const [pass,setPass] = useState(false);
  const [form,setForm] = useState({
    username:"",
    password:""
  })
  const handleSubmit = async (e)=>{
    e.preventDefault();
    const toastlo = toast.loading("Login Check...")
    try {
            setLoading(true);
            const response = await axios.post("/api/admin", form);
            console.log("Login success", response.data);
            toast.success("Login success",{
              id:toastlo
            });
            router.refresh();
        } catch (error) {
            console.log("Login failed", error.message);
            toast.error(error.response.data.message,{id:toastlo});
        } finally{
        setLoading(false);
        }
  }
  const handleClick = ()=>{setPass(!pass)}
  return (
    <div className='w-full min-h-[calc(100vh-96px)] flex justify-center items-center'>
      <form className='w-[90%] md:w-[60%] p-4 md:p-8 flex gap-1 flex-col rounded-md shadow-lg border border-black dark:border-white' onSubmit={handleSubmit}>
       <h1 className='font-bold text-xl mb-6'>Login</h1> 
       <label className='mb-2 bg-slate-50 rounded-md p-1 dark:bg-slate-950 font-bold'>Username</label>
       <input className='w-full p-1 border dark:border-white dark:bg-slate-950 border-black' type='text' placeholder='Enter your username' value={form.username} onChange={(e)=>{setForm({...form,username:e.target.value})}} required/>
       <label className='mt-4 mb-2 bg-slate-50 rounded-md p-1 dark:bg-slate-950 font-bold'>Password</label>
       <input className='w-full p-1 border dark:border-white dark:bg-slate-950 border-black' type={pass?"text":"password"} placeholder='Enter Your password' value={form.password} onChange={(e)=>{setForm({...form,password:e.target.value})}} required/>
       <span className='mt-2' onClick={handleClick}>{pass?<EyeOff />:<Eye />}</span>
       <button type='submit' disabled={loading} className='p-2 mt-6 bg-black text-white rounded-md dark:bg-slate-50/90 dark:text-black'>Login</button>
      </form>
    </div>
  )
}

export default login


//Bill No.
//Vinyl t-vinyl retro oneway Normal-flex Star-flex --> size --> rate 
//PDF Print --> Custom Fields
// Party name TBQ,LPB,TPQ,LPP, Paper Size,PQ, GSM, PCopy, Printing,Ink Colour, Colour of paperr 12 3 4 5, Graph, Serialpura ,Book pura, Perforation, Binding,Paper cut size
