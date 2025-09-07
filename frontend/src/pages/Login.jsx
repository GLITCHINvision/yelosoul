import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
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

      console.log(" Token Stored:", data.token);

      alert(" Login Successful!");

      
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
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-primary mb-6">Login</h1>
      <form
        onSubmit={handleLogin}
        className="bg-white shadow rounded p-6 space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-primary text-white py-2 rounded hover:opacity-90 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}


