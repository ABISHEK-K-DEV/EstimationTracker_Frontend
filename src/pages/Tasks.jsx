import { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    project: '',
    status: '',
    assignee: ''
  });
  
  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    description: '',
    status: 'not_started',
    priority: 'medium',
    assigned_to: '',
    estimated_hours: ''
  });
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
    
    // Pre-select project if provided in URL
    const projectId = searchParams.get('project_id');
    if (projectId) {
      setFilters(prev => ({ ...prev, project: projectId }));
      setFormData(prev => ({ ...prev, project_id: projectId }));
    }
  }, [searchParams]);
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };
  
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.put(`/api/tasks/${editingTask.id}`, formData);
      } else {
        await axios.post('/api/tasks', formData);
      }
      fetchTasks();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task');
    }
  };
  
  const handleOpenDialog = (task = null) => {
    setEditingTask(task);
    setFormData(task || {
      project_id: searchParams.get('project_id') || '',
      title: '',
      description: '',
      status: 'not_started',
      priority: 'medium',
      assigned_to: '',
      estimated_hours: ''
    });
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setFormData({
      project_id: '',
      title: '',
      description: '',
      status: 'not_started',
      priority: 'medium',
      assigned_to: '',
      estimated_hours: ''
    });
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
  
  const filteredTasks = tasks.filter(task => {
    return (
      (!filters.project || task.project_id === filters.project) &&
      (!filters.status || task.status === filters.status) &&
      (!filters.assignee || task.assigned_to === filters.assignee)
    );
  });
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1e293b' }}>
          Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Task
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  value={filters.project}
                  onChange={(e) => setFilters({...filters, project: e.target.value})}
                  label="Project"
                >
                  <MenuItem value="">All Projects</MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  label="Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="not_started">Not Started</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="review">Review</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={filters.assignee}
                  onChange={(e) => setFilters({...filters, assignee: e.target.value})}
                  label="Assignee"
                >
                  <MenuItem value="">All Assignees</MenuItem>
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.id.toString()}>
                      {u.full_name || u.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Tasks Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Project</TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Priority</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Assignee</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} align="right">Est. Hours</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {task.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: { sm: 'none' } }}>
                    {task.project_name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Typography variant="body2">
                    {task.project_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={task.status.replace('_', ' ')} 
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Chip 
                    label={task.priority} 
                    color={getPriorityColor(task.priority)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Typography variant="body2">
                    {task.assigned_to_username || 'Unassigned'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} align="right">
                  <Typography variant="body2">
                    {task.estimated_hours}h
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(task)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {filteredTasks.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4, p: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tasks.length === 0 ? 'Create your first task to get started' : 'Try adjusting your filters'}
          </Typography>
        </Box>
      )}
      
      {/* Create/Edit Task Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogContent>
            <TextField
              select
              margin="dense"
              label="Project"
              fullWidth
              variant="outlined"
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              required
              sx={{ mb: 2 }}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              autoFocus
              margin="dense"
              label="Task Title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  select
                  margin="dense"
                  label="Status"
                  fullWidth
                  variant="outlined"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="not_started">Not Started</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="review">Review</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  margin="dense"
                  label="Priority"
                  fullWidth
                  variant="outlined"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            
            <TextField
              select
              margin="dense"
              label="Assignee"
              fullWidth
              variant="outlined"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              sx={{ mb: 2, mt: 2 }}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.full_name || u.username}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              margin="dense"
              label="Estimated Hours"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.estimated_hours}
              onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
              inputProps={{ min: 0, step: 0.5 }}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingTask ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Tasks;
