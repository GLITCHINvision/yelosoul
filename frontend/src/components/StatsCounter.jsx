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
        const latest = allOrders[0];
        setRecentOrder(latest);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 2000); // updates every 2s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-start text-xs text-[#4a8577]">
      {/*  Orders & Visits Counter */}
      <div
        onClick={() => navigate("/admin-stats")}
        className="bg-[#fef3e6] px-3 py-1 rounded cursor-pointer hover:bg-[#fde8d6] transition"
      >
        <strong>📊 {orders}</strong> Orders | <strong>👀 {visitors}</strong> Visits
      </div>

      {/*  Recent Customer Activity Ticker */}
      {recentOrder && (
        <div className="mt-1 text-[#4a8577] animate-pulse">
          🛍 <strong>{recentOrder.items?.[0]?.name || "A customer"}</strong> just
          ordered for ₹{recentOrder.total}!
        </div>
      )}
    </div>
  );
}


