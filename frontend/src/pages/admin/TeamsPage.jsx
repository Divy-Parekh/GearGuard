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
    Chip,
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
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PersonAdd as PersonAddIcon,
    PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const TeamsPage = () => {
    const { isAdmin } = useAuth();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [membersDialogOpen, setMembersDialogOpen] = useState(false);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchTeams();
    }, [search]);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            const response = await api.get(`/teams?${params}`);
            setTeams(response.data.data.teams);
        } catch (error) {
            console.error('Failed to fetch teams:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            const response = await api.get('/users?limit=100');
            setAvailableUsers(response.data.data.users.filter(u => !u.teamId || u.teamId === selectedTeam?.id));
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const handleMenuOpen = (event, team) => {
        setAnchorEl(event.currentTarget);
        setSelectedTeam(team);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        reset({ name: selectedTeam.name, company: selectedTeam.company || '' });
        setDialogOpen(true);
        setAnchorEl(null);
    };

    const handleManageMembers = () => {
        fetchAvailableUsers();
        setMembersDialogOpen(true);
        setAnchorEl(null);
    };

    const handleCreate = () => {
        setSelectedTeam(null);
        reset({ name: '', company: '' });
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (selectedTeam && window.confirm('Are you sure you want to delete this team?')) {
            try {
                await api.delete(`/teams/${selectedTeam.id}`);
                fetchTeams();
            } catch (error) {
                console.error('Failed to delete team:', error);
            }
        }
        handleMenuClose();
    };

    const onSubmit = async (data) => {
        setError('');
        setSubmitting(true);
        try {
            if (selectedTeam) {
                await api.put(`/teams/${selectedTeam.id}`, data);
            } else {
                await api.post('/teams', data);
            }
            setDialogOpen(false);
            fetchTeams();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save team');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAllocateMember = async () => {
        if (!selectedUserId) return;
        try {
            await api.post(`/teams/${selectedTeam.id}/members`, { userId: selectedUserId });
            setSelectedUserId('');
            fetchTeams();
            fetchAvailableUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add member');
        }
    };

    const handleDeallocateMember = async (userId) => {
        try {
            await api.delete(`/teams/${selectedTeam.id}/members/${userId}`);
            fetchTeams();
            fetchAvailableUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to remove member');
        }
    };

    return (
        <Box className="animate-fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Teams</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Manage maintenance teams and members
                    </Typography>
                </Box>
                {isAdmin() && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                        Add Team
                    </Button>
                )}
            </Box>

            {/* Search */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ py: 2 }}>
                    <TextField
                        placeholder="Search teams..."
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
                                <TableCell>Company</TableCell>
                                <TableCell>Members</TableCell>
                                <TableCell>Equipment</TableCell>
                                <TableCell>Requests</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading
                                ? [...Array(3)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(6)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}
                                    </TableRow>
                                ))
                                : teams.map((team) => (
                                    <TableRow key={team.id} hover>
                                        <TableCell><Typography fontWeight={600}>{team.name}</Typography></TableCell>
                                        <TableCell>{team.company || '-'}</TableCell>
                                        <TableCell>
                                            <Chip size="small" label={team.members?.length || 0} color="primary" variant="outlined" />
                                        </TableCell>
                                        <TableCell>{team._count?.equipment || 0}</TableCell>
                                        <TableCell>{team._count?.requests || 0}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, team)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Context Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleManageMembers}><PersonAddIcon fontSize="small" sx={{ mr: 1 }} />Manage Members</MenuItem>
                {isAdmin() && (
                    <>
                        <MenuItem onClick={handleEdit}><EditIcon fontSize="small" sx={{ mr: 1 }} />Edit</MenuItem>
                        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />Delete
                        </MenuItem>
                    </>
                )}
            </Menu>

            {/* Team Form Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {selectedTeam ? 'Edit Team' : 'Add Team'}
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Team Name" {...register('name', { required: 'Name is required' })} error={!!errors.name} helperText={errors.name?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Company" {...register('company')} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5 }}>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={submitting}>
                            {selectedTeam ? 'Save' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Manage Members Dialog */}
            <Dialog open={membersDialogOpen} onClose={() => setMembersDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    Manage Members - {selectedTeam?.name}
                </DialogTitle>
                <DialogContent>
                    {/* Add Member */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Add User</InputLabel>
                            <Select
                                value={selectedUserId}
                                label="Add User"
                                onChange={(e) => setSelectedUserId(e.target.value)}
                            >
                                {availableUsers.filter(u => !selectedTeam?.members?.some(m => m.id === u.id)).map((user) => (
                                    <MenuItem key={user.id} value={user.id}>{user.name} ({user.role})</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" onClick={handleAllocateMember} disabled={!selectedUserId}>
                            Add
                        </Button>
                    </Box>

                    {/* Current Members */}
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Current Members</Typography>
                    <List dense>
                        {selectedTeam?.members?.map((member) => (
                            <ListItem key={member.id}>
                                <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                                    {member.name?.charAt(0)}
                                </Avatar>
                                <ListItemText primary={member.name} secondary={member.role} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" size="small" onClick={() => handleDeallocateMember(member.id)}>
                                        <PersonRemoveIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                        {(!selectedTeam?.members || selectedTeam.members.length === 0) && (
                            <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                                No members yet
                            </Typography>
                        )}
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setMembersDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TeamsPage;
