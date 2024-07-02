import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { NavLink, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const ClassDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [data, setData] = useState({});
  const axiosPublic = useAxiosPublic();

  const handlePay = async () => {
    const enrollInfo = {
      classname: data.title,
      name: user.displayName,
      email: user.email,
      image: data.image,
      courseTeacher: data.name,
      teachermail: data.email,
    };
    axiosPublic
      .post("/enroll", enrollInfo)
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Applied to ${data.title} Course Successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get(`https://assignment-12-server-six-zeta.vercel.app/cla/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="md:grid md: grid-cols-4 gap-6 sm: p-4 min-h-screen mt-12 m-12 p-12">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{"Class Details"}|EmX</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div className="col-span-2  flex">
        <img className=" h-[800px] w-full " src={data.image} alt="" />
      </div>
      <div className="col-span-2 ">
        <h1 className="text-3xl font-semibold">{data.title}</h1>
        <p className="text-xl font-bold">Instructor- {data.name}</p>
        <p>Email- {data.email}</p>
        <br />
        <p className=" text-xl font-semibold">{data.shortDescription}</p>
        
        <br />
        <hr className="border-dashed" />
        <br />
        <div className="flex items-center justify-between w-[35%]">
          <p className="text-lg font-semibold">
            Price-
            <span className="text-yellow-700 font-extrabold text-xl">
              {data.price}
            </span>
            /$
          </p>

        </div>
        <br />

        <div className="flex justify-start">
          <NavLink>
            {" "}
            <button
              onClick={handlePay}
              className=" bg-green-600 text-white btn   md:btn-md lg:btn-lg"
            >
              Pay
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
