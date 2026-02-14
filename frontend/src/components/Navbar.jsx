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
          <button
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="flex flex-col justify-center items-center w-8 h-6 relative focus:outline-none z-[70]"
          >
            <span className={`block absolute h-0.5 w-6 transition-all duration-300 ease-in-out ${menuOpen ? 'rotate-45 bg-white' : '-translate-y-2 bg-[#2c3e50]'}`}></span>
            <span className={`block absolute h-0.5 w-6 transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-0 bg-white' : 'bg-[#2c3e50]'}`}></span>
            <span className={`block absolute h-0.5 w-6 transition-all duration-300 ease-in-out ${menuOpen ? '-rotate-45 bg-white' : 'translate-y-2 bg-[#2c3e50]'}`}></span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link to="/" className={`${textColor} ${hoverColor}`}>Home</Link>
          <Link to="/occasions" className={`${textColor} ${hoverColor}`}>Occasions</Link>
          <Link to="/return-policy" className={`${textColor} ${hoverColor}`}>Policy</Link>

          <div className="flex items-center space-x-6 ml-4 border-l pl-8 border-gray-100">
            <Link to="/wishlist" className={`${textColor} hover:scale-110 transition-transform`}>
              <Heart size={20} />
            </Link>
            <Link to="/cart" className={`relative ${textColor} hover:scale-110 transition-transform`}>
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#2c3e50] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            {!currentUser ? (
              <Link to="/login" className="bg-[#2c3e50] text-white px-6 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-white hover:text-[#2c3e50] border border-[#2c3e50] transition-all">
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/my-orders" className={`${textColor} hover:scale-110 transition-transform`}>
                  <User size={20} />
                </Link>
                <button onClick={handleLogout} className="text-red-500 hover:scale-110 transition-transform">
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Side Drawer */}
        <div
          className={`fixed inset-y-0 right-0 w-[280px] h-screen bg-[#1a1a1a] shadow-2xl z-[100] transform transition-transform duration-500 ease-in-out md:hidden flex flex-col pt-24 pb-10 px-8 space-y-8 ${menuOpen ? "translate-x-0" : "translate-x-full"
            } text-sm font-medium overflow-y-auto`}
        >
          {/* Close Button Inside Drawer */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-8 text-white/40 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>

          {/* Main Links */}
          <div className="flex flex-col space-y-8">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-white hover:text-[#c4a287] transition-colors text-2xl font-serif uppercase tracking-widest"
            >
              Home
            </Link>
            <Link
              to="/occasions"
              onClick={() => setMenuOpen(false)}
              className="text-white hover:text-[#c4a287] transition-colors text-2xl font-serif uppercase tracking-widest"
            >
              Occasions
            </Link>
            <Link
              to="/return-policy"
              onClick={() => setMenuOpen(false)}
              className="text-white hover:text-[#c4a287] transition-colors text-2xl font-serif uppercase tracking-widest"
            >
              Policy
            </Link>
          </div>

          {/* Action Icons & Auth */}
          <div className="mt-auto pt-10 border-t border-white/5 space-y-8">
            <div className="flex items-center space-x-10">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 text-white/60 hover:text-[#c4a287] transition-colors"
              >
                <Heart size={20} />
                <span className="text-[10px] uppercase tracking-widest">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 text-white/60 hover:text-[#c4a287] transition-colors"
              >
                <div className="relative">
                  <ShoppingBag size={20} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#c4a287] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-widest">Bag</span>
              </Link>
            </div>

            {/* Auth Buttons */}
            {!currentUser ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full bg-[#c4a287] text-white py-4 text-center text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-[#111111] transition-all"
              >
                Login / Register
              </Link>
            ) : (
              <div className="space-y-6">
                <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 text-white/60 hover:text-[#c4a287]">
                  <User size={20} />
                  <span className="text-[10px] uppercase tracking-widest">My Account</span>
                </Link>
                {currentUser?.isAdmin && (
                  <Link
                    to="/admin-orders"
                    onClick={() => setMenuOpen(false)}
                    className="block text-[#c4a287] text-[10px] uppercase tracking-widest font-bold"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="flex items-center gap-4 text-red-400 opacity-60 hover:opacity-100 transition-all uppercase tracking-widest text-[10px]"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Overlay Blur */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden transition-opacity duration-300"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
}
