import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export const AddLessonDialog = ({ openAddLesson, onClose, onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [createRevision, setCreateRevision] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!subject || !topic || !startTime || !endTime) {
      setError('Please fill in all fields.');
      return;
    }

    if (endTime.isSame(startTime) || endTime.isBefore(startTime)) {
      setError('End time must be after start time.');
      return;
    }

    setError('');
    onSubmit(
      subject,
      topic,
      startTime,
      endTime,
      createRevision,
    );
  };

  return (
    <Dialog open={openAddLesson} onClose={onClose}>
      <DialogTitle>Add New Lesson</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
          />
          <TextField
            label="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            fullWidth
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(e)=>setStartTime(e)}
              ampm={false}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(e)=>setEndTime(e)}
              ampm={false}
            />
          </LocalizationProvider>
          <FormControlLabel
            control={
              <Checkbox
                checked={createRevision}
                onChange={(e) => setCreateRevision(e.target.checked)}
              />
            }
            label="Create revisions for this Lesson?"
          />
          {error && <span style={{ color: 'red' }}>{error}</span>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
