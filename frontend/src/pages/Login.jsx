import { useState } from "react";
import { API_URL } from "../config";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || " Login failed");
        setLoading(false);
        return;
      }

      //  Validate token
      if (!data.token) {
        alert(" No token received from server. Check backend login API.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data));

      if (data.isAdmin) {
        navigate("/admin-orders");
      } else {
        navigate("/my-orders");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#fcfbf8] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[#2c3e50]/5"></div>
        <div className="relative z-10 text-center p-12">
          <h1 className="text-5xl font-serif text-[#2c3e50] mb-4">YeloSoul</h1>
          <p className="text-xl text-gray-500 font-light tracking-widest text-[#2c3e50]/70 uppercase">Curated Minimalism</p>
        </div>
        {/* Decorative background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full opacity-50 blur-3xl pointer-events-none"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-[#2c3e50] mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to continue to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#2c3e50] hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#2c3e50] text-white py-4 rounded-xl hover:bg-[#1a252f] transition-all duration-300 shadow-lg hover:shadow-xl font-medium tracking-wide ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#2c3e50] font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
