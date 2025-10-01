import { Link } from "react-router-dom";
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
        <section className="banner1 relative overflow-hidden h-[12vh] rounded-2xl shadow-2xl w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <Link to="/allclasses">
              <button className="btn btn-ghost text-white hover:bg-primary hover:text-white font-semibold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm">
                Explore Classes
              </button>
            </Link>
          </div>
        </section>
      </SwiperSlide>
    </Swiper>
  );
};

export default Banner;
