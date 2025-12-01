'use client';

import { useState } from 'react';
import { Mail, Music, Bug, Clock, Globe, Heart } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { ContactFormData } from '@/types';
import appConfig from '@/data/app.json';

const iconMap: { [key: string]: any } = {
  Heart,
  Music,
  Bug,
};

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const config = appConfig as any;

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Mail className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">{config.contact.header.title}</h1>
          <p className="text-gray-600">
            {config.contact.header.description}
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {config.contact.options.map((option: any) => {
            const Icon = iconMap[option.icon];
            const colorClasses: { [key: string]: string } = {
              feedback: 'text-purple-600',
              suggestions: 'text-blue-600',
              issues: 'text-red-600',
            };
            const buttonClasses: { [key: string]: string } = {
              feedback: 'bg-purple-600 hover:bg-purple-700',
              suggestions: 'bg-blue-600 hover:bg-blue-700',
              issues: 'bg-red-600 hover:bg-red-700',
            };
            return (
              <div key={option.id} className="card-animated bg-white rounded-lg shadow p-6 text-center">
                {Icon && <Icon className={`w-10 h-10 ${colorClasses[option.id]} mx-auto mb-4`} />}
                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
                <button className={`mt-4 text-white px-6 py-2 rounded-lg transition ${buttonClasses[option.id]}`}>
                  {option.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">{config.contact.form.title}</h2>
            <p className="text-gray-600 mb-6">{config.contact.form.description}</p>
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
                <a href="mailto:dev@fttgsolutions.com" className="text-purple-600 hover:text-purple-700 hover:underline transition">
                  dev@fttgsolutions.com
                </a>
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
