import { FaInstagram, FaLinkedin, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#fcfbf8]">
      {/* Hero Section */}
      <div className="relative bg-[#2c3e50] text-white py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-3xl md:text-5xl font-serif mb-4">Get in Touch</h1>
          <p className="text-sm md:text-lg opacity-80 font-light max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our jewelry, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-serif text-[#2c3e50] mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full text-[#2c3e50]">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2c3e50]">Email</h3>
                    <p className="text-gray-500 text-sm">Our friendly team is here to help.</p>
                    <a href="mailto:support@yelosoul.com" className="text-[#2c3e50] font-medium hover:underline mt-1 block">
                      yelosoulstore@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full text-[#2c3e50]">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2c3e50]">Office</h3>
                    <p className="text-gray-500 text-sm">Come say hello at our office HQ.</p>
                    <p className="text-[#2c3e50] font-medium mt-1">
                      Nangloi, New Delhi, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full text-[#2c3e50]">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2c3e50]">Phone</h3>
                    <p className="text-gray-500 text-sm">Mon - Sat (10 AM - 6 PM IST)</p>
                    <p className="text-[#2c3e50] font-medium mt-1">
                      +91 9667175620
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h2 className="text-xl font-serif text-[#2c3e50] mb-4">Follow Us</h2>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/yelosoulstore_?igsh=ZW1rMDQ4MjQzMXFs" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-full text-pink-500 hover:bg-pink-50 transition-colors">
                  <FaInstagram size={20} />
                </a>
                <a href="https://linkedin.com/company/yelosoul" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-full text-blue-600 hover:bg-blue-50 transition-colors">
                  <FaLinkedin size={20} />
                </a>
                <a href="https://wa.me/919667175620?text=Hi%20YeloSoul%20Team" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-full text-green-500 hover:bg-green-50 transition-colors">
                  <FaWhatsapp size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100">
            <h2 className="text-xl md:text-2xl font-serif text-[#2c3e50] mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all" placeholder="Jane" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all" placeholder="jane@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all resize-none" placeholder="Tell us how we can help..."></textarea>
              </div>

              <button type="submit" className="w-full bg-[#2c3e50] text-white py-4 rounded-xl hover:bg-[#1a252f] transition-all shadow-md font-medium">
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Brand Story Section - Simplified and Integrated */}
        <div className="mt-20 pt-16 border-t border-gray-200">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif text-[#2c3e50] mb-6">About YeloSoul</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              YeloSoul isn’t just jewelry it’s <strong className="text-[#2c3e50]">timeless elegance</strong> crafted sustainably. Every piece is designed to empower you while respecting the planet. We believe in eco-friendly craftsmanship and sourcing responsibly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-12">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                <h3 className="font-serif text-lg text-[#2c3e50] mb-2">Nitesh Sharma</h3>
                <p className="text-xs text-blue-500 font-medium uppercase tracking-wider mb-2">CEO & Founder</p>
                <p className="text-gray-500 text-sm italic">“Jewelry should make you shine, not just sparkle.”</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                <h3 className="font-serif text-lg text-[#2c3e50] mb-2">Raman Sharma</h3>
                <p className="text-xs text-blue-500 font-medium uppercase tracking-wider mb-2">Operations</p>
                <p className="text-gray-500 text-sm italic">“Great service is as important as great jewelry.”</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
