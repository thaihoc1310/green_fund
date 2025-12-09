# 🚀 Resend Quick Start - 5 phút setup

## ✅ Checklist (Làm theo thứ tự):

### ☑️ Bước 1: Đăng ký Resend (2 phút)

1. **Vào:** https://resend.com/signup
2. **Đăng ký** với email của bạn
3. **Verify email** (check inbox/spam)
4. **Login** vào Dashboard

### ☑️ Bước 2: Tạo API Key (30 giây)

1. **Dashboard** → **API Keys** (sidebar bên trái)
2. Click **Create API Key**
3. **Name:** `GreenFund Production`
4. **Permission:** Full access
5. Click **Create**
6. **Copy API Key** ngay lập tức (chỉ hiện 1 lần!)
   - Format: `re_xxxxxxxxxxxxx`
   - Paste vào notepad tạm

### ☑️ Bước 3: Add vào Cloudflare Pages (1 phút)

1. **Vào:** https://dash.cloudflare.com/
2. **Workers & Pages** → **greenfund**
3. **Settings** → **Environment variables**
4. Click **Add variable**
5. **Điền:**
   ```
   Variable name: RESEND_API_KEY
   Value: re_xxxxxxxxxxxxx (paste key vừa copy)
   Environment: Production
   ```
6. Click **Save**

### ☑️ Bước 4: Deploy code mới (30 giây)

```bash
cd /home/thaihoc/Workspace/green_fund

# Add & commit
git add .
git commit -m "feat: Switch to Resend for email service"

# Push
git push origin main
```

Cloudflare sẽ tự động build & deploy (~2 phút)

### ☑️ Bước 5: Test (30 giây)

1. **Đợi deploy xong** (check tại: https://dash.cloudflare.com/)
2. **Vào site:** https://greenfund.site
3. **Test:**
   - Vào loan detail page
   - Click "Đầu tư ngay"
   - Click "Yêu cầu tư vấn ngay"
4. **Check notification:** "✓ Yêu cầu tư vấn đã được gửi!"
5. **Check email:** `greenfund.contact@gmail.com`

---

## 🎯 Verify email đã gửi

### Option 1: Check Gmail
Vào `greenfund.contact@gmail.com` và check inbox/spam

### Option 2: Check Resend Dashboard
1. **Vào:** https://resend.com/emails
2. Thấy email vừa gửi với:
   - ✅ Status: Delivered
   - ✅ To: greenfund.contact@gmail.com
   - ✅ Subject: 🌱 Yêu cầu tư vấn...

---

## 🐛 Nếu không hoạt động:

### 1. Check Cloudflare Logs
```
Dashboard → Pages → greenfund → Functions → View logs
```

Tìm error message:
- ❌ "RESEND_API_KEY environment variable is not set"
  → Chưa add env variable, quay lại Bước 3
  
- ❌ "401 Unauthorized"
  → API key sai, tạo key mới ở Resend
  
- ❌ "Failed to send email via Resend"
  → Check Resend dashboard xem lỗi gì

### 2. Check Environment Variable
```
Dashboard → Pages → greenfund → Settings → Environment variables
```

Phải thấy:
```
RESEND_API_KEY | re_********* | Production
```

Nếu không có → Add lại Bước 3

### 3. Redeploy
```
Dashboard → Pages → greenfund → Deployments → Retry deployment
```

Hoặc:
```bash
git commit --allow-empty -m "Redeploy"
git push
```

---

## 📊 Monitor emails

**Resend Dashboard:** https://resend.com/emails

Xem tất cả emails đã gửi:
- ✅ Delivered: Email gửi thành công
- ⏳ Queued: Đang trong hàng đợi
- ❌ Failed: Gửi thất bại (xem reason)

Click vào email để xem:
- HTML preview
- Headers
- Logs
- Bounce/Complaint

---

## 💡 Tips

1. **Free tier:** 100 emails/day, 3,000 emails/month
2. **Rate limit:** 10 requests/second
3. **Email tracking:** Tự động track opens & clicks (nếu enable)
4. **Test mode:** Có thể test ở local với same API key

---

## ✅ Done!

Email service đã sẵn sàng! Mỗi khi có user yêu cầu tư vấn:
1. Email gửi tới `greenfund.contact@gmail.com`
2. Format HTML đẹp với thông tin user và dự án
3. Notification hiện trên UI
4. Track được trong Resend Dashboard

**Total setup time:** ~5 phút! 🎉

