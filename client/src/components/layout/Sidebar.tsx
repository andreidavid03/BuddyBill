import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow p-4 space-y-4">
      <Link to="/" className="block text-blue-600">Home</Link>
      <Link to="/notifications" className="block text-blue-600">Notifications</Link>
      <Link to="/profile" className="block text-blue-600">Profile</Link>
    </div>
  );
};

export default Sidebar;
