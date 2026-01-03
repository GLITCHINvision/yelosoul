import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Loader, RefreshCw, Filter, Package, ChevronDown } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Refresh less frequently to avoid spamming
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" ? true : order.status?.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-[#2c3e50] mb-2">Order Management</h1>
          <p className="text-gray-500">Track and update customer orders.</p>
        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search ID or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-[#2c3e50] outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-8 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-[#2c3e50] outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <button
            onClick={fetchOrders}
            className="p-2 text-gray-500 hover:text-[#2c3e50] hover:bg-gray-50 rounded-full transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Content */}
        {loading && orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400 flex flex-col items-center">
            <Loader className="animate-spin mb-2" size={32} />
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <Package className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No orders found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6">

                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-serif text-lg text-[#2c3e50]">Order #{order._id.slice(-6).toUpperCase()}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Customer</p>
                          <p className="text-gray-600">{order.user?.name || "Guest"}</p>
                          <p className="text-gray-500 text-xs">{order.user?.email}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Shipping</p>
                          <p className="text-gray-600 line-clamp-2">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                        </div>
                      </div>
                    </div>

                    {/* Items & Total */}
                    <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                      <p className="font-semibold text-gray-700 mb-3">Items</p>
                      <div className="space-y-2 mb-4 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600 truncate flex-1 pr-4">{item.qty}x {item.name}</span>
                            <span className="font-medium text-gray-800">₹{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="font-serif font-bold text-[#2c3e50] text-lg">Total</span>
                        <span className="font-serif font-bold text-[#2c3e50] text-lg">₹{order.totalPrice}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-48 flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Update Status</label>
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none cursor-pointer hover:bg-white transition-colors"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                      </div>
                    </div>

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
