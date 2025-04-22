import useClasses from "../../Hooks/useClasses";
import Navbar from "../Navbar/Navbar";
import AllClassCard from "./AllClassCard";

const AllClasses = () => {
  const [classes] = useClasses();
  return (
    <div>
      <Navbar></Navbar>
      <div className="text-center mb-12 sm :p-4 ">
        <h1 className="text-4xl font-semibold">All the Classes are avabale here</h1>
      </div>
      <div className="md:grid md:grid-cols-3 gap-6 ">
      
        {classes.map(
          (i) => i.approved && <AllClassCard key={i._id} cla={i}></AllClassCard>
        )}
      </div>
    </div>
  );
};

export default AllClasses;
