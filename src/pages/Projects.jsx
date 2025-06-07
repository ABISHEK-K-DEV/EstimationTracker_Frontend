import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
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
  IconButton,
  Menu,
  MenuItem as MenuOption
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'pending',
    start_date: '',
    end_date: ''
  });
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects');
      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await axios.put(`/api/projects/${editingProject.id}`, formData);
      } else {
        await axios.post('/api/projects', formData);
      }
      fetchProjects();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project');
    }
  };
  
  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${projectId}`);
        fetchProjects();
        handleCloseMenu();
      } catch (err) {
        console.error('Error deleting project:', err);
        setError('Failed to delete project');
      }
    }
  };
  
  const handleOpenDialog = (project = null) => {
    setEditingProject(project);
    setFormData(project || {
      name: '',
      description: '',
      status: 'pending',
      start_date: '',
      end_date: ''
    });
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      status: 'pending',
      start_date: '',
      end_date: ''
    });
  };
  
  const handleMenu = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedProject(null);
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
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Project
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {project.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenu(e, project)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {project.description || 'No description provided'}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={project.status.replace('_', ' ')} 
                    color={getStatusColor(project.status)}
                    size="small"
                  />
                </Box>
                
                {project.start_date && (
                  <Typography variant="body2" color="text.secondary">
                    Start: {format(new Date(project.start_date), 'MMM dd, yyyy')}
                  </Typography>
                )}
                
                {project.end_date && (
                  <Typography variant="body2" color="text.secondary">
                    End: {format(new Date(project.end_date), 'MMM dd, yyyy')}
                  </Typography>
                )}
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Created by: {project.created_by_username || 'Unknown'}
                </Typography>
              </CardContent>
              
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {projects.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No projects found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first project to get started
          </Typography>
        </Box>
      )}
      
      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuOption onClick={() => { handleOpenDialog(selectedProject); handleCloseMenu(); }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuOption>
        <MenuOption onClick={() => handleDelete(selectedProject?.id)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuOption>
      </Menu>
      
      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Project Name"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            
            <TextField
              select
              margin="dense"
              label="Status"
              fullWidth
              variant="outlined"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="on_hold">On Hold</MenuItem>
            </TextField>
            
            <TextField
              margin="dense"
              label="Start Date"
              type="date"
              fullWidth
              variant="outlined"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              label="End Date"
              type="date"
              fullWidth
              variant="outlined"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingProject ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Projects;
