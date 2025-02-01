"use server";
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
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: process.env.RECEIVER_EMAIL,
      subject: 'New Contact Us Form Submission | JEE Challenger', // Subject of the email
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
            This email was sent from your website's Contact Us form on <a href="https://jeechallenger.vercel.app" style="color: #007bff;">JEE Challenger</a>.
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
