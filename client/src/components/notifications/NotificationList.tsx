import { useEffect, useState } from "react";
import api from "../../data/api";
import Navbar from "../layout/Navbar";
import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setNotifications([]); 
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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
            maxWidth: 600,
            mx: "auto",
            color: "white",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ color: "white" }}>
            Your Notifications
          </Typography>

          {notifications.length === 0 ? (
            <Typography sx={{ color: "white", textAlign: "center" }}>
              No notifications yet.
            </Typography>
          ) : (
            <List>
              {notifications.map((note) => (
                <ListItem
                  key={note.id}
                  divider
                  sx={{
                    bgcolor: note.isRead
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.1)",
                    borderLeft: note.isRead ? "4px solid transparent" : "4px solid #3b82f6",
                  }}
                >
                  <ListItemText
                    primary={
                      <span style={{ color: "white" }}>{note.message}</span>
                    }
                    secondary={
                      <span style={{ color: "rgba(255,255,255,0.7)" }}>
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default NotificationList;
