import home from './Home.jpg';
import about from './About.jpg';
import projects from './Projects.jpg';
import contact from './Contact.jpg';
import github from './Github.jpg';
import linkedin from './LinkedIn.jpg';
import twitter from './Twitter.jpg';
import resume from './Resume.jpg';

export const BtnList = [
  { label: "Home", link: "/progress", image: home, newTab: false },
  { label: "Courses", link: "/about", image: about, newTab: false },
  { label: "Classes", link: "/projects", image: projects, newTab: false },
  { label: "Contact", link: "/contact", image: contact, newTab: false },
  {
    label: "Games",
    link: "/game",
    image: github,
    newTab: true,
  },
  {
    label: "Practice",
    link: "/contact",
    image: linkedin,
    newTab: true,
  },
  {
    label: "Profile",
    link: "/Profile",
    image: twitter,
    newTab: true,
  },
  {
    label: "Aboutus",
    link: "/Aboutus",
    image: resume,
    newTab: true,
  },
];
