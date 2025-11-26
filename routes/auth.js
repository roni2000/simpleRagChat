const express = require('express');
const router = express.Router();
const passport = require('../config/auth');
const logger = require('../config/logger');
const { ensureNotAuthenticated, ensureAuthenticated } = require('../middleware/auth');

// Login page
router.get('/login', ensureNotAuthenticated, (req, res) => {
    res.render('login', { 
        error: req.flash('error'),
        success: req.flash('success'),
        pm_name: process.env.PM_NAME || 'Property Manager'
    });
});

// Google OAuth routes
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/auth/google/callback',
    (req, res, next) => {
        passport.authenticate('google', (err, user, info) => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/login');
            }
            if (!user) {
                req.flash('error', 'Authentication failed. Please try again.');
                return res.redirect('/login');
            }
            req.logIn(user, (err) => {
                if (err) {
                    req.flash('error', 'Login failed. Please try again.');
                    return res.redirect('/login');
                }
                // Successful authentication, redirect home or to original URL
                const returnTo = req.session.returnTo || '/';
                delete req.session.returnTo;
                res.redirect(returnTo);
            });
        })(req, res, next);
    }
);

// Logout route
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout((err) => {
        if (err) {
            logger.error('Logout error', err);
        }
        req.session.destroy((err) => {
            if (err) {
                logger.error('Session destroy error', err);
            }
            res.redirect('/login');
        });
    });
});

// API endpoint to get current user info
router.get('/api/user', ensureAuthenticated, (req, res) => {
    res.json({
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar
        }
    });
});

module.exports = router; 