// lib/email.ts
import nodemailer from 'nodemailer';

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp@webhuset.no',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true' || true, // Using SSL
  auth: {
    user: process.env.EMAIL_USER || 'hey@hepta.biz',
    pass: process.env.EMAIL_PASS || '!NyttPassord123',
  },
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: any[];
}

/**
 * Send an email using Nodemailer
 */
export async function sendEmail(options: EmailOptions) {
  const { to, subject, html, text, from, replyTo, attachments } = options;
  
  const mailOptions = {
    from: from || process.env.EMAIL_FROM || 'Hepta <hey@hepta.biz>',
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version if not provided
    replyTo,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}