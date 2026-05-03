// No need to require fetch

const API_BASE = 'http://localhost:3000';

async function testNews() {
  // 1. Login
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@bibleschool.com',
      password: 'Admin@1234'
    })
  });
  const { access_token } = await loginRes.json();

  // 2. Test Save News
  const article = {
    titleAr: "خبر جديد " + Date.now(),
    titleEn: "New News " + Date.now(),
    slug: "news-" + Date.now(),
    excerptAr: "ملخص",
    excerptEn: "Excerpt",
    bodyAr: "محتوى",
    bodyEn: "Body",
    categoryAr: "عام",
    categoryEn: "General",
    date: "March 2025",
    published: true,
    order: 0
  };

  const res = await fetch(`${API_BASE}/news`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(article),
  });
  
  console.log('Status:', res.status);
  console.log('Response:', await res.text());
}

testNews();
