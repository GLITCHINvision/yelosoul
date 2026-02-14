import { useEffect, useState } from "react";
import { API_URL } from "../config";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        `${API_URL}/orders/my-orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Something went wrong. Please refresh or try again later.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Processing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfbf8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2c3e50]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-[#2c3e50] mb-1">My Orders</h1>
            <p className="text-gray-500 text-xs md:text-sm">Track and manage your purchases</p>
          </div>
          <button onClick={fetchOrders} className="text-sm text-[#2c3e50] underline hover:text-black">Refresh</button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 text-sm">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-serif text-[#2c3e50] mb-2">No orders here yet</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              You haven't placed any orders yet. Start exploring our collections.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#2c3e50] text-white px-8 py-3 rounded-xl hover:bg-[#1a252f] transition-all shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">

                {/* Header */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b border-gray-50 pb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-[#2c3e50]">Order #{order._id.slice(-8)}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Ordered on {new Date(order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-medium text-[#2c3e50]">₹{order.totalPrice?.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">Total Amount</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          {/* Placeholder if no image in order item schema, or use generic icon */}
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">💎</div>
                        </div>
                        <div>
                          <p className="font-medium text-[#2c3e50] text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                        </div>
                      </div>
                      <span className="font-medium text-[#2c3e50] text-sm">₹{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Info */}
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row justify-between text-sm gap-4">
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Shipping To</span>
                    <p className="text-gray-700 font-medium">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
