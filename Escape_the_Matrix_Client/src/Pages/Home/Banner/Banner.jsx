import {
  A11y,
  EffectFade,
  Navigation,
  Scrollbar,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const Banner = () => {
  return (
    <Swiper
      modules={[Navigation, Scrollbar, A11y, EffectFade]}
      spaceBetween={50}
      slidesPerView={1}
      effect="fade"
      navigation
      scrollbar={{ draggable: true }}
      // autoplay={{delay: 1500}}
      
    >
      <SwiperSlide>
        <section className="banner1">
          <section className="pt-32">
            <div className="md: flex flex-col justify-center text-center items-center gap-6 md:pt-6">
              <h1 className="animate__animated animate__zoomIn md:text-5xl sm: text-lg text-white font-extrabold md: w-3/5 text-center leading-snug">
                Learn Explore And Wonder with EMX
              </h1>
              <p className="animate__animated animate__lightSpeedInRight font-normal text-white md:text-lg md:w-1/2">
                Join Us to  Essscape The Matrix (EMX) <br /> We will teach you how to succeed
                so prepare for making a difference today

              </p>
              <div className="animate__animated animate__lightSpeedInLeft flex gap-6">
                <button className="btn rounded-2xl bg-yellow-700 text-white">
                  Explore And Now
                </button>
                <button className="btn btn-outline  rounded-2xl text-yellow-700">
                  Our Feedback
                </button>
              </div>
            </div>
          </section>
        </section>
      </SwiperSlide>
    </Swiper>
  );
};

export default Banner;
