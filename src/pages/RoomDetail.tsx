import { useAuth } from "../context/authContext"; // Adjust path based on your setup
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, type FormEvent } from "react";
/* import {
  Baby,
  Users,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CalendarClock,
  Check,
  ChevronDown,
  HouseHeart,
} from "lucide-react"; */

import * as Icons from "lucide-react";

import { getRoomTypeById } from "../services/roomtype";
import {
  createRoom,
  deleteRoom,
  getAllRoomsByRoomType,
  updateRoom,
} from "../services/room";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";
import { getAllAvailableRoomsByRoomType } from "../services/availability";

export default function RoomDetail() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const { roomtypeId } = useParams<{ roomtypeId: string }>();

  const [openAddRoomModal, setOpenAddRoomModal] = useState(false);

  const [roomtype, setRoomtype] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [floorType, setFloorType] = useState("");
  const [floorNumber, setFloorNumber] = useState(0);
  const [roomnumber, setRoomnumber] = useState(1);
  const [roomavailability, setRoomavailability] = useState("AVAILABLE");
  const [roomamenities, setRoomamenities] = useState<string>("");

  const editableAvailabilityStatuses = ["AVAILABLE", "UNDER_MAINTENANCE"];
  const lockedAvailabilityStatuses = ["BOOKED", "OCCUPIED"];
  const isAvailabilityEditable =
    editableAvailabilityStatuses.includes(roomavailability);

  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  //const [searchingTerm, setSearchingTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isSortOptionOpen, setIsSortOptionOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const sortdropdownRef = useRef<HTMLDivElement>(null);

  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availableRoomsPage, setAvailableRoomsPage] = useState(1);
  const [availableRoomsTotalPage, setAvailableRoomsTotalPage] = useState(1);
  const [availableRoomsTotalCount, setAvailableRoomsTotalCount] = useState(0);

  const [showRoomDetailModal, setShowRoomDetailModal] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<any>(null);

  const sortOptions = [
    {
      group: "Room Number",
      options: [
        { value: "num-asc", label: "Low to high" },
        { value: "num-desc", label: "High to low" },
      ],
    },
  ];

  // Date states
  const [checkinDate, setCheckinDate] = useState<Date>(new Date());
  const [checkoutDate, setCheckoutDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date;
  });

  // Calendar display states
  const [checkinPickerOpen, setCheckinPickerOpen] = useState(false);
  const [checkoutPickerOpen, setCheckoutPickerOpen] = useState(false);
  const [checkinCurrentMonth, setCheckinCurrentMonth] = useState<Date>(
    new Date()
  );
  const [checkoutCurrentMonth, setCheckoutCurrentMonth] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
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

  // Calculate nights between dates
  const calculateNights = () => {
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Calculate price summary
  const nightsCount = calculateNights();
  const pricePerNight = roomtype?.pricepernight ?? 0;

  const roomCost = pricePerNight * nightsCount;
  const taxes = Math.round(roomCost * 0.0);
  const total = roomCost + taxes;

  // Calendar functions
  const generateCalendarDays = (
    currentMonth: Date
    //type: "checkin" | "checkout"
  ) => {
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

  useEffect(() => {
    if (!roomtypeId) {
      console.error("roomId is missing");
      setLoading(false);
      return;
    }

    fetchRoomDetail(roomtypeId);

    //fetchRoomData(roomtypeId, 1, selectedGroup, selectedSortOption);
    fetchRoomData(
      roomtypeId,
      1,
      //searchingTerm,
      selectedGroup,
      selectedSortOption
    );

    setIsLoadingAvailability(false);
  }, [roomtypeId, selectedGroup, selectedSortOption]);

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

  const fetchRoomData = async (
    id: string,
    pageNumber = 1,
    //search?: string,
    group?: string,
    sort?: string
  ) => {
    try {
      const data = await getAllRoomsByRoomType(
        id,
        pageNumber,
        10,
        //search,
        group,
        sort
      );

      const roomList = data?.data;

      //console.log(data)
      //setRoomtypes(data?.data);
      setRooms(roomList);
      setTotalPage(data?.totalPages);
      setPage(pageNumber);
    } catch (err) {
      console.error("Error fetching amenities: ", err);
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

  const handleCheckAvailability = () => {
    if (roomtypeId) {
      setAvailableRooms([]); // Clear previous results
      setAvailableRoomsPage(1); // Reset to first page
      fetchAvailableRooms(1);
    }
  };

  const fetchAvailableRooms = async (page: number = 1, limit: number = 10) => {
    if (!roomtypeId) return;

    setIsLoadingAvailability(true);

    try {
      const data = await getAllAvailableRoomsByRoomType(
        roomtypeId,
        checkinDate,
        checkoutDate,
        page,
        limit
      );

      setAvailableRooms(data?.data || []);
      setAvailableRoomsPage(data?.page || 1);
      setAvailableRoomsTotalPage(data?.totalPages || 1);
      setAvailableRoomsTotalCount(data?.totalCount || 0);
    } catch (err) {
      console.error("Error fetching available rooms: ", err);
      setAvailableRooms([]);
      setAvailableRoomsPage(1);
      setAvailableRoomsTotalPage(1);
      setAvailableRoomsTotalCount(0);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const handleSortSelect = (sortValue: string) => {
    setSelectedSortOption(sortValue); // Update current sort state
    setIsSortOptionOpen(false);
    setPage(1);
    //fetchRoomData(1, selectedGroup, sortValue); // Refetch data with new sort
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        sortdropdownRef.current &&
        !sortdropdownRef.current.contains(event.target)
      ) {
        setIsSortOptionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenAddRoomModal = () => {
    setOpenAddRoomModal(true);
  };

  const handleCloseAddRoomModal = () => {
    handleReset();
    setOpenAddRoomModal(false);
  };

  useEffect(() => {
    if (floorType === "ground") {
      setFloorNumber(0);
    } else if (floorType === "other" && floorNumber === 0) {
      setFloorNumber(1); // default first floor
    }
  }, [floorType]);

  const handleEditRoomClick = (room: any) => {
    setOpenAddRoomModal(true);
    // floor
    setFloorNumber(room.floor);

    if (room.floor <= 0) {
      setFloorType("ground");
    } else {
      setFloorType("other");
    }

    // amenities array - string
    setRoomamenities(
      Array.isArray(room.roomamenities)
        ? room.roomamenities
            .map((a: string | { name: string }) =>
              typeof a === "string" ? a : a.name
            )
            .join(", ")
        : ""
    );

    console.log(room.roomamenities);

    setRoomnumber(room.roomnumber);
    setRoomavailability(room.availability);
    setEditingRoomId(room._id);
  };

  const handleSaveRoom = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!roomtypeId) {
      setErrorMsg("Room type is missing");
      return;
    }

    if (floorType === "other" && floorNumber <= 0) {
      setErrorMsg("Floor number is required for other floors!");
      return;
    }

    try {
      // Build plain JSON payload
      const payload = {
        roomtype: roomtypeId,
        floor: floorNumber,
        availability: roomavailability,
        //roomamenities: roomamenities, // comma-separated string
        roomamenities: roomamenities
          .split(",") // split by comma
          .map((a) => a.trim()) // remove extra spaces
          .filter((a) => a !== ""), // remove empty strings
      };

      let res;

      if (editingRoomId) {
        // UPDATE
        res = await updateRoom(editingRoomId, payload);
        setSuccessMsg(res.message || "Room updated successfully!");
      } else {
        // CREATE
        res = await createRoom(payload);
        setSuccessMsg(res.message || "Room created successfully!");
      }

      handleCloseAddRoomModal();

      await fetchRoomData(
        roomtypeId,
        1,
        //searchingTerm,
        selectedGroup,
        selectedSortOption
      );
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong!";
      console.log(message);
      setErrorMsg(message);
    }
  };

  const handleDeleteRoom = async (room: any) => {
    if (!roomtypeId) {
      setErrorMsg("Room type is missing");
      return;
    }
    // UI-level prevention
    if (lockedAvailabilityStatuses.includes(room.availability)) {
      setErrorMsg("Cannot delete a booked or occupied room.");
      alert("Cannot delete a booked or occupied room.");
      return;
    }

    if (!confirm(`Are you sure you want to delete Room ${room.roomnumber}?`))
      return;

    try {
      const res = await deleteRoom(room._id);
      setSuccessMsg(res.message || "Room deleted successfully!");

      await fetchRoomData(
        roomtypeId,
        1,
        //searchingTerm,
        selectedGroup,
        selectedSortOption
      );
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Failed to delete room.");
    }
  };

  const handleReset = () => {
    setFloorNumber(0);
    setFloorType("");
    setRoomamenities("");
    setRoomavailability("AVAILABLE");
    setEditingRoomId(null);
    //setSuccessMsg("");
    //setErrorMsg("");
  };

  const getDisplayText = () => {
    if (!selectedSortOption) return "Sort rooms by";

    // Find the selected option label
    for (const group of sortOptions) {
      const option = group.options.find(
        (opt) => opt.value === selectedSortOption
      );
      if (option) return option.label;
    }
    return "Sort rooms by";
  };

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

  const getGroupButtonClass = (value: string) =>
    `px-4 py-2 rounded-lg transition-colors ${
      selectedGroup === value
        ? "bg-gradient-to-r from-amber-600 to-amber-800 text-white"
        : "text-gray-700 hover:bg-amber-200"
    }`;

  // Helper function to get icon component
  const getIconComponent = (iconName: string | undefined) => {
    if (!iconName) return Icons.Sparkles;
    const IconComponent = (Icons as Record<string, any>)[iconName];
    return IconComponent || Icons.Sparkles;
  };

  // Add this function after your other handlers
  const handleOpenRoomDetailModal = (room: any) => {
    setSelectedRoomForBooking(room);
    setShowRoomDetailModal(true);
  };

  const navigateToBookingPage = (room: any) => {
  const bookingData = {
    roomTypeId: roomtypeId,
    roomTypeName: roomtype?.typename,
    pricePerNight: roomtype?.pricepernight,
    maxAdults: roomtype?.maxadults,
    maxChild: roomtype?.maxchild,
    description: roomtype?.description,
    images: roomtype?.roomTypeImageURLs || [],
    checkinDate: checkinDate,
    checkoutDate: checkoutDate,
    nightsCount: nightsCount,
    totalCost: total,
    selectedRoom: {
      id: room._id,
      roomNumber: room.roomnumber,
      floor: room.floor,
      amenities: room.roomamenities
    }
  };
  
  navigate("/book", { state: { bookingData } });
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
      {/* Pass onClose handlers to auto-dismiss messages */}
      <SuccessMessage message={successMsg} onClose={() => setSuccessMsg("")} />
      <ErrorMessage message={errorMsg} onClose={() => setErrorMsg("")} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={() => navigate("/rooms")}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-8 md:px-40 font-semibold"
        >
          <Icons.ArrowLeft className="w-5 h-5" />
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
                  <div className="relative h-110 mb-4">
                    <img
                      src={roomtype.roomTypeImageURLs[currentImageIndex]}
                      alt={`${roomtype.typename} - ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />

                    {/* Navigation Arrows */}
                    {roomtype.roomTypeImageURLs.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                        >
                          <Icons.ChevronLeft />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                        >
                          <Icons.ChevronRight />
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
                        <Icons.Users className="w-8 h-8 text-amber-600" />
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
                        <Icons.Baby className="w-8 h-8 text-amber-600" />
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
                        <Icons.Users className="w-8 h-8 text-amber-600" />
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

                {/* Availability Table */}
                <div className="mb-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Availability
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg mb-0">
                    Select your check-in and check-out dates to view available
                    rooms.
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form - Right side */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Check Availability
                </h3>

                <div className="space-y-6">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        placeholder="Select check-in date"
                        readOnly
                      />
                      <Icons.CalendarClock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Check-in Date Picker */}
                    {checkinPickerOpen && (
                      <div
                        ref={checkinPickerRef}
                        className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80"
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
                          {/* {generateCalendarDays(checkinCurrentMonth, "checkin").map( */}
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
                                  className={`h-10 w-10 flex items-center justify-center text-sm rounded-full ${
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        placeholder="Select check-out date"
                        readOnly
                      />
                      <Icons.CalendarClock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Check-out Date Picker */}
                    {checkoutPickerOpen && (
                      <div
                        ref={checkoutPickerRef}
                        className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80"
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
                          {/* {generateCalendarDays(checkoutCurrentMonth, "checkout").map( */}
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
                                  className={`h-10 w-10 flex items-center justify-center text-sm rounded-full ${
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

                  {/* Price Summary */}
                  <div className="border-t border-gray-200 pt-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {nightsCount} {nightsCount === 1 ? "night" : "nights"} ×{" "}
                        {roomtype.pricepernight}
                      </span>
                      <span className="font-medium">Rs. {roomCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes & fees (0%)</span>
                      <span className="font-medium">Rs. {taxes}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-4">
                      <span>Total</span>
                      <span>Rs. {total}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleCheckAvailability}
                      className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl"
                    >
                      Check Now
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/rooms")}
                      className="w-full py-3 border-2 border-amber-600 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-all"
                    >
                      View Other Rooms
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Rooms Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 pt-0">
            {/* Available Rooms Table Section */}
            <div className="lg:col-span-3">
              <div className="container bg-white rounded-xl border border-gray-100">
                {/* Check if availability has been checked at least once */}
                {availableRooms.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100">
                      <h3 className="text-xl font-bold text-slate-800">
                        Available Rooms
                      </h3>
                      <p className="text-sm text-slate-500">
                        Found {availableRoomsTotalCount} rooms available from{" "}
                        {formatDateForDisplay(checkinDate)} to{" "}
                        {formatDateForDisplay(checkoutDate)}
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left p-6 text-sm uppercase font-semibold text-slate-600">
                              Room No.
                            </th>
                            <th className="text-left p-6 text-sm uppercase font-semibold text-slate-600">
                              Floor
                            </th>
                            <th className="text-left p-6 text-sm uppercase font-semibold text-slate-600">
                              Amenities
                            </th>
                            <th className="text-left p-6 text-sm uppercase font-semibold text-slate-600">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {availableRooms.map((room: any) => (
                            <tr
                              key={room._id}
                              className="border-b border-slate-200/50 hover:bg-gray-100 hover:shadow transition-colors"
                            >
                              <td className="p-6 text-slate-700">
                                {room.roomnumber}
                              </td>
                              <td className="p-6 text-slate-700">
                                {getFloorLabel(room.floor)}
                              </td>
                              <td className="p-6 text-slate-700">
                                {room.roomamenities &&
                                room.roomamenities.length > 0
                                  ? room.roomamenities
                                      .map((a: any) =>
                                        typeof a === "string" ? a : a.name
                                      )
                                      .join(", ")
                                  : "No amenities"}
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  //onClick={() => handleOpenRoomDetailModal(room)}
                                  onClick={() => navigateToBookingPage(room)}
                                  className="p-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-300"
                                >
                                  Book Now
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Pagination for Available Rooms */}
                      {availableRoomsTotalPage > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              Showing{" "}
                              <span className="font-semibold">
                                {(availableRoomsPage - 1) * 10 + 1}
                              </span>{" "}
                              to{" "}
                              <span className="font-semibold">
                                {Math.min(
                                  availableRoomsPage * 10,
                                  availableRoomsTotalCount
                                )}
                              </span>{" "}
                              of{" "}
                              <span className="font-semibold">
                                {availableRoomsTotalCount}
                              </span>{" "}
                              rooms
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  fetchAvailableRooms(availableRoomsPage - 1)
                                }
                                disabled={availableRoomsPage === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Previous
                              </button>

                              {/* Page Numbers */}
                              {(() => {
                                const pages = [];
                                const maxVisiblePages = 5;
                                let startPage = Math.max(
                                  1,
                                  availableRoomsPage -
                                    Math.floor(maxVisiblePages / 2)
                                );
                                let endPage = Math.min(
                                  availableRoomsTotalPage,
                                  startPage + maxVisiblePages - 1
                                );

                                // Adjust start page if we're near the end
                                if (endPage - startPage + 1 < maxVisiblePages) {
                                  startPage = Math.max(
                                    1,
                                    endPage - maxVisiblePages + 1
                                  );
                                }

                                // First page with ellipsis if needed
                                if (startPage > 1) {
                                  pages.push(
                                    <button
                                      key={1}
                                      onClick={() => fetchAvailableRooms(1)}
                                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                      1
                                    </button>
                                  );
                                  if (startPage > 2) {
                                    pages.push(
                                      <span
                                        key="ellipsis1"
                                        className="px-2 text-gray-500"
                                      >
                                        ...
                                      </span>
                                    );
                                  }
                                }

                                // Visible page range
                                for (let i = startPage; i <= endPage; i++) {
                                  pages.push(
                                    <button
                                      key={i}
                                      onClick={() => fetchAvailableRooms(i)}
                                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        availableRoomsPage === i
                                          ? "text-white bg-amber-600 border border-amber-600"
                                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                      }`}
                                    >
                                      {i}
                                    </button>
                                  );
                                }

                                // Last page with ellipsis if needed
                                if (endPage < availableRoomsTotalPage) {
                                  if (endPage < availableRoomsTotalPage - 1) {
                                    pages.push(
                                      <span
                                        key="ellipsis2"
                                        className="px-2 text-gray-500"
                                      >
                                        ...
                                      </span>
                                    );
                                  }
                                  pages.push(
                                    <button
                                      key={availableRoomsTotalPage}
                                      onClick={() =>
                                        fetchAvailableRooms(
                                          availableRoomsTotalPage
                                        )
                                      }
                                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                      {availableRoomsTotalPage}
                                    </button>
                                  );
                                }

                                return pages;
                              })()}

                              <button
                                onClick={() =>
                                  fetchAvailableRooms(availableRoomsPage + 1)
                                }
                                disabled={
                                  availableRoomsPage === availableRoomsTotalPage
                                }
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : isLoadingAvailability ? (
                  // Show loading only when actively checking
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                      <h3 className="text-xl font-bold text-slate-800">
                        Checking Availability
                      </h3>
                    </div>
                    <div className="p-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                      <p className="mt-4 text-gray-600">
                        Finding available rooms...
                      </p>
                    </div>
                  </div>
                ) : (
                  // Initial state - no check performed yet
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100">
                      <h3 className="text-xl font-bold text-slate-800">
                        Available Rooms
                      </h3>
                      <p className="text-sm text-slate-500">
                        Select dates and click "Check Now" to see available
                        rooms
                      </p>
                    </div>
                    <div className="p-8 text-center">
                      <div className="text-gray-400 mb-4">
                        <Icons.CalendarClock className="w-16 h-16 mx-auto" />
                      </div>
                      <p className="text-gray-500 mb-4">
                        No availability check performed yet
                      </p>
                      <button
                        onClick={handleCheckAvailability}
                        className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all"
                      >
                        Check Availability
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Room Detail Modal */}
{showRoomDetailModal && selectedRoomForBooking && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Room No. {selectedRoomForBooking.roomnumber} – Overview
          </h2>
          <p className="text-sm text-gray-600">
            Complete information about this room
          </p>
        </div>
        <button
          onClick={() => {
            setShowRoomDetailModal(false);
            setSelectedRoomForBooking(null);
          }}
          className="text-gray-600 hover:text-gray-900 transition p-2 hover:bg-amber-200 rounded-lg"
        >
          <Icons.X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-6">
        {/* Room Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-cyan-200">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Icons.Info className="w-4 h-4" />
                Basic Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Number:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedRoomForBooking.roomnumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Floor:</span>
                  <span className="font-semibold text-gray-800">
                    {getFloorLabel(selectedRoomForBooking.floor)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Type:</span>
                  <span className="font-semibold text-amber-700">
                    {roomtype?.typename}
                  </span>
                </div>
                
              </div>
            </div>

            {/* Price Information */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Icons.DollarSign className="w-4 h-4" />
                Pricing Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per night:</span>
                  <span className="font-bold text-gray-800">
                    Rs. {roomtype?.pricepernight}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected dates:</span>
                  <span className="font-medium text-gray-800">
                    {nightsCount} night{nightsCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="border-t border-amber-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total price:</span>
                    <span className="text-lg font-bold text-amber-700">
                      Rs. {total}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Inclusive of all taxes and fees
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Amenities & Dates */}
          <div className="space-y-4">
            {/* Amenities Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Icons.Star className="w-4 h-4" />
                Room Amenities
              </h3>
              {selectedRoomForBooking.roomamenities && 
               selectedRoomForBooking.roomamenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedRoomForBooking.roomamenities.map(
                    (amenity: any, idx: number) => {
                      const IconComponent = getIconComponent(
                        typeof amenity === "string" ? "Sparkles" : amenity.icon
                      );
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100"
                        >
                          <IconComponent className="w-4 h-4" />
                          {typeof amenity === "string" ? amenity : amenity.name}
                        </span>
                      );
                    }
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No amenities listed</p>
              )}
            </div>

            {/* Selected Dates Section */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                <Icons.Calendar className="w-4 h-4" />
                Selected Dates
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-bold text-gray-800">
          {formatDateForDisplay(checkinDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-bold text-gray-800">
          {formatDateForDisplay(checkoutDate)}
                  </span>
                </div>
                <div className="pt-3 border-t border-blue-200">
                  <p className="text-sm text-blue-600">
                    Total stay: {nightsCount} night{nightsCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Type Features */}
        {roomtype && (
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Icons.Home className="w-4 h-4" />
              Room Capacity & Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mb-2">
                  <Icons.Users className="w-5 h-5 text-amber-700" />
                </div>
                <p className="text-sm text-gray-600">Adults</p>
                <p className="font-bold text-gray-800">{roomtype.maxadults}</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mb-2">
                  <Icons.Baby className="w-5 h-5 text-amber-700" />
                </div>
                <p className="text-sm text-gray-600">Children</p>
                <p className="font-bold text-gray-800">{roomtype.maxchild}</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mb-2">
                  <Icons.Users className="w-5 h-5 text-amber-700" />
                </div>
                <p className="text-sm text-gray-600">Total Persons</p>
                <p className="font-bold text-gray-800">
                  {roomtype.maxpersons || roomtype.maxadults + roomtype.maxchild}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {roomtype?.description && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Icons.FileText className="w-4 h-4" />
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {roomtype.description}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              // You can add actual booking logic here
              //setSuccessMsg(`Room ${selectedRoomForBooking.roomnumber} selected for booking!`);
              //setShowRoomDetailModal(false);
              //setSelectedRoomForBooking(null);
            }}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow hover:shadow-md"
          >
            Confirm Booking
          </button>
          <button
            onClick={() => {
              setShowRoomDetailModal(false);
              setSelectedRoomForBooking(null);
            }}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {openAddRoomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg">
              {" "}
              {/* Add max-width and center */}
              <div className="bg-white rounded-xl shadow-2xl p-6">
                {" "}
                {/* Remove grid wrapper, use direct styling */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    {editingRoomId ? "Edit Room" : "Add New Room"}
                  </h2>

                  <button
                    onClick={handleCloseAddRoomModal}
                    className="text-gray-600 hover:text-gray-900 transition"
                  >
                    <Icons.X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-1 gap-4 w-full">
                    {/* Floor Selection */}
                    <div className={floorType === "other" ? "w-2/3" : "w-full"}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Floor Type
                      </label>
                      <div className="relative">
                        <select
                          value={floorType}
                          onChange={(e) => setFloorType(e.target.value)}
                          className="appearance-none w-full px-2 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="ground">Ground Floor</option>
                          <option value="other">
                            Other Floors (1st, 2nd, etc.)
                          </option>
                        </select>
                        <Icons.ChevronDown
                          className={
                            "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 text-gray-500 transition-transform"
                          }
                        />
                      </div>
                    </div>

                    {/* Floor Number – show ONLY if other floors */}
                    {floorType === "other" && (
                      <div className="w-1/3">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Floor Number
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={floorNumber}
                          onChange={(e) =>
                            setFloorNumber(Number(e.target.value))
                          }
                          placeholder="Enter floor number"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 gap-4 w-full">
                    {/* Availability Selection */}
                    <div className="w-2/3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Availability
                      </label>

                      <div className="relative">
                        {/* <select
                  value={roomavailability}
                  onChange={(e) => setRoomavailability(e.target.value)}
                  className="appearance-none w-full px-2 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                </select> */}
                        <select
                          value={roomavailability}
                          disabled={!isAvailabilityEditable}
                          onChange={(e) => setRoomavailability(e.target.value)}
                          className={`appearance-none w-full px-2 py-2 border-2 rounded-lg
    ${
      !isAvailabilityEditable
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }
  `}
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="UNDER_MAINTENANCE">
                            Under Maintenance
                          </option>
                          <option value="BOOKED" disabled>
                            Booked
                          </option>
                          <option value="OCCUPIED" disabled>
                            Occupied
                          </option>
                        </select>

                        <Icons.ChevronDown
                          className={
                            "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 text-gray-500 transition-transform"
                          }
                        />
                      </div>
                      {!isAvailabilityEditable && (
                        <p className="text-xs text-red-500 mt-1">
                          Cannot change while booked or occupied.
                        </p>
                      )}
                    </div>

                    <div className="w-1/3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Room Number
                      </label>
                      <input
                        type="number"
                        readOnly
                        min="1"
                        value={roomnumber}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amenities
                    </label>
                    <input
                      type="text"
                      value={roomamenities}
                      onChange={(e) => setRoomamenities(e.target.value)}
                      placeholder="WiFi, AC, TV, Mini Bar"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate with commas
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {/* Submit Button */}
                    <button
                      onClick={handleSaveRoom}
                      className="w-full items-center gap-1.5 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-103 active:scale-95"
                    >
                      {editingRoomId ? "Update" : "Save"}
                    </button>

                    <button
                      onClick={handleCloseAddRoomModal}
                      className="w-full items-center gap-1.5 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-103 active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-0 mt-0 max-w-6xl mx-auto py-0 pt-8">
            <div className="flex space-x-2">
              <button
                className={getGroupButtonClass("")}
                onClick={() => setSelectedGroup("")}
              >
                All Rooms
              </button>
              <button
                className={getGroupButtonClass("available")}
                onClick={() => setSelectedGroup("available")}
              >
                Available
              </button>
              <button
                className={getGroupButtonClass("booked")}
                onClick={() => setSelectedGroup("booked")}
              >
                Booked
              </button>
              <button
                className={getGroupButtonClass("occupied")}
                onClick={() => setSelectedGroup("occupied")}
              >
                Occupied
              </button>
              <button
                className={getGroupButtonClass("undermaintenance")}
                onClick={() => setSelectedGroup("undermaintenance")}
              >
                Maintenance
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleOpenAddRoomModal}
                className=" inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-103 active:scale-95"
              >
                <Icons.HousePlus className="w-5 h-5" />
                Create
              </button>
              {/* Custom Dropdown Component */}
              <div className="relative w-40" ref={sortdropdownRef}>
                <button
                  onClick={() => setIsSortOptionOpen(!isSortOptionOpen)}
                  className="flex items-center justify-between w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  <span
                    className={
                      selectedSortOption ? "text-gray-800" : "text-gray-500"
                    }
                  >
                    {getDisplayText()}
                  </span>
                  <Icons.ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      isSortOptionOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {isSortOptionOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                    {/* Add gap/space at the top */}
                    <div className="pt-2"></div>

                    {sortOptions.map((group, index) => (
                      <div key={group.group}>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                          {group.group}
                        </div>
                        {group.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSortSelect(option.value)}
                            className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <span>{option.label}</span>
                            {selectedSortOption === option.value && (
                              <Icons.Check className="w-4 h-4 text-gray-700" />
                            )}
                          </button>
                        ))}
                        {/* Add spacing between groups */}
                        {index < sortOptions.length - 1 && (
                          <div className="border-t border-gray-100 my-1"></div>
                        )}
                      </div>
                    ))}

                    {/* Reset sorting button */}
                    <button
                      onClick={() => handleSortSelect("")}
                      className="w-full px-4 py-3 text-xs font-semibold text-left uppercase text-gray-600 hover:bg-gray-100"
                    >
                      Reset sorting
                    </button>

                    {/* Add gap/space at the bottom */}
                    {/* <div className="pb-2"></div> */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {rooms.length === 0 ? (
            <div className="max-w-6xl mx-auto mt-16 text-center">
              <div className="text-gray-500 text-lg font-medium">
                No rooms found
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Try changing the filter or sort option
              </p>
              <button
                onClick={() => setSelectedGroup("")}
                className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 max-w-6xl mx-auto pt-5">
              {rooms.map((room: any, index) => (
                <div key={index}>
                  {/* Room Card */}
                  <div className="relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 group mb-2 hover:border-amber-200">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left side - Room icon */}
                      <div className="flex items-start gap-3 mb-3 sm:mb-0">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                          <Icons.HouseHeart className="w-7 h-7 text-amber-700" />
                        </div>
                      </div>

                      {/* Right side - Room details */}
                      <div className="flex-1 flex flex-col gap-4">
                        {/* Room No + Availability */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                              Room No
                            </h4>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-normal border border-blue-100">
                              {room.roomnumber}
                            </span>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-sm font-medium border ${
                              room.availability === "AVAILABLE"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : room.availability === "BOOKED"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : room.availability === "OCCUPIED"
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : room.availability === "UNDER_MAINTENANCE"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            {room.availability === "UNDER_MAINTENANCE"
                              ? "UNDER MAINTENANCE"
                              : room.availability}
                          </span>
                        </div>

                        {/* Floor */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                            Floor
                          </h4>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-normal border border-blue-100">
                            {getFloorLabel(room.floor)}
                          </span>
                        </div>

                        {/* Amenities */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                            Amenities
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {room.roomamenities &&
                            room.roomamenities.length > 0 ? (
                              room.roomamenities.map(
                                (
                                  amenity: { name: string; icon: string },
                                  idx: number
                                ) => {
                                  const IconComponent = getIconComponent(
                                    amenity.icon
                                  );
                                  return (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-normal border border-blue-100"
                                    >
                                      <IconComponent className="w-4 h-4" />
                                      {amenity.name}
                                    </span>
                                  );
                                }
                              )
                            ) : (
                              <span className="text-gray-400 text-sm italic">
                                No amenities added
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Update button below the card, right side */}
                  <div className="flex justify-end mb-4 gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-4 py-1 rounded-bl-lg rounded-tr-lg text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-103 active:scale-95"
                      onClick={() => {
                        //e.stopPropagation();
                        handleEditRoomClick(room);
                        //window.scrollTo({ top: 100, behavior: "smooth" });
                      }}
                    >
                      Update
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-bl-lg rounded-tr-lg text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-103 active:scale-95"
                      onClick={() => {
                        //e.stopPropagation();
                        handleDeleteRoom(room);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {rooms.length > 0 && totalPage > 1 && roomtypeId && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => {
                  fetchRoomData(
                    roomtypeId,
                    page - 1,
                    //searchingTerm,
                    selectedGroup,
                    selectedSortOption
                  );
                }}
                //onClick={() => {fetchData(page - 1)}}
                disabled={page === 1}
                className="disabled:opacity-50 bg-amber-100 rounded-2xl"
              >
                <Icons.CircleChevronLeft className="w-8 h-8 text-amber-800" />
              </button>
              <div className="text-sm text-gray-600">
                Page {page} of {totalPage}
              </div>
              <button
                onClick={() => {
                  fetchRoomData(
                    roomtypeId,
                    page + 1,
                    //searchingTerm,
                    selectedGroup,
                    selectedSortOption
                  );
                }}
                //onClick={() => {fetchData(page + 1)}}
                disabled={page === totalPage}
                className="disabled:opacity-50 bg-amber-100 rounded-full"
              >
                <Icons.CircleChevronRight className="w-8 h-8 text-amber-800" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
