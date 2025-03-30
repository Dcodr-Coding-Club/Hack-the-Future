import { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import {
  HomeOutlined as HomeOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  BarChartOutlined as BarChartOutlinedIcon,
  PieChartOutlineOutlined as PieChartOutlineOutlinedIcon,
  MenuOutlined as MenuOutlinedIcon,
} from "@mui/icons-material";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"; // ✅ Corrected import
import "react-pro-sidebar/dist/react-pro-sidebar.css";


const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      className={`py-3 px-5 rounded-lg transition-all duration-200 ${
        selected === title ? "bg-blue-600 text-white" : "text-gray-200 hover:bg-gray-700"
      }`}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography className="text-lg">{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const CustomSidebar = () => { // ✅ Renamed component to avoid conflict
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box className="bg-gray-900 min-h-screen text-white">
      <ProSidebar collapsed={isCollapsed} className="h-full"> {/* ✅ Corrected component usage */}
        <Menu iconShape="square" className="p-4">
          {/* Logo & Menu Toggle */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            className="mb-5 text-gray-200 hover:text-white"
          >
            {!isCollapsed && (
              <Box className="flex justify-between items-center px-4">
                <Typography className="text-2xl font-bold">ADMINIS</Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon className="text-white" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* Profile Section */}
          {!isCollapsed && (
            <Box className="text-center mb-6">
              <Box className="flex justify-center">
                <img
                  alt="profile-user"
                  className="w-24 h-24 rounded-full cursor-pointer"
                  src="../../assets/user.png"
                />
              </Box>
              <Typography className="text-xl font-bold mt-2">Ed Roh</Typography>
              <Typography className="text-sm text-green-400">VP Fancy Admin</Typography>
            </Box>
          )}

          {/* Navigation Items */}
          <Box className={isCollapsed ? "" : "pl-4"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography className="text-gray-400 text-sm mt-4 mb-2">Pages</Typography>
            <Item
              title="Profile Form"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography className="text-gray-400 text-sm mt-4 mb-2">Charts</Typography>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default CustomSidebar; // ✅ Updated export to match the renamed component
