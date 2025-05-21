import { useState, useEffect } from "react";
import api from "../data/api";
import Navbar from "../components/layout/Navbar";

interface StatusData {
  totalDue: number;
  totalPaid: number;
  balance: number;
}

const Status = () => {
  const [status, setStatus] = useState<StatusData | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("/status");
        setStatus(response.data);
      } catch (error) {
        console.error("Failed to fetch status:", error);
      }
    };

    fetchStatus();
  }, []);

  if (!status) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="page-container">
        <h2 className="text-3xl font-bold text-center">Status</h2>
        <div>
          <p>Total Due: {status.totalDue}</p>
          <p>Total Paid: {status.totalPaid}</p>
          <p>Balance: {status.balance}</p>
        </div>
      </div>
    </div>
  );
};

export default Status;