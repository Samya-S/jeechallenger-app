"use client";
import { submitContactUsForm } from "@/server/contact-actions";
import { useState } from "react";

const ContactUsComponent = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await submitContactUsForm(formData);

      if (result.success) {
        setResponseMessage("Woohoo! Your message is on its way. Thank you!");
        setFormData({ name: "", email: "", message: "" });
        setIsSubmitted(true);
        setIsError(false);
        setTimeout(() => setIsSubmitted(false), 10000); // Reset confirmation message after 10 seconds
      } else {
        setErrorMessage("Oops! Something went wrong. Please try again.");
        setIsError(true);
        setIsSubmitted(false);
        setTimeout(() => setIsError(false), 10000); // Reset confirmation message after 10 seconds
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again later.");
      setIsError(true);
      setIsSubmitted(false);
      setTimeout(() => setIsError(false), 10000); // Reset confirmation message after 10 seconds
    }

  };

  return (
    <div className="headingimg flex items-center justify-center bg-gray-100 px-5">
      <div className="w-full max-w-lg bg-white my-10 p-6 rounded-lg shadow-lg">
        <h2 className="heading text-3xl font-bold mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-2 border border-gray-300 rounded"
            name="name"
            placeholder="What's your name? Let us know! *"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="email"
            name="email"
            placeholder="Your email, so we can reach out! *"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded h-32 text-base"
            name="message"
            placeholder="What’s on your mind? We’re all ears! *"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit" className="p-2 button2">
            Send
          </button>
        </form>
        <p className="text-sm text-left text-gray-500 mt-4">Fields marked with <span className="text-red-500 darkmode-ignore">*</span> are required.</p>

        {isSubmitted && (
          <div className="mt-4 p-2 bg-green-100 text-green-800 border border-green-300 rounded">
            <p>{responseMessage}</p>
          </div>
        )}

        {isError && (
          <div className="mt-4 p-2 bg-red-100 text-red-800 border border-red-300 rounded">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUsComponent;
