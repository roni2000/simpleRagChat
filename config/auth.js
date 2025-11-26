const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Get the user's email from Google profile
        const userEmail = profile.emails[0].value;
        
        // Check if the user's email is in the users table and get their realtor_id
        const userData = process.env.GMAIL_ACCOUNT;
        if (!userData.isAllowed) {
            return done(new Error(`Access denied. Email ${userEmail} is not authorized to access this application.`), null);
        }
        
        // User is authorized, create user object with realtor_id
        const user = {
            id: profile.id,
            name: profile.displayName,
            email: userEmail,
            avatar: profile.photos[0].value,
            accessToken: accessToken,
            short_name: userData.short_name // Store short_name for session-wide use
        };
        
        
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport; 