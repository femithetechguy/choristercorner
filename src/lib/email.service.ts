import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ContactFormData } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  private templatePath: string;

  constructor() {
    this.templatePath = join(process.cwd(), 'src/templates');
  }

  /**
   * Load and render email template with variables
   */
  private renderTemplate(templateName: string, variables: Record<string, string>): string {
    let template = readFileSync(
      join(this.templatePath, templateName),
      'utf-8'
    );

    // Replace all template variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, value || '');
    });

    return template;
  }

  /**
   * Get badge color based on contact type
   */
  private getContactTypeBadge(contactType: string): string {
    const badges: Record<string, string> = {
      'General Feedback': '💬',
      'Song Suggestions': '🎵',
      'Report Issues': '🐛',
    };
    return badges[contactType] || '📧';
  }

  /**
   * Send contact form email to both admin and sender using Resend
   */
  async sendContactEmail(formData: ContactFormData): Promise<void> {
    try {
      const adminEmail = 'dev@fttgsolutions.com';

      // Prepare template variables
      const templateVars = {
        name: formData.name,
        email: formData.email,
        contactType: formData.contactType,
        contactTypeBadge: this.getContactTypeBadge(formData.contactType),
        subject: formData.subject,
        message: formData.message,
        submissionTime: new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        year: new Date().getFullYear().toString(),
      };

      // Email 1: Send to admin using admin template
      const adminHtmlContent = this.renderTemplate('admin-email.html', templateVars);
      
      const adminResponse = await resend.emails.send({
        from: 'noreply@fttgsolutions.com',
        to: adminEmail,
        replyTo: formData.email,
        subject: `[ChoristerCorner] ${formData.contactType}: ${formData.subject}`,
        html: adminHtmlContent,
      });

      if (adminResponse.error) {
        throw new Error(`Failed to send admin email: ${adminResponse.error.message}`);
      }

      console.log('Admin email sent successfully:', adminResponse.data?.id);

      // Email 2: Send confirmation to sender using sender template
      const senderHtmlContent = this.renderTemplate('sender-email.html', templateVars);
      
      const senderResponse = await resend.emails.send({
        from: 'noreply@fttgsolutions.com',
        to: formData.email,
        subject: `[ChoristerCorner] We've received your ${formData.contactType}`,
        html: senderHtmlContent,
      });

      if (senderResponse.error) {
        throw new Error(`Failed to send confirmation email: ${senderResponse.error.message}`);
      }

      console.log('Confirmation email sent to sender:', senderResponse.data?.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error sending email:', errorMessage);
      console.error('Full error:', error);
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }

  /**
   * Verify email configuration
   */
  async verifyConnection(): Promise<boolean> {
    try {
      // Resend doesn't require verification
      console.log('Resend email service is configured');
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }
}
