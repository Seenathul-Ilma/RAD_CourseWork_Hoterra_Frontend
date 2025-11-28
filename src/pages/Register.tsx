import { Eye, Lock, Mail, Hotel, User, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Register() {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setConPassword] = useState("")
  const [role, setRole] = useState("USER")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-8">
    {/* Header */}
    <div className="text-center">
      <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
        <Hotel className="w-10 h-10 font-medium text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h2>
      <p className="text-gray-600">Begin Your Stay with Hoterra</p>
    </div>

    {/* Registration Form */}
    <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
      <div className="space-y-6">
        {/* First Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
                    value={firstName}
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400"
                    placeholder="Enter your first name"
                    onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
        </div>

        {/* Last Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
                    value={lastName}
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400"
                    placeholder="Enter your last name"
                    onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
                    value={email}
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400"
                    placeholder="Enter your email address"
                    onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
                    value={password}
                    type="password"
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400"
                    placeholder="Create a strong password"
                    onChange={(e) => setPassword(e.target.value)}
            />
            <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    /* onclick="togglePassword()" */
            >
              <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">Password must be at least 8 characters long</p>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
                    value={conPassword}
                    type="password"
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400"
                    placeholder="Confirm your password"
                    onChange={(e) => setConPassword(e.target.value)}
            />
            <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    /* onclick="togglePassword()" */
            >
              <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
            </button>
          </div>
        </div>

        {/* <!-- Terms and Conditions --> */}
        <div className="flex items-center">
          <input
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-3 block text-sm text-gray-900">
            I agree to the <Link to="/" className="text-blue-600 hover:text-blue-500 font-medium">Terms of Service</Link> and <Link to="/" className="text-blue-600 hover:text-blue-500 font-medium">Privacy Policy</Link>
          </label>
        </div>

        {/* Submit Button */}
        <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition duration-200 ease-in-out hover:scale-105 active:scale-95"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Create Account
        </button>
      </div>

      {/* <!-- Login Link --> */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
            Sign in here
          </Link>
        </p>
      </div>
    </div>

    {/* Success & Error Message (Hidden by default) */}
  </div>
</div>


  )
}
