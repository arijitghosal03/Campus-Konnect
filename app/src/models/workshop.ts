import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: "/api/placeholder/80/80"
  }
}, { _id: false });

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const workshopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  speaker: {
    type: speakerSchema,
    required: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  requirements: [{
    type: String,
    trim: true
  }],
  contact: {
    type: contactSchema,
    required: true
  },
  status: {
    type: String,
    default: 'upcoming',
    enum: ['upcoming', 'approved', 'ongoing', 'completed', 'cancelled', 'rejected']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1
  },
  targetAudience: {
    type: String,
    required: true,
    trim: true
  },
  submittedDate: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

workshopSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Workshop || mongoose.model('Workshop', workshopSchema);
