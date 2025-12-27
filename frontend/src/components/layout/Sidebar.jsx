import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Build as BuildIcon,
  Assignment as RequestIcon,
  ViewKanban as KanbanIcon,
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  Groups as TeamsIcon,
  Category as CategoryIcon,
  Factory as WorkCenterIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const COLLAPSED_WIDTH = 72;

const Sidebar = ({
  drawerWidth,
  mobileOpen,
  onDrawerToggle,
  collapsed,
  onCollapse,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isManager, logout } = useAuth();
  const [logoHovered, setLogoHovered] = useState(false);

  const currentWidth = collapsed && !isMobile ? COLLAPSED_WIDTH : drawerWidth;

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      roles: ["USER", "TECHNICIAN", "MANAGER", "ADMIN"],
    },
    {
      text: "Equipment",
      icon: <BuildIcon />,
      path: "/equipment",
      roles: ["USER", "TECHNICIAN", "MANAGER", "ADMIN"],
    },
    {
      text: "Requests",
      icon: <RequestIcon />,
      path: "/requests",
      roles: ["USER", "TECHNICIAN", "MANAGER", "ADMIN"],
    },
    {
      text: "Kanban Board",
      icon: <KanbanIcon />,
      path: "/kanban",
      roles: ["TECHNICIAN", "MANAGER", "ADMIN"],
    },
    {
      text: "Calendar",
      icon: <CalendarIcon />,
      path: "/calendar",
      roles: ["USER", "TECHNICIAN", "MANAGER", "ADMIN"],
    },
  ];

  const adminItems = [
    { text: "Users", icon: <PeopleIcon />, path: "/users", roles: ["ADMIN"] },
    {
      text: "Teams",
      icon: <TeamsIcon />,
      path: "/teams",
      roles: ["MANAGER", "ADMIN"],
    },
    {
      text: "Categories",
      icon: <CategoryIcon />,
      path: "/categories",
      roles: ["ADMIN"],
    },
    {
      text: "Work Centers",
      icon: <WorkCenterIcon />,
      path: "/work-centers",
      roles: ["MANAGER", "ADMIN"],
    },
  ];

  const userMenuItems = [
    { text: "Profile", icon: <PersonIcon />, path: "/profile" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const filterMenuItems = (items) => {
    return items.filter((item) => item.roles.includes(user?.role));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const renderMenuItem = (item, compact = false) => (
    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
      <Tooltip
        title={collapsed && !isMobile ? item.text : ""}
        placement="right"
        arrow
      >
        <ListItemButton
          onClick={() => {
            navigate(item.path);
            if (isMobile) onDrawerToggle();
          }}
          sx={{
            borderRadius: 1,
            py: compact ? 1 : 1.25,
            px: collapsed && !isMobile ? 1.5 : 2,
            mx: collapsed && !isMobile ? 1 : 1.5,
            justifyContent: collapsed && !isMobile ? "center" : "flex-start",
            bgcolor: isActive(item.path) ? "primary.main" : "transparent",
            color: isActive(item.path) ? "white" : "text.primary",
            "&:hover": {
              bgcolor: isActive(item.path) ? "primary.dark" : "grey.100",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive(item.path) ? "white" : "text.secondary",
              minWidth: collapsed && !isMobile ? 0 : 36,
              justifyContent: "center",
            }}
          >
            {item.icon}
          </ListItemIcon>
          {(!collapsed || isMobile) && (
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 600 : 500,
                fontSize: compact ? "0.8125rem" : "0.875rem",
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo Section - ChatGPT style hover to expand */}
      <Box
        onMouseEnter={() => setLogoHovered(true)}
        onMouseLeave={() => setLogoHovered(false)}
        onClick={() => collapsed && !isMobile && onCollapse()}
        sx={{
          height: 64,
          px: collapsed && !isMobile ? 1.5 : 2,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed && !isMobile ? "center" : "flex-start",
          borderBottom: "1px solid",
          borderColor: "divider",
          cursor: collapsed && !isMobile ? "pointer" : "default",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontSize: "1rem",
              fontWeight: 700,
            }}
          >
            G
          </Avatar>
          {(!collapsed || isMobile) && (
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                GearGuard
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.7rem" }}
              >
                Maintenance
              </Typography>
            </Box>
          )}
        </Box>
        {/* Collapse button - only visible on expanded state or on hover when collapsed */}
        {!isMobile && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onCollapse();
            }}
            sx={{
              position: "absolute",
              right: collapsed ? "50%" : 8,
              transform: collapsed ? "translateX(50%)" : "none",
              opacity: collapsed ? (logoHovered ? 1 : 0) : 1,
              transition: "opacity 0.2s",
              bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.100",
              color: "text.primary",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark" ? "grey.700" : "grey.200",
              },
            }}
          >
            <ChevronRightIcon
              sx={{
                transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.2s",
              }}
            />
          </IconButton>
        )}
      </Box>

      {/* Main Menu */}
      <Box sx={{ flex: 1, py: 1.5, overflowY: "auto", overflowX: "hidden" }}>
        <List disablePadding>
          {filterMenuItems(menuItems).map((item) => renderMenuItem(item))}
        </List>

        {/* Admin Section */}
        {(isAdmin() || isManager()) &&
          filterMenuItems(adminItems).length > 0 && (
            <>
              <Divider sx={{ my: 1.5, mx: 2 }} />
              {(!collapsed || isMobile) && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 3,
                    py: 1,
                    display: "block",
                    color: "text.secondary",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontSize: "0.65rem",
                  }}
                >
                  Admin
                </Typography>
              )}
              <List disablePadding>
                {filterMenuItems(adminItems).map((item) =>
                  renderMenuItem(item)
                )}
              </List>
            </>
          )}
      </Box>

      {/* User Section with Profile & Settings */}
      <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
        {/* Profile & Settings Links */}
        <List disablePadding sx={{ py: 1 }}>
          {userMenuItems.map((item) => renderMenuItem(item, true))}
        </List>

        <Divider sx={{ mx: 2 }} />

        {/* User Info & Logout */}
        <Box sx={{ p: collapsed && !isMobile ? 1 : 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              justifyContent: collapsed && !isMobile ? "center" : "flex-start",
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "primary.main",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            {(!collapsed || isMobile) && (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                  {user?.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ fontSize: "0.7rem" }}
                >
                  {user?.role}
                </Typography>
              </Box>
            )}
            {(!collapsed || isMobile) && (
              <Tooltip title="Logout">
                <IconButton
                  size="small"
                  onClick={handleLogout}
                  sx={{ color: "text.secondary" }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: currentWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: currentWidth,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
