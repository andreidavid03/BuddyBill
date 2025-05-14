import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to BuddyBill</h1>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-blue-500 text-white rounded"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-2 bg-green-500 text-white rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Welcome;
