'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/lib/types';

interface MCQQuestionProps {
  question: Question;
  answer?: string;
  onAnswerChange: (answer: string) => void;
}

export default function MCQQuestion({ question, answer, onAnswerChange }: MCQQuestionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl leading-relaxed">
            {question.questionText}
          </CardTitle>
          <Badge variant="outline" className="ml-4">
            {question.category}
          </Badge>
        </div>
        {question.timeLimit && (
          <p className="text-sm text-gray-600">
            Recommended time: {question.timeLimit} minutes
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <RadioGroup value={answer} onValueChange={onAnswerChange}>
          {question.mcqOptions?.map((option) => (
            <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label 
                htmlFor={option.id} 
                className="flex-1 cursor-pointer text-base leading-relaxed"
              >
                {option.optionText}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {answer && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Selected:</strong> {question.mcqOptions?.find(opt => opt.id === answer)?.optionText}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}