import { Link } from "react-router-dom";

import { Footer } from "../components";
import { projects } from "../constants";
import { arrow } from "../assets/icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

const Projects = () => {
  return (
    <Container>
      <section className='max-container'>
        <h1 className='head-text'>
          Express & {" "}
          <span className='blue-gradient_text drop-shadow font-semibold'>
            Explore!
          </span>🌍💬
        </h1>

        <p className='text-slate-500 mt-2 leading-relaxed'>
          A place where hands speak, hearts connect, and learning is full of joy! 🌈✨ Our fun-filled classes help little stars express, explore, and grow through sign language, creative play, and interactive learning. Whether it's storytelling, art, music, or movement, every child shines here! 💡🎭🎶 Join us and let’s make learning magical together!
        </p>

        <h1 className='text-3xl font-extrabold mt-10 font-sans'> 1. Learn ASL with Fireese! ✨</h1>
        <p className='text-slate-500 mt-2 leading-relaxed'>
          Ready to dive into the world of sign language? Join 8-year-old Fireese in this fun and engaging music video as she teaches you how to sign the ASL alphabet! 🎵👐 Sing, dance, and learn every letter with easy-to-follow signs that make learning super exciting! Perfect for kids, beginners, and anyone curious about ASL. 🌟📖
        </p><br></br>
        
        <div className="ratio ratio-16x9">
          <iframe src="https://www.youtube.com/embed/lYhAAMDQl-Q?si=kQ4R7p17jrHGXmZg" title="YouTube video" allowFullScreen></iframe>
        </div>
        <br></br>
        <br></br>
        <br></br>

        <h1 className='text-3xl font-extrabold mt-10 font-sans'> 2. Learn ASL with Fireese! ✨</h1>
        <p className='text-slate-500 mt-2 leading-relaxed'>
        Hungry to learn some ASL? Join Fireese in this fun and engaging video as she teaches you how to sign your favorite foods in American Sign Language! 🍇🥕 From fruits and veggies to snacks and treats, you’ll master key food signs in no time. Perfect for kids, beginners, and anyone looking to expand their ASL skills in a fun way! 👐🎉
        </p><br></br>
        
        <div className="ratio ratio-16x9">
          <iframe src="https://www.youtube.com/embed/EFdIE11qnko?si=baNqXd4hvlK-8aBn" title="YouTube video" allowFullScreen></iframe>
        </div>
        <br></br>
        <br></br>
        <br></br>

        <h1 className='text-3xl font-extrabold mt-10 font-sans'> 3. Learn how to sign Animals with Fireese! ✨</h1>
        <p className='text-slate-500 mt-2 leading-relaxed'>
        Join 8-year-old Fireese in this exciting and interactive music video as she teaches you how to sign fun animal names in ASL! 🐶🐱🦁 Learn key signs through a catchy song that makes signing easy and enjoyable. Perfect for kids, beginners, and anyone who loves animals! 🎵👐🎉
        </p><br></br>
        
        <div className="ratio ratio-16x9">
          <iframe src="https://www.youtube.com/embed/urGIbCsCgNg?si=FewQSfx9Y4Xsnbj7" title="YouTube video" allowFullScreen></iframe>
        </div>
        <br></br>
        <br></br>
        <br></br>

        <h1 className='text-3xl font-extrabold mt-10 font-sans'> 4. Learn ASL colors with Fireese! ✨</h1>
        <p className='text-slate-500 mt-2 leading-relaxed'>
        Join Fireese and her mom in this colorful adventure as they teach you how to sign ASL colors! 🌈✨ Learn the signs for your favorite colors while singing along to a fun and catchy song. Perfect for kids, beginners, and anyone eager to make learning ASL both exciting and memorable! 🎶👐💛💙
        </p><br></br>
        
        <div className="ratio ratio-16x9">
          <iframe src="https://www.youtube.com/embed/W4OJo8Iv5nM?si=4LHbGXFodn5kv4d3" title="YouTube video" allowFullScreen></iframe>
        </div>
        <br></br>
        <br></br>
        <br></br>

        <h1 className='text-3xl font-extrabold mt-10 font-sans'> 5. Learn ASL Days of the week with Fireese! ✨</h1>
        <p className='text-slate-500 mt-2 leading-relaxed'>
        Join 11-year-old Fireese in this fun and engaging lesson as she teaches you how to sign the ASL days of the week! 📅✨ Learn each day's sign through a catchy song that makes signing easy and enjoyable. Perfect for kids, beginners, and anyone looking to make learning ASL a blast! 🎶👐🎉
        </p><br></br>
        
        <div className="ratio ratio-16x9">
          <iframe src="https://www.youtube.com/embed/bhD6QC1IEOs?si=VSaiyzd12yGDtMMC" title="YouTube video" allowFullScreen></iframe>
        </div>
        <br></br>
        <br></br>
        <br></br>

        <h1 className='text-3xl font-extrabold mt-10 font-sans'> 6. ABC PHONICS Song with ASL Letters✨</h1>
        <p className='text-slate-500 mt-2 leading-relaxed'>
        This engaging song is a fantastic tool for teaching older kids the sounds each letter makes! 🎶✨ When paired with ASL hand shapes, children can connect each letter's sign with its corresponding sound, making learning even more effective. By reinforcing both visual and auditory cues, this method helps kids recognize hand shapes and sounds—building a strong foundation for reading and signing words! 👐🔤📖
        </p><br></br>
        
        <div className="ratio ratio-16x9">
          <iframe src="https://www.youtube.com/embed/MsKR9nv56ng?si=nnA_VBoJn1reOMnl" title="YouTube video" allowFullScreen></iframe>
        </div>
        <br></br>
        <br></br>
        <br></br>


        <hr className='border-slate-200' />
        
        <Footer />
      </section>
    </Container>
  );
};

export default Projects;
