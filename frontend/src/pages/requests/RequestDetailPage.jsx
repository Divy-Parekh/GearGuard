import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Chip,
    Divider,
    TextField,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Skeleton,
    Rating,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Assignment as AssignmentIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    Build as BuildIcon,
    Send as SendIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const RequestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin, isManager, isTechnician } = useAuth();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [technicians, setTechnicians] = useState([]);

    useEffect(() => {
        fetchRequest();
        fetchTechnicians();
    }, [id]);

    const fetchRequest = async () => {
        try {
            const response = await api.get(`/requests/${id}`);
            setRequest(response.data.data.request);
        } catch (error) {
            console.error('Failed to fetch request:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTechnicians = async () => {
        try {
            const response = await api.get('/users/technicians');
            setTechnicians(response.data.data.technicians);
        } catch (error) {
            console.error('Failed to fetch technicians:', error);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await api.patch(`/requests/${id}/status`, { status: newStatus });
            fetchRequest();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleAssignTechnician = async (technicianId) => {
        try {
            await api.patch(`/requests/${id}/assign`, { technicianId });
            fetchRequest();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to assign technician');
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;
        setSubmitting(true);
        try {
            await api.post('/worksheets', { content: comment, requestId: id });
            setComment('');
            fetchRequest();
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            NEW: 'primary',
            IN_PROGRESS: 'warning',
            REPAIRED: 'success',
            SCRAP: 'error',
        };
        return colors[status] || 'default';
    };

    if (loading) {
        return (
            <Box>
                <Skeleton height={60} width={300} sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (!request) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6">Request not found</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/requests')} sx={{ mt: 2 }}>
                    Back to Requests
                </Button>
            </Box>
        );
    }

    return (
        <Box className="animate-fade-in">
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/requests')}
                        sx={{ mb: 2 }}
                    >
                        Back to Requests
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {request.subject}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Chip
                            label={request.status.replace('_', ' ')}
                            color={getStatusColor(request.status)}
                        />
                        <Chip
                            label={request.maintenanceType}
                            color={request.maintenanceType === 'CORRECTIVE' ? 'error' : 'info'}
                            variant="outlined"
                        />
                        <Rating value={request.priority} readOnly size="small" max={5} />
                    </Box>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Main Info */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Request Details
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                                            <BuildIcon color="primary" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Equipment</Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {request.equipment?.name || 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'warning.light' }}>
                                            <PersonIcon color="warning" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Created By</Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {request.createdBy?.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'success.light' }}>
                                            <PersonIcon color="success" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Technician</Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {request.technician?.name || 'Unassigned'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'info.light' }}>
                                            <ScheduleIcon color="info" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Scheduled Date</Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {request.scheduledDate
                                                    ? new Date(request.scheduledDate).toLocaleDateString()
                                                    : 'Not scheduled'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            {request.notes && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Notes</Typography>
                                    <Typography>{request.notes}</Typography>
                                </Box>
                            )}

                            {request.instructions && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Instructions</Typography>
                                    <Typography>{request.instructions}</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {/* Worksheets / Comments */}
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Worksheets & Comments
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {request.worksheets?.length > 0 ? (
                                <List disablePadding>
                                    {request.worksheets.map((ws) => (
                                        <ListItem key={ws.id} alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    {ws.author?.name?.charAt(0)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography fontWeight={600}>{ws.author?.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(ws.createdAt).toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={ws.content}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography color="text.secondary" sx={{ py: 2 }}>No comments yet</Typography>
                            )}

                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Add a comment..."
                                    size="small"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAddComment}
                                    disabled={submitting || !comment.trim()}
                                >
                                    <SendIcon />
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Actions Sidebar */}
                <Grid item xs={12} md={4}>
                    {/* Status Change */}
                    {(isTechnician() || isManager() || isAdmin()) && request.status !== 'SCRAP' && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Update Status
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {request.status === 'NEW' && (
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={() => handleStatusChange('IN_PROGRESS')}
                                            fullWidth
                                        >
                                            Start Work
                                        </Button>
                                    )}
                                    {request.status === 'IN_PROGRESS' && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleStatusChange('REPAIRED')}
                                            fullWidth
                                        >
                                            Mark as Repaired
                                        </Button>
                                    )}
                                    {request.status !== 'SCRAP' && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => {
                                                if (window.confirm('This will mark the equipment as scrapped. Continue?')) {
                                                    handleStatusChange('SCRAP');
                                                }
                                            }}
                                            fullWidth
                                        >
                                            Mark as Scrap
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Assign Technician */}
                    {(isManager() || isAdmin()) && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Assign Technician
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Technician</InputLabel>
                                    <Select
                                        value={request.technicianId || ''}
                                        label="Technician"
                                        onChange={(e) => handleAssignTechnician(e.target.value)}
                                    >
                                        {technicians.map((tech) => (
                                            <MenuItem key={tech.id} value={tech.id}>
                                                {tech.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    )}

                    {/* Self-Assign for Technicians */}
                    {user?.role === 'TECHNICIAN' && !request.technicianId && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => handleAssignTechnician(user.id)}
                                >
                                    Assign to Myself
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Info */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Additional Info
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">Category</Typography>
                                    <Typography fontWeight={500}>{request.category?.name || 'N/A'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">Team</Typography>
                                    <Typography fontWeight={500}>{request.team?.name || 'N/A'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">Created</Typography>
                                    <Typography fontWeight={500}>
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RequestDetailPage;
