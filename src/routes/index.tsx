import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "../components/Layout"

const Welcome = lazy(() => import("../pages/Welcome"))
const Register = lazy(() => import("../pages/Register"))
const Login = lazy(() => import("../pages/Login"))
const Home = lazy(() => import("../pages/Home"))
const Service = lazy(() => import("../pages/Service"))
const Contact = lazy(() => import("../pages/Contact"))
const Hotels = lazy(() => import("../pages/Hotels"))
// const HotelDetail = lazy(() => import("../pages/HotelDetail"))
const MyBookings = lazy(() => import("../pages/MyBookings"))
const MyStays = lazy(() => import("../pages/MyStays"))


export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading..</div>}>
        <Routes>

          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Welcome />} />
            <Route path="home" element={<Home />} />
            <Route path="service" element={<Service />} />
            <Route path="contact" element={<Contact />} />
            <Route path="hotels" element={<Hotels />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="my-stays" element={<MyStays />} />
          </Route>          

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
