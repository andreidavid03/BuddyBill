import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import api from "../../data/api";

interface AddFriendModalProps {
  open: boolean;
  onClose: () => void;
  tripId: string;
  onFriendAdded: () => void;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({
  open,
  onClose,
  tripId,
  onFriendAdded,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleCreateFriend = async () => {
    try {
      await api.post("/friends", { tripId, name, email, phone });
      onFriendAdded();
      onClose();
    } catch (error) {
      console.error("Failed to create friend:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Friend</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          id="phone"
          label="Phone Number"
          type="text"
          fullWidth
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreateFriend}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFriendModal;