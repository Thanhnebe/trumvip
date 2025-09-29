# TRUM.VIP - Hệ thống đăng nhập với BREAKDEV RED

## Mô tả
Hệ thống đăng nhập với giao diện BREAKDEV RED theo thiết kế trong ảnh, tích hợp với file `taikhoan.txt` để xác thực người dùng.

## Cấu trúc file
- `login.html` - Trang đăng nhập với giao diện BREAKDEV RED
- `index.html` - Trang chính của ứng dụng (có bảo vệ đăng nhập)
- `proxy-server.js` - Server backend xử lý API và đăng nhập
- `taikhoan.txt` - File chứa thông tin tài khoản (format: username:password:role)
- `package.json` - Dependencies của dự án

## Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình tài khoản
Chỉnh sửa file `taikhoan.txt` theo format:
```
username:password:role
admin:adminpass:admin
user1:password123:user
```

### 3. Chạy server
```bash
npm start
```

### 4. Truy cập ứng dụng
- Mở trình duyệt và truy cập: `http://localhost:3000/login.html`
- Đăng nhập với tài khoản trong file `taikhoan.txt`

## Tính năng

### Trang đăng nhập (`login.html`)
- Giao diện BREAKDEV RED theo thiết kế
- Form đăng nhập với email và password
- Xác thực với file `taikhoan.txt`
- Thông báo lỗi/thành công
- Chuyển hướng tự động sau đăng nhập

### Trang chính (`index.html`)
- Kiểm tra đăng nhập trước khi truy cập
- Chức năng đăng xuất
- Giao diện quản lý dịch vụ
- API tích hợp với TrumVIP
- **Quản lý khách hàng (chỉ admin)**
  - Xem danh sách tất cả tài khoản
  - Thêm tài khoản mới
  - Xóa tài khoản (trừ admin)
  - Phân quyền admin/user

### Backend (`proxy-server.js`)
- API đăng nhập `/api/login`
- API đăng xuất `/api/logout`
- **API quản lý khách hàng:**
  - `GET /api/customers` - Lấy danh sách khách hàng
  - `POST /api/customers/add` - Thêm khách hàng mới
  - `POST /api/customers/delete` - Xóa khách hàng
- Đọc và xác thực từ file `taikhoan.txt`
- Proxy API cho TrumVIP services

## Bảo mật
- Xác thực dựa trên file `taikhoan.txt`
- Session được lưu trong localStorage
- Kiểm tra đăng nhập trước mỗi request
- Tự động chuyển hướng về trang đăng nhập nếu chưa đăng nhập

## Sử dụng
1. Khởi động server: `npm start`
2. Truy cập `http://localhost:3000/login.html`
3. Đăng nhập với tài khoản admin: `admin` / `adminpass`
4. Sử dụng các tính năng của ứng dụng
5. **Quản lý khách hàng (chỉ admin):**
   - Click vào "Quản lý khách hàng" trong sidebar
   - Thêm khách hàng mới bằng nút "Thêm khách hàng"
   - Xóa khách hàng bằng nút "Xóa" (không thể xóa admin)
6. Đăng xuất bằng nút "Logout" trong menu

## Lưu ý
- File `taikhoan.txt` phải có format chính xác: `username:password:role`
- Server chạy trên port 3000
- Cần kết nối internet để sử dụng API TrumVIP
