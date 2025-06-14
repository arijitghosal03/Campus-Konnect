import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'college', 'company'], required: true },
    email: { type: String, required: true, unique: true },
    rollNo: { type: String, required: false, unique: true },
    staffCode: { type: String, required: false },
    companyCode: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
  });

  const User = mongoose.model('User', userSchema);
  export default User;