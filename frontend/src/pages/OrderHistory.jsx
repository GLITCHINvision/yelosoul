import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setOrders([]); //  Ensure empty array if no token
        setLoading(false);
        return;
      }

      const { data } = await axios.get("http://localhost:5000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(Array.isArray(data) ? data : []); // Always array
    } catch (error) {
      console.error("Error fetching orders", error);
      setOrders([]); //  fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "text-green-600";
      case "Shipped": return "text-blue-500";
      case "Processing": return "text-yellow-600";
      case "Cancelled": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Order History</h1>
        <button
          onClick={fetchOrders}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No past orders found.</p>
          <button
            onClick={() => (window.location.href = "/products")}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.orderItems?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.qty}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    ₹{order.totalPrice?.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Shipping Address:</span>
                  <p className="mt-1 pl-4">
                    {order.shippingAddress?.address},{" "}
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.postalCode},{" "}
                    {order.shippingAddress?.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

