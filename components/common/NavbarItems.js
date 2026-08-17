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
    title: 'Materials',
    type: 'dropdown',
    icon: <FaBook />,
    items: [
      {
        title: 'Physics',
        url: '/materials/physics'
      },
      {
        title: 'Chemistry',
        url: '/materials/chemistry'
      },
      {
        title: 'Mathematics',
        url: '/materials/mathematics'
      },
      {
        title: 'Previous Year Questions',
        url: '/materials/previous-year-questions'
      },
      {
        title: 'More study materials',
        url: '/materials/more-study-materials'
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
        url: '/official-links/jee-main'
      },
      {
        title: 'JEE Advanced',
        url: '/official-links/jee-advanced'
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
