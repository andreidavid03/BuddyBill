import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../data/api";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Alert,
  Paper,
} from "@mui/material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", { email, password, name });
      navigate("/login");
    } catch (error: any) {
      console.error("Registration failed:", error);
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "transparent",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            color: "#ffffff",
          }}
        >
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 2 }}>
            Register
          </Typography>

          {message && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2, input: { color: "white" }, label: { color: "#bbb" } }}
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2, input: { color: "white" }, label: { color: "#bbb" } }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3, input: { color: "white" }, label: { color: "#bbb" } }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Register
            </Button>
          </form>

          <Button
            variant="text"
            fullWidth
            size="small"
            sx={{ mt: 2, color: "#90caf9" }}
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
