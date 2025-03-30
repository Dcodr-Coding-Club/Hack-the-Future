import { Link } from "react-router-dom";

import { arrow } from "../assets/icons";

const HomeInfo = ({ currentStage }) => {
  if (currentStage === 1)
    return (
      <h1 className='sm:text-xl sm:leading-snug text-center neo-brutalism-blue py-4 px-8 text-white mx-5'>
        Welcome to 
        <span className='font-semibold mx-2 text-white'>Starstream</span>
        👋
        <br />
        Let's start learning!
      </h1>
    );

  if (currentStage === 2) {
    return (
      <div className='info-box'>
        <p className='font-medium sm:text-xl text-center'>
        Explore , play , learn - <br /> Curious about the adventure?
        </p>

        <Link to='/about' className='neo-brutalism-white neo-btn'>
        Let's Dive In!
          <img src={arrow} alt='arrow' className='w-4 h-4 object-contain' />
        </Link>
      </div>
    );
  }

  if (currentStage === 3) {
    return (
      <div className='info-box'>
        <p className='font-medium text-center sm:text-xl'>
        Peek Into Your Adventure -<br /> Just a few steps away
        </p>

        <Link to='/projects' className='neo-brutalism-white neo-btn'>
          Your Story!
          <img src={arrow} alt='arrow' className='w-4 h-4 object-contain' />
        </Link>
      </div>
    );
  }

  if (currentStage === 4) {
    return (
      <div className='info-box'>
      <p className='font-medium sm:text-xl text-center'>
       Your Learning Quest Awaits! <br/> Check Them Out
      </p>

      <Link to='/contact' className='neo-brutalism-white neo-btn'>
      Progress!
        <img src={arrow} alt='arrow' className='w-4 h-4 object-contain' />
      </Link>
    </div>
    );
  }

  return null;
};

export default HomeInfo;
