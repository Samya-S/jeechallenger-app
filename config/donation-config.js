import { AD_CONFIG } from '@/config/ad-config';

const UPI_ID = 'samyasaha08@sbi';

export const DONATION_CONFIG = {
  upiId: UPI_ID,
  upiDeepLink: `upi://pay?pa=${UPI_ID}&pn=JEE%20Challenger&cu=INR&tn=Support%20for%20JEE%20Challenger`,
  qrImageSrc: '/images/donation-qr-muw81tyw.png',

  headline: 'Keep JEE Challenger Running 🚀',

  missionStatement:
    'We are committed to keeping our tools, trackers, resources, and AI assistant free for all aspirants. However, maintaining our infrastructure and keeping the platform running smoothly costs money.',

  get adsStatement() {
    return AD_CONFIG?.enabled
      ? 'We currently rely on ads to keep the site running, but we hate them as much as you do! If our platform has added value to your preparation journey, consider chipping in.'
      : 'We run JEE Challenger completely ad-free with zero pop-ups or redirects. If our platform has added value to your preparation journey, consider chipping in to help us keep it that way.';
  },

  get goalCallout() {
    return AD_CONFIG?.enabled
      ? 'Once we reach our bare minimum funding goal to cover infrastructure costs, we will remove all pop-up ads and redirects completely!'
      : '100% of your contributions go directly toward covering our monthly server and AI compute costs, keeping the platform clean and ad-free for everyone.';
  },

  adBlocker: {
    description:
      'We are committed to keeping JEE Challenger 100% free for all aspirants. Maintaining our infrastructure and AI tools costs real money, and we currently rely on ads to keep the platform running—',
    descriptionEmphasis: 'though we hate them as much as you do!',
    goalCalloutPrefix: 'Our Community Goal:',
  },
};
