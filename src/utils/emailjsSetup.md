/**
 * EmailJS Configuration & Setup Guide
 * 
 * This file handles sending emails through EmailJS service.
 * Follow the steps below to enable EmailJS in your app.
 */

/**
 * Step 1: Set up EmailJS
 * 1. Go to https://www.emailjs.com/
 * 2. Sign up for a free account
 * 3. Create an email service (e.g., Gmail)
 * 4. Create an email template
 * 5. Copy Service ID, Template ID, and Public Key
 * 6. Add them to your .env.local file
 */

export const emailJSConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
};

/**
 * Step 2: Initialize EmailJS
 * 
 * Uncomment the code below after adding your credentials to .env.local
 */

// import emailjs from '@emailjs/browser';
// 
// // Initialize EmailJS
// if (emailJSConfig.publicKey) {
//   emailjs.init(emailJSConfig.publicKey);
// }
//
// /**
//  * Send email function
//  * 
//  * @param templateParams - Object containing template variables
//  * @returns Promise with email response
//  */
// export const sendEmail = async (templateParams: {
//   to_email: string;
//   from_name: string;
//   from_email: string;
//   contact_type: string;
//   subject: string;
//   message: string;
// }) => {
//   try {
//     const response = await emailjs.send(
//       emailJSConfig.serviceId,
//       emailJSConfig.templateId,
//       templateParams
//     );
//     console.log('Email sent successfully:', response);
//     return response;
//   } catch (error) {
//     console.error('Failed to send email:', error);
//     throw error;
//   }
// };

/**
 * Step 3: Use in your contact form
 * 
 * In your ContactForm component, update the handleFormSubmit function:
 * 
 * import { sendEmail } from '@/utils/emailjs';
 * 
 * const handleFormSubmit = async (data: ContactFormData) => {
 *   setIsLoading(true);
 *   try {
 *     await sendEmail({
 *       to_email: 'contact@choristercorner.com',
 *       from_name: data.name,
 *       from_email: data.email,
 *       contact_type: data.contactType,
 *       subject: data.subject,
 *       message: data.message,
 *     });
 *     // Show success message
 *   } catch (error) {
 *     console.error('Error:', error);
 *   } finally {
 *     setIsLoading(false);
 *   }
 * };
 */

/**
 * Email Template Variables
 * 
 * Create a template in EmailJS dashboard with these variables:
 * - {{to_email}} - Recipient email
 * - {{from_name}} - Sender's name
 * - {{from_email}} - Sender's email
 * - {{contact_type}} - Type of contact (General, Song Suggestion, Bug Report)
 * - {{subject}} - Email subject
 * - {{message}} - Email message
 * 
 * Example template:
 * 
 * From: {{from_name}} <{{from_email}}>
 * Type: {{contact_type}}
 * Subject: {{subject}}
 * 
 * Message:
 * {{message}}
 */
