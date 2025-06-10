export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailVariables {
  studentName: string;
  testTitle: string;
  companyName: string;
  testDate: string;
  testTime: string;
  accessCode: string;
  testDuration: string;
  testUrl: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  rank?: number;
  passStatus?: 'passed' | 'failed';
  certificateUrl?: string;
  violationCount?: number;
  violationDetails?: string;
}

export function getInvitationTemplate(variables: EmailVariables): EmailTemplate {
  return {
    subject: `Invitation: ${variables.testTitle} - ${variables.companyName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Invitation</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .info-box { background: #f8f9fa; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; }
          .highlight { background: #fef3c7; padding: 10px; border-radius: 4px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Test Invitation</h1>
            <h2>${variables.testTitle}</h2>
          </div>
          
          <div class="content">
            <p>Dear ${variables.studentName},</p>
            
            <p>You have been invited to take the online assessment for <strong>${variables.companyName}</strong>.</p>
            
            <div class="info-box">
              <h3>📋 Test Details</h3>
              <ul>
                <li><strong>Test:</strong> ${variables.testTitle}</li>
                <li><strong>Date:</strong> ${variables.testDate}</li>
                <li><strong>Time:</strong> ${variables.testTime}</li>
                <li><strong>Duration:</strong> ${variables.testDuration} minutes</li>
              </ul>
            </div>
            
            <div class="highlight">
              <h3>🔑 Access Information</h3>
              <p><strong>Access Code:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${variables.accessCode}</code></p>
            </div>
            
            <h3>📖 Important Instructions</h3>
            <ul>
              <li>Ensure you have a stable internet connection</li>
              <li>Use a modern web browser (Chrome, Firefox, Safari)</li>
              <li>Enable camera and microphone access for proctoring</li>
              <li>Find a quiet, well-lit room</li>
              <li>Keep your government ID ready for verification</li>
              <li>Do not switch tabs or minimize the browser during the test</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${variables.testUrl}" class="button">Access Test Portal</a>
            </div>
            
            <div class="info-box">
              <h3>⚠️ Important Notes</h3>
              <ul>
                <li>This test is proctored and monitored for integrity</li>
                <li>Any suspicious activity will be flagged</li>
                <li>You have only one attempt for this test</li>
                <li>Contact support if you face any technical issues</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>Best regards,<br/><strong>${variables.companyName} Team</strong></p>
            <p><small>This is an automated email. Please do not reply to this message.</small></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Test Invitation - ${variables.testTitle}
      
      Dear ${variables.studentName},
      
      You have been invited to take the online assessment for ${variables.companyName}.
      
      Test Details:
      - Test: ${variables.testTitle}
      - Date: ${variables.testDate}
      - Time: ${variables.testTime}
      - Duration: ${variables.testDuration} minutes
      
      Access Code: ${variables.accessCode}
      Test URL: ${variables.testUrl}
      
      Important Instructions:
      - Ensure stable internet connection
      - Use modern web browser
      - Enable camera and microphone
      - Find quiet, well-lit room
      - Keep government ID ready
      - Do not switch tabs during test
      
      Best regards,
      ${variables.companyName} Team
    `
  };
}

export function getResultTemplate(variables: EmailVariables): EmailTemplate {
  const passedStatus = variables.passStatus === 'passed';
  
  return {
    subject: `Test Results: ${variables.testTitle} - ${passedStatus ? 'Congratulations!' : 'Results Available'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Results</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, ${passedStatus ? '#10b981 0%, #059669 100%' : '#ef4444 0%, #dc2626 100%'}); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .score-card { background: ${passedStatus ? '#ecfdf5' : '#fef2f2'}; border: 2px solid ${passedStatus ? '#10b981' : '#ef4444'}; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .score-number { font-size: 48px; font-weight: bold; color: ${passedStatus ? '#10b981' : '#ef4444'}; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
          .info-item { background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${passedStatus ? '🎉' : '📊'} Test Results</h1>
            <h2>${variables.testTitle}</h2>
          </div>
          
          <div class="content">
            <p>Dear ${variables.studentName},</p>
            
            <p>Your test results for <strong>${variables.testTitle}</strong> conducted by <strong>${variables.companyName}</strong> are now available.</p>
            
            <div class="score-card">
              <div class="score-number">${variables.percentage}%</div>
              <h3>${variables.score}/${variables.maxScore} Points</h3>
              <h2 style="color: ${passedStatus ? '#10b981' : '#ef4444'}; margin: 10px 0;">
                ${passedStatus ? '✅ PASSED' : '❌ NOT PASSED'}
              </h2>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <h4>📊 Your Score</h4>
                <p><strong>${variables.score}/${variables.maxScore}</strong></p>
              </div>
              <div class="info-item">
                <h4>🏆 Your Rank</h4>
                <p><strong>#${variables.rank}</strong></p>
              </div>
              <div class="info-item">
                <h4>📈 Percentage</h4>
                <p><strong>${variables.percentage}%</strong></p>
              </div>
              <div class="info-item">
                <h4>✅ Status</h4>
                <p><strong>${passedStatus ? 'Passed' : 'Not Passed'}</strong></p>
              </div>
            </div>
            
            ${passedStatus && variables.certificateUrl ? `
              <div style="text-align: center; margin: 30px 0;">
                <h3>🏆 Congratulations!</h3>
                <p>You have successfully passed the assessment. Download your certificate below:</p>
                <a href="${variables.certificateUrl}" class="button">Download Certificate</a>
              </div>
            ` : ''}
            
            ${!passedStatus ? `
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>💡 Areas for Improvement</h3>
                <p>Don't worry! This is a learning opportunity. Focus on strengthening your skills in the areas covered by this test.</p>
              </div>
            ` : ''}
            
            <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <h3>📋 Test Summary</h3>
              <ul>
                <li><strong>Test:</strong> ${variables.testTitle}</li>
                <li><strong>Date:</strong> ${variables.testDate}</li>
                <li><strong>Company:</strong> ${variables.companyName}</li>
                <li><strong>Final Score:</strong> ${variables.score}/${variables.maxScore} (${variables.percentage}%)</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for taking the assessment!</p>
            <p><strong>${variables.companyName} Team</strong></p>
            <p><small>This is an automated email. Please do not reply to this message.</small></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Test Results - ${variables.testTitle}
      
      Dear ${variables.studentName},
      
      Your test results for ${variables.testTitle} are now available.
      
      Score: ${variables.score}/${variables.maxScore} (${variables.percentage}%)
      Rank: #${variables.rank}
      Status: ${passedStatus ? 'PASSED' : 'NOT PASSED'}
      
      Test Details:
      - Test: ${variables.testTitle}
      - Date: ${variables.testDate}
      - Company: ${variables.companyName}
      
      ${passedStatus ? 'Congratulations on passing the assessment!' : 'Keep learning and improving your skills!'}
      
      Best regards,
      ${variables.companyName} Team
    `
  };
}

export function getReminderTemplate(variables: EmailVariables): EmailTemplate {
  return {
    subject: `Reminder: ${variables.testTitle} - Starting Soon!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Reminder</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .alert-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .checklist { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Test Reminder</h1>
            <h2>${variables.testTitle}</h2>
          </div>
          
          <div class="content">
            <p>Dear ${variables.studentName},</p>
            
            <div class="alert-box">
              <h2>🚨 Your test is starting soon!</h2>
              <p>Don't forget about your upcoming assessment.</p>
            </div>
            
            <p>This is a friendly reminder about your scheduled online assessment with <strong>${variables.companyName}</strong>.</p>
            
            <div style="background: #f8f9fa; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <h3>📅 Test Schedule</h3>
              <ul>
                <li><strong>Test:</strong> ${variables.testTitle}</li>
                <li><strong>Date:</strong> ${variables.testDate}</li>
                <li><strong>Time:</strong> ${variables.testTime}</li>
                <li><strong>Duration:</strong> ${variables.testDuration} minutes</li>
                <li><strong>Access Code:</strong> ${variables.accessCode}</li>
              </ul>
            </div>
            
            <div class="checklist">
              <h3>✅ Pre-Test Checklist</h3>
              <ul>
                <li>□ Test your internet connection</li>
                <li>□ Close unnecessary applications</li>
                <li>□ Ensure camera and microphone work</li>
                <li>□ Find a quiet, well-lit room</li>
                <li>□ Keep your ID document ready</li>
                <li>□ Clear your desk of any materials</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${variables.testUrl}" class="button">Access Test Portal</a>
            </div>
            
            <p><strong>Important:</strong> Please log in at least 10 minutes before the scheduled time to complete the system check.</p>
          </div>
          
          <div class="footer">
            <p>Good luck with your assessment!</p>
            <p><strong>${variables.companyName} Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Test Reminder - ${variables.testTitle}
      
      Dear ${variables.studentName},
      
      This is a reminder about your upcoming assessment with ${variables.companyName}.
      
      Test Schedule:
      - Date: ${variables.testDate}
      - Time: ${variables.testTime}
      - Duration: ${variables.testDuration} minutes
      - Access Code: ${variables.accessCode}
      
      Pre-Test Checklist:
      - Test internet connection
      - Close unnecessary applications
      - Ensure camera and microphone work
      - Find quiet, well-lit room
      - Keep ID document ready
      - Clear desk of materials
      
      Test URL: ${variables.testUrl}
      
      Please log in 10 minutes early for system check.
      
      Good luck!
      ${variables.companyName} Team
    `
  };
}

export function getViolationTemplate(variables: EmailVariables): EmailTemplate {
  return {
    subject: `Alert: Proctoring Violations Detected - ${variables.testTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Proctoring Violation Alert</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .alert-box { background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .violation-details { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Proctoring Alert</h1>
            <h2>Violations Detected</h2>
          </div>
          
          <div class="content">
            <div class="alert-box">
              <h3>⚠️ Attention Required</h3>
              <p>Proctoring violations have been detected during the assessment session.</p>
            </div>
            
            <h3>📋 Test Information</h3>
            <ul>
              <li><strong>Student:</strong> ${variables.studentName}</li>
              <li><strong>Test:</strong> ${variables.testTitle}</li>
              <li><strong>Date:</strong> ${variables.testDate}</li>
              <li><strong>Company:</strong> ${variables.companyName}</li>
            </ul>
            
            <div class="violation-details">
              <h3>🔍 Violation Summary</h3>
              <p><strong>Total Violations:</strong> ${variables.violationCount}</p>
              <p><strong>Details:</strong></p>
              <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 10px;">
                ${variables.violationDetails}
              </div>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3>📝 Recommended Actions</h3>
              <ul>
                <li>Review the proctoring footage</li>
                <li>Evaluate the severity of violations</li>
                <li>Consider test result validity</li>
                <li>Contact the student if necessary</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated security alert.</p>
            <p><strong>Examination Monitoring System</strong></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Proctoring Violation Alert
      
      Violations detected during assessment session.
      
      Test Information:
      - Student: ${variables.studentName}
      - Test: ${variables.testTitle}
      - Date: ${variables.testDate}
      - Company: ${variables.companyName}
      
      Violation Summary:
      - Total Violations: ${variables.violationCount}
      - Details: ${variables.violationDetails}
      
      Please review the proctoring footage and take appropriate action.
      
      Examination Monitoring System
    `
  };
}