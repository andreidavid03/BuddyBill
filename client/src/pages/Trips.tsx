import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../data/api";
import Navbar from "../components/layout/Navbar";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Trip {
  id: string;
  name: string;
}

const Trips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [newTripName, setNewTripName] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get("/trips");
        setTrips(response.data);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      }
    };

    fetchTrips();
  }, []);

  const handleCreateTrip = async () => {
    try {
      const response = await api.post("/trips", { name: newTripName });
      setTrips([...trips, response.data]);
      setNewTripName("");
    } catch (error) {
      console.error("Failed to create trip:", error);
    }
  };

  const handleEditTrip = (tripId: string) => {
    navigate(`/trip/${tripId}/edit`);
  };

  const handleDeleteTrip = async (tripId: string) => {
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips(trips.filter((trip) => trip.id !== tripId));
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <Navbar />
      <Box className="flex-grow flex flex-col items-center justify-center p-4">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            width: "100%",
            maxWidth: 600,
            mx: "auto", 
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: "#ffffff" }} 
          >
            Your Trips
          </Typography>

          <Box
            display="flex"
            gap={2}
            mb={4}
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              label="New Trip Name"
              variant="outlined"
              value={newTripName}
              onChange={(e) => setNewTripName(e.target.value)}
              sx={{
                input: { color: "white" },
                "& label": { color: "rgba(255,255,255,0.6)" },
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              }}
            />
            <Button variant="contained" color="primary" onClick={handleCreateTrip}>
              Create
            </Button>
          </Box>

          <List>
            {trips.map((trip) => (
              <ListItem
                key={trip.id}
                divider
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditTrip(trip.id)}
                      sx={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteTrip(trip.id)}
                      sx={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={trip.name}
                  primaryTypographyProps={{ color: "white" }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </div>
  );
};

export default Trips;
