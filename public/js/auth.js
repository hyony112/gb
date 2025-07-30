// public/js/auth.js
async function checkPassword() {
    const password = document.getElementById('password').value;
    const res = await fetch('/api/verify-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
  
    const result = await res.json();
  
    if (result.success) {
      window.location.href = '/secure';
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  }
  