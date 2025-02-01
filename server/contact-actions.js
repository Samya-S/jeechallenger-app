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
      text: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`, // The email body
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
