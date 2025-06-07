import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  LinearProgress,
  Fab,
  Zoom,
  Slide
} from '@mui/material';
import {
  AssignmentOutlined as TasksIcon,
  RateReviewOutlined,
  FolderOutlined,
  AccessTimeOutlined,
  TrendingUpOutlined,
  AddOutlined,
  FlashOnOutlined,
  StarOutlined
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: { total: 0, inProgress: 0, completed: 0 },
    tasks: { total: 0, open: 0, inProgress: 0, review: 0, completed: 0 },
    pendingReviews: 0
  });
  
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const projectsRes = await axios.get('/api/projects');
        const projects = projectsRes.data;
        
        const tasksRes = await axios.get('/api/tasks');
        const tasks = tasksRes.data;
        
        setStats({
          projects: {
            total: projects.length,
            inProgress: projects.filter(p => p.status === 'in_progress').length,
            completed: projects.filter(p => p.status === 'completed').length
          },
          tasks: {
            total: tasks.length,
            open: tasks.filter(t => t.status === 'not_started').length,
            inProgress: tasks.filter(t => t.status === 'in_progress').length,
            review: tasks.filter(t => t.status === 'review').length,
            completed: tasks.filter(t => t.status === 'completed').length
          },
          pendingReviews: tasks.filter(t => t.status === 'review').length
        });
        
        setRecentTasks(
          tasks
            .filter(task => task.assigned_to === user.id)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 5)
        );
        
        setRecentProjects(
          projects
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 5)
        );
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user.id]);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'not_started': return 'info';
      case 'in_progress': return 'warning';
      case 'review': return 'secondary';
      case 'completed': return 'success';
      default: return 'default';
    }
  };
  
  const getProjectStatusColor = (status) => {
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh',
        background: 'transparent'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
            Loading your workspace...
          </Typography>
        </Box>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }}>
        {error}
      </Alert>
    );
  }

  // Define stats data for cards
  const statsData = [
    {
      title: 'Active Tasks',
      value: stats.tasks.total,
      subtitle: `${stats.tasks.inProgress} in progress`,
      icon: <TasksIcon sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      progress: (stats.tasks.completed / stats.tasks.total) * 100 || 0
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      subtitle: 'Awaiting feedback',
      icon: <RateReviewOutlined sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      progress: 75
    },
    {
      title: 'Projects',
      value: stats.projects.total,
      subtitle: `${stats.projects.completed} completed`,
      icon: <FolderOutlined sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      progress: (stats.projects.completed / stats.projects.total) * 100 || 0
    },
    {
      title: 'Efficiency',
      value: '87%',
      subtitle: 'Above average!',
      icon: <FlashOnOutlined sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      progress: 87
    }
  ];

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Hero Section */}
      <Slide direction="down" in={true} timeout={1000}>
        <Box sx={{ 
          mb: 6, 
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          p: 4,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              color: '#1e293b',
              mb: 2,
              animation: `${float} 3s ease-in-out infinite`
            }}
          >
            Welcome back, {user.fullName || user.username}! 🚀
          </Typography>
          <Typography variant="h6" sx={{ color: '#475569', mb: 3 }}>
            Your productivity hub awaits. Let's make today amazing!
          </Typography
          >
          
          {/* Quick Stats Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                {((stats.tasks.completed / stats.tasks.total) * 100 || 0).toFixed(0)}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Task Completion
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
                {stats.projects.inProgress}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Active Projects
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#ec4899', fontWeight: 'bold' }}>
                87%
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Efficiency Score
              </Typography>
            </Box>
          </Box>
        </Box>
      </Slide>

      {/* Enhanced Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Zoom in={true} timeout={1000 + index * 200}>
              <Card
                sx={{
                  height: 180,
                  background: stat.gradient,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  animation: `${pulse} 2s ease-in-out infinite`,
                  animationDelay: `${index * 0.5}s`,
                  '&:hover': {
                    transform: 'scale(1.05) translateY(-5px)',
                    transition: 'all 0.3s ease-in-out',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }
                }}
              >
                <CardContent sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {stat.subtitle}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 56, height: 56 }}>
                      {stat.icon}
                    </Avatar>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={stat.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Enhanced Content Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Slide direction="right" in={true} timeout={1200}>
            <Card sx={{ 
              height: 400,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
            }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <TasksIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      My Tasks
                    </Typography>
                  </Box>
                }
                action={
                  <Button 
                    variant="contained"
                    size="small" 
                    onClick={() => navigate('/tasks')}
                    sx={{ borderRadius: 20 }}
                  >
                    View All
                  </Button>
                } 
              />
              <Divider />
              <CardContent sx={{ p: 0, height: 'calc(100% - 80px)', overflow: 'auto' }}>
                {recentTasks.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.light', width: 64, height: 64 }}>
                      <TasksIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No tasks assigned
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You're all caught up! 🎉
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {recentTasks.map((task, index) => (
                      <Zoom in={true} timeout={1000 + index * 100} key={task.id}>
                        <ListItem 
                          divider 
                          secondaryAction={
                            <Chip 
                              label={task.status.replace('_', ' ')} 
                              size="small" 
                              color={getStatusColor(task.status)}
                              sx={{ fontWeight: 'bold' }}
                            />
                          }
                          disablePadding
                        >
                          <ListItemButton 
                            onClick={() => navigate(`/tasks/${task.id}`)}
                            sx={{ 
                              borderRadius: 2,
                              '&:hover': {
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                              }
                            }}
                          >
                            <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                              <StarOutlined />
                            </Avatar>
                            <ListItemText
                              primary={
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  {task.title}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary">
                                  {task.project_name} • Est: {task.estimated_hours}h
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      </Zoom>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Slide>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Slide direction="left" in={true} timeout={1200}>
            <Card sx={{ 
              height: 400,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
            }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <FolderOutlined />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Recent Projects
                    </Typography>
                  </Box>
                }
                action={
                  <Button 
                    variant="contained"
                    size="small" 
                    onClick={() => navigate('/projects')}
                    sx={{ borderRadius: 20 }}
                  >
                    View All
                  </Button>
                } 
              />
              <Divider />
              <CardContent sx={{ p: 0, height: 'calc(100% - 80px)', overflow: 'auto' }}>
                {recentProjects.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'secondary.light', width: 64, height: 64 }}>
                      <FolderOutlined sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No projects available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create your first project to get started
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {recentProjects.map((project, index) => (
                      <Zoom in={true} timeout={1000 + index * 100} key={project.id}>
                        <ListItem 
                          divider 
                          secondaryAction={
                            <Chip 
                              label={project.status.replace('_', ' ')} 
                              size="small" 
                              color={getProjectStatusColor(project.status)}
                              sx={{ fontWeight: 'bold' }}
                            />
                          }
                          disablePadding
                        >
                          <ListItemButton 
                            onClick={() => navigate(`/projects/${project.id}`)}
                            sx={{ 
                              borderRadius: 2,
                              '&:hover': {
                                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(244, 114, 182, 0.1) 100%)',
                              }
                            }}
                          >
                            <Avatar sx={{ mr: 2, bgcolor: 'warning.main' }}>
                              <TrendingUpOutlined />
                            </Avatar>
                            <ListItemText
                              primary={
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  {project.name}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary">
                                  Created by {project.created_by_username || 'Unknown'}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      </Zoom>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Slide>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease-in-out',
        }}
        onClick={() => navigate('/tasks')}
      >
        <AddOutlined />
      </Fab>
    </Box>
  );
};

export default Dashboard;