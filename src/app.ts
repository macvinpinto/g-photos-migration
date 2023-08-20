import path from 'path';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import googleStrategyBuilder from './utils/google-strategy'

const app = express();
const port = 8080;

interface User extends Express.User, Express.AuthInfo{}

let sourceUser: User | undefined;
let targetUser: User | undefined;


// Middleware
app.use(
    session({
        secret: process.env['SESSION_SECRET'] || 'cat_secret',
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth 2.0 Strategy
passport.use('google-user1', googleStrategyBuilder(1));

// Configure Google OAuth 2.0 Strategy For Second User
passport.use('google-user2', googleStrategyBuilder(2));

// Serialize and Deserialize User
passport.serializeUser((user: any, done) => {
    done(null, user);
});

passport.deserializeUser((user: any, done) => {
    done(null, user);
});

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Define a route to render the EJS template
app.get('/', (req, res) => {
    const data = { message: 'Hello, EJS with TypeScript!' };
    res.render('index', { user1: sourceUser, user2: targetUser });
});

// Define Routes
app.get('/auth/google/user1', passport.authenticate('google-user1', { scope: ['profile', 'email'], }));
app.get('/auth/google/user2', passport.authenticate('google-user2', { scope: ['profile', 'email'], }));

app.get(
    '/auth/google/callback/user1',
    passport.authenticate('google-user1', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect or handle response
        console.log('Successfull-1');
        console.log(req.authInfo);
        
        sourceUser = { ...req.user, ...req.authInfo };

        res.redirect('/');
    }
);

app.get(
    '/auth/google/callback/user2',
    passport.authenticate('google-user2', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect or handle response
        console.log('Successfull-2');
        targetUser = { ...req.user, ...req.authInfo }

        res.redirect('/');
    }
);

app.get('/logout', (req, res) => {
    // req.logout();
    res.redirect('/');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
