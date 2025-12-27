import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Skeleton,
  Rating,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
  LinearProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

/* ---------------- CONFIG ---------------- */

const COLUMNS = [
  { id: "NEW", title: "New", color: "#1976d2", bg: "rgba(25,118,210,0.08)" },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    color: "#ed6c02",
    bg: "rgba(237,108,2,0.08)",
  },
  {
    id: "REPAIRED",
    title: "Repaired",
    color: "#2e7d32",
    bg: "rgba(46,125,50,0.08)",
  },
  { id: "SCRAP", title: "Scrap", color: "#d32f2f", bg: "rgba(211,47,47,0.08)" },
];

const VALID_TRANSITIONS = {
  NEW: ["IN_PROGRESS", "SCRAP"],
  IN_PROGRESS: ["REPAIRED", "SCRAP"],
  REPAIRED: ["SCRAP"],
  SCRAP: [],
};

/* ------------ KANBAN CARD ------------ */

const KanbanCard = ({ request, isDraggingOverlay = false }) => {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: request.id });

  const handleCardClick = () => {
    if (!isDragging) {
      navigate(`/requests/${request.id}`);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority >= 4) return "#d32f2f";
    if (priority === 3) return "#ed6c02";
    return "#2e7d32";
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      sx={{
        mb: 1.5,
        cursor: isDraggingOverlay ? "grabbing" : "grab",
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        borderLeft: `4px solid ${getPriorityColor(request.priority)}`,
        "&:hover": {
          boxShadow: isDraggingOverlay ? "none" : 4,
          transform: isDraggingOverlay ? "none" : "translateY(-2px)",
        },
        touchAction: "none",
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography fontWeight={600} noWrap variant="body2">
          {request.subject}
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5, mt: 1, flexWrap: "wrap" }}>
          <Chip
            size="small"
            label={request.maintenanceType}
            color={request.maintenanceType === "CORRECTIVE" ? "error" : "info"}
            variant="outlined"
          />
          <Rating value={request.priority} readOnly size="small" />
        </Box>

        {request.equipment && (
          <Typography variant="caption" color="text.secondary" noWrap>
            📦 {request.equipment.name}
          </Typography>
        )}

        {request.workCenter && (
          <Typography variant="caption" color="text.secondary" noWrap>
            🏢 {request.workCenter.name}
          </Typography>
        )}

        {request.technician && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
            <Avatar
              sx={{
                width: 20,
                height: 20,
                bgcolor: "#1976d2",
                fontSize: "0.75rem",
              }}
            >
              {request.technician.name?.[0]}
            </Avatar>
            <Typography variant="caption" noWrap>
              {request.technician.name}
            </Typography>
          </Box>
        )}

        {!request.technician && (
          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
            ⚠️ Unassigned
          </Typography>
        )}

        {request.scheduledDate && (
          <Typography variant="caption" color="text.secondary" noWrap>
            📅 {new Date(request.scheduledDate).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

/* ------------ KANBAN COLUMN ------------ */

const KanbanColumn = ({ column, requests, isLoading }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const totalRequests = requests.length;
  const assignedRequests = requests.filter((r) => r.technician).length;
  const unassignedRequests = requests.filter((r) => !r.technician).length;

  return (
    <Card
      ref={setNodeRef}
      sx={{
        minHeight: 550,
        bgcolor: column.bg,
        border: isOver
          ? `2px dashed ${column.color}`
          : `2px solid ${column.color}30`,
        transition: "border 0.2s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Column Header with Stats */}
        <Box sx={{ mb: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={700} color={column.color}>
              {column.title}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label={totalRequests}
                size="small"
                color={totalRequests > 0 ? "primary" : "default"}
              />
              {unassignedRequests > 0 && (
                <Chip
                  label={`${unassignedRequests} unassigned`}
                  size="small"
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          {/* Progress bar showing capacity */}
          {totalRequests > 0 && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={(assignedRequests / totalRequests) * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "rgba(0,0,0,0.1)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: column.color,
                  },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {assignedRequests}/{totalRequests} assigned
              </Typography>
            </Box>
          )}
        </Box>

        {/* Empty State */}
        {isLoading ? (
          <Box>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={100} sx={{ mb: 1.5 }} />
            ))}
          </Box>
        ) : totalRequests === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              color: "text.secondary",
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✨ No requests here
            </Typography>
            <Typography variant="caption">
              Drag requests from other columns
            </Typography>
          </Box>
        ) : (
          <SortableContext
            items={requests.map((r) => r.id)}
            strategy={verticalListSortingStrategy}
          >
            {requests.map((r) => (
              <KanbanCard key={r.id} request={r} />
            ))}
          </SortableContext>
        )}
      </CardContent>
    </Card>
  );
};

/* ------------ PAGE COMPONENT ------------ */

export default function KanbanPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    NEW: [],
    IN_PROGRESS: [],
    REPAIRED: [],
    SCRAP: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrapDialogOpen, setScrapDialogOpen] = useState(false);
  const [pendingScrap, setPendingScrap] = useState(null);
  const [updating, setUpdating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    fetchKanban();
  }, [user?.id]);

  const fetchKanban = async () => {
    try {
      setLoading(true);
      const res = await api.get("/requests/kanban");
      const raw = res.data.data.kanban;

      // ROLE FILTERING
      if (user.role === "TECHNICIAN") {
        const filtered = {};
        COLUMNS.forEach((c) => {
          filtered[c.id] = raw[c.id].filter((r) =>
            c.id === "NEW"
              ? !r.technicianId || r.technicianId === user.id
              : r.technicianId === user.id
          );
        });
        setData(filtered);
      } else if (user.role === "USER") {
        const filtered = {};
        COLUMNS.forEach((c) => {
          filtered[c.id] = raw[c.id].filter((r) => r.createdById === user.id);
        });
        setData(filtered);
      } else {
        setData(raw);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to load kanban board");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e) => setActiveId(e.active.id);

  const handleDragEnd = async ({ active, over }) => {
    setActiveId(null);
    if (!over) return;

    const from = Object.keys(data).find((k) =>
      data[k].some((r) => r.id === active.id)
    );
    const to = over.id;

    if (!from || !to || from === to) return;

    if (user.role === "USER") {
      alert("No permission to move requests");
      return;
    }

    // Check if request is unassigned (no technician)
    const request = data[from].find((r) => r.id === active.id);
    if (!request.technician && !request.technicianId) {
      alert(
        "⚠️ Unassigned request cannot be moved. Please assign a technician first."
      );
      return;
    }

    if (!VALID_TRANSITIONS[from].includes(to)) {
      alert("Invalid transition");
      return;
    }

    if (to === "SCRAP") {
      setPendingScrap({ requestId: active.id, from });
      setScrapDialogOpen(true);
      return;
    }

    await performStatusUpdate(active.id, from, to);
  };

  const performStatusUpdate = async (requestId, from, to) => {
    const moved = data[from].find((r) => r.id === requestId);
    setUpdating(true);

    try {
      await api.patch(`/requests/${requestId}/status`, { status: to });

      setData((prev) => ({
        ...prev,
        [from]: prev[from].filter((r) => r.id !== requestId),
        [to]: [...prev[to], { ...moved, status: to }],
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleScrapConfirm = async () => {
    if (!pendingScrap) return;
    await performStatusUpdate(
      pendingScrap.requestId,
      pendingScrap.from,
      "SCRAP"
    );
    setScrapDialogOpen(false);
    setPendingScrap(null);
  };

  const getFilteredData = () => {
    if (!searchTerm) return data;

    const filtered = {};
    COLUMNS.forEach((c) => {
      filtered[c.id] = data[c.id].filter(
        (r) =>
          r.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.equipment?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.workCenter?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.technician?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    return filtered;
  };

  const filteredData = getFilteredData();
  const totalRequests = Object.values(filteredData).flat().length;

  const activeItem = Object.values(data)
    .flat()
    .find((r) => r.id === activeId);

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Kanban Board
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalRequests} request{totalRequests !== 1 ? "s" : ""} found
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
          <IconButton
            onClick={fetchKanban}
            disabled={loading}
            title="Refresh kanban board"
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Grid container spacing={2}>
          {COLUMNS.map((c) => (
            <Grid item xs={12} lg={3} key={c.id}>
              <KanbanColumn
                column={c}
                requests={filteredData[c.id]}
                isLoading={loading}
              />
            </Grid>
          ))}
        </Grid>

        <DragOverlay>
          {activeItem && (
            <Card
              sx={{
                width: 280,
                boxShadow: 8,
                opacity: 0.9,
              }}
            >
              <CardContent>
                <Typography fontWeight={600} variant="body2">
                  {activeItem.subject}
                </Typography>
                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  <Chip size="small" label={activeItem.maintenanceType} />
                  <Rating value={activeItem.priority} readOnly size="small" />
                </Box>
              </CardContent>
            </Card>
          )}
        </DragOverlay>
      </DndContext>

      {/* Scrap Confirmation Dialog */}
      <Dialog open={scrapDialogOpen} onClose={() => setScrapDialogOpen(false)}>
        <DialogTitle>⚠️ Scrap Equipment?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this maintenance request as scrapped?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScrapDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleScrapConfirm}
            color="error"
            variant="contained"
            disabled={updating}
          >
            Confirm Scrap
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
