'use client';

import { useState } from 'react';
import { Mail, Music, Bug, Clock, Globe, Heart, X, Check } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { ContactFormData } from '@/types';
import appConfig from '@/data/app.json';

export const generateMetadata = () => ({
  title: 'Contact ChoristerCorner | Get in Touch',
  description:
    'Have questions, suggestions, or feedback? Contact ChoristerCorner to connect with our team. We\'d love to hear from you!',
  keywords: ['contact', 'support', 'feedback', 'get in touch', 'help'],
  openGraph: {
    title: 'Contact ChoristerCorner',
    description: 'Get in touch with our team or share your feedback.',
    type: 'website',
    url: 'https://choristercorner.com/contact',
  },
  alternates: {
    canonical: 'https://choristercorner.com/contact',
  },
});

const iconMap: { [key: string]: any } = {
  Heart,
  Music,
  Bug,
};

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const config = appConfig as any;

  const handleFormSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      // Send to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      const result = await response.json();
      console.log('Message sent successfully:', result);

      // Show success message
      setShowSuccess(true);
      setOpenModal(null);

      // Hide success after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error toast (optional - you can add error state management)
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to send message'}`);
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
                <button 
                  onClick={() => setOpenModal(option.id)}
                  className={`mt-4 text-white px-6 py-2 rounded-lg transition ${buttonClasses[option.id]}`}
                >
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

        {/* Modal Backdrop - Blur background instead of dark overlay */}
        {openModal && (
          <div 
            className="fixed inset-0 backdrop-blur-sm z-40 transition-all"
            onClick={() => setOpenModal(null)}
          />
        )}

        {/* Modal */}
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <div 
              className="bg-white rounded-lg shadow-2xl w-full md:max-w-2xl md:max-h-[90vh] md:overflow-y-auto animate-scale-in h-[75vh] md:h-auto overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-linear-to-r from-purple-600 to-purple-700 text-white p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {config.contact.options.find((opt: any) => opt.id === openModal)?.title}
                  </h2>
                  <p className="text-purple-100 text-sm mt-1">
                    {config.contact.options.find((opt: any) => opt.id === openModal)?.description}
                  </p>
                </div>
                <button
                  onClick={() => setOpenModal(null)}
                  className="text-white hover:bg-purple-800 p-2 rounded-full transition"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8">
                <ContactForm 
                  onSubmit={handleFormSubmit} 
                  isLoading={isLoading}
                  preselectedType={openModal}
                />
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
              <Check className="w-5 h-5" />
              <span className="font-medium">Message sent successfully! We'll get back to you soon.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
