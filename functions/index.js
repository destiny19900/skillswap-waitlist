const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Get environment variables from Firebase functions config
// Using the correct SMTP settings from .env.local
const transportConfig = {
  host: "mail.lumicloud.com.ng",
  port: 465,
  secure: true, // Use secure for port 465
  auth: {
    user: "test@lumicloud.com.ng",
    pass: "Dollarman511"
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  },
  debug: true // Enable debug logging
};

console.log("SMTP Config (without password):", {
  ...transportConfig,
  auth: {
    user: transportConfig.auth.user,
    pass: "********"
  }
});

// Create transporter outside the function to reuse
const transporter = nodemailer.createTransport(transportConfig);

// Log a message when the function is deployed
functions.logger.info("Firebase functions deployed with SMTP configuration", transportConfig.host);

// Cloud function to send congratulations email when a user joins the waitlist
exports.sendWelcomeEmail = functions.firestore
  .document("waitlist/{userId}")
  .onCreate(async (snap, context) => {
    const newUser = snap.data();
    
    // Get user data from the document
    const { email, name, waitlistRank } = newUser;
    
    if (!email) {
      console.error("No email found for new waitlist member");
      return null;
    }
    
    // Log the email being sent
    functions.logger.info(`Preparing to send welcome email to ${email}`);
    
    // Email content
    const mailOptions = {
      from: "test@lumicloud.com.ng", // Use the actual SMTP from address
      to: email,
      subject: "Welcome to the SkillPod Waitlist! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1b1e; color: #ffffff; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://skillpod.app/assets/logo.png" alt="SkillPod Logo" style="height: 60px;" />
          </div>
          
          <h1 style="color: #7e42f5; text-align: center; margin-bottom: 20px;">Welcome to SkillPod, ${name}!</h1>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
            Congratulations on joining our waitlist! We're excited to have you as part of our growing community.
          </p>
          
          <div style="background-color: rgba(126, 66, 245, 0.1); border-radius: 8px; padding: 15px; margin: 25px 0; border-left: 4px solid #7e42f5;">
            <p style="font-size: 16px; margin: 0;">Your current waitlist position: <strong style="color: #7e42f5;">#${waitlistRank}</strong></p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
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
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
            We'll send you updates as we get closer to launch. You'll be among the first to access SkillPod when we're ready!
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            If you have any questions, feel free to reach out to us at <a href="mailto:support@skillpod.app" style="color: #7e42f5;">support@skillpod.app</a>.
          </p>
          
          <div style="text-align: center; border-top: 1px solid #333; padding-top: 20px; color: #777;">
            <p style="font-size: 14px;">
              SkillPod Team<br>
              © ${new Date().getFullYear()} SkillPod. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };
    
    // First verify the SMTP connection
    try {
      functions.logger.info("Verifying SMTP connection...");
      await transporter.verify();
      functions.logger.info("SMTP connection verified successfully");
    } catch (verifyError) {
      functions.logger.error("SMTP verification failed:", verifyError);
      return null;
    }
    
    // Send the email
    try {
      const info = await transporter.sendMail(mailOptions);
      functions.logger.info("Welcome email sent to:", email, "Message ID:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      functions.logger.error("Error sending welcome email:", error);
      return { success: false, error: error.message };
    }
  });

// Optional: Function to send a push notification if you implement FCM later
exports.sendWelcomeNotification = functions.firestore
  .document("waitlist/{userId}")
  .onCreate(async (snap, context) => {
    // This is a placeholder for future FCM implementation
    // You would need to store FCM tokens for this to work
    console.log("New waitlist signup:", snap.data().email);
    return null;
  }); 