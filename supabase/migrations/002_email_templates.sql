-- Edge Function to send welcome email
-- This SQL creates a webhook that can be called by the trigger
-- You'll need to deploy an Edge Function separately

-- Create a table to store email templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  subject_vi TEXT NOT NULL,
  subject_en TEXT NOT NULL,
  body_vi TEXT NOT NULL,
  body_en TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert welcome email template
INSERT INTO email_templates (name, subject_vi, subject_en, body_vi, body_en)
VALUES (
  'waitlist_welcome',
  'Chào mừng bạn đến với CIRA - Mã giảm giá 10% của bạn!',
  'Welcome to CIRA - Your 10% Discount Code!',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #6366F1;">🎉 Chào mừng bạn đến với CIRA!</h1>
    
    <p>Xin chào,</p>
    
    <p>Cảm ơn bạn đã tham gia waitlist của CIRA! Chúng tôi rất vui mừng được chào đón bạn vào cộng đồng những người yêu thích kỷ niệm gia đình.</p>
    
    <div style="background: #FEF3E8; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h2 style="color: #F59E0B; margin-top: 0;">🎁 Mã giảm giá của bạn</h2>
      <p style="font-size: 24px; font-weight: bold; color: #6366F1; text-align: center; margin: 10px 0;">
        CIRA10
      </p>
      <p style="text-align: center; color: #666;">Giảm 10% cho gói đăng ký đầu tiên</p>
    </div>
    
    <p><strong>Điều gì sẽ xảy ra tiếp theo?</strong></p>
    <ul>
      <li>Bạn sẽ là người đầu tiên biết khi CIRA chính thức ra mắt</li>
      <li>Nhận quyền truy cập sớm vào ứng dụng</li>
      <li>Được hỗ trợ ưu tiên từ đội ngũ CIRA</li>
    </ul>
    
    <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi tại <a href="mailto:hello@cira.vn">hello@cira.vn</a></p>
    
    <p>Trân trọng,<br>Đội ngũ CIRA</p>
    
    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
      © 2025 CIRA. Ngôi nhà kỷ niệm cho gia đình Việt.
    </p>
  </div>
</body>
</html>',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #6366F1;">🎉 Welcome to CIRA!</h1>
    
    <p>Hello,</p>
    
    <p>Thank you for joining the CIRA waitlist! We''re excited to welcome you to our community of people who cherish family memories.</p>
    
    <div style="background: #FEF3E8; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h2 style="color: #F59E0B; margin-top: 0;">🎁 Your Discount Code</h2>
      <p style="font-size: 24px; font-weight: bold; color: #6366F1; text-align: center; margin: 10px 0;">
        CIRA10
      </p>
      <p style="text-align: center; color: #666;">10% off your first subscription</p>
    </div>
    
    <p><strong>What happens next?</strong></p>
    <ul>
      <li>You''ll be the first to know when CIRA officially launches</li>
      <li>Get early access to the app</li>
      <li>Receive priority support from the CIRA team</li>
    </ul>
    
    <p>If you have any questions, don''t hesitate to contact us at <a href="mailto:hello@cira.vn">hello@cira.vn</a></p>
    
    <p>Best regards,<br>The CIRA Team</p>
    
    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
      © 2025 CIRA. A memory home for Vietnamese families.
    </p>
  </div>
</body>
</html>'
)
ON CONFLICT (name) DO UPDATE
SET 
  subject_vi = EXCLUDED.subject_vi,
  subject_en = EXCLUDED.subject_en,
  body_vi = EXCLUDED.body_vi,
  body_en = EXCLUDED.body_en,
  updated_at = TIMEZONE('utc'::text, NOW());

-- Grant access to email templates
GRANT SELECT ON email_templates TO authenticated, anon;
