// Authentication middleware
const ensureAuthenticated = async (req, res, next) => {
    // Check if Google login is disabled for testing
    if (process.env.GOOGLE_LOGIN === 'FALSE') {
        // Get realtor_short_name from database even in testing mode
        let short_name = 'TEST'; // fallback
        try {
            const { pool } = require('../config/database');
            const logger = require('../config/logger');
            
            const realtorQuery = 'SELECT short_name FROM realtor WHERE id = $1';
            const realtorResult = await pool.query(realtorQuery, [1]); // realtor_id = 1 for dev
            
            if (realtorResult.rows.length > 0 && realtorResult.rows[0].short_name) {
                short_name = realtorResult.rows[0].short_name;
            }
            
            // Log the testing mode login with realtor information
            logger.login('Testing mode user authenticated', {
                email: 'test@example.com',
                realtor_id: 1,
                realtor_short_name: short_name
            });
        } catch (error) {
            const logger = require('../config/logger');
            logger.error('Error fetching realtor short_name in testing mode', error);
            // Continue with fallback value
        }
        
        // Create a mock user for testing purposes
        req.user = {
            id: 'test-user-id',
            name: 'Test User',
            email: 'test@example.com',
            avatar: 'https://via.placeholder.com/150',
            accessToken: 'test-token',
            realtor_id: 1, // Default realtor_id for testing
            short_name: short_name // Retrieved from database
        };
        return next();
    }
    
    if (req.isAuthenticated()) {
        return next();
    }
    // Store the original URL they were trying to access
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
};

// Check if user is authenticated (for API responses)
const isAuthenticated = async (req, res, next) => {
    // Check if Google login is disabled for testing
    if (process.env.GOOGLE_LOGIN === 'FALSE') {
        // Get realtor_short_name from database even in testing mode
        let short_name = 'TEST'; // fallback
        try {
            const { pool } = require('../config/database');
            const logger = require('../config/logger');
            
            const realtorQuery = 'SELECT short_name FROM realtor WHERE id = $1';
            const realtorResult = await pool.query(realtorQuery, [1]); // realtor_id = 1 for dev
            
            if (realtorResult.rows.length > 0 && realtorResult.rows[0].short_name) {
                short_name = realtorResult.rows[0].short_name;
            }
            
            // Log the testing mode API authentication with realtor information
            logger.login('Testing mode API user authenticated', {
                email: 'test@example.com',
                realtor_id: 1,
                realtor_short_name: short_name
            });
        } catch (error) {
            const logger = require('../config/logger');
            logger.error('Error fetching realtor short_name in testing mode API', error);
            // Continue with fallback value
        }
        
        // Create a mock user for testing purposes
        req.user = {
            id: 'test-user-id',
            name: 'Test User',
            email: 'test@example.com',
            avatar: 'https://via.placeholder.com/150',
            accessToken: 'test-token',
            realtor_id: 1, // Default realtor_id for testing
            short_name: short_name // Retrieved from database
        };
        return next();
    }
    
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Authentication required' });
};

// Ensure user is not authenticated (for login page)
const ensureNotAuthenticated = (req, res, next) => {
    // If Google login is disabled, redirect to dashboard
    if (process.env.GOOGLE_LOGIN === 'FALSE') {
        return res.redirect('/dashboard');
    }
    
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

module.exports = {
    ensureAuthenticated,
    isAuthenticated,
    ensureNotAuthenticated
}; 