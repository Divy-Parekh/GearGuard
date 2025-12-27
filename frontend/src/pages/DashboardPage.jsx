import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Skeleton,
    IconButton,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    LinearProgress,
} from '@mui/material';
import {
    Warning as WarningIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    Build as BuildIcon,
    ArrowForward as ArrowForwardIcon,
    TrendingUp as TrendingUpIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
    PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    LineChart, Line, CartesianGrid, AreaChart, Area
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const COLORS = ['#667eea', '#ed6c02', '#2e7d32', '#d32f2f'];

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, isAdmin, isManager } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/dashboard/stats');
            setStats(response.data.data.stats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Professional stat card with gradient accent
    const StatCard = ({ title, value, icon, color, bgColor, subtitle, onClick }) => (
        <Card
            sx={{
                height: '100%',
                cursor: onClick ? 'pointer' : 'default',
                position: 'relative',
                overflow: 'hidden',
            }}
            onClick={onClick}
        >
            {/* Colored accent bar */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                bgcolor: color,
            }} />
            <CardContent sx={{ p: 3, pt: 3.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                            {title}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, mt: 0.5, color: color }}>
                            {loading ? <Skeleton width={60} /> : value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    const getStatusData = () => {
        if (!stats?.requestsByStatus) return [];
        return stats.requestsByStatus.map((item) => ({
            name: item.status.replace('_', ' '),
            value: item._count,
        }));
    };

    const getTypeData = () => {
        if (!stats?.requestsByType) return [];
        return stats.requestsByType.map((item) => ({
            name: item.maintenanceType,
            value: item._count,
        }));
    };

    // Mock trend data for charts
    const weeklyTrendData = [
        { day: 'Mon', requests: 12, completed: 8 },
        { day: 'Tue', requests: 15, completed: 12 },
        { day: 'Wed', requests: 8, completed: 10 },
        { day: 'Thu', requests: 18, completed: 14 },
        { day: 'Fri', requests: 14, completed: 11 },
        { day: 'Sat', requests: 6, completed: 8 },
        { day: 'Sun', requests: 4, completed: 5 },
    ];

    const monthlyData = [
        { month: 'Jan', preventive: 24, corrective: 18 },
        { month: 'Feb', preventive: 28, corrective: 15 },
        { month: 'Mar', preventive: 32, corrective: 22 },
        { month: 'Apr', preventive: 26, corrective: 19 },
        { month: 'May', preventive: 30, corrective: 16 },
        { month: 'Jun', preventive: 35, corrective: 20 },
    ];

    const equipmentStatusData = [
        { name: 'Operational', value: 45, color: '#2e7d32' },
        { name: 'Under Maintenance', value: 8, color: '#ed6c02' },
        { name: 'Critical', value: 3, color: '#d32f2f' },
        { name: 'Inactive', value: 5, color: '#9e9e9e' },
    ];

    return (
        <Box className="animate-fade-in">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Overview of your maintenance operations
                </Typography>
            </Box>

            {/* Stats Cards */}
            {(isAdmin() || isManager()) && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Critical Equipment"
                            value={stats?.criticalEquipment || 0}
                            icon={<WarningIcon sx={{ color: '#d32f2f', fontSize: 24 }} />}
                            color="#d32f2f"
                            bgColor="rgba(211, 47, 47, 0.08)"
                            subtitle="Needs attention"
                            onClick={() => navigate('/equipment?status=critical')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Technician Utilization"
                            value={`${stats?.technicianUtilization?.percentage || 0}%`}
                            icon={<PeopleIcon sx={{ color: '#1976d2', fontSize: 24 }} />}
                            color="#1976d2"
                            bgColor="rgba(25, 118, 210, 0.08)"
                            subtitle={`${stats?.technicianUtilization?.busy || 0}/${stats?.technicianUtilization?.total || 0} busy`}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Open Requests"
                            value={stats?.openRequests || 0}
                            icon={<AssignmentIcon sx={{ color: '#2e7d32', fontSize: 24 }} />}
                            color="#2e7d32"
                            bgColor="rgba(46, 125, 50, 0.08)"
                            subtitle="Active maintenance"
                            onClick={() => navigate('/requests')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Equipment"
                            value={stats?.totalEquipment || 0}
                            icon={<BuildIcon sx={{ color: '#ed6c02', fontSize: 24 }} />}
                            color="#ed6c02"
                            bgColor="rgba(237, 108, 2, 0.08)"
                            subtitle="In system"
                            onClick={() => navigate('/equipment')}
                        />
                    </Grid>
                </Grid>
            )}

            {/* Charts Row 1 */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Request Status Chart */}
                {(isAdmin() || isManager()) && (
                    <Grid item xs={12} md={6} lg={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Requests by Status
                                </Typography>
                                {loading ? (
                                    <Skeleton variant="circular" width={180} height={180} sx={{ mx: 'auto' }} />
                                ) : (
                                    <ResponsiveContainer width="100%" height={220}>
                                        <PieChart>
                                            <Pie
                                                data={getStatusData()}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={85}
                                                paddingAngle={3}
                                                dataKey="value"
                                            >
                                                {getStatusData().map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Maintenance Types */}
                {(isAdmin() || isManager()) && (
                    <Grid item xs={12} md={6} lg={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Maintenance Types
                                </Typography>
                                {loading ? (
                                    <Skeleton variant="rectangular" height={220} />
                                ) : (
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={getTypeData()} layout="vertical">
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#667eea" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Recent Requests */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Recent Requests
                                </Typography>
                                <IconButton size="small" onClick={() => navigate('/requests')}>
                                    <ArrowForwardIcon />
                                </IconButton>
                            </Box>
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <Skeleton key={i} height={56} sx={{ mb: 1 }} />
                                ))
                            ) : (
                                <List disablePadding>
                                    {stats?.recentRequests?.slice(0, 4).map((request, index) => (
                                        <Box key={request.id}>
                                            <ListItem
                                                sx={{
                                                    px: 0,
                                                    cursor: 'pointer',
                                                    '&:hover': { bgcolor: 'action.hover' },
                                                    borderRadius: 1,
                                                }}
                                                onClick={() => navigate(`/requests/${request.id}`)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            bgcolor:
                                                                request.status === 'NEW'
                                                                    ? 'primary.main'
                                                                    : request.status === 'IN_PROGRESS'
                                                                        ? 'warning.main'
                                                                        : 'success.main',
                                                        }}
                                                    >
                                                        <AssignmentIcon sx={{ fontSize: 18 }} />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={request.subject}
                                                    secondary={request.equipment?.name || 'No equipment'}
                                                    primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem', noWrap: true }}
                                                    secondaryTypographyProps={{ fontSize: '0.75rem', noWrap: true }}
                                                />
                                            </ListItem>
                                            {index < (stats?.recentRequests?.length || 0) - 1 && <Divider />}
                                        </Box>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts Row 2 - Manager/Admin Only */}
            {(isAdmin() || isManager()) && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {/* Weekly Trend */}
                    <Grid item xs={12} lg={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Weekly Request Trend
                                </Typography>
                                <ResponsiveContainer width="100%" height={280}>
                                    <AreaChart data={weeklyTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend />
                                        <Area type="monotone" dataKey="requests" stackId="1" stroke="#667eea" fill="rgba(102, 126, 234, 0.2)" name="New Requests" />
                                        <Area type="monotone" dataKey="completed" stackId="2" stroke="#2e7d32" fill="rgba(46, 125, 50, 0.2)" name="Completed" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Monthly Maintenance Types */}
                    <Grid item xs={12} lg={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Monthly Maintenance Breakdown
                                </Typography>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="preventive" fill="#667eea" name="Preventive" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="corrective" fill="#ed6c02" name="Corrective" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Charts Row 3 - Manager/Admin Only */}
            {(isAdmin() || isManager()) && (
                <Grid container spacing={3}>
                    {/* Equipment Status Distribution */}
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Equipment Status
                                </Typography>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={equipmentStatusData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                        >
                                            {equipmentStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Performance Metrics */}
                    <Grid item xs={12} md={6} lg={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Performance Metrics
                                </Typography>

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">First Response Time</Typography>
                                        <Typography variant="body2" fontWeight={600}>2.4 hrs</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={75} sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.200' }} />
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Resolution Rate</Typography>
                                        <Typography variant="body2" fontWeight={600}>89%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={89} color="success" sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.200' }} />
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">PM Compliance</Typography>
                                        <Typography variant="body2" fontWeight={600}>92%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={92} color="info" sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.200' }} />
                                </Box>

                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Equipment Uptime</Typography>
                                        <Typography variant="body2" fontWeight={600}>97.5%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={97.5} color="warning" sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.200' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Upcoming Preventive Maintenance */}
                    <Grid item xs={12} lg={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Upcoming PM Schedule
                                    </Typography>
                                    <IconButton size="small" onClick={() => navigate('/calendar')}>
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </Box>

                                {[
                                    { name: 'HVAC Filter Change', date: 'Tomorrow', priority: 'high' },
                                    { name: 'Conveyor Belt Inspection', date: 'Dec 29', priority: 'medium' },
                                    { name: 'CNC Machine Calibration', date: 'Dec 30', priority: 'high' },
                                    { name: 'Generator Maintenance', date: 'Jan 2', priority: 'low' },
                                ].map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            py: 1.5,
                                            borderBottom: index < 3 ? '1px solid' : 'none',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <ScheduleIcon sx={{
                                            color: item.priority === 'high' ? 'error.main' :
                                                item.priority === 'medium' ? 'warning.main' : 'success.main',
                                            fontSize: 20,
                                        }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" fontWeight={500}>{item.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{item.date}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Quick Stats for non-admin users */}
            {user?.role === 'TECHNICIAN' && (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <StatCard
                            title="Assigned to Me"
                            value={stats?.assignedToMe || 0}
                            icon={<AssignmentIcon sx={{ color: '#667eea', fontSize: 24 }} />}
                            color="#667eea"
                            bgColor="rgba(102, 126, 234, 0.08)"
                            subtitle="Active requests"
                            onClick={() => navigate('/kanban')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <StatCard
                            title="Team Requests"
                            value={stats?.teamRequests || 0}
                            icon={<PeopleIcon sx={{ color: '#2e7d32', fontSize: 24 }} />}
                            color="#2e7d32"
                            bgColor="rgba(46, 125, 50, 0.08)"
                            subtitle="Total for team"
                            onClick={() => navigate('/requests')}
                        />
                    </Grid>
                </Grid>
            )}

            {user?.role === 'USER' && (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <StatCard
                            title="My Equipment"
                            value={stats?.myEquipment || 0}
                            icon={<BuildIcon sx={{ color: '#667eea', fontSize: 24 }} />}
                            color="#667eea"
                            bgColor="rgba(102, 126, 234, 0.08)"
                            subtitle="Assigned to you"
                            onClick={() => navigate('/equipment')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    My Requests Summary
                                </Typography>
                                {stats?.myRequests?.map((item) => (
                                    <Box
                                        key={item.status}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            py: 1,
                                            borderBottom: 1,
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Typography variant="body2">{item.status.replace('_', ' ')}</Typography>
                                        <Typography variant="body2" fontWeight={600}>{item._count}</Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default DashboardPage;
