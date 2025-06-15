// routes/jobPostingRoutes.ts
import { Request, Response } from 'express';
import JobPosting, { IJobPosting } from './models/jobPostings';

// Custom Request interface for authenticated requests
interface CustomRequest extends Request {
  user?: any;
}

// GET /api/job-postings - Get all job postings with optional filters
export const getAllJobPostings = async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      company_name, 
      eligible_students, 
      page = 1, 
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    // Build filter object
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (company_name) {
      filter.company_name = { $regex: company_name, $options: 'i' };
    }
    
    if (eligible_students) {
      filter.eligible_students = { $in: [eligible_students] };
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Build sort object
    const sortObj: any = {};
    sortObj[sort_by as string] = sort_order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const jobPostings = await JobPosting.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get total count for pagination
    const totalCount = await JobPosting.countDocuments(filter);
    
    // Calculate metadata
    const totalPages = Math.ceil(totalCount / Number(limit));
    const hasNextPage = Number(page) < totalPages;
    const hasPrevPage = Number(page) > 1;

    res.status(200).json({
      success: true,
      data: jobPostings,
      metadata: {
        total_count: totalCount,
        current_page: Number(page),
        total_pages: totalPages,
        limit: Number(limit),
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage,
        upcoming_count: await JobPosting.countDocuments({ ...filter, status: 'upcoming' }),
        completed_count: await JobPosting.countDocuments({ ...filter, status: 'completed' })
      }
    });
  } catch (error: any) {
    console.error('Error fetching job postings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job postings',
      error: error.message
    });
  }
};

// GET /api/job-postings/:id - Get single job posting by ID
export const getJobPostingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const jobPosting = await JobPosting.findById(id).lean();
    
    if (!jobPosting) {
      res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: jobPosting
    });
  } catch (error: any) {
    console.error('Error fetching job posting:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job posting',
      error: error.message
    });
  }
};

// POST /api/job-postings - Create new job posting (College/Company only)
export const createJobPosting = async (req: CustomRequest, res: Response) => {
  try {
    const jobPostingData = req.body;
    
    // Validate required fields
    const requiredFields = [
      'company_name', 'role', 'short_description', 'package',
      'eligible_students', 'application_deadline', 'interview_date',
      'requirements', 'location', 'bond_period'
    ];
    
    const missingFields = requiredFields.filter(field => !jobPostingData[field]);
    
    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missing_fields: missingFields
      });
      return;
    }

    // Validate dates
    const applicationDeadline = new Date(jobPostingData.application_deadline);
    const interviewDate = new Date(jobPostingData.interview_date);
    const currentDate = new Date();
    
    if (applicationDeadline <= currentDate) {
      res.status(400).json({
        success: false,
        message: 'Application deadline must be in the future'
      });
      return;
    }
    
    if (interviewDate <= applicationDeadline) {
      res.status(400).json({
        success: false,
        message: 'Interview date must be after application deadline'
      });
      return;
    }

    // Create new job posting
    const newJobPosting = new JobPosting(jobPostingData);
    const savedJobPosting = await newJobPosting.save();

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: savedJobPosting
    });
  } catch (error: any) {
    console.error('Error creating job posting:', error);
    
    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message)
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating job posting',
      error: error.message
    });
  }
};

// PUT /api/job-postings/:id - Update job posting (College/Company only)
export const updateJobPosting = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.created_at;
    
    // Update the updated_at field
    updateData.updated_at = new Date();
    
    const updatedJobPosting = await JobPosting.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();
    
    if (!updatedJobPosting) {
      res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully',
      data: updatedJobPosting
    });
  } catch (error: any) {
    console.error('Error updating job posting:', error);
    
    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message)
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating job posting',
      error: error.message
    });
  }
};

// DELETE /api/job-postings/:id - Delete job posting (College only)
export const deleteJobPosting = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const deletedJobPosting = await JobPosting.findByIdAndDelete(id);
    
    if (!deletedJobPosting) {
      res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully',
      data: deletedJobPosting
    });
  } catch (error: any) {
    console.error('Error deleting job posting:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting job posting',
      error: error.message
    });
  }
};

// GET /api/job-postings/companies/:companyName - Get job postings by company
export const getJobPostingsByCompany = async (req: Request, res: Response) => {
  try {
    const { companyName } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter: any = { 
      company_name: { $regex: companyName, $options: 'i' }
    };
    
    if (status) {
      filter.status = status;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const jobPostings = await JobPosting.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    
    const totalCount = await JobPosting.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: jobPostings,
      metadata: {
        total_count: totalCount,
        current_page: Number(page),
        total_pages: Math.ceil(totalCount / Number(limit)),
        company_name: companyName
      }
    });
  } catch (error: any) {
    console.error('Error fetching company job postings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching company job postings',
      error: error.message
    });
  }
};

// GET /api/job-postings/eligible/:branch - Get job postings eligible for specific branch
export const getEligibleJobPostings = async (req: Request, res: Response) => {
  try {
    const { branch } = req.params;
    const { status = 'upcoming', page = 1, limit = 10 } = req.query;
    
    const filter: any = {
      eligible_students: { $in: [branch.toUpperCase()] },
      status
    };
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const jobPostings = await JobPosting.find(filter)
      .sort({ application_deadline: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    
    const totalCount = await JobPosting.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: jobPostings,
      metadata: {
        total_count: totalCount,
        current_page: Number(page),
        total_pages: Math.ceil(totalCount / Number(limit)),
        branch: branch.toUpperCase(),
        status
      }
    });
  } catch (error: any) {
    console.error('Error fetching eligible job postings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching eligible job postings',
      error: error.message
    });
  }
};

// GET /api/job-postings/stats - Get job posting statistics
export const getJobPostingStats = async (req: Request, res: Response) => {
  try {
    const totalCount = await JobPosting.countDocuments();
    const upcomingCount = await JobPosting.countDocuments({ status: 'upcoming' });
    const completedCount = await JobPosting.countDocuments({ status: 'completed' });
    
    // Company-wise count
    const companyStats = await JobPosting.aggregate([
      {
        $group: {
          _id: '$company_name',
          count: { $sum: 1 },
          upcoming: {
            $sum: {
              $cond: [{ $eq: ['$status', 'upcoming'] }, 1, 0]
            }
          },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    // Branch-wise eligibility stats
    const branchStats = await JobPosting.aggregate([
      {
        $unwind: '$eligible_students'
      },
      {
        $group: {
          _id: '$eligible_students',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        total_postings: totalCount,
        upcoming_postings: upcomingCount,
        completed_postings: completedCount,
        company_wise_stats: companyStats,
        branch_wise_stats: branchStats,
        last_updated: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error fetching job posting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: error.message
    });
  }
};