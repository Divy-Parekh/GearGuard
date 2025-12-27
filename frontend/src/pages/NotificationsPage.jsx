import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Divider,
  Button,
  Tabs,
  Tab,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  DoneAll as DoneAllIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNotifications } from "../contexts/NotificationsContext";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const filteredNotifications =
    tabValue === 0
      ? notifications
      : tabValue === 1
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.read);

  const handleMenuOpen = (event, notification) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = (id) => {
    markAsRead(id);
    handleMenuClose();
  };

  const handleDelete = (id) => {
    deleteNotification(id);
    handleMenuClose();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification.id);
    if (notification.type === "critical") {
      navigate("/equipment");
    } else if (notification.type === "request") {
      navigate("/requests");
    } else if (notification.type === "schedule") {
      navigate("/calendar");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "critical":
        return <WarningIcon sx={{ color: "error.main" }} />;
      case "request":
        return <AssignmentIcon sx={{ color: "primary.main" }} />;
      case "completed":
        return <CheckCircleIcon sx={{ color: "success.main" }} />;
      case "schedule":
        return <ScheduleIcon sx={{ color: "warning.main" }} />;
      default:
        return <NotificationsIcon sx={{ color: "text.secondary" }} />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "critical":
        return "Critical";
      case "request":
        return "Request";
      case "completed":
        return "Completed";
      case "schedule":
        return "Scheduled";
      default:
        return "General";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "critical":
        return "error";
      case "request":
        return "primary";
      case "completed":
        return "success";
      case "schedule":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box className="animate-fade-in">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${
                  unreadCount > 1 ? "s" : ""
                }`
              : "All caught up!"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {unreadCount > 0 && (
            <Button
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAllAsRead}
              variant="outlined"
              size="small"
            >
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              startIcon={<DeleteIcon />}
              onClick={handleClearAll}
              variant="outlined"
              color="error"
              size="small"
            >
              Clear all
            </Button>
          )}
        </Box>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label={`All (${notifications.length})`} />
            <Tab label={`Unread (${unreadCount})`} />
            <Tab label={`Read (${notifications.length - unreadCount})`} />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {filteredNotifications.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center" }}>
              <NotificationsIcon
                sx={{ fontSize: 64, color: "grey.300", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No notifications
              </Typography>
              <Typography variant="body2" color="text.disabled">
                {tabValue === 1
                  ? "You've read all your notifications"
                  : "You don't have any notifications yet"}
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {filteredNotifications.map((notification, index) => (
                <Box key={notification.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      cursor: "pointer",
                      bgcolor: notification.read
                        ? "transparent"
                        : "rgba(102, 126, 234, 0.04)",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                    onClick={() => handleNotificationClick(notification)}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={(e) => handleMenuOpen(e, notification)}
                        sx={{ color: "text.secondary" }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: notification.read ? 500 : 600 }}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={getTypeLabel(notification.type)}
                            size="small"
                            color={getTypeColor(notification.type)}
                            sx={{ height: 20, fontSize: "0.7rem" }}
                          />
                          {!notification.read && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ display: "block", mb: 0.5 }}
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
                    />
                  </ListItem>
                  {index < filteredNotifications.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedNotification && !selectedNotification.read && (
          <MenuItem onClick={() => handleMarkAsRead(selectedNotification.id)}>
            <ListItemIcon>
              <DoneAllIcon fontSize="small" />
            </ListItemIcon>
            Mark as read
          </MenuItem>
        )}
        <MenuItem
          onClick={() =>
            selectedNotification && handleDelete(selectedNotification.id)
          }
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default NotificationsPage;
