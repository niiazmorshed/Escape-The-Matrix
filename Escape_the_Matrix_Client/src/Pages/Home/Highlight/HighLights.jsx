import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useClasses from "../../../Hooks/useClasses";

const HighLights = () => {
  const [classes] = useClasses();
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="text-center mb-12 px-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
          Highly Recommended Courses
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover our most popular and highly-rated courses that have helped thousands of students achieve their goals.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          speed={600}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet bg-primary',
            bulletActiveClass: 'swiper-pagination-bullet-active bg-secondary',
            el: '.swiper-pagination',
            renderBullet: function (index, className) {
              return '<span class="' + className + '"></span>';
            },
          }}
          autoplay={{ 
            delay: 1200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper pb-12"
        >
          {classes.map((i) => (
            <SwiperSlide key={i._id}>
              <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-200 dark:border-gray-700 h-80 w-full flex flex-col course-card">
                <div className="relative overflow-hidden">
                  <img 
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
                    src={i.image} 
                    alt={i.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">⭐</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 min-h-32 card-content">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 h-12 card-title">
                    {i.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1 line-clamp-3 min-h-12 card-description">
                    {i.description || "Learn essential skills with our expert instructors"}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${i.price || '99'}</span>
                    <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination mt-8"></div>
      </div>
    </div>
  );
};

export default HighLights;
