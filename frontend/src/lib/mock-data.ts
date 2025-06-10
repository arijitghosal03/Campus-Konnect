import { Test, Question, Company, Student, TestSession, MCQOption, CodingQuestion, TestCase } from './types';

// Mock Companies
export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    email: 'admin@techcorp.com',
    password: 'hashed_password',
    subscriptionPlan: 'enterprise',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'StartupXYZ',
    email: 'hr@startupxyz.com',
    password: 'hashed_password',
    subscriptionPlan: 'pro',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

// Mock Students
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@email.com',
    studentCode: 'STU001',
    collegeId: 'MIT2024',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@email.com',
    studentCode: 'STU002',
    collegeId: 'MIT2024',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

// Mock MCQ Options
export const mockMCQOptions: MCQOption[] = [
  // Question 1 options
  { id: '1', questionId: '1', optionText: 'O(1)', isCorrect: false, order: 1 },
  { id: '2', questionId: '1', optionText: 'O(log n)', isCorrect: false, order: 2 },
  { id: '3', questionId: '1', optionText: 'O(n)', isCorrect: true, order: 3 },
  { id: '4', questionId: '1', optionText: 'O(n²)', isCorrect: false, order: 4 },
  
  // Question 2 options
  { id: '5', questionId: '2', optionText: 'HyperText Markup Language', isCorrect: true, order: 1 },
  { id: '6', questionId: '2', optionText: 'High Tech Modern Language', isCorrect: false, order: 2 },
  { id: '7', questionId: '2', optionText: 'Home Tool Markup Language', isCorrect: false, order: 3 },
  { id: '8', questionId: '2', optionText: 'Hyperlink and Text Markup Language', isCorrect: false, order: 4 },
];

// Mock Test Cases
export const mockTestCases: TestCase[] = [
  {
    id: '1',
    codingQuestionId: '1',
    input: '5',
    expectedOutput: '120',
    isSample: true,
    points: 10,
    explanation: 'Factorial of 5 is 5*4*3*2*1 = 120',
  },
  {
    id: '2',
    codingQuestionId: '1',
    input: '0',
    expectedOutput: '1',
    isSample: true,
    points: 10,
    explanation: 'Factorial of 0 is defined as 1',
  },
  {
    id: '3',
    codingQuestionId: '1',
    input: '10',
    expectedOutput: '3628800',
    isSample: false,
    points: 20,
  },
];

// Mock Coding Questions
export const mockCodingQuestions: CodingQuestion[] = [
  {
    id: '1',
    questionId: '3',
    problemStatement: `Write a function to calculate the factorial of a given non-negative integer n.

The factorial of n (denoted as n!) is defined as:
- n! = n × (n-1) × (n-2) × ... × 2 × 1
- 0! = 1 (by definition)

Your function should handle edge cases and return the correct result.`,
    inputFormat: 'A single integer n (0 ≤ n ≤ 20)',
    outputFormat: 'Return the factorial of n as an integer',
    constraints: '0 ≤ n ≤ 20\nTime limit: 1 second\nMemory limit: 256 MB',
    timeLimit: 1,
    memoryLimit: 256,
    difficulty: 'easy',
    supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
    sampleTestCases: mockTestCases.filter(tc => tc.isSample),
    hiddenTestCases: mockTestCases.filter(tc => !tc.isSample),
  },
];

// Mock Questions
export const mockQuestions: Question[] = [
  {
    id: '1',
    testId: '1',
    type: 'mcq',
    questionText: 'What is the time complexity of linear search in an unsorted array?',
    difficulty: 'easy',
    marks: 2,
    timeLimit: 2,
    category: 'Data Structures',
    explanation: 'Linear search checks each element one by one, so in the worst case, it needs to check all n elements.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    mcqOptions: mockMCQOptions.filter(opt => opt.questionId === '1'),
  },
  {
    id: '2',
    testId: '1',
    type: 'mcq',
    questionText: 'What does HTML stand for?',
    difficulty: 'easy',
    marks: 1,
    timeLimit: 1,
    category: 'Web Development',
    explanation: 'HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    mcqOptions: mockMCQOptions.filter(opt => opt.questionId === '2'),
  },
  {
    id: '3',
    testId: '1',
    type: 'coding',
    questionText: 'Implement a function to calculate factorial',
    difficulty: 'medium',
    marks: 10,
    timeLimit: 30,
    category: 'Programming',
    explanation: 'This tests your ability to implement recursive or iterative solutions and handle edge cases.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    codingQuestion: mockCodingQuestions[0],
  },
];

// Mock Tests
export const mockTests: Test[] = [
  {
    id: '1',
    companyId: '1',
    title: 'Full Stack Developer Assessment',
    description: 'Comprehensive test covering data structures, algorithms, and web development concepts.',
    instructions: `Welcome to the Full Stack Developer Assessment.

**Instructions:**
1. This test contains 15 questions with a total duration of 90 minutes
2. The test includes both multiple choice and coding questions
3. You can navigate between questions using the sidebar
4. Your progress is automatically saved every 30 seconds
5. Ensure your webcam and microphone are enabled for proctoring
6. Do not switch tabs or minimize the browser window
7. Any suspicious activity will be flagged and may result in test termination

**Technical Requirements:**
- Stable internet connection
- Modern web browser (Chrome/Firefox/Safari)
- Webcam and microphone access
- Quiet environment for the duration of the test

**Scoring:**
- MCQ questions: 1-2 points each
- Coding questions: 5-15 points each
- Passing score: 70%

Good luck!`,
    duration: 90,
    totalQuestions: 3,
    passingScore: 70,
    maxAttempts: 1,
    startTime: new Date('2024-12-01T09:00:00Z'),
    endTime: new Date('2024-12-31T18:00:00Z'),
    isActive: true,
    proctorSettings: {
      enabled: true,
      strictMode: true,
      enableCamera: true,
      enableMicrophone: true,
      enableScreenShare: false,
      tabSwitchLimit: 3,
      allowTabSwitch: false,
      enableFaceDetection: true,
      enableAudioDetection: true,
      enableScreenshotCapture: true,
      screenshotInterval: 300,
      autoTerminateOnViolation: false,
      warningsBeforeTermination: 3,
    },
    scoringConfig: {
      enableNegativeMarking: true,
      negativeMarkingRatio: 0.25,
      partialScoring: true,
      timeBasedScoring: false,
      autoGrading: true,
      manualReview: false,
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    questions: mockQuestions,
  },
];

// Mock Test Sessions
export const mockTestSessions: TestSession[] = [
  {
    id: '1',
    testId: '1',
    studentId: '1',
    accessCode: 'TEST2024001',
    startTime: new Date('2024-12-01T10:00:00Z'),
    endTime: undefined,
    status: 'in_progress',
    totalScore: 0,
    maxScore: 13,
    proctorScore: 85,
    completionPercentage: 33,
    flaggedActivities: 1,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: new Date('2024-12-01T10:00:00Z'),
    updatedAt: new Date('2024-12-01T10:15:00Z'),
    answers: [],
    proctoringLogs: [],
  },
];

export function getMockData() {
  return {
    companies: mockCompanies,
    students: mockStudents,
    tests: mockTests,
    questions: mockQuestions,
    testSessions: mockTestSessions,
  };
}