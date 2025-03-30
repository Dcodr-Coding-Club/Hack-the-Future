import { meta, shopify, starbucks, tesla } from "../assets/images";
import {
    car,
    contact,
    css,
    estate,
    express,
    git,
    github,
    html,
    javascript,
    linkedin,
    mongodb,
    motion,
    mui,
    nextjs,
    nodejs,
    pricewise,
    react,
    redux,
    sass,
    snapgram,
    summiz,
    tailwindcss,
    threads,
    typescript
} from "../assets/icons";

export const skills = [
    {
        imageUrl: css,
        name: "CSS",
        type: "Frontend",
    },
    {
        imageUrl: express,
        name: "Express",
        type: "Backend",
    },
    {
        imageUrl: git,
        name: "Git",
        type: "Version Control",
    },
    {
        imageUrl: github,
        name: "GitHub",
        type: "Version Control",
    }
];

export const experiences = [
    {
        title: "Welcome Aboard! 🚀",
        company_name: "Step 1:",
        icon: starbucks,
        iconBg: "#accbe1",
        date: "",
        points: [
            "Get introduced to your learning journey with a fun welcome video featuring sign language. 🎥👋",
            "Learn how to navigate the course and what exciting topics await you.",
            "Choose your learning path based on what excites you the most!",
        ],
    },
    {
        title: "Learn & Explore! 🔍",
        company_name: "Step 2:",
        icon: tesla,
        iconBg: "#fbc3bc",
        date: "",
        points: [
            "Watch interactive videos and sign language lessons to understand key topics.",
            "Explore subjects like Math, Science, Art, and Storytelling through engaging visuals and examples.",
            "Participate in guided activities to reinforce learning in a fun way.",
        ],
    },
    {
        title: "Practice & Play! 🎮",
        company_name: "Step 3:",
        icon: shopify,
        iconBg: "#b7e4c7",
        date: "",
        points: [
            "Engage with interactive quizzes, puzzles, and mini-games to test your knowledge.",
            "Work on hands-on projects and creative exercises to apply what you’ve learned.",
            "Track your progress with a personalized learning dashboard.",
        ],
    },
    {
        title: "Super Learner Status! 🚀",
        company_name: "Step 4:",
        icon: meta,
        iconBg: "#a2d2ff",
        date: "",
        points: [
            "Successfully complete your learning path and unlock special certificates & rewards.",
            "Continue exploring advanced topics and take on new learning adventures.",
            "Celebrate your journey and share your achievements with friends and family! 🎊",
        ],
    },
];

export const socialLinks = [
    {
        name: "Contact",
        iconUrl: contact,
        link: "/contact",
    },
    {
        name: "GitHub",
        iconUrl: github,
        link: "https://github.com/YourActualGitHubUsername",  // Replace with your GitHub username
    },
    {
        name: "LinkedIn",
        iconUrl: linkedin,
        link: "https://www.linkedin.com/in/YourActualLinkedInUsername",  // Replace with your LinkedIn profile
    }
];

export const projects = [
    {
        iconUrl: pricewise,
        name: "ASL Universal",
        description: "Many people in the United States still believe that ASL is universal. Is ASL universal? How was it created and why is it important?",
        link: "https://www.handtalk.me/en/blog/universal-sign-languages/",
    },
    {
        iconUrl: threads,
        name: "Sign Language Alphabets From Around The World",
        description: "The journey to communicating globally begins here!",
        link: "https://www.childrensmn.org/references/pfs/rehabpublic/sign-language-for-hearing-children.pdf",
    },
    {
        iconUrl: car,
        name: "Sign language for hearing children",
        description: "How can sign language help a child who can hear? Communication begins before your child speaks his or her first word.",
        link: "https://github.com/adrianhajdin/project_next13_car_showcase",
    },
    {
        iconUrl: snapgram,
        name: "Makaton Sign language",
        description: "Makaton is a very simple language based on a list of simple everyday words, which many body languages for communication.",
        link: "https://www.uhcw.nhs.uk/download/clientfiles/files/Patient%20Information%20Leaflets/Women%20and%20Children_s/Paediatrics/Makaton%20sign%20language.pdf",
    },
    {
        iconUrl: estate,
        name: "Comunication in the classroom",
        description: "With the help of this booklet you can learn all the basics of sign language to help with teaching and interacting with deaf or hard of hearing students.",
        link: "https://2gimnazija.edu.ba/images/Booklet_ASL_10_5_2021.pdf",
    },
    {
        iconUrl: summiz,
        name: "Sign Language",
        description: "Using sign language can serve as an important vehicle for tapping into functional communication, before children begin talking. ",
        link: "https://sproutpeds.com/sign-language-top-10-beginner-signs-every-child-should-learn/",
    }
];

