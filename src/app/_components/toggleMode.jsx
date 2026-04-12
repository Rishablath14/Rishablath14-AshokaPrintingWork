"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {toast} from 'sonner'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  const pathname = usePathname();
  const { setTheme } = useTheme()
  const router = useRouter();
  const logout = async () => {
    try {
        await axios.delete('/api/admin')
        toast.success('Logout successful')
        router.replace('/login')
        router.refresh()
    } catch (error) {
        console.log(error.message);
        toast.error(error.message)
    }
}
  return (
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative overflow-hidden">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-2xl border-white/70 bg-white/90 p-2 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className={cn("font-semibold text-red-600 focus:bg-red-50 dark:text-red-300 dark:focus:bg-red-500/10",pathname==='/login'?"hidden":"")}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
