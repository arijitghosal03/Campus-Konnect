'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Circle, 
  Flag, 
  Code, 
  FileText,
  Clock
} from 'lucide-react';
import { Question } from '@/lib/types';

interface QuestionNavigationProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, any>;
  flaggedQuestions: Set<string>;
  onQuestionSelect: (index: number) => void;
}

export default function QuestionNavigation({
  questions,
  currentIndex,
  answers,
  flaggedQuestions,
  onQuestionSelect
}: QuestionNavigationProps) {
  const getQuestionStatus = (question: Question) => {
    const isAnswered = answers[question.id] !== undefined;
    const isFlagged = flaggedQuestions.has(question.id);
    
    if (isAnswered && isFlagged) return 'answered-flagged';
    if (isAnswered) return 'answered';
    if (isFlagged) return 'flagged';
    return 'unanswered';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
      case 'answered-flagged':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'flagged':
        return <Flag className="h-4 w-4 text-yellow-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getButtonVariant = (index: number, status: string) => {
    if (index === currentIndex) return 'default';
    if (status === 'answered' || status === 'answered-flagged') return 'outline';
    return 'ghost';
  };

  const getButtonClassName = (index: number, status: string) => {
    let className = 'w-full justify-start h-auto p-3 ';
    
    if (index === currentIndex) {
      className += 'bg-blue-600 text-white ';
    } else if (status === 'answered-flagged') {
      className += 'bg-green-50 border-green-200 ';
    } else if (status === 'answered') {
      className += 'bg-green-50 border-green-200 ';
    } else if (status === 'flagged') {
      className += 'bg-yellow-50 border-yellow-200 ';
    }
    
    return className;
  };

  // Group questions by type
  const mcqQuestions = questions.filter(q => q.type === 'mcq');
  const codingQuestions = questions.filter(q => q.type === 'coding');

  const answeredCount = questions.filter(q => answers[q.id] !== undefined).length;
  const flaggedCount = flaggedQuestions.size;

  return (
    <div className="p-4 space-y-4">
      {/* Summary */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Progress Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span>Answered:</span>
            <Badge variant="outline" className="text-xs">
              {answeredCount}/{questions.length}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Flagged:</span>
            <Badge variant="outline" className="text-xs">
              {flaggedCount}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* MCQ Questions */}
      {mcqQuestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-600" />
            <h4 className="font-medium text-sm">Multiple Choice ({mcqQuestions.length})</h4>
          </div>
          
          <div className="space-y-1">
            {mcqQuestions.map((question, idx) => {
              const globalIndex = questions.findIndex(q => q.id === question.id);
              const status = getQuestionStatus(question);
              
              return (
                <Button
                  key={question.id}
                  variant={getButtonVariant(globalIndex, status)}
                  className={getButtonClassName(globalIndex, status)}
                  onClick={() => onQuestionSelect(globalIndex)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status)}
                      <span className="text-sm">Q{globalIndex + 1}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {flaggedQuestions.has(question.id) && (
                        <Flag className="h-3 w-3 text-yellow-600" />
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {question.marks}pt
                      </Badge>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Coding Questions */}
      {codingQuestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Code className="h-4 w-4 text-gray-600" />
            <h4 className="font-medium text-sm">Coding ({codingQuestions.length})</h4>
          </div>
          
          <div className="space-y-1">
            {codingQuestions.map((question, idx) => {
              const globalIndex = questions.findIndex(q => q.id === question.id);
              const status = getQuestionStatus(question);
              
              return (
                <Button
                  key={question.id}
                  variant={getButtonVariant(globalIndex, status)}
                  className={getButtonClassName(globalIndex, status)}
                  onClick={() => onQuestionSelect(globalIndex)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status)}
                      <span className="text-sm">Q{globalIndex + 1}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {flaggedQuestions.has(question.id) && (
                        <Flag className="h-3 w-3 text-yellow-600" />
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {question.marks}pt
                      </Badge>
                      {question.timeLimit && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {question.timeLimit}m
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      <Separator />

      {/* Legend */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <Flag className="h-3 w-3 text-yellow-600" />
            <span>Flagged for review</span>
          </div>
          <div className="flex items-center space-x-2">
            <Circle className="h-3 w-3 text-gray-400" />
            <span>Not answered</span>
          </div>
        </div>
      </div>
    </div>
  );
}