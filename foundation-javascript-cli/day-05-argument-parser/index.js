#!/usr/bin/env node

/**
 * Day 5 - Argument Parser CLI
 * 
 * Objectives:
 * - Manually parse process.argv
 * - Handle flags (-f, --flag)
 * - Handle options with values (--key value)
 * - Handle positional arguments
 * - Provide help and version output
 */

const fs = require('fs');
const path = require('path');

const VERSION = '1.0.0';

/**
 * Simple Argument Parser Class
 */
class ArgumentParser {
  constructor() {
    this.options = new Map();
    this.flags = new Map();
    this.positionals = [];
    this.rawArgs = process.argv.slice(2);
    
    this.definitions = {
      options: {},
      flags: {}
    };
  }

  /**
   * Define an option that expects a value
   */
  option(name, { alias, description, defaultValue = null, type = 'string' } = {}) {
    this.definitions.options[name] = { alias, description, defaultValue, type };
    if (alias) this.definitions.options[alias] = name;
    return this;
  }

  /**
   * Define a boolean flag
   */
  flag(name, { alias, description } = {}) {
    this.definitions.flags[name] = { alias, description };
    if (alias) this.definitions.flags[alias] = name;
    return this;
  }

  /**
   * Parse the arguments
   */
  parse() {
    for (let i = 0; i < this.rawArgs.length; i++) {
      const arg = this.rawArgs[i];

      if (arg === '--help' || arg === '-h') {
        this.showHelp();
        process.exit(0);
      }

      if (arg === '--version' || arg === '-v') {
        console.log(`v${VERSION}`);
        process.exit(0);
      }

      if (arg.startsWith('--')) {
        const name = arg.slice(2);
        this._handleKey(name, i);
        if (this.definitions.options[name]) i++; // Skip next arg if it was a value
      } else if (arg.startsWith('-')) {
        const char = arg.slice(1);
        this._handleKey(char, i);
        if (this.definitions.options[char]) i++;
      } else {
        this.positionals.push(arg);
      }
    }

    // Apply default values for missing options
    Object.entries(this.definitions.options).forEach(([name, def]) => {
      if (typeof def === 'object' && !this.options.has(name) && def.defaultValue !== null) {
        this.options.set(name, def.defaultValue);
      }
    });

    return {
      options: Object.fromEntries(this.options),
      flags: Object.fromEntries(this.flags),
      positionals: this.positionals
    };
  }

  _handleKey(key, index) {
    const optionName = typeof this.definitions.options[key] === 'string' 
      ? this.definitions.options[key] 
      : key;
    
    const flagName = typeof this.definitions.flags[key] === 'string'
      ? this.definitions.flags[key]
      : key;

    if (this.definitions.options[optionName]) {
      const val = this.rawArgs[index + 1];
      if (val === undefined || val.startsWith('-')) {
        console.error(`Error: Option --${optionName} requires a value.`);
        process.exit(1);
      }
      
      const def = this.definitions.options[optionName];
      let finalVal = val;
      if (def.type === 'number') finalVal = Number(val);
      if (def.type === 'boolean') finalVal = val === 'true';

      this.options.set(optionName, finalVal);
    } else if (this.definitions.flags[flagName]) {
      this.flags.set(flagName, true);
    } else {
      console.warn(`Warning: Unknown argument - ${key}`);
    }
  }

  showHelp() {
    console.log('\n⚙️ Argument Parser CLI - Day 5');
    console.log('===============================');
    console.log('Usage: node index.js [options] [positionals]\n');
    
    console.log('Options:');
    Object.entries(this.definitions.options).forEach(([name, def]) => {
      if (typeof def === 'string') return;
      const aliasPart = def.alias ? `-${def.alias}, ` : '    ';
      console.log(`  ${aliasPart}--${name.padEnd(12)} ${def.description || ''} (default: ${def.defaultValue})`);
    });

    console.log('\nFlags:');
    Object.entries(this.definitions.flags).forEach(([name, def]) => {
      if (typeof def === 'string') return;
      const aliasPart = def.alias ? `-${def.alias}, ` : '    ';
      console.log(`  ${aliasPart}--${name.padEnd(12)} ${def.description || ''}`);
    });
    
    console.log('  -h, --help         Show this help message');
    console.log('  -v, --version      Show version information');
  }
}

// --- Implementation ---

const parser = new ArgumentParser();

parser
  .option('name', { alias: 'n', description: 'User name', defaultValue: 'Guest' })
  .option('age', { alias: 'a', description: 'User age', type: 'number', defaultValue: 0 })
  .flag('verbose', { alias: 'V', description: 'Enable verbose logging' })
  .flag('quiet', { alias: 'q', description: 'Suppress output' });

const { options, flags, positionals } = parser.parse();

if (!flags.quiet) {
  console.log('\n✅ Arguments Parsed Successfully');
  console.log('-------------------------------');
  console.log('Options:', options);
  console.log('Flags:', flags);
  console.log('Positionals:', positionals);
  
  if (flags.verbose) {
    console.log('\n[Verbose] Raw process.argv:', process.argv);
  }
  
  console.log(`\nHello, ${options.name}! You are ${options.age} years old.`);
}
