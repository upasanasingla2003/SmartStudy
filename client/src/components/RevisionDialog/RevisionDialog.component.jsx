import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export const RevisionDialog = ({openRevisionDialog, handleClose, handleSubmit}) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState('');

  const onSubmit = () => {
    if (!startTime || !endTime) {
      setError('Please select both start and end time');
      return;
    }

    if (endTime.isSame(startTime) || endTime.isBefore(startTime)) {
      setError('End time must be after start time');
      return;
    }

    setError('');
    handleSubmit(startTime, endTime);
  };

  return (
    <Dialog open={openRevisionDialog} onClose={handleClose}>
    <DialogTitle>Select Time Slot</DialogTitle>
    <DialogContent>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Start Time"
          value={startTime}
          onChange={(newValue) => setStartTime(newValue)}
          ampm={false}
          sx={{ mt: 1, mb: 2 }}
        />
        <TimePicker
          label="End Time"
          value={endTime}
          onChange={(newValue) => setEndTime(newValue)}
          ampm={false}
          sx={{ mb: 2 }}
        />
      </LocalizationProvider>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button variant="contained" onClick={onSubmit}>
        Submit
      </Button>
    </DialogActions>
  </Dialog>

  );
};
