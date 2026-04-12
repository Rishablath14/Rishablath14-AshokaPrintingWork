import { Toaster } from "@/components/ui/sonner"
import { Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "./_components/themeProvider";
import Header from "./_components/header";
import CustomerProviderGate from "./_components/customerProviderGate";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "APW DASHBOARD",
  description: "APW Dashboard",
  icons:['asp_logo.webp'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={cn("antialiased", manrope.variable)}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
      <CustomerProviderGate>
      <Header/>
      <main className="relative z-10 pt-4 md:pt-6">
      {children}
      </main>
      <Toaster richColors position="top-right"/>
      </CustomerProviderGate>      
      </ThemeProvider>  
      </body>
    </html>
  );
}
