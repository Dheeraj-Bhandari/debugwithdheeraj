/**
 * Newsletter Subscription API Endpoint
 * 
 * This serverless function handles newsletter subscriptions.
 * You can integrate with services like:
 * - Mailchimp
 * - SendGrid
 * - ConvertKit
 * - Or just send an email notification
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // TODO: Integrate with your email service
    // Example integrations:
    
    // 1. Mailchimp
    // const response = await fetch(`https://us1.api.mailchimp.com/3.0/lists/${LIST_ID}/members`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email_address: email,
    //     status: 'subscribed',
    //   }),
    // });

    // 2. SendGrid (send notification email)
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: 'digitaldk.in@gmail.com',
    //   from: 'noreply@debugwithdheeraj.com',
    //   subject: 'New Newsletter Subscription',
    //   text: `New subscriber: ${email}`,
    // });

    // 3. Simple logging (for now)
    console.log('New newsletter subscription:', email);

    // For now, just simulate success
    // In production, replace this with actual email service integration
    await new Promise(resolve => setTimeout(resolve, 500));

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({
      error: 'Failed to subscribe. Please try again later.',
    });
  }
}
