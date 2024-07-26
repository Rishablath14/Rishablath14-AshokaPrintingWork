"use server"
import { connect } from '@/app/actions/dbconnect.action';
import { database } from '@/lib/firebase';
import { ref, push, set,update,remove,get } from 'firebase/database';
import Customers from '@/app/utils/userSchema';
import { revalidatePath } from 'next/cache';


export const getAllCustomer = async()=>{
    // await connect();
    // const customer = await Customers.find();
    // if(!customer) return null;
    // const data = JSON.parse(JSON.stringify(customer));
    // revalidatePath("/");
    // return data;
    try {
        const customersRef = ref(database, 'customers');
        const snapshot = await get(customersRef);
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return null;
        }
      } catch (error) {
        return null;
      }
}
export const addCustomer = async (cust) => {
    try {
        const customersRef = ref(database, 'customers');
        const newCustomerRef = push(customersRef);
        const customerWithId = { _id: newCustomerRef.key, ...cust };
        await set(newCustomerRef, customerWithId);        
        return customerWithId;
      } catch (error) {
        return null;
      }
    // try{
    //     await connect();
    //     const customer = new Customers(cust);
    //     const save = await customer.save();
    //     const data = JSON.parse(JSON.stringify(save));
    //     return data;
    //     }
    //     catch(e){
    //         console.log("error",e);
    //         return false
    //     }
}
export const deleteCustomer = async (id) => {
    // try{
    //     await connect();
    //     const customer = await Customers.deleteOne({_id:id});
    //     if(customer.deletedCount>0) return true
    //     else return false
    // }
    // catch(e){
    //     console.log("error",e);
    // }
    try {
        const customerRef = ref(database, `customers/${id}`);
        await remove(customerRef);        
        return true;
      } catch (error) {
        return false;
      }
}
export const updateCustomer = async (id,data) => {

//     try{
//     await connect();
//     const customer = await Customers.updateOne(
//       { _id:id},
//       { $set: {...rest} }
//     );
//     if(customer.modifiedCount>0) {
//         const data = {_id:id,...rest}
//         return data;
//     }
//     else return null
// }
// catch(e){
//     console.log("error",e);
// }
try {
    const customerRef = ref(database, `customers/${id}`);
    await update(customerRef, data);
    const snapshot = await get(customerRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
  } catch (e) {
    console.log("error",e);
    return null;
  }
}





