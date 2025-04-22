import { Outlet } from "react-router-dom";
import Footer from "../Pages/Footer/Footer";

const Roots = () => {
  return (
    <div>
      <div className="font-nunito">
        <Outlet></Outlet>
      </div>
      <div className="mt-20 font-sans">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Roots;
