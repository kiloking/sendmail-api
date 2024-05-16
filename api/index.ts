require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587, // Outlook SMTP port (587 for TLS)
  secure: false, // Use STARTTLS
  auth: {
      user: process.env.EMAIL_USER, // 你的Outlook邮件地址
      pass: process.env.EMAIL_PASS // 你的邮件密码
  },
  tls: {
      ciphers: 'SSLv3'
  }
});
app.get("/", (req, res) => res.send("Express on Vercel"));
// 测试 API 的 GET 端点
app.get('/test', (req, res) => {
    res.status(200).send({ message: 'API is working' });
});

// 发送邮件的 API 端点
app.post('/send-email', (req, res) => {
    const { to, subject, customerName, phoneNumber, city, district, email } = req.body;

    // 检查 'to' 字段是否存在并且是字符串
    if (!to || typeof to !== 'string') {
        return res.status(400).send({ message: 'Invalid "to" field. It should be a string.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER, // 发送邮件地址
        to: to, // 收件人地址，单一邮件地址
        subject: subject, // 邮件主题
        text: `顧客姓名: ${customerName}\n聯絡電話: ${phoneNumber}\n居住縣市: ${city}\n居住地區: ${district}\n電子信箱: ${email}` // 邮件内容
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send({ message: 'Error sending email', error });
        } else {
            return res.status(200).send({ message: 'Email sent', info });
        }
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


module.exports = app;