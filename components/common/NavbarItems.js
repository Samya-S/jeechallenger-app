const NavbarItems = [
  {
    title: 'Home',
    type: 'link',
    url: '/'
  },
  {
    title: 'Materials',
    type: 'dropdown',
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
