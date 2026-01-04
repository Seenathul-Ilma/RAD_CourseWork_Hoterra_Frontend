import * as Icons from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Contact Hoterra
            </h1>
            <p className="text-lg text-gray-600">
              Get in touch with us. We're here to help.
            </p>
          </div>

          {/* Main Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Phone Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.Phone className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Call Us</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 mb-1">Main Line</p>
                  <p className="text-xl font-bold text-gray-800">+94 11 234 5678</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Mobile</p>
                  <p className="text-xl font-bold text-gray-800">+94 77 123 4567</p>
                </div>
                <p className="text-sm text-gray-500 mt-4">Available 24/7</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.Mail className="w-10 h-10 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Us</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-1">Reservations</p>
                  <p className="text-lg font-bold text-gray-800">reservations@hotelra.com</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">General Inquiries</p>
                  <p className="text-lg font-bold text-gray-800">info@hotelra.com</p>
                </div>
                <p className="text-sm text-gray-500 mt-4">Response within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0">
                <Icons.MapPin className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Location</h2>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-800">Hotelra Colombo</p>
                  <p className="text-gray-700">123 Galle Road</p>
                  <p className="text-gray-700">Colombo 03</p>
                  <p className="text-gray-700">Sri Lanka</p>
                </div>
              </div>
              <div className="md:ml-auto text-center md:text-right">
                <p className="text-gray-600 mb-2">Opening Hours</p>
                <p className="font-semibold text-gray-800">24/7 Front Desk</p>
                <p className="text-sm text-gray-500">Check-in: 2:00 PM</p>
                <p className="text-sm text-gray-500">Check-out: 12:00 PM</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-lg p-8 mb-8 border border-red-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-4 rounded-full">
                  <Icons.AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Emergency Contact</h3>
                  <p className="text-gray-700">For urgent assistance outside business hours</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">+94 77 911 9119</p>
                <p className="text-gray-600 text-sm">24/7 Emergency Line</p>
              </div>
            </div>
          </div>

          {/* Quick Contact Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Quick Contact Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Icons.Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-800">Reception Hours</p>
                <p className="text-gray-600 text-sm">24/7 Available</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Icons.Car className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-800">Transport</p>
                <p className="text-gray-600 text-sm">Airport pickup available</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Icons.MessageSquare className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-800">WhatsApp</p>
                <p className="text-gray-600 text-sm">+94 77 123 4567</p>
              </div>
            </div>
          </div>

          {/* Location Map Placeholder */}
          <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Icons.Map className="w-6 h-6 text-amber-600" />
                Find Us
              </h2>
            </div>
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                <Icons.MapPin className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">123 Galle Road, Colombo 03</p>
                <p className="text-gray-600 text-sm">Near Galle Face Green</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}