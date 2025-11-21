import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header>
        <div>
            <Link to="/home">Home</Link>
            <Link to="/service">Services</Link>
            <Link to="/hotels">Hotels</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/my-bookings">MyBookings</Link>
            <Link to="/my-stays">My Stays</Link>
        </div>
        {/*<button>Log Out</button>*/}    
    </header>
  )
}
