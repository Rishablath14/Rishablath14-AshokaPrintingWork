"use server"
import { database } from '@/lib/firebase';
import { ref, push, set, update, remove, get } from 'firebase/database';
import { requireAdminSession } from '@/lib/auth/session';
import {
    assertCustomerId,
    normalizeCustomerCollection,
    normalizeCustomerPayload,
    normalizeCustomerUpdate,
} from '@/lib/customer/data';


export const getAllCustomer = async()=>{
    await requireAdminSession();
    try {
        const customersRef = ref(database, 'customers');
        const snapshot = await get(customersRef);
        return snapshot.exists()
          ? normalizeCustomerCollection(snapshot.val())
          : [];
      } catch (error) {
        console.error("Failed to load customers", error);
        throw new Error("Failed to load customers");
      }
}
export const getCustomerById = async (id) => {
  await requireAdminSession();
  try {
    const customerId = assertCustomerId(id);
    const customerRef = ref(database, `customers/${customerId}`);
    const snapshot = await get(customerRef);
    return snapshot.exists()
      ? snapshot.val()
      : null;
  } catch (error) {
    console.error("Failed to load customer", error);
    throw new Error("Failed to load customer. Please try again later.");
  }
};
export const addCustomer = async (cust) => {
    await requireAdminSession();
    try {
        const customerData = normalizeCustomerPayload(cust);
        const customersRef = ref(database, 'customers');
        const newCustomerRef = push(customersRef);
        const customerWithId = { _id: newCustomerRef.key, ...customerData };
        await set(newCustomerRef, customerWithId);        
        return customerWithId;
      } catch (error) {
        console.error("Failed to add customer", error);
        throw new Error(error.message || "Failed to add customer");
      }
}
export const deleteCustomer = async (id) => {
    await requireAdminSession();
    try {
        const customerId = assertCustomerId(id);
        const customerRef = ref(database, `customers/${customerId}`);
        await remove(customerRef);        
        return true;
      } catch (error) {
        console.error("Failed to delete customer", error);
        throw new Error("Failed to delete customer");
      }
}
export const updateCustomer = async (id,data) => {
await requireAdminSession();
try {
    const customerId = assertCustomerId(id);
    const updates = normalizeCustomerUpdate(data);
    const customerRef = ref(database, `customers/${customerId}`);
    await update(customerRef, updates);
    return { _id: customerId, ...updates };
  } catch (e) {
    console.error("Failed to update customer", e);
    throw new Error(e.message || "Failed to update customer");
  }
}


