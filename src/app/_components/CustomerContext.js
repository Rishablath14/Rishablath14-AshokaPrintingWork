"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { getAllCustomer } from "../actions/customer.action";

export const CustomerContext = createContext();

const hasSameCustomers = (currentCustomers, nextCustomers) =>
  JSON.stringify(currentCustomers) === JSON.stringify(nextCustomers);

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);

  const refreshCustomers = useCallback(async () => {
    try {
      const nextCustomers = await getAllCustomer();
      const normalizedCustomers = Array.isArray(nextCustomers) ? nextCustomers : [];
      setCustomers((currentCustomers) =>
        hasSameCustomers(currentCustomers, normalizedCustomers) ? currentCustomers : normalizedCustomers,
      );
    } catch (error) {
      console.error("Failed to refresh customers", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCustomers = async () => {
      if (!isMounted) {
        return;
      }

      await refreshCustomers();
    };

    loadCustomers();
    const intervalId = window.setInterval(loadCustomers, 60 * 1000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [refreshCustomers]);

  return <CustomerContext.Provider value={{ customers, refreshCustomers }}>{children}</CustomerContext.Provider>;
};
