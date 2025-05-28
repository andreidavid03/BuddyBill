import React from "react";
import { Box, Typography, Button, Container, Stack, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        color: "text.primary",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", // gradient subtil pentru fundal
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            bgcolor: "background.paper",
            boxShadow: 6,
            borderRadius: 4,
            p: 3,
            transition: "transform 0.2s ease-in-out",
            "&:hover": { transform: "scale(1.02)" }, // mică animație la hover
          }}
        >
          <CardContent>
            <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700 }}>
              Bine ai venit la BuddyBill!
            </Typography>

            <Typography variant="subtitle1" align="center" sx={{ mb: 3, color: "text.secondary" }}>
              Organizează-ți cheltuielile de grup și vezi cât datorezi sau cât primești.
              Totul ușor și clar!
            </Typography>

            <Stack direction="column" spacing={2} sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{
                  boxShadow: 3,
                  "&:hover": { boxShadow: 6 },
                  textTransform: "capitalize",
                }}
                onClick={() => navigate("/register")}
              >
                Înregistrează-te
              </Button>

              <Button
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
                sx={{
                  textTransform: "capitalize",
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.light",
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() => navigate("/login")}
              >
                Conectează-te
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Welcome;
