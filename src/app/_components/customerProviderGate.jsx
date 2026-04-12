"use client";

import { usePathname } from "next/navigation";
import { CustomerProvider } from "./CustomerContext";

export default function CustomerProviderGate({ children }) {
  const pathname = usePathname();
  const needsCustomerStream = pathname === "/" || pathname === "/customers";

  if (!needsCustomerStream) {
    return children;
  }

  return <CustomerProvider>{children}</CustomerProvider>;
}
