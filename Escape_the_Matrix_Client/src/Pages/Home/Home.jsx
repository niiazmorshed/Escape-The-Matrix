
import { Helmet } from "react-helmet";
import Navbar from "../Navbar/Navbar";
import WeAre from "../We Are/WeAre";
import Banner from "./Banner/Banner";
import BecomeATutor from "./Become a Tutor/BecomeATutor";
import Feedback from "./Feed Back/Feedback";
import HighLights from "./Highlight/HighLights";
import OurFamily from "./Our Family/OurFamily";

const Home = () => {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
            <Helmet>
        <meta charSet="utf-8" />
        <title>{"Home"}|EMX</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <Navbar></Navbar>
      <div className="pt-24 pb-8 max-w-7xl mx-auto px-4">
        <Banner></Banner>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <HighLights></HighLights>
        <Feedback></Feedback>
        <OurFamily></OurFamily>
        <BecomeATutor></BecomeATutor>
        <WeAre></WeAre>
      </div>
    </div>
  );
};

export default Home;
