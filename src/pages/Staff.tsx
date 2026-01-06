import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  ShieldAlert,
  Trash2,
  Send,
  UserX,
  Check,
  Lock
} from "lucide-react";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import {
  getStaffUsers,
  inviteStaff,
  deleteStaffUser,
  updateAccountStatus,
  type StaffUser
} from "../services/staff";

export default function Staff() {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Data States
  const [receptionists, setReceptionists] = useState<StaffUser[]>([]);
  const [admins, setAdmins] = useState<StaffUser[]>([]);

  // Pagination States
  const [receptionistPage, setReceptionistPage] = useState(1);
  const [receptionistTotalPages, setReceptionistTotalPages] = useState(1);
  const [receptionistTotalCount, setReceptionistTotalCount] = useState(0);

  const [adminPage, setAdminPage] = useState(1);
  const [adminTotalPages, setAdminTotalPages] = useState(1);
  const [adminTotalCount, setAdminTotalCount] = useState(0);

  // Loading States
  const [loadingReceptionists, setLoadingReceptionists] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  // Email input states
  const [receptionistEmail, setReceptionistEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  // Fetch Receptionists
  const fetchReceptionists = async (page: number) => {
    try {
      setLoadingReceptionists(true);
      const res = await getStaffUsers("RECEPTIONIST", page);
      setReceptionists(res.data);
      setReceptionistTotalPages(res.pagination.totalPages);
      setReceptionistTotalCount(res.pagination.total);
      setReceptionistPage(res.pagination.page);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to fetch receptionists");
    } finally {
      setLoadingReceptionists(false);
    }
  };

  // Fetch Admins
  const fetchAdmins = async (page: number) => {
    try {
      setLoadingAdmins(true);
      const res = await getStaffUsers("ADMIN", page);
      setAdmins(res.data);
      setAdminTotalPages(res.pagination.totalPages);
      setAdminTotalCount(res.pagination.total);
      setAdminPage(res.pagination.page);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to fetch admins");
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    fetchReceptionists(1);
    fetchAdmins(1);
  }, []);

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInviteReceptionist = async () => {
    if (!validateEmail(receptionistEmail)) {
      setErrorMsg("Please enter a valid email address for receptionist.");
      return;
    }

    try {
      await inviteStaff(receptionistEmail, "RECEPTIONIST");
      setSuccessMsg(`Invitation sent to ${receptionistEmail}`);
      setReceptionistEmail("");
      fetchReceptionists(receptionistPage); // Refresh list
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to invite receptionist.");
    }
  };

  const handleInviteAdmin = async () => {
    if (!validateEmail(adminEmail)) {
      setErrorMsg("Please enter a valid email address for administrator.");
      return;
    }

    try {
      await inviteStaff(adminEmail, "ADMIN");
      setSuccessMsg(`Invitation sent to ${adminEmail}`);
      setAdminEmail("");
      fetchAdmins(adminPage); // Refresh list
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to invite administrator.");
    }
  };

  // Handle updating account status
  const handleUpdateStatus = async (id: string, newStatus: string, role: "ADMIN" | "RECEPTIONIST") => {
    try {
      await updateAccountStatus(id, { status: newStatus });
      setSuccessMsg(`User status updated to ${newStatus}`);
      
      // Refresh the appropriate list
      if (role === "ADMIN") {
        fetchAdmins(adminPage);
      } else {
        fetchReceptionists(receptionistPage);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to update user status.");
    }
  };

  // Handle deleting user
  const handleDeleteUser = async (id: string, role: "ADMIN" | "RECEPTIONIST") => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      await deleteStaffUser(id);
      setSuccessMsg("User deleted successfully.");
      
      // Refresh the appropriate list
      if (role === "ADMIN") {
        fetchAdmins(adminPage);
      } else {
        fetchReceptionists(receptionistPage);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to delete user.");
    }
  };

  // Helper function to render action buttons based on status
  const renderActionButtons = (user: StaffUser, role: "ADMIN" | "RECEPTIONIST") => {
    const { id, status } = user;

    switch (status) {
      case "PENDING":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateStatus(id, "ACTIVE", role)}
              className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center transition-colors duration-200"
              title="Activate User"
            >
              <Check className="w-4 h-4 mr-1" />
              Activate
            </button>
            <button
              onClick={() => handleUpdateStatus(id, "BLOCKED", role)}
              className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center transition-colors duration-200"
              title="Reject User"
            >
              <UserX className="w-4 h-4 mr-1" />
              Reject
            </button>
          </div>
        );
      
      case "ACTIVE":
        return (
          <button
            onClick={() => handleUpdateStatus(id, "BLOCKED", role)}
            className="text-orange-600 hover:text-orange-800 font-medium text-sm flex items-center transition-colors duration-200"
            title="Block User"
          >
            <Lock className="w-4 h-4 mr-1" />
            Block
          </button>
        );
      
      case "BLOCKED":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateStatus(id, "ACTIVE", role)}
              className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center transition-colors duration-200"
              title="Activate User"
            >
              <Check className="w-4 h-4 mr-1" />
              Activate
            </button>
            <button
              onClick={() => handleDeleteUser(id, role)}
              className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center transition-colors duration-200"
              title="Delete User"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        );
      
      default:
        return (
          <button
            onClick={() => handleDeleteUser(id, role)}
            className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center transition-colors duration-200"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        );
    }
  };

  // Pagination Component Helper (keep your existing renderPagination function)
  const renderPagination = (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void,
    totalCount: number
  ) => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        pages.push(
          <button
            key={1}
            onClick={() => onPageChange(1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            1
          </button>
        );
        if (startPage > 2) {
          pages.push(<span key="ellipsis1" className="px-2 text-gray-500">...</span>);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === i
              ? "text-white bg-amber-600 border border-amber-600"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
          >
            {i}
          </button>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(<span key="ellipsis2" className="px-2 text-gray-500">...</span>);
        }
        pages.push(
          <button
            key={totalPages}
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {totalPages}
          </button>
        );
      }

      return pages;
    };

    return (
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{(currentPage - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(currentPage * 10, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> staff
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SuccessMessage message={successMsg} onClose={() => setSuccessMsg("")} />
      <ErrorMessage message={errorMsg} onClose={() => setErrorMsg("")} />

      <div className="container mx-auto px-4 py-16 pt-24">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Internal Team
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage trusted team members, control access, and maintain secure, efficient operations from one place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
          {/* Total Staff Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Staff</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{receptionistTotalCount + adminTotalCount}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span className="text-blue-600 font-medium">Active Members</span>
            </div>
          </div>

          {/* Receptionists Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">Receptionists</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{receptionistTotalCount}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Administrators Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">Administrators</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{adminTotalCount}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">

          {/* Receptionists Table Section */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <UserCheck className="w-6 h-6 text-green-600 mr-2" />
                  Receptionists
                  <span className="ml-3 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {receptionistTotalCount} staff
                  </span>
                </h2>
                <p className="text-gray-600 mt-1">Manage front desk receptionists and their access</p>
              </div>
            </div>

            {/* Receptionists Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingReceptionists ? (
                    <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
                  ) : receptionists.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-4 text-center">No receptionists found.</td></tr>
                  ) : (
                    receptionists.map((receptionist) => (
                      <tr key={receptionist.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <UserCheck className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="font-medium text-gray-900">{receptionist.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{receptionist.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{receptionist.phone || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${receptionist.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : receptionist.status === "BLOCKED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                            }`}>
                            {receptionist.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderActionButtons(receptionist, "RECEPTIONIST")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Receptionists Pagination */}
            {renderPagination(receptionistPage, receptionistTotalPages, fetchReceptionists, receptionistTotalCount)}

            {/* Invite Receptionist Form */}
            <div className="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Send className="w-5 h-5 text-green-600 mr-2" />
                Invite New Receptionist
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <input
                    type="email"
                    value={receptionistEmail}
                    onChange={(e) => setReceptionistEmail(e.target.value)}
                    placeholder="Enter email address (e.g., receptionist@company.com)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    onKeyPress={(e) => e.key === "Enter" && handleInviteReceptionist()}
                  />
                </div>
                <button
                  onClick={handleInviteReceptionist}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center whitespace-nowrap"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Invitation
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Administrators Table Section */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <ShieldAlert className="w-6 h-6 text-red-600 mr-2" />
                  Administrators
                  <span className="ml-3 bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                    {adminTotalCount} staff
                  </span>
                </h2>
                <p className="text-gray-600 mt-1">Manage system administrators with elevated privileges</p>
              </div>
            </div>

            {/* Admins Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingAdmins ? (
                    <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
                  ) : admins.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-4 text-center">No administrators found.</td></tr>
                  ) : (
                    admins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-red-100 rounded-full flex items-center justify-center mr-3">
                              <ShieldAlert className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="font-medium text-gray-900">{admin.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{admin.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{admin.phone || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : admin.status === "BLOCKED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                            }`}>
                            {admin.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderActionButtons(admin, "ADMIN")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Admins Pagination */}
            {renderPagination(adminPage, adminTotalPages, fetchAdmins, adminTotalCount)}

            {/* Invite Admin Form */}
            <div className="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Send className="w-5 h-5 text-red-600 mr-2" />
                Invite New Administrator
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter email address (e.g., admin@company.com)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    onKeyPress={(e) => e.key === "Enter" && handleInviteAdmin()}
                  />
                </div>
                <button
                  onClick={handleInviteAdmin}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center whitespace-nowrap"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Invitation
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-5 bg-blue-50 border border-blue-100 rounded-lg">
            <h3 className="font-medium text-blue-800 flex items-center mb-2">
              <Users className="w-5 h-5 mr-2" />
              How to manage staff
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li><span className="font-medium">•</span> Type an email address and click "Send Invitation" to invite new staff members</li>
              <li><span className="font-medium">•</span> Receptionists have front desk access, administrators have system management access</li>
              <li><span className="font-medium">•</span> Invited staff will appear in the system once they accept the invitation</li>
              <li><span className="font-medium">•</span> Use the action buttons to manage user status (Activate, Block, Reject, Delete)</li>
              <li><span className="font-medium">•</span> Pending users can be Activated or Rejected</li>
              <li><span className="font-medium">•</span> Active users can be Blocked</li>
              <li><span className="font-medium">•</span> Blocked users can be Activated or Deleted</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}