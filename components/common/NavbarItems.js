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
    title: 'Official links',
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
    title: 'More platforms',
    type: 'dropdown',
    items: [
      {
        title: 'Unacademy',
        url: '/more-platforms/unacademy'
      },
      {
        title: 'Apni Kaksha',
        url: '/more-platforms/apnikaksha'
      },
      {
        title: 'Physics Wallah',
        url: '/more-platforms/physicswallah'
      }
    ]
  }
];

export default NavbarItems;
