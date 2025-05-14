if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session');
const passport =  require('passport');
const LocalStrategy =  require('passport-local');
const User = require('./models/User');
const MongoStore = require('connect-mongo');
const cors = require('cors')

app.use(cors({
    origin: 'https://smartstudy-7t68.onrender.com',
    credentials: true // Allow cookies/sessions if you're using them
  }));

mongoose.connect('mongodb+srv://study-smart-user:6XpQloc3Y9IOeMEz@cluster0.q5ekzt0.mongodb.net/')
.then(()=>{
    console.log('DB connected')
})
.catch((err)=>{
    console.log(err,'Error occured in Db Connection')
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let store = MongoStore.create({
    secret:'secret',
    mongoUrl: 'mongodb://127.0.0.1:27017/revision-scheduler',
    touchAfter:24*60*60
})
const sessionConfig = {
    store:store,
    name:'upasana',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



passport.use(new LocalStrategy({ usernameField: 'email' },User.authenticate()));


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

const authRoutes = require('./routes/auth');
const scheduleRoutes = require('./routes/schedule');
const revisionRoutes = require('./routes/revision');

app.use(authRoutes);
app.use(scheduleRoutes);
app.use(revisionRoutes)

app.get('/', (req, res) => res.send('Hello World'))

app.listen(8080, () => {
    console.log("connected to port 8080")
})
