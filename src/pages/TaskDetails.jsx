import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Paper,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Avatar,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { format, differenceInMinutes, startOfDay } from 'date-fns';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';

// Creative Timer Component
const WorkTimer = ({ taskId, onTimeLogged }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [description, setDescription] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setStartTime(Date.now());
    setIsRunning(true);
    setElapsedTime(0);
  };

  const handleStop = () => {
    setIsRunning(false);
    setOpenDialog(true);
  };

  const handleSaveTime = async () => {
    try {
      const hoursSpent = elapsedTime / (1000 * 60 * 60);
      await axios.post(`/api/tasks/${taskId}/time-entries`, {
        hours_spent: hoursSpent.toFixed(2),
        work_date: format(new Date(), 'yyyy-MM-dd'),
        description
      });
      
      setOpenDialog(false);
      setDescription('');
      setElapsedTime(0);
      setStartTime(null);
      onTimeLogged();
    } catch (err) {
      console.error('Error saving time entry:', err);
    }
  };

  return (
    <Card sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      mb: 3 
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TimerIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h6">Work Timer</Typography>
              <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                {formatTime(elapsedTime)}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isRunning ? (
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={handleStart}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                Start
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<StopIcon />}
                onClick={handleStop}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                Stop
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Log Work Time</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Time worked: <strong>{formatTime(elapsedTime)}</strong>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="What did you work on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveTime} variant="contained">Save Time</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

// Progress Visualization Component
const ProgressVisualization = ({ task, timeEntries }) => {
  const totalLoggedHours = timeEntries.reduce((total, entry) => total + parseFloat(entry.hours_spent || 0), 0);
  const progressPercentage = Math.min((totalLoggedHours / task.estimated_hours) * 100, 100);
  const isOvertime = totalLoggedHours > task.estimated_hours;

  const getProgressColor = () => {
    if (isOvertime) return 'error';
    if (progressPercentage >= 80) return 'warning';
    if (progressPercentage >= 50) return 'info';
    return 'success';
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="primary" />
          Progress Overview
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Time Progress</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {totalLoggedHours.toFixed(1)}h / {task.estimated_hours}h
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(progressPercentage, 100)}
                color={getProgressColor()}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {progressPercentage.toFixed(1)}% Complete
                {isOvertime && ` (${(totalLoggedHours - task.estimated_hours).toFixed(1)}h overtime)`}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                  <Typography variant="h4">{totalLoggedHours.toFixed(1)}</Typography>
                  <Typography variant="body2">Hours Logged</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
                  <Typography variant="h4">{timeEntries.length}</Typography>
                  <Typography variant="body2">Work Sessions</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
              <CircularProgress
                variant="determinate"
                value={Math.min(progressPercentage, 100)}
                size={120}
                thickness={8}
                color={getProgressColor()}
              />
              <Box sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <Typography variant="h6" component="div" color="text.secondary">
                  {Math.round(progressPercentage)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Complete
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const TaskDetails = () => {
  const [task, setTask] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    fetchTaskDetails();
    fetchTimeEntries();
  }, [id]);
  
  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(`/api/tasks/${id}`);
      setTask(response.data);
      setEditData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching task details:', err);
      setError('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTimeEntries = async () => {
    try {
      const response = await axios.get(`/api/tasks/${id}/time-entries`);
      setTimeEntries(response.data);
    } catch (err) {
      console.error('Error fetching time entries:', err);
    }
  };
  
  const handleSave = async () => {
    try {
      await axios.put(`/api/tasks/${id}`, editData);
      setTask(editData);
      setEditing(false);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    }
  };
  
  const handleCancel = () => {
    setEditData(task);
    setEditing(false);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'not_started': return 'info';
      case 'in_progress': return 'warning';
      case 'review': return 'secondary';
      case 'completed': return 'success';
      default: return 'default';
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };
  
  // Calculate total logged hours for display
  const totalLoggedHours = timeEntries.reduce((total, entry) => total + parseFloat(entry.hours_spent || 0), 0);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!task) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Task not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tasks')}
          sx={{ mr: 2 }}
        >
          Back to Tasks
        </Button>
      </Box>

      {/* Work Timer */}
      <WorkTimer taskId={id} onTimeLogged={fetchTimeEntries} />

      {/* Progress Visualization */}
      <ProgressVisualization task={task} timeEntries={timeEntries} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#1e293b' }}>
                  {editing ? (
                    <TextField
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      variant="outlined"
                      fullWidth
                    />
                  ) : task.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={task.status.replace('_', ' ')} 
                    color={getStatusColor(task.status)}
                  />
                  <Chip 
                    label={task.priority} 
                    color={getPriorityColor(task.priority)}
                    variant="outlined"
                  />
                </Box>
              </Box>
              
              <Typography variant="body1" paragraph>
                <strong>Project:</strong> {task.project_name}
              </Typography>
              
              <Typography variant="body1" paragraph>
                <strong>Description:</strong> {editing ? (
                  <TextField
                    value={editData.description || ''}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    multiline
                    rows={3}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                ) : (task.description || 'No description provided')}
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Assigned to:</strong> {task.assigned_to_username || 'Unassigned'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Estimated Hours:</strong> {task.estimated_hours}h
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Logged Hours:</strong> {totalLoggedHours.toFixed(1)}h
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Created:</strong> {format(new Date(task.created_at), 'MMM dd, yyyy')}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                {editing ? (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                  >
                    Edit Task
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
          
          {/* Simplified Time Entries List instead of Timeline */}
          {timeEntries.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon color="primary" />
                  Work History
                </Typography>
                
                <List>
                  {timeEntries.map((entry, index) => (
                    <Box key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          width: '100%',
                          gap: 2
                        }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <AccessTimeIcon />
                          </Avatar>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" component="div">
                              {entry.hours_spent}h worked
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(entry.work_date), 'MMM dd, yyyy')}
                            </Typography>
                            <Typography color="text.secondary" sx={{ mt: 1 }}>
                              {entry.description || 'No description provided'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                              <Avatar sx={{ width: 20, height: 20 }}>
                                <PersonIcon sx={{ fontSize: 12 }} />
                              </Avatar>
                              <Typography variant="caption">
                                {entry.user_name || 'Unknown'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </ListItem>
                      {index < timeEntries.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task Analytics
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Efficiency Rating
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((task.estimated_hours / totalLoggedHours) * 100, 100)}
                color={totalLoggedHours <= task.estimated_hours ? 'success' : 'error'}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Time Remaining
              </Typography>
              <Typography variant="h6" color={totalLoggedHours > task.estimated_hours ? 'error.main' : 'primary'}>
                {totalLoggedHours > task.estimated_hours 
                  ? `${(totalLoggedHours - task.estimated_hours).toFixed(1)}h over` 
                  : `${(task.estimated_hours - totalLoggedHours).toFixed(1)}h left`}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Work Sessions
              </Typography>
              <Typography variant="h6">{timeEntries.length} sessions</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskDetails;
