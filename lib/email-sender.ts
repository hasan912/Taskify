// Email sending service using Nodemailer + Gmail SMTP
import nodemailer from 'nodemailer'

// Create reusable transporter with better configuration
const createTransporter = () => {
  // Check if Gmail credentials are available
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️ Gmail credentials not found. Email sending will be simulated.')
    return null
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, ''), // Remove spaces
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
  })
}

export interface EmailOptions {
  to: string
  toName: string
  taskTitle: string
  taskDescription: string
  assignedBy: string
}

export async function sendTaskEmail({ to, toName, taskTitle, taskDescription, assignedBy }: EmailOptions) {
  const transporter = createTransporter()

  // If no transporter, simulate email
  if (!transporter) {
    console.log('📧 Email Simulation (no Gmail credentials):')
    console.log('To:', to)
    console.log('Subject:', `New Task Assigned: ${taskTitle}`)
    console.log('From:', assignedBy)
    console.log('Body:', taskDescription)
    return { success: true, simulated: true }
  }

  try {
    const mailOptions = {
      from: `"Taskify App" <${process.env.GMAIL_USER}>`,
      to,
      subject: `🎯 New Task Assigned: ${taskTitle}`,
      html: generateEmailHTML({ toName, taskTitle, taskDescription, assignedBy }),
    }

    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ Email sent successfully!')
    console.log('Message ID:', info.messageId)
    console.log('To:', to)
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    throw error
  }
}

function generateEmailHTML({ 
  toName, 
  taskTitle, 
  taskDescription, 
  assignedBy 
}: {
  toName: string
  taskTitle: string
  taskDescription: string
  assignedBy: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Task Assigned</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">✓ Taskify</h1>
            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">New Task Assigned</p>
          </td>
        </tr>
        
        <!-- Body -->
        <tr> 
          <td style="padding: 40px;">
            <p style="font-size: 16px; margin: 0 0 20px 0;">Asalam U Alaikum <strong>${toName}</strong>,</p>
            <p style="font-size: 16px; margin: 0 0 30px 0;">New Task Has Been Assigned To You From <strong>${assignedBy}</strong>.</p>
            
            <div style="background-color: #f9fafb; padding: 24px; border-radius: 8px; border-left: 4px solid #8B5CF6; margin: 20px 0;">
              <h3 style="margin: 0 0 12px 0; color: #8B5CF6; font-size: 20px;">📋 ${taskTitle}</h3>
              <p style="color: #6b7280; margin: 0; font-size: 15px; line-height: 1.6;">${taskDescription}</p>
            </div>
            
            <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>👤 Assigned By:</strong> ${assignedBy}
              </p>
            </div>
            
            <p style="font-size: 16px; margin: 30px 0 20px 0;">Login Taskify and See Your Assign Tasks</p>
            
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <a href="http://localhost:3000/dashboard" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
                    View Task Dashboard →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
              📧 This is an automated notification from Taskify
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2025 Taskify. Built Form Muhammad Hasan Baig
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
