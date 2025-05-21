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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="page-container">
        <h2 className="text-title text-center">Trips</h2>

        <div className="mb-4 flex items-center">
          <TextField
            label="New Trip Name"
            variant="outlined"
            value={newTripName}
            onChange={(e) => setNewTripName(e.target.value)}
            className="mr-2"
          />
          <Button variant="contained" color="success" onClick={handleCreateTrip}>
            Create Trip
          </Button>
        </div>

        <List>
          {trips.map((trip) => (
            <ListItem
              key={trip.id}
              secondaryAction={
                <div
                  className="flex items-center"
                  style={{ marginRight: "-24px" }}
                >
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditTrip(trip.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteTrip(trip.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              }
            >
              <ListItemText primary={trip.name} />
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default Trips;