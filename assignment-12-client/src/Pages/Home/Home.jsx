
import { Helmet } from "react-helmet";
import Navbar from "../Navbar/Navbar";
import Banner from "./Banner/Banner";
import BecomeATutor from "./Become a Tutor/BecomeATutor";
import Feedback from "./Feed Back/Feedback";
import HighLights from "./Highlight/HighLights";
import OurFamily from "./Our Family/OurFamily";
import Sponsors from "./Sponsors/Sponsors";
import WeAre from "../We Are/WeAre";

const Home = () => {

  return (
    <div>
            <Helmet>
        <meta charSet="utf-8" />
        <title>{"Home"}|EMX</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <Navbar></Navbar>
      <Banner></Banner>
      <div className="max-w-7xl mx-auto">
        <Sponsors></Sponsors>
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
