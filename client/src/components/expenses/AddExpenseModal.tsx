import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../../data/api";

interface User {
  id: string;
  name?: string;
  email: string;
}

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  tripId: string;
  usersInTrip: User[];
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  color: "white",
  maxHeight: "90vh",
  overflowY: "auto",
};

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  open,
  onClose,
  tripId,
  usersInTrip,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [payerId, setPayerId] = useState<string>("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (open) {
      setDescription("");
      setAmount("");
      setPayerId("");
      setSelectedParticipants([]);
      setSnackbar({ open: false, message: "", severity: "success" });
    }
  }, [open, tripId, usersInTrip]);

  const handleSubmit = async () => {
    if (!description || !amount || !payerId || selectedParticipants.length === 0) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields and select at least one participant.",
        severity: "error",
      });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setSnackbar({
        open: true,
        message: "Amount must be a positive number.",
        severity: "error",
      });
      return;
    }

    try {
      await api.post(`/trips/${tripId}/expenses`, {
        description,
        amount: parsedAmount,
        payerId,
        participants: selectedParticipants,
      });
      setSnackbar({
        open: true,
        message: "Expense added successfully!",
        severity: "success",
      });
      onClose();
    } catch (error: any) {
      console.error("Failed to add expense:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to add expense.",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-expense-modal-title"
      aria-describedby="add-expense-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Add New Expense
        </Typography>

        <TextField
          autoFocus
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            mb: 2,
            input: { color: "white" },
            label: { color: "rgba(255,255,255,0.7)" },
          }}
        />

        <TextField
          margin="dense"
          label="Amount"
          type="number"
          fullWidth
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputProps={{ step: "0.01" }}
          sx={{
            mb: 2,
            input: { color: "white" },
            label: { color: "rgba(255,255,255,0.7)" },
          }}
        />

        <FormControl fullWidth required sx={{ mb: 2 }}>
          <InputLabel id="payer-select-label" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Paid By
          </InputLabel>
          <Select
            labelId="payer-select-label"
            value={payerId}
            onChange={(e) => setPayerId(e.target.value as string)}
            label="Paid By"
            sx={{ color: "white" }}
          >
            {usersInTrip.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name || user.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth required sx={{ mb: 2 }}>
          <InputLabel id="participants-select-label" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Participants
          </InputLabel>
          <Select
            labelId="participants-select-label"
            multiple
            value={selectedParticipants}
            onChange={(e) => setSelectedParticipants(e.target.value as string[])}
            input={<OutlinedInput label="Participants" />}
            renderValue={(selected) =>
              selected.map((id) => {
                const user = usersInTrip.find((u) => u.id === id);
                return user?.name || user?.email || "";
              }).join(", ")
            }
            sx={{ color: "white" }}
          >
            {usersInTrip.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Checkbox checked={selectedParticipants.indexOf(user.id) > -1} />
                <ListItemText primary={user.name || user.email} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
          Add Expense
        </Button>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default AddExpenseModal;
