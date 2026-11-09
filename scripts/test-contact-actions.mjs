import nodemailer from 'nodemailer';
import { htmlToText } from 'nodemailer-html-to-text';
import escapeHtml from 'escape-html';
import { submitContactUsForm, submitFeedbackForm, submitQuestionBugReport } from '../server/contact-actions.js';

async function runTests() {
  console.log('Testing server/contact-actions.js...');

  // Mock environment variables for testing
  process.env.AUTH_EMAIL = 'test@example.com';
  process.env.AUTH_PASS = 'mockpassword';
  process.env.SENDER_EMAIL = 'sender@example.com';
  process.env.RECEIVER_EMAILS = 'receiver1@example.com, receiver2@example.com';
  process.env.NEXT_PUBLIC_APP_URL = 'https://jeechallenger.com';

  // Test 1: Validation rejection on empty/missing fields
  console.log('Test 1: Bad request schema validation');
  const badContact = await submitContactUsForm({ name: '', email: 'test@example.com', message: 'Hello' });
  if (badContact.success === false && badContact.error === 'BAD_REQUEST') {
    console.log('  PASS: submitContactUsForm rejected empty name');
  } else {
    throw new Error('Test 1 failed for submitContactUsForm');
  }

  const badFeedback = await submitFeedbackForm({ name: 'User', email: 'test@example.com', feedback: '   ' });
  if (badFeedback.success === false && badFeedback.error === 'BAD_REQUEST') {
    console.log('  PASS: submitFeedbackForm rejected empty feedback');
  } else {
    throw new Error('Test 1 failed for submitFeedbackForm');
  }

  const badBugReport = await submitQuestionBugReport({ issueType: 'MATH_ERROR', description: 'error' });
  if (badBugReport.success === false && badBugReport.error === 'BAD_REQUEST') {
    console.log('  PASS: submitQuestionBugReport rejected missing questionMeta');
  } else {
    throw new Error('Test 1 failed for submitQuestionBugReport');
  }

  // Test 2: HTML injection neutralization test
  console.log('Test 2: HTML injection neutralization');
  const maliciousInput = '<script>alert("hacked")</script><a href="http://phish.com">click</a>';
  const escaped = escapeHtml(maliciousInput);
  if (escaped.includes('<script>') || escaped.includes('<a')) {
    throw new Error('HTML escaping failed to neutralize HTML tags');
  }
  if (escaped === '&lt;script&gt;alert(&quot;hacked&quot;)&lt;/script&gt;&lt;a href=&quot;http://phish.com&quot;&gt;click&lt;/a&gt;') {
    console.log('  PASS: HTML injection payload correctly neutralized');
  } else {
    throw new Error(`Unexpected escaped output: ${escaped}`);
  }

  // Test 3: Math formula preservation
  console.log('Test 3: Math formula & genuine user experience preservation');
  const formula = 'When T < 300K and P > 10 atm, reaction rate is 2x';
  const escapedFormula = escapeHtml(formula);
  if (escapedFormula === 'When T &lt; 300K and P &gt; 10 atm, reaction rate is 2x') {
    console.log('  PASS: Math operators preserved as safe HTML entities');
  } else {
    throw new Error(`Unexpected escaped formula: ${escapedFormula}`);
  }

  // Test 4: Automatic plain text generation via nodemailer-html-to-text
  console.log('Test 4: Automatic plain-text derivation from HTML');
  const testTransporter = nodemailer.createTransport({ streamTransport: true, newline: 'windows' });
  testTransporter.use('compile', htmlToText());

  const sampleHtml = `
    <div>
      <h2>New Contact Us Form Submission</h2>
      <p><strong>Name:</strong> Test Student</p>
      <p><strong>Message:</strong></p>
      <p>Need help with Thermodynamics question 12</p>
    </div>
  `;

  const info = await testTransporter.sendMail({
    from: 'test@example.com',
    to: 'admin@jeechallenger.com',
    subject: 'Test Subject',
    html: sampleHtml,
  });

  const chunks = [];
  for await (const chunk of info.message) {
    chunks.push(chunk);
  }
  const rawMime = Buffer.concat(chunks).toString();

  if (rawMime.includes('Content-Type: text/plain') && rawMime.includes('NEW CONTACT US FORM SUBMISSION') && rawMime.includes('Need help with Thermodynamics question 12')) {
    console.log('  PASS: Plain text successfully and automatically derived from HTML body');
  } else {
    throw new Error('Automatic plain-text derivation failed in MIME stream');
  }

  console.log('\nAll 4 test suites passed successfully!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
