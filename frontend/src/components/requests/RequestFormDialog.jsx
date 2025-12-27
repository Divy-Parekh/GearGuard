import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Rating,
  Typography,
  Box,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const requestSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  maintenanceFor: z.enum(["EQUIPMENT", "WORKCENTER"]),
  equipmentId: z.string().optional(),
  workCenterId: z.string().optional(),
  categoryId: z.string().optional(),
  requestDate: z.any(),
  teamId: z.string().optional(),
  scheduledDate: z.any().optional(),
  duration: z.number().optional(),
  priority: z.number().min(1).max(5),
  company: z.string().optional(),
  notes: z.string().optional(),
});

const RequestFormDialog = ({ open, onClose, request, defaultEquipment }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [workCenters, setWorkCenters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      subject: user?.name || "",
      maintenanceFor: "EQUIPMENT",
      equipmentId: "",
      workCenterId: "",
      categoryId: "",
      requestDate: dayjs(),
      teamId: "",
      scheduledDate: null,
      duration: null,
      priority: 3,
      company: "GearGuard Inc.",
      notes: "",
    },
  });

  const watchMaintenanceFor = watch("maintenanceFor");
  const watchEquipment = watch("equipmentId");
  const watchWorkCenter = watch("workCenterId");

  useEffect(() => {
    if (open) {
      fetchData();
      if (request) {
        reset({
          subject: request.subject || user?.name || "",
          maintenanceFor: request.equipmentId ? "EQUIPMENT" : "WORKCENTER",
          equipmentId: request.equipmentId || "",
          workCenterId: request.workCenterId || "",
          categoryId: request.categoryId || "",
          requestDate: dayjs(request.requestDate) || dayjs(),
          teamId: request.teamId || "",
          scheduledDate: request.scheduledDate
            ? dayjs(request.scheduledDate)
            : null,
          duration: request.duration || null,
          priority: request.priority || 3,
          company: request.company || "GearGuard Inc.",
          notes: request.notes || "",
        });
      } else if (defaultEquipment) {
        reset({
          subject: user?.name || "",
          maintenanceFor: "EQUIPMENT",
          equipmentId: defaultEquipment.id || "",
          workCenterId: "",
          categoryId: defaultEquipment.categoryId || "",
          requestDate: dayjs(),
          teamId: defaultEquipment.teamId || "",
          scheduledDate: null,
          duration: null,
          priority: 3,
          company: "GearGuard Inc.",
          notes: "",
        });
      }
    }
  }, [open, request, defaultEquipment, reset, user?.name]);

  // Auto-select category and team when equipment/workcenter changes
  useEffect(() => {
    if (watchMaintenanceFor === "EQUIPMENT" && watchEquipment) {
      const selected = equipment.find((e) => e.id === watchEquipment);
      if (selected) {
        setValue("categoryId", selected.categoryId || "");
        setValue("teamId", selected.teamId || "");
      }
    } else if (watchMaintenanceFor === "WORKCENTER" && watchWorkCenter) {
      // For workcenter, don't set team (blocked)
      setValue("teamId", "");
    }
  }, [
    watchEquipment,
    watchWorkCenter,
    watchMaintenanceFor,
    equipment,
    setValue,
  ]);

  const fetchData = async () => {
    try {
      const [equipRes, wcRes, catRes, teamRes] = await Promise.all([
        api.get("/equipment?limit=100&status=ACTIVE"),
        api.get("/work-centers?limit=100"),
        api.get("/categories?limit=100"),
        api.get("/teams?limit=100"),
      ]);
      setEquipment(equipRes.data.data.equipment || []);
      setWorkCenters(wcRes.data.data.workCenters || []);
      setCategories(catRes.data.data.categories || []);
      setTeams(teamRes.data.data.teams || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      const submitData = {
        subject: data.subject,
        requestDate: data.requestDate.toISOString(),
        priority: data.priority,
        company: data.company,
        notes: data.notes,
      };

      if (data.maintenanceFor === "EQUIPMENT") {
        submitData.equipmentId = data.equipmentId;
        submitData.categoryId = data.categoryId;
        submitData.teamId = data.teamId;
      } else {
        submitData.workCenterId = data.workCenterId;
      }

      if (data.scheduledDate) {
        submitData.scheduledDate = data.scheduledDate.toISOString();
      }

      if (data.duration) {
        submitData.duration = data.duration;
      }

      if (request) {
        await api.put(`/requests/${request.id}`, submitData);
      } else {
        await api.post("/requests", submitData);
      }
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save request");
    } finally {
      setLoading(false);
    }
  };

  const selectedEquipment = equipment.find((e) => e.id === watchEquipment);
  const selectedCategory = categories.find((c) => c.id === watch("categoryId"));
  const selectedTeam = teams.find((t) => t.id === watch("teamId"));

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {request ? "Edit Request" : "Create Maintenance Request"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2.5}>
            {/* Subject - Auto-filled with current user name, not changeable */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject (Created By)"
                value={watch("subject")}
                disabled
                helperText="Automatically filled with your name"
              />
            </Grid>

            {/* Maintenance For - Equipment or WorkCenter */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="maintenanceFor"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Maintenance For</InputLabel>
                    <Select {...field} label="Maintenance For">
                      <MenuItem value="EQUIPMENT">Equipment</MenuItem>
                      <MenuItem value="WORKCENTER">Work Center</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Equipment/Workcenter Selection */}
            <Grid item xs={12} sm={6}>
              {watchMaintenanceFor === "EQUIPMENT" ? (
                <Controller
                  name="equipmentId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Equipment</InputLabel>
                      <Select {...field} label="Equipment">
                        <MenuItem value="">Select Equipment</MenuItem>
                        {equipment.map((eq) => (
                          <MenuItem key={eq.id} value={eq.id}>
                            {eq.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              ) : (
                <Controller
                  name="workCenterId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Work Center</InputLabel>
                      <Select {...field} label="Work Center">
                        <MenuItem value="">Select Work Center</MenuItem>
                        {workCenters.map((wc) => (
                          <MenuItem key={wc.id} value={wc.id}>
                            {wc.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              )}
            </Grid>

            {/* Category - Auto-selected for Equipment, hidden for Workcenter */}
            {watchMaintenanceFor === "EQUIPMENT" && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        {...field}
                        label="Category"
                        disabled={!!watchEquipment}
                      >
                        <MenuItem value="">Select Category</MenuItem>
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
            )}

            {/* Request Date - Current date, not changeable */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="requestDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Request Date"
                    value={field.value}
                    disabled
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Team - Auto-selected for Equipment, blocked for Workcenter */}
            {watchMaintenanceFor === "EQUIPMENT" && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="teamId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Team</InputLabel>
                      <Select
                        {...field}
                        label="Team"
                        disabled={!!watchEquipment}
                      >
                        <MenuItem value="">Select Team</MenuItem>
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
            )}

            {/* Scheduled Date */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="scheduledDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Scheduled Date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Duration */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (hours)"
                type="number"
                inputProps={{ min: 0, step: 0.5 }}
                {...register("duration", { valueAsNumber: true })}
              />
            </Grid>

            {/* Priority */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Priority
                    </Typography>
                    <Rating
                      {...field}
                      max={5}
                      size="large"
                      onChange={(_, value) => field.onChange(value || 1)}
                    />
                  </Box>
                )}
              />
            </Grid>

            {/* Company - Default value */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                {...register("company")}
                helperText="Default: GearGuard Inc."
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                {...register("notes")}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (
              <CircularProgress size={24} />
            ) : request ? (
              "Save Changes"
            ) : (
              "Create Request"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RequestFormDialog;
