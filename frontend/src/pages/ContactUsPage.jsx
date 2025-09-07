import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";

export default function AboutAndContactPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ---------- BRAND STORY ---------- */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">
          About <span className="text-pink-400">YeloSoul</span>
        </h1>
        <p className="text-gray-700 text-sm max-w-2xl mx-auto leading-relaxed">
          YeloSoul isn’t just jewelry it’s <strong>timeless elegance</strong> crafted
          sustainably. Every piece is designed to empower you while respecting the planet.
        </p>
        <blockquote className="mt-6 italic text-gray-600 max-w-md mx-auto text-sm">
          “Luxury should be meaningful, sustainable, and a reflection of your soul.”
        </blockquote>
        <img
          src="https://i.ibb.co/0ySFMvfM/Yelo-Soul-20250227-175858-0000-page-0001-removebg-preview-1.png"
          alt="YeloSoul Jewelry"
          className="mt-6 rounded-xl shadow-lg w-full max-h-80 object-cover"
        />
      </section>

      {/* ---------- MISSION & VALUES ---------- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Sustainability First</h2>
          <p className="text-sm text-gray-700">
            We believe in eco-friendly craftsmanship sourcing responsibly and using recyclable packaging.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Timeless Craftsmanship</h2>
          <p className="text-sm text-gray-700">
            Designed to last a lifetime, our pieces are hypoallergenic, waterproof, and made for everyday luxury.
          </p>
        </div>
      </section>

      {/* ---------- TEAM ---------- */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">Nitesh Sharma</h3>
            <p className="text-sm text-gray-600">CEO & Founder</p>
            <p className="mt-2 text-xs italic text-gray-500">
              “Jewelry should make you shine, not just sparkle.”
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">Raman Sharma</h3>
            <p className="text-sm text-gray-600">Operations Manager & Developer</p>
            <p className="mt-2 text-xs italic text-gray-500">
              “Great service is as important as great jewelry.”
            </p>
          </div>
        </div>
      </section>

      {/* ---------- CONTACT US ---------- */}
      <section>
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          Contact Us
        </h2>
        <p className="text-center text-sm text-gray-700 max-w-md mx-auto mb-6">
          Have a question or collaboration idea? We’d love to hear from you.
        </p>

        {/* Contact Info */}
        <div className="text-center text-sm text-gray-700 space-y-2 mb-6">
          <p>
            Email:{" "}
            <a
              href="mailto:support@yelosoul.com"
              className="text-blue-500 hover:underline"
            >
              yelosoulstore@gmail.com
            </a>
          </p>
          <p> Phone: +91 9667175620</p>
          <p> Mon - Sat (10 AM - 6 PM IST)</p>
          <p> Nangloi, New Delhi, India</p>
        </div>

        {/* Social Logos */}
        <div className="flex justify-center space-x-6 mt-4 text-2xl">
          <a
            href="https://www.instagram.com/yelosoulstore_?igsh=ZW1rMDQ4MjQzMXFs"
            target="_blank"
            className="text-pink-400 hover:scale-110 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://linkedin.com/company/yelosoul"
            target="_blank"
            className="text-blue-500 hover:scale-110 transition"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://wa.me/919667175620?text=Hi%20YeloSoul%20Team"
            target="_blank"
            className="text-green-500 hover:scale-110 transition"
          >
            <FaWhatsapp />
          </a>
        </div>
      </section>
    </div>
  );
}
