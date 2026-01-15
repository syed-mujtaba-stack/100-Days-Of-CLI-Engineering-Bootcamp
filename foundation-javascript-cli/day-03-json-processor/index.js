#!/usr/bin/env node

/**
 * Day 3 - JSON Processor CLI
 *
 * Capabilities:
 * - Validate JSON files and surface parse errors with context
 * - Pretty-print, minify, or list keys from JSON documents
 * - Traverse nested objects via dot notation (--path user.profile.name)
 * - Generate data stats for arrays and objects (--stats)
 * - Flexible output formats for use in shell pipelines
 */

const fs = require('fs');
const path = require('path');

const HELP_TEXT = `\nUsage: node index.js <json-file> [options]\n\nOptions:\n  --pretty               Pretty-print JSON with 2-space indentation\n  --minify               Output compact JSON\n  --keys                 List top-level keys\n  --path <dot.path>      Retrieve value via dot notation\n  --stats                Display structural statistics\n  --help                 Show this help message\n\nExamples:\n  node index.js data.json --pretty\n  node index.js data.json --path users.0.email\n  node index.js data.json --stats\n`;

const isHelpRequested = () => process.argv.length <= 2 || process.argv.includes('--help');

const parseArguments = () => {
  const args = process.argv.slice(2);
  const options = {
    filePath: null,
    pretty: false,
    minify: false,
    keys: false,
    path: null,
    stats: false
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      switch (arg) {
        case '--pretty':
          options.pretty = true;
          break;
        case '--minify':
          options.minify = true;
          break;
        case '--keys':
          options.keys = true;
          break;
        case '--stats':
          options.stats = true;
          break;
        case '--path':
          if (!args[i + 1] || args[i + 1].startsWith('--')) {
            throw new Error('The --path option requires a dot-notated value.');
          }
          options.path = args[i + 1];
          i += 1;
          break;
        case '--help':
          break;
        default:
          throw new Error(`Unknown option: ${arg}`);
      }
    } else if (!options.filePath) {
      options.filePath = arg;
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  if (!options.filePath) {
    throw new Error('Missing JSON file path.');
  }

  return options;
};

const loadJson = (absolutePath) => {
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const stats = fs.statSync(absolutePath);
  if (!stats.isFile()) {
    throw new Error('Provided path is not a file.');
  }

  const raw = fs.readFileSync(absolutePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error.message}`);
  }
};

const getValueAtPath = (data, dotPath) => {
  return dotPath.split('.').reduce((acc, segment) => {
    if (acc === undefined || acc === null) return undefined;

    // Handle array indices, e.g., users.0.email
    if (Number.isInteger(Number(segment)) && Array.isArray(acc)) {
      return acc[Number(segment)];
    }

    return acc[segment];
  }, data);
};

const formatValue = (value) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null) return 'null';
  return JSON.stringify(value, null, 2);
};

const outputStats = (data) => {
  if (Array.isArray(data)) {
    console.log('📊 Array Stats');
    console.log('-'.repeat(32));
    console.log(`Length: ${data.length}`);
    if (data.length > 0) {
      const sampleType = typeof data[0];
      console.log(`Sample Type: ${sampleType}`);
    }
    const typeCounts = data.reduce((acc, item) => {
      const type = Array.isArray(item) ? 'array' : typeof item;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    console.log('Type Breakdown:', typeCounts);
  } else if (data && typeof data === 'object') {
    const keys = Object.keys(data);
    console.log('📊 Object Stats');
    console.log('-'.repeat(32));
    console.log(`Keys: ${keys.length}`);
    console.log('Sample Keys:', keys.slice(0, 10).join(', ') || '(none)');
  } else {
    console.log('ℹ️ Stats: Value is neither object nor array.');
  }
};

const main = () => {
  if (isHelpRequested()) {
    console.log('🧮 JSON Processor CLI - Day 3');
    console.log(HELP_TEXT);
    process.exit(0);
  }

  let options;
  try {
    options = parseArguments();
  } catch (error) {
    console.error(`❌ ${error.message}`);
    console.log(HELP_TEXT);
    process.exit(1);
  }

  const absolutePath = path.resolve(process.cwd(), options.filePath);

  let data;
  try {
    data = loadJson(absolutePath);
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  }

  console.log('🧮 JSON Processor CLI - Day 3');
  console.log('='.repeat(32));
  console.log(`File: ${absolutePath}`);

  if (options.keys) {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      console.log('\n🔑 Top-level Keys');
      console.log('-'.repeat(32));
      Object.keys(data).forEach((key) => console.log(`- ${key}`));
    } else {
      console.log('\n🔑 Top-level Keys: (Value is not an object)');
    }
  }

  if (options.path) {
    const value = getValueAtPath(data, options.path);
    console.log('\n🎯 Path Result');
    console.log('-'.repeat(32));
    if (value === undefined) {
      console.log(`Path "${options.path}" not found.`);
    } else {
      console.log(formatValue(value));
    }
  }

  if (options.stats) {
    console.log('\n📈 Statistics');
    console.log('-'.repeat(32));
    outputStats(data);
  }

  if (options.pretty) {
    console.log('\n✨ Pretty JSON');
    console.log('-'.repeat(32));
    console.log(JSON.stringify(data, null, 2));
  }

  if (options.minify) {
    console.log('\n📦 Minified JSON');
    console.log('-'.repeat(32));
    console.log(JSON.stringify(data));
  }

  // Default behavior (no specific options): show summary
  if (!options.pretty && !options.minify && !options.keys && !options.path && !options.stats) {
    console.log('\nℹ️ Summary');
    console.log('-'.repeat(32));
    if (Array.isArray(data)) {
      console.log(`Type: Array (${data.length} items)`);
    } else if (data && typeof data === 'object') {
      console.log(`Type: Object (${Object.keys(data).length} keys)`);
    } else {
      console.log(`Type: ${typeof data}`);
      console.log('Value:', formatValue(data));
    }
  }

  process.exit(0);
};

main();
