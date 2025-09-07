import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users", {
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
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-primary mb-6">Signup</h1>
      <form
        onSubmit={handleSignup}
        className="bg-white shadow rounded p-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
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
          className="w-full bg-primary text-white py-2 rounded hover:opacity-90"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
