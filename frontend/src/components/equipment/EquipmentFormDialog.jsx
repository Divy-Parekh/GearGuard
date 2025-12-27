import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import api from '../../services/api';

const equipmentSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    categoryId: z.string().optional(),
    teamId: z.string().optional(),
    technicianId: z.string().optional(),
    workCenterId: z.string().optional(),
    location: z.string().optional(),
    employeeName: z.string().optional(),
    description: z.string().optional(),
});

const EquipmentFormDialog = ({ open, onClose, equipment }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [teams, setTeams] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [workCenters, setWorkCenters] = useState([]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(equipmentSchema),
        defaultValues: {
            name: '',
            categoryId: '',
            teamId: '',
            technicianId: '',
            workCenterId: '',
            location: '',
            employeeName: '',
            description: '',
        },
    });

    useEffect(() => {
        if (open) {
            fetchOptions();
            if (equipment) {
                reset({
                    name: equipment.name || '',
                    categoryId: equipment.categoryId || '',
                    teamId: equipment.teamId || '',
                    technicianId: equipment.technicianId || '',
                    workCenterId: equipment.workCenterId || '',
                    location: equipment.location || '',
                    employeeName: equipment.employeeName || '',
                    description: equipment.description || '',
                });
            } else {
                reset({
                    name: '',
                    categoryId: '',
                    teamId: '',
                    technicianId: '',
                    workCenterId: '',
                    location: '',
                    employeeName: '',
                    description: '',
                });
            }
        }
    }, [open, equipment, reset]);

    const fetchOptions = async () => {
        try {
            const [categoriesRes, teamsRes, techniciansRes, workCentersRes] = await Promise.all([
                api.get('/categories?limit=100'),
                api.get('/teams?limit=100'),
                api.get('/users/technicians'),
                api.get('/work-centers?limit=100'),
            ]);
            setCategories(categoriesRes.data.data.categories);
            setTeams(teamsRes.data.data.teams);
            setTechnicians(techniciansRes.data.data.technicians);
            setWorkCenters(workCentersRes.data.data.workCenters);
        } catch (error) {
            console.error('Failed to fetch options:', error);
        }
    };

    const onSubmit = async (data) => {
        setError('');
        setLoading(true);
        try {
            // Clean empty strings
            const cleanData = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== '')
            );

            if (equipment) {
                await api.put(`/equipment/${equipment.id}`, cleanData);
            } else {
                await api.post('/equipment', cleanData);
            }
            onClose(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save equipment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>
                {equipment ? 'Edit Equipment' : 'Add Equipment'}
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Equipment Name"
                                {...register('name')}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Category</InputLabel>
                                        <Select {...field} label="Category">
                                            <MenuItem value="">None</MenuItem>
                                            {categories.map((cat) => (
                                                <MenuItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="teamId"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Maintenance Team</InputLabel>
                                        <Select {...field} label="Maintenance Team">
                                            <MenuItem value="">None</MenuItem>
                                            {teams.map((team) => (
                                                <MenuItem key={team.id} value={team.id}>
                                                    {team.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="technicianId"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Technician</InputLabel>
                                        <Select {...field} label="Technician">
                                            <MenuItem value="">None</MenuItem>
                                            {technicians.map((tech) => (
                                                <MenuItem key={tech.id} value={tech.id}>
                                                    {tech.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="workCenterId"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Work Center</InputLabel>
                                        <Select {...field} label="Work Center">
                                            <MenuItem value="">None</MenuItem>
                                            {workCenters.map((wc) => (
                                                <MenuItem key={wc.id} value={wc.id}>
                                                    {wc.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Location"
                                {...register('location')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Employee Name"
                                {...register('employeeName')}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                {...register('description')}
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => onClose(false)}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : equipment ? 'Save Changes' : 'Add Equipment'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EquipmentFormDialog;
