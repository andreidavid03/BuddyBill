import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import api from "../../data/api";

interface AddFriendModalProps {
  open: boolean;
  onClose: () => void;
  tripId: string;
  onFriendAdded: () => void;
  usersInTrip: any[];
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({
  open,
  onClose,
  tripId,
  onFriendAdded,
  usersInTrip,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const handleCreateFriend = async () => {
    const friendExists = usersInTrip.some(user => user.email === email);
    if (friendExists) {
      setSnackbar({
        open: true,
        message: "This friend is already in the trip.",
        severity: "warning",
      });
      return;
    }

    try {
      const allUsersResponse = await api.get("/auth/users");
      const existingUser = allUsersResponse.data.find((user: any) => user.email === email);

      let friendToAddId = existingUser?.id;

      if (!existingUser) {
        try {
          const createFriendResponse = await api.post("/friends/request", { email, name, phone });
          friendToAddId = createFriendResponse.data.id;
          setSnackbar({
            open: true,
            message: "Friend request sent!",
            severity: "success",
          });
        } catch (error: any) {
          console.error("Failed to send friend request:", error);
          setSnackbar({
            open: true,
            message: error.response?.data?.message || "Failed to add friend.",
            severity: "error",
          });
          return;
        }
      }

      if (friendToAddId) {
        await api.post(`/trips/${tripId}/users`, { userId: friendToAddId });
        onFriendAdded();
        onClose();
        setSnackbar({
          open: true,
          message: "Friend added to trip successfully!",
          severity: "success",
        });
      }
    } catch (error: any) {
      console.error("Failed to add friend to trip:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to add friend to trip.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          color: "white",
        },
      }}
    >
      <DialogTitle>Add Friend to Trip</DialogTitle>
      <DialogContent>
        <Typography variant="body2" paragraph sx={{ color: "rgba(255,255,255,0.7)" }}>
          Enter the friend's details. If they are an existing user, they'll be added. Otherwise, a friend request will be sent.
        </Typography>
        <TextField
          margin="dense"
          label="Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ input: { color: "white" }, label: { color: "rgba(255,255,255,0.7)" } }}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ input: { color: "white" }, label: { color: "rgba(255,255,255,0.7)" } }}
        />
        <TextField
          margin="dense"
          label="Phone (Optional)"
          fullWidth
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{ input: { color: "white" }, label: { color: "rgba(255,255,255,0.7)" } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleCreateFriend} color="primary" variant="contained">Add Friend</Button>
      </DialogActions>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddFriendModal;
