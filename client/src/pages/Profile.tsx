import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import api from "../data/api";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Divider,
  Paper,
  Box,
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Friendship {
  id: string;
  initiatorId: string;
  receiverId: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  initiator: User;
  receiver: User;
}

const Profile = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [friendEmail, setFriendEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [userName, setUserName] = useState("Your");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get("/friends");
        setFriends(response.data);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
        setMessage("Failed to fetch friends.");
      }
    };

    const fetchPendingRequests = async () => {
      try {
        const response = await api.get("/friends/requests");
        setPendingRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch pending requests:", error);
        setMessage("Failed to fetch pending requests.");
      }
    };

    const fetchUserName = async () => {
      try {
        const res = await api.get("/auth/me");
        setUserName(res.data.name || "Your");
      } catch (error) {
        console.error("Failed to fetch user name:", error);
      }
    };

    fetchFriends();
    fetchPendingRequests();
    fetchUserName();
  }, []);

  const handleAddFriend = async () => {
    try {
      const res = await api.get(`/auth/users`);
      const foundUser = res.data.find((user: User) => user.email === friendEmail);

      if (!foundUser) {
        setMessage("User not found.");
        return;
      }

      await api.post("/friends/request", { receiverId: foundUser.id });
      setMessage("Friend request sent!");
      setFriendEmail("");
    } catch (error: any) {
      console.error("Failed to add friend:", error);
      setMessage(error.response?.data?.message || "Failed to add friend.");
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      await api.post(`/friends/${friendshipId}/accept`);
      setMessage("Friend request accepted!");
      const accepted = pendingRequests.find((r) => r.id === friendshipId);
      if (accepted) {
        setFriends([...friends, accepted.initiator]);
      }
      setPendingRequests(pendingRequests.filter((r) => r.id !== friendshipId));
    } catch (error: any) {
      console.error("Failed to accept request:", error);
      setMessage(error.response?.data?.message || "Failed to accept request.");
    }
  };

  const handleDeclineRequest = async (friendshipId: string) => {
    try {
      await api.post(`/friends/${friendshipId}/decline`);
      setMessage("Friend request declined!");
      setPendingRequests(pendingRequests.filter((r) => r.id !== friendshipId));
    } catch (error: any) {
      console.error("Failed to decline request:", error);
      setMessage(error.response?.data?.message || "Failed to decline request.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Box
        className="flex-grow flex flex-col justify-center items-center"
        sx={{ p: 4 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(8px)",
            color: "#ffffff",
            width: "100%",
            maxWidth: "500px",
            mx: "auto",
          }}
        >
          <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
            {userName} Profile
          </Typography>

          {message && (
            <Typography align="center" color="error" gutterBottom>
              {message}
            </Typography>
          )}

          <Box display="flex" gap={2} mb={4}>
            <TextField
              label="Friend's Email"
              variant="outlined"
              fullWidth
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              InputLabelProps={{ style: { color: "#ffffffcc" } }}
              InputProps={{
                style: {
                  color: "#ffffff",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddFriend}
              sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
            >
              ADD
            </Button>
          </Box>

          <Divider sx={{ my: 2, borderColor: "#ffffff44" }} />

          <Typography variant="h6" gutterBottom>
            Friends
          </Typography>
          {friends.length === 0 ? (
            <Typography color="text.secondary">No friends added yet.</Typography>
          ) : (
            friends.map((friend) => (
              <Typography key={friend.id} sx={{ pl: 1 }}>
                {friend.name} - {friend.email}
              </Typography>
            ))
          )}

          <Divider sx={{ my: 2, borderColor: "#ffffff44" }} />

          <Typography variant="h6" gutterBottom>
            Pending Friend Requests
          </Typography>
          {pendingRequests.length === 0 ? (
            <Typography color="text.secondary">No pending requests.</Typography>
          ) : (
            pendingRequests.map((request) => (
              <Box
                key={request.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ pl: 1 }}
              >
                <Typography>
                  {request.initiator.name} - {request.initiator.email}
                </Typography>
                <Box>
                  <IconButton
                    color="success"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    <Check />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeclineRequest(request.id)}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default Profile;
