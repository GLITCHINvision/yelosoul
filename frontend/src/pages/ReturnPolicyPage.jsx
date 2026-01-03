import { useState } from "react";
import axios from "axios";

export default function ReturnRequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    reason: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await axios.post("http://localhost:5000/api/send-return", formData);
      setStatus("success");
      setFormData({ name: "", email: "", orderId: "", reason: "" });
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf8] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif text-[#2c3e50] mb-4">Return Policy</h1>
          <p className="text-gray-500 leading-relaxed">
            We want you to love your YeloSoul purchase. If you're not completely satisfied, you can initiate a return request below within 7 days of delivery.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-serif text-[#2c3e50] mb-6">Start Return Request</h2>

          {status === "success" && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-100 text-sm">
              ✅ Request sent successfully! We'll contact you shortly.
            </div>
          )}
          {status === "error" && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 text-sm">
              ❌ Something went wrong. Please try again or contact support.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
                <input
                  type="text"
                  name="orderId"
                  placeholder="#123456"
                  value={formData.orderId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Return</label>
              <textarea
                name="reason"
                placeholder="Please tell us why you'd like to return this item..."
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all resize-none"
                rows="4"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2c3e50] text-white py-4 rounded-xl hover:bg-[#1a252f] transition-all shadow-md font-medium"
            >
              {loading ? "Sending Request..." : "Submit Return Request"}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Need help? Contact <a href="mailto:support@yelosoul.com" className="text-[#2c3e50] underline">support@yelosoul.com</a></p>
        </div>
      </div>
    </div>
  );
}
