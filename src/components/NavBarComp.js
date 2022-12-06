import React from "react";
import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NavButton from "./NavButton";

const NavBarComp = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Let&apos;s learn Sinhala Fingerspelling Alphabet
          </Typography>

          <Box>
            <NavButton color="inherit" to="/">
              Home
            </NavButton>
            <NavButton color="inherit" to="/about">
              About
            </NavButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBarComp;
