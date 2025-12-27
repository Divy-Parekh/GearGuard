import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Skeleton,
    Button,
    ButtonGroup,
    IconButton,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Today as TodayIcon,
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../services/api';
import RequestFormDialog from '../components/requests/RequestFormDialog';

const CalendarPage = () => {
    const calendarRef = useRef(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentView, setCurrentView] = useState('dayGridMonth');
    const [currentTitle, setCurrentTitle] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/requests/calendar');
            setEvents(response.data.data.events);
        } catch (error) {
            console.error('Failed to fetch calendar events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateClick = (info) => {
        setSelectedDate(info.date);
        setDialogOpen(true);
    };

    const handleEventClick = (info) => {
        window.location.href = `/requests/${info.event.id}`;
    };

    const handleDialogClose = (refresh) => {
        setDialogOpen(false);
        setSelectedDate(null);
        if (refresh) fetchEvents();
    };

    const getCalendarApi = () => calendarRef.current?.getApi();

    const handlePrev = () => {
        getCalendarApi()?.prev();
        updateTitle();
    };

    const handleNext = () => {
        getCalendarApi()?.next();
        updateTitle();
    };

    const handleToday = () => {
        getCalendarApi()?.today();
        updateTitle();
    };

    const handleViewChange = (view) => {
        setCurrentView(view);
        getCalendarApi()?.changeView(view);
        updateTitle();
    };

    const updateTitle = () => {
        setTimeout(() => {
            setCurrentTitle(getCalendarApi()?.view?.title || '');
        }, 10);
    };

    const handleDatesSet = (info) => {
        setCurrentTitle(info.view.title);
    };

    if (loading) {
        return (
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>Calendar</Typography>
                <Skeleton variant="rectangular" height={600} sx={{ borderRadius: 2 }} />
            </Box>
        );
    }

    return (
        <Box className="animate-fade-in">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Maintenance Calendar
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    View and schedule preventive maintenance
                </Typography>
            </Box>

            {/* Legend */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ py: 1.5, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: '#1976d2' }} />
                        <Typography variant="body2">Assigned</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: '#ed6c02' }} />
                        <Typography variant="body2">Unassigned</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: '#d32f2f' }} />
                        <Typography variant="body2">Overdue</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: '#2e7d32' }} />
                        <Typography variant="body2">Completed</Typography>
                    </Box>
                </CardContent>
            </Card>

            <Card>
                <CardContent sx={{ p: 2 }}>
                    {/* Custom Toolbar */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        flexWrap: 'wrap',
                        gap: 2,
                    }}>
                        {/* Navigation */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                                size="small"
                                onClick={handlePrev}
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={handleNext}
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                }}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<TodayIcon />}
                                onClick={handleToday}
                                sx={{ ml: 1 }}
                            >
                                Today
                            </Button>
                        </Box>

                        {/* Title */}
                        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1, textAlign: 'center' }}>
                            {currentTitle}
                        </Typography>

                        {/* View Selector */}
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select
                                value={currentView}
                                onChange={(e) => handleViewChange(e.target.value)}
                                sx={{
                                    '& .MuiSelect-select': { py: 0.75 },
                                }}
                            >
                                <MenuItem value="dayGridMonth">Month</MenuItem>
                                <MenuItem value="timeGridWeek">Week</MenuItem>
                                <MenuItem value="timeGridDay">Day</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Calendar */}
                    <Box sx={{
                        '& .fc': {
                            fontFamily: '"Inter", sans-serif',
                        },
                        '& .fc-toolbar': {
                            display: 'none',
                        },
                        '& .fc-header-toolbar': {
                            display: 'none',
                        },
                        '& .fc-daygrid-day': {
                            cursor: 'pointer',
                        },
                        '& .fc-daygrid-day:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.03)',
                        },
                        '& .fc-event': {
                            borderRadius: 4,
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            px: 1,
                        },
                        '& .fc-daygrid-event': {
                            marginTop: 2,
                        },
                        '& .fc-col-header-cell': {
                            py: 1.5,
                            bgcolor: '#f8f9fa',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                        },
                        '& .fc-day-today': {
                            bgcolor: 'transparent !important',
                        },
                        '& .fc-day-today .fc-daygrid-day-number': {
                            color: '#667eea',
                            fontWeight: 700,
                        },
                        '& .fc-timegrid-slot': {
                            height: 48,
                        },
                        '& .fc-scrollgrid': {
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            overflow: 'hidden',
                        },
                        '& .fc-scrollgrid td, & .fc-scrollgrid th': {
                            borderColor: 'divider',
                        },
                    }}>
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={false}
                            events={events}
                            dateClick={handleDateClick}
                            eventClick={handleEventClick}
                            datesSet={handleDatesSet}
                            height="auto"
                            dayMaxEvents={3}
                            eventDisplay="block"
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                meridiem: 'short',
                            }}
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* Create Request Dialog */}
            <RequestFormDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                defaultEquipment={null}
            />
        </Box>
    );
};

export default CalendarPage;
