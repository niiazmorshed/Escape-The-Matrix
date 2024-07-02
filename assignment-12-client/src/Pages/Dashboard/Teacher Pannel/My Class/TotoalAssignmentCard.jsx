

const TotoalAssignmentCard = ({totalCard}) => {
    const { title, deadline,description} = totalCard
    return (
<div className="card w-96 bg-base-100 shadow-xl">
  <div className="card-body">
        <h1 className="text-xl font-semibold"> Title-  {title}</h1>
        <h2 className="text-xl font-semibold">Deadline- {deadline}</h2>
        <p className="text-xl font-semibold">Task- {description}</p>

  </div>
</div>
    );
};

export default TotoalAssignmentCard;