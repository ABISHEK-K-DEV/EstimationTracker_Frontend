import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  RateReview as ReviewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewComments, setReviewComments] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchReviews();
  }, []);
  
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reviews');
      setReviews(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReviewAction = async (reviewId, status, comments) => {
    try {
      await axios.put(`/api/reviews/${reviewId}`, {
        status,
        comments
      });
      fetchReviews();
      setReviewDialog(false);
      setSelectedReview(null);
      setReviewComments('');
    } catch (err) {
      console.error('Error updating review:', err);
      setError('Failed to update review');
    }
  };
  
  const openReviewDialog = (review) => {
    setSelectedReview(review);
    setReviewComments(review.comments || '');
    setReviewDialog(true);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };
  
  const pendingReviews = reviews.filter(review => review.status === 'pending');
  const myReviews = reviews.filter(review => review.reviewer_id === user.id);
  const completedReviews = reviews.filter(review => review.status !== 'pending');
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reviews
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
        >
          <Tab label={`Pending (${pendingReviews.length})`} />
          <Tab label={`My Reviews (${myReviews.length})`} />
          <Tab label={`All Reviews (${reviews.length})`} />
        </Tabs>
        
        <Box sx={{ p: 2 }}>
          {/* Pending Reviews Tab */}
          {tabValue === 0 && (
            <Box>
              {pendingReviews.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No pending reviews
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {pendingReviews.map((review) => (
                    <Grid item xs={12} key={review.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6">
                              {review.task_title}
                            </Typography>
                            <Chip 
                              label={review.status} 
                              color={getStatusColor(review.status)}
                              size="small"
                            />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" paragraph>
                            Project: {review.project_name}
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" paragraph>
                            Requested by: {review.requester_name}
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" paragraph>
                            Requested on: {format(new Date(review.created_at), 'MMM dd, yyyy HH:mm')}
                          </Typography>
                          
                          {review.comments && (
                            <Typography variant="body2" paragraph>
                              Comments: {review.comments}
                            </Typography>
                          )}
                          
                          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<ApproveIcon />}
                              onClick={() => openReviewDialog(review)}
                            >
                              Review
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/tasks/${review.task_id}`)}
                            >
                              View Task
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
          
          {/* My Reviews Tab */}
          {tabValue === 1 && (
            <Box>
              {myReviews.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  You haven't conducted any reviews yet
                </Typography>
              ) : (
                <List>
                  {myReviews.map((review) => (
                    <ListItem key={review.id} divider>
                      <ListItemButton onClick={() => navigate(`/tasks/${review.task_id}`)}>
                        <ListItemText
                          primary={review.task_title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {review.project_name} • Reviewed on {format(new Date(review.reviewed_at), 'MMM dd, yyyy')}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Chip 
                                  label={review.status} 
                                  color={getStatusColor(review.status)}
                                  size="small"
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
          
          {/* All Reviews Tab */}
          {tabValue === 2 && (
            <Box>
              {reviews.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No reviews found
                </Typography>
              ) : (
                <List>
                  {reviews.map((review) => (
                    <ListItem key={review.id} divider>
                      <ListItemButton onClick={() => navigate(`/tasks/${review.task_id}`)}>
                        <ListItemText
                          primary={review.task_title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {review.project_name} • Reviewer: {review.reviewer_name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {format(new Date(review.created_at), 'MMM dd, yyyy HH:mm')}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Chip 
                                  label={review.status} 
                                  color={getStatusColor(review.status)}
                                  size="small"
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Review Task: {selectedReview?.task_title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Project: {selectedReview?.project_name}
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            label="Review Comments"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={reviewComments}
            onChange={(e) => setReviewComments(e.target.value)}
            placeholder="Add your review comments here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleReviewAction(selectedReview?.id, 'rejected', reviewComments)}
            color="error"
            startIcon={<RejectIcon />}
          >
            Reject
          </Button>
          <Button
            onClick={() => handleReviewAction(selectedReview?.id, 'approved', reviewComments)}
            color="success"
            variant="contained"
            startIcon={<ApproveIcon />}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reviews;
