import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, skills } = body;
    
    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }
    
    console.log('Processing contact form submission from:', email);
    
    // Configure transporter with SMTP credentials from .env.local
    const transportConfig = {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    };
    
    console.log('Using SMTP config:', {
      ...transportConfig,
      auth: {
        user: transportConfig.auth.user,
        pass: '********' // Don't log the actual password
      }
    });
    
    const transporter = nodemailer.createTransport(transportConfig);
    
    // Verify SMTP connection first
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError: any) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json(
        { error: `SMTP connection failed: ${verifyError.message}` },
        { status: 500 }
      );
    }
    
    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM || 'SkillPod Website <noreply@skillpod.com>',
      to: 'skillpod@buildera.dev',
      subject: `New Collaborator Request from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Skills/Expertise: ${skills || 'Not specified'}

Message:
${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #7e42f5;">New Collaborator Request</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Skills/Expertise:</strong> ${skills || 'Not specified'}</p>
  <div style="margin-top: 20px;">
    <h3 style="color: #3f9fff;">Message:</h3>
    <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
  </div>
  <p style="margin-top: 30px; font-size: 12px; color: #777;">This message was sent from the SkillPod website contact form.</p>
</div>
      `,
    };
    
    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully, ID:', info.messageId);
      
      return NextResponse.json({ 
        success: true,
        messageId: info.messageId
      });
    } catch (sendError: any) {
      console.error('Error sending email:', sendError);
      return NextResponse.json(
        { 
          error: 'Failed to send message',
          details: sendError.message
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Contact form general error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error.message
      },
      { status: 500 }
    );
  }
} 