// server.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PASSWORD = process.env.ACCESS_PASSWORD;

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

// ✅ 비밀번호 검증 API
app.post('/api/verify-password', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    // 인증된 사용자에게 인증 쿠키 부여
    res.cookie('auth', 'ok', {
      httpOnly: true,
      maxAge: 1000 * 60 * 30, // 30분 유효
    });
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// ✅ 보호된 페이지 접근 라우터
app.get('/secure', (req, res) => {
  const isAuthenticated = req.cookies.auth === 'ok';
  if (!isAuthenticated) {
    return res.status(403).send('<h2>❌ 비인가된 접근입니다.</h2><a href="/">돌아가기</a>');
  }
  res.sendFile(path.join(__dirname, 'public', 'secret.html'));
});

// ✅ 서버 실행
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 실행 중`);
});
