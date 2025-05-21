import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/"); // Redirect to welcome page
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="font-bold text-xl">BuddyBill</h1>
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/trip" className="hover:underline">Trip</Link>
        <Link to="/status" className="hover:underline">Status</Link>
        <Link to="/notifications" className="hover:underline">Notifications</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;