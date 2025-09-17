import { Outlet } from "react-router-dom";
import Footer from "../Pages/Footer/Footer";
import ScrollToTop from "../Routes/ScrollToTop";

const Roots = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="font-nunito">
        <ScrollToTop />
        <Outlet></Outlet>
      </div>
      <div className="mt-20 font-sans">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Roots;
