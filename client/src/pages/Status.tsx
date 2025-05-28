import { useState, useEffect } from "react";
import api from "../data/api";
import Navbar from "../components/layout/Navbar";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Paper,
} from "@mui/material";

interface User {
  id: string;
  name?: string;
  email: string;
}

interface PaymentRecord {
  id: string;
  amount: number;
  payerId: string;
  receiverId: string;
  tripId: string;
  createdAt: string;
  payer?: User;
  receiver?: User;
  trip?: { name: string };
}

interface TripBalance {
  tripId: string;
  tripName: string;
  totalAmount: number;
  yourDebt: number;
  yourCredit: number;
  balance: number;
}

interface StatusData {
  totalDue: number;
  totalOwed: number;
  balance: number;
  tripBalances: TripBalance[];
  paymentsMade: PaymentRecord[];
  paymentsReceived: PaymentRecord[];
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
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-col justify-center items-center flex-grow">
          <Typography variant="h5" color="text.secondary">
            Loading status...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="page-container">
        <Typography variant="h4" align="center" gutterBottom sx={{ color: "#fff" }}>
          Your Current Financial Status
        </Typography>

        {/* Balanța generală */}
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Overall Balance
          </Typography>
          <Typography
            variant="h4"
            color={status.balance >= 0 ? "success.main" : "error.main"}
          >
            {status.balance >= 0 ? "You are owed" : "You owe"}: $
            {Math.abs(status.balance).toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* 🔥 Balanțe pe Tripuri */}
        <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>
          Trip Balances
        </Typography>
        {status.tripBalances.length === 0 ? (
          <Typography color="text.secondary">No trip balances found.</Typography>
        ) : (
          status.tripBalances.map((trip) => (
            <Paper key={trip.tripId} sx={{ p: 2, mb: 2, bgcolor: "rgba(255,255,255,0.05)" }}>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                {trip.tripName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Trip Amount: ${trip.totalAmount.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You Owe: ${trip.yourDebt.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You Are Owed: ${trip.yourCredit.toFixed(2)}
              </Typography>
              <Typography
                variant="body2"
                color={trip.balance >= 0 ? "success.main" : "error.main"}
              >
                Balance: {trip.balance >= 0 ? "+" : "-"}${Math.abs(trip.balance).toFixed(2)}
              </Typography>
            </Paper>
          ))
        )}

        <Divider sx={{ my: 4 }} />

        {/* 🔥 Plăți efectuate */}
        {status.paymentsMade.length > 0 && (
          <Box mt={4}>
            <Typography variant="h5" sx={{ color: "#fff" }}>
              Payments You Made
            </Typography>
            <List>
              {status.paymentsMade.map((payment) => (
                <ListItem key={payment.id} divider>
                  <ListItemText
                    primary={`You paid ${payment.receiver?.name || payment.receiver?.email} $${payment.amount.toFixed(2)}`}
                    secondary={`Trip: ${payment.trip?.name} on ${new Date(
                      payment.createdAt
                    ).toLocaleDateString()}`}
                    primaryTypographyProps={{ color: "#fff" }}
                    secondaryTypographyProps={{ color: "rgba(255,255,255,0.6)" }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* 🔥 Plăți primite */}
        {status.paymentsReceived.length > 0 && (
          <Box mt={4}>
            <Typography variant="h5" sx={{ color: "#fff" }}>
              Payments You Received
            </Typography>
            <List>
              {status.paymentsReceived.map((payment) => (
                <ListItem key={payment.id} divider>
                  <ListItemText
                    primary={`${payment.payer?.name || payment.payer?.email} paid you $${payment.amount.toFixed(2)}`}
                    secondary={`Trip: ${payment.trip?.name} on ${new Date(
                      payment.createdAt
                    ).toLocaleDateString()}`}
                    primaryTypographyProps={{ color: "#fff" }}
                    secondaryTypographyProps={{ color: "rgba(255,255,255,0.6)" }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </div>
    </div>
  );
};

export default Status;
