import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import api from "../data/api";
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Navbar from "../components/layout/Navbar";
import AddFriendModal from "../components/trips/AddFriendModal";

interface Trip {
  id: string;
  name: string;
  expenses: any[];
}

interface Friend {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);

  const fetchFriends = useCallback(async () => {
    if (!id) return;
    try {
      const response = await api.get(`/trips/${id}/friends`); // Updated endpoint
      setFriends(response.data);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  }, [id]);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await api.get(`/trips/${id}`);
        setTrip(response.data);
      } catch (error) {
        console.error("Failed to fetch trip details:", error);
      }
    };

    fetchTripDetails();
    fetchFriends();
  }, [id, fetchFriends]);

  const handleAddFriendClick = () => {
    setAddFriendModalOpen(true);
  };

  const handleAddFriendModalClose = () => {
    setAddFriendModalOpen(false);
  };

  const handleFriendAdded = () => {
    fetchFriends();
  };

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="page-container">
        <h2 className="text-title text-center">{trip.name}</h2>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Trip Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {/* Afișează detaliile excursiei și cheltuielile */}
              {/* Poți folosi componentele existente pentru a afișa cheltuielile */}
            </Typography>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddFriendClick}
        >
          Add Friend
        </Button>

        <List>
          {friends.map((friend) => (
            <ListItem key={friend.id}>
              <ListItemText primary={friend.name} />
            </ListItem>
          ))}
        </List>

        <AddFriendModal
          open={addFriendModalOpen}
          onClose={handleAddFriendModalClose}
          tripId={id || ""}
          onFriendAdded={handleFriendAdded}
        />
      </div>
    </div>
  );
};

export default TripDetails;