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
        title: "Welcome Aboard!",
        company_name: "Step 1:",
        icon: starbucks,
        iconBg: "#accbe1",
        date: " ",
        points: [
            "Get introduced to your learning journey with a fun welcome video featuring sign language. 🎥👋",

            "Learn how to navigate the course and what exciting topics await you.",

            "Choose your learning path based on what excites you the most!",
        ],
    },
    {
        title: "Learn & Explore! 🔍",
        company_name: "step 2:",
        icon: tesla,
        iconBg: "#fbc3bc",
        date: " ",
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
        date: " ",
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
        date: " ",
        points: [
           "Successfully complete your learning path and unlock special certificates & rewards.",

            "Continue exploring advanced topics and take on new learning adventures.",
            
            "Celebrate your journey and share your achievements with friends and family! 🎊",
        ],
    },
];

export const socialLinks = [
    {
        name: 'Contact',
        iconUrl: contact,
        link: '/contact',
    },
    {
        name: 'GitHub',
        iconUrl: github,
        link: 'https://github.com/YourGitHubUsername',
    },
    {
        name: 'LinkedIn',
        iconUrl: linkedin,
        link: 'https://www.linkedin.com/in/YourLinkedInUsername',
    }
];

export const projects = [
    {
        iconUrl: pricewise,
        theme: 'btn-back-red',
        name: 'Amazon Price Tracker',
        description: 'Developed a web application that tracks and notifies users of price changes for products on Amazon, helping users find the best deals.',
        link: 'https://github.com/adrianhajdin/pricewise',
    },
    {
        iconUrl: threads,
        theme: 'btn-back-green',
        name: 'Full Stack Threads Clone',
        description: 'Created a full-stack replica of the popular discussion platform "Threads," enabling users to post and engage in threaded conversations.',
        link: 'https://github.com/adrianhajdin/threads',
    },
    {
        iconUrl: car,
        theme: 'btn-back-blue',
        name: 'Car Finding App',
        description: 'Designed and built a mobile app for finding and comparing cars on the market, streamlining the car-buying process.',
        link: 'https://github.com/adrianhajdin/project_next13_car_showcase',
    },
    {
        iconUrl: snapgram,
        theme: 'btn-back-pink',
        name: 'Full Stack Instagram Clone',
        description: 'Built a complete clone of Instagram, allowing users to share photos and connect with friends in a familiar social media environment.',
        link: 'https://github.com/adrianhajdin/social_media_app',
    },
    {
        iconUrl: estate,
        theme: 'btn-back-black',
        name: 'Real-Estate Application',
        description: 'Developed a web application for real estate listings, facilitating property searches and connecting buyers with sellers.',
        link: 'https://github.com/adrianhajdin/projects_realestate',
    },
    {
        iconUrl: summiz,
        theme: 'btn-back-yellow',
        name: 'AI Summarizer Application',
        description: 'App that leverages AI to automatically generate concise & informative summaries from lengthy text content, or blogs.',
        link: 'https://github.com/adrianhajdin/project_ai_summarizer',
    }
];