import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Skeleton,
    Alert,
    Grid,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const WorkCentersPage = () => {
    const { isAdmin } = useAuth();
    const [workCenters, setWorkCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedWorkCenter, setSelectedWorkCenter] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchWorkCenters();
    }, [search]);

    const fetchWorkCenters = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            const response = await api.get(`/work-centers?${params}`);
            setWorkCenters(response.data.data.workCenters);
        } catch (error) {
            console.error('Failed to fetch work centers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, wc) => {
        setAnchorEl(event.currentTarget);
        setSelectedWorkCenter(wc);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        reset({
            name: selectedWorkCenter.name,
            code: selectedWorkCenter.code,
            tag: selectedWorkCenter.tag || '',
            costPerHour: selectedWorkCenter.costPerHour || '',
            capacity: selectedWorkCenter.capacity || '',
            timeEfficiency: selectedWorkCenter.timeEfficiency || 100,
            oeeTarget: selectedWorkCenter.oeeTarget || 85,
        });
        setDialogOpen(true);
        setAnchorEl(null);
    };

    const handleCreate = () => {
        setSelectedWorkCenter(null);
        reset({ name: '', code: '', tag: '', costPerHour: '', capacity: '', timeEfficiency: 100, oeeTarget: 85 });
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (selectedWorkCenter && window.confirm('Are you sure you want to delete this work center?')) {
            try {
                await api.delete(`/work-centers/${selectedWorkCenter.id}`);
                fetchWorkCenters();
            } catch (error) {
                console.error('Failed to delete work center:', error);
            }
        }
        handleMenuClose();
    };

    const onSubmit = async (data) => {
        setError('');
        setSubmitting(true);
        try {
            const submitData = {
                ...data,
                costPerHour: data.costPerHour ? parseFloat(data.costPerHour) : undefined,
                capacity: data.capacity ? parseInt(data.capacity) : undefined,
                timeEfficiency: data.timeEfficiency ? parseFloat(data.timeEfficiency) : undefined,
                oeeTarget: data.oeeTarget ? parseFloat(data.oeeTarget) : undefined,
            };

            if (selectedWorkCenter) {
                await api.put(`/work-centers/${selectedWorkCenter.id}`, submitData);
            } else {
                await api.post('/work-centers', submitData);
            }
            setDialogOpen(false);
            fetchWorkCenters();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save work center');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box className="animate-fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Work Centers</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Manage production work centers
                    </Typography>
                </Box>
                {isAdmin() && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                        Add Work Center
                    </Button>
                )}
            </Box>

            {/* Search */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ py: 2 }}>
                    <TextField
                        placeholder="Search work centers..."
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ minWidth: 280 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                        }}
                    />
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Code</TableCell>
                                <TableCell>Tag</TableCell>
                                <TableCell>Cost/Hour</TableCell>
                                <TableCell>Capacity</TableCell>
                                <TableCell>Efficiency</TableCell>
                                <TableCell>OEE Target</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading
                                ? [...Array(3)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(8)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}
                                    </TableRow>
                                ))
                                : workCenters.map((wc) => (
                                    <TableRow key={wc.id} hover>
                                        <TableCell><Typography fontWeight={600}>{wc.name}</Typography></TableCell>
                                        <TableCell><Chip size="small" label={wc.code} /></TableCell>
                                        <TableCell>{wc.tag || '-'}</TableCell>
                                        <TableCell>{wc.costPerHour ? `$${wc.costPerHour}` : '-'}</TableCell>
                                        <TableCell>{wc.capacity || '-'}</TableCell>
                                        <TableCell>{wc.timeEfficiency ? `${wc.timeEfficiency}%` : '-'}</TableCell>
                                        <TableCell>{wc.oeeTarget ? `${wc.oeeTarget}%` : '-'}</TableCell>
                                        <TableCell align="right">
                                            {isAdmin() && (
                                                <IconButton size="small" onClick={(e) => handleMenuOpen(e, wc)}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Context Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}><EditIcon fontSize="small" sx={{ mr: 1 }} />Edit</MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />Delete
                </MenuItem>
            </Menu>

            {/* Form Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {selectedWorkCenter ? 'Edit Work Center' : 'Add Work Center'}
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Name" {...register('name', { required: 'Name is required' })} error={!!errors.name} helperText={errors.name?.message} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Code" {...register('code', { required: 'Code is required' })} error={!!errors.code} helperText={errors.code?.message} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Tag" {...register('tag')} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Cost Per Hour ($)" type="number" {...register('costPerHour')} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Capacity" type="number" {...register('capacity')} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Time Efficiency (%)" type="number" {...register('timeEfficiency')} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="OEE Target (%)" type="number" {...register('oeeTarget')} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5 }}>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={submitting}>
                            {selectedWorkCenter ? 'Save' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default WorkCentersPage;
