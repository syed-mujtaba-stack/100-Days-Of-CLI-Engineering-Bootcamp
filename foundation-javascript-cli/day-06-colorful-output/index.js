#!/usr/bin/env node

/**
 * Day 6 - Colorful Output CLI
 * 
 * Objectives:
 * - Implement terminal styling using ANSI escape codes
 * - Create a fluent/chained API for styling text
 * - Support foreground, background, and text modifiers
 * - No external dependencies (Zero copy-paste policy)
 */

/**
 * ANSI Escape Code Definitions
 */
const CODES = {
    reset: [0, 0],

    // Text Modifiers
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],

    // Foreground Colors
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    gray: [90, 39],

    // Bright Foreground
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39],

    // Background Colors
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49]
};

/**
 * Terminal Styling Utility Class
 */
class Style {
    constructor() {
        this.activeStyles = [];
    }

    /**
     * Internal method to add a code to the stack
     */
    _add(codeKey) {
        const newStyle = new Style();
        newStyle.activeStyles = [...this.activeStyles, codeKey];
        return newStyle;
    }

    /**
     * Apply all active styles to a string
     * @param {string} text 
     */
    apply(text) {
        if (this.activeStyles.length === 0) return text;

        let result = text;
        // Apply styles in reverse to ensure proper nesting if needed, 
        // although standard ANSI usually just stacks.
        const startCodes = this.activeStyles.map(key => `\x1b[${CODES[key][0]}m`).join('');
        const endCodes = this.activeStyles.map(key => `\x1b[${CODES[key][1]}m`).reverse().join('');

        return `${startCodes}${result}${endCodes}`;
    }

    /**
     * Convenience method to print styled text directly
     */
    log(text) {
        console.log(this.apply(text));
    }
}

// Dynamically add methods to Style class prototype for all defined codes
Object.keys(CODES).forEach(key => {
    Style.prototype[key] = function () {
        return this._add(key);
    };
});

// Export a base instance
const painter = new Style();

/**
 * --- Demonstration & Testing ---
 */

function runDemo() {
    console.log('\n🌈 Colorful Output CLI - Day 6');
    console.log('==============================');

    console.log('\n1. Foreground Colors:');
    painter.red().log('  Red text');
    painter.green().log('  Green text');
    painter.blue().log('  Blue text');
    painter.yellow().log('  Yellow text');
    painter.magenta().log('  Magenta text');
    painter.cyan().log('  Cyan text');
    painter.gray().log('  Gray text');

    console.log('\n2. Background Colors:');
    painter.white().bgRed().log('  White on Red  ');
    painter.black().bgGreen().log('  Black on Green ');
    painter.white().bgBlue().log('  White on Blue  ');

    console.log('\n3. Text Modifiers:');
    painter.bold().log('  Bold text');
    painter.dim().log('  Dim text');
    painter.italic().log('  Italic text');
    painter.underline().log('  Underline text');
    painter.strikethrough().log('  Strikethrough text');
    painter.inverse().log('  Inverse colors');

    console.log('\n4. Chained Styles:');
    painter.bold().underline().red().log('  Bold Underline Red');
    painter.bgYellow().black().italic().bold().log('  Success: Action completed successfully!  ');

    console.log('\n5. Functional Mixing:');
    const error = (msg) => painter.red().bold().apply(`[ERROR] ${msg}`);
    const warn = (msg) => painter.yellow().apply(`[WARN]  ${msg}`);
    const info = (msg) => painter.cyan().apply(`[INFO]  ${msg}`);

    console.log(error('System failure detected!'));
    console.log(warn('Disk space running low.'));
    console.log(info('Maintenance scheduled for midnight.'));

    console.log('\n' + painter.green().bold().apply('✨ Day 6 Complete! Enjoy your colorful terminals. ') + '\n');
}

// Run the demo if program is executed directly
if (require.main === module) {
    runDemo();
}

module.exports = painter;
