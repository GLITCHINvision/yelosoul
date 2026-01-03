import { FaTruck, FaPlane, FaBoxOpen, FaQuestionCircle } from "react-icons/fa";

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-[#fcfbf8] py-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-serif text-[#2c3e50] mb-6">
            Shipping Information
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            We proudly deliver across <strong>India</strong> and select <strong>international locations</strong>, ensuring your YeloSoul jewelry reaches you safely and on time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Domestic Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-xl">
              <FaTruck />
            </div>
            <h2 className="text-xl font-serif text-[#2c3e50] mb-3">Domestic Shipping (India)</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Standard Shipping: <strong>₹50</strong> <span className="block text-xs text-green-600 font-medium bg-green-50 w-fit px-2 py-0.5 rounded-full mt-1">Free for orders above ₹999</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Estimated Delivery: 5-7 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 font-bold">•</span>
                <span>Processed within 24-48 hours</span>
              </li>
            </ul>
          </div>

          {/* International Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 text-xl">
              <FaPlane />
            </div>
            <h2 className="text-xl font-serif text-[#2c3e50] mb-3">International Shipping</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Rates calculated at checkout based on location</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Estimated Delivery: 10-14 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 font-bold">•</span>
                <span>Customs duties are buyer's responsibility</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tracking & Support */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-start gap-4">
            <div className="flex-shrink-0 mt-1 text-gray-400">
              <FaBoxOpen size={24} />
            </div>
            <div>
              <h3 className="font-medium text-[#2c3e50] mb-1">Order Tracking</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Once your order is shipped, you will receive a tracking link via <strong>email</strong> and <strong>SMS</strong>. You can also track it anytime from the <strong>“My Orders”</strong> section.
              </p>
            </div>
          </div>

          <div className="bg-[#2c3e50] text-white p-6 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-full">
                <FaQuestionCircle size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-1">Need help with shipping?</h3>
                <p className="text-sm text-gray-300">Our team responds within 24 hours.</p>
              </div>
            </div>
            <a href="mailto:support@yelosoul.com" className="bg-white text-[#2c3e50] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
              Email Us
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
