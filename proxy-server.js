const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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
