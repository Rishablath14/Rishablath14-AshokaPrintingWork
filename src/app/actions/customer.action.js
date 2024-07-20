"use server"
import { connect } from '@/app/actions/dbconnect.action';
import Customers from '@/app/utils/userSchema';
import { revalidatePath } from 'next/cache';


export const getAllCustomer = async()=>{
    await connect();
    const customer = await Customers.find();
    if(!customer) return null;
    const data = JSON.parse(JSON.stringify(customer))
    return data;
}
export const addCustomer = async (cust) => {
    try{
        await connect();
        const customer = new Customers(cust);
        const save = await customer.save();
        const data = JSON.parse(JSON.stringify(save));
        revalidatePath("/");
        revalidatePath("/customers");
        return data;
        }
        catch(e){
            console.log("error",e);
            return false
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
    if(customer.modifiedCount>0) {
        const data = {_id:id,...rest}
        return data;
    }
    else return null
}
catch(e){
    console.log("error",e);
}
}





