import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light mode
                primary: {
                    main: '#667eea',
                    light: '#8b9df5',
                    dark: '#4c5fd5',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#764ba2',
                    light: '#9b6fc4',
                    dark: '#5a3880',
                    contrastText: '#ffffff',
                },
                success: {
                    main: '#2e7d32',
                    light: '#4caf50',
                    dark: '#1b5e20',
                },
                warning: {
                    main: '#ed6c02',
                    light: '#ff9800',
                    dark: '#e65100',
                },
                error: {
                    main: '#d32f2f',
                    light: '#ef5350',
                    dark: '#c62828',
                },
                background: {
                    default: '#f5f7fb',
                    paper: '#ffffff',
                },
                grey: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#eeeeee',
                    300: '#e0e0e0',
                    400: '#bdbdbd',
                    500: '#9e9e9e',
                    600: '#757575',
                    700: '#616161',
                    800: '#424242',
                    900: '#212121',
                },
            }
            : {
                // Dark mode
                primary: {
                    main: '#8b9df5',
                    light: '#b3c1ff',
                    dark: '#667eea',
                    contrastText: '#000000',
                },
                secondary: {
                    main: '#b388ff',
                    light: '#d4b8ff',
                    dark: '#764ba2',
                    contrastText: '#000000',
                },
                success: {
                    main: '#66bb6a',
                    light: '#81c784',
                    dark: '#388e3c',
                },
                warning: {
                    main: '#ffa726',
                    light: '#ffb74d',
                    dark: '#f57c00',
                },
                error: {
                    main: '#f44336',
                    light: '#e57373',
                    dark: '#d32f2f',
                },
                background: {
                    default: '#121212',
                    paper: '#1e1e1e',
                },
                text: {
                    primary: '#ffffff',
                    secondary: 'rgba(255, 255, 255, 0.7)',
                },
            }),
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '0.875rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 6,
    },
    shadows: [
        'none',
        '0 1px 2px rgba(0,0,0,0.05)',
        '0 1px 3px rgba(0,0,0,0.08)',
        '0 2px 6px rgba(0,0,0,0.08)',
        '0 4px 8px rgba(0,0,0,0.08)',
        '0 6px 12px rgba(0,0,0,0.1)',
        '0 8px 16px rgba(0,0,0,0.1)',
        '0 12px 24px rgba(0,0,0,0.12)',
        '0 16px 32px rgba(0,0,0,0.12)',
        '0 20px 40px rgba(0,0,0,0.14)',
        '0 24px 48px rgba(0,0,0,0.14)',
        '0 28px 56px rgba(0,0,0,0.16)',
        '0 32px 64px rgba(0,0,0,0.16)',
        '0 36px 72px rgba(0,0,0,0.18)',
        '0 40px 80px rgba(0,0,0,0.18)',
        '0 44px 88px rgba(0,0,0,0.2)',
        '0 48px 96px rgba(0,0,0,0.2)',
        '0 52px 104px rgba(0,0,0,0.22)',
        '0 56px 112px rgba(0,0,0,0.22)',
        '0 60px 120px rgba(0,0,0,0.24)',
        '0 64px 128px rgba(0,0,0,0.24)',
        '0 68px 136px rgba(0,0,0,0.26)',
        '0 72px 144px rgba(0,0,0,0.26)',
        '0 76px 152px rgba(0,0,0,0.28)',
        '0 80px 160px rgba(0,0,0,0.28)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    padding: '10px 24px',
                    fontSize: '0.9375rem',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                    },
                },
                containedPrimary: {
                    background: mode === 'light'
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(135deg, #8b9df5 0%, #b388ff 100%)',
                    '&:hover': {
                        background: mode === 'light'
                            ? 'linear-gradient(135deg, #5a6fd6 0%, #6a4290 100%)'
                            : 'linear-gradient(135deg, #7a8de4 0%, #a277ee 100%)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: mode === 'light'
                        ? '0 1px 3px rgba(0, 0, 0, 0.08)'
                        : '0 1px 3px rgba(0, 0, 0, 0.3)',
                    border: mode === 'light'
                        ? '1px solid rgba(0, 0, 0, 0.06)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: mode === 'light'
                        ? '0 1px 3px rgba(0, 0, 0, 0.08)'
                        : '0 1px 3px rgba(0, 0, 0, 0.3)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 6,
                        backgroundColor: mode === 'light' ? '#fff' : 'rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: mode === 'light' ? '#667eea' : '#8b9df5',
                            },
                        },
                        '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: mode === 'light' ? '#667eea' : '#8b9df5',
                                borderWidth: '2px',
                            },
                        },
                    },
                    '& .MuiInputLabel-root': {
                        backgroundColor: mode === 'light' ? '#fff' : '#1e1e1e',
                        paddingLeft: '4px',
                        paddingRight: '4px',
                    },
                    '& .MuiFormHelperText-root': {
                        marginTop: '4px',
                        marginLeft: '2px',
                        minHeight: '20px',
                    },
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    '& .MuiFormHelperText-root': {
                        minHeight: '20px',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    fontWeight: 500,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    backgroundColor: mode === 'light' ? '#f8f9fa' : '#2a2a2a',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: mode === 'light'
                        ? '1px solid rgba(0, 0, 0, 0.08)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 0,
                    boxShadow: 'none',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    boxShadow: 'none',
                    borderBottom: mode === 'light'
                        ? '1px solid rgba(0, 0, 0, 0.08)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 8,
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 6,
                    boxShadow: mode === 'light'
                        ? '0 4px 16px rgba(0, 0, 0, 0.12)'
                        : '0 4px 16px rgba(0, 0, 0, 0.4)',
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    borderRadius: 4,
                    fontSize: '0.8125rem',
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: mode === 'light'
                        ? 'rgba(0, 0, 0, 0.08)'
                        : 'rgba(255, 255, 255, 0.08)',
                },
            },
        },
    },
});

// Default export for backward compatibility
export default getTheme('light');
