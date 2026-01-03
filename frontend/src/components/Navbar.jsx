import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag, Heart, User, LogOut } from "lucide-react";

export default function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);

    // Count visitors
    const totalVisitors = parseInt(localStorage.getItem("totalVisitors") || "0");
    localStorage.setItem("totalVisitors", totalVisitors + 1);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Dynamic text color checking
  // For White Hero, we generally want Dark Text.
  // However, if we want to be safe, we can use Dark Text always.
  const textColor = "text-[#2c3e50]";
  const hoverColor = "hover:text-gray-600";

  return (
    <nav
      className={`sticky top-0 w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm py-4`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/*  Brand */}
        <Link to="/" className={`text-3xl font-serif tracking-tight transition-colors ${textColor}`}>
          YeloSoul
        </Link>

        {/*  Hamburger for mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Menu" className={`transition-colors ${textColor}`}>
            {menuOpen ? <X size={24} className="text-[#2c3e50]" /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <div
          className={`${menuOpen ? "absolute top-full left-0 w-full bg-white shadow-lg flex flex-col p-6 space-y-4" : "hidden"
            } md:static md:flex md:items-center md:space-x-8 md:bg-transparent md:shadow-none md:p-0 md:space-y-0 text-sm font-medium transition-all`}
        >
          {/* Main Links */}
          <div className={`flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 transition-colors ${menuOpen ? "text-[#2c3e50]" : textColor}`}>
            <Link to="/" onClick={() => setMenuOpen(false)} className={`${hoverColor} transition-colors`}>
              Home
            </Link>
            <Link
              to="/occasions"
              onClick={() => setMenuOpen(false)}
              className={`${hoverColor} transition-colors`}
            >
              Shop by Occasion
            </Link>
            <Link
              to="/return-policy"
              onClick={() => setMenuOpen(false)}
              className={`${hoverColor} transition-colors`}
            >
              Policy
            </Link>
          </div>

          {/* Right Side Icons/Actions */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 border-t md:border-none pt-4 md:pt-0 mt-2 md:mt-0">

            {/* Wishlist */}
            <Link to="/wishlist" onClick={() => setMenuOpen(false)} className={`relative hover:scale-110 transition-transform ${menuOpen ? "text-[#2c3e50]" : textColor}`}>
              <Heart size={20} />
            </Link>

            {/*  Cart */}
            <Link to="/cart" onClick={() => setMenuOpen(false)} className={`relative hover:scale-110 transition-transform ${menuOpen ? "text-[#2c3e50]" : textColor}`}>
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 bg-[#2c3e50] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center`}>
                  {cart.length}
                </span>
              )}
            </Link>

            {/*  Auth / Profile */}
            {!currentUser ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all shadow-md text-center bg-[#2c3e50] text-white hover:bg-[#1a252f]`}
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                {/*  Admin Panel Link */}
                {currentUser?.isAdmin && (
                  <Link
                    to="/admin-orders"
                    onClick={() => setMenuOpen(false)}
                    className="text-xs font-semibold bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200"
                  >
                    Admin
                  </Link>
                )}

                <Link to="/my-orders" onClick={() => setMenuOpen(false)} className={`hover:scale-110 transition-transform ${menuOpen ? "text-[#2c3e50]" : textColor}`} title="My Orders">
                  <User size={20} />
                </Link>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-red-400 hover:text-red-600 hover:scale-110 transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
