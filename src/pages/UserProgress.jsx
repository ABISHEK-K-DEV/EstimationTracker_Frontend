import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  LinearProgress,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as TaskIcon,
  Schedule as ScheduleIcon,
  Speed as SpeedIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  BarChart as ChartIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { format, subDays } from 'date-fns';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';

const UserProgress = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeFilter, setTimeFilter] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressData, setProgressData] = useState({
    stats: {},
    dailyProgress: [],
    taskDistribution: [],
    recentTasks: [],
    achievements: []
  });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProgressData();
  }, [timeFilter]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      console.log('Fetching progress data...', { userId: user?.id });
      
      // Fetch user's tasks first
      const tasksRes = await axios.get('/api/tasks');
      console.log('Tasks response:', tasksRes.data);
      
      // Try to fetch time entries, but don't fail if it's not available
      let userTimeEntries = [];
      try {
        const timeEntriesRes = await axios.get('/api/tasks/time-entries');
        console.log('Time entries response:', timeEntriesRes.data);
        userTimeEntries = timeEntriesRes.data?.filter(entry => {
          return entry.user_id === user.id || entry.user_id === user.id.toString();
        }) || [];
      } catch (timeEntriesError) {
        console.warn('Time entries endpoint not available:', timeEntriesError.message);
        userTimeEntries = [];
      }
      
      // Filter data for current user
      const userTasks = tasksRes.data.filter(task => {
        console.log('Task assignment check:', { taskId: task.id, assignedTo: task.assigned_to, userId: user.id });
        return task.assigned_to === user.id || task.assigned_to === user.id.toString();
      });
      
      console.log('Filtered data:', { userTasks: userTasks.length, userTimeEntries: userTimeEntries.length });
      
      // Calculate statistics
      const stats = calculateStats(userTasks, userTimeEntries);
      const dailyProgress = calculateDailyProgress(userTimeEntries);
      const taskDistribution = calculateTaskDistribution(userTasks);
      const achievements = calculateAchievements(userTasks, userTimeEntries);
      
      setProgressData({
        stats,
        dailyProgress,
        taskDistribution,
        recentTasks: userTasks.slice(0, 5),
        achievements
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching progress data:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      let errorMessage = 'Failed to load progress data';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check your backend.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      
      // Set default data to prevent crashes
      setProgressData({
        stats: {
          totalTasks: 0,
          completedTasks: 0,
          totalHoursLogged: '0.0',
          efficiency: '0.0',
          completionRate: '0.0'
        },
        dailyProgress: [],
        taskDistribution: [],
        recentTasks: [],
        achievements: []
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tasks, timeEntries) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalHoursLogged = timeEntries.reduce((sum, entry) => sum + parseFloat(entry.hours_spent || 0), 0);
    const totalEstimatedHours = tasks.reduce((sum, task) => sum + parseFloat(task.estimated_hours || 0), 0);
    const efficiency = totalEstimatedHours > 0 ? (totalEstimatedHours / totalHoursLogged) * 100 : 0;
    
    return {
      totalTasks,
      completedTasks,
      totalHoursLogged: totalHoursLogged.toFixed(1),
      efficiency: efficiency.toFixed(1),
      completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0
    };
  };

  const calculateDailyProgress = (timeEntries) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayEntries = timeEntries.filter(entry => 
        format(new Date(entry.work_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      const hours = dayEntries.reduce((sum, entry) => sum + parseFloat(entry.hours_spent || 0), 0);
      
      return {
        date: format(date, 'MMM dd'),
        hours: hours.toFixed(1),
        tasks: dayEntries.length
      };
    });
    
    return last7Days;
  };

  // Fix the task distribution calculation to handle division by zero
  const calculateTaskDistribution = (tasks) => {
    if (tasks.length === 0) return [];
    
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.replace('_', ' '),
      value: count,
      color: getStatusColor(status)
    }));
  };

  const calculateAchievements = (tasks, timeEntries) => {
    const achievements = [];
    
    // Task completion achievements
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    if (completedTasks >= 10) achievements.push({ type: 'tasks', level: 'gold', title: 'Task Master', desc: '10+ completed tasks' });
    else if (completedTasks >= 5) achievements.push({ type: 'tasks', level: 'silver', title: 'Task Achiever', desc: '5+ completed tasks' });
    
    // Time tracking achievements
    const totalHours = timeEntries.reduce((sum, entry) => sum + parseFloat(entry.hours_spent || 0), 0);
    if (totalHours >= 40) achievements.push({ type: 'time', level: 'gold', title: 'Time Tracker Pro', desc: '40+ hours logged' });
    
    return achievements;
  };

  const getStatusColor = (status) => {
    const colors = {
      'not_started': '#2196f3',
      'in_progress': '#ff9800',
      'review': '#9c27b0',
      'completed': '#4caf50'
    };
    return colors[status] || '#757575';
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
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />
          My Progress Dashboard
        </Typography>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            label="Time Range"
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            height: 140
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{progressData.stats.totalTasks}</Typography>
                  <Typography variant="body2">Total Tasks</Typography>
                </Box>
                <TaskIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            height: 140
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{progressData.stats.completionRate}%</Typography>
                  <Typography variant="body2">Completion Rate</Typography>
                </Box>
                <TrophyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            height: 140
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{progressData.stats.totalHoursLogged}h</Typography>
                  <Typography variant="body2">Hours Logged</Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            height: 140
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{progressData.stats.efficiency}%</Typography>
                  <Typography variant="body2">Efficiency</Typography>
                </Box>
                <SpeedIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{
          '& .MuiTab-root': {
            color: '#475569',
          },
          '& .Mui-selected': {
            color: '#2563eb',
          }
        }}>
          <Tab icon={<ChartIcon />} label="Analytics" />
          <Tab icon={<TimelineIcon />} label="Timeline" />
          <Tab icon={<TrophyIcon />} label="Achievements" />
        </Tabs>

        {/* Analytics Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Daily Work Progress</Typography>
                    {progressData.dailyProgress.length === 0 ? (
                      <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          No work hours logged yet. Start tracking your time!
                        </Typography>
                      </Paper>
                    ) : (
                      <Grid container spacing={2}>
                        {progressData.dailyProgress.map((day, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                {day.date}
                              </Typography>
                              <Typography variant="h6" color="primary">
                                {day.hours}h
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {day.tasks} tasks
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Task Status Distribution</Typography>
                    {progressData.taskDistribution.length === 0 ? (
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          No tasks assigned yet
                        </Typography>
                      </Paper>
                    ) : (
                      progressData.taskDistribution.map((item, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                              {item.name}
                            </Typography>
                            <Typography variant="body2">{item.value}</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={progressData.stats.totalTasks > 0 ? (item.value / progressData.stats.totalTasks) * 100 : 0}
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              '& .MuiLinearProgress-bar': { backgroundColor: item.color }
                            }}
                          />
                        </Box>
                      ))
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Timeline Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Tasks</Typography>
            {progressData.recentTasks.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <TaskIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No tasks assigned
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tasks assigned to you will appear here
                </Typography>
              </Paper>
            ) : (
              <List>
                {progressData.recentTasks.map((task) => (
                  <ListItem key={task.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getStatusColor(task.status) }}>
                        <TaskIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Chip 
                            label={task.status.replace('_', ' ')} 
                            size="small" 
                            style={{ backgroundColor: getStatusColor(task.status), color: 'white' }}
                          />
                          <Box component="span" variant="body2" color="text.secondary">
                            {task.project_name}
                          </Box>
                        </Box>
                      }
                    />
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      View
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {/* Achievements Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Your Achievements</Typography>
            <Grid container spacing={2}>
              {progressData.achievements.length === 0 ? (
                <Grid item xs={12}>
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <TrophyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No achievements yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Complete tasks and log time to unlock achievements!
                    </Typography>
                  </Paper>
                </Grid>
              ) : (
                progressData.achievements.map((achievement, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ 
                      background: achievement.level === 'gold' 
                        ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
                        : 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)',
                      color: achievement.level === 'gold' ? '#333' : '#555'
                    }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <TrophyIcon sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="h6">{achievement.title}</Typography>
                        <Typography variant="body2">{achievement.desc}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UserProgress;
