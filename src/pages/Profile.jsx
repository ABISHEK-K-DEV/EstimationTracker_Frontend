import { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    full_name: '',
    phone: '',
    department: '',
    position: '',
    bio: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    task_reminders: true,
    weekly_reports: false,
    theme: 'light'
  });
  
  const { user, updateUser } = useContext(AuthContext);
  
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || '',
        phone: user.phone || '',
        department: user.department || '',
        position: user.position || '',
        bio: user.bio || ''
      });
    }
    fetchUserPreferences();
  }, [user]);
  
  const fetchUserPreferences = async () => {
    try {
      const response = await axios.get('/api/user/preferences');
      setPreferences(response.data);
    } catch (err) {
      console.error('Error fetching preferences:', err);
    }
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await axios.put('/api/user/profile', profileData);
      updateUser(response.data);
      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      if (passwordData.new_password !== passwordData.confirm_password) {
        setError('New passwords do not match');
        return;
      }
      
      await axios.put('/api/user/password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      setSuccess('Password updated successfully');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await axios.put('/api/user/preferences', preferences);
      setSuccess('Preferences updated successfully');
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };
  
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#1e293b' }}>
        Profile Settings
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  fontSize: '3rem',
                  bgcolor: 'primary.main'
                }}
              >
                {getInitials(profileData.full_name || profileData.username)}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {profileData.full_name || profileData.username}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {profileData.position || 'No position set'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {profileData.department || 'No department set'}
              </Typography>
              
              <Button
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                sx={{ mt: 2 }}
                disabled
              >
                Change Photo
              </Button>
              
              <Divider sx={{ my: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Member since"
                    secondary={user?.created_at ? format(new Date(user.created_at), 'MMM yyyy') : 'Unknown'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last login"
                    secondary={user?.last_login ? format(new Date(user.last_login), 'MMM dd, yyyy') : 'Unknown'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="fullWidth"
            >
              <Tab icon={<PersonIcon />} label="Profile" />
              <Tab icon={<SecurityIcon />} label="Security" />
              <Tab icon={<SettingsIcon />} label="Preferences" />
            </Tabs>
            
            {/* Profile Tab */}
            {tabValue === 0 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                
                <form onSubmit={handleProfileSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                        disabled
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Department"
                        value={profileData.department}
                        onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Position"
                        value={profileData.position}
                        onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        multiline
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={loading}
                      >
                        Save Changes
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            )}
            
            {/* Security Tab */}
            {tabValue === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                
                <form onSubmit={handlePasswordSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={loading}
                      >
                        Update Password
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            )}
            
            {/* Preferences Tab */}
            {tabValue === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                
                <form onSubmit={handlePreferencesSubmit}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email Notifications"
                        secondary="Receive email notifications for important updates"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.email_notifications}
                            onChange={(e) => setPreferences({...preferences, email_notifications: e.target.checked})}
                          />
                        }
                        label=""
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Task Reminders"
                        secondary="Get reminded about upcoming task deadlines"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.task_reminders}
                            onChange={(e) => setPreferences({...preferences, task_reminders: e.target.checked})}
                          />
                        }
                        label=""
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Weekly Reports"
                        secondary="Receive weekly summary reports via email"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.weekly_reports}
                            onChange={(e) => setPreferences({...preferences, weekly_reports: e.target.checked})}
                          />
                        }
                        label=""
                      />
                    </ListItem>
                  </List>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    Save Preferences
                  </Button>
                </form>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
