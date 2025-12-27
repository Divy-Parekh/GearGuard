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
    Tooltip,
    Menu,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Skeleton,
    Badge,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Build as BuildIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import EquipmentFormDialog from '../../components/equipment/EquipmentFormDialog';

const EquipmentListPage = () => {
    const navigate = useNavigate();
    const { isAdmin, isManager } = useAuth();
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchEquipment();
    }, [page, rowsPerPage, search, statusFilter]);

    const fetchEquipment = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page + 1,
                limit: rowsPerPage,
            });
            if (search) params.append('search', search);
            if (statusFilter) params.append('status', statusFilter);

            const response = await api.get(`/equipment?${params}`);
            setEquipment(response.data.data.equipment);
            setTotal(response.data.pagination.total);
        } catch (error) {
            console.error('Failed to fetch equipment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedEquipment(item);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedEquipment(null);
    };

    const handleEdit = () => {
        setDialogOpen(true);
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        if (selectedEquipment && window.confirm('Are you sure you want to delete this equipment?')) {
            try {
                await api.delete(`/equipment/${selectedEquipment.id}`);
                fetchEquipment();
            } catch (error) {
                console.error('Failed to delete equipment:', error);
            }
        }
        handleMenuClose();
    };

    const handleDialogClose = (refresh) => {
        setDialogOpen(false);
        setSelectedEquipment(null);
        if (refresh) fetchEquipment();
    };

    const getStatusColor = (status) => {
        return status === 'ACTIVE' ? 'success' : 'error';
    };

    return (
        <Box className="animate-fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Equipment
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Manage all equipment and machinery
                    </Typography>
                </Box>
                {(isAdmin() || isManager()) && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setSelectedEquipment(null);
                            setDialogOpen(true);
                        }}
                    >
                        Add Equipment
                    </Button>
                )}
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search equipment..."
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
                                <MenuItem value="ACTIVE">Active</MenuItem>
                                <MenuItem value="SCRAPPED">Scrapped</MenuItem>
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
                                <TableCell>Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Maintenance</TableCell>
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
                                : equipment.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        hover
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/equipment/${item.id}`)}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 2,
                                                        bgcolor: 'primary.main',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <BuildIcon sx={{ color: 'white', fontSize: 20 }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                        {item.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.employeeName || 'Unassigned'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{item.category?.name || '-'}</TableCell>
                                        <TableCell>{item.team?.name || '-'}</TableCell>
                                        <TableCell>{item.location || '-'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={item.status}
                                                color={getStatusColor(item.status)}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="View maintenance requests">
                                                <Badge
                                                    badgeContent={item._count?.requests || 0}
                                                    color="primary"
                                                    sx={{ cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/equipment/${item.id}`);
                                                    }}
                                                >
                                                    <BuildIcon color="action" />
                                                </Badge>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMenuOpen(e, item);
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
                <MenuItem onClick={() => { navigate(`/equipment/${selectedEquipment?.id}`); handleMenuClose(); }}>
                    <ViewIcon fontSize="small" sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                {(isAdmin() || isManager()) && (
                    <>
                        <MenuItem onClick={handleEdit}>
                            <EditIcon fontSize="small" sx={{ mr: 1 }} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                            Delete
                        </MenuItem>
                    </>
                )}
            </Menu>

            {/* Form Dialog */}
            <EquipmentFormDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                equipment={selectedEquipment}
            />
        </Box>
    );
};

export default EquipmentListPage;
