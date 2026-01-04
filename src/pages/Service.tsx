import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../context/authContext";

import {
  createAmenity,
  deleteAmenity,
  generateAmenityDesc,
  getAllAmenity,
  updateAmenity,
} from "../services/amenity";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";
import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";

export default function Service() {
  const { user: currentUser } = useAuth();
  const [amenities, setAmenities] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [amenityname, setAmenityname] = useState("");
  const [description, setDiscription] = useState("");

  const [editingAmenityId, setEditingAmenityId] = useState<string | null>(null);

  //const isGuestUser = currentUser?.roles?.includes("GUEST");
  const isStaffUser = currentUser?.roles?.includes("ADMIN") || 
                     currentUser?.roles?.includes("RECEPTIONIST");


  const colorCombinations: Record<
    string,
    { bgColor: string; iconColor: string }
  > = {
    "Technology & Connectivity": {
      bgColor: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    "Climate Control": { bgColor: "bg-red-100", iconColor: "text-red-700" },
    "Kitchen & Dining": {
      bgColor: "bg-orange-100",
      iconColor: "text-orange-700",
    },
    "Bathroom & Personal Care": {
      bgColor: "bg-cyan-100",
      iconColor: "text-cyan-700",
    },
    "Bedroom & Comfort": {
      bgColor: "bg-purple-100",
      iconColor: "text-purple-700",
    },
    "Entertainment & Leisure": {
      bgColor: "bg-pink-100",
      iconColor: "text-pink-700",
    },
    "Outdoor & Views": { bgColor: "bg-green-100", iconColor: "text-green-700" },
    "Safety & Security": {
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-700",
    },
    "Parking & Transportation": {
      bgColor: "bg-gray-100",
      iconColor: "text-gray-700",
    },
    "Family & Children": { bgColor: "bg-pink-100", iconColor: "text-pink-700" },
    "Pet Amenities": { bgColor: "bg-amber-100", iconColor: "text-amber-700" },
    "Laundry & Cleaning": {
      bgColor: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    "Wellness & Spa": { bgColor: "bg-teal-100", iconColor: "text-teal-700" },
    "Business & Work": {
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-700",
    },
    "Accessibility": {
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
    "Food & Beverage Services": {
      bgColor: "bg-rose-100",
      iconColor: "text-rose-700",
    },
    "Miscellaneous Services": {
      bgColor: "bg-slate-100",
      iconColor: "text-slate-700",
    },
  };

  const getColorForAmenity = (category: string) => {
    return (
      colorCombinations[category] ?? {
        bgColor: "bg-gray-100",
        iconColor: "text-gray-700",
      }
    );
  };

  // Helper function to get icon component
  const getIconComponent = (iconName: string | undefined) => {
    if (!iconName) return Icons.Sparkles;
    const IconComponent = (Icons as Record<string, any>)[iconName];
    return IconComponent || Icons.Sparkles;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (pageNumber = 1) => {
    try {
      const data = await getAllAmenity(pageNumber, 9);
      const amenitiesList = data?.data;
      const amenitiesWithColors = amenitiesList.map((amenity: any) => ({
        ...amenity,
        colorClass: getColorForAmenity(amenity.category),
      }));

      setAmenities(amenitiesWithColors);
      setTotalPage(data?.totalPages);
      setPage(pageNumber);
    } catch (err) {
      console.error("Error fetching amenities: ", err);
    }
  };

  const handleAmenityDescAiGeneration = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      if (!amenityname) {
        setErrorMsg("Amenity name required to generate description.");
        return;
      }

      const res = await generateAmenityDesc({ amenityname });
      setDiscription(res.description);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong!";
      setErrorMsg(message);
    }
  };

  const handleSaveAmenity = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!amenityname || !description) {
      setErrorMsg("Amenity name and description are required!");
      return;
    }

    try {
      if (editingAmenityId) {
        const res = await updateAmenity(editingAmenityId, {
          amenityname,
          description,
        });
        setSuccessMsg(res.message || "Amenity updated successfully!");
      } else {
        const res = await createAmenity({ amenityname, description });
        setSuccessMsg(res.message || "Amenity created successfully!");
      }

      await fetchData(1);
      handleReset();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong!";
      setErrorMsg(message);
    }
  };

  const handleEditClick = (amenity: any) => {
    setAmenityname(amenity.amenityname);
    setDiscription(amenity.description);
    setEditingAmenityId(amenity._id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this amenity?")) return;

    try {
      const res = await deleteAmenity(id);
      setSuccessMsg(res.message || "Amenity deleted successfully!");
      await fetchData(page);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Delete failed!";
      setErrorMsg(message);
    }
  };

  const handleReset = () => {
    setAmenityname("");
    setDiscription("");
    setEditingAmenityId(null);
    //setSuccessMsg("");
    //setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SuccessMessage message={successMsg} onClose={() => setSuccessMsg("")} />
      <ErrorMessage message={errorMsg} onClose={() => setErrorMsg("")} />

      <div className="container mx-auto px-4 py-16 pt-24">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Premium Services
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover thoughtfully crafted, comfort-enhancing amenities that
            elevate your stay with added warmth and convenience.
          </p>
        </div>

        { isStaffUser && (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <form>
            <div className="border border-gray-200 rounded-lg p-5 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {editingAmenityId ? (
                  <Icons.RotateCcw className="text-amber-600 w-8 h-8" />
                ) : (
                  <Icons.PlusIcon className="text-amber-600 w-8 h-8" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {editingAmenityId ? "Update Service" : "Create Service"}
              </h3>
              <p className="text-gray-600 mb-4">
                {editingAmenityId
                  ? "Refine and enhance your room amenity details for a better guest experience."
                  : "Enhance your room experience by adding well-defined amenities."}
              </p>
              <div className="space-y-5">
                {/* Amenity Name Field */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <span className="flex items-center">Service Name</span>
                  </label>
                  <input
                    type="text"
                    value={amenityname}
                    onChange={(e) => setAmenityname(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300"
                    placeholder="Enter service name (e.g., Swimming Pool, WiFi)"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-700 font-medium flex items-center">
                      Service Description
                    </label>
                    <button
                      onClick={handleAmenityDescAiGeneration}
                      className="text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-105 active:scale-95 flex items-center gap-2 px-3 py-1 rounded"
                    >
                      Generate Description
                      <Icons.Sparkles className="h-4 w-4" />
                    </button>
                  </div>

                  <textarea
                    value={description}
                    onChange={(e) => setDiscription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Describe the service in detail. Include features, benefits, and any important information for guests..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveAmenity}
                  className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-5 py-3 mt-5 rounded-lg hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-105 active:scale-95 w-full"
                >
                  {editingAmenityId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-5 py-3 mt-5 rounded-lg hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-105 active:scale-95 w-full"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div> )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pt-10">
          {/* {amenities.map((amenity: any, index) => { */}
          {amenities.map((amenity: any) => {
            const colors = getColorForAmenity(amenity.category);
            const IconComponent = getIconComponent(amenity.iconName);

            return (
              <div
                key={amenity._id}
                //key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(amenity);
                }}
                className="relative bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
              >
                {/* Action buttons */}
                { isStaffUser && (
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(amenity);
                      window.scrollTo({ top: 100, behavior: "smooth" });
                    }}
                    className="px-2 py-1 rounded-full text-xs bg-green-100"
                  >
                    <Icons.SquarePen className="w-5 h-5 text-green-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(amenity._id);
                    }}
                    className="px-2 py-1 rounded-full text-xs bg-red-100"
                  >
                    <Icons.Trash2 className="w-5 h-5 text-red-700" />
                  </button>
                </div>)}

                {/* Amenity icon */}
                <div
                  className={`w-14 h-14 ${colors.bgColor} rounded-lg flex items-center justify-center mb-4`}
                >
                  <IconComponent
                    size={28}
                    className={colors.iconColor}
                    strokeWidth={2}
                  />
                </div>

                {/* Amenity details */}
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {amenity.amenityname}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {amenity.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => {
              fetchData(page - 1);
            }}
            disabled={page === 1}
            className="disabled:opacity-50 bg-amber-100 rounded-2xl"
          >
            <Icons.CircleArrowLeft className="w-8 h-8 text-amber-800" />
          </button>
          <div className="text-sm text-gray-600">
            Page {page} of {totalPage}
          </div>
          <button
            onClick={() => {
              fetchData(page + 1);
            }}
            disabled={page === totalPage}
            className="disabled:opacity-50 bg-amber-100 rounded-full"
          >
            <Icons.CircleArrowRight className="w-8 h-8 text-amber-800" />
          </button>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <NavLink
            to="/rooms"
            className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 font-semibold"
          >
            Book Your Stay Now
          </NavLink>
        </div>
      </div>
    </div>
  );
}