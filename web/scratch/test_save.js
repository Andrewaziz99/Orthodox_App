// No need to require fetch in Node 18+

const API_BASE = 'http://localhost:3000';

async function testSave() {
  // 1. Login
  console.log('Logging in...');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@bibleschool.com',
      password: 'Admin@1234'
    })
  });
  
  if (!loginRes.ok) {
    console.error('Login failed:', await loginRes.text());
    return;
  }
  
  const { access_token } = await loginRes.json();
  console.log('Login success. Token obtained.');

  // 2. Test Save
  const curriculum = {
    titleAr: "اختبار " + Date.now(),
    titleEn: "Test " + Date.now(),
    slug: "test-" + Date.now(),
    number: "99",
    badge: "https://example.com/badge.png",
    durationAr: "أسبوع",
    durationEn: "1 Week",
    audienceAr: "الكل",
    audienceEn: "All",
    descriptionAr: "وصف",
    descriptionEn: "Description",
    ageRangeAr: "10-20",
    ageRangeEn: "10-20",
    published: true,
    order: 0
  };

  console.log('Saving curriculum...');
  try {
    const res = await fetch(`${API_BASE}/curricula`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(curriculum),
    });
    
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Error during save:', err);
  }
}

testSave();
