import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email.service';
import { ContactFormData } from '@/types';

// Force Node.js runtime (required for Nodemailer)
export const runtime = 'nodejs';

// Initialize email service
const emailService = new EmailService();

/**
 * POST /api/contact
 * Handles contact form submissions and sends emails
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request is JSON
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Parse request body
    const body: ContactFormData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message', 'contactType'];
    const missingFields = requiredFields.filter(
      (field) => !body[field as keyof ContactFormData]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate contact type
    const validTypes = ['General Feedback', 'Song Suggestions', 'Report Issues'];
    if (!validTypes.includes(body.contactType)) {
      return NextResponse.json(
        { error: 'Invalid contact type' },
        { status: 400 }
      );
    }

    // Send email
    await emailService.sendContactEmail(body);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully! We will get back to you soon.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    
    // Get more detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
 * Health check endpoint for email service
 */
export async function GET() {
  try {
    const isConnected = await emailService.verifyConnection();

    if (isConnected) {
      return NextResponse.json(
        { status: 'Email service is operational' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Email service connection failed' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Email service check error:', error);
    return NextResponse.json(
      { error: 'Unable to verify email service' },
      { status: 500 }
    );
  }
}
