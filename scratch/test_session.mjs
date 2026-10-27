import { encode } from 'next-auth/jwt';

async function testSession() {
  const token = await encode({
    token: {
      name: 'Hckr Spy',
      email: 'hackerspydetected@gmail.com',
      id: '688dce51d3445e392b6362c3',
      sub: '688dce51d3445e392b6362c3',
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  const res = await fetch('http://localhost:3000/api/auth/session', {
    headers: {
      cookie: `next-auth.session-token=${token}`,
    },
  });

  const sessionData = await res.json();
  console.log('Session response status:', res.status);
  console.log('Session data:', sessionData);

  const testPageRes = await fetch('http://localhost:3000/mock-test/jee-main-2026-apr-2nd-shift-1', {
    redirect: 'manual',
    headers: {
      cookie: `next-auth.session-token=${token}`,
    },
  });

  console.log('Mock test page status:', testPageRes.status);
  console.log('Location header:', testPageRes.headers.get('location'));
}

testSession().catch(console.error);
