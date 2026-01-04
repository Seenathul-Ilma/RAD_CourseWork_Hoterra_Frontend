import { Link } from "react-router-dom";
import * as Icons from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Icons.ShieldCheck />,
      title: "Secure Booking",
      description: "Safe and reliable reservation system"
    },
    {
      icon: <Icons.Clock />,
      title: "24/7 Support",
      description: "Round-the-clock customer service"
    },
    {
      icon: <Icons.Star />,
      title: "Premium Quality",
      description: "Luxury accommodations & services"
    },
    {
      icon: <Icons.BadgeCheck />,
      title: "Best Price",
      description: "Competitive rates guaranteed"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Welcome Section */}
      <div 
        className="relative h-[100vh] bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&fit=crop")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-transparent" />
        
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="text-amber-400">Hoterra</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Experience luxury, comfort, and exceptional hospitality in the heart of the city
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/rooms"
              className="px-8 py-4 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center gap-3"
            >
              <Icons.Search className="w-5 h-5" />
              Explore Rooms
            </Link>
            
            <Link
              to="/contact"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/20 transition-all border border-white/30 flex items-center gap-3"
            >
              <Icons.Phone className="w-5 h-5" />
              Contact Now
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Icons.ChevronDown className="w-8 h-8 text-white/70" />
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Choose Hotelra?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine luxury with exceptional service to create unforgettable experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-amber-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      {/* Quick Links */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Quick Access
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Book Room */}
            <Link
              //to="/book"
              to="/rooms"
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all text-center"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Book a Room</h3>
              <p className="text-gray-600">Make a reservation</p>
            </Link>

            {/* My Bookings */}
            <Link
              to="/all-bookings"
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all text-center"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.ListChecks className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">My Bookings</h3>
              <p className="text-gray-600">View your reservations</p>
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all text-center"
            >
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Contact className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Contact</h3>
              <p className="text-gray-600">Get in touch with us</p>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for a Luxury Stay?
          </h2>
          <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
            Experience premium hospitality at Hotelra - Your comfort, our commitment
          </p>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-amber-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            <Icons.Bed className="w-5 h-5" />
            Book Your Stay Now
          </Link>
        </div>
      </div>

      
    </div>
  );
}