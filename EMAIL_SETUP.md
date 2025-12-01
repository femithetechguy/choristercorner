# Email Service Setup Guide

## Overview
The ChoristerCorner contact form now uses **Nodemailer with Hostinger SMTP** to send emails directly from your server.

## Architecture
- **Email Service**: `src/lib/email.service.ts` - Handles SMTP connection and email sending
- **API Route**: `src/app/api/contact/route.ts` - Handles form submissions and validation
- **Admin Email Template**: `src/templates/admin-email.html` - Email sent to you with full message details
- **Sender Email Template**: `src/templates/sender-email.html` - Confirmation email sent to the sender
- **Contact Form**: `src/components/ContactForm.tsx` - React form component

## Setup Instructions

### Step 1: Get Hostinger SMTP Credentials

1. Log in to your Hostinger account
2. Go to Email → Your Domain → Email Accounts
3. Select your email account (dev@fttgsolutions.com)
4. Look for **SMTP Settings** or **Email Client Settings**
5. Note down:
   - **SMTP Server**: Usually `mail.fttgsolutions.com` or `smtp.hostinger.com`
   - **SMTP Port**: `465` (SSL) or `587` (TLS)
   - **Username**: `dev@fttgsolutions.com` (full email address)
   - **Password**: Your email password (or app-specific password if 2FA is enabled)

### Step 2: Configure Environment Variables

1. Open `.env.local` in the root directory
2. Fill in the email configuration:

```env
# Email Service Configuration (Hostinger SMTP)
EMAIL_HOST=mail.fttgsolutions.com
EMAIL_PORT=465
EMAIL_USER=dev@fttgsolutions.com
EMAIL_PASSWORD=your_actual_password_here
EMAIL_SECURE=true
```

**Important Notes:**
- Use `EMAIL_SECURE=true` for port 465
- Use `EMAIL_SECURE=false` for port 587
- The `.env.local` file is git-ignored, so your password is safe
- Never commit `.env.local` to version control

### Step 3: Test the Email Service

**Option 1: Using the Contact Form UI**
1. Start the dev server: `npm run dev`
2. Navigate to `/contact`
3. Click one of the contact buttons (Feedback, Suggestions, Issues)
4. Fill out the form and submit
5. Check if you received the email

**Option 2: Using the Health Check Endpoint**
```bash
curl http://localhost:3000/api/contact
```

Expected response if configured correctly:
```json
{ "status": "Email service is operational" }
```

## API Endpoint

### POST `/api/contact`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Great app!",
  "message": "Love your worship songs collection",
  "contactType": "General Feedback"
}
```

**Valid Contact Types:**
- `General Feedback`
- `Song Suggestions`
- `Report Issues`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully! We will get back to you soon."
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Error description"
}
```

## Email Templates

Two separate email templates are used:

### Admin Email (`src/templates/admin-email.html`)
Sent to your admin email address with full message details organized for easy reading and response.

### Sender Email (`src/templates/sender-email.html`)
Sent to the person who submitted the form as a confirmation that you received their message.

Both templates support these dynamic variables:

- `{{name}}` - Sender's name
- `{{email}}` - Sender's email
- `{{contactType}}` - Type of inquiry
- `{{contactTypeBadge}}` - Visual emoji badge
- `{{subject}}` - Inquiry subject
- `{{message}}` - Full message body
- `{{submissionTime}}` - When submitted (auto-formatted)
- `{{year}}` - Current year for footer

To customize the email templates, edit `src/templates/admin-email.html` or `src/templates/sender-email.html` as needed. The EmailService will automatically replace all `{{variable}}` placeholders with actual values.

## Troubleshooting

### "Connection refused" error
- Check SMTP server address is correct
- Verify port number (465 vs 587)
- Ensure EMAIL_SECURE matches port (true for 465, false for 587)

### "Invalid credentials" error
- Double-check username (use full email address)
- Verify password is correct
- If using 2FA, use an app-specific password instead

### "Email not received"
- Check spam/junk folder
- Verify sender email address in EMAIL_USER
- Check email service logs: `console.log` statements will appear in server logs

### Port Connection Issues
- Port 465 requires SSL (EMAIL_SECURE=true)
- Port 587 requires TLS (EMAIL_SECURE=false)
- If unsure, try 465 first, then 587

## Email Service Logs

When emails are sent, you'll see logs in your terminal:
```
Email sent successfully: <message-id>
```

For debugging, check the server console for detailed error messages.

## Production Deployment

### For Vercel:
1. Add environment variables in Vercel Project Settings → Environment Variables
2. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD
3. Deploy as usual

### For Other Platforms:
1. Set environment variables in your hosting platform's dashboard
2. Ensure NODE_ENV is set to 'production'
3. Test email sending after deployment

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use strong passwords** - Or better, use Hostinger's app-specific password
3. **Enable 2FA** - On your Hostinger account for extra security
4. **Rate limiting** - Consider adding rate limiting to the `/api/contact` endpoint in production
5. **Input validation** - The API validates all required fields and email format

## Next Steps

1. **Add Rate Limiting** (Optional):
   - Prevent spam submissions
   - Use packages like `express-rate-limit`

2. **Add Database Logging** (Optional):
   - Store form submissions in database for reference
   - Add submission history/archive

3. **Add Confirmation Email** (Optional):
   - Send auto-reply to user confirming receipt
   - Create second template for confirmation

4. **Add Error Notifications** (Optional):
   - Display error toast instead of alert
   - Better UX for failed submissions

## Files Modified/Created

- ✅ `src/lib/email.service.ts` - Email service class
- ✅ `src/app/api/contact/route.ts` - API endpoint
- ✅ `src/templates/admin-email.html` - Admin notification template
- ✅ `src/templates/sender-email.html` - Sender confirmation template
- ✅ `src/components/ContactForm.tsx` - Updated to use API
- ✅ `src/app/contact/page.tsx` - Updated to use API
- ✅ `.env.local.example` - Environment variables template
- ✅ `package.json` - Nodemailer installed

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review server logs for detailed error messages
3. Consult Nodemailer documentation: https://nodemailer.com/
4. Check Hostinger SMTP configuration guide
