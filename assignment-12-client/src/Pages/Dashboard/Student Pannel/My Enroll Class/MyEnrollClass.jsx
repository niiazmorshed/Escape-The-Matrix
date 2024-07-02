
import useCard from "../../../../Hooks/useCard";
import MyEnrollCard from "./MyEnrollCard";

const MyEnrollClass = () => {
  const [card, refetch] = useCard()

  return (
    <div>
<h2 className="text-4xl font-bold text-center mt-4">My Enrolled Classes </h2>
      <div className="md:grid md:grid-cols-3 gap-6 mt-20 m-6 p-6">
        {card.map((i) => (
          <MyEnrollCard
            key={i._id}
            enrollCard={i}
            refetch={refetch}
          ></MyEnrollCard>
        ))}
      </div>
    </div>
  );
};

export default MyEnrollClass;
