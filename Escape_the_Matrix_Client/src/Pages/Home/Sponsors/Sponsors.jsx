import samsung from "../../../../public/samsung.svg";
import stripe from "../../../../public/stripe.svg";
import tesla from "../../../../public/tesla.svg";
import gpay from "../../../../public/google-pay.svg";
import amazon from "../../../../public/amazon.svg";

const Sponsors = () => {
  return (
    <div>
      <div className="text-center mt-12 mb-12 sm :p-4">
        <h1 className="text-4xl font-semibold">Brands & Sponsors</h1>
        <p className="text-xl font-normal pt-4">
          Moreover 15+ brands from worldwide <br /> are connected with us to make guidance properly
        </p>
      </div>
      <div className="hero md: min-h-64 bg-base-200">
        <div className="hero-content md:w-44 md: gap-6 sm: w-20" >
          <img className="" src={samsung} alt="" />
          <img className="" src={stripe} alt="" />
          <img className="" src={tesla} alt="" />
          <img className="" src={gpay} alt="" />
          <img className="" src={amazon} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
