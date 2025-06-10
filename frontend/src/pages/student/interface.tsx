'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
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
  Send
} from 'lucide-react';
import { mockTests } from '@/lib/mock-data';
import MCQQuestion from '@/components/exam/MCQQuestion';
import CodingQuestion from '@/components/exam/CodingQuestion';
import QuestionNavigation from '@/components/exam/QuestionNavigation';
import ProctoringPanel from '@/components/exam/ProctoringPanel';

export default function ExamInterface() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes in seconds
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [warnings, setWarnings] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [proctoringActive, setProctoringActive] = useState(true);

  const test = mockTests[0];
  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fullscreen effect
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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
    // Handle test submission
    console.log('Submitting test with answers:', answers);
    // Redirect to results page
  };

  const getTimeColor = () => {
    if (timeRemaining < 300) return 'text-red-600'; // Less than 5 minutes
    if (timeRemaining < 900) return 'text-orange-600'; // Less than 15 minutes
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-lg">{test.title}</h1>
            <Badge variant="outline">
              <Monitor className="h-3 w-3 mr-1" />
              Live
            </Badge>
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
            
            <Progress value={progress} className="h-2" />
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
          />
        </div>

        {/* Submit Button */}
        <div className="p-4 border-t">
          <Button 
            onClick={handleSubmitTest}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Test
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </Badge>
              
              <Badge variant={currentQuestion.type === 'mcq' ? 'default' : 'outline'}>
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
              </Badge>

              <Badge variant="outline">
                {currentQuestion.marks} {currentQuestion.marks === 1 ? 'point' : 'points'}
              </Badge>

              {currentQuestion.difficulty && (
                <Badge variant={
                  currentQuestion.difficulty === 'easy' ? 'default' :
                  currentQuestion.difficulty === 'medium' ? 'secondary' : 'destructive'
                }>
                  {currentQuestion.difficulty}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFlagQuestion(currentQuestion.id)}
                className={flaggedQuestions.has(currentQuestion.id) ? 'bg-yellow-50 border-yellow-300' : ''}
              >
                <Flag className={`h-4 w-4 mr-2 ${flaggedQuestions.has(currentQuestion.id) ? 'text-yellow-600' : ''}`} />
                {flaggedQuestions.has(currentQuestion.id) ? 'Flagged' : 'Flag'}
              </Button>

              {proctoringActive && (
                <div className="flex items-center space-x-1 text-green-600">
                  <Camera className="h-4 w-4" />
                  <Mic className="h-4 w-4" />
                  <Eye className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {warnings.length > 0 && (
              <Alert className="mb-6 border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> {warnings[warnings.length - 1]}
                </AlertDescription>
              </Alert>
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
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Auto-save: <CheckCircle className="h-4 w-4 inline text-green-600 ml-1" />
              </span>
              
              {timeRemaining < 300 && (
                <Alert className="py-2 px-3 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Less than 5 minutes remaining!
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === test.questions.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}