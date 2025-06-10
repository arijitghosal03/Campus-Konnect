import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String },
    department: { type: String, required: true },
    semester: { type: String, required: true },
    year: { type: String },
    cgpa: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
    contactInformation: { type: String },
    currentSubjects: [{
      name: String,
      grade: String,
      progress: Number,
      credits: Number
    }],
    achievements: [{
      title: String,
      date: Date,
      description: String
    }],
    blogPosts: [{
      title: String,
      content: String,
      date: { type: Date, default: Date.now },
      likes: { type: Number, default: 0 },
      comments: [{ 
        text: String, 
        date: { type: Date, default: Date.now },
        author: String 
      }]
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

  export default StudentProfile;