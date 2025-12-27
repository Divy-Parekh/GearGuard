import { useState, useContext } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Switch,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    Select,
    MenuItem,
    FormControl,
    Alert,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Email as EmailIcon,
    DarkMode as DarkModeIcon,
    Language as LanguageIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';
import { ColorModeContext } from '../main';

const SettingsPage = () => {
    const colorMode = useContext(ColorModeContext);
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        maintenanceAlerts: true,
        weeklyReports: false,
        language: 'en',
    });
    const [saved, setSaved] = useState(false);

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <Box className="animate-fade-in">
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Manage your account preferences
            </Typography>

            {saved && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Settings saved successfully!
                </Alert>
            )}

            {/* Notifications */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ pb: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Notifications
                    </Typography>
                    <List disablePadding>
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                                <EmailIcon color="action" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Email Notifications"
                                secondary="Receive email updates for important events"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    checked={settings.emailNotifications}
                                    onChange={() => handleToggle('emailNotifications')}
                                    color="primary"
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                                <NotificationsIcon color="action" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Push Notifications"
                                secondary="Get browser push notifications"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    checked={settings.pushNotifications}
                                    onChange={() => handleToggle('pushNotifications')}
                                    color="primary"
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                                <NotificationsIcon color="action" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Maintenance Alerts"
                                secondary="Get notified about urgent maintenance issues"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    checked={settings.maintenanceAlerts}
                                    onChange={() => handleToggle('maintenanceAlerts')}
                                    color="primary"
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem sx={{ px: 0, pb: 2 }}>
                            <ListItemIcon>
                                <EmailIcon color="action" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Weekly Reports"
                                secondary="Receive weekly maintenance summary emails"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    checked={settings.weeklyReports}
                                    onChange={() => handleToggle('weeklyReports')}
                                    color="primary"
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ pb: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Appearance
                    </Typography>
                    <List disablePadding>
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                                <DarkModeIcon color="action" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Dark Mode"
                                secondary="Switch to dark theme"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    checked={colorMode.mode === 'dark'}
                                    onChange={colorMode.toggleColorMode}
                                    color="primary"
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem sx={{ px: 0, pb: 2 }}>
                            <ListItemIcon>
                                <LanguageIcon color="action" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Language"
                                secondary="Select your preferred language"
                            />
                            <ListItemSecondaryAction>
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <Select
                                        value={settings.language}
                                        onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                                    >
                                        <MenuItem value="en">English</MenuItem>
                                        <MenuItem value="es">Español</MenuItem>
                                        <MenuItem value="fr">Français</MenuItem>
                                        <MenuItem value="de">Deutsch</MenuItem>
                                    </Select>
                                </FormControl>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>

            {/* Security */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ pb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Security
                    </Typography>
                    <List disablePadding>
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                                <SecurityIcon color="action" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Change Password"
                                secondary="Update your account password"
                            />
                            <ListItemSecondaryAction>
                                <Button variant="outlined" size="small">
                                    Change
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleSave}>
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
};

export default SettingsPage;
