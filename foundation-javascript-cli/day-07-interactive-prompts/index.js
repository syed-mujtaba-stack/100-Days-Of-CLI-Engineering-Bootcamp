#!/usr/bin/env node

/**
 * Day 7 - Interactive Prompts CLI
 * 
 * Objectives:
 * - Implement an interactive prompting system using the native 'readline' module
 * - Support text, secret (password), confirmation, and selection prompts
 * - Use async/await for clean, sequential interaction
 * - Zero external dependencies (Zero copy-paste policy)
 */

const readline = require('readline');
const { Writable } = require('stream');

/**
 * Custom Writable stream that suppresses output
 * Used for secret/password prompts
 */
class MutableWritable extends Writable {
    constructor() {
        super();
        this.muted = false;
    }

    _write(chunk, encoding, callback) {
        if (!this.muted) {
            process.stdout.write(chunk, encoding);
        }
        callback();
    }
}

/**
 * Interactive Prompter Class
 */
class Prompter {
    constructor() {
        this.mutableStdout = new MutableWritable();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: this.mutableStdout,
            terminal: true
        });
    }

    /**
     * Simple text question
     * @param {string} questionText 
     */
    async ask(questionText) {
        return new Promise((resolve) => {
            this.rl.question(`\x1b[36m?\x1b[0m ${questionText} `, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    /**
     * Secret/Password question (masks input)
     * @param {string} questionText 
     */
    async secret(questionText) {
        return new Promise((resolve) => {
            process.stdout.write(`\x1b[36m?\x1b[0m ${questionText} `);
            this.mutableStdout.muted = true;

            this.rl.question('', (answer) => {
                this.mutableStdout.muted = false;
                process.stdout.write('\n'); // Move to next line since it was muted
                resolve(answer);
            });
        });
    }

    /**
     * Yes/No confirmation
     * @param {string} questionText 
     * @param {boolean} defaultTrue 
     */
    async confirm(questionText, defaultTrue = true) {
        const hint = defaultTrue ? '[Y/n]' : '[y/N]';
        const answer = await this.ask(`${questionText} ${hint}`);

        if (answer === '') return defaultTrue;
        return answer.toLowerCase().startsWith('y');
    }

    /**
     * Select from a list of options
     * @param {string} questionText 
     * @param {string[]} choices 
     */
    async select(questionText, choices) {
        console.log(`\x1b[36m?\x1b[0m ${questionText}`);
        choices.forEach((choice, index) => {
            console.log(`  ${index + 1}) ${choice}`);
        });

        while (true) {
            const answer = await this.ask('Select an option (number):');
            const index = parseInt(answer) - 1;

            if (index >= 0 && index < choices.length) {
                return choices[index];
            }
            console.log(`\x1b[31mError:\x1b[0m Please enter a valid number (1-${choices.length})`);
        }
    }

    /**
     * Close the interface
     */
    close() {
        this.rl.close();
    }
}

/**
 * --- User Profile Setup Wizard (Demo) ---
 */

async function runWizard() {
    const prompter = new Prompter();

    console.log('\n🤖 Interactive User Setup Wizard - Day 7');
    console.log('========================================');

    try {
        const name = await prompter.ask('What is your name?');
        const age = await prompter.ask('How old are you?');

        console.log('\n\x1b[33m[Security]\x1b[0m Let\'s set up your account.');
        const password = await prompter.secret('Create a password:');

        const role = await prompter.select('Choose your development role:', [
            'Frontend Developer',
            'Backend Engineer',
            'Full-stack Developer',
            'DevOps Specialist',
            'AI Researcher'
        ]);

        const newsletter = await prompter.confirm('Would you like to subscribe to the newsletter?', true);

        console.log('\n\x1b[32m✨ Profile Summary ✨\x1b[0m');
        console.log('---------------------------');
        console.log(`Name:      ${name}`);
        console.log(`Age:       ${age}`);
        console.log(`Role:      ${role}`);
        console.log(`Subscribed: ${newsletter ? 'Yes' : 'No'}`);
        console.log('Password:  ' + '*'.repeat(password.length) + ' (Stored Securely)');

        console.log('\n' + `\x1b[1mThank you, ${name}! Your setup is complete.\x1b[0m` + '\n');
    } catch (err) {
        console.error('\n\x1b[31m❌ Setup failed:\x1b[0m', err.message);
    } finally {
        prompter.close();
    }
}

// Run the wizard if executed directly
if (require.main === module) {
    runWizard();
}

module.exports = Prompter;
