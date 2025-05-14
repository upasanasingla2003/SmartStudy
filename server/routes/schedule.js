// routes/schedule.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Calender = require('../models/Calender');
const Schedule = require('../models/Schedule');
const Revision = require('../models/Revision');

function calculateHours(startTime, endTime) {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const start = new Date(0, 0, 0, startHours, startMinutes);
  const end = new Date(0, 0, 0, endHours, endMinutes);

  const diffMs = end - start;

  if (diffMs < 0) throw new Error('End time must be after start time');

  return Math.round((diffMs / (1000 * 60 * 60))*100)/100; // convert milliseconds to hours
}

// GET /api/schedule?userId=USER_ID&date=YYYY-MM-DD
router.get('/schedule', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      const userId = req.user._id;
      console.log(userId)
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  try {
    const user = await User.findById(userId).populate({
      path: 'calender',
      match: { date: new Date(date) }, // Match specific date
      populate: {
        path: 'schedule', // Populate the schedule inside calendar
      }
    });

    console.log(user)

    if (!user) return res.status(404).json({ error: 'User not found' });

    const calendarEntry = user.calender[0];
    if (!calendarEntry) return res.status(200).json({ schedule : [] });
    
    return res.status(200).json({ schedule: calendarEntry.schedule });

  } catch (err) {
    console.error('Error fetching schedule:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});



router.post('/schedule/add', async (req, res) => {
  try {
    const { date, startTime, endTime, subject, topic, createRevision } = req.body;

    const userId = req.user._id;

    const hours = calculateHours(startTime, endTime);
    // 1. Create the Schedule entry
    const newSchedule = await Schedule.create({
        startTime,
        endTime,
        hours,
        subject,
        topic
    });

    // 2. Parse the date to just yyyy-mm-dd for matching
    const targetDate = new Date(date);
    // targetDate.setHours(0, 0, 0, 0);  // normalize date for comparison

    // 3. Find the user's calendar entry for the date
    let calendar = await Calender.findOne({ date: targetDate });

    // 4. If not found, create it and add it to user.calender
    if (!calendar) {
        calendar = await Calender.create({
            date: targetDate,
            schedule: [newSchedule._id]
        });

        // Also update user to link this calendar
        await User.findByIdAndUpdate(userId, {
            $push: { calender: calendar._id }
        });
    } else {
        // 5. If calendar exists, add the schedule entry
        calendar.schedule.push(newSchedule._id);
        await calendar.save();
    }
    if(createRevision) await createRevisionsForSchedule(newSchedule._id, date, userId);

    res.status(200).json({message: "Schedule added successfully"});
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
}
});


function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

// Main function to create revisions
async function createRevisionsForSchedule(scheduleId, baseDate, userId) {
  const schedule = await Schedule.findById(scheduleId);
  if (!schedule) throw new Error('Schedule not found');

  const baseHours = schedule.hours;

  const revisionsPlan = [
      { daysLater: 1, percent: 0.25 },
      { daysLater: 3, percent: 0.15 },
      { daysLater: 6, percent: 0.10 }
  ];

  for (const { daysLater, percent } of revisionsPlan) {
      const revisionDate = addDays(baseDate, daysLater);
      const hours = Math.round(baseHours * percent * 100) / 100; // round to 2 decimals

      // Create revision
      const revision = await Revision.create({
          hours,
          subject: schedule.subject,
          topic: schedule.topic
      });

      // Find or create calendar entry
      let calendar = await Calender.findOne({ date: revisionDate });
      if (!calendar) {
          calendar = await Calender.create({
              date: revisionDate,
              revisions: [revision._id]
          });
          await User.findByIdAndUpdate(userId, {
            $push: { calender: calendar._id }
        });
      } else {
          calendar.revisions.push(revision._id);
          await calendar.save();
      }
  }
}

module.exports = router;