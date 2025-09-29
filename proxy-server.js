const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Function to read and parse accounts from taikhoan.txt
function readAccounts() {
    try {
        const filePath = path.join(__dirname, 'taikhoan.txt');
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.trim().split('\n');
        
        const accounts = [];
        lines.forEach(line => {
            if (line.trim()) {
                const parts = line.split(':');
                if (parts.length >= 3) {
                    accounts.push({
                        username: parts[0],
                        password: parts[1],
                        role: parts[2]
                    });
                }
            }
        });
        
        return accounts;
    } catch (error) {
        console.error('Error reading accounts file:', error);
        return [];
    }
}

// Login endpoint
app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.json({
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin!'
            });
        }
        
        const accounts = readAccounts();
        const user = accounts.find(account => 
            account.username === email && account.password === password
        );
        
        if (user) {
            res.json({
                success: true,
                message: 'Đăng nhập thành công!',
                user: {
                    username: user.username,
                    role: user.role
                }
            });
        } else {
            res.json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không đúng!'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server!'
        });
    }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Đăng xuất thành công!'
    });
});

// Get all customers endpoint
app.get('/api/customers', (req, res) => {
    try {
        const accounts = readAccounts();
        res.json({
            success: true,
            customers: accounts
        });
    } catch (error) {
        console.error('Error getting customers:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server!'
        });
    }
});

// Add customer endpoint
app.post('/api/customers/add', (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        if (!username || !password || !role) {
            return res.json({
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin!'
            });
        }
        
        const accounts = readAccounts();
        
        // Check if username already exists
        if (accounts.find(account => account.username === username)) {
            return res.json({
                success: false,
                message: 'Username đã tồn tại!'
            });
        }
        
        // Add new account to file
        const newAccount = `${username}:${password}:${role}`;
        const filePath = path.join(__dirname, 'taikhoan.txt');
        const currentData = fs.readFileSync(filePath, 'utf8');
        const newData = currentData.trim() + '\n' + newAccount;
        
        fs.writeFileSync(filePath, newData, 'utf8');
        
        res.json({
            success: true,
            message: 'Thêm khách hàng thành công!'
        });
    } catch (error) {
        console.error('Error adding customer:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server!'
        });
    }
});

// Delete customer endpoint
app.post('/api/customers/delete', (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.json({
                success: false,
                message: 'Vui lòng nhập username!'
            });
        }
        
        const accounts = readAccounts();
        const accountToDelete = accounts.find(account => account.username === username);
        
        if (!accountToDelete) {
            return res.json({
                success: false,
                message: 'Không tìm thấy khách hàng!'
            });
        }
        
        if (accountToDelete.role === 'admin') {
            return res.json({
                success: false,
                message: 'Không thể xóa tài khoản admin!'
            });
        }
        
        // Remove account from file
        const filePath = path.join(__dirname, 'taikhoan.txt');
        const currentData = fs.readFileSync(filePath, 'utf8');
        const lines = currentData.trim().split('\n');
        const newLines = lines.filter(line => {
            const parts = line.split(':');
            return parts[0] !== username;
        });
        
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
        
        res.json({
            success: true,
            message: 'Xóa khách hàng thành công!'
        });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server!'
        });
    }
});

app.post('/api/services', async (req, res) => {
    try {
        const API_KEY = 'f2f9dbe25fb19b6e882aa07fc8fc00ea';
        
        const formData = new FormData();
        formData.append('key', API_KEY);
        
        const response = await fetch('https://trum.vip/api/order/services', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            success: false, 
            msg: 'Proxy server error: ' + error.message 
        });
    }
});

app.post('/api/order/create', async (req, res) => {
    try {
        const API_KEY = 'f2f9dbe25fb19b6e882aa07fc8fc00ea';
        
        const orderData = req.body;
        
        const formData = new FormData();
        formData.append('key', API_KEY);
        
        Object.keys(orderData).forEach(key => {
            if (orderData[key] !== undefined && orderData[key] !== null && orderData[key] !== '') {
                formData.append(key, orderData[key]);
            }
        });
        
        const response = await fetch('https://trum.vip/api/order/create', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ 
            success: false, 
            msg: 'Order creation error: ' + error.message 
        });
    }
});

app.post('/api/order/status', async (req, res) => {
    try {
        const API_KEY = 'f2f9dbe25fb19b6e882aa07fc8fc00ea';
        
        const { ids } = req.body;
        
        const formData = new FormData();
        formData.append('key', API_KEY);
        formData.append('id', ids);
        
        const response = await fetch('https://trum.vip/api/order/status', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error('Order status error:', error);
        res.status(500).json({ 
            success: false, 
            msg: 'Order status error: ' + error.message 
        });
    }
});

app.post('/api/orders/all', async (req, res) => {
    try {
        const API_KEY = 'f2f9dbe25fb19b6e882aa07fc8fc00ea';
        
        const formData = new FormData();
        formData.append('key', API_KEY);
        formData.append('id', 'all');
        
        const response = await fetch('https://trum.vip/api/order/status', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error('All orders error:', error);
        res.status(500).json({ 
            success: false, 
            msg: 'All orders error: ' + error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
    console.log('Use this URL in your frontend: http://localhost:3000/api/services');
});
