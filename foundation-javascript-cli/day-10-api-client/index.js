#!/usr/bin/env node

/**
 * Day 10 - API Client CLI
 * 
 * Objectives:
 * - Implement an API client using the native 'fetch' API
 * - Support GET and POST methods
 * - Handle JSON request/response formats
 * - Provide performance metrics and error handling
 * - Zero external dependencies (Zero copy-paste policy)
 */

import { performance } from 'perf_hooks';

/**
 * Color helper for professional output
 */
const colors = {
    reset: '\x1b[0m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
    bold: '\x1b[1m'
};

/**
 * API Client Utility
 */
class ApiClient {
    constructor() {
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'User-Agent': 'Bootcamp-API-Client/1.0.0'
        };
    }

    /**
     * Internal request wrapper
     */
    async _request(url, options = {}) {
        console.log(`${colors.gray}[${new Date().toLocaleTimeString()}]${colors.reset} ${colors.bold}${options.method || 'GET'}${colors.reset} ${url}...`);

        const startTime = performance.now();

        try {
            const response = await fetch(url, {
                ...options,
                headers: { ...this.defaultHeaders, ...options.headers }
            });

            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2);

            const statusColor = response.ok ? colors.green : colors.red;
            console.log(`${colors.gray}Status:${colors.reset} ${statusColor}${response.status} ${response.statusText}${colors.reset} ${colors.gray}(${duration}ms)${colors.reset}`);

            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                throw new Error(`API Error (${response.status}): ${typeof data === 'string' ? data : JSON.stringify(data)}`);
            }

            return data;
        } catch (error) {
            // Direct pass-through of error message for debugging
            throw new Error(`${error.message}`);
        }
    }

    async get(url) {
        return this._request(url, { method: 'GET' });
    }

    async post(url, body) {
        return this._request(url, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }
}

/**
 * --- Command Line Execution ---
 */

const args = process.argv.slice(2);

function showHelp() {
    console.log(`
${colors.cyan}${colors.bold}🌐 API Client CLI - Day 10${colors.reset}
===============================
Usage:
  node index.js --get <url>               Perform a GET request
  node index.js --post <url> --data <jsn> Perform a POST request
  node index.js --help                    Show this help message

${colors.yellow}${colors.bold}Windows (PowerShell) Tips:${colors.reset}
1. If single quotes fail, wrap JSON in double quotes and escape internal quotes:
   ${colors.gray}node index.js --post http://api.com --data "{\\\"title\\\":\\\"foo\\\"}"${colors.reset}
2. Or use a simple string if your JSON doesn't contain spaces.

Examples:
  node index.js --get https://jsonplaceholder.typicode.com/posts/1
  node index.js --post https://jsonplaceholder.typicode.com/posts --data '{"title":"foo","body":"bar"}'
`);
}

async function main() {
    if (args.length === 0 || args.includes('--help')) {
        showHelp();
        return;
    }

    const client = new ApiClient();

    try {
        if (args.includes('--get')) {
            const urlIndex = args.indexOf('--get') + 1;
            const url = args[urlIndex];
            if (!url) throw new Error('Missing URL for --get');

            const data = await client.get(url);
            console.log('\n' + colors.yellow + 'Response Data:' + colors.reset);
            console.log(JSON.stringify(data, null, 2));
        }
        else if (args.includes('--post')) {
            const urlIndex = args.indexOf('--post') + 1;
            const url = args[urlIndex];
            if (!url) throw new Error('Missing URL for --post');

            const dataIndex = args.indexOf('--data') + 1;
            if (dataIndex === 0 || dataIndex >= args.length) {
                throw new Error('Missing data for --post. Use --data \'<json>\'');
            }

            let rawData = args[dataIndex];
            let body;

            try {
                // PowerShell Resiliency: Strip leading/trailing single quotes if passed literally
                // and handle escaped double quotes.
                let sanitized = rawData;
                if (sanitized.startsWith("'") && sanitized.endsWith("'")) {
                    sanitized = sanitized.slice(1, -1);
                }
                // Handle cases where PowerShell might pass \" as " or leave the backslashes
                sanitized = sanitized.replace(/\\"/g, '"');

                body = JSON.parse(sanitized);
            } catch (e) {
                throw new Error(`Invalid JSON data: ${e.message}\nReceived: ${rawData}\n\nHint: Ensure your JSON properties are in double quotes.`);
            }

            const responseData = await client.post(url, body);
            console.log('\n' + colors.yellow + 'Response Data:' + colors.reset);
            console.log(JSON.stringify(responseData, null, 2));
        }
        else {
            throw new Error(`Unknown argument: ${args[0]}`);
        }

        console.log('\n' + colors.green + colors.bold + '✨ Request Successful!' + colors.reset + '\n');
    } catch (error) {
        console.error(`\n${colors.red}${colors.bold}❌ Error:${colors.reset} ${error.message}\n`);
        process.exit(1);
    }
}

main();
