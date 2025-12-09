// Cloudflare Pages Function to send consultation request email
// Path: /functions/send-consultation-request.js

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    
    const { email, full_name, id, is_verified, phone, project_name, loan_amount, interest_rate } = body;

    // Validate required fields
    if (!email || !full_name || !id) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format verification status
    const verificationStatus = is_verified ? 
      '<span style="color: #16a34a; font-weight: 600;">✓ Đã xác thực</span>' : 
      '<span style="color: #ea580c; font-weight: 600;">⚠ Chưa xác thực</span>';

    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #334155;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            padding: 30px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          .header p {
            margin: 8px 0 0 0;
            opacity: 0.9;
            font-size: 14px;
          }
          .content {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-top: none;
            padding: 30px;
            border-radius: 0 0 12px 12px;
          }
          .info-section {
            margin-bottom: 24px;
          }
          .info-section h2 {
            color: #16a34a;
            font-size: 18px;
            margin: 0 0 16px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #dcfce7;
          }
          .info-row {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #f1f5f9;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #64748b;
            min-width: 160px;
          }
          .info-value {
            color: #0f172a;
            flex: 1;
          }
          .highlight {
            background: #f0fdf4;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #16a34a;
            margin: 20px 0;
          }
          .highlight strong {
            color: #16a34a;
            font-size: 18px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #94a3b8;
            font-size: 13px;
          }
          .timestamp {
            color: #94a3b8;
            font-size: 13px;
            text-align: right;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌱 Yêu cầu tư vấn đầu tư mới</h1>
          <p>Từ hệ thống GreenFund</p>
        </div>
        
        <div class="content">
          <div class="info-section">
            <h2>👤 Thông tin nhà đầu tư</h2>
            <div class="info-row">
              <span class="info-label">Họ và tên:</span>
              <span class="info-value"><strong>${full_name}</strong></span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Số điện thoại:</span>
              <span class="info-value">${phone || 'Chưa cập nhật'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">User ID:</span>
              <span class="info-value"><code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${id}</code></span>
            </div>
            <div class="info-row">
              <span class="info-label">Trạng thái tài khoản:</span>
              <span class="info-value">${verificationStatus}</span>
            </div>
          </div>

          ${project_name ? `
          <div class="info-section">
            <h2>📊 Dự án quan tâm</h2>
            <div class="info-row">
              <span class="info-label">Tên dự án:</span>
              <span class="info-value"><strong>${project_name}</strong></span>
            </div>
            ${loan_amount ? `
            <div class="info-row">
              <span class="info-label">Số tiền vay:</span>
              <span class="info-value">${formatCurrency(loan_amount)}</span>
            </div>
            ` : ''}
            ${interest_rate ? `
            <div class="info-row">
              <span class="info-label">Lãi suất:</span>
              <span class="info-value"><strong style="color: #16a34a;">${interest_rate}%/năm</strong></span>
            </div>
            ` : ''}
          </div>
          ` : ''}

          <div class="highlight">
            <strong>⚡ Hành động cần thực hiện:</strong><br>
            Vui lòng liên hệ với khách hàng trong vòng 24h để tư vấn chi tiết về cơ hội đầu tư.
          </div>

          <div class="timestamp">
            📅 Thời gian: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
          </div>
        </div>

        <div class="footer">
          <p>Email này được gửi tự động từ hệ thống GreenFund</p>
          <p>© 2024 GreenFund - Nền tảng đầu tư xanh bền vững</p>
        </div>
      </body>
      </html>
    `;

    // Prepare email data for MailChannels (Cloudflare's recommended email service)
    const emailData = {
      personalizations: [
        {
          to: [{ email: 'greenfund.contact@gmail.com', name: 'GreenFund Support' }],
          subject: `🌱 Yêu cầu tư vấn đầu tư từ ${full_name}`
        }
      ],
      from: {
        email: 'noreply@greenfund.com',
        name: 'GreenFund System'
      },
      content: [
        {
          type: 'text/html',
          value: htmlContent
        }
      ]
    };

    // Send email using MailChannels API (Free for Cloudflare Workers)
    const mailchannelsResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!mailchannelsResponse.ok) {
      const errorText = await mailchannelsResponse.text();
      console.error('MailChannels error:', errorText);
      throw new Error('Failed to send email via MailChannels');
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Yêu cầu tư vấn đã được gửi thành công' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ 
      error: 'Không thể gửi yêu cầu. Vui lòng thử lại sau.',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

