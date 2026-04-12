"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner'
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'

const login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: ""
  })
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastlo = toast.loading("Login Check...")
    try {
      setLoading(true);
      const response = await axios.post("/api/admin", {
        username: form.username.trim(),
        password: form.password,
      });
      console.log("Login success", response.data);
      toast.success("Login success", {
        id: toastlo
      });
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.log("Login failed", error.message);
      toast.error(error.response?.data?.message || "Login failed", { id: toastlo });
    } finally {
      setLoading(false);
    }
  }
  const handleClick = () => { setPass(!pass) }
  return (
    <div className='auth-shell'>
      <div className='auth-card'>
        <div className='relative overflow-hidden border-b border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_18rem),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(248,245,240,0.82))] p-6 dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_18rem),linear-gradient(180deg,_rgba(15,23,42,0.88),_rgba(2,6,23,0.92))] md:p-8 lg:border-b-0 lg:border-r flex flex-col justify-center'>
          <h1 className='page-title text-4xl md:text-5xl'>Ashoka Printing Operations</h1>
          <p className='page-copy max-w-lg'>
            Access the centralized system to manage orders, track billing, and monitor delivery schedules.
          </p>

          <div className='mt-8 grid gap-4 sm:grid-cols-2'>
            <div className='surface-card-muted p-4'>
              <ShieldCheck className='h-5 w-5 text-sky-600 dark:text-sky-300' />
              <p className='mt-3 text-sm font-semibold text-slate-900 dark:text-white'>Secure Access</p>
              <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>Verified credentials.</p>
            </div>
            <div className='surface-card-muted p-4'>
              <LockKeyhole className='h-5 w-5 text-amber-600 dark:text-amber-300' />
              <p className='mt-3 text-sm font-semibold text-slate-900 dark:text-white'>Order Management</p>
              <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>End-to-end job lifecycle.</p>
            </div>
          </div>
        </div>

        <form className='flex flex-col justify-center p-6 md:p-8' onSubmit={handleSubmit}>
          <div className='mb-8'>
            <p className='text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400'>Welcome Back</p>
            <h2 className='mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900 dark:text-white'>Sign in to continue</h2>
            <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>Enter your security credentials to access the portal.</p>
          </div>

          <label className='mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400'>Username</label>
          <input className='h-12 w-full rounded-2xl border border-white/70 bg-white/85 px-4 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:focus:ring-sky-500/10' type='text' autoComplete='username' placeholder='Enter your username' value={form.username} onChange={(e) => { setForm({ ...form, username: e.target.value }) }} required />

          <label className='mb-2 mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400'>Password</label>
          <div className='relative'>
            <input className='h-12 w-full rounded-2xl border border-white/70 bg-white/85 px-4 pr-12 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:focus:ring-sky-500/10' type={pass ? "text" : "password"} autoComplete='current-password' placeholder='Enter your password' value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }) }} required />
            <button type='button' onClick={handleClick} className='absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200'>
              {pass ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          </div>

          <button type='submit' disabled={loading} className='mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_18px_34px_-18px_rgba(8,47,73,0.8)] transition hover:-translate-y-0.5 disabled:translate-y-0'>
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className='h-4 w-4' />
          </button>
        </form>
      </div>
    </div>
  )
}

export default login
