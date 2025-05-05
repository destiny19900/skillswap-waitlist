import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/utils/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, learningSkills, teachingSkills, wantsToTeach, waitlistRank, points, socialActions } = body;
    
    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // ====== STEP 1: SEND EMAIL CONFIRMATION FIRST ======
    // Configure email transporter with SMTP credentials from .env.local
    const transportConfig = {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      },
      debug: false // Disable debug mode for production
    };
    
    const transporter = nodemailer.createTransport(transportConfig);
    
    // Verify SMTP connection first
    try {
      await transporter.verify();
    } catch (verifyError: any) {
      return NextResponse.json(
        { 
          error: `SMTP connection failed: ${verifyError.message}`,
          details: verifyError
        },
        { status: 500 }
      );
    }
    
    // Prepare email content
    const mailOptions = {
      from: 'SkillPod <skillpod.waitlist@buildera.dev>',
      to: email,
      subject: `Welcome to the SkillPod Waitlist! 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; color: #1a1b1e; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7e42f5; font-size: 32px; margin: 0;">SkillPod</h1>
          </div>
          
          <h1 style="color: #7e42f5; text-align: center; margin-bottom: 20px;">Welcome to SkillPod, ${name}!</h1>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px; color: #1a1b1e;">
            Congratulations on joining our waitlist! We're excited to have you as part of our growing community.
          </p>
          
          <div style="background-color: rgba(126, 66, 245, 0.1); border-radius: 8px; padding: 15px; margin: 25px 0; border-left: 4px solid #7e42f5;">
            <p style="font-size: 16px; margin: 0; color: #1a1b1e;">Your current waitlist position: <strong style="color: #7e42f5;">#${waitlistRank}</strong></p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #1a1b1e;">
            While you wait, you can follow our journey and get updates:
          </p>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="https://twitter.com/Skill_Pod" style="display: inline-block; margin: 0 15px; color: #1DA1F2; text-decoration: none;">
              <div style="text-align: center;">
                <div style="font-size: 30px; margin-bottom: 5px;">𝕏</div>
                <div>Follow on Twitter</div>
              </div>
            </a>
            
            <a href="https://t.me/skill_pod" style="display: inline-block; margin: 0 15px; color: #0088cc; text-decoration: none;">
              <div style="text-align: center;">
                <div style="font-size: 30px; margin-bottom: 5px;">✈️</div>
                <div>Join our Telegram</div>
              </div>
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px; color: #1a1b1e;">
            We'll send you updates as we get closer to launch. You'll be among the first to access SkillPod when we're ready!
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #1a1b1e;">
            If you have any questions, feel free to reach out to us at <a href="mailto:skillpod@buildera.dev" style="color: #7e42f5;">skillpod@buildera.dev</a>.
          </p>
          
          <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; color: #6b7280;">
            <p style="font-size: 14px;">
              SkillPod Team<br>
              © ${new Date().getFullYear()} SkillPod. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };
    
    // Send the email
    let emailSuccess = false;
    let emailId = '';
    
    try {
      const info = await transporter.sendMail(mailOptions);
      emailSuccess = true;
      emailId = info.messageId;
    } catch (error: any) {
      return NextResponse.json(
        { 
          error: `Failed to send confirmation email: ${error.message}`,
          details: error
        },
        { status: 500 }
      );
    }
    
    // ====== STEP 2: SUBMIT TO FIREBASE FIRESTORE AFTER EMAIL SUCCESS ======
    let firestoreSuccess = false;
    let firestoreId = '';
    
    try {
      const docRef = await addDoc(collection(db, 'waitlist'), {
        name,
        email,
        learningSkills: learningSkills || [],
        teachingSkills: teachingSkills || [],
        wantsToTeach: wantsToTeach || false,
        waitlistRank,
        points: points || 0,
        socialActions: socialActions || {
          sharedTwitter: false,
          joinedDiscord: false,
          invitedFriends: false
        },
        createdAt: serverTimestamp(),
        emailSent: true,
        emailId: emailId,
      });
      
      firestoreSuccess = true;
      firestoreId = docRef.id;
      
      // Trigger a waitlist count refresh
      try {
        // This will update the global counter by calling the count API
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/waitlist/count`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
      } catch (countError) {
        console.error('Failed to refresh waitlist count, but registration succeeded:', countError);
        // Don't fail the request if this doesn't work
      }
    } catch (error: any) {
      // Even if Firestore fails, we still return success since email was sent
      return NextResponse.json({ 
        partialSuccess: true,
        emailId,
        message: 'Confirmation email sent but failed to add to waitlist database',
        error: error.message
      });
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      firestoreId,
      emailId,
      message: 'Successfully added to waitlist and sent confirmation email'
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Failed to process waitlist request',
        details: error
      },
      { status: 500 }
    );
  }
} 