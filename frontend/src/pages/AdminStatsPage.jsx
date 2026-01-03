import { useEffect, useState } from "react";
import StatsCounter from "../components/StatsCounter";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { TrendingUp, Users, ShoppingBag, CreditCard } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AdminStatsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from API/LocalStorage for demo
  // In a real app, you might want an endpoint specifically for stats like /api/admin/stats
  // For now we simulate using the local storage mock or fetching from the same source as OrdersPage if we wanted to be rigorous.
  // Assuming we use localStorage 'orders' purely as a fallback or demo, since AdminOrdersPage uses API.
  // LET'S UPGRADE THIS TO USE THE API DATA IF POSSIBLE OR Fallback to localStorage for now if complexity is high.
  // Given previous file used localStorage, I'll stick to a mixed approach or better yet, verify if we can fetch real orders.

  // NOTE: AdminOrdersPage fetches from /api/orders. Let's do the same here to be accurate.
  const fetchOrders = async () => {
    // Basic mock logic or fetch logic. 
    // Since `AdminOrdersPage` works with API, let's try to fetch real data for accurate stats.
    try {
      const token = localStorage.getItem("token");
      // We'll try to fetch, if it fails we might have 0 stats, which is fine.
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        const saved = JSON.parse(localStorage.getItem("orders")) || [];
        setOrders(saved);
      }
    } catch (e) {
      const saved = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(saved);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Process Data
  const orderDates = orders.map((order) => new Date(order.createdAt).toLocaleDateString("en-IN"));
  const uniqueDates = [...new Set(orderDates)].slice(-7); // Last 7 active days
  const ordersPerDay = uniqueDates.map(
    (date) => orderDates.filter((d) => d === date).length
  );

  const totalRevenue = orders.reduce((acc, order) => acc + (Number(order.totalPrice) || 0), 0);
  const totalOrders = orders.length;
  // Estimate customers (unique users)
  const uniqueCustomers = new Set(orders.map(o => o.user?._id || o.user)).size;

  const chartData = {
    labels: uniqueDates.length > 0 ? uniqueDates : ["No Data"],
    datasets: [
      {
        label: "Orders",
        data: ordersPerDay.length > 0 ? ordersPerDay : [0],
        backgroundColor: "rgba(44, 62, 80, 0.8)",
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#2c3e50",
        padding: 12,
        titleFont: { family: 'serif', size: 14 },
        bodyFont: { family: 'sans-serif', size: 12 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { stepSize: 1, font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      }
    },
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-serif text-[#2c3e50]">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon size={24} className="opacity-80" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfbf8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif text-[#2c3e50] mb-2">Analytics Dashboard</h1>
        <p className="text-gray-500 mb-8">Overview of your store's performance.</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            icon={CreditCard}
            color="bg-green-100 text-green-700"
          />
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={ShoppingBag}
            color="bg-blue-100 text-blue-700"
          />
          <StatCard
            title="Active Customers"
            value={uniqueCustomers}
            icon={Users}
            color="bg-purple-100 text-purple-700"
          />
          <StatCard
            title="Avg. Order Value"
            value={`₹${totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0}`}
            icon={TrendingUp}
            color="bg-yellow-100 text-yellow-700"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-serif text-[#2c3e50] mb-6">Order Trends (Last 7 Days)</h2>
            <div className="h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Recent Activity / Mini List */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-serif text-[#2c3e50] mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    {order.user?.name?.[0] || "G"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2c3e50] truncate">
                      {order.user?.name || "Guest"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    +₹{order.totalPrice}
                  </span>
                </div>
              ))}
              {orders.length === 0 && <p className="text-sm text-gray-400 text-center">No recent activity.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
