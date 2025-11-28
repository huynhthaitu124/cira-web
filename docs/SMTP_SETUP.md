# Hướng Dẫn Cấu Hình Email với Nodemailer

## Tổng Quan
Dự án đã chuyển từ Resend sang Nodemailer để gửi email. Nodemailer đơn giản hơn và không yêu cầu domain verification.

## Cấu Hình SMTP

### 1. Sử dụng Gmail (Khuyến nghị cho testing)

**Bước 1: Tạo App Password cho Gmail**
1. Truy cập: https://myaccount.google.com/security
2. Bật "2-Step Verification" (nếu chưa bật)
3. Tìm "App passwords" và tạo password mới
4. Copy password này (16 ký tự)

**Bước 2: Cấu hình .env.local**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-16-chars
EMAIL_FROM="CIRA <your-email@gmail.com>"
```

### 2. Sử dụng các SMTP khác

**Outlook/Hotmail:**
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Yahoo Mail:**
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Custom SMTP (VPS, shared hosting, etc):**
```bash
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587  # hoặc 465 nếu dùng SSL
SMTP_SECURE=true  # nếu port 465
```

## Cấu Hình Chi Tiết

### Environment Variables

| Variable | Mô tả | Required | Example |
|----------|-------|----------|---------|
| `SMTP_HOST` | SMTP server hostname | Yes | smtp.gmail.com |
| `SMTP_PORT` | SMTP port | No (default: 587) | 587 hoặc 465 |
| `SMTP_SECURE` | Dùng SSL/TLS | No (default: false) | true cho port 465 |
| `SMTP_USER` | Email username | Yes | your-email@gmail.com |
| `SMTP_PASS` | Email password hoặc app password | Yes | abcd efgh ijkl mnop |
| `EMAIL_FROM` | Sender display name | No | "CIRA <no-reply@cira.vn>" |

### Port Numbers

- **587**: STARTTLS (khuyến nghị) - `SMTP_SECURE=false`
- **465**: SSL/TLS - `SMTP_SECURE=true`
- **25**: Không mã hóa (không khuyến nghị)

## Testing

Sau khi cấu hình, bạn có thể test bằng cách:

1. Đăng ký waitlist trên website
2. Kiểm tra console logs để xem email có được gửi không
3. Kiểm tra inbox để nhận email xác nhận

## Troubleshooting

### Lỗi "Invalid login"
- Đảm bảo đã bật 2-Step Verification (cho Gmail)
- Sử dụng App Password thay vì password thường
- Kiểm tra SMTP_USER và SMTP_PASS có đúng không

### Email không gửi được
- Kiểm tra console logs để xem lỗi chi tiết
- Verify SMTP_HOST và SMTP_PORT đúng với provider
- Một số provider chặn port 587, thử port 465 với `SMTP_SECURE=true`

### Email vào Spam
- Thêm SPF record cho domain
- Sử dụng verified email domain
- Tránh nội dung spam trong email template

## So sánh Resend vs Nodemailer

| Feature | Resend | Nodemailer |
|---------|--------|------------|
| Setup | Yêu cầu domain verification | Đơn giản, chỉ cần SMTP |
| Free tier | 3000 emails/month | Unlimited (tùy SMTP provider) |
| Deliverability | Rất cao | Phụ thuộc SMTP provider |
| Phức tạp | Cao (domain, DNS) | Thấp |
| Phù hợp | Production với custom domain | Development & quick setup |
