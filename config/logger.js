const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels with numeric values for hierarchy
const LOG_LEVELS = {
    'error': 0,
    'warn': 1,
    'info': 2,
    'debug': 3
};

// Get current log level from environment variable, default to 'info'
const CURRENT_LOG_LEVEL = process.env.PMADMIN_LOG_LEVEL || 'info';
const CURRENT_LOG_LEVEL_VALUE = LOG_LEVELS.hasOwnProperty(CURRENT_LOG_LEVEL.toLowerCase()) 
    ? LOG_LEVELS[CURRENT_LOG_LEVEL.toLowerCase()] 
    : LOG_LEVELS['info'];

// Helper function to format timestamp
function formatTimestamp() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
}

// Helper function to get log filename based on date
function getLogFilename(level = 'app') {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(logsDir, `${level}-${today}.log`);
}

// Helper function to check if a log level should be written
function shouldLog(level) {
    const levelValue = LOG_LEVELS[level.toLowerCase()];
    return levelValue !== undefined && levelValue <= CURRENT_LOG_LEVEL_VALUE;
}

// Helper function to write to log file
function writeToFile(level, message, additionalData = null) {
    // Special logging types (login, server, database) always write regardless of level
    const specialTypes = ['login', 'server', 'database'];
    const isSpecialType = specialTypes.includes(level.toLowerCase());
    
    // Check if this log level should be written based on current log level
    // Skip this check for special types
    if (!isSpecialType && !shouldLog(level)) {
        return; // Skip logging if level is higher than current setting
    }
    
    const timestamp = formatTimestamp();
    let logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (additionalData) {
        logEntry += ` | ${JSON.stringify(additionalData)}`;
    }
    
    logEntry += '\n';
    
    const filename = getLogFilename(level);
    
    try {
        fs.appendFileSync(filename, logEntry);
    } catch (error) {
        // Fallback to console if file logging fails
        console.error(`Failed to write to log file ${filename}:`, error);
        console.log(logEntry.trim());
    }
}

// Main logging functions
const logger = {
    info: (message, additionalData = null) => {
        writeToFile('info', message, additionalData);
    },
    
    error: (message, error = null) => {
        const errorData = error ? {
            message: error.message,
            stack: error.stack,
            name: error.name
        } : null;
        writeToFile('error', message, errorData);
    },
    
    warn: (message, additionalData = null) => {
        writeToFile('warn', message, additionalData);
    },
    
    debug: (message, additionalData = null) => {
        writeToFile('debug', message, additionalData);
    },
    
    // Special method for login logging with user details
    login: (message, userDetails = null) => {
        const loginData = userDetails ? {
            email: userDetails.email,
            realtor_id: userDetails.realtor_id,
            realtor_short_name: userDetails.realtor_short_name
        } : null;
        writeToFile('login', message, loginData);
    },
    
    // Special method for server events
    server: (message, additionalData = null) => {
        writeToFile('server', message, additionalData);
    },
    
    // Special method for database events
    database: (message, additionalData = null) => {
        writeToFile('database', message, additionalData);
    },
    
    // Method to get current log level configuration
    getLogLevel: () => {
        return {
            level: CURRENT_LOG_LEVEL,
            value: CURRENT_LOG_LEVEL_VALUE,
            availableLevels: Object.keys(LOG_LEVELS)
        };
    },
    
    // Method to check if a specific level will be logged
    willLog: (level) => {
        return shouldLog(level);
    }
};

// Log initialization message
logger.info(`Logger initialized with level: ${CURRENT_LOG_LEVEL.toUpperCase()}`, {
    logLevel: CURRENT_LOG_LEVEL,
    logLevelValue: CURRENT_LOG_LEVEL_VALUE,
    availableLevels: Object.keys(LOG_LEVELS)
});

module.exports = logger; 