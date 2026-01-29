/**
 * EmailJS Test Script
 * 
 * This script tests the EmailJS configuration by sending a test email.
 * Run with: node test-email.js
 * 
 * Requirements: 7.5, 7.6, 7.7
 */

import emailjs from '@emailjs/browser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// EmailJS configuration
const config = {
  serviceId: process.env.VITE_EMAILJS_SERVICE_ID,
  templateId: process.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.VITE_EMAILJS_PUBLIC_KEY,
};

// Validate configuration
function validateConfig() {
  const missing = [];
  
  if (!config.serviceId) missing.push('VITE_EMAILJS_SERVICE_ID');
  if (!config.templateId) missing.push('VITE_EMAILJS_TEMPLATE_ID');
  if (!config.publicKey) missing.push('VITE_EMAILJS_PUBLIC_KEY');
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    console.error('Please check your .env file');
    return false;
  }
  
  console.log('✅ All environment variables are set');
  return true;
}

// Test email data
const testData = {
  from_name: 'Test User',
  from_email: 'test@example.com',
  company: 'Test Company Inc.',
  role: 'QA Engineer',
  message: 'This is a test email from the EmailJS configuration test script. If you receive this, the email service is working correctly!',
  interested_items: '1. React.js (skill) - Frontend Development\n2. Node.js (skill) - Backend Development\n3. AWS (skill) - Cloud Services\n4. NeuralTalk AI (project) - AI/ML Projects',
  order_date: new Date().toLocaleString(),
  item_count: 4,
};

// Send test email
async function sendTestEmail() {
  console.log('\n📧 Sending test email...');
  console.log('Service ID:', config.serviceId);
  console.log('Template ID:', config.templateId);
  console.log('Public Key:', config.publicKey.substring(0, 10) + '...');
  console.log('\nTest Data:');
  console.log('- From:', testData.from_name, `<${testData.from_email}>`);
  console.log('- Company:', testData.company);
  console.log('- Role:', testData.role);
  console.log('- Items:', testData.item_count);
  console.log('- Message:', testData.message.substring(0, 50) + '...');
  
  try {
    // Initialize EmailJS
    emailjs.init(config.publicKey);
    
    // Send email
    const response = await emailjs.send(
      config.serviceId,
      config.templateId,
      testData
    );
    
    if (response.status === 200) {
      console.log('\n✅ Test email sent successfully!');
      console.log('Response:', response);
      console.log('\n📬 Check digitaldk.in@gmail.com for the test email');
      console.log('Subject: New Portfolio Inquiry from Test User');
      return true;
    } else {
      console.error('\n❌ Email sending failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('\n❌ Failed to send test email:');
    console.error('Error:', error.message || error);
    
    if (error.text) {
      console.error('Details:', error.text);
    }
    
    console.error('\nTroubleshooting:');
    console.error('1. Verify EmailJS service is active in dashboard');
    console.error('2. Verify template exists and has correct variables');
    console.error('3. Check that public key is correct');
    console.error('4. Ensure you have not exceeded the free tier limit (200 emails/month)');
    
    return false;
  }
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('EmailJS Configuration Test');
  console.log('='.repeat(60));
  
  // Validate configuration
  if (!validateConfig()) {
    process.exit(1);
  }
  
  // Send test email
  const success = await sendTestEmail();
  
  console.log('\n' + '='.repeat(60));
  console.log(success ? '✅ Test completed successfully' : '❌ Test failed');
  console.log('='.repeat(60));
  
  process.exit(success ? 0 : 1);
}

// Run the test
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
