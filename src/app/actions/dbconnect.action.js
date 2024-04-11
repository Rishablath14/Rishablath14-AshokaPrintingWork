"use server"

import dbConnect from "../utils/dbConnect"

export const connect = async ()=>{
try{
    await dbConnect();
    return true;
}
catch(e){
console.log(e);
}
}