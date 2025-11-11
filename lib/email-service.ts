// Email notification service for task assignments
// Uses a serverless function or email service API

export interface EmailNotification {
  to: string
  toName: string
  taskTitle: string
  taskDescription: string
  assignedBy: string
  taskId?: string
}

export async function sendTaskAssignmentEmail(notification: EmailNotification): Promise<boolean> {
  try {
    // Call our API endpoint to send the email
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Email API response:', data)
      // Return true even if simulated (still successful API call)
      return true
    } else {
      console.warn('⚠️ Email API returned error:', data)
      // Don't throw error - just log and return false
      return false
    }
  } catch (error) {
    console.error('❌ Error calling email API:', error)
    // Don't throw - just return false so task creation continues
    return false
  }
}

function generateHTMLEmail(notification: EmailNotification): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 30px;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }
        .task-details {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #8B5CF6;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0;">✓ New Task Assigned</h1>
      </div>
      <div class="content">
        <p>Hi <strong>${notification.toName}</strong>,</p>
        <p>You have been assigned a new task by <strong>${notification.assignedBy}</strong>.</p>
        
        <div class="task-details">
          <h3 style="margin-top: 0; color: #8B5CF6;">📋 ${notification.taskTitle}</h3>
          <p style="color: #6b7280; margin-bottom: 0;">${notification.taskDescription}</p>
        </div>
        
        <p>Please log in to Taskify to view and manage this task.</p>
        
        <a href="https://taskify.app/dashboard" class="button">View Task</a>
      </div>
      <div class="footer">
        <p>© 2025 Taskify. Built with ❤️ for productive teams.</p>
      </div>
    </body>
    </html>
  `
}
