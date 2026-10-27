import { encode } from 'next-auth/jwt';
import fs from 'fs';

const envText = fs.readFileSync('d:/GitHub/jeechallenger-app/.env.local', 'utf8');
const getEnv = (key) => {
  const match = envText.match(new RegExp('^' + key + '=(.*)$', 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

async function testApi() {
  const token = await encode({
    token: {
      name: 'Hckr Spy',
      email: 'hackerspydetected@gmail.com',
      id: '688dce51d3445e392b6362c3',
      sub: '688dce51d3445e392b6362c3',
    },
    secret: getEnv('NEXTAUTH_SECRET'),
  });

  const cookieHeader = `next-auth.session-token=${token}`;

  // Test 1: POST to toggle ON question 1
  console.log('1. Testing POST /api/cbt/mistake-vault (Save Q1)...');
  const postRes = await fetch('http://localhost:3000/api/cbt/mistake-vault', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      paper_id: 'JEE_Main_2026_Apr_2nd_Shift_1',
      paper_slug: 'jee-main-2026-apr-2nd-shift-1',
      question_number: 1,
      subject: 'Physics',
      chapter: 'Kinematics',
    }),
  });
  console.log('POST Status:', postRes.status);
  const postJson = await postRes.json();
  console.log('POST Response:', postJson);

  // Test 2: GET saved question numbers for this paper
  console.log('\n2. Testing GET /api/cbt/mistake-vault?paper_id=JEE_Main_2026_Apr_2nd_Shift_1...');
  const getRes = await fetch('http://localhost:3000/api/cbt/mistake-vault?paper_id=JEE_Main_2026_Apr_2nd_Shift_1', {
    headers: { Cookie: cookieHeader },
  });
  console.log('GET Status:', getRes.status);
  const getJson = await getRes.json();
  console.log('GET Response:', getJson);

  // Test 3: GET all saved questions across the entire platform
  console.log('\n3. Testing GET /api/cbt/mistake-vault (All items)...');
  const getAllRes = await fetch('http://localhost:3000/api/cbt/mistake-vault', {
    headers: { Cookie: cookieHeader },
  });
  console.log('GET All Status:', getAllRes.status);
  const getAllJson = await getAllRes.json();
  console.log('GET All Response Total:', getAllJson.total);
}

testApi().catch(console.error);
