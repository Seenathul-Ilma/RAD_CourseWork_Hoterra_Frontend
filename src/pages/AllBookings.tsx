import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import * as Icons from "lucide-react";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

// Service functions
import { getAllBookings, updateBookingStatus } from "../services/booking";

// Booking status enum (should match backend)
export const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CHECKED_IN: "CHECKED_IN",
  CHECKED_OUT: "CHECKED_OUT",
  CANCELLED: "CANCELLED",
} as const;

export type BookingStatusType =
  typeof BookingStatus[keyof typeof BookingStatus];

// Booking type
interface Booking {
  _id: string;
  check_in: string;
  check_out: string;
  bookingstatus: BookingStatusType;
  guest_id: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  room_id: {
    _id: string;
    roomnumber: number;
    floor: number;
    roomtype: {
      typename: string;
      pricepernight: number;
    };
  };
  total_price: number; 
  createdAt: string; 
}

export default function AllBookings() {
  const { user: currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const [bookingPage, setBookingPage] = useState(1);
  const [bookingTotalPage, setBookingTotalPage] = useState(1);
  const [bookingsTotalCount, setBookingsTotalCount] = useState(0);
  
  const isGuestUser = currentUser?.roles?.includes("GUEST");
  const isStaffUser = currentUser?.roles?.includes("ADMIN") || 
                     currentUser?.roles?.includes("RECEPTIONIST");

  useEffect(() => {
    setBookingPage(1)
    fetchBookings(1);
  }, []);

  const fetchBookings = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const response = await getAllBookings(pageNumber, 10);
      setBookings(response.data || []);

      setBookingPage(response?.page || pageNumber)
      setBookingTotalPage(response?.totalPages || pageNumber)
      setBookingsTotalCount(response?.totalCount || 0)
    
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      setErrorMsg(error?.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const getButtonLabel = (status: BookingStatusType): string => {
  const statusLabels: Record<BookingStatusType, string> = {
    [BookingStatus.CONFIRMED]: "Confirm",
    [BookingStatus.CANCELLED]: "Cancel",
    [BookingStatus.CHECKED_IN]: "Check In",
    [BookingStatus.CHECKED_OUT]: "Check Out",
    [BookingStatus.PENDING]: "Set as Pending",
  };
  
  return statusLabels[status] || status.toLowerCase().replace(/_/g, ' ');
};

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatusType) => {
    if (!isStaffUser) {
      setErrorMsg("Only staff can update booking status");
      return;
    }

    // Get a more user-friendly confirmation message
    const confirmationMessages = {
      [BookingStatus.CONFIRMED]: "confirm this booking?",
      [BookingStatus.CANCELLED]: "cancel this booking?",
      [BookingStatus.CHECKED_IN]: "check in this guest?",
      [BookingStatus.CHECKED_OUT]: "check out this guest?",
      [BookingStatus.PENDING]: "mark this booking as pending?",
    };

    if (!confirm(`Are you sure you want to ${confirmationMessages[newStatus] || `change status to ${newStatus}?`}`)) {
      return;
    }

    try {
      setUpdatingStatus(bookingId);
      setSuccessMsg("");
      setErrorMsg("");

      const response = await updateBookingStatus(bookingId, { status: newStatus });
      
      setSuccessMsg(response.message || "Status updated successfully");
      
      // Update the booking in the list
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, bookingstatus: newStatus }
            : booking
        )
      );
      
    } catch (error: any) {
      console.error("Error updating status:", error);
      setErrorMsg(error?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusColor = (status: BookingStatusType) => {
    switch (status) {
      case BookingStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case BookingStatus.CONFIRMED:
        return "bg-blue-100 text-blue-800";
      case BookingStatus.CHECKED_IN:
        return "bg-green-100 text-green-800";
      case BookingStatus.CHECKED_OUT:
        return "bg-gray-100 text-gray-800";
      case BookingStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: BookingStatusType) => {
    switch (status) {
      case BookingStatus.PENDING:
        return <Icons.Clock className="w-4 h-4" />;
      case BookingStatus.CONFIRMED:
        return <Icons.CheckCircle className="w-4 h-4" />;
      case BookingStatus.CHECKED_IN:
        return <Icons.DoorOpen className="w-4 h-4" />;
      case BookingStatus.CHECKED_OUT:
        return <Icons.LogOut className="w-4 h-4" />;
      case BookingStatus.CANCELLED:
        return <Icons.XCircle className="w-4 h-4" />;
      default:
        return <Icons.HelpCircle className="w-4 h-4" />;
    }
  };

  // Get available next statuses for a booking
  const getNextAvailableStatuses = (currentStatus: BookingStatusType): BookingStatusType[] => {
    const transitions: Record<BookingStatusType, BookingStatusType[]> = {
      [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
      [BookingStatus.CONFIRMED]: [BookingStatus.CHECKED_IN, BookingStatus.CANCELLED],
      [BookingStatus.CHECKED_IN]: [BookingStatus.CHECKED_OUT],
      [BookingStatus.CHECKED_OUT]: [],
      [BookingStatus.CANCELLED]: []
    };
    return transitions[currentStatus] || [];
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SuccessMessage message={successMsg} onClose={() => setSuccessMsg("")} />
      <ErrorMessage message={errorMsg} onClose={() => setErrorMsg("")} />

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isGuestUser ? "My Bookings" : "All Bookings"}
            </h1>
            <p className="text-gray-600">
              {isGuestUser 
                ? "View and manage your room reservations"
                : "Manage all guest bookings and reservations"}
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
                </div>
                <Icons.Calendar className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {bookings.filter(b => 
                      new Date(b.check_in) > new Date() && 
                      b.bookingstatus === BookingStatus.CONFIRMED
                    ).length}
                  </p>
                </div>
                <Icons.Clock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Checked In</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {bookings.filter(b => b.bookingstatus === BookingStatus.CHECKED_IN).length}
                  </p>
                </div>
                <Icons.DoorOpen className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-800">
                    Rs. {bookings
                      .filter(b => b.bookingstatus !== BookingStatus.CANCELLED)
                      .reduce((sum, b) => sum + (b.total_price || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <Icons.DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">
                  {isGuestUser ? "Your Reservations" : "Booking Management"}
                </h2>
                <button
                  onClick={() => fetchBookings(1)}
                  className="px-4 py-2 text-sm bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 flex items-center gap-2"
                >
                  <Icons.RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-4"></div>
                <p className="text-gray-600">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-12 text-center">
                <Icons.Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h3>
                <p className="text-gray-500">
                  {isGuestUser 
                    ? "You haven't made any bookings yet."
                    : "No bookings have been made yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Booking ID
                      </th>
                      {isStaffUser && (
                        <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Guest
                        </th>
                      )}
                      <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      {isStaffUser && (
                        <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => {
                      const availableStatuses = getNextAvailableStatuses(booking.bookingstatus);
                      
                      return (
                        <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                          {/* Booking ID */}
                          <td className="p-4">
                            <div className="text-sm font-medium text-gray-900">
                              #{booking._id.slice(-8).toUpperCase()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(booking.createdAt)}
                            </div>
                          </td>

                          {/* Guest Info (Staff only) */}
                          {isStaffUser && (
                            <td className="p-4">
                              <div className="font-medium text-gray-900">
                                {booking.guest_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.guest_email}
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.guest_phone || 'No phone'}
                              </div>
                            </td>
                          )}

                          {/* Room Info */}
                          <td className="p-4">
                            <div className="font-medium text-gray-900">
                              #{booking.room_id.roomnumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.room_id.roomtype.typename} • {booking.room_id.floor} Floor
                            </div>
                            <div className="text-xs text-gray-500">
                              Rs. {booking.room_id.roomtype.pricepernight}/night
                            </div>
                          </td>

                          {/* Dates */}
                          <td className="p-4">
                            <div className="text-sm">
                              <div className="flex items-center gap-2">
                                <Icons.Calendar className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{formatDate(booking.check_in)}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Icons.Calendar className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{formatDate(booking.check_out)}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {calculateNights(booking.check_in, booking.check_out)} nights
                              </div>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="p-4">
                            <div className="font-bold text-gray-900">
                              Rs. {(booking.total_price || 0).toLocaleString()}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookingstatus)}`}>
                                {getStatusIcon(booking.bookingstatus)}
                                {booking.bookingstatus.replace("_", " ")}
                              </span>
                            </div>
                          </td>

                          {/* Actions (Staff only) */}
                          {isStaffUser && (
                            <td className="p-4">
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                  {availableStatuses.map((status) => (
                                    <button
                                      key={status}
                                      onClick={() => handleStatusUpdate(booking._id, status)}
                                      disabled={updatingStatus === booking._id}
                                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                                        status === BookingStatus.CANCELLED
                                          ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200'
                                      } ${updatingStatus === booking._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                      {updatingStatus === booking._id ? (
                                        <span className="flex items-center gap-1">
                                          <Icons.Loader2 className="w-3 h-3 animate-spin" />
                                          Updating...
                                        </span>
                                      ) : (
                                        getButtonLabel(status)
                                      )}
                                    </button>
                                  ))}
                                  
                                  {/* Show "Completed" for CHECKED_OUT status */}
                                  {booking.bookingstatus === BookingStatus.CHECKED_OUT && (
                                    <span className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg border border-gray-200">
                                      Completed
                                    </span>
                                  )}
                                  
                                  {/* Show "Cancelled" for CANCELLED status */}
                                  {booking.bookingstatus === BookingStatus.CANCELLED && (
                                    <span className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg border border-gray-200">
                                      Cancelled
                                    </span>
                                  )}
                                </div>
                                
                                {/* View Details button - only show for non-completed/cancelled bookings */}
                                {/* {booking.bookingstatus !== BookingStatus.CHECKED_OUT && 
                                 booking.bookingstatus !== BookingStatus.CANCELLED && (
                                  <button
                                    onClick={() => {
                                      // View booking details
                                      console.log("View booking:", booking._id);
                                    }}
                                    className="text-xs text-amber-600 hover:text-amber-700 font-medium text-left"
                                  >
                                    View Details →
                                  </button>
                                )} */}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {bookingTotalPage > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              Showing{" "}
                              <span className="font-semibold">
                                {(bookingPage - 1) * 10 + 1}
                              </span>{" "}
                              to{" "}
                              <span className="font-semibold">
                                {Math.min(
                                  bookingPage * 10,
                                  bookingsTotalCount
                                )}
                              </span>{" "}
                              of{" "}
                              <span className="font-semibold">
                                {bookingsTotalCount}
                              </span>{" "}
                              rooms
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  fetchBookings(bookingPage - 1)
                                }
                                disabled={bookingPage === 1}
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
                                  bookingPage -
                                    Math.floor(maxVisiblePages / 2)
                                );
                                let endPage = Math.min(
                                  bookingTotalPage,
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
                                      onClick={() => fetchBookings(1)}
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
                                      onClick={() => fetchBookings(i)}
                                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        bookingPage === i
                                          ? "text-white bg-amber-600 border border-amber-600"
                                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                      }`}
                                    >
                                      {i}
                                    </button>
                                  );
                                }

                                // Last page with ellipsis if needed
                                if (endPage < bookingTotalPage) {
                                  if (endPage < bookingTotalPage - 1) {
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
                                      key={bookingTotalPage}
                                      onClick={() =>
                                        fetchBookings(
                                          bookingTotalPage
                                        )
                                      }
                                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                      {bookingTotalPage}
                                    </button>
                                  );
                                }

                                return pages;
                              })()}

                              <button
                                onClick={() =>
                                  fetchBookings(bookingPage + 1)
                                }
                                disabled={
                                  bookingPage === bookingTotalPage
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
            )}
          </div>

          {/* Legend for Status */}
          <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Status Legend</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="text-sm text-gray-600">PENDING - Awaiting confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-sm text-gray-600">CONFIRMED - Booking confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-600">CHECKED_IN - Guest checked in</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                <span className="text-sm text-gray-600">CHECKED_OUT - Stay completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-sm text-gray-600">CANCELLED - Booking cancelled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}