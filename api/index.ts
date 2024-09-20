require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.mailersend.net",
  port: 587, // Outlook SMTP port (587 for TLS)
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: process.env.GMAIL_CLIENT_ID,
    pass: process.env.GMAIL_CLIENT_SECRET,
  },
});
const transporter2 = nodemailer.createTransport({
  service: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "maizizi.cn@gmail.com",
    pass: process.env.NEXT_PUBLIC_GMAIL_PASS,
  },
});
app.get("/", (req, res) => res.send("Express on Vercel"));
// 测试 API 的 GET 端点
app.get("/test", (req, res) => {
  res.status(200).send({ message: "API is working at:" });
});

// 发送邮件的 API 端点
app.post("/send-email", (req, res) => {
  const { to, subject, text } = req.body;
  // 检查 'to' 字段是否存在并且是字符串
  if (!to || typeof to !== "string") {
    return res
      .status(400)
      .send({ message: 'Invalid "to" field. It should be a string.' });
  }
  const toArray = to.split(",").map((email) => email.trim());
  console.log('Converted "to" field:', toArray); //

  const mailOptions = {
    from: "maizizi.cn@gmail.com", // 发送邮件地址
    to: toArray, //
    subject: subject, // 邮件主题
    text: text, // 邮件内容
  };

  transporter2.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ message: "Error sending email", error });
    } else {
      return res.status(200).send({ message: "Email sent", info });
    }
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
