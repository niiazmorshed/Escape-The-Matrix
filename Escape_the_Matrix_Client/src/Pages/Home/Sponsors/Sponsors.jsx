import amazon from "../../../../public/amazon.svg";
import gpay from "../../../../public/google-pay.svg";
import samsung from "../../../../public/samsung.svg";
import stripe from "../../../../public/stripe.svg";
import tesla from "../../../../public/tesla.svg";

const Sponsors = () => {
  return (
    <div>
      <div className="text-center mt-12 mb-12 sm :p-4">
        <h1 className="text-4xl font-semibold">Brands & Sponsors</h1>
        <p className="text-xl font-normal pt-4">
          Moreover 15+ brands from worldwide <br /> are connected with us to make guidance properly
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-90">
            <img src={samsung} alt="Samsung" className="h-8 md:h-10 opacity-80" />
            <img src={stripe} alt="Stripe" className="h-8 md:h-10 opacity-80" />
            <img src={tesla} alt="Tesla" className="h-8 md:h-10 opacity-80" />
            <img src={gpay} alt="Google Pay" className="h-8 md:h-10 opacity-80" />
            <img src={amazon} alt="Amazon" className="h-8 md:h-10 opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
