'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, CheckCircle, XCircle, Clock, MemoryStick as Memory, Code, FileText, Terminal } from 'lucide-react';
import { Question } from '@/lib/types';
import dynamic from 'next/dynamic';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodingQuestionProps {
  question: Question;
  answer?: any;
  onAnswerChange: (answer: any) => void;
}

interface TestResult {
  status: string;
  executionTime: number;
  memoryUsed: number;
  testCases: {
    id: string;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    status: string;
    executionTime: number;
    points: number;
  }[];
}

export default function CodingQuestion({ question, answer, onAnswerChange }: CodingQuestionProps) {
  type Language = 'javascript' | 'python' | 'java' | 'cpp';
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(answer?.code || '');
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const codingQuestion = question.codingQuestion;

  const languageTemplates = {
    javascript: `function solution() {
    // Write your solution here
    
}`,
    python: `def solution():
    # Write your solution here
    pass`,
    java: `public class Solution {
    public static void main(String[] args) {
        // Write your solution here
    }
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}`
  };
  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    if (!code || code === languageTemplates[selectedLanguage]) {
      setCode(languageTemplates[language]);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onAnswerChange({
      language: selectedLanguage,
      code: newCode,
      testResults
    });
  };

  const runCode = async () => {
    setIsRunning(true);
    
    // Simulate code execution
    setTimeout(() => {
      const mockResults = {
        status: 'accepted',
        executionTime: 45,
        memoryUsed: 12.5,
        testCases: codingQuestion?.sampleTestCases?.map((testCase, index) => ({
          id: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: testCase.expectedOutput, // Mock: assume correct for demo
          status: 'passed',
          executionTime: 20 + Math.random() * 30,
          points: testCase.points
        })) || []
      };
      
      setTestResults(mockResults);
      setIsRunning(false);
      
      onAnswerChange({
        language: selectedLanguage,
        code,
        testResults: mockResults
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Problem Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{question.questionText}</span>
            <div className="flex space-x-2">
              <Badge variant="outline">{question.category}</Badge>
              <Badge variant={
                question.difficulty === 'easy' ? 'default' :
                question.difficulty === 'medium' ? 'secondary' : 'destructive'
              }>
                {question.difficulty}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="problem" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="constraints">Constraints</TabsTrigger>
            </TabsList>
            
            <TabsContent value="problem" className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {codingQuestion?.problemStatement}
                </pre>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Input Format:</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {codingQuestion?.inputFormat}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Output Format:</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {codingQuestion?.outputFormat}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="examples" className="space-y-4">
              {codingQuestion?.sampleTestCases?.map((testCase, index) => (
                <div key={testCase.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Example {index + 1}:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Input:</p>
                      <pre className="text-sm bg-gray-50 p-2 rounded border font-mono">
                        {testCase.input}
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Output:</p>
                      <pre className="text-sm bg-gray-50 p-2 rounded border font-mono">
                        {testCase.expectedOutput}
                      </pre>
                    </div>
                  </div>
                  {testCase.explanation && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Explanation:</p>
                      <p className="text-sm text-gray-600">{testCase.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="constraints" className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">
                  {codingQuestion?.constraints}
                </pre>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Time Limit: {codingQuestion?.timeLimit}s</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Memory className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Memory Limit: {codingQuestion?.memoryLimit}MB</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Code Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Code Editor
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={runCode} 
                disabled={isRunning || !code.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isRunning ? (
                  <>
                    <Terminal className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <MonacoEditor
              height="400px"
              language={selectedLanguage}
              value={code}
              onChange={handleCodeChange}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Terminal className="h-5 w-5 mr-2" />
              Test Results
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">All test cases passed!</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-green-700">
                <span>Time: {testResults.executionTime}ms</span>
                <span>Memory: {testResults.memoryUsed}MB</span>
              </div>
            </div>

            <div className="space-y-3">
              {testResults.testCases.map((result, index) => (
                <div key={result.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Test Case {index + 1}</span>
                    <div className="flex items-center space-x-2">
                      {result.status === 'passed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm text-gray-600">{result.executionTime}ms</span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Input:</p>
                      <pre className="bg-gray-50 p-2 rounded text-xs font-mono">
                        {result.input}
                      </pre>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Expected:</p>
                      <pre className="bg-gray-50 p-2 rounded text-xs font-mono">
                        {result.expectedOutput}
                      </pre>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Your Output:</p>
                      <pre className="bg-gray-50 p-2 rounded text-xs font-mono">
                        {result.actualOutput}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



