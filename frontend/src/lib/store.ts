import { create } from 'zustand';
import { ExamState, ProctoringState, AuthUser, Test, TestSession } from './types';

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

interface ExamStore extends ExamState {
  test: Test | null;
  session: TestSession | null;
  setTest: (test: Test) => void;
  setSession: (session: TestSession) => void;
  setCurrentQuestion: (index: number) => void;
  updateAnswer: (questionId: string, answer: any) => void;
  setTimeRemaining: (time: number) => void;
  toggleFullscreen: () => void;
  addWarning: (warning: string) => void;
  toggleQuestionFlag: (questionId: string) => void;
  setReviewMode: (enabled: boolean) => void;
  resetExam: () => void;
}

interface ProctoringStore extends ProctoringState {
  startProctoring: () => void;
  stopProctoring: () => void;
  recordViolation: (violation: any) => void;
  incrementTabSwitches: () => void;
  updateFaceDetection: (detected: boolean) => void;
  updateAudioDetection: (detected: boolean) => void;
  setSuspiciousActivity: (suspicious: boolean) => void;
  resetProctoring: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),
}));

export const useExamStore = create<ExamStore>((set) => ({
  test: null,
  session: null,
  currentQuestionIndex: 0,
  answers: {},
  timeRemaining: 0,
  isFullscreen: false,
  proctoringEnabled: false,
  warnings: [],
  flaggedQuestions: new Set(),
  reviewMode: false,

  setTest: (test) => set({ test }),
  setSession: (session) => set({ session }),
  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
  updateAnswer: (questionId, answer) => set((state) => ({
    answers: { ...state.answers, [questionId]: answer }
  })),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  addWarning: (warning) => set((state) => ({
    warnings: [...state.warnings, warning]
  })),
  toggleQuestionFlag: (questionId) => set((state) => {
    const newFlagged = new Set(state.flaggedQuestions);
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    return { flaggedQuestions: newFlagged };
  }),
  setReviewMode: (enabled) => set({ reviewMode: enabled }),
  resetExam: () => set({
    test: null,
    session: null,
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: 0,
    isFullscreen: false,
    warnings: [],
    flaggedQuestions: new Set(),
    reviewMode: false,
  }),
}));

export const useProctoringStore = create<ProctoringStore>((set) => ({
  cameraActive: false,
  microphoneActive: false,
  tabSwitches: 0,
  violations: [],
  suspiciousActivity: false,
  faceDetected: false,
  audioDetected: false,

  startProctoring: () => set({
    cameraActive: true,
    microphoneActive: true,
    tabSwitches: 0,
    violations: [],
    suspiciousActivity: false,
  }),
  stopProctoring: () => set({
    cameraActive: false,
    microphoneActive: false,
  }),
  recordViolation: (violation) => set((state) => ({
    violations: [...state.violations, violation]
  })),
  incrementTabSwitches: () => set((state) => ({
    tabSwitches: state.tabSwitches + 1
  })),
  updateFaceDetection: (detected) => set({ faceDetected: detected }),
  updateAudioDetection: (detected) => set({ audioDetected: detected }),
  setSuspiciousActivity: (suspicious) => set({ suspiciousActivity: suspicious }),
  resetProctoring: () => set({
    cameraActive: false,
    microphoneActive: false,
    tabSwitches: 0,
    violations: [],
    suspiciousActivity: false,
    faceDetected: false,
    audioDetected: false,
  }),
}));