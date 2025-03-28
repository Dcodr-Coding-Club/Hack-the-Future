import home from './Home.jpg';
import about from './About.jpg';
import projects from './Projects.jpg';
import contact from './Contact.jpg';
import github from './Github.jpg';
import linkedin from './LinkedIn.jpg';
import twitter from './Twitter.jpg';
import resume from './Resume.jpg';

export const BtnList = [
  { label: "Home", link: "/", image: home, newTab: false },
  { label: "Courses", link: "/about", image: about, newTab: false },
  { label: "Projects", link: "/projects", image: projects, newTab: false },
  { label: "Contact", link: "/contact", image: contact, newTab: false },
  {
    label: "Github",
    link: "https://www.github.com/codebucks27",
    image: github,
    newTab: true,
  },
  {
    label: "LinkedIn",
    link: "https://www.linkedin.com/in/codebucks",
    image: linkedin,
    newTab: true,
  },
  {
    label: "Twitter",
    link: "https://www.x.com/code_bucks",
    image: twitter,
    newTab: true,
  },
  {
    label: "Resume",
    link: "/resume.pdf",
    image: resume,
    newTab: true,
  },
];
