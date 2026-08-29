import {
  FaHome, FaBook, FaLink, FaLightbulb,
  FaLayerGroup, FaRobot, FaBrain, FaCubes, FaMagic, FaCompass, FaCogs
} from 'react-icons/fa';

const NavbarItems = [
  {
    title: 'Home',
    type: 'link',
    url: '/',
    icon: <FaHome />
  },
  {
    title: 'Resources',
    type: 'dropdown',
    icon: <FaBook />,
    items: [
      {
        title: 'Physics',
        url: '/physics'
      },
      {
        title: 'Chemistry',
        url: '/chemistry'
      },
      {
        title: 'Mathematics',
        url: '/mathematics'
      },
      {
        title: 'Previous Year Questions',
        url: '/previous-year-questions'
      },
      {
        title: 'More study materials',
        url: '/more-study-materials'
      }
    ]
  },
  {
    title: 'Official Links',
    type: 'dropdown',
    icon: <FaLink />,
    items: [
      {
        title: 'JEE Main',
        url: '/jee-main'
      },
      {
        title: 'JEE Advanced',
        url: '/jee-advanced'
      }
    ]
  },
  {
    title: 'Utilities',
    type: 'dropdown',
    icon: <FaCompass />,
    items: [
      {
        title: 'AI Tutor',
        url: '/ai-tutor'
      },
      {
        title: 'Syllabus Tracker',
        url: '/syllabus-tracker'
      },
    ]
  },
  {
    title: 'Read More',
    type: 'dropdown',
    icon: <FaLightbulb />,
    items: [
      {
        title: 'Articles & Tips',
        url: '/blogs'
      },
      {
        title: 'Latest News',
        url: '/news'
      }
    ]
  }
];

export default NavbarItems;
