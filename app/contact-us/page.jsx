import ContactUsComponent from './ContactUsComponent'

export const metadata = {
  title: "Contact Us | JEE Challenger",
  description: "Contact us for any queries, feedback, or suggestions related to JEE Challenger.",
  openGraph: {
    title: "Contact Us - JEE Challenger",
    description: "Contact us for any queries, feedback, or suggestions related to JEE Challenger.",
    url: '/contact-us',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact JEE Challenger',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contact Us - JEE Challenger",
    description: "Contact us for any queries, feedback, or suggestions related to JEE Challenger.",
    images: ['/images/jcicon.jpg'],
  },
};

const ContactUsPage = () => {
  return (
    <div>
      <ContactUsComponent />
    </div>
  )
}

export default ContactUsPage
