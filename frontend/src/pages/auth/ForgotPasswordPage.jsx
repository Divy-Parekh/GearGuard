import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import { Email as EmailIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

const ForgotPasswordPage = () => {
    const { forgotPassword } = useAuth();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data) => {
        setError('');
        setLoading(true);
        try {
            await forgotPassword(data.email);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 2,
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    {/* Back Link */}
                    <Link
                        component={RouterLink}
                        to="/login"
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            textDecoration: 'none',
                            color: 'text.secondary',
                            mb: 3,
                            '&:hover': { color: 'primary.main' },
                        }}
                    >
                        <ArrowBackIcon fontSize="small" />
                        Back to login
                    </Link>

                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2,
                            }}
                        >
                            <EmailIcon sx={{ color: 'white', fontSize: 28 }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            Forgot Password?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Enter your email to receive a reset link
                        </Typography>
                    </Box>

                    <Box sx={{ minHeight: 56, mb: 2 }}>
                        {success ? (
                            <Alert severity="success" sx={{ borderRadius: 1 }}>
                                If an account exists with this email, you will receive a password reset link shortly.
                            </Alert>
                        ) : error ? (
                            <Alert severity="error" sx={{ borderRadius: 1 }}>
                                {error}
                            </Alert>
                        ) : null}
                    </Box>

                    {!success && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    {...register('email')}
                                    error={!!errors.email}
                                    helperText={errors.email?.message || ' '}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{ py: 1.5 }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                                </Button>
                            </Box>
                        </form>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ForgotPasswordPage;
