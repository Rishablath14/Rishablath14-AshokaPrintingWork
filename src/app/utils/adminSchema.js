import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    select: false,
  },
  password: {
    type: String,
    select: false,
  },
}, {
  timestamps: true,
});

const Admin = mongoose.models.admins || mongoose.model('admins', adminSchema);

export default Admin;
