import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();

  const actions = [
    { label: "Trips", path: "/trips" },
    { label: "Status", path: "/status" },
    { label: "Notifications", path: "/notifications" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="page-container bg-gradient-to-br from-green-100 to-blue-100">
        <h2 className="text-title text-center mt-8">Dashboard</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="btn-primary"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;