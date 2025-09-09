

const PerdaySubmission = ({submission}) => {
    const {deadline,title, studentmail} = submission
    return (
<div className="card w-96 bg-base-100 shadow-xl">
  <div className="card-body">
        <h1 className="text-lg font-bold" >Title- {title}</h1>
        <h2 className="text-lg font-bold" >Deadline- {deadline}</h2>
        <h2 className="text-lg font-bold" >Submitted by-  <span className="text-xl">{studentmail}</span></h2>
  </div>
</div>
    );
};

export default PerdaySubmission;