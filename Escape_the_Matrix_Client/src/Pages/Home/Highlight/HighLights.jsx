import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import useClasses from "../../../Hooks/useClasses";

const HighLights = () => {
  const [classes] = useClasses();
  return (
    <div>
      <div className="text-center mt-12 mb-12 sm :p-4">
        <h1 className="text-4xl font-semibold">
          Course that are highly Recomended
        </h1>
        <>
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            autoplay={{ delay: 1500 }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 50,
              },
            }}
            modules={[Pagination, Autoplay]}
            className="mySwiper my-24"
          >
            {classes.map((i) => (
              <SwiperSlide key={i._id}>
                <div>
                  <div>
                    <figure >
                      <img className="min-h-60 w-56" src={i.image} alt="" />
                    </figure>
                  </div>
                  <div className="my-2">{i.title}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      </div>
    </div>
  );
};

export default HighLights;
