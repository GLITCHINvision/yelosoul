import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#fefaf5] text-[#4a8577] border-t border-[#eaeaea] mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/*  Logo & About */}
        <div>
          <h2 className="text-2xl font-bold mb-3 font-serif">🌸 YeloSoul</h2>
          <p className="text-sm opacity-80">
            Soft, minimal & Gen-Z-approved jewelry. Designed to add elegance to your style every day.
          </p>
        </div>

        {/*  Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[#356b5b]">Home</Link></li>
            <li><Link to="/orders" className="hover:text-[#356b5b]">My Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-[#356b5b]">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-[#356b5b]">Cart</Link></li>
          </ul>
        </div>

        {/*  Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-[#356b5b]">FAQs</Link></li>
            <li><Link to="/return-policy" className="hover:text-[#356b5b]">Return Policy</Link></li>
            <li><Link to="/shipping" className="hover:text-[#356b5b]">Shipping Info</Link></li>
            <li><Link to="/contact" className="hover:text-[#356b5b]">Contact Us</Link></li>
          </ul>
        </div>

        {/*  Newsletter & Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Stay Connected</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks for subscribing! 🥳");
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="email"
              placeholder="Your email"
              className="w-full border border-[#c4e3dc] rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#c4e3dc] outline-none"
            />
            <button
              type="submit"
              className="bg-[#4a8577] text-white px-4 py-2 rounded text-sm hover:opacity-90"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm opacity-80 mt-4">
            📧 support@yelosoul.com <br />
            📞 +91 98765 43210
          </p>
        </div>
      </div>

      {/*  Bottom Bar */}
      <div className="text-center py-4 text-sm border-t border-[#eaeaea] bg-[#fefefc]">
        © {new Date().getFullYear()} YeloSoul. All rights reserved.
      </div>
    </footer>
  );
}




