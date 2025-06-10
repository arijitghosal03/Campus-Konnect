import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    industry: { type: String },
    hrName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    address: { type: String },
    jobPostings: [{
      title: String,
      description: String,
      requirements: [String],
      salary: String,
      location: String,
      type: { type: String, enum: ['full-time', 'part-time', 'internship'] },
      postedDate: { type: Date, default: Date.now },
      deadline: Date,
      isActive: { type: Boolean, default: true }
    }],
    appliedStudents: [{
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' },
      jobId: String,
      appliedDate: { type: Date, default: Date.now },
      status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'selected'], default: 'applied' }
    }],
    createdAt: { type: Date, default: Date.now }
  });


  const Company = mongoose.model('Company', companySchema);
  export default Company;