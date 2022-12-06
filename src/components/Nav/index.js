import React, { useState, useCallback } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NavButton from "../NavButton";

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];

const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((v) => !v);
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Let&apos;s learn Sinhala Fingerspelling Alphabet
          </Typography>

          <Box
            sx={{
              display: { xs: "none", sm: "block" },
            }}
          >
            {NAV_ITEMS.map(({ label, to }) => (
              <NavButton key={to} color="inherit" to={to}>
                {label}
              </NavButton>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={window?.document?.body}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ my: 2 }}>
              Let&apos;s learn Sinhala Fingerspelling Alphabet
            </Typography>
            <Divider />
            <List>
              {NAV_ITEMS.map(({ label, to }) => (
                <ListItem key={to} disablePadding>
                  <NavButton
                    to={to}
                    component={ListItemButton}
                    sx={{ textAlign: "center" }}
                  >
                    <ListItemText primary={label} />
                  </NavButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </>
  );
};

export default Nav;
