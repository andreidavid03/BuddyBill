import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const actions = [
    { label: "Create Group", path: "/group/create" },
    { label: "My Groups", path: "/dashboard/groups" },
    { label: "Add Expense", path: "/dashboard/expense" },
    { label: "Transactions", path: "/dashboard/transactions" },
    { label: "Notifications", path: "/notifications" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="bg-white shadow-md rounded-lg p-6 text-xl hover:bg-blue-50 transition"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
