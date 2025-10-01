import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const Feedback = () => {
  const [feed, setFeed] = useState([]);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    axiosPublic.get("/feedback").then((res) => {
      setFeed(res.data);
    });
  }, [axiosPublic]);

  return (
    <div>
      <div className="text-center mt-12 mb-8">
        <h1 className="text-4xl font-semibold text-gray-800 dark:text-white">Important Feedback</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">What our students say about their learning experience</p>
        <>
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
              renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>';
              },
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
            className="mySwiper my-12 pb-12"
          >
            {feed.map((i) => (
              <SwiperSlide key={i._id}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-56 w-full flex flex-col feedback-card">
                  <div className="text-gray-700 dark:text-gray-200 mb-4 line-clamp-4 flex-1 min-h-16 feedback-text leading-relaxed">
                    "{i.description}"
                  </div>
                  <div className="mt-auto feedback-footer pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-300 mb-1">By {i.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Rating: {i.ratting}/5</div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-pagination mt-8"></div>
        </>
      </div>
    </div>
  );
};

export default Feedback;
