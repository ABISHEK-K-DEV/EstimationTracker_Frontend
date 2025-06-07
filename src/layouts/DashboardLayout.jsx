import { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AssignmentOutlined as TasksIcon,
  RateReviewOutlined as ReviewsIcon,
  FolderOutlined as ProjectsIcon,
  BarChartOutlined as ReportsIcon,
  TrendingUp as TrendingUpIcon,
  AccountCircle,
  ExitToApp,
  NotificationsOutlined,
  SearchOutlined
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import AuthContext from '../context/AuthContext';

const drawerWidth = 280;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8); }
  100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
`;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/', badge: null },
  { text: 'Projects', icon: <ProjectsIcon />, path: '/projects', badge: null },
  { text: 'Tasks', icon: <TasksIcon />, path: '/tasks', badge: 3 },
  { text: 'My Progress', icon: <TrendingUpIcon />, path: '/progress', badge: null },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports', badge: null }
];

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };
  
  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ 
      height: '100%',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
    }}>
      <Toolbar sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        justifyContent: 'center'
      }}>
        <Typography variant="h5" noWrap component="div" sx={{ 
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'white',
        }}>
          ⚡ EstimateTracker
        </Typography>
      </Toolbar>
      
      <Box sx={{ p: 2 }}>
        {/* User Profile Card */}
        <Box sx={{ 
          mb: 3,
          p: 2,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: 3,
          border: '1px solid rgba(102, 126, 234, 0.2)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 'bold',
                animation: `${glow} 2s ease-in-out infinite`,
                color: 'white',
              }}
            >
              {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                {user?.fullName || user?.username}
              </Typography>
              <Chip 
                label="Active" 
                size="small" 
                color="success" 
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            </Box>
          </Box>
        </Box>

        <List sx={{ px: 0 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 3,
                mb: 1,
                mx: 0,
                transition: 'all 0.3s ease-in-out',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  transform: 'translateX(8px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: location.pathname === item.path ? 'white' : '#1e293b'
              }}>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 'bold' : 'medium',
                  fontSize: '0.95rem',
                  color: location.pathname === item.path ? 'white' : '#1e293b'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ 
            flexGrow: 1,
            color: 'primary.main',
            fontWeight: 'bold'
          }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          {/* Search and Notifications */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Search">
              <IconButton color="primary">
                <SearchOutlined />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton color="primary">
                <Badge badgeContent={2} color="error">
                  <NotificationsOutlined />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <Typography variant="body2" sx={{ 
                  mr: 2, 
                  display: { xs: 'none', sm: 'block' },
                  color: 'text.primary',
                  fontWeight: 'medium'
                }}>
                  {user.fullName || user.username}
                </Typography>
                
                <Tooltip title="Account settings">
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                  >
                    <Avatar sx={{ 
                      width: 40, 
                      height: 40, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontWeight: 'bold'
                    }}>
                      {(user.fullName || user.username).charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  <MenuItem onClick={handleProfile} sx={{ borderRadius: 2, mx: 1 }}>
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  
                  <MenuItem onClick={handleLogout} sx={{ borderRadius: 2, mx: 1 }}>
                    <ListItemIcon>
                      <ExitToApp fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;