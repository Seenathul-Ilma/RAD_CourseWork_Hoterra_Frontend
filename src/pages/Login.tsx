import { Eye, Lock, LogIn, Mail, Hotel, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { useAuth } from "../context/authContext";
import { getMyDetail, login } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();

  //const {user, setUser} = useAuth()   // authContext eke values vala dhapu eke copy and paste -> {user, setUser} // only required eka gnnath puluvan
  const { setUser } = useAuth();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Oooppsss.. All fields are required..!");
      return;
    }

    try {
      const res: any = await login(email, password);
      console.log(res.data);
      console.log(res.message);
      console.log(res.data.accessToken);
      console.log(res.data.refreshToken);

      if (!res.data.accessToken || !res.data.refreshToken) {
        alert("Failed to login..!");
        return;
      }

      await localStorage.setItem("accessToken", res.data.accessToken);
      await localStorage.setItem("refreshToken", res.data.refreshToken);

     console.log("Before MyProfile..");

      alert(`Login successful..! Email: ${res?.data?.email}`);

      const profile = await getMyDetail();
      console.log("MyProfile..");
      // use redux to save userdata
      // or, use auth context (more speed to get user details)
      //console.log(profile.data)   // before add const {user, setUser} = useAuth()
      setUser(profile.data);

      console.log("profile.data: "+profile.data)

      navigate("/home");
    } catch (err: any) {
      console.error(err?.response?.data);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
        {/* <!-- Header --> */}
        <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full flex items-center justify-center mb-4 shadow-lg">
    <Hotel className="w-10 h-10 font-medium text-white" />
</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your Hoterra account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
            <div className="space-y-6">
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
                                type={showPassword ? "text" : "password"}
                                required
                                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400"
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* Toggle Button */}
                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
                        ) : (
                            <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
                        )}
                        </button>
                    </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                                type="checkbox"
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>
                    <div className="text-sm">
                        <Link to="/" className="font-medium text-amber-700 hover:text-amber-900 transition-colors duration-200">
                          Forgot your password?
                        </Link>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transform transition duration-200 ease-in-out hover:scale-105 active:scale-95"
                        onClick={handleLogin}
                >
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                </button>
            </div>

            {/* Registration Link */}
            <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-amber-700 hover:text-amber-900 transition-colors duration-200">
                        Create one here
                    </Link>
                </p>
            </div>
        </div>

        {/* <!-- Success & Error Messages (Hidden by default) --> */}
        {/* <div className="hidden bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex">
                <CheckCircle className="w-5 h-5 mr-2 mt-0.5" />
                <span>Login successful! Welcome back to Edusphere.</span>
            </div>
        </div>

        <div className="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
                <span>Invalid email or password. Please try again.</span>
            </div>
        </div> */}
    </div>
</div>

  )
}
