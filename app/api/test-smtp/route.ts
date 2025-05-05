import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Log environment variables (redacted for security)
    const configDetails = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER ? '****' : undefined,
      pass: process.env.SMTP_PASSWORD ? '****' : undefined,
      from: process.env.SMTP_FROM,
    };

    // Configure transporter with SMTP credentials
    const transporter = nodemailer.createTransport({
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
    });
    
    // Verify connection
    let verificationStatus = "Not attempted";
    try {
      await transporter.verify();
      verificationStatus = "Success";
    } catch (verifyError: any) {
      verificationStatus = `Failed: ${verifyError.message}`;
    }
    
    // Send test email
    let sendStatus = "Not attempted";
    let messageId = null;
    
    try {
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'Test <test@example.com>',
        to: 'alvintye22@gmail.com',
        subject: 'API Test Email',
        text: 'If you receive this, SMTP API test is working!',
        html: '<b>If you receive this, SMTP API test is working!</b>',
      });
      
      sendStatus = "Success";
      messageId = info.messageId;
    } catch (sendError: any) {
      sendStatus = `Failed: ${sendError.message}`;
    }
    
    return NextResponse.json({
      success: true,
      config: configDetails,
      verification: verificationStatus,
      send: sendStatus,
      messageId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('SMTP test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 