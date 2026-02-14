import { useState } from "react";
import { API_URL } from "../config";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || " Signup failed");
        setLoading(false);
        return;
      }

      //  Save token & user details
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data));

      alert(" Signup Successful!");
      navigate("/");
    } catch (err) {
      console.error("Signup Error:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2c3e50] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[#000000]/20"></div>
        <div className="relative z-10 text-center p-12 text-white">
          <h1 className="text-5xl font-serif mb-4">Join YeloSoul</h1>
          <p className="text-xl font-light tracking-widest opacity-80 uppercase">Experience Modern Luxury</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-white rounded-full opacity-5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-400 rounded-full opacity-10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 bg-white">
        <div className="max-w-md w-full">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-serif text-[#2c3e50] mb-2">Create Account</h2>
            <p className="text-gray-500 text-sm">Sign up to start your journey</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="John Doe"
                required
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
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
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#2c3e50] font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
