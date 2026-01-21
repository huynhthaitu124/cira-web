/* eslint-disable @typescript-eslint/no-require-imports */
// Test script to verify Resend email configuration
// Run: node scripts/test-email.js your-email@example.com

require('dotenv').config({ path: '.env.local' });

async function testEmail(recipientEmail) {
  console.log('🚀 Testing Resend Email Configuration...\n');

  // Check environment variables
  console.log('📋 Checking environment variables:');

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not set in .env.local');
    console.log('\n💡 Add this to your .env.local file:');
    console.log('   RESEND_API_KEY=re_your_api_key_here\n');
    process.exit(1);
  }
  console.log('✅ RESEND_API_KEY is set');

  const emailFrom = process.env.EMAIL_FROM || 'CIRA <onboarding@resend.dev>';
  console.log(`✅ EMAIL_FROM: ${emailFrom}\n`);

  if (!recipientEmail) {
    console.error('❌ Please provide a recipient email');
    console.log('\n💡 Usage:');
    console.log('   node scripts/test-email.js your-email@example.com\n');
    process.exit(1);
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log(`📧 Sending test email to: ${recipientEmail}...`);

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: [recipientEmail],
      subject: '🎉 CIRA Test Email - Nó hoạt động rồi!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Thành Công!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #667eea;">Email của bạn đã được cấu hình đúng! ✅</h2>
            
            <p>Chúc mừng! Hệ thống email cho CIRA landing page đang hoạt động hoàn hảo.</p>
            
            <div style="background: #fff; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #667eea;">📋 Thông tin cấu hình:</h3>
              <ul style="list-style: none; padding: 0;">
                <li>✅ Resend API: Đang hoạt động</li>
                <li>📧 Email From: ${emailFrom}</li>
                <li>🎯 Email To: ${recipientEmail}</li>
                <li>⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}</li>
              </ul>
            </div>
            
            <p><strong>Bước tiếp theo:</strong></p>
            <ol>
              <li>Test waitlist form trên landing page</li>
              <li>Kiểm tra email chào mừng với mã CIRA10</li>
              <li>Nếu muốn dùng domain riêng, verify domain trong Resend</li>
            </ol>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              <em>Email này được gửi từ script test. Nếu bạn nhận được email này, nghĩa là mọi thứ đã sẵn sàng! 🚀</em>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px;">
              © 2025 CIRA - Ngôi nhà kỷ niệm cho gia đình Việt
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('\n❌ Failed to send email:');
      console.error(error);
      process.exit(1);
    }

    console.log('\n✅ Email sent successfully!');
    console.log('📨 Email ID:', data.id);
    console.log('\n📬 Please check your inbox (and spam folder) at:', recipientEmail);
    console.log('\n🎉 Your email configuration is working! You can now use the waitlist form.\n');

  } catch (error) {
    console.error('\n❌ Error occurred:');
    console.error(error.message);

    if (error.message.includes('API key')) {
      console.log('\n💡 Tips:');
      console.log('   1. Make sure RESEND_API_KEY in .env.local is correct');
      console.log('   2. API key should start with "re_"');
      console.log('   3. Get your API key from: https://resend.com/api-keys\n');
    }

    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];
testEmail(email);
