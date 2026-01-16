#!/usr/bin/env node

/**
 * Day 8 - Config Manager CLI
 * 
 * Objectives:
 * - Implement a robust configuration manager using JSON files
 * - Support reading, writing, and merging settings
 * - Handle nested configuration paths
 * - Zero external dependencies (Zero copy-paste policy)
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, 'config.json');

const DEFAULT_CONFIG = {
    theme: 'dark',
    language: 'en',
    notifications: true,
    user: {
        name: 'Guest',
        role: 'developer'
    },
    lastLogin: null
};

/**
 * Configuration Manager Class
 */
class ConfigManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.config = {};
        this.init();
    }

    /**
     * Initialize configuration (load or create defaults)
     */
    init() {
        if (!fs.existsSync(this.filePath)) {
            console.log('ℹ️ No config file found. Initializing with defaults...');
            this.config = { ...DEFAULT_CONFIG };
            this.save();
        } else {
            this.load();
        }
    }

    /**
     * Load configuration from file
     */
    load() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            this.config = JSON.parse(data);
        } catch (error) {
            console.error('❌ Error: Config file is corrupted or inaccessible.');
            console.log('ℹ️ Falling back to default settings.');
            this.config = { ...DEFAULT_CONFIG };
        }
    }

    /**
     * Save current configuration to file
     */
    save() {
        try {
            const data = JSON.stringify(this.config, null, 2);
            fs.writeFileSync(this.filePath, data, 'utf8');
        } catch (error) {
            console.error('❌ Error: Failed to save configuration:', error.message);
        }
    }

    /**
     * Get value by key (supports dot notation)
     */
    get(keyPath) {
        return keyPath.split('.').reduce((acc, part) => {
            return acc && acc[part] !== undefined ? acc[part] : undefined;
        }, this.config);
    }

    /**
     * Set value by key (supports dot notation)
     */
    set(keyPath, value) {
        const parts = keyPath.split('.');
        let current = this.config;

        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (current[part] === undefined || typeof current[part] !== 'object') {
                current[part] = {};
            }
            current = current[part];
        }

        current[parts[parts.length - 1]] = value;
        this.save();
    }

    /**
     * Reset configuration to defaults
     */
    reset() {
        this.config = { ...DEFAULT_CONFIG };
        this.save();
    }

    /**
     * List all current settings
     */
    list() {
        return this.config;
    }
}

/**
 * --- Main Execution ---
 */

const manager = new ConfigManager(CONFIG_FILE);

const args = process.argv.slice(2);

function showHelp() {
    console.log('\n⚙️ Config Manager CLI - Day 8');
    console.log('===============================');
    console.log('Usage:');
    console.log('  node index.js --get <key>        Get value (e.g., user.name)');
    console.log('  node index.js --set <key>=<val>  Set value');
    console.log('  node index.js --list             List all settings');
    console.log('  node index.js --reset            Reset to defaults');
    console.log('  node index.js --help             Show this help');
}

if (args.length === 0 || args.includes('--help')) {
    showHelp();
    process.exit(0);
}

const command = args[0];

switch (command) {
    case '--get':
        const key = args[1];
        if (!key) {
            console.error('❌ Error: Missing key for --get');
            process.exit(1);
        }
        const val = manager.get(key);
        console.log(`\n🔍 ${key}: \x1b[36m${val !== undefined ? val : '(not set)'}\x1b[0m`);
        break;

    case '--set':
        const pair = args[1];
        if (!pair || !pair.includes('=')) {
            console.error('❌ Error: --set requires a key=value pair');
            process.exit(1);
        }
        const [setKey, setVal] = pair.split('=');

        // Simple type conversion
        let finalVal = setVal;
        if (setVal === 'true') finalVal = true;
        else if (setVal === 'false') finalVal = false;
        else if (!isNaN(setVal) && setVal.trim() !== '') finalVal = Number(setVal);

        manager.set(setKey, finalVal);
        console.log(`\n✅ Successfully set \x1b[33m${setKey}\x1b[0m to \x1b[32m${finalVal}\x1b[0m`);
        break;

    case '--list':
        console.log('\n📋 Current Configuration:');
        console.log('---------------------------');
        console.log(JSON.stringify(manager.list(), null, 2));
        break;

    case '--reset':
        manager.reset();
        console.log('\n🔄 Configuration reset to default values.');
        break;

    default:
        console.error(`❌ Error: Unknown command: ${command}`);
        showHelp();
        process.exit(1);
}
