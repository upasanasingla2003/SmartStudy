import React, { useState } from 'react';
import { Paper, Box } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useNavigate } from 'react-router-dom';

export const Calender = () => {
  const [value, setValue] = useState(dayjs());
  const navigate = useNavigate();

  const handleOnChange = (newValue) => {
    const year = newValue.$y;
    const month = newValue.$M + 1 < 10 ? '0' + (newValue.$M + 1) : newValue.$M + 1;
    const day = newValue.$D < 10 ? '0' + newValue.$D : newValue.$D;
    const date = year + '/' + month + '/' + day;
    navigate(`/schedule?date=${date}`);
  };

  return (
    <Box
      sx={{
        height: '675px',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '1000px',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 2,
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={value}
            onChange={(newValue) => {
              handleOnChange(newValue);
            }}
            sx={{
              width: '100%',
              height: '100%',
              '& .MuiDayCalendar-monthContainer': {
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'space-between',
              },
              '& .MuiDayCalendar-header': {
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                justifyItems: 'center',
                alignItems: 'center',
                height: '10%',
                fontSize: '1.25rem',
                color: '#444',
                fontWeight: 'bold',
              },
              '& .MuiPickersDay-root': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                fontSize: '1rem',
              },
              '& .MuiPickersDay-day': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                fontSize: '1rem',
              },
              '& .MuiPickersDay-root.Mui-selected': {
                backgroundColor: '#42a5f5',
                border: 0,
                fontWeight: 'bold',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#42a5f5',
                },
              },
            }}
          />
        </LocalizationProvider>
      </Paper>
    </Box>
  );
};
