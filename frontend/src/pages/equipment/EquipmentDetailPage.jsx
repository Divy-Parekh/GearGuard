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
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Skeleton,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Build as BuildIcon,
    Assignment as AssignmentIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    Groups as GroupsIcon,
    Category as CategoryIcon,
    Factory as FactoryIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import EquipmentFormDialog from '../../components/equipment/EquipmentFormDialog';
import RequestFormDialog from '../../components/requests/RequestFormDialog';

const EquipmentDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin, isManager } = useAuth();
    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [requestDialogOpen, setRequestDialogOpen] = useState(false);

    useEffect(() => {
        fetchEquipment();
    }, [id]);

    const fetchEquipment = async () => {
        try {
            const response = await api.get(`/equipment/${id}`);
            setEquipment(response.data.data.equipment);
        } catch (error) {
            console.error('Failed to fetch equipment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClose = (refresh) => {
        setEditDialogOpen(false);
        if (refresh) fetchEquipment();
    };

    const handleRequestClose = (refresh) => {
        setRequestDialogOpen(false);
        if (refresh) fetchEquipment();
    };

    const InfoItem = ({ icon, label, value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="caption" color="text.secondary">
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {value || '-'}
                </Typography>
            </Box>
        </Box>
    );

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

    if (!equipment) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6">Equipment not found</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/equipment')} sx={{ mt: 2 }}>
                    Back to Equipment
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
                        onClick={() => navigate('/equipment')}
                        sx={{ mb: 2 }}
                    >
                        Back to Equipment
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <BuildIcon sx={{ color: 'white', fontSize: 32 }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {equipment.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Chip
                                    size="small"
                                    label={equipment.status}
                                    color={equipment.status === 'ACTIVE' ? 'success' : 'error'}
                                />
                                {equipment._count?.requests > 0 && (
                                    <Chip
                                        size="small"
                                        label={`${equipment._count.requests} Request${equipment._count.requests > 1 ? 's' : ''}`}
                                        color="primary"
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setRequestDialogOpen(true)}
                    >
                        Create Request
                    </Button>
                    {(isAdmin() || isManager()) && (
                        <IconButton onClick={() => setEditDialogOpen(true)}>
                            <EditIcon />
                        </IconButton>
                    )}
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Details */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Equipment Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<CategoryIcon sx={{ color: 'primary.main' }} />}
                                        label="Category"
                                        value={equipment.category?.name}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<GroupsIcon sx={{ color: 'primary.main' }} />}
                                        label="Maintenance Team"
                                        value={equipment.team?.name}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<PersonIcon sx={{ color: 'primary.main' }} />}
                                        label="Technician"
                                        value={equipment.technician?.name}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<LocationIcon sx={{ color: 'primary.main' }} />}
                                        label="Location"
                                        value={equipment.location}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<FactoryIcon sx={{ color: 'primary.main' }} />}
                                        label="Work Center"
                                        value={equipment.workCenter?.name}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<PersonIcon sx={{ color: 'primary.main' }} />}
                                        label="Used By"
                                        value={equipment.employeeName}
                                    />
                                </Grid>
                            </Grid>

                            {equipment.description && (
                                <>
                                    <Divider sx={{ my: 3 }} />
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Description
                                    </Typography>
                                    <Typography>{equipment.description}</Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Requests */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Maintenance Requests
                                </Typography>
                                <Chip size="small" label={equipment._count?.requests || 0} color="primary" />
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            {equipment.requests?.length > 0 ? (
                                <List disablePadding>
                                    {equipment.requests.map((request, index) => (
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
                                                            bgcolor:
                                                                request.status === 'NEW'
                                                                    ? 'primary.main'
                                                                    : request.status === 'IN_PROGRESS'
                                                                        ? 'warning.main'
                                                                        : request.status === 'REPAIRED'
                                                                            ? 'success.main'
                                                                            : 'error.main',
                                                        }}
                                                    >
                                                        <AssignmentIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={request.subject}
                                                    secondary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                            <Chip
                                                                size="small"
                                                                label={request.status.replace('_', ' ')}
                                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                                            />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {'★'.repeat(request.priority)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    primaryTypographyProps={{ fontWeight: 500, noWrap: true }}
                                                />
                                            </ListItem>
                                            {index < equipment.requests.length - 1 && <Divider />}
                                        </Box>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">No maintenance requests yet</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Dialogs */}
            <EquipmentFormDialog
                open={editDialogOpen}
                onClose={handleEditClose}
                equipment={equipment}
            />
            <RequestFormDialog
                open={requestDialogOpen}
                onClose={handleRequestClose}
                defaultEquipment={equipment}
            />
        </Box>
    );
};

export default EquipmentDetailPage;
