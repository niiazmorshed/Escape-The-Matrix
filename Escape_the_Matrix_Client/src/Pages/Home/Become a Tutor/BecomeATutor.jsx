import { NavLink } from "react-router-dom";

const BecomeATutor = () => {
  return (
    <div data-aos="zoom-out" data-aos-duration="3000">
      <div className="text-center mt-12 mb-12 sm :p-4 ">
        <h1 className="md:text-4xl font-semibold sm: text-2xl">
          Become a Teacher Today
        </h1>
      </div>
      <div className="hero bg-base-200 ">
        <div className=" hero-content grid p-2 md:grid-cols-2">
          <div className="flex justify-center">
            <img
              src="https://i.ibb.co/YQ6P9Ym/22aeb26e3f4246e46c2e6735fd0a7f2f.jpg"
              className="max-w-sm rounded-lg shadow-2xl"
            />
          </div>
          <div className="md:w-1/2 sm: full">
            <h1 className="md:text-5xl font-bold ">Become an Instructor</h1>
            <p className="py-6">
              Unlock Your Potential as an Instructor with Escape the Matrix
              Today! Share your knowledge and inspire learners worldwide by
              joining our community of expert educators. Benefit from our
              comprehensive support and resources to create engaging, impactful
              courses. Start your journey to becoming a thought leader and make
              a difference in education.
            </p>
            <div className=" md: flex md: justify-center">
              <NavLink to="/teachonemx">
                <button className="btn bg-yellow-700 text-white">
                  Start Teaching Today
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeATutor;
