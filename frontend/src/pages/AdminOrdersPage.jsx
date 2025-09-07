import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
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
    const interval = setInterval(fetchOrders, 30000);
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

      alert(" Order status updated successfully!");
    } catch (err) {
      console.error("Error updating status", err);
      alert(" Failed to update order status");
    }
  };

  const filteredOrders = orders.filter((order) =>
    filter === "all" ? true : order.status?.toLowerCase() === filter.toLowerCase()
  );

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Admin Orders Panel</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchOrders}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Refresh ({orders.length})
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          {filter === "all" ? "No orders yet." : `No ${filter} orders.`}
        </p>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Customer: {order.user?.name || "Unknown"} (
                    {order.user?.email || "No Email"})
                  </p>
                </div>
                <div className="min-w-[150px]">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border rounded px-3 py-2 w-full text-sm font-medium"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Items:</h4>
                <div className="space-y-1 ml-2">
                  {Array.isArray(order.orderItems) ? (
                    order.orderItems.map((item, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-700 flex justify-between"
                      >
                        <span>
                          {item.name || "Product"} × {item.qty}
                        </span>
                        <span>₹{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No items</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Shipping Address:</p>
                    <p className="text-gray-600">
                      {order.shippingAddress?.address || "No Address"}
                    </p>
                  </div>
                  <div className="md:text-right">
                    <p className="text-lg font-bold text-primary">
                      Total: ₹{Number(order.totalPrice).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

