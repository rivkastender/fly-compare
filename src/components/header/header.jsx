import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import logo from "./../../FlyCompare.svg";
import "./header.css";

const pages = [
  { name: "Flights", path: "/" },
  { name: "Compare", path: "/compare" },
  { name: "Status", path: "/status" },
];

export function Header() {
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
    if (page) {
      navigate(page.path);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        borderBottom: 25,
        borderBottomColor: "#DE8F14",
        borderTop: 2,
        borderTopColor: "#04628F",
        marginTop: 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar variant="dense">
          <Typography
            sx={{
              display: { xs: "none", md: "flex" },
              marginRight: 15,
            }}
          >
            <img
              src={logo}
              id="logo"
              alt="FlyCompare"
              onClick={() => handleCloseNavMenu({ name: "Flights", path: "/" })}
            />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                color: "#04628F",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => handleCloseNavMenu(page)}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
            }}
          >
            <img
              src={logo}
              id="logo"
              alt="FlyCompare"
              onClick={() => handleCloseNavMenu({ name: "Flights", path: "/" })}
            />
          </Typography>
          <Box
            sx={{
              marginLeft: -8,
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                size="large"
                onClick={() => handleCloseNavMenu(page)}
                sx={{
                  color: "#04628F",
                  marginTop: "2.5%",
                  fontSize: 20,
                  marginRight: 2,
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
