'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Shield,
  Plus,
  Clock,
  AlertTriangle,
  TrendingUp,
  FileText,
  Monitor,
  Settings,
  Mail,
  Download
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats] = useState({
    totalTests: 24,
    activeTests: 8,
    totalStudents: 1247,
    recentViolations: 12,
    averageScore: 78.5,
    completionRate: 89.2
  });

  const recentActivity = [
    { id: 1, type: 'test_created', description: 'React Developer Assessment created', time: '2 hours ago', user: 'John Admin' },
    { id: 2, type: 'violation', description: 'Tab switch detected - Alice Johnson', time: '3 hours ago', severity: 'medium' },
    { id: 3, type: 'test_completed', description: 'Full Stack Assessment completed by Bob Smith', time: '4 hours ago', score: '85%' },
    { id: 4, type: 'test_started', description: 'Python Developer Test started by 15 candidates', time: '5 hours ago', count: 15 },
  ];

  const activeTests = [
    { id: 1, title: 'React Developer Assessment', candidates: 23, duration: '90 mins', status: 'active', violations: 2 },
    { id: 2, title: 'Python Backend Test', candidates: 15, duration: '120 mins', status: 'active', violations: 0 },
    { id: 3, title: 'Full Stack Challenge', candidates: 8, duration: '180 mins', status: 'active', violations: 1 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-blue-600 rounded-lg p-2">
                  <Monitor className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">ExamFlow</span>
              </Link>
              <Badge variant="outline">Admin Portal</Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Test
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Tests</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalTests}</p>
                  <p className="text-blue-700 text-xs mt-1">+3 this week</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Active Tests</p>
                  <p className="text-3xl font-bold text-green-900">{stats.activeTests}</p>
                  <p className="text-green-700 text-xs mt-1">Currently running</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.totalStudents.toLocaleString()}</p>
                  <p className="text-purple-700 text-xs mt-1">+127 this month</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Avg. Score</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.averageScore}%</p>
                  <p className="text-orange-700 text-xs mt-1">+2.3% improvement</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest events across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'violation' ? 'bg-red-100' :
                          activity.type === 'test_completed' ? 'bg-green-100' :
                          activity.type === 'test_created' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {activity.type === 'violation' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                          {activity.type === 'test_completed' && <FileText className="h-4 w-4 text-green-600" />}
                          {activity.type === 'test_created' && <Plus className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'test_started' && <Clock className="h-4 w-4 text-gray-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        {activity.severity && (
                          <Badge variant={activity.severity === 'medium' ? 'destructive' : 'secondary'}>
                            {activity.severity}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Tests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="h-5 w-5 mr-2" />
                    Active Tests
                  </CardTitle>
                  <CardDescription>Tests currently in progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeTests.map((test) => (
                      <div key={test.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{test.title}</h4>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {test.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{test.candidates} candidates</span>
                          <span>{test.duration}</span>
                        </div>
                        {test.violations > 0 && (
                          <div className="mt-2 flex items-center text-red-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span className="text-sm">{test.violations} violations detected</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Active Tests
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Test Management</h2>
                <p className="text-gray-600">Create, manage, and configure your assessments</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Import Questions
                </Button>
                <Link href="/admin/tests/create">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Test
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Create Test</h3>
                  <p className="text-sm text-gray-600">Start building a new assessment</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Question Bank</h3>
                  <p className="text-sm text-gray-600">Manage your question library</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">Templates</h3>
                  <p className="text-sm text-gray-600">Use pre-built test templates</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Live Monitoring</h2>
              <p className="text-gray-600">Real-time surveillance of ongoing assessments</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Proctoring Dashboard
                </CardTitle>
                <CardDescription>Monitor test integrity in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Monitor className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No Active Monitoring Sessions</h3>
                  <p className="text-gray-600">Real-time monitoring will appear here when tests are active</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Analytics & Reports</h2>
              <p className="text-gray-600">Comprehensive insights into test performance</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Score</span>
                      <span className="font-semibold">{stats.averageScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Completion Rate</span>
                      <span className="font-semibold">{stats.completionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Assessments</span>
                      <span className="font-semibold">{stats.totalTests}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Recent Violations</span>
                      <span className="font-semibold text-red-600">{stats.recentViolations}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Monitoring</span>
                      <span className="font-semibold text-green-600">{stats.activeTests}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Integrity Score</span>
                      <span className="font-semibold">95.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Platform Settings</h2>
              <p className="text-gray-600">Configure system preferences and security settings</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Configure Proctoring Rules
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Manage Access Controls
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Violation Thresholds
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Configure SMTP Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Email Templates
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Notification Rules
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}