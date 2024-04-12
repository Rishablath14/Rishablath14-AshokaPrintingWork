import { Toaster } from "@/components/ui/sonner"
import { Lato } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "./_components/themeProvider";
import Header from "./_components/header";
import { CustomerProvider } from "./_components/CustomerContext";

const lato = Lato({ subsets: ["latin"],weight:['100','300','400','700','900'] ,variable:"--font-lato",});

export const metadata = {
  title: "APW DASHBOARD",
  description: "APW Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased font-lato",lato.variable)}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
      <CustomerProvider>
      <Header/>
      <main className="pt-16">
      {children}
      </main>
      <Toaster richColors position="top-right"/>
      </CustomerProvider>      
      </ThemeProvider>  
      </body>
    </html>
  );
}
