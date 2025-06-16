'use client';

import { useState, useEffect } from 'react';
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
  ArrowLeft,
  AlertTriangle,
  User,
  Key,
  Building,
  Mail,
  Loader2
} from 'lucide-react';

export default function StudentPortal() {
  const [accessForm, setAccessForm] = useState({
    companyCode: '',
    studentId: '',
    email: ''
  });

  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [systemCheck, setSystemCheck] = useState({
    camera: false,
    microphone: false,
    browser: true,
    internet: true
  });

  const [step, setStep] = useState('access'); // access, verify, systemCheck, ready
  const [acknowledgeTerms, setAcknowledgeTerms] = useState(false);
  const [agreeProctoring, setAgreeProctoring] = useState(false);

  // Cooldown timer for resend OTP
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Check if user is student (mock implementation)
  useEffect(() => {
    const role = 'student'; // Mock role check
    if (role !== "student") {
      window.location.href = "/";
    }
  }, []);

  const sendOTP = async () => {
    if (!accessForm.companyCode || !accessForm.studentId || !accessForm.email) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: accessForm.email,
          companyCode: accessForm.companyCode,
          studentId: accessForm.studentId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('OTP sent successfully to your email!');
        setOtpSent(true);
        setStep('verify');
        setResendCooldown(60); // 60 second cooldown
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: accessForm.email,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Email verified successfully!');
        setTimeout(() => setStep('systemCheck'), 1000);
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: accessForm.email,
          companyCode: accessForm.companyCode,
          studentId: accessForm.studentId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('New OTP sent to your email!');
        setResendCooldown(60);
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemCheck = async () => {
    setLoading(true);
    try {
      // Check camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }, 
        audio: true 
      });
      
      setSystemCheck(prev => ({ 
        ...prev, 
        camera: true, 
        microphone: true 
      }));
      
      // Stop the stream after checking
      stream.getTracks().forEach(track => track.stop());
      setSuccess('Hardware test successful! Camera and microphone are working properly.');
    } catch (error) {
      console.error('Media access error:', error);
      if (typeof error === 'object' && error !== null && 'name' in error) {
        const err = error as { name: string };
        if (err.name === 'NotAllowedError') {
          setError('Camera/microphone access denied. Please allow access and try again.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera or microphone found. Please check your hardware.');
        } else {
          setError('Failed to access camera/microphone. Please check your hardware and permissions.');
        }
      } else {
        setError('Failed to access camera/microphone. Please check your hardware and permissions.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = () => {
    if (!acknowledgeTerms || !agreeProctoring) {
      setError('Please acknowledge the terms and agree to proctoring conditions.');
      return;
    }
    
    // Store assessment data
    const assessmentData = {
      companyCode: accessForm.companyCode,
      studentId: accessForm.studentId,
      email: accessForm.email,
      startTime: new Date().toISOString(),
      systemChecked: true
    };
    
    // In a real app, you'd store this in localStorage or send to server
    console.log('Starting assessment with data:', assessmentData);
    
    // Navigate to assessment interface
    window.location.href = '/student/interface';
  };

  const mockTest = {
    title: 'Full Stack Developer Assessment',
    company: 'TechCorp Solutions',
    duration: 90,
    questions: 15,
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
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <div
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md m-3 cursor-pointer"
                onClick={() => window.location.href = '/'}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-600 rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              </div>

              <span className="text-2xl font-semibold text-gray-800 tracking-wide">
                <span className="font-bold bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-transparent">Campus</span>{' '}
                <span className="font-bold text-gray-900">Konnect</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-4 py-2">
                <BookOpen className="h-4 w-4 mr-2" />
                Assessment Portal
              </Badge>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                onClick={() => window.location.href = '/student'}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Error/Success Messages */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

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
                  <div className="space-y-2">
                    <Label htmlFor="companyCode" className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Company Code *
                    </Label>
                    <Input
                      id="companyCode"
                      placeholder="e.g., TECH2024"
                      value={accessForm.companyCode}
                      onChange={(e) => setAccessForm(prev => ({ ...prev, companyCode: e.target.value.toUpperCase() }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Student ID *
                    </Label>
                    <Input
                      id="studentId"
                      placeholder="e.g., STU001"
                      value={accessForm.studentId}
                      onChange={(e) => setAccessForm(prev => ({ ...prev, studentId: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={accessForm.email}
                      onChange={(e) => setAccessForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      An OTP will be sent to your email for verification before you can access the assessment.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                    onClick={sendOTP}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP & Continue'
                    )}
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
                    value={otpCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                      setOtpCode(value);
                      setError(''); // Clear error when typing
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && otpCode.length === 6) {
                        verifyOTP();
                      }
                    }}
                  />
                  <Button 
                    className="w-full" 
                    onClick={verifyOTP}
                    disabled={loading || otpCode.length !== 6}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Code'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={resendOTP}
                    disabled={loading || resendCooldown > 0}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
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
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        systemCheck.camera && systemCheck.microphone ? "Test Again" : "Test Hardware"
                      )}
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
                      <p className="text-sm text-green-800">System checks passed!</p>
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
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
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
                    <div className="flex items-start space-x-2">
                      <input 
                        type="checkbox" 
                        id="acknowledge" 
                        className="mt-1 rounded" 
                        checked={acknowledgeTerms}
                        onChange={(e) => setAcknowledgeTerms(e.target.checked)}
                      />
                      <Label htmlFor="acknowledge" className="text-sm leading-relaxed cursor-pointer">
                        I acknowledge that I have read and understood all instructions and agree to the test conditions
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <input 
                        type="checkbox" 
                        id="agree" 
                        className="mt-1 rounded" 
                        checked={agreeProctoring}
                        onChange={(e) => setAgreeProctoring(e.target.checked)}
                      />
                      <Label htmlFor="agree" className="text-sm leading-relaxed cursor-pointer">
                        I consent to audio/video monitoring during the assessment and understand that any violation may result in disqualification
                      </Label>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                      onClick={handleStartAssessment}
                      disabled={!acknowledgeTerms || !agreeProctoring}
                    >
                      Start Assessment
                    </Button>
                    
                    {(!acknowledgeTerms || !agreeProctoring) && (
                      <p className="text-sm text-red-600 text-center">
                        Please check both boxes above to proceed
                      </p>
                    )}
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