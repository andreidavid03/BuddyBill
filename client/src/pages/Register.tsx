import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../data/api"; // ✅ instanța corectă

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { email, password });
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert("Register failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 mb-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />
      <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">
        Register
      </button>
    </form>
  );
};

export default Register;
