// // pages/api/student.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { getSession } from 'next-auth/react';
// import prisma from '../../lib/prisma';

// // Define types to match frontend data structure
// interface Subject {
//   name: string;
//   grade: string;
//   progress: number;
// }

// interface Achievement {
//   title: string;
//   date: string;
// }

// interface BlogPost {
//   id: number;
//   title: string;
//   content: string;
//   date: string;
//   likes: number;
//   comments: number;
// }

// interface StudentData {
//   id: string;
//   name: string;
//   roll: string;
//   semester: string;
//   department: string;
//   cgpa: string;
//   email: string;
//   attendance: string;
//   currentSubjects: Subject[];
//   achievements: Achievement[];
//   blogPosts: BlogPost[];
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   // Get auth session to verify user
//   const session = await getSession({ req });
  
//   if (!session) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   // Handle different HTTP methods
//   switch (req.method) {
//     case 'GET':
//       return getStudentData(req, res, session.user.id);
//     case 'POST':
//       return createBlogPost(req, res, session.user.id);
//     case 'PUT':
//       return updateStudentData(req, res, session.user.id);
//     default:
//       return res.status(405).json({ message: 'Method not allowed' });
//   }
// }

// // Handler for GET requests - Fetches student data
// async function getStudentData(
//   req: NextApiRequest, 
//   res: NextApiResponse,
//   userId: string
// ) {
//   try {
//     // Get student data from database
//     const student = await prisma.student.findFirst({
//       where: {
//         userId: userId,
//       },
//       include: {
//         user: {
//           select: {
//             email: true,
//           },
//         },
//       },
//     });

//     if (!student) {
//       return res.status(404).json({ message: 'Student profile not found' });
//     }

//     // Get student subjects
//     const subjects = await prisma.subject.findMany({
//       where: {
//         studentId: student.id,
//       },
//     });

//     // Get student achievements
//     const achievements = await prisma.achievement.findMany({
//       where: {
//         studentId: student.id,
//       },
//       orderBy: {
//         date: 'desc',
//       },
//     });

//     // Get student blog posts
//     const blogPosts = await prisma.blog.findMany({
//       where: {
//         studentId: student.id,
//       },
//       orderBy: {
//         publishedAt: 'desc',
//       },
//       select: {
//         id: true,
//         title: true,
//         content: true,
//         publishedAt: true,
//         likes: true,
//         comments: {
//           select: {
//             id: true,
//           },
//         },
//       },
//     });

//     // Format data to match frontend structure
//     const formattedData: StudentData = {
//       id: student.enrollmentNumber,
//       name: `${student.firstName} ${student.lastName}`,
//       roll: student.enrollmentNumber,
//       semester: `${student.yearOfStudy * 2}th`,
//       department: student.department,
//       cgpa: student.cgpa.toString(),
//       email: student.user.email,
//       attendance: `${student.attendancePercentage || 0}%`,
//       currentSubjects: subjects.map((subject: { name: any; grade: any; progressPercentage: any; }) => ({
//         name: subject.name,
//         grade: subject.grade || 'N/A',
//         progress: subject.progressPercentage || 0,
//       })),
//       achievements: achievements.map((achievement: { title: any; date: { toISOString: () => string; }; }) => ({
//         title: achievement.title,
//         date: achievement.date.toISOString().split('T')[0],
//       })),
//       blogPosts: blogPosts.map((post: { id: any; title: any; content: any; publishedAt: { toISOString: () => string; }; likes: any; comments: string | any[]; }) => ({
//         id: post.id,
//         title: post.title,
//         content: post.content,
//         date: post.publishedAt.toISOString().split('T')[0],
//         likes: post.likes || 0,
//         comments: post.comments.length,
//       })),
//     };

//     return res.status(200).json(formattedData);
//   } catch (error) {
//     console.error('Error fetching student data:', error);
//     return res.status(500).json({ message: 'Error fetching student data', error });
//   }
// }

// // Handler for POST requests - Creates a new blog post
// async function createBlogPost(
//   req: NextApiRequest, 
//   res: NextApiResponse,
//   userId: string
// ) {
//   try {
//     const { title, content } = req.body;

//     if (!title || !content) {
//       return res.status(400).json({ message: 'Title and content are required' });
//     }

//     // Get student ID
//     const student = await prisma.student.findFirst({
//       where: {
//         userId: userId,
//       },
//     });

//     if (!student) {
//       return res.status(404).json({ message: 'Student profile not found' });
//     }

//     // Create new blog post
//     const newPost = await prisma.blog.create({
//       data: {
//         studentId: student.id,
//         title,
//         content,
//         publishedAt: new Date(),
//         isPublic: true,
//         isApproved: false, // Requires approval based on your workflow
//         likes: 0,
//       },
//     });

//     // Return formatted post
//     const formattedPost = {
//       id: newPost.id,
//       title: newPost.title,
//       content: newPost.content,
//       date: newPost.publishedAt.toISOString().split('T')[0],
//       likes: 0,
//       comments: 0,
//     };

//     return res.status(201).json(formattedPost);
//   } catch (error) {
//     console.error('Error creating blog post:', error);
//     return res.status(500).json({ message: 'Error creating blog post', error });
//   }
// }

// // Handler for PUT requests - Updates student data
// async function updateStudentData(
//   req: NextApiRequest, 
//   res: NextApiResponse,
//   userId: string
// ) {
//   try {
//     const { type, data } = req.body;

//     if (!type || !data) {
//       return res.status(400).json({ message: 'Type and data are required' });
//     }

//     // Get student ID
//     const student = await prisma.student.findFirst({
//       where: {
//         userId: userId,
//       },
//     });

//     if (!student) {
//       return res.status(404).json({ message: 'Student profile not found' });
//     }

//     // Handle different update types
//     switch (type) {
//       case 'profile':
//         // Update student profile
//         const updatedStudent = await prisma.student.update({
//           where: {
//             id: student.id,
//           },
//           data: {
//             firstName: data.firstName,
//             lastName: data.lastName,
//             // Other fields to update
//           },
//         });
//         return res.status(200).json({ message: 'Profile updated successfully' });

//       case 'like-post':
//         // Increment likes on a blog post
//         const updatedPost = await prisma.blog.update({
//           where: {
//             id: data.postId,
//           },
//           data: {
//             likes: {
//               increment: 1,
//             },
//           },
//         });
//         return res.status(200).json({ likes: updatedPost.likes });

//       default:
//         return res.status(400).json({ message: 'Invalid update type' });
//     }
//   } catch (error) {
//     console.error('Error updating student data:', error);
//     return res.status(500).json({ message: 'Error updating student data', error });
//   }
// }