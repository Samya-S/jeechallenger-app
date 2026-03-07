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
        title: 'Physics PDFs',
        url: '/materials/physics'
      },
      {
        title: 'Chemistry PDFs',
        url: '/materials/chemistry'
      },
      {
        title: 'Mathematics PDFs',
        url: '/materials/mathematics'
      },
      {
        title: 'Chapterwise solved PYQs',
        url: '/materials/chapterwise-solved-pyqs'
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
    title: 'Syllabus Tracker',
    type: 'link',
    url: '/syllabus-tracker'
  },
  {
    title: 'AI Tutor',
    type: 'link',
    url: '/ai-tutor'
  },
  {
    title: 'Latest News',
    type: 'link',
    url: '/news'
  }
];

export default NavbarItems;
