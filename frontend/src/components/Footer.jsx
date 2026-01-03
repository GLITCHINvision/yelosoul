import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1a252f] text-white/80 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-3xl font-serif text-white mb-6">YeloSoul</h2>
            <p className="text-sm font-light leading-relaxed opacity-70 mb-6">
              Curated minimalism for the modern soul. Sustainable, elegant, and timeless designs crafted to elevate your everyday.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/yelosoulstore_?igsh=ZW1rMDQ4MjQzMXFs" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaInstagram size={20} /></a>
              <a href="https://linkedin.com/company/yelosoul" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaLinkedin size={20} /></a>
              <a href="https://wa.me/919667175620?text=Hi%20YeloSoul%20Team" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaWhatsapp size={20} /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-serif text-lg mb-6">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">All Collections</Link></li>
              <li><Link to="/occasions" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-serif text-lg mb-6">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/my-orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link to="/shipping-info" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/return-policy" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-serif text-lg mb-6">Stay in the loop</h3>
            <p className="text-sm opacity-70 mb-4">Subscribe for exclusive offers and new drops.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Welcome to the community! 🥂"); }} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/30"
                required
              />
              <button type="submit" className="bg-white text-[#1a252f] px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-50">
          <p>© {new Date().getFullYear()} YeloSoul. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
