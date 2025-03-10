import nodemailer from 'nodemailer';
import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { hashString } from './index.js';
import prisma from '../lib/prisma.js';

dotenv.config();

const {
  BIDDER_URL,
  MAILJET_API_KEY,
  MAILJET_SECRET_KEY,

  MAILER_USER,
  MAILER_HOST,
  MAILER_PORT,
  MAILER_PASSWORD,
} = process.env;

const transporter = nodemailer.createTransport({
  host: MAILER_HOST,
  port: MAILER_PORT,
  secure: false,
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASSWORD,
  },
  // debug: true, // Enable debugging output
  // logger: true, // Log to console
  tls: {
    ciphers: 'SSLv3',
    minVersion: 'TLSv1',
    rejectUnauthorized: false,
  },
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

export async function sendVerificationEmail(newUser) {
  const { id, email, username } = newUser;
  const token = id + uuidv4();
  const link = `${BIDDER_URL}/verifylink/${id}/${token}`;
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: `Congragulations ${username}`,
    html: `
      <div style='font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;'>
        <h3 style="color: rgb(8, 56, 188)">Congragulations</h3>
        <hr>
        <h4>Hi ${username},</h4>
        <p>
          You have won an item in bidding in biddersHub.
       
          <br>
           <b>We will contact you shortly</b>
        </p>
        <br>
    
        </p>
        <div style="margin-top: 20px;">
          <h5>Best Regards</h5>
          <h5>BiddersHub Team</h5>
        </div>
      </div>`,
  };
  // <a href=${link} style="color: #fff; padding: 14px; text-decoration: none; background-color: #000; border-radius: 8px; font-size: 18px;">Verify Email Address</a>

  try {
    if (username) {
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
