# 🎨 Hoterra Frontend

A modern hotel room booking platform built with React and TypeScript. Browse rooms, make bookings, and manage your stays with an intuitive user interface.

## 📱 Live Application
**Frontend**: https://rad-course-work-hoterra-frontend.vercel.app

## 🛠️ Tech Stack
- **React 18** - UI library with TypeScript
- **Vite** - Fast build tool and development server
- **Axios** - HTTP client for API requests
- **Context API** - State management for authentication
- **CSS** - Responsive styling

## 📋 Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running (or deployed)

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/Seenathul-Ilma/RAD_CourseWork_Hoterra_Frontend.git
cd hoterra-frontend

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://rad-course-work-hoterra-backend.vercel.app
```

For local development:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Run Development Server

```bash
npm run dev
```

Application will run at `http://localhost:5173`

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorMessage.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Layout.tsx
│   └── SuccessMessage.tsx
├── context/            # Auth context for state management
│   └── authContext.tsx
├── pages/              # Page components
│   ├── AllBookings.tsx
│   ├── Contact.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── MakeBooking.tsx
│   ├── MyStays.tsx
│   ├── Register.tsx
│   ├── RoomDetail.tsx
│   ├── Rooms.tsx
│   ├── Service.tsx
│   ├── Staff.tsx
│   └── Welcome.tsx
├── routes/            # Route definitions
│   └── index.tsx
├── services/          # API service layer
│   ├── amenity.ts
│   ├── api.ts
│   ├── auth.ts
│   ├── availability.ts
│   ├── booking.ts
│   ├── room.ts
│   └── roomtype.ts
├── utils/             # Utility functions
│   └── keepBackendWarm.ts
├── assets/            # Images and icons
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## 📄 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Welcome | `/` | Landing page |
| Home | `/home` | Dashboard |
| Rooms | `/rooms` | Browse all rooms |
| Room Details | `/room/:id` | View room information |
| Make Booking | `/booking` | Reserve a room |
| My Stays | `/my-stays` | User's bookings |
| All Bookings | `/all-bookings` | Admin view (all bookings) |
| Services | `/service` | Hotel amenities |
| Contact | `/contact` | Contact page |
| Login | `/login` | User login |
| Register | `/register` | Create account |

## 🔌 API Integration

The frontend communicates with the backend through service files:

### Authentication Service (`auth.ts`)
```typescript
- login(email, password)
- register(firstName, lastName, email, password, phone)
- logout()
```

### Room Service (`room.ts`)
```typescript
- getAllRooms()
- getRoomById(id)
- createRoom(data)          // Admin
- updateRoom(id, data)      // Admin
- deleteRoom(id)            // Admin
```

### Booking Service (`booking.ts`)
```typescript
- createBooking(data)
- getUserBookings()
- getBookingById(id)
- updateBooking(id, data)
- cancelBooking(id)
```

### Availability Service (`availability.ts`)
```typescript
- checkAvailability(roomId, checkInDate, checkOutDate)
```

### Amenity Service (`amenity.ts`)
```typescript
- getAllAmenities()
```

### Room Type Service (`roomtype.ts`)
```typescript
- getAllRoomTypes()
```

## 🎯 Features

### User Features
- ✅ Browse available rooms with filters
- ✅ View detailed room information and amenities
- ✅ Make room bookings with date selection
- ✅ Check real-time room availability
- ✅ View booking history and current stays
- ✅ Cancel or modify bookings
- ✅ User registration and authentication
- ✅ Profile management

### Admin Features
- ✅ View all bookings
- ✅ Manage room inventory
- ✅ Create/update room types
- ✅ Manage amenities
- ✅ Invite staff members
- ✅ Monitor occupancy

## 🔑 Authentication

Uses Context API to manage user authentication state:

```typescript
const { user, isLoggedIn, login, logout } = useContext(AuthContext);
```

JWT tokens are stored and sent with each API request in the `Authorization` header.

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

Set environment variable `VITE_API_BASE_URL` in Vercel dashboard.

## 🌐 CORS Configuration

The backend must be configured to accept requests from the frontend URL:

```
Development: http://localhost:5173
Production: https://rad-course-work-hoterra-frontend.vercel.app/
```

Update `CORS_ORIGIN` in backend `.env` file accordingly.

## 🧪 Component Hierarchy

```
App
├── Welcome (/)
├── Home (/home)
├── Rooms (/rooms)
├── RoomDetail (/room/:id)
├── MakeBooking (/booking)
├── MyStays (/my-stays)
├── AllBookings (/all-bookings)
├── Service (/service)
├── Contact (/contact)
├── Staff (/staff)
├── Login (/login)
└── Register (/register)
```

## ⚡ Performance Optimization

The app includes a utility to keep the Vercel backend serverless from idling:

```typescript
// Sends ping every 5 minutes
setInterval(() => {
  fetch(`${API_BASE_URL}/health`)
}, 5 * 60 * 1000);
```

## 🐛 Troubleshooting

### CORS Errors
- Check `VITE_API_BASE_URL` matches actual backend URL
- Verify backend has correct `CORS_ORIGIN` set
- Ensure backend is running

### API 404 Errors
- Verify backend is running and accessible
- Check API endpoint paths are correct
- Review backend routes

### Blank Page or Errors
- Check browser console for errors
- Verify all environment variables are set
- Clear browser cache and reload

## 📚 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter (if configured)
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and test
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/feature-name`
5. Create Pull Request

## 📄 License
MIT License

---

- **Backend Repository**: https://github.com/Seenathul-Ilma/RAD_CourseWork_Hoterra_Backend
- **Deployed Backend**: https://rad-course-work-hoterra-backend.vercel.app