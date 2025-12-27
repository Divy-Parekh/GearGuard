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

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchCategories();
    }, [search]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            const response = await api.get(`/categories?${params}`);
            setCategories(response.data.data.categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, category) => {
        setAnchorEl(event.currentTarget);
        setSelectedCategory(category);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        reset({
            name: selectedCategory.name,
            responsible: selectedCategory.responsible || '',
            company: selectedCategory.company || '',
        });
        setDialogOpen(true);
        setAnchorEl(null);
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        reset({ name: '', responsible: '', company: '' });
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (selectedCategory && window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/categories/${selectedCategory.id}`);
                fetchCategories();
            } catch (error) {
                console.error('Failed to delete category:', error);
            }
        }
        handleMenuClose();
    };

    const onSubmit = async (data) => {
        setError('');
        setSubmitting(true);
        try {
            if (selectedCategory) {
                await api.put(`/categories/${selectedCategory.id}`, data);
            } else {
                await api.post('/categories', data);
            }
            setDialogOpen(false);
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box className="animate-fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Categories</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Manage equipment categories
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                    Add Category
                </Button>
            </Box>

            {/* Search */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ py: 2 }}>
                    <TextField
                        placeholder="Search categories..."
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
                                <TableCell>Responsible</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading
                                ? [...Array(3)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(4)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}
                                    </TableRow>
                                ))
                                : categories.map((category) => (
                                    <TableRow key={category.id} hover>
                                        <TableCell><Typography fontWeight={600}>{category.name}</Typography></TableCell>
                                        <TableCell>{category.responsible || '-'}</TableCell>
                                        <TableCell>{category.company || '-'}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, category)}>
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
                <MenuItem onClick={handleEdit}><EditIcon fontSize="small" sx={{ mr: 1 }} />Edit</MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />Delete
                </MenuItem>
            </Menu>

            {/* Form Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {selectedCategory ? 'Edit Category' : 'Add Category'}
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Category Name" {...register('name', { required: 'Name is required' })} error={!!errors.name} helperText={errors.name?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Responsible" {...register('responsible')} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Company" {...register('company')} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5 }}>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={submitting}>
                            {selectedCategory ? 'Save' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default CategoriesPage;
