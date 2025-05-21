import Navbar from "../components/layout/Navbar";

const Profile = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="page-container">
        <h1 className="text-2xl font-bold text-center">Your Profile</h1>
        <p className="mt-2 text-gray-600">More details will be added soon.</p>
      </div>
    </div>
  );
};

export default Profile;