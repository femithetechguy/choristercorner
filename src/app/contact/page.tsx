'use client';

import { useState } from 'react';
import { Mail, Music, Bug, Clock, Globe, Heart } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { ContactFormData } from '@/types';

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      // TODO: Integrate with EmailJS
      // const emailjs = await import('@emailjs/browser');
      // await emailjs.send(
      //   process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      //   process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      //   {
      //     to_email: 'contact@choristercorner.com',
      //     from_name: data.name,
      //     from_email: data.email,
      //     contact_type: data.contactType,
      //     subject: data.subject,
      //     message: data.message,
      //   }
      // );

      // For now, just log the data
      console.log('Form data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Mail className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Get in Touch</h1>
          <p className="text-gray-600">
            We&apos;d love to hear from you! Whether you have feedback, suggestions, or need support,
            we&apos;re here to help make ChoristerCorner better for everyone.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Heart className="w-10 h-10 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">General Feedback</h3>
            <p className="text-gray-600 text-sm">Share your thoughts and experiences</p>
            <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
              Give Feedback
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Music className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Song Suggestions</h3>
            <p className="text-gray-600 text-sm">Suggest songs to add to our library</p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Suggest Song
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Bug className="w-10 h-10 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Report Issues</h3>
            <p className="text-gray-600 text-sm">Found a bug or have technical issues?</p>
            <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
              Report Bug
            </button>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Contact Form</h2>
            <p className="text-gray-600 mb-6">Currently showing: General Contact</p>
            <ContactForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-purple-600 mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </h3>
                <p className="text-gray-700">contact@choristercorner.com</p>
              </div>

              <div>
                <h3 className="font-bold text-purple-600 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Response Time</span>
                </h3>
                <p className="text-gray-700">Within 24-48 hours</p>
              </div>

              <div>
                <h3 className="font-bold text-purple-600 mb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span>Languages</span>
                </h3>
                <p className="text-gray-700">English</p>
              </div>

              <hr />

              <div>
                <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-purple-100 transition"
                    aria-label="GitHub"
                  >
                    🐙
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-purple-100 transition"
                    aria-label="Twitter"
                  >
                    𝕏
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-purple-100 transition"
                    aria-label="Facebook"
                  >
                    f
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
