import { useEffect, useState, type FormEvent } from "react";
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
import {
  CircleArrowLeft,
  CircleArrowRight,
  PlusIcon,
  RotateCcw,
  Sparkles,
  SquarePen,
  Trash2,
} from "lucide-react";

export default function Service() {
  const [amenities, setAmenities] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [amenityname, setAmenityname] = useState("");
  const [description, setDiscription] = useState("");

  const [editingAmenityId, setEditingAmenityId] = useState<string | null>(null);

  const colorCombinations = [
    { bgColor: "bg-amber-100", iconColor: "text-amber-600" },
    { bgColor: "bg-purple-100", iconColor: "text-purple-600" },
    { bgColor: "bg-green-100", iconColor: "text-green-600" },
    { bgColor: "bg-blue-100", iconColor: "text-blue-600" },
    { bgColor: "bg-orange-100", iconColor: "text-orange-600" },
    { bgColor: "bg-indigo-100", iconColor: "text-indigo-600" },
    { bgColor: "bg-pink-100", iconColor: "text-pink-600" },
    { bgColor: "bg-rose-100", iconColor: "text-rose-600" },
    { bgColor: "bg-teal-100", iconColor: "text-teal-600" },
    { bgColor: "bg-cyan-100", iconColor: "text-cyan-600" },
  ];

  const getColorForAmenity = (amenityName: string) => {
    let hash = 0;
    for (let i = 0; i < amenityName.length; i++) {
      hash = amenityName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colorCombinations.length;
    return colorCombinations[index];
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
        ...getColorForAmenity(amenity.amenityname),
      }));

      //console.log(data)
      //setAmenities(data?.data);
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
      /* const formData = new FormData();
      formData.append("amenityname", amenityname);
      formData.append("description", description);

      //const res = await createPost(formData);
      await createAmenity(formData); */ // remove unused variables and imports

      if (editingAmenityId) {
        // UPDATE existing amenity
        const res = await updateAmenity(editingAmenityId, {
          amenityname,
          description,
        });
        setSuccessMsg(res.message || "Amenity updated successfully!");
      } else {
        // CREATE new amenity
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

    setSuccessMsg("");
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Pass onClose handlers to auto-dismiss messages */}
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

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <form>
            <div className="border border-gray-200 rounded-lg p-5 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {editingAmenityId ? (
                  <RotateCcw className="text-amber-600 w-8 h-8" />
                ) : (
                  <PlusIcon className="text-amber-600 w-8 h-8" />
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

                {/* Amenity Name Field */}
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
                      <Sparkles className="h-4 w-4" />
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
                  className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-5 py-3 mt-5 rounded-lg hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-102 active:scale-95 w-full"
                >
                  {editingAmenityId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-5 py-3 mt-5 rounded-lg hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-102 active:scale-95 w-full"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pt-10">
          {amenities.map((amenity: any, index) => {
            return (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(amenity);
                }}
                className="relative bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
              >
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(amenity);
                      window.scrollTo({ top: 100, behavior: "smooth" });
                    }}
                    className="px-2 py-1 rounded-full text-xs bg-green-100"
                  >
                    <SquarePen className="w-5 h-5 text-green-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(amenity._id);
                    }}
                    className="px-2 py-1 rounded-full text-xs bg-red-100"
                  >
                    <Trash2 className="w-5 h-5 text-red-700" />
                  </button>
                </div>

                {/* Amenity icon */}
                <div
                  className={`w-14 h-14 ${amenity.bgColor} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Sparkles className={amenity.iconColor} size={28} />
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

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => {
              fetchData(page - 1);
            }}
            disabled={page === 1}
            className="disabled:opacity-50 bg-amber-100 rounded-2xl"
          >
            <CircleArrowLeft className="w-8 h-8 text-amber-800" />
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
            <CircleArrowRight className="w-8 h-8 text-amber-800" />
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
