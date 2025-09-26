import nodemailer from 'nodemailer';
import { invitationEmailTemplate } from './emailTemplates';

// Create a transporter for sending emails
const createTransporter = () => {
  // For development, we'll use a test account
  // In production, you'd want to use a real email service like SendGrid, AWS SES, etc.
  return nodemailer.createTransporter({
    host: 'smtp.ethereal.email', // Test SMTP server
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'test@ethereal.email',
      pass: process.env.EMAIL_PASS || 'test123',
    },
  });
};

export const sendInvitationEmail = async (
  to: string,
  inviterName: string,
  profileName: string,
  profileSlug: string,
  role: 'editor' | 'viewer'
) => {
  try {
    const transporter = createTransporter();
    const emailTemplate = invitationEmailTemplate(inviterName, profileName, profileSlug, role);

    const info = await transporter.sendMail({
      from: `"Lembra" <noreply@lembra.com>`,
      to,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
    });

    console.log('Invitation email sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// For development/testing - this will log the email instead of sending it
export const sendTestInvitationEmail = async (
  to: string,
  inviterName: string,
  profileName: string,
  profileSlug: string,
  role: 'editor' | 'viewer'
) => {
  const emailTemplate = invitationEmailTemplate(inviterName, profileName, profileSlug, role);
  
  console.log('=== INVITATION EMAIL (TEST MODE) ===');
  console.log('To:', to);
  console.log('Subject:', emailTemplate.subject);
  console.log('HTML Preview:', emailTemplate.html.substring(0, 200) + '...');
  console.log('====================================');
  
  return { success: true, messageId: 'test-' + Date.now() };
};
