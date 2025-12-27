import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    Divider,
    Alert,
    Chip,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
    const { user, refreshUser } = useAuth();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    const onSubmit = async (data) => {
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await api.put(`/users/${user.id}`, { name: data.name });
            await refreshUser();
            setSuccess('Profile updated successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="animate-fade-in">
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                My Profile
            </Typography>

            <Grid container spacing={3}>
                {/* Profile Card */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    mx: 'auto',
                                    mb: 2,
                                    fontSize: '2.5rem',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                            >
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                {user?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {user?.email}
                            </Typography>
                            <Chip
                                label={user?.role}
                                color="primary"
                                sx={{ fontWeight: 600 }}
                            />
                            {user?.company && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                    {user.company}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Edit Form */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Edit Profile
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            {...register('name', { required: 'Name is required' })}
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={user?.email}
                                            disabled
                                            helperText="Email cannot be changed"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Role"
                                            value={user?.role}
                                            disabled
                                            helperText="Contact admin to change role"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={loading}
                                            sx={{ mt: 1 }}
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfilePage;
