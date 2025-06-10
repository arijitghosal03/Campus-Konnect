// Database Models and Types

export interface Company {
  id: string;
  name: string;
  email: string;
  password: string;
  subscriptionPlan: 'basic' | 'pro' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentCode: string;
  collegeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Test {
  id: string;
  companyId: string;
  title: string;
  description: string;
  instructions: string;
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number;
  maxAttempts: number;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  proctorSettings: ProctoringSettings;
  scoringConfig: ScoringConfig;
  createdAt: Date;
  updatedAt: Date;
  questions: Question[];
}

export interface Question {
  id: string;
  testId: string;
  type: 'mcq' | 'coding' | 'subjective';
  questionText: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  timeLimit?: number; // per question time limit in minutes
  category: string;
  explanation?: string;
  createdAt: Date;
  updatedAt: Date;
  mcqOptions?: MCQOption[];
  codingQuestion?: CodingQuestion;
}

export interface MCQOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  order: number;
}

export interface CodingQuestion {
  id: string;
  questionId: string;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  timeLimit: number; // in seconds
  memoryLimit: number; // in MB
  difficulty: 'easy' | 'medium' | 'hard';
  supportedLanguages: string[];
  sampleTestCases: TestCase[];
  hiddenTestCases: TestCase[];
}

export interface TestCase {
  id: string;
  codingQuestionId: string;
  input: string;
  expectedOutput: string;
  isSample: boolean;
  points: number;
  explanation?: string;
}

export interface TestSession {
  id: string;
  testId: string;
  studentId: string;
  accessCode: string;
  startTime: Date;
  endTime?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'terminated' | 'expired';
  totalScore: number;
  maxScore: number;
  proctorScore: number;
  completionPercentage: number;
  flaggedActivities: number;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
  answers: StudentAnswer[];
  proctoringLogs: ProctoringLog[];
}

export interface StudentAnswer {
  id: string;
  sessionId: string;
  questionId: string;
  answerType: 'mcq' | 'code' | 'text';
  mcqSelection?: string[]; // For multiple choice
  codeSubmission?: CodeSubmission;
  textAnswer?: string;
  timeSpent: number; // in seconds
  isFlagged: boolean;
  flagReason?: string;
  submittedAt: Date;
  score: number;
  maxScore: number;
}

export interface CodeSubmission {
  language: string;
  code: string;
  executionTime: number;
  memoryUsed: number;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compilation_error';
  testCaseResults: TestCaseResult[];
  totalTestCases: number;
  passedTestCases: number;
}

export interface TestCaseResult {
  testCaseId: string;
  status: 'passed' | 'failed' | 'error';
  actualOutput?: string;
  executionTime: number;
  memoryUsed: number;
  points: number;
}

export interface ProctoringLog {
  id: string;
  sessionId: string;
  eventType: 'tab_switch' | 'window_focus_lost' | 'suspicious_activity' | 'multiple_faces' | 'no_face_detected' | 'audio_detected' | 'screenshot' | 'violation';
  timestamp: Date;
  description: string;
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  videoTimestamp?: number;
  metadata?: Record<string, any>;
  autoAction?: 'warning' | 'terminate' | 'flag';
}

export interface ProctoringSettings {
  enabled: boolean;
  strictMode: boolean;
  enableCamera: boolean;
  enableMicrophone: boolean;
  enableScreenShare: boolean;
  tabSwitchLimit: number;
  allowTabSwitch: boolean;
  enableFaceDetection: boolean;
  enableAudioDetection: boolean;
  enableScreenshotCapture: boolean;
  screenshotInterval: number; // in seconds
  autoTerminateOnViolation: boolean;
  warningsBeforeTermination: number;
}

export interface ScoringConfig {
  enableNegativeMarking: boolean;
  negativeMarkingRatio: number; // e.g., 0.25 for -0.25 for wrong answer
  partialScoring: boolean;
  timeBasedScoring: boolean;
  autoGrading: boolean;
  manualReview: boolean;
}

export interface EmailTemplate {
  id: string;
  type: 'invitation' | 'reminder' | 'result' | 'violation' | 'certificate';
  subject: string;
  htmlContent: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestAnalytics {
  testId: string;
  totalParticipants: number;
  completedParticipants: number;
  averageScore: number;
  averageTimeSpent: number;
  passRate: number;
  questionAnalytics: QuestionAnalytics[];
  performanceDistribution: PerformanceDistribution[];
  proctoringViolations: ViolationSummary[];
}

export interface QuestionAnalytics {
  questionId: string;
  totalAttempts: number;
  correctAttempts: number;
  averageTime: number;
  difficultyRating: number;
  skipRate: number;
}

export interface PerformanceDistribution {
  scoreRange: string;
  count: number;
  percentage: number;
}

export interface ViolationSummary {
  type: string;
  count: number;
  percentage: number;
}

// Frontend State Types
export interface ExamState {
  currentQuestionIndex: number;
  answers: Record<string, any>;
  timeRemaining: number;
  isFullscreen: boolean;
  proctoringEnabled: boolean;
  warnings: string[];
  flaggedQuestions: Set<string>;
  reviewMode: boolean;
}

export interface ProctoringState {
  cameraActive: boolean;
  microphoneActive: boolean;
  tabSwitches: number;
  violations: ProctoringLog[];
  suspiciousActivity: boolean;
  faceDetected: boolean;
  audioDetected: boolean;
}

export interface AdminDashboardStats {
  totalTests: number;
  activeTests: number;
  totalParticipants: number;
  averageScore: number;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  type: 'test_created' | 'test_started' | 'test_completed' | 'violation_detected';
  description: string;
  timestamp: Date;
  userId: string;
  metadata?: Record<string, any>;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Utility Types
export type UserRole = 'admin' | 'student' | 'proctor';
export type TestStatus = 'draft' | 'published' | 'active' | 'completed' | 'archived';
export type QuestionType = 'mcq' | 'coding' | 'subjective';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type ProgrammingLanguage = 'javascript' | 'python' | 'java' | 'cpp' | 'c' | 'csharp' | 'go' | 'rust';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  permissions: string[];
}