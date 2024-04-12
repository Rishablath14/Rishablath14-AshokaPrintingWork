"use server"
import { connect } from '@/app/actions/dbconnect.action';
import Customers from '@/app/utils/userSchema';
import { revalidatePath } from 'next/cache'


export const getOneCustomer = async (id) => {
    await connect();
    const customer = await Customers.findById(id);
    if(!customer) return null;
    const data = JSON.parse(JSON.stringify(customer))
    return data;
}
export const getAllCustomer = async () => {
    await connect();
    const customer = await Customers.find();
    if(!customer) return null;
    const data = JSON.parse(JSON.stringify(customer))
    return data;
}
export const addCustomer = async (data) => {
    try{
            await connect();
            const customer = new Customers(data);
            const savedCust = await customer.save();
            revalidatePath("/");
            revalidatePath("/customers");
            if(savedCust) return true
            else return false
        }
        catch(e){
            console.log("error",e);
        }
}
export const deleteCustomer = async (id) => {
    try{
        await connect();
        const customer = await Customers.deleteOne({_id:id});
        revalidatePath("/");
        revalidatePath("/customers");
        if(customer.deletedCount>0) return true
        else return false
    }
    catch(e){
        console.log("error",e);
    }
}
export const updateCustomer = async (data) => {
    const {id,...rest} = data;
    try{
    await connect();
    const customer = await Customers.updateOne(
      { _id:id},
      { $set: {...rest} }
    );
    revalidatePath("/");
    revalidatePath("/customers");
    if(customer.modifiedCount>0) return true
    else return false
}
catch(e){
    console.log("error",e);
}
}
export const totalRevenue = async () => {
    await connect();
    const customer = await Customers.find();
    let amount = 0;
    if(customer){customer.map((cus)=>amount+=cus.totalAmount);return amount}
    else return 0
}
export const totalCustomer = async () => {
    await connect();
    const customer = await Customers.find();
    if(customer) return customer.length;
    else return 0
}
export const totalBalance = async () => {
    await connect();
    const customer = await Customers.find();
    let balance = 0;
    if(customer){customer.map((cus)=>balance+=cus.balance);return balance}
    else return 0
}
export const getCustomerProgress = async () => {
    await connect();
    const customer = await Customers.find();
    if(!customer) return null;
    const data = JSON.parse(JSON.stringify(customer))
    revalidatePath("/");
    revalidatePath("/customers");
    const customers = data.filter(
        (customer) => customer.isCompleted === 'progress'
      );
    return customers;
}




