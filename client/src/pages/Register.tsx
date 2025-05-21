import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../data/api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", { email, password });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="page-container">
        <h2 className="text-title text-center">Register</h2>
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto" autoComplete="off">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 mb-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full border p-2 mb-4 rounded"
            required
          />
          <button type="submit" className="btn-primary">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;