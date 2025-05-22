import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
  CircularProgress,
  Container,
  Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { getRevision, getSchedule } from '@redux';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { AddLessonDialog, RevisionDialog } from '@components';
import { axiosInstance } from '@utils/axiosInterceptor';

export const Schedule = () => {
  const [openRevisionDialog, setOpenRevisionDialog] = useState(false);
  const [openAddLesson, setOpenAddLesson] = useState(false);
  const [revisionId, setRevisionId] = useState('');

  const dispatch = useDispatch();
  const { schedules, scheduleIsLoading } = useSelector((state) => state.schedule);
  const { revisionIsLoading, revisions } = useSelector((state) => state.revision);

  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date');

  useEffect(() => {
    dispatch(getSchedule({ date }));
    dispatch(getRevision({ date }));
  }, [dispatch, date]);

  const handleMarkDone = (id) => {
    setOpenRevisionDialog(true);
    setRevisionId(id);
  };

  const handleRevisionClose = () => {
    setOpenRevisionDialog(false);
    setRevisionId('');
  };

  const handleLessonClose = () => {
    setOpenAddLesson(false);
  };

  const handleRevisionSubmit = async (startTime, endTime) => {
    try {
      const response = await axiosInstance.post(`/revision/${revisionId}/done?date=${date}`, {
        startTime: startTime?.format('HH:mm'),
        endTime: endTime?.format('HH:mm')
      });
      if (response.status === 200) dispatch(getRevision({ date }));
    } finally {
      handleRevisionClose();
    }
  };

  const handleLessonSubmit = async (subject, topic, startTime, endTime, createRevision) => {
    try {
      const response = await axiosInstance.post(`/schedule/add`, {
        date,
        subject,
        topic,
        startTime: startTime?.format('HH:mm'),
        endTime: endTime?.format('HH:mm'),
        createRevision
      });
      if (response.status === 200) dispatch(getSchedule({ date }));
    } finally {
      handleLessonClose();
    }
  };

  const formatTime = (decimalHours) => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return hours && minutes
      ? `${hours}h ${minutes}mins`
      : hours
      ? `${hours}h`
      : `${minutes}mins`;
  };

  const isFutureDate = dayjs(date).isAfter(dayjs(), 'day');

  return (
    <Container>
      {scheduleIsLoading || revisionIsLoading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ p: 4, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
          <Stack spacing={4}>

            {/* Revisions */}
            <Paper elevation={3} sx={{ p: 3, backgroundColor: '#ffffff' }}>
              <Typography variant="h5" gutterBottom color="primary">
                Revisions for Today
              </Typography>
              <List>
                {revisions?.length ? (
                  revisions.map((item) => (
                    <ListItem
                      key={item._id}
                      secondaryAction={
                        item.isDone ? (
                          <Tooltip title="Completed">
                            <CheckCircleIcon color="success" />
                          </Tooltip>
                        ) : (
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={() => handleMarkDone(item._id)}
                            disabled={isFutureDate}
                          >
                            Done
                          </Button>
                        )
                      }
                    >
                      <ListItemText
                        primary={`${item.subject} - ${item.topic}`}
                        secondary={`Revision Time: ${formatTime(item.hours)}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography color="text.secondary">No Revisions for Today</Typography>
                )}
              </List>
            </Paper>

            {/* Lessons */}
            <Paper elevation={3} sx={{ p: 3, backgroundColor: '#ffffff' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" gutterBottom color="primary">
                  Lessons for Today
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#42a5f5' }}
                  startIcon={<AddIcon />}
                  onClick={() => setOpenAddLesson(true)}
                  disabled={isFutureDate}
                >
                  Add
                </Button>
              </Box>
              <List>
                {schedules?.length ? (
                  schedules.map((item) => (
                    <ListItem key={item._id}>
                      <ListItemText
                        primary={`${item.subject} - ${item.topic}`}
                        secondary={`Time Spent: ${formatTime(item.hours)} → ${item.startTime} - ${item.endTime}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography color="text.secondary">No Lessons for Today</Typography>
                )}
              </List>
            </Paper>

            {openRevisionDialog && (
              <RevisionDialog
                openRevisionDialog={openRevisionDialog}
                handleClose={handleRevisionClose}
                handleSubmit={handleRevisionSubmit}
              />
            )}
            {openAddLesson && (
              <AddLessonDialog
                openAddLesson={openAddLesson}
                onClose={handleLessonClose}
                onSubmit={handleLessonSubmit}
              />
            )}

          </Stack>
        </Box>
      )}
    </Container>
  );
};
