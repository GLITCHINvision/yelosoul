import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StatsCounter() {
  const [orders, setOrders] = useState(0);
  const [visitors, setVisitors] = useState(0);
  const [recentOrder, setRecentOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateStats = () => {
      setOrders(parseInt(localStorage.getItem("totalOrders") || "0"));
      setVisitors(parseInt(localStorage.getItem("totalVisitors") || "0"));

      //  Get the latest order for live ticker
      const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      if (allOrders.length > 0) {
        setRecentOrder(allOrders[0]);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Polling every 5s is sufficient
    return () => clearInterval(interval);
  }, []);

  // Only show if there is data to show, to keep it minimal
  if (orders === 0 && visitors === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2">
      {/*  Admin Shortcut Pill */}
      <button
        onClick={() => navigate("/admin-stats")}
        className="bg-white/90 backdrop-blur shadow-lg border border-gray-100 px-4 py-2 rounded-full text-xs font-medium text-[#2c3e50] hover:scale-105 transition-transform flex items-center gap-3"
      >
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          {visitors} Visits
        </span>
        <span className="w-[1px] h-3 bg-gray-200"></span>
        <span>{orders} Orders</span>
      </button>

      {/*  Recent Sale Pop-up Notification */}
      {recentOrder && (
        <div className="animate-in slide-in-from-bottom-2 fade-in duration-700 bg-[#2c3e50] text-white px-4 py-3 rounded-xl shadow-xl max-w-xs text-xs">
          <p className="font-medium mb-1">🛍 Just Purchased!</p>
          <p className="opacity-90">
            Someone ordered <span className="font-semibold">{recentOrder.items?.[0]?.name || "Jewelry"}</span>
          </p>
        </div>
      )}
    </div>
  );
}
