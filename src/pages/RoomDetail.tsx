import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Baby,
  Users,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CalendarClock,
} from "lucide-react";
import { getRoomTypeById } from "../services/roomtype";

export default function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [roomtype, setRoomtype] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!roomId) {
      console.error("roomId is missing");
      setLoading(false);
      return;
    }

    fetchRoomDetail(roomId);
  }, [roomId]);

  const fetchRoomDetail = async (id: string) => {
    try {
      const response = await getRoomTypeById(id);
      setRoomtype(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching room details:", error);
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (roomtype.roomTypeImageURLs?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (roomtype.roomTypeImageURLs?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading room details...</div>
      </div>
    );
  }

  if (!roomtype) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center">
        <div className="text-gray-600 text-lg mb-4">Room not found</div>
        <button
          onClick={() => navigate("/rooms")}
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={() => navigate("/rooms")}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-8 md:px-40 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Rooms
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          {/* Image Gallery Section - Updated Layout */}
          <div className="p-5">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-amber-600 uppercase mb-2">
                {roomtype.typename}
              </h1>
              <div className="flex items-center gap-2">
                {roomtype.isActive ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600">Available for booking</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-400">Not available</span>
                  </>
                )}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="flex flex-col">
              {roomtype.roomTypeImageURLs &&
              roomtype.roomTypeImageURLs.length > 0 ? (
                <div>
                  {/* Main Image with Navigation */}
                  <div className="relative mb-4">
                    <img
                      src={roomtype.roomTypeImageURLs[currentImageIndex]}
                      alt={`${roomtype.typename} - ${currentImageIndex + 1}`}
                      className="w-full h-110 object-cover rounded-lg"
                    />

                    {/* Navigation Arrows */}
                    {roomtype.roomTypeImageURLs.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                        >
                          <ChevronLeft />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                        >
                          <ChevronRight />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} /{" "}
                      {roomtype.roomTypeImageURLs.length}
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {roomtype.roomTypeImageURLs.length > 1 && (
                    <div className="grid grid-flow-col gap-3">
                      {roomtype.roomTypeImageURLs.map(
                        (image: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative h-30 rounded-lg overflow-hidden border-2 transition-all ${
                              currentImageIndex === index
                                ? "border-amber-600"
                                : "border-gray-200 hover:border-amber-400"
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
            </div>
          </div>

          {/* Room Details and Booking Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 pt-0">
            {/* Room Details - Left side */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                {/* Price Section */}
                <div className="mb-8 pb-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-800">
                          Rs. {roomtype.pricepernight}
                        </span>
                        <span className="text-gray-600 text-lg">/night</span>
                      </div>
                      <p className="text-gray-500 mt-1">
                        Exclusive of taxes and fees
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-medium">
                        Available for selected dates
                      </span>
                    </div>
                  </div>
                </div>

                {/* Capacity Section */}
                <div className="mb-8 pb-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Room Capacity & Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg">
                      <div className="p-3 bg-amber-100 rounded-lg">
                        <Users className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Adults</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {roomtype.maxadults}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg">
                      <div className="p-3 bg-amber-100 rounded-lg">
                        <Baby className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Children</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {roomtype.maxchild}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg">
                      <div className="p-3 bg-amber-100 rounded-lg">
                        <Users className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Persons</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {roomtype.maxpersons ||
                            roomtype.maxadults + roomtype.maxchild}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8 pb-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {roomtype.description}
                  </p>
                </div>

                <div className="mb-8 pb-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Availability
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {roomtype.description}
                  </p>
                </div>

                {/* Amenities */}
                {roomtype.amenities && roomtype.amenities.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                      Room Amenities
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {roomtype.amenities.map((amenity: any) => (
                        <div
                          key={amenity._id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                          <span className="text-gray-700 font-medium">
                            {amenity.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Form - Right side */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-6 shadow-lg sticky top-24">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Check Availability
                </h3>

                {/* Booking Form */}
                <form className="space-y-6">
                  {/* Check-in Date & Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        placeholder="Select check-in date"
                        readOnly
                      />
                      <CalendarClock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 hidden">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <h3
                          id="checkinCurrentMonth"
                          className="font-semibold text-gray-800"
                        ></h3>
                        <button
                          type="button"
                          id="checkinNextMonth"
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                      </div>
                      <div
                        id="checkinCalendarDays"
                        className="grid grid-cols-7 gap-1"
                      ></div>
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <button
                          type="button"
                          id="checkinTodayBtn"
                          className="w-full py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-lg"
                        >
                          Today
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Check-out Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        placeholder="Select check-out date"
                      />
                      <CalendarClock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 hidden">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <h3 className="font-semibold text-gray-800"></h3>
                        <button
                          type="button"
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                      </div>
                      <div
                        id="checkoutCalendarDays"
                        className="grid grid-cols-7 gap-1"
                      ></div>
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <button
                          type="button"
                          className="w-full py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-lg"
                        >
                          Today
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Guests */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guests
                    </label>
                    <div className="flex items-center justify-between p-4 mb-2 bg-white border border-gray-300 rounded-lg">
                      <button
                        type="button"
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        -
                      </button>
                      <div className="text-center">
                        <div className="text-2xl font-bold">2</div>
                        <div className="text-sm text-gray-500">Adults</div>
                      </div>
                      <button
                        type="button"
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <button
                        type="button"
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        -
                      </button>
                      <div className="text-center">
                        <div className="text-2xl font-bold">2</div>
                        <div className="text-sm text-gray-500">Children</div>
                      </div>
                      <button
                        type="button"
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div> */}

                  {/* Price Summary */}
                  <div className="border-t border-gray-200 pt-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        3 nights × Rs. {roomtype.pricepernight}
                      </span>
                      <span className="font-medium">
                        Rs. {roomtype.pricepernight * 3}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes & fees</span>
                      <span className="font-medium">
                        Rs. {Math.round(roomtype.pricepernight * 3 * 0.18)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                      <span>Total</span>
                      <span>
                        Rs. {Math.round(roomtype.pricepernight * 3 * 1.18)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl"
                    >
                      Book Now
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/rooms")}
                      className="w-full py-3 border-2 border-amber-600 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-all"
                    >
                      View Other Rooms
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
