import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import api from "../../data/api";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  tripId: string;
  onExpenseAdded: () => void;
}

interface Friend {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  open,
  onClose,
  tripId,
  onExpenseAdded,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [paidBy, setPaidBy] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get(`/friends/${tripId}`);
        setFriends(response.data);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchFriends();
  }, [tripId]);

  const handleCreateExpense = async () => {
    try {
      await api.post("/expenses", {
        tripId,
        description,
        amount,
        paidBy: paidBy, 
        participantIds: selectedFriends,
      });
      onExpenseAdded();
      onClose();
    } catch (error) {
      console.error("Failed to create expense:", error);
    }
  };

  const handleFriendSelect = (event: any) => {
    setSelectedFriends(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Expense</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="description"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          id="amount"
          label="Amount"
          type="number"
          fullWidth
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <Select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          variant="outlined"
          fullWidth
          margin="dense"
        >
          {friends.map((friend) => (
            <MenuItem key={friend.id} value={friend.id}>
              {friend.name}
            </MenuItem>
          ))}
        </Select>
        <Select
          multiple
          value={selectedFriends}
          onChange={handleFriendSelect}
          renderValue={(selected) => {
            return selected
              .map((value) => friends.find((friend) => friend.id === value)?.name)
              .join(", ");
          }}
          variant="outlined"
          fullWidth
          margin="dense"
        >
          {friends.map((friend) => (
            <MenuItem key={friend.id} value={friend.id}>
              <Checkbox checked={selectedFriends.indexOf(friend.id) > -1} />
              <ListItemText primary={friend.name} />
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreateExpense}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExpenseModal;