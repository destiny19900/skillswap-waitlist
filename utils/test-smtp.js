// SMTP Test Script
// Run with: node utils/test-smtp.js

require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testSMTP() {
  console.log('SMTP Test Started');
  console.log('Using configuration:');
  console.log('- Host:', process.env.SMTP_HOST);
  console.log('- Port:', process.env.SMTP_PORT);
  console.log('- Secure:', process.env.SMTP_SECURE);
  console.log('- Username:', process.env.SMTP_USER);
  console.log('- From:', process.env.SMTP_FROM);
  
  try {
    // Create test account if no credentials
    let testAccount;
    let customTransport = true;
    
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log('\nNo SMTP credentials found. Creating test account...');
      customTransport = false;
      testAccount = await nodemailer.createTestAccount();
      console.log('Test account created:', testAccount.user);
    }
    
    // Configure transporter
    const transportConfig = customTransport ? {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      // Add this debug option to see detailed logs
      debug: true,
      // Add this to allow self-signed certificates (if that's an issue)
      tls: {
        rejectUnauthorized: false
      }
    } : {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      debug: true
    };
    
    console.log('\nCreating transporter with config:', JSON.stringify(transportConfig, null, 2));
    const transporter = nodemailer.createTransport(transportConfig);
    
    // Verify connection
    console.log('\nVerifying connection...');
    await transporter.verify();
    console.log('Server is ready to take messages');
    
    // Send test email
    console.log('\nSending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Test <test@example.com>',
      to: 'skillpod@buildera.dev',
      subject: 'SMTP Test Email',
      text: 'If you receive this, SMTP is working correctly!',
      html: '<b>If you receive this, SMTP is working correctly!</b>',
    });
    
    console.log('Message sent: %s', info.messageId);
    
    // Preview URL (for ethereal email)
    if (!customTransport) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    console.log('\nSMTP test completed successfully!');
  } catch (error) {
    console.error('\nError during SMTP test:');
    console.error(error);
    
    if (error.code === 'EAUTH') {
      console.log('\nAuthentication error. Check your username and password.');
    } else if (error.code === 'ESOCKET') {
      console.log('\nSocket error. Check your host and port settings.');
    } else if (error.code === 'ECONNECTION') {
      console.log('\nConnection error. Make sure the SMTP server is reachable.');
    }
    
    console.log('\nTrying with alternative TLS settings...');
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      await transporter.verify();
      console.log('Alternative TLS settings work! Use these settings in your app.');
    } catch (err) {
      console.error('Alternative settings also failed:', err.message);
    }
  }
}

testSMTP(); 