import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Pages/Footer/Footer";
import ScrollToTop from "../Routes/ScrollToTop";

const Roots = () => {
  const location = useLocation();
  const hideFooter = location.pathname === '/login' || location.pathname === '/register';
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="font-nunito">
        <ScrollToTop />
        <Outlet></Outlet>
      </div>
      {!hideFooter && (
        <div className="mt-20 font-sans">
          <Footer></Footer>
        </div>
      )}
    </div>
  );
};

export default Roots;
