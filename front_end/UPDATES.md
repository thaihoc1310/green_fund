# Green Fund - P2P Lending Platform

## 🎉 Cập nhật gần đây

### Cải thiện Dashboard
- ✅ **Người cho vay**: Đã bỏ phần "Các khoản vay cần đầu tư" khỏi dashboard (vì đã có trong Danh sách khoản vay)
- ✅ **Nút Nạp tiền**: Được chuyển thành một ô chức năng chính với thiết kế đặc biệt (màu xanh dương)
- ✅ Áp dụng cho cả 2 vai trò: Người vay và Người cho vay

### Cải thiện Quản lý Dự án
- ✅ **Modal Chi tiết**: Khi nhấn nút "Xem", hiện modal với thông tin đầy đủ thay vì chuyển trang
- ✅ **Chức năng Thanh toán**: Khi nhấn "Thanh toán kỳ hạn", hiện modal thanh toán với:
  - Thông tin kỳ thanh toán
  - Số tiền cần thanh toán
  - Lựa chọn phương thức thanh toán (Ví Green Fund, Chuyển khoản, Thẻ tín dụng)
  - Xác nhận thanh toán

## 🚀 Chạy ứng dụng

```bash
cd front_end
npm install
npm run dev
```

Truy cập: http://localhost:5173

## 📋 Tính năng hoàn chỉnh

### Cho Người vay:
1. ✅ Nạp tiền vào tài khoản
2. ✅ Tạo khoản vay mới (với form 3 bước)
3. ✅ Quản lý dự án (xem chi tiết, thanh toán kỳ hạn)
4. ✅ Lịch sử giao dịch
5. ✅ Tin tức & ưu đãi

### Cho Người cho vay:
1. ✅ Nạp tiền vào tài khoản
2. ✅ Danh sách khoản vay (với bộ lọc thông minh)
3. ✅ Chi tiết khoản vay (đầy đủ thông tin ESG, lịch sử tín dụng)
4. ✅ Đầu tư vào dự án
5. ✅ Quản lý danh mục đầu tư
6. ✅ Lịch sử giao dịch
7. ✅ Tin tức & ưu đãi

## 🎨 Thiết kế UI

- **Màu chủ đạo**: Xanh lá (Green) cho nền tảng xanh
- **Màu phụ**: Xanh dương cho nút Nạp tiền
- **Icons**: React Icons
- **Responsive**: Mobile, Tablet, Desktop
- **Animations**: Smooth transitions & hover effects

## 📱 Responsive Design

- ✅ Mobile (< 480px)
- ✅ Tablet (480px - 768px)
- ✅ Desktop (> 768px)

## 🔄 Điểm khác biệt so với phiên bản trước

1. **Dashboard sạch hơn**: Bỏ phần dư thừa ở người cho vay
2. **Nạp tiền nổi bật**: Thiết kế riêng biệt, dễ nhận diện
3. **Modal thông minh**: Xem chi tiết không cần chuyển trang
4. **Thanh toán đầy đủ**: Modal thanh toán với nhiều lựa chọn

## 📝 TODO tiếp theo (Backend)

- [ ] Tích hợp API backend
- [ ] Authentication & Authorization
- [ ] Upload file thực sự
- [ ] Xử lý thanh toán thực
- [ ] Email notifications
- [ ] Real-time updates

---

Developed with ❤️ for Green Finance
