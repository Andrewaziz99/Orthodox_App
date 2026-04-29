(async () => {
  try {
    const loginRes = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@bibleschool.com', password: 'Admin@1234' }),
    });

    const loginJson = await loginRes.json().catch(() => null);
    console.log('LOGIN_STATUS', loginRes.status);
    console.log('LOGIN_BODY', JSON.stringify(loginJson));

    if (!loginRes.ok) {
      process.exit(1);
    }

    const token = loginJson?.access_token;
    if (!token) {
      console.error('No access_token returned');
      process.exit(1);
    }

    const churchPayload = {
      name: 'Test Church (Auto)',
      location: 'Test City',
      address: '123 Test St',
      phone: '+1 555 1234',
      email: 'test@example.com',
      maxChildren: 50,
    };

    const createRes = await fetch('http://localhost:3000/churches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(churchPayload),
    });

    const createJson = await createRes.json().catch(() => null);
    console.log('CREATE_STATUS', createRes.status);
    console.log('CREATE_BODY', JSON.stringify(createJson));

    process.exit(createRes.ok ? 0 : 1);
  } catch (err) {
    console.error('ERROR', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
