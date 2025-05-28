import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { Paper, Typography, Grid, Button, Container, Box } from "@mui/material";

const Dashboard = () => {
  const navigate = useNavigate();

  const actions = [
    { label: "Trips", path: "/trips" },
    { label: "Status", path: "/status" },
    { label: "Notifications", path: "/notifications" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <Box className="flex flex-col min-h-screen">
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <Container maxWidth="sm">
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
            <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4 }}>
              Dashboard
            </Typography>

            <Grid container spacing={3}>
              {actions.map((action) => (
                <Grid item xs={12} sm={6} key={action.label}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(action.path)}
                    sx={{
                      py: 2,
                      fontWeight: 600,
                      borderRadius: 2,
                      bgcolor: "#1976d2",
                      "&:hover": { bgcolor: "#1565c0" },
                    }}
                  >
                    {action.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
