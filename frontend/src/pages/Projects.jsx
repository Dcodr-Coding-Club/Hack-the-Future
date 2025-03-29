import { useState } from "react";
import { Footer } from "../components";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "bootstrap/dist/css/bootstrap.min.css";

const videoData = [
  {
    title: "1. Learn ASL ! ✨",
    description:
      "Ready to dive into the world of sign language? Join 8-year-old Fireese in this fun and engaging music video as she teaches you how to sign the ASL alphabet! 🎵👐",
    videoUrl: "https://www.youtube.com/embed/lYhAAMDQl-Q",
  },
  {
    title: "2. Learn how to sign fruits! 🍇",
    description:
      "Hungry to learn some ASL? Join Fireese in this fun video as she teaches you how to sign your favorite foods in American Sign Language! 🥕",
    videoUrl: "https://www.youtube.com/embed/EFdIE11qnko",
  },
  {
    title: "3. Learn how to sign Animals! 🐱",
    description:
      "Join 8-year-old Fireese in this exciting and interactive music video as she teaches you how to sign fun animal names in ASL! 🐶🦁",
    videoUrl: "https://www.youtube.com/embed/urGIbCsCgNg",
  },
  {
    title: "4. Learn ASL colors! 🌈",
    description:
      "Join Fireese and her mom in this colorful adventure as they teach you how to sign ASL colors! ✨",
    videoUrl: "https://www.youtube.com/embed/W4OJo8Iv5nM",
  },
  {
    title: "5. Learn ASL Days of the week!✨",
    description:
      "Join 11-year-old Fireese in this fun and engaging lesson as she teaches you how to sign the ASL days of the week! 📅✨",
    videoUrl: "https://www.youtube.com/embed/bhD6QC1IEOs",
  },
  {
    title: "6. ABC PHONICS Song with ASL Letters🎶",
    description:
      "This engaging song is a fantastic tool for teaching older kids the sounds each letter makes!✨",
    videoUrl: "https://www.youtube.com/embed/MsKR9nv56ng",
  },
];

const Projects = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <Container>
      <section className="max-container text-center mx-auto mb-12 lg:mb-20">
        <h1 className="text-5xl font-bold text-center mb-6">
          Express &{" "}
          <span className="text-blue-500 drop-shadow-lg font-semibold">
            Explore!
          </span>{" "}
        </h1>
        <br></br>
        <br></br>

        <p className="text-slate-500 text-lg mb-8">
          A place where hands speak, hearts connect, and learning is full of
          joy! 🌈✨ Our fun-filled classes help little stars express, explore,
          and grow through sign language, creative play, and interactive
          learning. 🎶let’s make learning magical
          together!
        </p>
        <br></br>

        {/* Swiper (Horizontal Scrolling Video Section) */}
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow]}
          navigation
          pagination={{ clickable: true }}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          spaceBetween={30}
          loop={true}
          coverflowEffect={{
            rotate: 10,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          {videoData.map((video, index) => (
            <SwiperSlide key={index} className="flex justify-center items-center">
              <div
                className="bg-white shadow-lg rounded-xl overflow-hidden w-[80%] md:w-[60%] lg:w-[50%] p-4 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedVideo(video.videoUrl)}
              >
                <h2 className="text-2xl font-semibold">{video.title}</h2>
                <p className="text-gray-500 text-sm mt-2">{video.description}</p>
                <div className="mt-4 w-full h-64 md:h-80">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={video.videoUrl}
                    title={video.title}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Enlarged Video Modal */}
        {selectedVideo && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/70 backdrop-blur-lg z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              className="bg-white p-4 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[60%] h-[70vh] relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-4 text-2xl text-gray-600 hover:text-black"
                onClick={() => setSelectedVideo(null)}
              >
                ✖
              </button>
              <iframe
                className="w-full h-full rounded-lg"
                src={selectedVideo + "?autoplay=1"}
                title="Enlarged Video"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}

        <hr className="border-slate-200 mt-10" />
        <Footer />
      </section>
    </Container>
  );
};

export default Projects;
