import nodemailer from 'nodemailer';
import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { hashString } from './index.js';
import prisma from '../lib/prisma.js';

dotenv.config();

const {
  AUTH_EMAIL,
  APP_PASS,
  CLIENT_URL,
  MAILJET_API_KEY,
  MAILJET_SECRET_KEY,
} = process.env;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: AUTH_EMAIL,
    pass: APP_PASS,
  },
  debug: true,
  logger: true,
});

const mailjet = new Mailjet({
  apiKey: MAILJET_API_KEY || 'your-api-key',
  apiSecret: MAILJET_SECRET_KEY || 'your-api-secret',
});

async function sendMailjetEmail(mailOptions) {
  try {
    const request = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: mailOptions.from,
            Name: 'BiddersHub',
          },
          To: [
            {
              Email: mailOptions.to,
              Name: mailOptions.toName || '',
            },
          ],
          Subject: mailOptions.subject,
          HTMLPart: mailOptions.html,
        },
      ],
    });
    return request.body;
  } catch (error) {
    console.error('Mailjet error:', error);
    throw new Error('Mailjet email sending failed');
  }
}

async function sendNodemailerEmail(mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Nodemailer error:', error);
    throw new Error('Nodemailer email sending failed');
  }
}

export async function ResendVerificationEmail(user) {
  const { id, email, username } = user;
  const token = id + uuidv4();
  const link = `${CLIENT_URL}/verifylink/${id}/${token}`;
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: 'Email Verification',
    html: `
      <div style='font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;'>
        <h3 style="color: rgb(8, 56, 188)">Please verify your email address</h3>
        <hr>
        <h4>Hi ${username},</h4>
        <p>
          Through Email Verification, we are able to know that it's really you 🧑.
          <br>
          This link <b>expires in 1 hour</b>
        </p>
        <br>
        <a href=${link} style="color: #fff; padding: 14px; text-decoration: none; background-color: #000; border-radius: 8px; font-size: 18px;">Verify Email Address</a>
        </p>
        <div style="margin-top: 20px;">
          <h5>Best Regards</h5>
          <h5>BiddersHub Team</h5>
        </div>
      </div>`,
  };

  try {
    const hashedToken = await hashString(token);

    const removeVerifRec = await prisma.verification.delete({
      where: {
        userId: id,
      },
    });
    if (removeVerifRec) {
      console.log('verifRecRemoved: ', removeVerifRec);
    }

    const newVerifiedEmail = await prisma.verification.create({
      data: {
        userId: id,
        token: hashedToken,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 3600000),
      },
    });
    console.log('newVerifiedEmailRecord: ', newVerifiedEmail);

    if (newVerifiedEmail) {
      try {
        await sendNodemailerEmail(mailOptions);
        return { success: true, emailMessage: 'Email sent' };
      } catch (error) {
        console.log('Nodemailer failed, falling back to Mailjet');
        await sendMailjetEmail(mailOptions);
        return { success: true, emailMessage: 'Email sent' }; // Assuming Mailjet succeeded
      }
    } else {
      return {
        success: false,
        error: 'Failed to create verification document',
      };
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: 'Failed to send verification email' };
  }
}
