const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3000; // 或者你选择的其他端口号

// 使用cors中间件允许跨域请求
app.use(cors());

// 解析application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// 创建MySQL连接池
const db = mysql.createPool({
    host: '192.168.190.128',       // 数据库主机地址
    user: 'root',   // 数据库用户名
    password: 'Useruseruser01!', // 数据库密码
    database: 'cold_chain_db' // 数据库名称
});

// 处理表单提交
app.post('/submit-form', (req, res) => {
    const { name, phone, address, email } = req.body;

    // 插入数据到数据库
    const query = 'INSERT INTO customers (name, phone, address, email) VALUES (?, ?, ?, ?)';
    db.query(query, [name, phone, address, email], (err, results) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            return res.status(500).json({ message: '表单提交失败，请稍后再试。' });
        }

        console.log('Data inserted successfully:', { name, phone, address, email });
        res.json({ message: '表单已成功提交！' });
    });
});

// 获取明细报表
app.get('/report/detail', (req, res) => {
    const query = 'SELECT * FROM customers ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching detail report:', err);
            return res.status(500).json({ message: '获取报表失败，请稍后再试。' });
        }
        res.json(results);
    });
});

// 获取日报表
app.get('/report/daily', (req, res) => {
    const query = `
        SELECT 
            DATE(created_at) AS date,
            COUNT(*) AS total_submissions
        FROM 
            customers
        GROUP BY 
            DATE(created_at)
        ORDER BY 
            date DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching daily report:', err);
            return res.status(500).json({ message: '获取报表失败，请稍后再试。' });
        }
        res.json(results);
    });
});

// 获取周报表
app.get('/report/weekly', (req, res) => {
    const query = `
        SELECT 
            YEARWEEK(created_at, 1) AS week_number,
            COUNT(*) AS total_submissions
        FROM 
            customers
        GROUP BY 
            YEARWEEK(created_at, 1)
        ORDER BY 
            week_number DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching weekly report:', err);
            return res.status(500).json({ message: '获取报表失败，请稍后再试。' });
        }
        res.json(results);
    });
});

// 获取月报表
app.get('/report/monthly', (req, res) => {
    const query = `
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') AS month,
            COUNT(*) AS total_submissions
        FROM 
            customers
        GROUP BY 
            DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY 
            month DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching monthly report:', err);
            return res.status(500).json({ message: '获取报表失败，请稍后再试。' });
        }
        res.json(results);
    });
});

// 按手机号码查询记录
app.get('/report/by-phone/:phone', (req, res) => {
    const { phone } = req.params;
    const query = 'SELECT * FROM customers WHERE phone = ? ORDER BY created_at DESC';
    db.query(query, [phone], (err, results) => {
        if (err) {
            console.error('Error fetching records by phone:', err);
            return res.status(500).json({ message: '获取记录失败，请稍后再试。' });
        }
        res.json(results);
    });
});

// 提供静态文件服务（例如前端HTML页面）
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://192.168.190.128:${port}`);
});