import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/authContext"
import RoomDetail from "../pages/RoomDetail";

const Welcome = lazy(() => import("../pages/Welcome"));
const Register = lazy(() => import("../pages/Register"));
const Login = lazy(() => import("../pages/Login"));
const Home = lazy(() => import("../pages/Home"));
const Service = lazy(() => import("../pages/Service"));
const Contact = lazy(() => import("../pages/Contact"));
const Rooms = lazy(() => import("../pages/Rooms"));
// const RoomDetail = lazy(() => import("../pages/RoomDetail"))
const MyBookings = lazy(() => import("../pages/MyBookings"));
const MyStays = lazy(() => import("../pages/MyStays"));
const Staff = lazy(() => import("../pages/Staff"));


type RequireAuthTypes = { children: ReactNode; roles?: string[] }

const RequireAuth = ({ children, roles }: RequireAuthTypes) => {   // children - default prop
  const { user, loading } = useAuth()

  if(loading) {
      return <div>User Loading..!</div>
  }

  if(!user) {
    return <Navigate to="/login" replace/>
  }

  // user null da kiyl check krl vr vunata passe (if user not null)
  if(roles && !roles.some((role)=> user.roles?.includes(role))) {
    return (
      <div>
        <h2 className="text-center py-20">Access Denied..!</h2>
        <p className="text-xl font-bold mb-2">You don't have permission to view this page.</p>
      </div>
    )
  }

  return <>{children}</>
}

export default function Router() {
  return (
    <BrowserRouter>

      <Suspense fallback={<div>Loading..</div>}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }>

            <Route path="/home" element={<Home />} />
            <Route path="/service" element={<Service />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:roomtypeId" element={<RoomDetail />} />
            <Route path="/my-bookings" element={
              <RequireAuth roles={["GUEST"]}>
                <MyBookings />
              </RequireAuth>
            } />
            <Route path="/my-stays" element={
              <RequireAuth roles={["GUEST"]}>
                <MyStays />
              </RequireAuth>
            } />
            <Route path="/staff" element={
              <RequireAuth roles={["ADMIN"]}>
                <Staff />
              </RequireAuth>
            } />
          </Route>
          
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
