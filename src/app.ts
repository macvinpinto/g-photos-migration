import path from 'path';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';

const app = express();
const port = 8080;

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
passport.use(
    new GoogleStrategy.Strategy(
        {
            clientID: process.env['GOOGLE_CLIENT_ID'] || '',
            clientSecret: process.env['GOOGLE_CLIENT_SECRET'] || '',
            callbackURL: 'http://localhost:8080/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            // You can handle user data and store it in a database
            console.log(profile);

            return done(null, profile);
        }
    )
);

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
    res.render('index', { user1: req.user, user2: undefined });
});

// Define Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect or handle response
        console.log('Successfull');

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
