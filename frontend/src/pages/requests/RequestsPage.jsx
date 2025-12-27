import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    TablePagination,
    TextField,
    InputAdornment,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Skeleton,
    Rating,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ViewKanban as KanbanIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import RequestFormDialog from '../../components/requests/RequestFormDialog';

const RequestsPage = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, [page, rowsPerPage, search, statusFilter, typeFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page + 1,
                limit: rowsPerPage,
            });
            if (search) params.append('search', search);
            if (statusFilter) params.append('status', statusFilter);
            if (typeFilter) params.append('maintenanceType', typeFilter);

            const response = await api.get(`/requests?${params}`);
            setRequests(response.data.data.requests);
            setTotal(response.data.pagination.total);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedRequest(item);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRequest(null);
    };

    const handleDelete = async () => {
        if (selectedRequest && window.confirm('Are you sure you want to delete this request?')) {
            try {
                await api.delete(`/requests/${selectedRequest.id}`);
                fetchRequests();
            } catch (error) {
                console.error('Failed to delete request:', error);
            }
        }
        handleMenuClose();
    };

    const handleDialogClose = (refresh) => {
        setDialogOpen(false);
        setSelectedRequest(null);
        if (refresh) fetchRequests();
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

    const getTypeColor = (type) => {
        return type === 'CORRECTIVE' ? 'error' : 'info';
    };

    return (
        <Box className="animate-fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Maintenance Requests
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Track and manage all maintenance requests
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<KanbanIcon />}
                        onClick={() => navigate('/kanban')}
                    >
                        Kanban View
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setDialogOpen(true)}
                    >
                        New Request
                    </Button>
                </Box>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search requests..."
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ minWidth: 280 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="NEW">New</MenuItem>
                                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                                <MenuItem value="REPAIRED">Repaired</MenuItem>
                                <MenuItem value="SCRAP">Scrap</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={typeFilter}
                                label="Type"
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="CORRECTIVE">Corrective</MenuItem>
                                <MenuItem value="PREVENTIVE">Preventive</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Subject</TableCell>
                                <TableCell>Equipment</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Technician</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading
                                ? [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(7)].map((_, j) => (
                                            <TableCell key={j}>
                                                <Skeleton />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                                : requests.map((request) => (
                                    <TableRow
                                        key={request.id}
                                        hover
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/requests/${request.id}`)}
                                    >
                                        <TableCell>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                {request.subject}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                by {request.createdBy?.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{request.equipment?.name || '-'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={request.maintenanceType}
                                                color={getTypeColor(request.maintenanceType)}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={request.status.replace('_', ' ')}
                                                color={getStatusColor(request.status)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Rating value={request.priority} readOnly size="small" max={5} />
                                        </TableCell>
                                        <TableCell>{request.technician?.name || 'Unassigned'}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMenuOpen(e, request);
                                                }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </Card>

            {/* Context Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { navigate(`/requests/${selectedRequest?.id}`); handleMenuClose(); }}>
                    <ViewIcon fontSize="small" sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                {isAdmin() && (
                    <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        Delete
                    </MenuItem>
                )}
            </Menu>

            {/* Form Dialog */}
            <RequestFormDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                request={selectedRequest}
            />
        </Box>
    );
};

export default RequestsPage;
