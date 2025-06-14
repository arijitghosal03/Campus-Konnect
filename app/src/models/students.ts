import { Schema, model, Document } from 'mongoose';

// Interface for Post subdocument
interface IPost {
  title: string;
  content: string;
  date: Date;
  description: string;
}

// Interface for Certificate subdocument
interface ICertificate {
  title: string;
  description: string;
  issue_date: Date;
  credential_id: string;
}

// Interface for Internship subdocument
interface IInternship {
  title: string;
  description: string;
  date: Date;
}

// Main Student interface
export interface IStudent extends Document {
  name: string;
  roll_number: string;
  college: string;
  degree: string;
  stream: string;
  semester: number;
  enrollment_year: number;
  passout_year: number;
  subjects: string[];
  backlogs: number;
  average_cgpa: number;
  status: 'Active' | 'Passout' | 'Dropout' | 'On Hold';
  total_marks: number;
  pending_fees: number;
  attendance: number;
  dob: Date;
  mobile: string;
  email: string;
  city: string;
  gender: 'Male' | 'Female' | 'Other';
  profile_image?: string;
  resume: string[];
  skills: string[];
  projects: string[];
  posts: IPost[];
  certificates: ICertificate[];
  internships: IInternship[];
  readonly age?: number; // Virtual property for age
}

// Post Schema
const PostSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: true });

// Certificate Schema
const CertificateSchema = new Schema<ICertificate>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  issue_date: {
    type: Date,
    required: true
  },
  credential_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { _id: true });

// Internship Schema
const InternshipSchema = new Schema<IInternship>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { _id: true });

// Main Student Schema
const StudentSchema = new Schema<IStudent>({
  name: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  roll_number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  college: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  stream: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  enrollment_year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear()
  },
  passout_year: {
    type: Number,
    required: true,
    min: 1900,
    validate: {
      validator: function(this: IStudent, value: number) {
        return value >= this.enrollment_year;
      },
      message: 'Passout year must be greater than or equal to enrollment year'
    }
  },
  subjects: [{
    type: String,
    trim: true
  }],
  backlogs: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  average_cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    set: (value: number) => Math.round(value * 100) / 100 // Round to 2 decimal places
  },
  status: {
    type: String,
    enum: ['Active', 'Passout', 'Dropout', 'On Hold'],
    required: true,
    default: 'Active'
  },
  total_marks: {
    type: Number,
    required: true,
    min: 0
  },
  pending_fees: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  attendance: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  dob: {
    type: Date,
    required: true,
    validate: {
      validator: function(value: Date) {
        return value < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(value: string) {
        return /^[\d\-\+\(\)\s]+$/.test(value);
      },
      message: 'Please enter a valid mobile number'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Please enter a valid email address'
    }
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  profile_image: {
    type: String,
    trim: true,
    validate: {
      validator: function(value: string) {
        if (!value) return true; // Optional field
        return /^https?:\/\//.test(value);
      },
      message: 'Profile image must be a valid URL'
    }
  },
  resume: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  projects: [{
    type: String,
    trim: true
  }],
  posts: [PostSchema],
  certificates: [CertificateSchema],
  internships: [InternshipSchema]
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
StudentSchema.index({ roll_number: 1 });
StudentSchema.index({ email: 1 });
StudentSchema.index({ status: 1 });
StudentSchema.index({ college: 1, stream: 1 });
StudentSchema.index({ enrollment_year: 1, passout_year: 1 });

// Virtual for age calculation
StudentSchema.virtual('age').get(function(this: IStudent) {
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for full name formatting
StudentSchema.virtual('displayName').get(function(this: IStudent) {
  return this.name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
});

// Pre-save middleware to ensure data consistency
StudentSchema.pre('save', function(this: IStudent, next) {
  // Ensure passout year is reasonable for the degree
  if (this.passout_year < this.enrollment_year) {
    next(new Error('Passout year cannot be before enrollment year'));
  }
  
  // Ensure CGPA is within valid range
  if (this.average_cgpa < 0 || this.average_cgpa > 10) {
    next(new Error('CGPA must be between 0 and 10'));
  }
  
  next();
});

// Static methods
StudentSchema.statics.findByRollNumber = function(rollNumber: string) {
  return this.findOne({ roll_number: rollNumber });
};

StudentSchema.statics.findByCollege = function(college: string) {
  return this.find({ college: college });
};

StudentSchema.statics.findActiveStudents = function() {
  return this.find({ status: 'Active' });
};

// Instance methods
StudentSchema.methods.getFullProfile = function(this: IStudent) {
  return {
    personalInfo: {
      name: this.name.toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase()),
      roll_number: this.roll_number,
      email: this.email,
      mobile: this.mobile,
      dob: this.dob,
      age: this.age,
      gender: this.gender,
      city: this.city
    },
    academicInfo: {
      college: this.college,
      degree: this.degree,
      stream: this.stream,
      semester: this.semester,
      enrollment_year: this.enrollment_year,
      passout_year: this.passout_year,
      status: this.status,
      average_cgpa: this.average_cgpa,
      backlogs: this.backlogs,
      attendance: this.attendance
    },
    achievements: {
      skills: this.skills,
      projects: this.projects,
      certificates: this.certificates,
      internships: this.internships
    }
  };
};

export const Student = model<IStudent>('Student', StudentSchema);

export { StudentSchema };