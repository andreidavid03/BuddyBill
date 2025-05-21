import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-200 to-green-200">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-8">BuddyBill</h1>
      <div className="flex gap-6">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Welcome;