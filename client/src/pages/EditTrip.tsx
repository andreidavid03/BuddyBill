import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import Navbar from "../components/layout/Navbar";
import api from "../data/api";
import AddExpenseModal from "../components/expenses/AddExpenseModal";
import AddFriendModal from "../components/trips/AddFriendModal";

interface User {
  id: string;
  name?: string;
  email: string;
}

interface ExpenseParticipant {
  id: string;
  userId: string;
  amount: number;
  user: User;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  payerId: string;
  user: User;
  participants: ExpenseParticipant[];
}

interface Trip {
  id: string;
  name: string;
  users?: User[];
}

interface Balance {
  userId: string;
  amount: number;
}

interface SuggestedTransaction {
  from: string;
  to: string;
  amount: number;
}

const EditTrip = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [suggestedTransactions, setSuggestedTransactions] = useState<SuggestedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const fetchTripDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/trips/${id}`);
      setTrip(response.data);
    } catch (err) {
      console.error("Failed to fetch trip details:", err);
      setError("Failed to load trip details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchExpenses = useCallback(async () => {
    if (!id) return;
    try {
      const response = await api.get(`/trips/${id}/expenses`);
      setExpenses(response.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  }, [id]);

  const fetchBalancesAndSuggestedTransactions = useCallback(async () => {
    if (!id) return;
    try {
      const response = await api.get(`/balances/${id}`);
      setBalances(response.data.tripBalances || []);
      setSuggestedTransactions(response.data.suggestedTransactions || []);
    } catch (err) {
      console.error("Failed to fetch balances or suggested transactions:", err);
    }
  }, [id]);

  const handleMarkAsPaid = async (fromUserId: string, toUserId: string, amount: number) => {
    if (!id) return;
    try {
      await api.post("/payments/settle", { fromUserId, toUserId, amount, tripId: id });
      setSnackbar({
        open: true,
        message: "Payment marked as settled!",
        severity: "success",
      });
      fetchExpenses();
      fetchBalancesAndSuggestedTransactions();
    } catch (error) {
      console.error("Failed to mark as paid:", error);
      setSnackbar({
        open: true,
        message: "Failed to mark payment as settled.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchTripDetails();
    fetchExpenses();
    fetchBalancesAndSuggestedTransactions();
  }, [fetchTripDetails, fetchExpenses, fetchBalancesAndSuggestedTransactions]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <CircularProgress color="inherit" />
        <Typography sx={{ mt: 2, color: "white" }}>Loading trip details...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchTripDetails} sx={{ mt: 2 }} variant="contained" color="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <Navbar />
      <Box className="flex-grow flex flex-col items-center justify-center p-4">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            width: "100%",
            maxWidth: 700,
            mx: "auto",
            color: "white",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ color: "white" }}>
            {trip?.name}
          </Typography>

          <Box sx={{ my: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
              Trip Members
            </Typography>
            <List>
              {trip?.users?.length === 0 ? (
                <ListItem><ListItemText primary="No members yet." sx={{ color: "white" }} /></ListItem>
              ) : (
                trip?.users?.map((user) => (
                  <ListItem key={user.id}>
                    <ListItemText
                      primary={user.name}
                      secondary={user.email}
                      sx={{
                        "& .MuiListItemText-primary": { color: "white" },
                        "& .MuiListItemText-secondary": { color: "rgba(255,255,255,0.7)" }, // Email mai estompat
                      }}
                    />
                  </ListItem>
                ))
              )}
            </List>
            <Button variant="contained" color="primary" onClick={() => setAddFriendModalOpen(true)} sx={{ mt: 2 }}>
              Add Friend
            </Button>
          </Box>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box sx={{ my: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
              Expenses
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => setAddExpenseModalOpen(true)}
              sx={{ mb: 2 }}
              disabled={trip?.users?.length === 0}
            >
              Add Expense
            </Button>
            {expenses.length === 0 ? (
              <Typography sx={{ color: "white" }}>No expenses yet.</Typography>
            ) : (
              <List>
                {expenses.map((expense) => (
                  <ListItem key={expense.id} divider>
                    <ListItemText
                      primary={
                        <span style={{ color: "white", fontWeight: "bold" }}>
                          {expense.description}: ${expense.amount} by{" "}
                          {expense.user.name || expense.user.email}
                        </span>
                      }
                      secondary={
                        <span style={{ color: "rgba(255,255,255,0.8)" }}>
                          Participants:{" "}
                          {expense.participants
                            .map((p) => p.user.name || p.user.email)
                            .join(", ")}
                          {" | "}
                          Each: $
                          {(expense.amount / expense.participants.length).toFixed(2)}
                        </span>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

          {balances.length > 0 && (
            <Box sx={{ my: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
                Current Balances
              </Typography>
              <List>
                {balances.map((balance) => {
                  const userName = trip?.users?.find((u) => u.id === balance.userId)?.name || "Unknown";
                  return (
                    <ListItem key={balance.userId}>
                      <ListItemText
                        primary={`${userName}: ${balance.amount >= 0 ? "Owes" : "Is Owed"} $${Math.abs(balance.amount).toFixed(2)}`}
                        sx={{ color: "white" }}
                        secondaryTypographyProps={{ sx: { color: "white" } }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          )}

          {suggestedTransactions.length > 0 && (
            <>
              <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />
              <Box sx={{ my: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
                  Suggested Settlements
                </Typography>
                <List>
                  {suggestedTransactions.map((t, i) => {
                    const fromUser = trip?.users?.find(u => u.id === t.from);
                    const toUser = trip?.users?.find(u => u.id === t.to);
                    return (
                      <ListItem key={i} divider>
                        <ListItemText
                          primary={`${fromUser?.name || "Unknown"} pays ${toUser?.name || "Unknown"} $${t.amount}`}
                          sx={{ color: "white" }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleMarkAsPaid(t.from, t.to, t.amount)}
                        >
                          Mark as Paid
                        </Button>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </>
          )}
        </Paper>
      </Box>

      <AddExpenseModal
        open={addExpenseModalOpen}
        onClose={() => setAddExpenseModalOpen(false)}
        tripId={id!}
        usersInTrip={trip?.users || []}
      />
      <AddFriendModal
        open={addFriendModalOpen}
        onClose={() => setAddFriendModalOpen(false)}
        tripId={id!}
        onFriendAdded={fetchTripDetails}
        usersInTrip={trip?.users || []}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default EditTrip;
