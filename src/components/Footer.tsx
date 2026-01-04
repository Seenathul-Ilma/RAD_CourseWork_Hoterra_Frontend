export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 py-4" style={{ fontFamily: "Poppins" }}>
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Hoterra • Luxury Hospitality
        </p>
      </div>
    </footer>
  );
}