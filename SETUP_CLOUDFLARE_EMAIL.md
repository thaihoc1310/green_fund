# 📧 Setup Email Function - Cloudflare Pages

## ✅ Đã thực hiện:

### 1. Thay đổi UI/UX trang LoanDetail
- ❌ **Xóa:** Input nhập số tiền đầu tư
- ❌ **Xóa:** Tính toán lợi nhuận dự kiến
- ✅ **Đổi nút:** "Xác nhận đầu tư" → "Yêu cầu tư vấn ngay"
- ✅ **Thêm:** Notification toast (thông báo trượt vào từ phải)

### 2. Tạo Cloudflare Pages Function
- File: `/functions/send-consultation-request.js`
- Sử dụng **MailChannels API** (miễn phí cho Cloudflare Workers)
- Gửi email format HTML đẹp đến `greenfund.contact@gmail.com`
- Thông tin gửi: email, full_name, id, is_verified, phone, project info

### 3. Flow hoạt động
```
User click "Đầu tư ngay" 
  → Modal hiện ra
  → User click "Yêu cầu tư vấn ngay"
  → Get user info từ Supabase
  → Gửi email async qua MailChannels (fire and forget)
  → Đóng modal ngay lập tức
  → Hiện notification "✓ Yêu cầu tư vấn đã được gửi!"
  → Notification tự động ẩn sau 5s
```

---

## 🔧 SETUP CLOUDFLARE PAGES

### Bước 1: Verify Domain với MailChannels (Quan trọng!)

**MailChannels** là dịch vụ email miễn phí được Cloudflare khuyên dùng cho Workers/Pages.

#### Option A: Không cần domain custom (Dùng luôn)

Nếu bạn deploy trên Cloudflare Pages với subdomain `*.pages.dev`, **không cần setup gì thêm**! MailChannels sẽ hoạt động ngay.

#### Option B: Có custom domain (Khuyến nghị)

Nếu bạn có domain riêng (vd: `greenfund.com`), thêm SPF record:

1. **Vào Cloudflare Dashboard** → Your Domain → DNS → Records
2. **Add record:**
   ```
   Type: TXT
   Name: @
   Content: v=spf1 include:_spf.mx.cloudflare.net include:relay.mailchannels.net ~all
   ```
3. **Save** và đợi DNS propagate (vài phút)

### Bước 2: Deploy lên Cloudflare Pages

#### 2.1. Kết nối GitHub với Cloudflare Pages

1. **Vào:** https://dash.cloudflare.com/
2. **Pages** → **Create a project** → **Connect to Git**
3. Chọn repository: `green_fund`
4. **Build settings:**
   ```
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   Root directory: front_end
   ```
5. Click **Save and Deploy**

#### 2.2. Cấu hình Functions (Tự động)

Cloudflare Pages tự động detect folder `/functions` và deploy như serverless functions.

**Endpoint sẽ là:** `https://your-site.pages.dev/send-consultation-request`

### Bước 3: Test

1. **Deploy xong** → vào URL của site
2. **Test flow:**
   - Vào trang loan detail
   - Click "Đầu tư ngay"
   - Click "Yêu cầu tư vấn ngay"
   - Check notification hiện lên
   - **Check email** `greenfund.contact@gmail.com`

---

## 📁 File Structure

```
green_fund/
├── functions/
│   └── send-consultation-request.js    ← Cloudflare Pages Function
├── front_end/
│   ├── src/
│   │   └── components/
│   │       └── LoanDetail.jsx          ← Updated UI
│   └── ...
└── _redirects                          ← SPA routing
```

---

## 🎯 MailChannels API - Không cần API Key!

**MailChannels** được tích hợp sẵn với Cloudflare Workers/Pages:
- ✅ **Miễn phí** cho Cloudflare Workers/Pages
- ✅ **Không cần đăng ký** hay API key
- ✅ **Không giới hạn** email (trong lý do hợp lệ)
- ✅ **Không cần setup SMTP** username/password

**API Endpoint:** `https://api.mailchannels.net/tx/v1/send`

### Email Format

```javascript
{
  personalizations: [{
    to: [{ email: 'greenfund.contact@gmail.com' }],
    subject: 'Subject here'
  }],
  from: {
    email: 'noreply@greenfund.com',  // Có thể dùng bất kỳ email nào
    name: 'GreenFund System'
  },
  content: [{
    type: 'text/html',
    value: '<html>...</html>'
  }]
}
```

---

## 🐛 Troubleshooting

### 1. Email không gửi được?

**Check Cloudflare Pages Function Logs:**
```
Dashboard → Pages → Your Project → Functions → View logs
```

**Common issues:**
- Function chưa deploy đúng folder `/functions`
- Request body không đúng format
- MailChannels API rate limit (hiếm khi xảy ra)

### 2. Function không chạy?

**Verify function path:**
- File phải ở: `/functions/send-consultation-request.js` (root level, không phải trong `front_end/`)
- Endpoint: `/send-consultation-request` (không có `/functions/` prefix)

**Check function deployment:**
```
Dashboard → Pages → Your Project → Functions
```
→ Phải thấy `send-consultation-request` trong danh sách

### 3. CORS Error?

Nếu gặp CORS khi call từ frontend, thêm headers vào response:

```javascript
return new Response(JSON.stringify(data), {
  status: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',  // Hoặc specific domain
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
});
```

### 4. MailChannels trả về 401/403?

**Solution:**
- Verify SPF record nếu dùng custom domain
- Hoặc deploy trên `*.pages.dev` subdomain (không cần verify)
- Check email `from` không bị blacklist

---

## 🎨 Email Template

Email gửi đi sẽ có format đẹp với:
- ✅ Header gradient xanh GreenFund
- ✅ Thông tin user: Tên, Email, Phone, ID, Trạng thái xác thực
- ✅ Thông tin dự án: Tên dự án, Số tiền, Lãi suất
- ✅ Highlight box: "Hành động cần thực hiện"
- ✅ Timestamp tự động
- ✅ Footer GreenFund branding

---

## 📋 Deployment Checklist

- [ ] Code đã push lên GitHub
- [ ] Cloudflare Pages đã connect với repo
- [ ] Build settings đúng (Vite, front_end, dist)
- [ ] Folder `/functions` ở root level
- [ ] Deploy thành công
- [ ] Test function endpoint: `https://your-site.pages.dev/send-consultation-request`
- [ ] Test UI: vào loan detail → "Đầu tư ngay" → "Yêu cầu tư vấn"
- [ ] Check email nhận được

---

## 🚀 So sánh với Netlify

| Feature | Netlify | Cloudflare Pages |
|---------|---------|------------------|
| **Functions folder** | `/netlify/functions/` | `/functions/` |
| **Function endpoint** | `/.netlify/functions/name` | `/name` |
| **Email service** | Cần setup SMTP/Nodemailer | MailChannels (built-in, free) |
| **Environment vars** | Required for Gmail | Không cần! |
| **Setup complexity** | Phức tạp (Gmail App Password) | Đơn giản (zero config) |
| **Cost** | Free tier giới hạn | Free tier rộng hơn |

---

## ✅ Ưu điểm Cloudflare Pages

1. **Không cần API key** hay credentials cho email
2. **Miễn phí** hoàn toàn cho email
3. **Deploy tự động** từ GitHub
4. **Edge computing** - Nhanh hơn
5. **Unlimited bandwidth** (trên Free plan)
6. **DDoS protection** tự động

---

## 📝 Next Steps

Sau khi deploy thành công:
1. ✅ Test gửi email
2. ✅ Verify email đến `greenfund.contact@gmail.com`
3. ✅ Monitor function logs
4. ✅ Setup custom domain (optional)
5. ✅ Add SPF record nếu dùng custom domain

---

**Status: ✅ Code hoàn thành! Deploy lên Cloudflare Pages và test ngay!** 🚀

### Quick Deploy:

```bash
# 1. Push code
git add .
git commit -m "Add email consultation feature with Cloudflare Pages Function"
git push

# 2. Vào Cloudflare Dashboard
# 3. Pages → Create project → Connect Git
# 4. Chọn repo → Deploy
# 5. Done! 🎉
```

