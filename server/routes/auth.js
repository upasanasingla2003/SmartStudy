const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.post('/register', async (req, res, next) => {
    try {
        let { email, password, firstName, lastName } = req.body;
        const user = new User({ email, firstName, lastName });
        const newUser = await User.register(user, password);

        req.login(newUser, function (err) {
            if (err) return next(err);
            res.status(200).json({ message: 'User registered', user: newUser });
        });
    } catch (e) {
        console.log(e)
        if (e.name === 'UserExistsError') {
            return res.status(409).json({ error: 'User already exists' }); // 🔸 Conflict
        }
        res.status(500).json({ error: e.message }); // ✅ Proper error response
    }
});

// router.post('/login',
//     passport.authenticate('local', { 
//        failureRedirect: '/login', 
//        failureMessage: true ,
//     }),
//     function(req, res) {
//         const retObject = {
//             firstName: req.user.firstName,
//             lastName: req.user.lastName,
//             email: req.user.email
//         }
//         res.send(retObject)
//     }
// );

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log('Request Body:', req.body);
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
      req.login(user, (err) => {
        if (err) return next(err);
        const retObject = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          target: user.target,
          calender: user.calender
        };
        return res.status(200).json(retObject);
      });
    })(req, res, next);
  });

// router.get('/validate', (req, res) =>{
//     if()
// } )

router.get('/logout',(req,res)=>{
    req.logout(()=>{
        res.status(200).json({ message: 'Logout Successful' })
    });
        
});

module.exports = router;
