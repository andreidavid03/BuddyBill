import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="font-bold text-xl">BuddyBill</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/notifications" className="hover:underline">Notifications</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
