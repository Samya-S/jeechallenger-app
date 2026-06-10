import ContactUsComponent from './ContactUsComponent'
import { ogImageMeta } from '@/lib/og-metadata'

const pageOg = ogImageMeta({
  title: 'Contact Us',
  subtitle: 'Queries, feedback, and suggestions welcome',
  theme: 'brand',
  alt: 'Contact JEE Challenger',
})

export const metadata = {
  title: "Contact Us | JEE Challenger",
  description: "Contact us for any queries, feedback, or suggestions related to JEE Challenger.",
  alternates: {
    canonical: '/contact-us',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Contact Us - JEE Challenger",
    description: "Contact us for any queries, feedback, or suggestions related to JEE Challenger.",
    url: '/contact-us',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contact Us - JEE Challenger",
    description: "Contact us for any queries, feedback, or suggestions related to JEE Challenger.",
    images: pageOg.twitterImages,
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
