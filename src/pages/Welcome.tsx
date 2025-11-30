import { Link } from "react-router-dom";
import backgroundImage from "../assets/images/hotel-pic-01.jpg";
import { MoveRight } from "lucide-react";

export default function Welcome() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center relative overflow-hidden" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Notification Badge */}
<Link to="/register?role=RECEPTIONIST" className="absolute top-40 z-20">
  <div
    className="inline-flex w-max cursor-pointer items-center transition duration-100 ease-linear rounded-[10px] bg-white text-gray-700 shadow-sm ring-1 ring-inset hover:bg-gray-50 py-1 pr-2 pl-1 text-xs font-medium"
    style={{ borderColor: "#d1e9ff" }}
  >
    {/* Addon Section */}
    <span
      className="inline-flex items-center rounded-md shadow-sm gap-1 px-1.5 py-0.5 mr-2"
      style={{ backgroundColor: "#ffffff", border: "1px solid #d1e9ff" }}
    >
      {/* Dot Indicator */}
      <span
        className="inline-block size-2 shrink-0 rounded-full"
        style={{
          backgroundColor: "#2e90fa",
          outline: "3px solid #d1e9ff",
          outlineOffset: "-1px",
        }}
      ></span>

      Staff Portal
    </span>

      Receptionists can register now. <MoveRight className="ml-1 w-4 h-4 items-center"/>
  </div>
</Link>


      <div className="container text-center mx-auto py-4 px-6 md:px-20 lg:px-32 text-white relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[75px] inline-block max-w-4xl font-bold pt-20 leading-tight">
          Experience Comfort in Every Stay
        </h2>
        
        <p className="text-xl md:text-2xl mt-8 mb-12 max-w-2xl mx-auto text-transparent bg-gradient-to-r from-slate-200 via-white to-blue-200 bg-clip-text font-semibold">
  Choose from beautifully curated rooms and enjoy a premium booking experience you can trust.
</p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
          <Link 
    to="/register?role=GUEST" 
    className="bg-gradient-to-r from-amber-900 to-amber-600 text-white hover:from-amber-700 hover:to-amber-900 font-semibold py-2 px-5 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[150px]"
>
    Get Started
</Link>
          <Link 
            to="/login" 
            className="border-1 border-white text-white hover:bg-white/10 font-semibold py-2 px-5 rounded-full text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm min-w-[150px]"
          >
            Sign In
          </Link>
        </div>
      </div>

    </div>
  );
}