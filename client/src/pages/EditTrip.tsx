import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../data/api";
import Navbar from "../components/layout/Navbar";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Snackbar, // Import Snackbar
  Alert, // Import Alert
} from "@mui/material";

interface Trip {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paymentType: "cash" | "card";
  payerId: string;
  participants: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Friend {
  id: string;
  name: string;
}

const EditTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripName, setTripName] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tripUsers, setTripUsers] = useState<User[]>([]); // Renamed from friends
  const [allFriends, setAllFriends] = useState<User[]>([]); // All friends
  const [selectedFriend, setSelectedFriend] = useState("");
  const [newExpense, setNewExpense] = useState<Omit<Expense, "id">>({
    description: "",
    amount: 0,
    paymentType: "cash",
    payerId: "",
    participants: [],
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success"); // Snackbar severity

  // Derive availableFriends from allFriends and tripUsers
  const availableFriends = allFriends.filter(
    (friend: User) => !tripUsers.find((f) => f.id === friend.id)
  );

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const tripResponse = await api.get(`/trips/${id}`);
        setTrip(tripResponse.data);
        setTripName(tripResponse.data.name);
      } catch (error) {
        console.error("Failed to fetch trip details:", error);
        showSnackbar("Failed to fetch trip details", "error");
      }
    };

    const fetchExpenses = async () => {
      try {
        const expensesResponse = await api.get(`/trips/${id}/expenses`);
        setExpenses(expensesResponse.data);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
        showSnackbar("Failed to fetch expenses", "error");
      }
    };

    const fetchUsers = async () => {
      try {
        const usersResponse = await api.get(`/trips/${id}/users`);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        showSnackbar("Failed to fetch users", "error");
      }
    };

    const fetchTripUsers = async () => {
      try {
        const usersResponse = await api.get(`/trips/${id}/users`); // Changed endpoint
        setTripUsers(usersResponse.data); // Renamed state
      } catch (error) {
        console.error("Failed to fetch trip users:", error);
        showSnackbar("Failed to fetch trip users", "error");
      }
    };

    const fetchAllFriends = async () => {
      try {
        const allFriendsResponse = await api.get("/auth/users"); // Changed endpoint
        setAllFriends(allFriendsResponse.data); // Fetch all users instead of friends
      } catch (error) {
        console.error("Failed to fetch all friends:", error);
        showSnackbar("Failed to fetch all friends", "error");
      }
    };

    fetchTripDetails();
    fetchExpenses();
    fetchUsers();
    fetchTripUsers();
    fetchAllFriends();
  }, [id]);

  const handleApiCall = async (apiCall: () => Promise<any>, successMessage: string) => {
    try {
      await apiCall();
      showSnackbar(successMessage, "success");
    } catch (error: any) {
      console.error("API call failed:", error);
      showSnackbar(error.message || "API call failed", "error");
    }
  };

  const handleUpdateTrip = () => {
    handleApiCall(
      async () => {
        await api.put(`/trips/${id}`, { name: tripName });
        navigate("/trips");
      },
      "Trip updated successfully"
    );
  };

  const handleDeleteTrip = () => {
    handleApiCall(
      async () => {
        await api.delete(`/trips/${id}`);
        navigate("/trips");
      },
      "Trip deleted successfully"
    );
  };

  const handleCreateExpense = () => {
    handleApiCall(
      async () => {
        const response = await api.post(`/trips/${id}/expenses`, newExpense);
        setExpenses([...expenses, response.data]);
        setNewExpense({
          description: "",
          amount: 0,
          paymentType: "cash",
          payerId: "",
          participants: [],
        });
      },
      "Expense created successfully"
    );
  };

  const handleAddFriendToTrip = async () => {
    if (!selectedFriend) return;
    try {
      await api.post(`/trips/${id}/users`, { userId: selectedFriend });
      setTripUsers([...tripUsers, allFriends.find((f) => f.id === selectedFriend)!]);
      setSelectedFriend("");
      showSnackbar("Friend added to trip successfully", "success");
    } catch (error) {
      console.error("Failed to add friend to trip:", error);
      showSnackbar("Failed to add friend to trip", "error");
    }
  };

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    
      <><div className="p-6 bg-gray-50 min-h-screen">
      <Navbar />



      <Typography variant="h4" component="h2" className="mb-8">
        Edit Trip: {trip.name}
      </Typography>



      <label htmlFor="tripName" className="block text-gray-700 text-sm font-bold mb-2">
        Trip Name:
      </label>
      <TextField
        type="text"
        id="tripName"
        value={tripName}
        onChange={(e) => setTripName(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />


      <Box display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={handleUpdateTrip}>
          Update Trip
        </Button>
        <Button variant="contained" color="error" onClick={handleDeleteTrip}>
          Delete Trip
        </Button>
      </Box>




      <Typography variant="h5" component="h3" className="mb-4" style={{ color: "green" }}>
        Friends
      </Typography>
      <List>
        {tripUsers.map((friend) => (
          <ListItem key={friend.id}>
            <ListItemText primary={friend.name} />
          </ListItem>
        ))}
      </List>



      <Typography variant="h6" component="h4" className="mb-2">
        Add Existing Friend
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <FormControl variant="outlined" className="w-full">
          <InputLabel id="add-friend-label">Select Friend</InputLabel>
          <Select
            labelId="add-friend-label"
            id="add-friend"
            value={selectedFriend}
            onChange={(e) => setSelectedFriend(e.target.value)}
            label="Select Friend"
          >
            {availableFriends.map((friend) => (
              <MenuItem key={friend.id} value={friend.id}>
                {friend.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddFriendToTrip}
        >
          Add Friend to Trip
        </Button>
      </Box>



      <Typography variant="h5" component="h3" className="mb-4" style={{ color: "blue" }}>
        Expenses
      </Typography>
      <List>
        {expenses.map((expense) => (
          <ListItem key={expense.id}>
            <ListItemText primary={`${expense.description} - ${expense.amount}`} />
          </ListItem>
        ))}
      </List>



      <Typography variant="h6" component="h4" className="mb-2">
        Add Expense
      </Typography>


      <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
        Description:
      </label>
      <TextField
        type="text"
        id="description"
        value={newExpense.description}
        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />


      <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
        Amount:
      </label>
      <TextField
        type="number"
        id="amount"
        value={newExpense.amount}
        onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />


      <label htmlFor="paymentType" className="block text-gray-700 text-sm font-bold mb-2">
        Payment Type:
      </label>
      <Select
        id="paymentType"
        value={newExpense.paymentType}
        onChange={(e) => setNewExpense({ ...newExpense, paymentType: e.target.value as "cash" | "card" })}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <MenuItem value="cash">Cash</MenuItem>
        <MenuItem value="card">Card</MenuItem>
      </Select>


      <label htmlFor="payerId" className="block text-gray-700 text-sm font-bold mb-2">
        Payer:
      </label>
      <Select
        id="payerId"
        value={newExpense.payerId}
        onChange={(e) => setNewExpense({ ...newExpense, payerId: e.target.value })}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />


      <label className="block text-gray-700 text-sm font-bold mb-2">Participants:</label>
      <div>
        {users.map((user) => (



          <span>{user.name}</span>



        ))}
      </div>


      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateExpense}
      >
        Add Expense
      </Button>






    </div><Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar></>
    
  );
};

export default EditTrip;