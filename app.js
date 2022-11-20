if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const app = express();
const passport = require('passport');
const LocalPassport = require('passport-local');
const User = require('./models/user');
const ExpressError = require('./utils/expressError.js');
const animalsRoute = require('./routes/animals');
const reviewsRoute = require('./routes/reviews');
const usersRoute = require('./routes/users');
const mongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/animal-world';

const mongoose = require('mongoose');
async function main() {
    await mongoose.connect(dbUrl);
}
main().then(solved => console.log(solved, "success!!!"))
    .catch(err => console.log(err));

const secret = process.env.SECRET || "777";
const store = mongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e) {
    console.log("777");
})

const sessionConfig = {
    secret,
    store,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
    }
}


app.set('view engine', 'ejs');
app.set(path.join(__dirname, 'views'));
app.engine('ejs', ejsmate);

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//----------------------------------------------------------//


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser',async (req, res, next) => {
    const user = new User({email : "33", username : "11"});
    const newUser = await User.register(user, "12");
    res.send(newUser);
})

app.use('/', usersRoute);
app.use('/animals', animalsRoute);
app.use('/animals/:id/reviews', reviewsRoute);


app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError(404, "找不到此頁面"))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something goes wrong!!!"
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Serving on port ${port}.`);
});
