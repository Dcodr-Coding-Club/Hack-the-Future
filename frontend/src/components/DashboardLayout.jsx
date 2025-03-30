import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Box, IconButton, ListItemIcon } from "@mui/material";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import RandomWords from "../components/RandomWords"
import FillEquationGame from "../components/FillInTheEquations"
import MatchTheColumn from "../components/MatchTheColumn"
import MathsStageGame from "../components/MathsStageGame"

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <SportsEsportsIcon />, path: "/dashboard" },
  { text: "Maths Game", icon: <SportsEsportsIcon />, path: "/dashboard/fillequation" },
  { text: "Word Scramble", icon: <SportsEsportsIcon />, path: "/dashboard/randomwords" },
  { text: "Column Match", icon: <SportsEsportsIcon />, path: "/dashboard/column-match" },
  { text: "Number Compare", icon: <SportsEsportsIcon />, path: "/dashboard/maths-game" },
];

const Sidebar = ({ open }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: open ? drawerWidth : 56,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        width: open ? drawerWidth : 56,
        boxSizing: "border-box",
        overflowX: "hidden",
        transition: "width 0.3s ease",
        background: "linear-gradient(135deg, #6a0dad, #9c27b0)",
        color: "white"
      }
    }}
  >
    <Toolbar />
    <List>
      {menuItems.map(({ text, icon, path }) => (
        <ListItem component={Link} to={path} key={text} sx={{ display: "flex", alignItems: "center", color: "white", cursor: "pointer" }}>
          <ListItemIcon sx={{ minWidth: 40, justifyContent: "flex-start", color: "white" }}>{icon}</ListItemIcon>
          <Box sx={{ display: open ? "block" : "none", transition: "opacity 0.3s ease" }}>
            <ListItemText primary={text} />
          </Box>
        </ListItem>
      ))}
    </List>
  </Drawer>
);

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,rgb(106, 13, 173), #9c27b0)", color: "white" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: "rgba(106, 13, 173, 1)" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{ marginRight: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>Game Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Sidebar open={open} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: open ? `${drawerWidth}px` : "56px", position: "relative", zIndex: 2 }}>
        <Toolbar />
        <Routes>
          <Route path="/maths-game" element={<MathsStageGame />} />
          <Route path="/fillequation" element={<FillEquationGame />} />
          <Route path="/column-match" element={<MatchTheColumn />} />
          <Route path="/randomwords" element={<RandomWords />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
