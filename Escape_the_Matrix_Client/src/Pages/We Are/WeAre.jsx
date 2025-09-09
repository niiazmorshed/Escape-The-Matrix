const WeAre = () => {
  return (
    <div className="mt-12">
      <div className="text-center mt-12 mb-12 sm :p-4">
        <h1 className="text-4xl font-semibold">We Are</h1>
        <p className="text-2xl font-normal pt-4">
          We are providing you the best team management in the world
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-center ">
        <div
          data-aos="zoom-in"
          data-aos-duration="3000"
          className=" card w-96 bg-base-100 shadow-x"
        >
          <figure>
            <img
              style={{ height: "400px", width: "400px" }}
              src={"https://i.ibb.co/4PffJnR/photo-2023-02-28-19-26-32-2.jpg"}
            />
          </figure>
          <div className="card-body">
            <h1 className="text-4xl font-bold text-center">Niaz Morshed</h1>
            <p className="text-base font-semibold text-start">
              As the CEO of our esteemed establishment, I am thrilled to extend
              a warm and heartfelt greeting to each and every guest who graces
              our website. Thank you for considering EMX for your Choice.
              <br /> Warm regards.
            </p>
          </div>
        </div>
        <div
          data-aos="zoom-in"
          data-aos-duration="3000"
          className="card w-96 bg-base-100 shadow-xl"
        >
          <figure>
            <img
              style={{ height: "400px" }}
              src={"https://i.ibb.co/XjJyR46/received-1043292509942964.jpg"}
            />
          </figure>
          <div className="card-body">
            <h1 className="text-4xl font-bold text-center">
              Meherunnesa Mithila
            </h1>
            <h1 className=" text-center  text-lg font-bold">Co Founder</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeAre;
