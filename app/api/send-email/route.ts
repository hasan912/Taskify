import { NextRequest, NextResponse } from 'next/server'
import { sendTaskEmail } from '@/lib/email-sender'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, toName, taskTitle, taskDescription, assignedBy } = body

    console.log('📧 Processing Email Notification Request:')
    console.log('To:', to, '(' + toName + ')')
    console.log('Subject:', `New Task Assigned: ${taskTitle}`)
    console.log('From:', assignedBy)
    
    // Send email using Gmail SMTP via Nodemailer
    const result = await sendTaskEmail({
      to,
      toName,
      taskTitle,
      taskDescription,
      assignedBy,
    })
    
    if (result.simulated) {
      console.log('⚠️ Email simulated - Gmail credentials not configured')
      return NextResponse.json({ 
        success: true, 
        simulated: true,
        message: 'Email simulated (configure Gmail credentials to send real emails)',
        details: { to, subject: `New Task Assigned: ${taskTitle}` }
      })
    }
    
    console.log('✅ Email sent successfully via Gmail!')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email notification sent successfully via Gmail',
      details: {
        to,
        subject: `New Task Assigned: ${taskTitle}`,
        messageId: result.messageId,
      }
    })
  } catch (error) {
    console.error('❌ Email sending error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
