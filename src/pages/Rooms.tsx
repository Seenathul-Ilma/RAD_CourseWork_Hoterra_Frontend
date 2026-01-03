import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  createRoomType,
  deleteRoomType,
  generateRoomTypeDesc,
  getAllRoomType,
  updateRoomType,
} from "../services/roomtype";

import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

import {
  Baby,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleChevronLeft,
  CircleChevronRight,
  HousePlus,
  PlusIcon,
  RotateCcw,
  Sparkles,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllAvailablityByDate } from "../services/availability";

//export default function Hotels() {
export default function Rooms() {
  const navigate = useNavigate();

  const [roomtypes, setRoomtypes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [typename, setTypename] = useState("");
  const [pricepernight, setPricepernight] = useState<string>("");
  //const [pricepernight, setPricepernight] = useState<number | "">("");
  const [maxadults, setMaxadults] = useState(1);
  const [maxchild, setMaxchild] = useState(0);
  const [maxpersons, setMaxpersons] = useState(1);
  const [description, setDiscription] = useState("");

  const [newImages, setNewImages] = useState<File[] | []>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const maxRoomImages = 5;

  const [editingRoomTypeId, setEditingRoomTypeId] = useState<string | null>(
    null
  );

  const [openAddRoomTypeModal, setOpenAddRoomTypeModal] = useState(false);

  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [availabilitySummary, setAvailabilitySummary] = useState<any>(null);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [isSortOptionOpen, setIsSortOptionOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const sortdropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    {
      group: "Price",
      options: [
        { value: "price-asc", label: "Low to high" },
        { value: "price-desc", label: "High to low" },
      ],
    },
    {
      group: "Alphabet",
      options: [
        { value: "name-asc", label: "A to Z" },
        { value: "name-desc", label: "Z to A" },
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

  const handleSortSelect = (sortValue: string) => {
    setSelectedSortOption(sortValue); // Update current sort state
    setIsSortOptionOpen(false);
    setPage(1);
    fetchData(1, selectedGroup, sortValue); // Refetch data with new sort
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

  const handleCheckAvailability = async () => {
    setIsLoadingAvailability(true);
    setSuccessMsg("");
    setErrorMsg("");
    setAvailabilityChecked(true);

    try {
      const response = await getAllAvailablityByDate(
        checkinDate,
        checkoutDate,
        selectedSortOption
      );

      setAvailableRooms(response.data || []);
      setAvailabilitySummary(response.summary);

      if (response.data && response.data.length > 0) {
        setSuccessMsg(
          `Found ${response.data.length} available room types for selected dates`
        );
      } else {
        setSuccessMsg("No rooms available for selected dates");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to check availability";
      setErrorMsg(message);
      setAvailableRooms([]);
      setAvailabilitySummary(null);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const handleOpenAddRoomModal = () => {
    setOpenAddRoomTypeModal(true);
  };

  const handleCloseAddRoomModal = () => {
    handleReset();
    setOpenAddRoomTypeModal(false);
  };

  /* const handleSelect = (value : any) => {
    setSelectedSortOption(value);
    setIsSortOptionOpen(false);
    // Add your sorting logic here
  }; */

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

  const maxAdultCountIncrement = () => {
    setMaxadults((prev) => prev + 1);
  };

  const maxAdultCountDecrement = () => {
    //setMaxadultcount((prev) => prev - 1);
    setMaxadults((prev) => Math.max(1, prev - 1));
  };

  const maxChildCountIncrement = () => {
    setMaxchild((prev) => prev + 1);
  };

  const maxChildCountDecrement = () => {
    //setMaxchildcount((prev) => prev - 1);
    setMaxchild((prev) => Math.max(0, prev - 1));
  };

  /* useEffect(() => {
    fetchData();
  }, []); */

  useEffect(() => {
    fetchData(1, selectedGroup, selectedSortOption);
  }, [selectedGroup, selectedSortOption]);

  useEffect(() => {
    setMaxpersons(maxadults + maxchild);
  }, [maxadults, maxchild]);

  //const fetchData = async (pageNumber = 1) => {
  const fetchData = async (pageNumber = 1, group?: string, sort?: string) => {
    try {
      //const data = await getAllRoomType(pageNumber, 10);
      const data = await getAllRoomType(pageNumber, 10, group, sort);

      const roomTypeList = data?.data;

      //console.log(data)
      //setRoomtypes(data?.data);
      setRoomtypes(roomTypeList);
      setTotalPage(data?.totalPages);
      setPage(pageNumber);
    } catch (err) {
      console.error("Error fetching amenities: ", err);
    }
  };

  const handleRoomTypeDescAiGeneration = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      //if (!typename || !maxadults || !maxchild) {
      if (!typename || !maxadults) {
        setErrorMsg(
          "Room type and max adult count are required to generate description."
        );
        return;
      }

      const res = await generateRoomTypeDesc({ typename, maxadults, maxchild });
      setDiscription(res.description);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong!";
      setErrorMsg(message);
    }
  };

  const handleSaveRoomType = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!typename || !pricepernight || !description) {
      setErrorMsg("Room type, price per night and description are required.!");
      return;
    }

    try {
      /* const formData = new FormData();
        formData.append("amenityname", amenityname);
        formData.append("description", description);
  
        //const res = await createPost(formData);
        await createAmenity(formData); */ // remove unused variables and imports

      if (editingRoomTypeId) {
        // UPDATE existing room type
        const formData = new FormData();

        formData.append("typename", typename);
        formData.append("description", description);
        formData.append("pricepernight", String(pricepernight));
        formData.append("maxadults", String(maxadults));
        formData.append("maxchild", String(maxchild));

        // existing images still kept
        formData.append("existingImages", JSON.stringify(existingImages));

        // new images
        newImages.forEach((file) => {
          formData.append("image", file);
        });

        const res = await updateRoomType(editingRoomTypeId, formData);
        setSuccessMsg(res.message || "Room Type updated successfully!");
        console.log(res.message);
      } else {
        // CREATE new room type
        const formData = new FormData();
        formData.append("typename", typename);
        formData.append("description", description);
        formData.append("pricepernight", pricepernight);
        formData.append("maxadults", maxadults.toString());
        formData.append("maxchild", maxchild.toString());
        newImages.forEach((image: any) => {
          formData.append("image", image); // must match upload.array("image")
        });

        console.log("pricepernight: ", pricepernight);

        //const res = await createPost(formData);
        const res = await createRoomType(formData);

        console.log(res.message);

        setSuccessMsg(res.message || "Room type created successfully!");
      }

      await fetchData(1);

      handleReset();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong!";
      setErrorMsg(message);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    if (
      existingImages.length + newImages.length + selectedFiles.length >
      maxRoomImages
    ) {
      setErrorMsg(`You can upload up to ${maxRoomImages} images only`);
      return;
    }

    const updatedNewImages = [...newImages, ...selectedFiles];
    setNewImages(updatedNewImages);

    const newPreviews = [
      ...existingImages,
      ...updatedNewImages.map((file) => URL.createObjectURL(file)),
    ];

    setPreviews(newPreviews);
  };

  const handleRemoveImage = (index: number) => {
    /* const newImages = [...images];
    newImages.splice(index, 1); // Remove file
    setImages(newImages);

    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews); */

    if (index < existingImages.length) {
      // remove backend image
      const updatedExisting = [...existingImages];
      updatedExisting.splice(index, 1);
      setExistingImages(updatedExisting);

      setPreviews([
        ...updatedExisting,
        ...newImages.map((file) => URL.createObjectURL(file)),
      ]);
    } else {
      // remove newly added image
      const newIndex = index - existingImages.length;
      const updatedNew = [...newImages];
      updatedNew.splice(newIndex, 1);
      setNewImages(updatedNew);

      setPreviews([
        ...existingImages,
        ...updatedNew.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleEditClick = (roomType: any) => {
    setOpenAddRoomTypeModal(true);
    setTypename(roomType.typename);
    //setPricepernight(roomType.pricepernight);
    setPricepernight(String(roomType.pricepernight ?? ""));
    setMaxadults(roomType.maxadults || 1);
    setMaxchild(roomType.maxchild || 0);
    setMaxpersons(roomType.maxpersons);
    setDiscription(roomType.description);
    setEditingRoomTypeId(roomType._id);

    const urls = roomType.roomTypeImageURLs || [];
    setExistingImages(urls);
    setPreviews(urls);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room type?")) return;

    try {
      const res = await deleteRoomType(id);

      setSuccessMsg(res.message || "Room type deleted successfully!");
      await fetchData(page);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Room type delete failed!";
      setErrorMsg(message);
    }
  };

  const handleReset = () => {
    setTypename("");
    setDiscription("");
    setPricepernight("");
    setMaxadults(1);
    setMaxchild(0);
    setNewImages([]);
    setPreviews([]);
    setEditingRoomTypeId(null);
    //setSuccessMsg("");
    //setErrorMsg("");
  };

  // to handle room card click
  const handleRoomCardClick = (roomTypeId: string) => {
    navigate(`/rooms/${roomTypeId}`);
  };

  const getGroupButtonClass = (value: string) =>
    `px-4 py-2 rounded-lg transition-colors ${
      selectedGroup === value
        ? "bg-amber-600 text-white"
        : "text-gray-700 hover:bg-amber-200"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Pass onClose handlers to auto-dismiss messages */}
      <SuccessMessage message={successMsg} onClose={() => setSuccessMsg("")} />
      <ErrorMessage message={errorMsg} onClose={() => setErrorMsg("")} />

      <div className="container mx-auto px-4 py-16 pt-24">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Rooms & Suites
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience well-appointed room types that deliver comfort, privacy,
            and refined living.
          </p>
        </div>

        <div
          className={`max-w-6xl mx-auto mb-5 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100 ${
            openAddRoomTypeModal ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : ""
          }`}
        >
          {/* Room Details - Left side (Only when form is open) */}
          {openAddRoomTypeModal && (
            <div className="lg:col-span-2">
              <form>
                <div className="border border-gray-200 rounded-lg p-5 text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {editingRoomTypeId ? (
                      <RotateCcw className="text-amber-600 w-8 h-8" />
                    ) : (
                      <PlusIcon className="text-amber-600 w-8 h-8" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {editingRoomTypeId ? "Update Roomtype" : "Create Room Type"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {editingRoomTypeId
                      ? "Modify room type details to reflect updated comfort and pricing."
                      : "Define room types with capacity, pricing, and comfort details."}
                  </p>
                  <div className="space-y-5">
                    {/* Room type name and price on same level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          <span className="flex items-center">Room Type</span>
                        </label>
                        <input
                          type="text"
                          value={typename}
                          onChange={(e) => setTypename(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300"
                          placeholder="Enter room type (e.g., Delux, Single)"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          <span className="flex items-center">
                            Price Per Night (Rs.)
                          </span>
                        </label>
                        <input
                          type="number"
                          value={pricepernight}
                          onChange={(e) => setPricepernight(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300"
                          placeholder="Enter price per night"
                        />
                      </div>
                    </div>

                    {/* Max adults, child, persons on same level */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Max Adults with increment/decrement buttons */}
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          <span className="flex items-center">Max Adults</span>
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={maxAdultCountDecrement}
                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors duration-300"
                          >
                            -
                          </button>
                          <div className="flex-1 px-4 py-3 text-center text-gray-700 font-medium bg-white">
                            {maxadults}
                          </div>
                          <button
                            type="button"
                            onClick={maxAdultCountIncrement}
                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors duration-300"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Max Children with increment/decrement buttons */}
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          <span className="flex items-center">
                            Max Children
                          </span>
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={maxChildCountDecrement}
                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors duration-300"
                          >
                            -
                          </button>
                          <div className="flex-1 px-4 py-3 text-center text-gray-700 font-medium bg-white">
                            {maxchild}
                          </div>
                          <button
                            type="button"
                            onClick={maxChildCountIncrement}
                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors duration-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          <span className="flex items-center">Max Persons</span>
                        </label>
                        <input
                          type="number"
                          value={maxpersons}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300"
                          placeholder="1"
                        />
                      </div>
                    </div>

                    {/* Description Field */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-gray-700 font-medium flex items-center">
                          Description
                        </label>
                        <button
                          onClick={handleRoomTypeDescAiGeneration}
                          className="text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-105 active:scale-95 flex items-center gap-2 px-3 py-1 rounded"
                        >
                          Generate Description
                          <Sparkles className="h-4 w-4" />
                        </button>
                      </div>

                      <textarea
                        value={description}
                        onChange={(e) => setDiscription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Describe the room type in detail. Include features, benefits, and any important information for guests..."
                      />
                    </div>

                    <div>
                      <label className="text-gray-700 font-medium flex items-center mb-2">
                        Room Images
                      </label>

                      <div className="mb-4">
                        <label>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-300 hover:bg-amber-50 transition-colors cursor-pointer">
                            <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">
                              Click to upload images or drag and drop
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              PNG, JPG, WEBP up to 20MB each
                            </p>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </div>
                        </label>
                      </div>

                      {/* Image Previews */}
                      {previews.length > 0 && (
                        <div className="grid grid-cols-5 md:grid-cols-5 gap-4 mt-4">
                          <p className="text-gray-700 font-medium col-span-full text-left">
                            Selected Images ({previews.length})
                          </p>
                          {previews.map((src, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={src}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveRoomType}
                      className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-5 py-3 mt-5 rounded-lg hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-102 active:scale-95 w-full"
                    >
                      {editingRoomTypeId ? "Update" : "Save"}
                    </button>
                    <button
                      type="button"
                      //onClick={handleReset}
                      onClick={handleCloseAddRoomModal}
                      className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-5 py-3 mt-5 rounded-lg hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-102 active:scale-95 w-full"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Booking Form - Right side (Always visible) */}
          <div
            className={openAddRoomTypeModal ? "lg:col-span-1" : "lg:col-span-1"}
          >
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarClock className="text-amber-600 w-8 h-8" />
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
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
                    <CalendarClock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
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
                          <ChevronLeft className="w-4 h-4" />
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
                    <CalendarClock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
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
                          <ChevronLeft className="w-4 h-4" />
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

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleCheckAvailability}
                    disabled={isLoadingAvailability}
                    className={`w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl ${
                      isLoadingAvailability
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:from-amber-700 hover:to-amber-800"
                    }`}
                  >
                    {isLoadingAvailability ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-3 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Checking...
                      </div>
                    ) : (
                      "Check Now"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Available Rooms Table (Only when form is NOT open) */}
          {!openAddRoomTypeModal && (
            <div className="lg:col-span-3 mt-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Check if availability has been checked */}
                {availabilityChecked ? (
                  <>
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100">
                      <h3 className="text-xl font-bold text-slate-800">
                        Available Rooms
                      </h3>
                      <p className="text-sm text-slate-500">
                        {availabilitySummary ? (
                          <>
                            Found {availabilitySummary.availableRoomTypes} room
                            types with {availabilitySummary.totalAvailableRooms}{" "}
                            rooms available from{" "}
                            {formatDateForDisplay(checkinDate)} to{" "}
                            {formatDateForDisplay(checkoutDate)}
                          </>
                        ) : (
                          "Select dates and click 'Check Now' to see available rooms"
                        )}
                      </p>
                    </div>

                    {isLoadingAvailability ? (
                      <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-4"></div>
                        <p className="text-gray-600">
                          Checking availability...
                        </p>
                      </div>
                    ) : availableRooms.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="text-left p-6 text-sm uppercase font-semibold text-slate-600">
                                Room Type
                              </th>
                              <th className="text-left p-6 text-sm uppercase font-semibold text-slate-600">
                                Price/Night
                              </th>
                              <th className="text-left p-6 text-sm uppercase font-semibold text-slate-600">
                                Max Adults
                              </th>
                              <th className="text-left p-6 text-sm uppercase font-semibold text-slate-600">
                                Max Children
                              </th>
                              <th className="text-left p-6 text-sm uppercase font-semibold text-slate-600">
                                Available Count
                              </th>
                              <th className="text-left p-6 text-sm uppercase font-semibold text-slate-600">
                                Room Numbers
                              </th>
                              <th className="text-left p-6 text-sm uppercase font-semibold text-slate-600">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {availableRooms.map((roomType: any) => (
                              <tr
                                key={roomType._id}
                                className="border-b border-slate-200/50 hover:bg-gray-100 hover:shadow transition-colors"
                              >
                                {/* Room Type Column */}
                                <td className="p-6 text-slate-700">
                                  <div className="font-semibold text-amber-600">
                                    {roomType.typename}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {roomType.description?.substring(0, 60)}...
                                  </div>
                                </td>

                                {/* Price Column */}
                                <td className="p-6 text-slate-700 font-bold">
                                  <div>Rs. {roomType.pricepernight}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    per night
                                  </div>
                                </td>

                                {/* Max Adults Column */}
                                <td className="p-6 text-slate-700 text-center">
                                  <div className="font-bold text-gray-800 text-lg">
                                    {roomType.maxadults}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Adults
                                  </div>
                                </td>

                                {/* Max Children Column */}
                                <td className="p-6 text-slate-700 text-center">
                                  <div className="font-bold text-gray-800 text-lg">
                                    {roomType.maxchild}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Children
                                  </div>
                                </td>

                                {/* Available Count Column */}
                                <td className="p-6 text-slate-700 text-center">
                                  <div className="font-bold text-green-600 text-xl">
                                    {roomType.availableCount}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    rooms available
                                  </div>
                                </td>

                                {/* Room Numbers Column */}
                                <td className="p-6 text-slate-700">
                                  {roomType.availableRoomsOfThisType &&
                                  roomType.availableRoomsOfThisType.length >
                                    0 ? (
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                      {roomType.availableRoomsOfThisType
                                        .slice(0, 5)
                                        .map((room: any, idx: number) => (
                                          <span
                                            key={idx}
                                            className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded"
                                          >
                                            {room.roomnumber}
                                          </span>
                                        ))}
                                      {roomType.availableRoomsOfThisType
                                        .length > 5 && (
                                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                          +
                                          {roomType.availableRoomsOfThisType
                                            .length - 5}{" "}
                                          more
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-gray-400 text-sm">
                                      No rooms listed
                                    </div>
                                  )}
                                </td>

                                {/* Action Column */}
                                <td className="p-6">
                                  <button
                                    onClick={() =>
                                      navigate(`/rooms/${roomType._id}`)
                                    }
                                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white text-sm font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all"
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="text-gray-400 mb-4">
                          <CalendarClock className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                          No Rooms Available
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Sorry, no rooms are available for the selected dates.
                        </p>
                        <p className="text-sm text-gray-400">
                          Try selecting different dates or check back later.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <CalendarClock className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      Check Room Availability
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Select your check-in and check-out dates above, then click
                      "Check Now" to see available rooms.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <Check className="w-4 h-4" />
                      <span>No availability check performed yet</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-0 mt-0 max-w-6xl mx-auto py-0 pt-8">
          <div className="flex space-x-2">
            <button
              className={getGroupButtonClass("")}
              onClick={() => setSelectedGroup("")}
            >
              All Types
            </button>
            <button
              className={getGroupButtonClass("standard")}
              onClick={() => setSelectedGroup("standard")}
            >
              Standard
            </button>
            <button
              className={getGroupButtonClass("luxury")}
              onClick={() => setSelectedGroup("luxury")}
            >
              Luxury
            </button>
            <button
              className={getGroupButtonClass("deluxe")}
              onClick={() => setSelectedGroup("deluxe")}
            >
              Deluxe
            </button>
            <button
              className={getGroupButtonClass("suites")}
              onClick={() => setSelectedGroup("suites")}
            >
              Suites
            </button>
          </div>

          {/* Custom Dropdown Component */}

          <div className="flex gap-3">
            <button
              onClick={handleOpenAddRoomModal}
              className=" inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-103 active:scale-95"
            >
              <HousePlus className="w-5 h-5" />
              Create
            </button>
            {/* Custom Dropdown Component */}
            <div className="relative w-56" ref={sortdropdownRef}>
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
                <ChevronDown
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
                            <Check className="w-4 h-4 text-gray-700" />
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

        {roomtypes.length === 0 ? (
          <div className="max-w-6xl mx-auto mt-16 text-center">
            <div className="text-gray-500 text-lg font-medium">
              No room types found
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
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto pt-5">
            {roomtypes.map((roomtype: any, index) => {
              return (
                <div
                  key={index}
                  /* onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(roomtype);
                }} */
                  onClick={() => handleRoomCardClick(roomtype._id)}
                  className="relative bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100 group mb-6 flex flex-col"
                >
                  <div className="flex-grow">
                    {/* Room type details */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-amber-600 uppercase mb-1">
                          {roomtype.typename}
                        </h3>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center text-gray-800">
                            <span className="text-lg font-bold">
                              Rs. {roomtype.pricepernight}
                            </span>
                            <span className="text-gray-500 text-sm ml-1">
                              /night
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {roomtype.maxadults} Adults
                            </span>
                            <span className="flex items-center gap-1">
                              <Baby className="w-4 h-4" />
                              {roomtype.maxchild} Children
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                          {roomtype.description}
                        </p>
                      </div>
                    </div>

                    {/* Availability Batch */}
                    {/* <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  </div> */}

                    {/* Room type images - Show maximum 5 images */}
                    {roomtype.roomTypeImageURLs &&
                      roomtype.roomTypeImageURLs.length > 0 && (
                        <div className="mb-2">
                          {/* First image - Large */}
                          <div className="mb-4">
                            <img
                              src={roomtype.roomTypeImageURLs[0]}
                              alt={`${roomtype.typename} - Main`}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>

                          {/* Remaining images - Grid (maximum 4 more) */}
                          {/* {roomtype.roomTypeImageURLs.length > 1 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {roomtype.roomTypeImageURLs
                              .slice(1, 5)
                              .map((image: string, imgIndex: number) => (
                                <div key={imgIndex} className="relative">
                                  <img
                                    src={image}
                                    alt={`${roomtype.typename} - ${
                                      imgIndex + 2
                                    }`}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  {imgIndex === 3 &&
                                    roomtype.roomTypeImageURLs.length > 5 && (
                                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                          +
                                          {roomtype.roomTypeImageURLs.length -
                                            5}
                                        </span>
                                      </div>
                                    )}
                                </div>
                              ))}
                          </div>
                        )} */}
                        </div>
                      )}
                  </div>

                  <div className="flex gap-3 mt-auto pt-4">
                    <button
                      type="button"
                      className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-103 active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(roomtype);
                        window.scrollTo({ top: 100, behavior: "smooth" });
                      }}
                    >
                      Update
                    </button>

                    <button
                      type="button"
                      className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-103 active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(roomtype._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {roomtypes.length > 0 && totalPage > 1 && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => {
                fetchData(page - 1, selectedGroup, selectedSortOption);
              }}
              //onClick={() => {fetchData(page - 1)}}
              disabled={page === 1}
              className="disabled:opacity-50 bg-amber-100 rounded-2xl"
            >
              <CircleChevronLeft className="w-8 h-8 text-amber-800" />
            </button>
            <div className="text-sm text-gray-600">
              Page {page} of {totalPage}
            </div>
            <button
              onClick={() => {
                fetchData(page + 1, selectedGroup, selectedSortOption);
              }}
              //onClick={() => {fetchData(page + 1)}}
              disabled={page === totalPage}
              className="disabled:opacity-50 bg-amber-100 rounded-full"
            >
              <CircleChevronRight className="w-8 h-8 text-amber-800" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
