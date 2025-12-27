import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationsContext";
import { ColorModeContext } from "../../main";

const TopBar = ({ onMenuClick, sidebarWidth = 260 }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const colorMode = useContext(ColorModeContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleNotificationsOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate based on type
    if (notification.type === "critical") {
      navigate("/equipment?status=critical");
    } else if (notification.type === "request") {
      navigate("/requests");
    }
    handleNotificationsClose();
  };

  const markAllAsReadHandler = () => {
    markAllAsRead();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "critical":
        return <WarningIcon sx={{ color: "error.main" }} />;
      case "request":
        return <AssignmentIcon sx={{ color: "primary.main" }} />;
      case "completed":
        return <CheckCircleIcon sx={{ color: "success.main" }} />;
      default:
        return <NotificationsIcon sx={{ color: "text.secondary" }} />;
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        bgcolor: theme.palette.background.paper,
        color: "text.primary",
        transition: (theme) =>
          theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <Toolbar
        sx={{ justifyContent: "space-between", minHeight: "64px !important" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, display: { xs: "none", sm: "block" } }}
          >
            Welcome back, {user?.name?.split(" ")[0]}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Toggle theme">
            <IconButton
              onClick={colorMode.toggleColorMode}
              sx={{
                color: "text.primary",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotificationsOpen}
              sx={{
                color: "text.secondary",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.7rem",
                    minWidth: 18,
                    height: 18,
                  },
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Notifications Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleNotificationsClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: {
              mt: 1,
              width: 380,
              maxHeight: 500,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography
                variant="caption"
                sx={{
                  color: "primary.main",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={markAllAsReadHandler}
              >
                Mark all as read
              </Typography>
            )}
          </Box>
          <Divider sx={{ my: 0 }} />

          <Box
            sx={{
              overflowY: "auto",
              flex: 1,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                bgcolor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "grey.400",
                borderRadius: "3px",
                "&:hover": {
                  bgcolor: "grey.500",
                },
              },
            }}
          >
            {notifications.length === 0 ? (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <NotificationsIcon
                  sx={{ fontSize: 40, color: "grey.300", mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            ) : (
              notifications.map((notification, index) => (
                <Box key={notification.id}>
                  <MenuItem
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      alignItems: "flex-start",
                      bgcolor: notification.read
                        ? "transparent"
                        : "rgba(102, 126, 234, 0.04)",
                      borderLeft: notification.read ? "none" : "3px solid",
                      borderColor: "primary.main",
                      minHeight: "auto",
                    }}
                  >
                    <ListItemIcon sx={{ mt: 0.5, minWidth: 40 }}>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              mb: 0.5,
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.disabled"
                          >
                            {notification.time}
                          </Typography>
                        </>
                      }
                      primaryTypographyProps={{
                        fontWeight: notification.read ? 400 : 600,
                        fontSize: "0.875rem",
                        sx: {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
                      }}
                    />
                  </MenuItem>
                  {index < notifications.length - 1 && (
                    <Divider sx={{ my: 0 }} />
                  )}
                </Box>
              ))
            )}
          </Box>

          <Divider sx={{ my: 0 }} />
          <MenuItem
            onClick={() => {
              navigate("/notifications");
              handleNotificationsClose();
            }}
            sx={{ justifyContent: "center", py: 1.5, flexShrink: 0 }}
          >
            <Typography
              variant="body2"
              color="primary"
              sx={{ fontWeight: 500 }}
            >
              View all notifications
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
