import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);

    // Count visitors
    const totalVisitors = parseInt(localStorage.getItem("totalVisitors") || "0");
    localStorage.setItem("totalVisitors", totalVisitors + 1);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/*  Brand */}
        <Link to="/" className="text-2xl font-bold text-primary tracking-wide">
          YeloSoul
        </Link>

        {/*  Hamburger for mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent md:flex items-center md:space-x-6 text-sm font-medium transition-all`}
        >
          <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-6 px-6 md:px-0 py-4 md:py-0 border-t md:border-none">

            <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-primary">
              Home
            </Link>

            {currentUser && (
              <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-primary">
                My Orders
              </Link>
            )}

            <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-primary">
              Wishlist
            </Link>

            <Link
              to="/occasions"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-1 bg-[#f5e7da] text-[#5a4d3b] rounded-lg hover:bg-[#e7d8c9] transition-all"
            >
              Shop by Occasion
            </Link>

            {/*  Cart */}
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="relative text-gray-700 hover:text-primary"
            >
              🛒
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-primary text-white text-xs rounded-full px-2">
                  {cart.length}
                </span>
              )}
            </Link>

            {/*  Admin Panel */}
            {currentUser?.isAdmin && (
              <Link
                to="/admin-orders"
                onClick={() => setMenuOpen(false)}
                className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
              >
                Orders Panel
              </Link>
            )}

            {/*  Auth Buttons */}
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-primary text-white px-4 py-1.5 rounded hover:opacity-90"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-200"
                >
                  Signup
                </Link>
              </>
            ) : (
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-3">
                <span className="text-gray-700">
                  Hi, <strong>{currentUser.name}</strong>
                </span>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:opacity-90"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}





