import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import { experiences, skills } from "../constants";

import "react-vertical-timeline-component/style.min.css";
import { Footer } from "../components";

const About = () => {
  return (
    <section className='max-container'>
      <h1 className='head-text'>
        Hello, {" "}
        <span className='blue-gradient_text font-semibold drop-shadow'>
          {" "}
          StarStreamer
        </span>{" "}
        👋
      </h1>

      <div className='mt-5 flex flex-col gap-3 text-slate-500'>
        <p>
        Are you ready for a super fun adventure?{" "} 🌟
Here, we will learn new things, play cool games, and explore exciting worlds—all in a way that’s fun and easy to understand!
        </p>
      </div>


      <div className='py-16'>
        <h3 className='subhead-text'>Learning Adventure Roadmap{" "} 🌟</h3>
        <div className='mt-5 flex flex-col gap-3 text-slate-500'>
          <p>
          Are you ready for a super fun journey? 🚀 Imagine going on an adventure where you can learn new things, play exciting games, and earn cool rewards! 🌟
          <br></br>
          <br></br>
          Follow this magical learning path to become a Super Learner! 🏆✨
    
          </p>
        </div>

        <div className='mt-12 flex'>
          <VerticalTimeline>
            {experiences.map((experience, index) => (
              <VerticalTimelineElement
                key={experience.company_name}
                date={experience.date}
                iconStyle={{ background: experience.iconBg }}
                icon={
                  <div className='flex justify-center items-center w-full h-full'>
                    <img
                      src={experience.icon}
                      alt={experience.company_name}
                      className='w-[60%] h-[60%] object-contain'
                    />
                  </div>
                }
                contentStyle={{
                  borderBottom: "8px",
                  borderStyle: "solid",
                  borderBottomColor: experience.iconBg,
                  boxShadow: "none",
                }}
              >
                <div>
                  <h3 className='text-black text-xl font-poppins font-semibold'>
                    {experience.title}
                  </h3>
                  <p
                    className='text-black-500 font-medium text-base'
                    style={{ margin: 0 }}
                  >
                    {experience.company_name}
                  </p>
                </div>

                <ul className='my-5 list-disc ml-5 space-y-2'>
                  {experience.points.map((point, index) => (
                    <li
                      key={`experience-point-${index}`}
                      className='text-black-500/50 font-normal pl-1 text-sm'
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>

      <div className='py-10 flex flex-col'>
  <h3 className='subhead-text'>Our courses {" "} ✨</h3>

  <div className='mt-16 grid grid-cols-2 gap-12'> {/* Grid layout with two columns */}
    {skills.map((skill) => (
      <div className='block-container w-64 h-64' key={skill.name}> {/* Large boxes */}
        <div className='btn-back rounded-xl' />
        <div className='btn-front rounded-xl flex justify-center items-center'>
          <img
            src={skill.imageUrl}
            alt={skill.name}
            className='w-5/6 h-5/6 object-contain' // Adjusted image size
          />
        </div>
      </div>
    ))}
  </div>
</div>

      <hr className='border-slate-200' />

      <Footer />
    </section>
  );
};

export default About;
