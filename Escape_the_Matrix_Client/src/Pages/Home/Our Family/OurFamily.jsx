import useAllUser from "../../../Hooks/useAllUser";
import useEnroll from "../../../Hooks/useEnroll";
import useMyClass from "../../../Hooks/useMyClass";

const OurFamily = () => {
  const [userS] = useAllUser();
  const [classes] = useMyClass();
  const [enroll] = useEnroll();
  return (
    <div data-aos="zoom-in" data-aos-duration="3000">
      <div className="text-center mt-12 mb-8 sm :p-4">
        <h1 className="text-4xl font-semibold">Our Family</h1>
      </div>
      <div className="hero bg-base-200 ">
        <div className="hero-content md: w-full justify-around md: flex md:flex-row-reverse sm: flex-col sm: mb-12 ">
          <div>
            <img
              src={`https://i.ibb.co/BKn7gy6/junior-ferreira-7es-RPTt38n-I-unsplash-1.jpg`}
              className="max-w-sm rounded-lg shadow-2xl"
            />
          </div>
          <div>
            <h2 className="text-5xl font-bold">Total Users: {userS.length} </h2>
            <h2 className="text-5xl font-bold">
              Total Classes: {classes.length}{" "}
            </h2>
            <h2 className="text-5xl font-bold">
              Total Enrollment: {enroll.length}{" "}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurFamily;
