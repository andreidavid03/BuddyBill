import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../data/api"; // folosește instanța corectă

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      // Salvează tokenul primit
      localStorage.setItem("token", res.data.token);

      // Redirecționează spre dashboard
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        alert("Invalid password");
      } else if (err.response && err.response.status === 400) {
        alert("User not found");
      } else {
        alert("Login failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
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
      <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
        Login
      </button>
    </form>
  );
};

export default Login;
