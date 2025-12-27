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
    TablePagination,
    TextField,
    InputAdornment,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    Skeleton,
    Alert,
    Grid,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import api from '../../services/api';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchUsers();
        fetchTeams();
    }, [page, rowsPerPage, search, roleFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page + 1,
                limit: rowsPerPage,
            });
            if (search) params.append('search', search);
            if (roleFilter) params.append('role', roleFilter);

            const response = await api.get(`/users?${params}`);
            setUsers(response.data.data.users);
            setTotal(response.data.pagination.total);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await api.get('/teams?limit=100');
            setTeams(response.data.data.teams);
        } catch (error) {
            console.error('Failed to fetch teams:', error);
        }
    };

    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        reset({
            name: selectedUser.name,
            email: selectedUser.email,
            role: selectedUser.role,
            teamId: selectedUser.teamId || '',
        });
        setDialogOpen(true);
        setAnchorEl(null);
    };

    const handleCreate = () => {
        setSelectedUser(null);
        reset({ name: '', email: '', password: '', role: 'USER', teamId: '' });
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (selectedUser && window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${selectedUser.id}`);
                fetchUsers();
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
        handleMenuClose();
    };

    const onSubmit = async (data) => {
        setError('');
        setSubmitting(true);
        try {
            const submitData = { ...data };
            if (submitData.teamId === '') delete submitData.teamId;

            if (selectedUser) {
                delete submitData.password;
                await api.put(`/users/${selectedUser.id}`, submitData);
            } else {
                await api.post('/users', submitData);
            }
            setDialogOpen(false);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save user');
        } finally {
            setSubmitting(false);
        }
    };

    const getRoleColor = (role) => {
        const colors = { ADMIN: 'error', MANAGER: 'warning', TECHNICIAN: 'info', USER: 'default' };
        return colors[role] || 'default';
    };

    return (
        <Box className="animate-fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Users</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Manage system users and roles
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                    Add User
                </Button>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search users..."
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ minWidth: 280 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                            }}
                        />
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Role</InputLabel>
                            <Select value={roleFilter} label="Role" onChange={(e) => setRoleFilter(e.target.value)}>
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="ADMIN">Admin</MenuItem>
                                <MenuItem value="MANAGER">Manager</MenuItem>
                                <MenuItem value="TECHNICIAN">Technician</MenuItem>
                                <MenuItem value="USER">User</MenuItem>
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
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading
                                ? [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}
                                    </TableRow>
                                ))
                                : users.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>
                                            <Typography fontWeight={600}>{user.name}</Typography>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip size="small" label={user.role} color={getRoleColor(user.role)} />
                                        </TableCell>
                                        <TableCell>{user.team?.name || '-'}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
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
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                />
            </Card>

            {/* Context Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}><EditIcon fontSize="small" sx={{ mr: 1 }} />Edit</MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />Delete
                </MenuItem>
            </Menu>

            {/* Form Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {selectedUser ? 'Edit User' : 'Add User'}
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Name" {...register('name', { required: 'Name is required' })} error={!!errors.name} helperText={errors.name?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Email" type="email" {...register('email', { required: 'Email is required' })} error={!!errors.email} helperText={errors.email?.message} />
                            </Grid>
                            {!selectedUser && (
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Password" type="password" {...register('password', { required: 'Password is required' })} error={!!errors.password} helperText={errors.password?.message} />
                                </Grid>
                            )}
                            <Grid item xs={12} sm={6}>
                                <Controller name="role" control={control} defaultValue="USER" render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Role</InputLabel>
                                        <Select {...field} label="Role">
                                            <MenuItem value="USER">User</MenuItem>
                                            <MenuItem value="TECHNICIAN">Technician</MenuItem>
                                            <MenuItem value="MANAGER">Manager</MenuItem>
                                            <MenuItem value="ADMIN">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                )} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller name="teamId" control={control} defaultValue="" render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Team</InputLabel>
                                        <Select {...field} label="Team">
                                            <MenuItem value="">None</MenuItem>
                                            {teams.map((team) => <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                )} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5 }}>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={submitting}>
                            {selectedUser ? 'Save' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default UsersPage;
