import { useState } from 'react';
import { ContactFormData } from '@/types';

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function ContactForm({ onSubmit, isLoading = false }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    contactType: 'General Contact',
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit) {
      try {
        await onSubmit(formData);
        setSubmitted(true);
        setFormData({
          contactType: 'General Contact',
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setTimeout(() => setSubmitted(false), 3000);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Thank you! We'll get back to you soon.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Type
        </label>
        <select
          name="contactType"
          value={formData.contactType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option>General Contact</option>
          <option>Song Suggestions</option>
          <option>Report Issues</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          required
          className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
          className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">We'll use this to respond to your message</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Brief description of your inquiry"
          required
          className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message"
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
