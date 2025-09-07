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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      await axios.post("http://localhost:5000/api/send-return", formData);
      setStatus(" Request sent successfully! We'll contact you soon.");
      setFormData({ name: "", email: "", orderId: "", reason: "" });
    } catch (error) {
      setStatus(" Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900">
        Start Return Request
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded text-sm"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded text-sm"
          required
        />
        <input
          type="text"
          name="orderId"
          placeholder="Order ID"
          value={formData.orderId}
          onChange={handleChange}
          className="w-full border p-2 rounded text-sm"
          required
        />
        <textarea
          name="reason"
          placeholder="Reason for Return"
          value={formData.reason}
          onChange={handleChange}
          className="w-full border p-2 rounded text-sm"
          rows="3"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm"
        >
          Submit Request
        </button>
      </form>
      {status && <p className="text-sm mt-3">{status}</p>}
    </div>
  );
}


