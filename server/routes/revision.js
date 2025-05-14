const express = require('express');
const { findById } = require('../models/User');
const User = require('../models/User');
const Calender = require('../models/Calender');
const Revision = require('../models/Revision');
const Schedule = require('../models/Schedule');
const router = express.Router()

router.get('/revision', async(req, res) => {

    if (!req.isAuthenticated()) return res.status(401).json({ error: 'User not authenticated' });

    const { date } = req.query;
    const userId = req.user._id

    if (!date) return res.status(400).json({ error: 'Date is required' });
      

    try{
        const user = await User.findById(userId).populate({
            path: 'calender',
            match: {date: new Date(date)},
            populate: {
                path: 'revisions'
            }
        })
        console.log(user)
        if(!user) return res.status(404).json({error: "User not found"});

        const calenderEntry = user.calender[0];
        console.log(calenderEntry)
        if(!calenderEntry) return res.status(200).json({revision: []})
            console.log(calenderEntry)
        return res.status(200).json({ revision: calenderEntry.revisions });
    }
catch{
    return res.status(500).json({ error: 'Server error' });
}
})

router.post('/revision/:id/done', async(req, res) => {
    const userId = req.user._id;

    if(!userId) return res.status(404).json({error: "User not found"});

    const { startTime, endTime } = req.body;
    const { id } = req.params;
    const {date} = req.query;
    if(!id) return res.status(404).json({error: 'Revision not found'});

    const revision = await Revision.findByIdAndUpdate(id, {isDone: true});

    if(!revision) return res.status(404).json({error: 'Revision not found'});

    const newSchedule = await Schedule.create({
        startTime,
        endTime,
        hours: calculateHours(startTime,endTime),
        subject: revision.subject,
        topic: revision.topic
    });

    const targetDate = new Date(date);
        // targetDate.setHours(0, 0, 0, 0);  // normalize date for comparison
    
        // 3. Find the user's calendar entry for the date
        let calendar = await Calender.findOne({ date: targetDate });
    
            calendar.schedule.push(newSchedule._id);
            await calendar.save();

        return res.status(200).json({message: "Revision completed successfully"});

})
function calculateHours(startTime, endTime) {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
  
    const start = new Date(0, 0, 0, startHours, startMinutes);
    const end = new Date(0, 0, 0, endHours, endMinutes);
  
    const diffMs = end - start;
  
    if (diffMs < 0) throw new Error('End time must be after start time');
  
    return Math.round((diffMs / (1000 * 60 * 60))*100)/100; // convert milliseconds to hours
  }
module.exports = router