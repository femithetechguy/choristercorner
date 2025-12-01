// EmailJS Configuration
// Sign up at https://www.emailjs.com/ to get your service ID, template ID, and public key

export const emailJSConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
};

// Initialize EmailJS (to be used in your app)
// import emailjs from '@emailjs/browser';
//
// emailjs.init(emailJSConfig.publicKey);
//
// export const sendEmail = async (templateParams: any) => {
//   try {
//     const response = await emailjs.send(
//       emailJSConfig.serviceId,
//       emailJSConfig.templateId,
//       templateParams
//     );
//     return response;
//   } catch (error) {
//     console.error('Failed to send email:', error);
//     throw error;
//   }
// };
