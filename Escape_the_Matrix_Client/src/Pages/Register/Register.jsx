import { updateProfile } from "firebase/auth";
import { Helmet } from "react-helmet";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import { useState } from "react";
import auth from "../../Provider/firebase.config";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const Register = () => {
  const { createUser } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    const photo = form.get("photo");
    const email = form.get("email");
    const pass = form.get("password");

    // Checking The Password requirements
    if (pass.length < 6) {
      toast.error("Password Can not be less then 6 charecter", {});
      return;
    } else if (!/[A-Z]/.test(pass)) {
      toast.error("Password must be one UpperCase Charecter", {});
      return;
    } else if (!/[a-z]/.test(pass)) {
      toast.error("Password must be one LowerCase Charecter", {});
      return;
    }

    // Creating The User by Calling The Function
    createUser(email, pass).then(() => {
      e.target.reset();
      toast.success("Register Successfully");
      navigate("/");

      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      })
        .then(() => console.log("Success"))
        .catch((error) => {
          console.error(error);
        })
        .catch((error) => {
          console.error(error);
          toast.error("This Mail Has Already been Used");
        });
      const userData = {
        name: name,
        email: email,
        image: photo,
      };

      axiosPublic
        .post("/user", userData)
        .then((res) => {
          if (res.data.insertedId) {
            console.log("Data added to the dataBase");
            Swal.fire({
              title: "Success",
              text: "User Created Successfully",
              icon: "question",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Register|EMX</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>

      <div className=" hero min-h-screen bg-base-200">
        <div className=" hero-content flex-col md:w-96">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Register Now!</h1>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleRegister} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Your Name"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Photo URL</span>
                </label>
                <input
                  type="text"
                  name="photo"
                  placeholder="Enter Your Photo URL"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Your Email"
                  className="input input-bordered"
                  required
                />
              </div>
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative form-control ">
                <input
                  className="input input-bordered"
                  placeholder="Password"
                  type={showPass ? "text" : "password"}
                  name="password"
                  id=""
                  required
                />
                <p
                  className="absolute top-4 right-2"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FaRegEye /> : <FaRegEyeSlash />}
                </p>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Register</button>
              </div>
            </form>
            <p className="pb-6 mx-auto">
              Already have an Account?{" "}
              <NavLink to="/login" className="font-bold text-blue-600">
                Login
              </NavLink>{" "}
            </p>
          </div>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      </div>
    </div>
  );
};

export default Register;
