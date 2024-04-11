import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username:String,
  password:String,
});

const Admin = mongoose.models.admins || mongoose.model('admins', adminSchema);

export default Admin;
