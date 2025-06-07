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
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    fetchProjectDetails();
    fetchProjectTasks();
  }, [id]);
  
  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
      setProject(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Failed to load project details');
    }
  };
  
  const fetchProjectTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      const projectTasks = response.data.filter(task => task.project_id == id);
      setTasks(projectTasks);
    } catch (err) {
      console.error('Error fetching project tasks:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'on_hold': return 'error';
      default: return 'default';
    }
  };
  
  const getTaskStatusColor = (status) => {
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
      case 'urgent': return 'error';
      default: return 'default';
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          sx={{ mb: 2 }}
        >
          Back to Projects
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  if (!project) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          sx={{ mb: 2 }}
        >
          Back to Projects
        </Button>
        <Alert severity="warning">Project not found</Alert>
      </Box>
    );
  }
  
  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/projects')}
        sx={{ mb: 3 }}
      >
        Back to Projects
      </Button>
      
      {/* Project Details Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#1e293b' }}>
              {project.name}
            </Typography>
            <Chip 
              label={project.status.replace('_', ' ')} 
              color={getStatusColor(project.status)}
            />
          </Box>
          
          <Typography variant="body1" paragraph sx={{ color: '#475569' }}>
            {project.description || 'No description provided'}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Created by:</strong> {project.created_by_username || 'Unknown'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Created:</strong> {format(new Date(project.created_at), 'MMM dd, yyyy')}
              </Typography>
            </Grid>
            {project.start_date && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Start Date:</strong> {format(new Date(project.start_date), 'MMM dd, yyyy')}
                </Typography>
              </Grid>
            )}
            {project.end_date && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>End Date:</strong> {format(new Date(project.end_date), 'MMM dd, yyyy')}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      
      {/* Tasks Section */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Project Tasks ({tasks.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/tasks?project_id=${id}`)}
            >
              Add Task
            </Button>
          </Box>
          
          {tasks.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No tasks in this project yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Start by creating your first task
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/tasks?project_id=${id}`)}
              >
                Create First Task
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Priority</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Assignee</TableCell>
                    <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Est. Hours</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {task.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={task.status.replace('_', ' ')} 
                          color={getTaskStatusColor(task.status)}
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
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography variant="body2">
                          {task.assigned_to_username || 'Unassigned'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography variant="body2">
                          {task.estimated_hours}h
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/tasks/${task.id}`)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProjectDetails;
