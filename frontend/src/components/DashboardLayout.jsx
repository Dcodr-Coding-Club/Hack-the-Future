import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Box, IconButton, ListItemIcon } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { Footer} from "../components";
import RandomWords from "../components/RandomWords";
import FillEquationGame from "../components/FillInTheEquations";
import MatchTheColumn from "../components/MatchTheColumn";
import MathsStageGame from "../components/MathsStageGame";

const drawerWidth = 240;
const bgImage = "url('/ga.png')";

const menuItems = [
  { text: "Maths Game", icon: <SportsEsportsIcon />, path: "/dashboard/fillequation" },
  { text: "Word Scramble", icon: <SportsEsportsIcon />, path: "/dashboard/randomwords" },
  { text: "Column Match", icon: <SportsEsportsIcon />, path: "/dashboard/column-match" },
  { text: "Number Compare", icon: <SportsEsportsIcon />, path: "/dashboard/maths-game" },
];

const Sidebar = ({ open }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: open ? drawerWidth : 60,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        width: open ? drawerWidth : 60,
        height: "calc(100vh - 64px)",
        boxSizing: "border-box",
        overflowX: "hidden",
        transition: "width 0.3s ease-in-out",
        background: "rgba(255, 255, 255, 0.9)",
        color: "black",
        backdropFilter: "blur(10px)",
        boxShadow: "2px 0px 10px rgba(0,0,0,0.1)",
        marginTop: "160px", // Moves sidebar below navbar
      },
    }}
  >
    <List>
      {menuItems.map(({ text, icon, path }) => (
        <ListItem component={Link} to={path} key={text} sx={{ display: "flex", alignItems: "center", color: "black", cursor: "pointer" }}>
          <ListItemIcon sx={{ minWidth: 40, color: "black" }}>{icon}</ListItemIcon>
          <Box sx={{ display: open ? "block" : "none", transition: "opacity 0.3s ease-in-out" }}>
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
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-fixed text-gray-900 relative" style={{ backgroundImage: bgImage, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="relative w-full h-40 flex items-center justify-center font-[Inter] bg-black/5">
        <h1 className="text-3xl font-bold text-white">Brainy Arcade</h1>
      </div>
      <CssBaseline />
      <Toolbar />
      <Box sx={{ display: "flex", marginTop: "-87px" }}>
        <Sidebar open={open} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: open ? `${drawerWidth}px` : "72px", position: "relative", zIndex: 2 }}>
          <AppBar position="relative" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: "rgba(255, 255, 255, 0.9)", color: "black", backdropFilter: "blur(10px)", boxShadow: "none" }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{ marginRight: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap></Typography>
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/maths-game" replace />} />
            <Route path="/maths-game" element={<MathsStageGame />} />
            <Route path="/fillequation" element={<FillEquationGame />} />
            <Route path="/column-match" element={<MatchTheColumn />} />
            <Route path="/randomwords" element={<RandomWords />} />
          </Routes>
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default DashboardLayout;