import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { useAuth } from "../context/authContext";
//import { createBooking } from "../services/booking";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";
import { createBooking } from "../services/booking";

export default function MakeBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const bookingData = location.state?.bookingData;

  // State for booking
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [bookingFor, setBookingFor] = useState<"walkin" | "self">("walkin");
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<any>(
    bookingData?.selectedRoom || null
  );

  const [isBookingCompleted, setIsBookingCompleted] = useState(false)

  // Date states
  const [checkinDate, setCheckinDate] = useState<Date>(
  bookingData?.checkinDate ? new Date(bookingData.checkinDate) : new Date()
);

const [checkoutDate, setCheckoutDate] = useState<Date>(() => {
  if (bookingData?.checkoutDate) {
    return new Date(bookingData.checkoutDate);
  }
  const date = new Date();
  date.setDate(date.getDate());
  return date;
});

  // Calendar display states
  const [checkinPickerOpen, setCheckinPickerOpen] = useState(false);
const [checkoutPickerOpen, setCheckoutPickerOpen] = useState(false);

const [checkinCurrentMonth, setCheckinCurrentMonth] = useState<Date>(
  bookingData?.checkinDate ? new Date(bookingData.checkinDate) : new Date()
);

const [checkoutCurrentMonth, setCheckoutCurrentMonth] = useState<Date>(() => {
  if (bookingData?.checkoutDate) {
    return new Date(bookingData.checkoutDate);
  }
  const date = new Date();
  date.setDate(date.getDate());
  return date;
});

  // Refs for click outside detection
  const checkinPickerRef = useRef<HTMLDivElement>(null);
  const checkoutPickerRef = useRef<HTMLDivElement>(null);
  const checkinInputRef = useRef<HTMLInputElement>(null);
  const checkoutInputRef = useRef<HTMLInputElement>(null);

  // Handle click outside date pickers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        checkinPickerRef.current &&
        !checkinPickerRef.current.contains(event.target as Node) &&
        checkinInputRef.current &&
        !checkinInputRef.current.contains(event.target as Node)
      ) {
        setCheckinPickerOpen(false);
      }

      if (
        checkoutPickerRef.current &&
        !checkoutPickerRef.current.contains(event.target as Node) &&
        checkoutInputRef.current &&
        !checkoutInputRef.current.contains(event.target as Node)
      ) {
        setCheckoutPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format date for display (Sat, Jan 3, 2026)
  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calendar functions
  const generateCalendarDays = (currentMonth: Date) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(year, month - 1, day);
      days.push({ day, date, isCurrentMonth: false, isPast: date < today });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ day, date, isCurrentMonth: true, isPast: date < today });
    }

    // Next month days
    const totalCells = days.length;
    for (let day = 1; day <= 42 - totalCells; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ day, date, isCurrentMonth: false, isPast: date < today });
    }

    return days;
  };

  const handleDateSelect = (date: Date, type: "checkin" | "checkout") => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return; // Don't select past dates

    if (type === "checkin") {
      setCheckinDate(date);
      setCheckinPickerOpen(false);
      // Ensure checkout is after checkin
      if (checkoutDate <= date) {
        const newCheckout = new Date(date);
        newCheckout.setDate(newCheckout.getDate() + 1);
        setCheckoutDate(newCheckout);
      }
    } else {
      const minCheckout = new Date(checkinDate);
      minCheckout.setDate(minCheckout.getDate() + 1);

      if (date < minCheckout) return;

      setCheckoutDate(date);
      setCheckoutPickerOpen(false);
    }
  };

  const navigateMonth = (
    type: "checkin" | "checkout",
    direction: "prev" | "next"
  ) => {
    const setter =
      type === "checkin" ? setCheckinCurrentMonth : setCheckoutCurrentMonth;
    const current =
      type === "checkin" ? checkinCurrentMonth : checkoutCurrentMonth;

    const newDate = new Date(current);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setter(newDate);
  };

  const handleTodayClick = (type: "checkin" | "checkout") => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (type === "checkin") {
      setCheckinCurrentMonth(today);
      setCheckinDate(today);

      const minCheckout = new Date(today);
      minCheckout.setDate(minCheckout.getDate() + 1);

      if (checkoutDate <= today) {
        setCheckoutDate(minCheckout);
        setCheckoutCurrentMonth(minCheckout);
      }

      setCheckinPickerOpen(false);
    } else {
      const minCheckout = new Date(checkinDate);
      minCheckout.setDate(minCheckout.getDate() + 1);

      setCheckoutCurrentMonth(minCheckout);
      setCheckoutDate(minCheckout);
      setCheckoutPickerOpen(false);
    }
  };

  // Calculate nights
  const calculateNights = () => {
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const nightsCount = calculateNights();
  const totalCost = nightsCount * (bookingData?.pricePerNight || 0);

  // Get floor label
  function getFloorLabel(floor: number): string {
    if (floor === 0) return "Ground Floor";
    const n = floor;
    const lastTwo = n % 100;
    const lastOne = n % 10;
    let suffix = "th";
    if (lastTwo < 11 || lastTwo > 13) {
      if (lastOne === 1) suffix = "st";
      else if (lastOne === 2) suffix = "nd";
      else if (lastOne === 3) suffix = "rd";
    }
    return `${n}${suffix} Floor`;
  }

  // Determine user role
  const isGuestUser = currentUser?.roles?.includes("GUEST");
  const isStaffUser =
    currentUser?.roles?.includes("ADMIN") ||
    currentUser?.roles?.includes("RECEPTIONIST");

  // Set bookingFor based on user role
  useEffect(() => {
    if (isGuestUser) {
      // Guest can ONLY book for self
      setBookingFor("self");

      setGuestName(
        `${currentUser?.firstname || ""} ${currentUser?.lastname || ""}`.trim()
      );
      setGuestEmail(currentUser?.email || "");
      setGuestPhone(currentUser?.phone || "");
      console.log("email: ", currentUser?.email);
    }

    if (isStaffUser) {
      // Staff default to walk-in
      setBookingFor("walkin");
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
    }
  }, [currentUser, isGuestUser, isStaffUser]);

  // Handle booking type change for staff
  const handleBookingTypeChange = (type: "walkin" | "self") => {
    setBookingFor(type);

    if (type === "self") {
      // Fill with staff user's info
      setGuestName(
        `${currentUser?.firstname || ""} ${currentUser?.lastname || ""}`.trim()
      );
      setGuestEmail(currentUser?.email || "");
      setGuestPhone(currentUser?.phone || "");

      console.log("email: ", currentUser?.email);
    } else {
      // Clear for walk-in guest
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
    }
  };

  const handleBookNow = async () => {
    if (isBookingCompleted) return;

    if (!selectedRoom || !bookingData?.roomTypeId) {
      setErrorMsg("Please select a room first.");
      return;
    }

    // Validation for walk-in guests
    if (bookingFor === "walkin") {
      if (!guestName.trim()) {
        setErrorMsg("Guest name is required.");
        return;
      }

      if (!guestEmail.trim() && !guestPhone.trim()) {
        setErrorMsg("Please provide either email or phone number.");
        return;
      }

      if (guestEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }

      if (guestPhone.trim() && guestPhone.trim().length < 10) {
        setErrorMsg("Please enter a valid phone number (minimum 10 digits).");
        return;
      }
    }

    setIsBookingLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const bookingPayload: any = {
        roomid: selectedRoom.id,
        //checkin: checkinDate.toISOString(),
        checkin: checkinDate.toISOString(),
        checkout: checkoutDate.toISOString(),
      };

      console.log()

      if (bookingFor === "walkin") {
        bookingPayload.guestname = guestName.trim();
        bookingPayload.guestemail = guestEmail.trim();
        bookingPayload.guestphone = guestPhone.trim();
      }

      if (bookingFor === "self") {
        bookingPayload.guestname = `${currentUser?.firstname || ""} ${
          currentUser?.lastname || ""
        }`.trim();
        bookingPayload.guestemail = currentUser?.email || "";
        bookingPayload.guestphone = currentUser?.phone || "";
      }

      console.log("Sending booking data:", bookingPayload);

      const response = await createBooking(bookingPayload);

      setIsBookingCompleted(true)

      setSuccessMsg(response.message || `Room ${selectedRoom.roomNumber} booked successfully!`);

      setSelectedRoom(null)
      
      // Clear the location state
      window.history.replaceState({}, document.title);

      // Redirect after success
      setTimeout(() => {
        navigate("/all-bookings");
      }, 2000);
      
    } catch (err: any) {
      console.error("Booking error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create booking. Please try again.";
      setErrorMsg(errorMessage);
    } finally {
      setIsBookingLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Icons.AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Booking Data
          </h2>
          <p className="text-gray-600 mb-6">
            Please select a room to book from the room details page.
          </p>
          <button
            onClick={() => navigate("/rooms")}
            className="px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-all"
          >
            Browse Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SuccessMessage message={successMsg} onClose={() => setSuccessMsg("")} />
      <ErrorMessage message={errorMsg} onClose={() => setErrorMsg("")} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-8 font-semibold"
        >
          <Icons.ArrowLeft className="w-5 h-5" />
          Back to Room Details
        </button>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Complete Your Booking
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Room Details Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Icons.Home className="w-5 h-5" />
                  Room Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Room Images */}
                  <div>
                    {bookingData.images && bookingData.images.length > 0 ? (
                      <div className="space-y-4">
                        <img
                          src={bookingData.images[0]}
                          alt={bookingData.roomTypeName}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {bookingData.images.length > 1 && (
                          <div className="grid grid-cols-4 gap-2">
                            {bookingData.images
                              .slice(0, 4)
                              .map((img: string, idx: number) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`${bookingData.roomTypeName} ${idx + 1}`}
                                  className="w-full h-16 object-cover rounded"
                                />
                              ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">
                          No images available
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Room Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-700">
                        {bookingData.roomTypeName}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {bookingData.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Adults</p>
                        <p className="text-lg font-bold text-gray-800">
                          {bookingData.maxAdults}
                        </p>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Children</p>
                        <p className="text-lg font-bold text-gray-800">
                          {bookingData.maxChild}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Price per night</p>
                      <p className="text-2xl font-bold text-gray-800">
                        Rs. {bookingData.pricePerNight}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected Room Details */}
                {selectedRoom && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-3">
                      Selected Room
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">Room Number:</span>
                            <span className="font-bold text-gray-800">
                              {selectedRoom.roomNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">Floor:</span>
                            <span className="font-bold text-gray-800">
                              {getFloorLabel(selectedRoom.floor)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">Amenities:</span>
                            <span className="text-gray-800">
  {Array.isArray(selectedRoom.amenities) && selectedRoom.amenities.length > 0
    ? selectedRoom.amenities
        .map((a: any) => typeof a === "string" ? a : a.name)
        .join(", ")
    : "No amenities"}
</span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(-1)}
                          className="mt-4 md:mt-0 px-4 py-2 text-sm border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                        >
                          Change Room
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guest Information */}
              {isStaffUser && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Icons.User className="w-5 h-5" />
                    Guest Information
                  </h2>

                  {/* Booking For Selection (Only for staff users) */}
                  {isStaffUser && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        Who is this booking for?
                      </p>
                      <div className="flex gap-4">
                        <button
                          //onClick={() => setBookingFor("walkin")}
                          onClick={() => handleBookingTypeChange("walkin")}
                          className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                            bookingFor === "walkin"
                              ? "border-amber-600 bg-amber-50 text-amber-700"
                              : "border-gray-300 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Icons.UserPlus className="w-4 h-4" />
                            Walk-in Guest
                          </div>
                        </button>
                        <button
                          //onClick={() => setBookingFor("self")}
                          onClick={() => handleBookingTypeChange("self")}
                          className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                            bookingFor === "self"
                              ? "border-amber-600 bg-amber-50 text-amber-700"
                              : "border-gray-300 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Icons.UserCheck className="w-4 h-4" />
                            Myself
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Guest Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Enter full name"
                        required
                        disabled={bookingFor === "self" && isGuestUser}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="guest@example.com"
                          disabled={bookingFor === "self" && isGuestUser}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="+94 77 123 4567"
                          disabled={bookingFor === "self" && isGuestUser}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      * Required field. Please provide at least email or phone.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Summary & Actions */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-6 shadow-lg sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                  Booking Summary
                </h2>

                {/* Date Selection - With Custom Date Pickers */}
                <div className="space-y-4 mb-6">
                  {/* Check-in Date */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Date
                    </label>
                    <div className="relative">
                      <input
                        ref={checkinInputRef}
                        type="text"
                        value={formatDateForDisplay(checkinDate)}
                        onClick={() => {
                          setCheckinPickerOpen(!checkinPickerOpen);
                          setCheckoutPickerOpen(false);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        readOnly
                      />
                      <Icons.Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Check-in Date Picker */}
                    {checkinPickerOpen && (
                      <div
                        ref={checkinPickerRef}
                        className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-72"
                        style={{ top: "100%", left: 0 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <button
                            type="button"
                            onClick={() => navigateMonth("checkin", "prev")}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Icons.ChevronLeft className="w-4 h-4" />
                          </button>
                          <h3 className="font-semibold text-gray-800">
                            {checkinCurrentMonth.toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </h3>
                          <button
                            type="button"
                            onClick={() => navigateMonth("checkin", "next")}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Icons.ChevronRight className="w-4 h-4" />
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
                        <div className="grid grid-cols-7 gap-1">
                          {generateCalendarDays(checkinCurrentMonth).map(
                            (day, index) => {
                              const isSelected =
                                checkinDate.toDateString() ===
                                day.date.toDateString();
                              const isToday =
                                new Date().toDateString() ===
                                day.date.toDateString();
                              const isDisabled =
                                day.isPast || !day.isCurrentMonth;

                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() =>
                                    !isDisabled &&
                                    handleDateSelect(day.date, "checkin")
                                  }
                                  className={`h-8 w-8 flex items-center justify-center text-sm rounded-full ${
                                    isDisabled
                                      ? "text-gray-400 cursor-not-allowed"
                                      : "text-gray-800 hover:bg-amber-100"
                                  } ${
                                    isSelected
                                      ? "bg-amber-600 text-white hover:bg-amber-700"
                                      : ""
                                  } ${
                                    isToday && !isSelected
                                      ? "bg-amber-100 text-amber-800"
                                      : ""
                                  }`}
                                  disabled={isDisabled}
                                >
                                  {day.day}
                                </button>
                              );
                            }
                          )}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={() => handleTodayClick("checkin")}
                            className="w-full py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-lg"
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Check-out Date */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Date
                    </label>
                    <div className="relative">
                      <input
                        ref={checkoutInputRef}
                        type="text"
                        value={formatDateForDisplay(checkoutDate)}
                        onClick={() => {
                          setCheckoutPickerOpen(!checkoutPickerOpen);
                          setCheckinPickerOpen(false);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        readOnly
                      />
                      <Icons.Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Check-out Date Picker */}
                    {checkoutPickerOpen && (
                      <div
                        ref={checkoutPickerRef}
                        className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-72"
                        style={{ top: "100%", left: 0 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <button
                            type="button"
                            onClick={() => navigateMonth("checkout", "prev")}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Icons.ChevronLeft className="w-4 h-4" />
                          </button>
                          <h3 className="font-semibold text-gray-800">
                            {checkoutCurrentMonth.toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </h3>
                          <button
                            type="button"
                            onClick={() => navigateMonth("checkout", "next")}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Icons.ChevronRight className="w-4 h-4" />
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
                        <div className="grid grid-cols-7 gap-1">
                          {generateCalendarDays(checkoutCurrentMonth).map(
                            (day, index) => {
                              const isSelected =
                                checkoutDate.toDateString() ===
                                day.date.toDateString();
                              const isToday =
                                new Date().toDateString() ===
                                day.date.toDateString();
                              const isDisabled =
                                day.isPast ||
                                !day.isCurrentMonth ||
                                day.date <= checkinDate;

                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() =>
                                    !isDisabled &&
                                    handleDateSelect(day.date, "checkout")
                                  }
                                  className={`h-8 w-8 flex items-center justify-center text-sm rounded-full ${
                                    isDisabled
                                      ? "text-gray-400 cursor-not-allowed"
                                      : "text-gray-800 hover:bg-amber-100"
                                  } ${
                                    isSelected
                                      ? "bg-amber-600 text-white hover:bg-amber-700"
                                      : ""
                                  } ${
                                    isToday && !isSelected
                                      ? "bg-amber-100 text-amber-800"
                                      : ""
                                  }`}
                                  disabled={isDisabled}
                                >
                                  {day.day}
                                </button>
                              );
                            }
                          )}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={() => handleTodayClick("checkout")}
                            className="w-full py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-lg"
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Rs. {bookingData.pricePerNight} × {nightsCount}{" "}
                      {nightsCount === 1 ? "night" : "nights"}
                    </span>
                    <span className="font-medium">
                      Rs. {bookingData.pricePerNight * nightsCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & fees (0%)</span>
                    <span className="font-medium">Rs. 0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>Rs. {totalCost}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">
                      {formatDateForDisplay(checkinDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">
                      {formatDateForDisplay(checkoutDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room:</span>
                    <span className="font-medium">
                      #{selectedRoom?.roomNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room Type:</span>
                    <span className="font-medium">
                      {bookingData.roomTypeName}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
  onClick={handleBookNow}
  disabled={
    isBookingLoading ||
    isBookingCompleted ||
    !guestName.trim() ||
    (!guestEmail.trim() && !guestPhone.trim())
  }
  className={`w-full py-4 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl
    flex items-center justify-center gap-2
    ${
      isBookingCompleted
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800"
    }
  `}
>
  {isBookingLoading && !isBookingCompleted ? (
    <>
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      Processing...
    </>
  ) : isBookingCompleted ? (
    "Booking Completed"
  ) : (
    "Confirm Booking"
  )}
</button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By confirming this booking, you agree to our terms and
                  conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
