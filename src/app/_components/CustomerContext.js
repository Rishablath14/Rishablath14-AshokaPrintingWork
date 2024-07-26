"use client"
import { createContext, useState, useEffect } from 'react';
import { ref, onValue,onChildRemoved } from 'firebase/database';
import { database } from '@/lib/firebase';
import { addCustomer, deleteCustomer, getAllCustomer, updateCustomer } from '../actions/customer.action';

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  
  const fetchCustomers = async () => {
    const data = await getAllCustomer();
    setCustomers(data);
  };
  useEffect(() => {
    // fetchCustomers();
    const customersRef = ref(database, 'customers');
    const unsubscribe = onValue(customersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const customersList = Object.values(data);
        setCustomers(customersList);
      }
    });
    const unsubscribeOnChildRemoved = onChildRemoved(customersRef, (snapshot) => {
      const removedCustomerId = snapshot.key;
      setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer._id !== removedCustomerId));
    });

    return () => {unsubscribe();unsubscribeOnChildRemoved();}
  }, []);
  
  const addCustomercont = async (customerData) => {
    await addCustomer(customerData);
    // fetchCustomers();
  };

  const getCustomercont = async (id) => {
    return customers.filter((cust)=>cust._id===id)
  };

  const updateCustomercont = async (id, updatedData) => {
     await updateCustomer(id,updatedData);
    // fetchCustomers();
  };

  const deleteCustomercont = async (id) => {
    await deleteCustomer(id);
  };

  return (
    <CustomerContext.Provider
      value={{ customers,addCustomercont,getCustomercont,updateCustomercont, deleteCustomercont }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
