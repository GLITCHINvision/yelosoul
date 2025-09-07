import { useEffect, useState } from "react";
import StatsCounter from "../components/StatsCounter";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminStatsPage() {
  const [orders, setOrders] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(savedOrders);
    };

    fetchOrders();
    //  Refresh every 5 seconds for real-time dashboard (optional)
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  //  Chart Data: Orders per day
  const orderDates = orders.map((order) => order.date.split(",")[0]);
  const uniqueDates = [...new Set(orderDates)];
  const ordersPerDay = uniqueDates.map(
    (date) => orderDates.filter((d) => d === date).length
  );

  const data = {
    labels: uniqueDates,
    datasets: [
      {
        label: "Orders Per Day",
        data: ordersPerDay,
        backgroundColor: "#4a8577",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#4a8577",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  const recentOrders = showAll ? orders : orders.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#4a8577] mb-6">🛠 Admin Dashboard</h1>

      {/*  Real-time Counters */}
      <StatsCounter />

      {/*  Orders Chart */}
      <div className="mt-10 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-[#4a8577] mb-4">📊 Orders Overview</h2>
        {orders.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <p className="text-gray-500">No orders yet.</p>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="mt-10 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-[#4a8577] mb-4">📦 Recent Orders</h2>
        {orders.length > 0 ? (
          <>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border border-gray-200 px-4 py-2">#</th>
                  <th className="border border-gray-200 px-4 py-2">Product</th>
                  <th className="border border-gray-200 px-4 py-2">Total</th>
                  <th className="border border-gray-200 px-4 py-2">Date</th>
                  <th className="border border-gray-200 px-4 py-2">Address</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.items.map((item) => item.name).join(", ")}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      ₹{order.total}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.date}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-4 bg-[#4a8577] text-white px-4 py-2 rounded hover:opacity-90"
              >
                {showAll ? "Show Less" : "View More"}
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-500">No orders placed yet.</p>
        )}
      </div>
    </div>
  );
}




