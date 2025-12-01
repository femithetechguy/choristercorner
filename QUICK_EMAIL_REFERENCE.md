# Email System - Quick Reference

## 🚀 Quick Start

### 1. Add SMTP Credentials to `.env.local`
```env
EMAIL_HOST=mail.fttgsolutions.com
EMAIL_PORT=465
EMAIL_USER=dev@fttgsolutions.com
EMAIL_PASSWORD=YOUR_PASSWORD_HERE
EMAIL_SECURE=true
```

### 2. Test It
```bash
npm run dev
# Visit http://localhost:3000/contact
```

### 3. That's It! 🎉
Form submissions now send emails automatically.

---

## 📧 How It Works

```
User Form → API Route (/api/contact) → Email Service → Nodemailer → Hostinger SMTP → Your Inbox
```

1. **User submits form** on `/contact` page
2. **Frontend calls** POST `/api/contact` with form data
3. **API validates** email, name, subject, message, contact type
4. **Email service** loads HTML template and replaces variables
5. **Nodemailer** connects to Hostinger SMTP
6. **Email sent** to dev@fttgsolutions.com
7. **User sees** success toast notification

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `src/lib/email.service.ts` | Email sending logic |
| `src/app/api/contact/route.ts` | API endpoint |
| `src/templates/contact-email.html` | Email template design |
| `src/app/contact/page.tsx` | Contact page UI |
| `.env.local` | Your SMTP credentials (secret) |
| `EMAIL_SETUP.md` | Full setup guide |

---

## 🔑 Environment Variables

```
EMAIL_HOST         → SMTP server address
EMAIL_PORT         → 465 (SSL) or 587 (TLS)
EMAIL_USER         → Full email address
EMAIL_PASSWORD     → Email password
EMAIL_SECURE       → true (for 465) or false (for 587)
```

**Get these from:** Hostinger → Email Settings for dev@fttgsolutions.com

---

## ✅ Validation

The API checks:
- ✅ Required fields (name, email, subject, message, contactType)
- ✅ Valid email format
- ✅ Valid contact type (General Feedback, Song Suggestions, Report Issues)

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Connection refused" | Check EMAIL_HOST and EMAIL_PORT |
| "Invalid credentials" | Verify EMAIL_USER and EMAIL_PASSWORD |
| Email not received | Check spam folder, verify EMAIL_USER |
| Port errors | Port 465 = SSL (true), Port 587 = TLS (false) |

---

## 📊 Contact Form Types

The form supports 3 contact types:
1. **General Feedback** 💬 - General comments
2. **Song Suggestions** 🎵 - Song requests
3. **Report Issues** 🐛 - Bug reports

Each gets an emoji badge in the email.

---

## 🌐 API Endpoint

**Health Check:**
```bash
curl http://localhost:3000/api/contact
```

**Submit Form:**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "subject": "Love your app",
    "message": "Great worship songs!",
    "contactType": "General Feedback"
  }'
```

---

## 📝 Email Template Variables

In `src/templates/contact-email.html`, use:
- `{{name}}` - Sender name
- `{{email}}` - Sender email
- `{{contactType}}` - Type of inquiry
- `{{contactTypeBadge}}` - Emoji (💬/🎵/🐛)
- `{{subject}}` - Inquiry subject
- `{{message}}` - Full message
- `{{submissionTime}}` - When sent
- `{{year}}` - Current year

Edit the HTML file to customize the email design.

---

## 🔒 Security Notes

- ✅ `.env.local` is git-ignored (your password is safe)
- ✅ All inputs validated on server
- ✅ Email format verified
- ✅ Contact types restricted to valid options

For production:
- Consider adding rate limiting
- Use app-specific password if 2FA enabled
- Monitor SMTP logs for suspicious activity

---

## 📋 Next Steps

Optional enhancements:
1. Add rate limiting (prevent spam)
2. Store submissions in database
3. Send confirmation email to sender
4. Add error toast notifications
5. Create OG image for social sharing

---

## ✨ Files Created/Modified

**New:**
- ✅ `src/lib/email.service.ts`
- ✅ `src/app/api/contact/route.ts`
- ✅ `src/templates/contact-email.html`
- ✅ `EMAIL_SETUP.md`
- ✅ `EMAIL_IMPLEMENTATION_CHECKLIST.md`

**Updated:**
- ✅ `src/app/contact/page.tsx`
- ✅ `.env.local.example`
- ✅ `package.json` (Nodemailer installed)

**Build Status:** ✅ All green - Ready to go!

---

## 💡 Pro Tips

1. **Test emails locally first** before going to production
2. **Check spam folder** if emails don't appear
3. **Use admin email for EMAIL_USER** if available
4. **Keep EMAIL_PASSWORD secure** - never share it
5. **Monitor server logs** for email errors

---

**Questions?** Check `EMAIL_SETUP.md` for detailed troubleshooting.
