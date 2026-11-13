"use server";

import nodemailer from 'nodemailer';
import { htmlToText } from 'nodemailer-html-to-text';
import escapeHtml from 'escape-html';
import { getSiteUrl } from '../config/site-url.js';

let transporterInstance = null;

function getTransporter() {
  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });

    // Automatically derive formatted plain text from HTML email bodies
    transporterInstance.use('compile', htmlToText());
  }
  return transporterInstance;
}

function getReceiverEmails() {
  return (process.env.RECEIVER_EMAILS || process.env.RECEIVER_EMAIL || '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
}

function getEmailSourceBadge(isAutofilled, hasEmail = true) {
  if (!hasEmail) {
    return '<span style="display: inline-block; background-color: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; margin-left: 6px;">Anonymous</span>';
  }
  return isAutofilled
    ? '<span style="display: inline-block; background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; margin-left: 6px;">Autofilled (Signed-in)</span>'
    : '<span style="display: inline-block; background-color: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; margin-left: 6px;">User-entered</span>';
}

// ── Exported Server Actions ──

export const submitContactUsForm = async (formData) => {
  try {
    if (
      !formData ||
      typeof formData.name !== 'string' ||
      typeof formData.email !== 'string' ||
      typeof formData.message !== 'string'
    ) {
      return { success: false, error: 'BAD_REQUEST' };
    }

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      return { success: false, error: 'BAD_REQUEST' };
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const isAutofilled = Boolean(formData.isAutofilled);
    const emailBadge = getEmailSourceBadge(isAutofilled, true);

    const receiverEmails = getReceiverEmails();
    const transporter = getTransporter();
    const siteUrl = getSiteUrl();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: receiverEmails,
      subject: `New Contact Us Form Submission by ${name} | JEE Challenger`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
          <h2 style="color: #333;">New Contact Us Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail} ${emailBadge}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: #fff; padding: 10px; border-radius: 4px; color: #333; border: 1px solid #ddd; white-space: pre-wrap;">
            ${safeMessage}
          </p>
          <hr style="border: 1px solid #ddd;">
          <p style="color: #888; font-size: 12px;">
            This email was sent from your website's Contact Us form on <a href="${siteUrl}" style="color: #007bff;">JEE Challenger</a>.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email for contact form submission sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error handling form submission:', error);
    return { success: false };
  }
};

export const submitFeedbackForm = async (formData) => {
  try {
    if (
      !formData ||
      typeof formData.name !== 'string' ||
      typeof formData.email !== 'string' ||
      typeof formData.feedback !== 'string'
    ) {
      return { success: false, error: 'BAD_REQUEST' };
    }

    const name = formData.name.trim();
    const email = formData.email.trim();
    const feedback = formData.feedback.trim();

    if (!name || !email || !feedback) {
      return { success: false, error: 'BAD_REQUEST' };
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeFeedback = escapeHtml(feedback);
    const isAutofilled = Boolean(formData.isAutofilled);
    const emailBadge = getEmailSourceBadge(isAutofilled, true);

    const receiverEmails = getReceiverEmails();
    const transporter = getTransporter();
    const siteUrl = getSiteUrl();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: receiverEmails,
      subject: `New Feedback from ${name} | JEE Challenger`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
          <h2 style="color: #333;">New Website Feedback</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail} ${emailBadge}</p>
          <p><strong>Feedback:</strong></p>
          <p style="background-color: #fff; padding: 10px; border-radius: 4px; color: #333; border: 1px solid #ddd; white-space: pre-wrap;">
            ${safeFeedback}
          </p>
          <hr style="border: 1px solid #ddd;">
          <p style="color: #888; font-size: 12px;">
            This email was sent from your website's Feedback Modal on <a href="${siteUrl}" style="color: #007bff;">JEE Challenger</a>.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email for feedback form submission sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error handling feedback submission:', error);
    return { success: false };
  }
};

export const submitQuestionBugReport = async (reportData) => {
  try {
    if (
      !reportData ||
      typeof reportData.issueType !== 'string' ||
      typeof reportData.description !== 'string' ||
      !reportData.questionMeta ||
      typeof reportData.questionMeta !== 'object'
    ) {
      return { success: false, error: 'BAD_REQUEST' };
    }

    const issueType = reportData.issueType.trim();
    const description = reportData.description.trim();
    const reporterEmail = typeof reportData.reporterEmail === 'string' ? reportData.reporterEmail.trim() : '';
    const { questionMeta } = reportData;

    if (!issueType || !description || !questionMeta.slug) {
      return { success: false, error: 'BAD_REQUEST' };
    }

    const safeIssueType = escapeHtml(issueType);
    const safeDescription = escapeHtml(description);
    const safeReporterEmail = escapeHtml(reporterEmail || 'Anonymous');
    const isAutofilled = Boolean(reportData.isAutofilled);
    const reporterEmailBadge = getEmailSourceBadge(isAutofilled, Boolean(reporterEmail));
    const safeSubject = escapeHtml(String(questionMeta.subject || ''));
    const safeChapter = escapeHtml(String(questionMeta.chapter || ''));
    const safeExamType = escapeHtml(String(questionMeta.exam_type || ''));
    const safeExamYear = escapeHtml(String(questionMeta.exam_year || ''));
    const safeTitle = escapeHtml(String(questionMeta.title || '(No title)'));
    const safeQuestionNumber = escapeHtml(String(questionMeta.question_number ?? 'N/A'));
    const safePaperId = escapeHtml(String(questionMeta.original_paper_id || ''));
    const safeSlug = escapeHtml(String(questionMeta.slug || ''));
    const safeMongoId = escapeHtml(String(questionMeta._id || ''));

    const isJeeMainWithNtaId =
      questionMeta.exam_type === 'JEE_MAIN' && Boolean(questionMeta.official_nta_id);
    const safeNtaId = isJeeMainWithNtaId ? escapeHtml(String(questionMeta.official_nta_id)) : '';

    const ntaIdRow = isJeeMainWithNtaId
      ? `
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fefce8;">
          <td style="padding: 10px 14px; color: #854d0e; font-weight: 600;">Official NTA ID</td>
          <td style="padding: 10px 14px;">
            <code style="background: #fef08a; border: 1px solid #fde047; padding: 3px 8px; border-radius: 5px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #713f12; font-weight: 700;">
              ${safeNtaId}
            </code>
          </td>
        </tr>
      `
      : '';

    const reportedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const siteUrl = getSiteUrl();
    const liveLink = `${siteUrl}/question/${encodeURIComponent(questionMeta.slug)}`;
    const receiverEmails = getReceiverEmails();
    const transporter = getTransporter();

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
                        ${safeIssueType}
                      </span>
                      <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em;">
                        🐛 Question Bug Report
                      </h1>
                    </div>
                    <p style="margin: 0; font-size: 13px; color: #64748b;">
                      Reported by: <strong style="color: #334155;">${safeReporterEmail}</strong> ${reporterEmailBadge} &bull; ${reportedAt} IST
                    </p>
                  </div>

                  <div style="padding: 24px 28px;">

                    <!-- Issue Description Section -->
                    <div style="margin-bottom: 24px;">
                      <div style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px;">
                        Reported Issue Description
                      </div>
                      <div style="background-color: #f8fafc; border-left: 4px solid #ef4444; border-radius: 6px; padding: 14px 16px; font-size: 14px; line-height: 1.6; color: #0f172a; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; white-space: pre-wrap;">${safeDescription}</div>
                    </div>

                    <!-- Action Button -->
                    <div style="margin-bottom: 28px; text-align: center;">
                      <a href="${liveLink}" target="_blank" rel="noreferrer" style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 11px 22px; border-radius: 10px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.25);">
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
                            <td style="padding: 10px 14px; color: #0f172a; font-weight: 700;">${safeSubject}</td>
                          </tr>
                          <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Chapter</td>
                            <td style="padding: 10px 14px; color: #0f172a; font-weight: 600;">${safeChapter}</td>
                          </tr>
                          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Paper / Origin</td>
                            <td style="padding: 10px 14px; color: #0f172a; font-weight: 600;">${safeExamType} ${safeExamYear}</td>
                          </tr>
                          <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Question Title</td>
                            <td style="padding: 10px 14px; color: #0f172a;">${safeTitle}</td>
                          </tr>
                          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Question Number</td>
                            <td style="padding: 10px 14px; color: #0f172a; font-weight: 700;">${safeQuestionNumber}</td>
                          </tr>
                          ${ntaIdRow}
                          <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Paper ID</td>
                            <td style="padding: 10px 14px;">
                              <code style="background: #f1f5f9; border: 1px solid #e2e8f0; padding: 2px 7px; border-radius: 5px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #334155;">
                                ${safePaperId}
                              </code>
                            </td>
                          </tr>
                          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Question Slug</td>
                            <td style="padding: 10px 14px;">
                              <code style="background: #f1f5f9; border: 1px solid #e2e8f0; padding: 2px 7px; border-radius: 5px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #334155;">
                                ${safeSlug}
                              </code>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">MongoDB ID</td>
                            <td style="padding: 10px 14px;">
                              <code style="background: #f1f5f9; border: 1px solid #e2e8f0; padding: 2px 7px; border-radius: 5px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #0f172a; font-weight: 700;">
                                ${safeMongoId}
                              </code>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                  </div>

                  <!-- Footer -->
                  <div style="background-color: #f8fafc; padding: 16px 28px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
                    Submitted via the Bug Report modal on <a href="${siteUrl}" style="color: #ef4444; text-decoration: none; font-weight: 600;">JEE Challenger</a>
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
    console.error('Error handling bug report submission:', error);
    return { success: false };
  }
};
