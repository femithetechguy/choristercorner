import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ContactFormData } from '@/types';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private templatePath: string;

  constructor() {
    // Get email config from environment variables
    const emailConfig: EmailConfig = {
      host: process.env.EMAIL_HOST || 'mail.fttgsolutions.com',
      port: parseInt(process.env.EMAIL_PORT || '465'),
      secure: process.env.EMAIL_SECURE !== 'false', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'dev@fttgsolutions.com',
        pass: process.env.EMAIL_PASSWORD || '',
      },
    };

    this.transporter = nodemailer.createTransport(emailConfig);
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
   * Send contact form email to both admin and sender
   */
  async sendContactEmail(formData: ContactFormData): Promise<void> {
    try {
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

      // Render template
      const adminEmail = process.env.EMAIL_USER || 'dev@fttgsolutions.com';

      // Email 1: Send to admin using admin template
      const adminHtmlContent = this.renderTemplate('admin-email.html', templateVars);
      const adminMailOptions = {
        from: adminEmail,
        to: adminEmail,
        replyTo: formData.email,
        subject: `[ChoristerCorner] ${formData.contactType}: ${formData.subject}`,
        html: adminHtmlContent,
      };

      const adminInfo = await this.transporter.sendMail(adminMailOptions);
      console.log('Admin email sent successfully:', adminInfo.messageId);

      // Email 2: Send confirmation to sender using sender template
      const senderHtmlContent = this.renderTemplate('sender-email.html', templateVars);
      const senderMailOptions = {
        from: adminEmail,
        to: formData.email,
        subject: `[ChoristerCorner] We've received your ${formData.contactType}`,
        html: senderHtmlContent,
      };

      const senderInfo = await this.transporter.sendMail(senderMailOptions);
      console.log('Confirmation email sent to sender:', senderInfo.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Verify email configuration
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }
}
