'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen,
  Clock,
  Shield,
  Camera,
  Mic,
  Monitor,
  CheckCircle,
  AlertTriangle,
  User,
  Key,
  Building,
  Mail
} from 'lucide-react';
import Link from 'next/link';

export default function StudentPortal() {
  const [accessForm, setAccessForm] = useState({
    companyCode: '',
    studentId: '',
    passkey: '',
    studentName: '',
    email: ''
  });

  const [systemCheck, setSystemCheck] = useState({
    camera: false,
    microphone: false,
    browser: true,
    internet: true
  });

  const [step, setStep] = useState('access'); // access, verify, systemCheck, ready

  const handleSystemCheck = async () => {
    try {
      // Check camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setSystemCheck(prev => ({ ...prev, camera: true, microphone: true }));
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Media access error:', error);
    }
  };

  const mockTest = {
    title: 'Full Stack Developer Assessment',
    company: 'TechCorp Solutions',
    duration: 90,
    questions: 15,
    startTime: '2024-12-01T10:00:00Z',
    endTime: '2024-12-31T18:00:00Z',
    instructions: `Welcome to the Full Stack Developer Assessment.

**Important Instructions:**
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

Good luck!`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Monitor className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ExamFlow
                </h1>
                <p className="text-sm text-gray-600">Student Portal</p>
              </div>
            </Link>
            <Badge variant="outline" className="px-4 py-2">
              <BookOpen className="h-4 w-4 mr-2" />
              Assessment Portal
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {step === 'access' && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Access Your Assessment
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Enter your credentials to access your scheduled online examination
                </p>
              </div>

              {/* Access Form */}
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    Test Access
                  </CardTitle>
                  <CardDescription>
                    Please provide your test credentials to continue
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyCode" className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Company Code
                      </Label>
                      <Input
                        id="companyCode"
                        placeholder="e.g., TECH2024"
                        value={accessForm.companyCode}
                        onChange={(e) => setAccessForm(prev => ({ ...prev, companyCode: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="studentId" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Student ID
                      </Label>
                      <Input
                        id="studentId"
                        placeholder="e.g., STU001"
                        value={accessForm.studentId}
                        onChange={(e) => setAccessForm(prev => ({ ...prev, studentId: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passkey" className="flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      Test Passkey
                    </Label>
                    <Input
                      id="passkey"
                      type="password"
                      placeholder="Enter your unique test passkey"
                      value={accessForm.passkey}
                      onChange={(e) => setAccessForm(prev => ({ ...prev, passkey: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentName" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Full Name
                      </Label>
                      <Input
                        id="studentName"
                        placeholder="Enter your full name"
                        value={accessForm.studentName}
                        onChange={(e) => setAccessForm(prev => ({ ...prev, studentName: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={accessForm.email}
                        onChange={(e) => setAccessForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Your credentials will be verified and an OTP will be sent to your email for additional security.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                    onClick={() => setStep('verify')}
                  >
                    Verify & Continue
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Email Verification</h1>
                <p className="text-gray-600">
                  We've sent a verification code to <strong>{accessForm.email}</strong>
                </p>
              </div>

              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Enter Verification Code</CardTitle>
                  <CardDescription>Check your email for the 6-digit code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                  />
                  <Button 
                    className="w-full" 
                    onClick={() => setStep('systemCheck')}
                  >
                    Verify Code
                  </Button>
                  <Button variant="outline" className="w-full">
                    Resend Code
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 'systemCheck' && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">System Requirements Check</h1>
                <p className="text-gray-600">
                  Let's ensure your system is ready for the proctored examination
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hardware Check</CardTitle>
                    <CardDescription>Verify camera and microphone access</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Camera className="h-5 w-5" />
                        <span>Camera Access</span>
                      </div>
                      {systemCheck.camera ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mic className="h-5 w-5" />
                        <span>Microphone Access</span>
                      </div>
                      {systemCheck.microphone ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>

                    <Button 
                      onClick={handleSystemCheck}
                      className="w-full"
                      variant={systemCheck.camera && systemCheck.microphone ? "outline" : "default"}
                    >
                      {systemCheck.camera && systemCheck.microphone ? "Test Again" : "Test Hardware"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Check</CardTitle>
                    <CardDescription>Browser and connection status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-5 w-5" />
                        <span>Browser Compatibility</span>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>Internet Connection</span>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>

                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">All systems ready!</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {systemCheck.camera && systemCheck.microphone && (
                <div className="text-center">
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setStep('ready')}
                  >
                    Continue to Test Instructions
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 'ready' && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">{mockTest.title}</h1>
                <p className="text-gray-600">
                  <strong>{mockTest.company}</strong> • {mockTest.duration} minutes • {mockTest.questions} questions
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Test Instructions</CardTitle>
                      <CardDescription>Please read carefully before starting</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                          {mockTest.instructions}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Test Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{mockTest.duration} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Questions:</span>
                        <span className="font-medium">{mockTest.questions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Passing Score:</span>
                        <span className="font-medium">70%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Attempts:</span>
                        <span className="font-medium">1</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Proctoring Active
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Camera monitoring enabled
                        </div>
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Audio detection active
                        </div>
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Tab switching monitored
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="acknowledge" className="rounded" />
                      <Label htmlFor="acknowledge" className="text-sm">
                        I acknowledge that I have read and understood all instructions
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="agree" className="rounded" />
                      <Label htmlFor="agree" className="text-sm">
                        I agree to the proctoring terms and conditions
                      </Label>
                    </div>

                    <Link href="/student/exam">
                      <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                        Start Assessment
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}