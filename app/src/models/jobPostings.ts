// models/jobPostingSchema.ts
import mongoose, { Document, Schema } from 'mongoose';

// Interface for requirements subdocument
interface IRequirements {
  cgpa_cutoff: number;
  skills: string[];
  backlogs: number;
}

// Interface for Job Posting document
export interface IJobPosting extends Document {
  company_name: string;
  company_logo?: string;
  role: string;
  short_description: string;
  package: string;
  eligible_students: string[];
  status: 'upcoming' | 'completed';
  application_deadline: Date;
  interview_date: Date;
  requirements: IRequirements;
  job_type: string;
  location: string;
  bond_period: string;
  created_at: Date;
  updated_at: Date;
}

// Requirements subdocument schema
const RequirementsSchema = new Schema<IRequirements>({
  cgpa_cutoff: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  skills: [{
    type: String,
    required: true
  }],
  backlogs: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

// Job Posting main schema
const JobPostingSchema = new Schema<IJobPosting>({
  company_name: {
    type: String,
    required: true,
    enum: ['TCS', 'Tech Mahindra', 'Wipro', 'Infosys', 'Accenture', 'Deloitte', 'Oracle', 'Cognizant']
  },
  company_logo: {
    type: String,
    default: null
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  short_description: {
    type: String,
    required: true,
    maxlength: 500
  },
  package: {
    type: String,
    required: true
  },
  eligible_students: [{
    type: String,
    required: true,
    enum: ['CSE', 'IT']
  }],
  status: {
    type: String,
    enum: ['upcoming', 'completed'],
    default: 'upcoming'
  },
  application_deadline: {
    type: Date,
    required: true
  },
  interview_date: {
    type: Date,
    required: true
  },
  requirements: {
    type: RequirementsSchema,
    required: true
  },
  job_type: {
    type: String,
    default: 'Full-time'
  },
  location: {
    type: String,
    required: true
  },
  bond_period: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at field before saving
JobPostingSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Create indexes for better query performance
JobPostingSchema.index({ company_name: 1 });
JobPostingSchema.index({ status: 1 });
JobPostingSchema.index({ eligible_students: 1 });
JobPostingSchema.index({ application_deadline: 1 });
JobPostingSchema.index({ created_at: -1 });

// Export the model
const JobPosting = mongoose.model<IJobPosting>('JobPosting', JobPostingSchema);
export default JobPosting;