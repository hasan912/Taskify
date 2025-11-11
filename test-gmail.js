// Quick test script to verify Gmail SMTP connection
require('dotenv').config({ path: '.env.local' })
const nodemailer = require('nodemailer')

async function testGmailConnection() {
  console.log('🧪 Testing Gmail SMTP Connection...\n')
  
  // Check credentials
  console.log('📋 Credentials Check:')
  console.log('GMAIL_USER:', process.env.GMAIL_USER || '❌ NOT SET')
  console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✅ SET' : '❌ NOT SET')
  console.log('')
  
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('❌ Gmail credentials not found in .env.local')
    return
  }
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, ''),
    },
    tls: {
      rejectUnauthorized: false
    }
  })
  
  // Verify connection
  try {
    console.log('🔌 Connecting to Gmail SMTP...')
    await transporter.verify()
    console.log('✅ Gmail SMTP connection successful!\n')
    
    // Send test email
    console.log('📧 Sending test email...')
    const info = await transporter.sendMail({
      from: `"Taskify Test" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: '🎯 Taskify Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #8B5CF6;">✅ Email Test Successful!</h2>
          <p>Your Taskify email service is working correctly.</p>
          <p><strong>Configuration:</strong></p>
          <ul>
            <li>Gmail User: ${process.env.GMAIL_USER}</li>
            <li>SMTP Server: smtp.gmail.com</li>
            <li>Port: 587 (TLS)</li>
          </ul>
          <p style="color: #6b7280; font-size: 14px;">
            Time: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    })
    
    console.log('✅ Test email sent successfully!')
    console.log('📬 Message ID:', info.messageId)
    console.log('📧 Check your inbox:', process.env.GMAIL_USER)
    console.log('\n🎉 Gmail SMTP is configured correctly!')
    
  } catch (error) {
    console.error('\n❌ Gmail SMTP Error:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check if App Password is correct (16 digits, no spaces)')
    console.log('2. Verify 2-Step Verification is enabled on Google Account')
    console.log('3. Generate new App Password: https://myaccount.google.com/apppasswords')
    console.log('4. Check internet connection')
  }
}

testGmailConnection()
