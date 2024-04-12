"use client"
import { createContext, useState, useEffect } from 'react';
import { addCustomer, deleteCustomer, getAllCustomer, updateCustomer } from '../actions/customer.action';

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [aggregateData, setAggregateData] = useState({totalSales: 0, totalCustomers: 0,totalBalance:0});

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await getAllCustomer();
      setCustomers(data);
    };
    fetchCustomers();
  }, []);
  
  const addCustomercont = async (customerData) => {
    const newCustomer = addCustomer(customerData);
    setCustomers([...customers, newCustomer]);
  };

  const getCustomercont = async (id) => {
    return customers.filter((cust)=>cust._id===id)
  };

  const updateCustomercont = async (id, updatedData) => {
    const data = await updateCustomer(updatedData);
    setCustomers(
      customers.map((customer) =>
        customer._id === id ? { ...customer, ...data } : customer
      )
    );
  };

  const deleteCustomercont = async (id) => {
    const del = await deleteCustomer(id);
    if(del){
        setCustomers(customers.filter((customer) => customer._id !== id));
    }
  };

  return (
    <CustomerContext.Provider
      value={{ customers,aggregateData,addCustomercont,getCustomercont,updateCustomercont, deleteCustomercont }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
