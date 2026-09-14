"use server";
import { getSiteUrl } from '@/config/site-url';
import nodemailer from 'nodemailer';

export const submitContactUsForm = async (formData) => {
  try {
    // Step 1: Create a transporter object using your email service provider details
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
      }
    });

    // Step 2: Compose the email content
    // Support multiple receiver emails via env var: RECEIVER_EMAILS (comma separated).
    // Falls back to single RECEIVER_EMAIL for backward compatibility.
    const receiverEmails = (process.env.RECEIVER_EMAILS || process.env.RECEIVER_EMAIL || '')
      .split(',')
      .map(email => email.trim())
      .filter(Boolean);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: receiverEmails,
      subject: `New Contact Us Form Submission by ${formData.name} | JEE Challenger`, // Subject of the email
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
          <h2 style="color: #333;">New Contact Us Form Submission</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: #fff; padding: 10px; border-radius: 4px; color: #333; border: 1px solid #ddd;">
            ${formData.message}
          </p>
          <hr style="border: 1px solid #ddd;">
          <p style="color: #888; font-size: 12px;">
            This email was sent from your website's Contact Us form on <a href="${getSiteUrl()}" style="color: #007bff;">JEE Challenger</a>.
          </p>
        </div>
      `,
    };

    // Step 3: Send the email
    await transporter.sendMail(mailOptions);

    // Log the success and return a success response
    console.log('Email for contact form submission sent successfully');
    return { success: true };
  } catch (error) {
    console.error("Error handling form submission:", error);
    return { success: false };
  }
};

export const submitFeedbackForm = async (formData) => {
  try {
    // Step 1: Create a transporter object using your email service provider details
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
      }
    });

    // Step 2: Compose the email content
    // Support multiple receiver emails via env var: RECEIVER_EMAILS (comma separated).
    // Falls back to single RECEIVER_EMAIL for backward compatibility.
    const receiverEmails = (process.env.RECEIVER_EMAILS || process.env.RECEIVER_EMAIL || '')
      .split(',')
      .map(email => email.trim())
      .filter(Boolean);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: receiverEmails,
      subject: `New Feedback from ${formData.name} | JEE Challenger`, // Subject of the email
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
          <h2 style="color: #333;">New Website Feedback</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Feedback:</strong></p>
          <p style="background-color: #fff; padding: 10px; border-radius: 4px; color: #333; border: 1px solid #ddd;">
            ${formData.feedback}
          </p>
          <hr style="border: 1px solid #ddd;">
          <p style="color: #888; font-size: 12px;">
            This email was sent from your website's Feedback Modal on <a href="${getSiteUrl()}" style="color: #007bff;">JEE Challenger</a>.
          </p>
        </div>
      `,
    };

    // Step 3: Send the email
    await transporter.sendMail(mailOptions);

    // Log the success and return a success response
    console.log('Email for feedback form submission sent successfully');
    return { success: true };
  } catch (error) {
    console.error("Error handling feedback submission:", error);
    return { success: false };
  }
};

export const submitQuestionBugReport = async (reportData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
      }
    });

    const receiverEmails = (process.env.RECEIVER_EMAILS || process.env.RECEIVER_EMAIL || '')
      .split(',')
      .map(email => email.trim())
      .filter(Boolean);

    const { issueType, description, reporterEmail, questionMeta } = reportData;

    // Build conditional NTA ID row — only for JEE Main questions with a real NTA ID
    const ntaIdRow = (questionMeta.exam_type === 'JEE_MAIN' && questionMeta.official_nta_id)
      ? `
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fefce8;">
          <td style="padding: 10px 14px; color: #854d0e; font-weight: 600;">Official NTA ID</td>
          <td style="padding: 10px 14px;">
            <code style="background: #fef08a; border: 1px solid #fde047; padding: 3px 8px; border-radius: 5px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #713f12; font-weight: 700;">
              ${questionMeta.official_nta_id}
            </code>
          </td>
        </tr>
      `
      : '';

    const reportedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const liveLink = `${getSiteUrl()}/question/${questionMeta.slug}`;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: receiverEmails,
      subject: `🐛 [PYQ Bug Report] ${questionMeta.subject}: ${questionMeta.title || questionMeta.slug} | JEE Challenger`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">
                <div style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); text-align: left;">
                  
                  <!-- Top Accent Bar -->
                  <div style="height: 5px; background: linear-gradient(90deg, #ef4444, #f97316);"></div>

                  <!-- Header -->
                  <div style="padding: 24px 28px 20px 28px; border-bottom: 1px solid #f1f5f9;">
                    <div style="margin-bottom: 10px;">
                      <span style="display: inline-block; background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 8px;">
                        ${issueType}
                      </span>
                      <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em;">
                        🐛 Question Bug Report
                      </h1>
                    </div>
                    <p style="margin: 0; font-size: 13px; color: #64748b;">
                      Reported by: <strong style="color: #334155;">${reporterEmail || 'Anonymous'}</strong> &bull; ${reportedAt} IST
                    </p>
                  </div>

                  <div style="padding: 24px 28px;">

                    <!-- Issue Description Section -->
                    <div style="margin-bottom: 24px;">
                      <div style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px;">
                        Reported Issue Description
                      </div>
                      <div style="background-color: #f8fafc; border-left: 4px solid #ef4444; border-radius: 6px; padding: 14px 16px; font-size: 14px; line-height: 1.6; color: #0f172a; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; white-space: pre-wrap;">${description}</div>
                    </div>

                    <!-- Action Button -->
                    <div style="margin-bottom: 28px; text-align: center;">
                      <a href="${liveLink}" target="_blank" style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 11px 22px; border-radius: 10px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.25);">
                        Open Live Question on Website &rarr;
                      </a>
                    </div>

                    <!-- Metadata Table Section -->
                    <div style="margin-bottom: 8px;">
                      <div style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 10px;">
                        Question Identifiers & Details
                      </div>
                      
                      <table style="width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                        <tbody>
                          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600; width: 34%;">Subject</td>
                            <td style="padding: 10px 14px; color: #0f172a; font-weight: 700;">${questionMeta.subject}</td>
                          </tr>
                          <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Chapter</td>
                            <td style="padding: 10px 14px; color: #0f172a; font-weight: 600;">${questionMeta.chapter}</td>
                          </tr>
                          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Paper / Origin</td>
                            <td style="padding: 10px 14px; color: #0f172a; font-weight: 600;">${questionMeta.exam_type} ${questionMeta.exam_year}</td>
                          </tr>
                          <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Question Title</td>
                            <td style="padding: 10px 14px; color: #0f172a;">${questionMeta.title || '(No title)'}</td>
                          </tr>
                          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Question Number</td>
                            <td style="padding: 10px 14px; color: #0f172a; font-weight: 700;">${questionMeta.question_number ?? 'N/A'}</td>
                          </tr>
                          ${ntaIdRow}
                          <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Paper ID</td>
                            <td style="padding: 10px 14px;">
                              <code style="background: #f1f5f9; border: 1px solid #e2e8f0; padding: 2px 7px; border-radius: 5px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #334155;">
                                ${questionMeta.original_paper_id}
                              </code>
                            </td>
                          </tr>
                          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Question Slug</td>
                            <td style="padding: 10px 14px;">
                              <code style="background: #f1f5f9; border: 1px solid #e2e8f0; padding: 2px 7px; border-radius: 5px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #334155;">
                                ${questionMeta.slug}
                              </code>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">MongoDB ID</td>
                            <td style="padding: 10px 14px;">
                              <code style="background: #f1f5f9; border: 1px solid #e2e8f0; padding: 2px 7px; border-radius: 5px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #0f172a; font-weight: 700;">
                                ${questionMeta._id}
                              </code>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                  </div>

                  <!-- Footer -->
                  <div style="background-color: #f8fafc; padding: 16px 28px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
                    Submitted via the Bug Report modal on <a href="${getSiteUrl()}" style="color: #ef4444; text-decoration: none; font-weight: 600;">JEE Challenger</a>
                  </div>

                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Bug report email sent successfully');
    return { success: true };
  } catch (error) {
    console.error("Error handling bug report submission:", error);
    return { success: false };
  }
};
