import { useState, useEffect, useRef } from 'react';
import { 
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Camera,
  Mic,
  Eye,
  Code,
  FileText,
  Send,
  Play,
  Square,
  Volume2,
  X,
  ArrowLeft
} from 'lucide-react';

// Mock data
const mockTest = {
  id: '1',
  title: 'Advanced JavaScript Assessment',
  duration: 90,
  questions: [
    {
      id: 'q1',
      type: 'mcq',
      title: 'What is the output of the following code?',
      description: 'console.log(typeof null);',
      options: ['null', 'undefined', 'object', 'boolean'],
      correctAnswer: 'object',
      marks: 2,
      difficulty: 'easy'
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Which method is used to add elements to the end of an array?',
      description: 'Select the correct method for adding elements to the end of an array in JavaScript.',
      options: ['push()', 'pop()', 'shift()', 'unshift()'],
      correctAnswer: 'push()',
      marks: 1,
      difficulty: 'easy'
    },
    {
      id: 'q3',
      type: 'coding',
      title: 'Implement a function to reverse a string',
      description: 'Write a JavaScript function that takes a string as input and returns the string reversed.',
      starterCode: 'function reverseString(str) {\n  // Your code here\n  \n}',
      testCases: [
        { input: '"hello"', expected: '"olleh"' },
        { input: '"world"', expected: '"dlrow"' }
      ],
      marks: 5,
      difficulty: 'medium'
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'What is event bubbling?',
      description: 'Event bubbling is a concept in JavaScript event handling.',
      options: [
        'Events travel from child to parent elements',
        'Events travel from parent to child elements',
        'Events are cancelled automatically',
        'Events are duplicated'
      ],
      correctAnswer: 'Events travel from child to parent elements',
      marks: 3,
      difficulty: 'medium'
    },
    {
      id: 'q5',
      type: 'coding',
      title: 'Find the largest number in an array',
      description: 'Write a function that finds and returns the largest number in an array of numbers.',
      starterCode: 'function findLargest(numbers) {\n  // Your code here\n  \n}',
      testCases: [
        { input: '[1, 5, 3, 9, 2]', expected: '9' },
        { input: '[-1, -5, -3]', expected: '-1' }
      ],
      marks: 4,
      difficulty: 'hard'
    }
  ]
};

// Components
import React from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText
}: ConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} showCloseButton={false}>
      <div className="space-y-4">
        <p className="text-gray-600">{message}</p>
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            {cancelText || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

type ResultsModalProps = {
  isOpen: boolean;
  answeredCount: number;
  totalQuestions: number;
  totalMarks: number;
  warningsCount: number;
  onBackToStudent: () => void;
};

const ResultsModal = ({
  isOpen,
  answeredCount,
  totalQuestions,
  totalMarks,
  warningsCount,
  onBackToStudent
}: ResultsModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Test Submitted Successfully" showCloseButton={false}>
      <div className="space-y-4">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">Your answers have been recorded and will be reviewed.</p>
        </div>
        
        <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span>Questions Answered:</span>
            <span className="font-medium">{answeredCount}/{totalQuestions}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Marks:</span>
            <span className="font-medium">{totalMarks}</span>
          </div>
          <div className="flex justify-between">
            <span>Warnings:</span>
            <span className="font-medium">{warningsCount}</span>
          </div>
        </div>

        <button
          onClick={onBackToStudent}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Student Dashboard
        </button>
      </div>
    </Modal>
  );
};

type MCQQuestionProps = {
  question: any;
  answer: string;
  onAnswerChange: (answer: string) => void;
};

const MCQQuestion = ({ question, answer, onAnswerChange }: MCQQuestionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-3">{question.title}</h2>
        <p className="text-gray-700 mb-4">{question.description}</p>
      </div>
      
      <div className="space-y-3">
        {question.options.map((option: string, index: number) => (
          <label key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={answer === option}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="flex-1">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

type CodingQuestionProps = {
  question: {
    id: string;
    type: string;
    title: string;
    description: string;
    starterCode?: string;
    testCases?: { input: string; expected: string }[];
    marks: number;
    difficulty?: string;
  };
  answer: string;
  onAnswerChange: (answer: string) => void;
};

const CodingQuestion = ({ question, answer, onAnswerChange }: CodingQuestionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-3">{question.title}</h2>
        <p className="text-gray-700 mb-4">{question.description}</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Solution:</label>
          <textarea
            value={answer || question.starterCode || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="w-full h-64 p-3 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write your code here..."
          />
        </div>
        
        {question.testCases && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Test Cases:</h4>
            <div className="space-y-2">
              {question.testCases.map((testCase, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">Input:</span> {testCase.input} → 
                  <span className="font-medium"> Expected:</span> {testCase.expected}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

type QuestionNavigationProps = {
  questions: any[];
  currentIndex: number;
  answers: { [key: string]: string };
  flaggedQuestions: Set<string>;
  onQuestionSelect: (index: number) => void;
};

const QuestionNavigation = ({ questions, currentIndex, answers, flaggedQuestions, onQuestionSelect }: QuestionNavigationProps) => {
  return (
    <div className="p-4">
      <h3 className="font-medium mb-3">Questions</h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          const isAnswered = answers[question.id];
          const isFlagged = flaggedQuestions.has(question.id);
          const isCurrent = index === currentIndex;
          
          return (
            <button
              key={question.id}
              onClick={() => onQuestionSelect(index)}
              className={`
                w-10 h-10 rounded text-sm font-medium border-2 relative
                ${isCurrent ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}
                ${isAnswered ? 'bg-green-100 text-green-800' : 'bg-white'}
                hover:bg-gray-50
              `}
            >
              {index + 1}
              {isFlagged && (
                <Flag className="absolute -top-1 -right-1 h-3 w-3 text-yellow-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ProctoringPanel = ({
  isActive,
  warnings,
  cameraStream,
  micLevel,
}: {
  isActive: boolean;
  warnings: string[];
  cameraStream: boolean;
  micLevel: number;
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Proctoring</span>
        <div className={`flex items-center space-x-1 ${isActive ? 'text-green-600' : 'text-red-600'}`}>
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-600' : 'bg-red-600'}`} />
          <span className="text-xs">{isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 text-xs">
        <Camera className={`h-4 w-4 ${cameraStream ? 'text-green-600' : 'text-red-600'}`} />
        <Mic className={`h-4 w-4 ${micLevel > 0 ? 'text-green-600' : 'text-red-600'}`} />
        <Eye className="h-4 w-4 text-blue-600" />
      </div>
      
      {warnings.length > 0 && (
        <div className="text-xs text-orange-600">
          <AlertTriangle className="h-3 w-3 inline mr-1" />
          {warnings.length} warning{warnings.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default function ExamInterface() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(90 * 60);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [warnings, setWarnings] = useState<string[]>([]);
  const [proctoringActive, setProctoringActive] = useState(true);
  const [cameraStream, setCameraStream] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const test = mockTest;
  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (!examStarted || examSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examSubmitted]);

  // Auto-save effect
  useEffect(() => {
    if (!examStarted) return;
    
    setAutoSaveStatus('saving');
    const saveTimer = setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [answers]);

  // Proctoring simulation
  useEffect(() => {
    if (!proctoringActive) return;

    // Simulate camera access
    const cameraTimer = setTimeout(() => {
      setCameraStream(true);
    }, 2000);

    // Simulate microphone level detection
    const micTimer = setInterval(() => {
      setMicLevel(Math.random() * 100);
    }, 500);

    // Simulate random warnings
    const warningTimer = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const warningMessages = [
          'Multiple faces detected',
          'Looking away from screen',
          'Suspicious browser activity',
          'Audio level too low',
          'Screen sharing detected'
        ];
        const newWarning = warningMessages[Math.floor(Math.random() * warningMessages.length)];
        setWarnings(prev => [...prev, newWarning]);
      }
    }, 5000);

    return () => {
      clearTimeout(cameraTimer);
      clearInterval(micTimer);
      clearInterval(warningTimer);
    };
  }, [proctoringActive]);

  // Fullscreen monitoring
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      
      if (examStarted && !isNowFullscreen) {
        setWarnings(prev => [...prev, 'Exited fullscreen mode']);
      }
    };

    const handleVisibilityChange = () => {
      if (examStarted && document.hidden) {
        setWarnings(prev => [...prev, 'Tab switched or window minimized']);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [examStarted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setExamStarted(true);
      setProctoringActive(true);
    } catch (error) {
      console.log('Fullscreen request failed:', error);
      setExamStarted(true);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = () => {
    setShowSubmitModal(true);
  };

  const confirmSubmitTest = () => {
    setShowSubmitModal(false);
    setExamSubmitted(true);
    setShowResultsModal(true);
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleBackToStudent = () => {
    
    window.location.href = '/student';
  };

  const getTimeColor = () => {
    if (timeRemaining < 300) return 'text-red-600';
    if (timeRemaining < 900) return 'text-orange-600';
    return 'text-green-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">{test.title}</h1>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-medium">{test.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Questions:</span>
              <span className="font-medium">{test.questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Marks:</span>
              <span className="font-medium">{test.questions.reduce((sum, q) => sum + q.marks, 0)}</span>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">⚠️ Exam Rules:</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Full screen mode will be activated</li>
              <li>• Camera and microphone monitoring</li>
              <li>• Tab switching will be detected</li>
              <li>• Auto-submit when time expires</li>
            </ul>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  if (examSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Exam Submitted Successfully</h1>
          <p className="text-gray-600 mb-6">Your answers have been recorded and will be reviewed.</p>
          
          <div className="space-y-2 text-sm text-left bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between">
              <span>Questions Answered:</span>
              <span>{Object.keys(answers).length}/{test.questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Questions Flagged:</span>
              <span>{flaggedQuestions.size}</span>
            </div>
            <div className="flex justify-between">
              <span>Warnings:</span>
              <span>{warnings.length}</span>
            </div>
          </div>

          <button
            onClick={handleBackToStudent}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-lg">{test.title}</h1>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${proctoringActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs font-medium">Live</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Time Remaining:</span>
              <span className={`font-mono font-bold ${getTimeColor()}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>Progress:</span>
              <span className="font-medium">{currentQuestionIndex + 1}/{test.questions.length}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{width: `${progress}%`}}
              />
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="flex-1 overflow-y-auto">
          <QuestionNavigation
            questions={test.questions}
            currentIndex={currentQuestionIndex}
            answers={answers}
            flaggedQuestions={flaggedQuestions}
            onQuestionSelect={setCurrentQuestionIndex}
          />
        </div>

        {/* Proctoring Status */}
        <div className="p-4 border-t">
          <ProctoringPanel
            isActive={proctoringActive}
            warnings={warnings}
            cameraStream={cameraStream}
            micLevel={micLevel}
          />
        </div>

        {/* Submit Button */}
        <div className="p-4 border-t">
          <button 
            onClick={handleSubmitTest}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </span>
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                currentQuestion.type === 'mcq' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {currentQuestion.type === 'mcq' ? (
                  <>
                    <FileText className="h-3 w-3 mr-1" />
                    Multiple Choice
                  </>
                ) : (
                  <>
                    <Code className="h-3 w-3 mr-1" />
                    Coding
                  </>
                )}
              </span>

              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                {currentQuestion.marks} {currentQuestion.marks === 1 ? 'point' : 'points'}
              </span>

              {currentQuestion.difficulty && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleFlagQuestion(currentQuestion.id)}
                className={`px-3 py-1 rounded-lg border text-sm font-medium flex items-center ${
                  flaggedQuestions.has(currentQuestion.id) 
                    ? 'bg-yellow-50 border-yellow-300 text-yellow-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Flag className={`h-4 w-4 mr-2 ${flaggedQuestions.has(currentQuestion.id) ? 'text-yellow-600' : ''}`} />
                {flaggedQuestions.has(currentQuestion.id) ? 'Flagged' : 'Flag'}
              </button>

              {proctoringActive && (
                <div className="flex items-center space-x-2">
                  <Camera className={`h-4 w-4 ${cameraStream ? 'text-green-600' : 'text-red-600'}`} />
                  <Mic className={`h-4 w-4 ${micLevel > 0 ? 'text-green-600' : 'text-red-600'}`} />
                  <Eye className="h-4 w-4 text-blue-600" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {warnings.length > 0 && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start">
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-orange-800">Proctoring Alert</div>
                  <div className="text-orange-700 text-sm mt-1">
                    Latest: {warnings[warnings.length - 1]}
                    {warnings.length > 1 && (
                      <span className="ml-2 text-xs">({warnings.length} total warnings)</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentQuestion.type === 'mcq' ? (
              <MCQQuestion
                question={currentQuestion}
                answer={answers[currentQuestion.id]}
                onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
              />
            ) : (
              <CodingQuestion
                question={currentQuestion}
                answer={answers[currentQuestion.id]}
                onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
              />
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-white border-t p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="flex items-center space-x-6">
              <div className="flex items-center text-sm text-gray-600">
                <span>Auto-save:</span>
                {autoSaveStatus === 'saved' ? (
                  <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                ) : (
                  <div className="ml-2 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              
              {timeRemaining < 300 && (
                <div className="flex items-center px-3 py-1 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">Less than 5 minutes remaining!</span>
                </div>
              )}
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === test.questions.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={confirmSubmitTest}
        title="Submit Test"
        message="Are you sure you want to submit the test? This action cannot be undone."
        confirmText="Submit Test"
        cancelText="Continue Exam"
      />

      <ResultsModal
        isOpen={showResultsModal}
        answeredCount={Object.keys(answers).length}
        totalQuestions={test.questions.length}
        totalMarks={test.questions.reduce((sum, q) => sum + q.marks, 0)}
        warningsCount={warnings.length}
        onBackToStudent={handleBackToStudent}
      />
    </div>
  );
}