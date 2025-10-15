import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import EnrollButton from "../../../components/enrollment/EnrollButton";

const ClassDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState({});

  const handleEnrollSuccess = (enrollmentData) => {
    console.log("Enrollment successful:", enrollmentData);
    // Optionally navigate to enrolled class page or refresh data
  };

  useEffect(() => {
    axios
      .get(`https://escape-the-matrix-server.vercel.app/cla/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{"Class Details"}|EmX</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>

      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden ring-4 ring-transparent hover:ring-blue-500 transition-all duration-300">
              <img src={data.image} alt={data.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{data.title}</h1>
            <p className="mt-2 text-blue-600 dark:text-blue-300 font-medium">By {data.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{data.email}</p>

            <p className="mt-5 text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.shortDescription}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                ${data.price}
              </span>
              <EnrollButton 
                courseId={id} 
                onEnrolled={handleEnrollSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
