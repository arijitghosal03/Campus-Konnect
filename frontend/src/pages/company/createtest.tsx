'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Plus,
  Save,
  Eye,
  Clock,
  Shield,
  Mail,
  BarChart3,
  BookOpen,
  Monitor,
  AlertTriangle,
  Code,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CreateTest() {
  const [testConfig, setTestConfig] = useState({
    title: '',
    description: '',
    instructions: '',
    duration: 60,
    totalQuestions: 0,
    passingScore: 70,
    maxAttempts: 1,
    startDate: '',
    endDate: '',
    proctoring: {
      enabled: true,
      strictMode: false,
      faceDetection: true,
      tabSwitchLimit: 3,
      screenCapture: true,
    },
    scoring: {
      negativeMarking: false,
      negativeRatio: 0.25,
      partialScoring: true,
      timeBasedScoring: false,
    },
    email: {
      sendInvitations: true,
      sendReminders: true,
      autoSendResults: true,
    }
  });

  const [questions, setQuestions] = useState([]);
  const [currentTab, setCurrentTab] = useState('basic');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Admin</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold">Create New Test</h1>
                <p className="text-gray-600">Build a comprehensive assessment</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Test
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="questions" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Questions
              </TabsTrigger>
              <TabsTrigger value="proctoring" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Proctoring
              </TabsTrigger>
              <TabsTrigger value="scoring" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Scoring
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Information</CardTitle>
                  <CardDescription>Basic details about your assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Test Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Full Stack Developer Assessment"
                        value={testConfig.title}
                        onChange={(e) => setTestConfig(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="60"
                        value={testConfig.duration}
                        onChange={(e) => setTestConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the assessment purpose and scope"
                      value={testConfig.description}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Detailed instructions for test takers including rules and guidelines"
                      value={testConfig.instructions}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, instructions: e.target.value }))}
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <p className="text-sm text-gray-500">
                      These instructions will be shown to candidates before they start the test.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="passingScore">Passing Score (%)</Label>
                      <Input
                        id="passingScore"
                        type="number"
                        min="0"
                        max="100"
                        value={testConfig.passingScore}
                        onChange={(e) => setTestConfig(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxAttempts">Max Attempts</Label>
                      <Select value={testConfig.maxAttempts.toString()} onValueChange={(value) => setTestConfig(prev => ({ ...prev, maxAttempts: parseInt(value) }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Attempt</SelectItem>
                          <SelectItem value="2">2 Attempts</SelectItem>
                          <SelectItem value="3">3 Attempts</SelectItem>
                          <SelectItem value="-1">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Total Questions</Label>
                      <div className="flex items-center space-x-2">
                        <Input value={questions.length} disabled />
                        <Badge variant="outline">{questions.length} added</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Questions */}
            <TabsContent value="questions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Question Management</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add MCQ
                      </Button>
                      <Button variant="outline" size="sm">
                        <Code className="h-4 w-4 mr-2" />
                        Add Coding
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>Add and manage test questions</CardDescription>
                </CardHeader>
                <CardContent>
                  {questions.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">No Questions Added</h3>
                      <p className="text-gray-600 mb-6">Start building your assessment by adding questions</p>
                      <div className="flex justify-center space-x-3">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add MCQ Question
                        </Button>
                        <Button variant="outline">
                          <Code className="h-4 w-4 mr-2" />
                          Add Coding Question
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Questions list will be rendered here */}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Proctoring Settings */}
            <TabsContent value="proctoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Proctoring Configuration
                  </CardTitle>
                  <CardDescription>Configure security and monitoring settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">Enable Proctoring</h4>
                      <p className="text-sm text-gray-600">Turn on AI-powered test monitoring</p>
                    </div>
                    <Switch
                      checked={testConfig.proctoring.enabled}
                      onCheckedChange={(checked) => setTestConfig(prev => ({
                        ...prev,
                        proctoring: { ...prev.proctoring, enabled: checked }
                      }))}
                    />
                  </div>

                  {testConfig.proctoring.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center">
                          <Monitor className="h-4 w-4 mr-2" />
                          Monitoring Features
                        </h4>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="faceDetection" className="text-sm">Face Detection</Label>
                            <Switch
                              id="faceDetection"
                              checked={testConfig.proctoring.faceDetection}
                              onCheckedChange={(checked) => setTestConfig(prev => ({
                                ...prev,
                                proctoring: { ...prev.proctoring, faceDetection: checked }
                              }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="screenCapture" className="text-sm">Screen Capture</Label>
                            <Switch
                              id="screenCapture"
                              checked={testConfig.proctoring.screenCapture}
                              onCheckedChange={(checked) => setTestConfig(prev => ({
                                ...prev,
                                proctoring: { ...prev.proctoring, screenCapture: checked }
                              }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="strictMode" className="text-sm">Strict Mode</Label>
                            <Switch
                              id="strictMode"
                              checked={testConfig.proctoring.strictMode}
                              onCheckedChange={(checked) => setTestConfig(prev => ({
                                ...prev,
                                proctoring: { ...prev.proctoring, strictMode: checked }
                              }))}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Violation Limits
                        </h4>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="tabSwitchLimit">Tab Switch Limit</Label>
                            <Input
                              id="tabSwitchLimit"
                              type="number"
                              min="0"
                              max="10"
                              value={testConfig.proctoring.tabSwitchLimit}
                              onChange={(e) => setTestConfig(prev => ({
                                ...prev,
                                proctoring: { ...prev.proctoring, tabSwitchLimit: parseInt(e.target.value) }
                              }))}
                            />
                            <p className="text-xs text-gray-500">Number of allowed tab switches before termination</p>
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 mr-2" />
                            <div className="text-sm">
                              <p className="font-medium text-amber-800">Strict Mode Warning</p>
                              <p className="text-amber-700">Strict mode will automatically terminate tests on violations</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scoring Configuration */}
            <TabsContent value="scoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Scoring Configuration
                  </CardTitle>
                  <CardDescription>Configure how tests are scored and evaluated</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Scoring Rules</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="negativeMarking" className="text-sm">Negative Marking</Label>
                          <Switch
                            id="negativeMarking"
                            checked={testConfig.scoring.negativeMarking}
                            onCheckedChange={(checked) => setTestConfig(prev => ({
                              ...prev,
                              scoring: { ...prev.scoring, negativeMarking: checked }
                            }))}
                          />
                        </div>

                        {testConfig.scoring.negativeMarking && (
                          <div className="space-y-2 ml-4">
                            <Label htmlFor="negativeRatio">Negative Marking Ratio</Label>
                            <Select
                              value={testConfig.scoring.negativeRatio.toString()}
                              onValueChange={(value) => setTestConfig(prev => ({
                                ...prev,
                                scoring: { ...prev.scoring, negativeRatio: parseFloat(value) }
                              }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0.25">-0.25 (25% penalty)</SelectItem>
                                <SelectItem value="0.33">-0.33 (33% penalty)</SelectItem>
                                <SelectItem value="0.5">-0.5 (50% penalty)</SelectItem>
                                <SelectItem value="1">-1 (Full penalty)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <Label htmlFor="partialScoring" className="text-sm">Partial Scoring</Label>
                          <Switch
                            id="partialScoring"
                            checked={testConfig.scoring.partialScoring}
                            onCheckedChange={(checked) => setTestConfig(prev => ({
                              ...prev,
                              scoring: { ...prev.scoring, partialScoring: checked }
                            }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="timeBasedScoring" className="text-sm">Time-based Bonus</Label>
                          <Switch
                            id="timeBasedScoring"
                            checked={testConfig.scoring.timeBasedScoring}
                            onCheckedChange={(checked) => setTestConfig(prev => ({
                              ...prev,
                              scoring: { ...prev.scoring, timeBasedScoring: checked }
                            }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Grade Calculation</h4>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">Scoring Formula</h5>
                        <div className="text-sm text-blue-800 space-y-1">
                          <p>Base Score = Correct Answers × Question Points</p>
                          {testConfig.scoring.negativeMarking && (
                            <p>Penalty = Wrong Answers × {testConfig.scoring.negativeRatio} × Question Points</p>
                          )}
                          {testConfig.scoring.partialScoring && (
                            <p>Partial Credit = Applied to coding questions</p>
                          )}
                          {testConfig.scoring.timeBasedScoring && (
                            <p>Time Bonus = Based on completion speed</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Passing Score</span>
                          <span className="font-medium">{testConfig.passingScore}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Total Questions</span>
                          <span className="font-medium">{questions.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Maximum Score</span>
                          <span className="font-medium">100 points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule */}
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Test Scheduling
                  </CardTitle>
                  <CardDescription>Set availability and timing for your assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date & Time</Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={testConfig.startDate}
                        onChange={(e) => setTestConfig(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date & Time</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={testConfig.endDate}
                        onChange={(e) => setTestConfig(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-3">Schedule Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium">{testConfig.duration} minutes</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Availability:</span>
                        <p className="font-medium">
                          {testConfig.startDate && testConfig.endDate ? 'Scheduled' : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Max Attempts:</span>
                        <p className="font-medium">
                          {testConfig.maxAttempts === -1 ? 'Unlimited' : testConfig.maxAttempts}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>Configure automated email communications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">Send Invitations</h4>
                        <p className="text-sm text-gray-600">Automatically send test invitations to candidates</p>
                      </div>
                      <Switch
                        checked={testConfig.email.sendInvitations}
                        onCheckedChange={(checked) => setTestConfig(prev => ({
                          ...prev,
                          email: { ...prev.email, sendInvitations: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">Send Reminders</h4>
                        <p className="text-sm text-gray-600">Send reminder emails before test starts</p>
                      </div>
                      <Switch
                        checked={testConfig.email.sendReminders}
                        onCheckedChange={(checked) => setTestConfig(prev => ({
                          ...prev,
                          email: { ...prev.email, sendReminders: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">Auto-send Results</h4>
                        <p className="text-sm text-gray-600">Automatically email results after test completion</p>
                      </div>
                      <Switch
                        checked={testConfig.email.autoSendResults}
                        onCheckedChange={(checked) => setTestConfig(prev => ({
                          ...prev,
                          email: { ...prev.email, autoSendResults: checked }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Email Schedule</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• Invitations: Sent when test is published</p>
                      <p>• Reminders: 24 hours and 1 hour before test start</p>
                      <p>• Results: Sent immediately after completion</p>
                      <p>• Violations: Sent to admins in real-time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Bar */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Draft
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Last saved: Never
                  </span>
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Test
                  </Button>
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Publish Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}