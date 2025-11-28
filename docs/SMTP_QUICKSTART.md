# Quick Start: SMTP Email Configuration

## For Gmail (Recommended for Testing)

1. **Generate App Password:**
   - Visit: https://myaccount.google.com/security
   - Enable "2-Step Verification"
   - Create an "App password"
   - Copy the 16-character password

2. **Update `.env.local`:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM="CIRA <your-gmail@gmail.com>"
```

3. **Test:**
   - Restart dev server: `npm run dev`
   - Sign up on waitlist
   - Check console logs and email inbox

## See Full Documentation
Check `docs/SMTP_SETUP.md` for:
- Other SMTP providers (Outlook, Yahoo, Custom)
- Detailed troubleshooting
- Port configurations
- Security best practices
