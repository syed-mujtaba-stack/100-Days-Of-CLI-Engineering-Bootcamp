#!/usr/bin/env node

/**
 * Day 9 - Logger Tool CLI
 * 
 * Objectives:
 * - Implement a class-based logging system from scratch
 * - Support log levels: DEBUG, INFO, WARN, ERROR
 * - Add color support using ANSI codes
 * - Implement persistent file-based logging
 * - Zero external dependencies (Zero copy-paste policy)
 */

const fs = require('fs');
const path = require('path');

/**
 * Log Level Definitions and Priorities
 */
const LEVELS = {
    DEBUG: { id: 0, label: 'DEBUG', color: '\x1b[90m' }, // Gray
    INFO: { id: 1, label: 'INFO ', color: '\x1b[36m' }, // Cyan
    WARN: { id: 2, label: 'WARN ', color: '\x1b[33m' }, // Yellow
    ERROR: { id: 3, label: 'ERROR', color: '\x1b[31m' }  // Red
};

const RESET = '\x1b[0m';

/**
 * Logger Class
 */
class Logger {
    constructor(options = {}) {
        this.name = options.name || 'App';
        this.minLevel = options.minLevel || LEVELS.DEBUG.id;
        this.logFile = options.logFile || path.join(__dirname, 'combined.log');
        this.showTimestamp = options.showTimestamp !== false;
        this.enableConsole = options.enableConsole !== false;
        this.enableFile = options.enableFile !== false;
    }

    /**
     * Internal method to format and output log
     */
    _log(levelKey, message) {
        const level = LEVELS[levelKey];
        if (level.id < this.minLevel) return;

        const timestamp = this.showTimestamp ? `[${new Date().toISOString()}] ` : '';
        const label = `[${level.label}]`;
        const formattedMessage = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;

        // Console Output (with colors)
        if (this.enableConsole) {
            console.log(`${this.name}: ${timestamp}${level.color}${label}${RESET} ${formattedMessage}`);
        }

        // File Output (plain text)
        if (this.enableFile) {
            const fileEntry = `${this.name}: ${timestamp}${label} ${formattedMessage}\n`;
            try {
                fs.appendFileSync(this.logFile, fileEntry, 'utf8');
            } catch (err) {
                process.stderr.write(`Failed to write to log file: ${err.message}\n`);
            }
        }
    }

    debug(msg) { this._log('DEBUG', msg); }
    info(msg) { this._log('INFO', msg); }
    warn(msg) { this._log('WARN', msg); }
    error(msg) { this._log('ERROR', msg); }

    setThreshold(levelName) {
        if (LEVELS[levelName]) {
            this.minLevel = LEVELS[levelName].id;
        }
    }
}

/**
 * --- Demonstration ---
 */

function runDemo() {
    const log = new Logger({ name: 'Bootcamp' });

    console.log('\n🪵 Logger Tool CLI - Day 9');
    console.log('===========================\n');

    log.debug('Initializing the application components...');
    log.info('System operational and ready for input.');
    log.warn('Disk usage over 80% on primary partition.');
    log.error('Failed to establish connection to database: Access Denied.');

    console.log('\n--- Object Logging ---');
    log.info({
        event: 'user_login',
        userId: 12345,
        status: 'success',
        timestamp: Date.now()
    });

    console.log('\n--- Level Filtering (Threshold: WARN) ---');
    log.setThreshold('WARN');
    log.debug('This debug message will NOT be shown.');
    log.info('This info message will NOT be shown.');
    log.warn('This warning WILL be shown.');
    log.error('This error WILL be shown.');

    console.log(`\n📄 Logs persisted to: ${path.basename(log.logFile)}`);
    console.log('\n' + '\x1b[32m\x1b[1m✨ Day 9 Complete! Professional logging established.\x1b[0m' + '\n');
}

if (require.main === module) {
    runDemo();
}

module.exports = Logger;
