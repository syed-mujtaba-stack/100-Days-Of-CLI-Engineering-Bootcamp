#!/usr/bin/env node

/**
 * Day 2 - File Reader CLI
 *
 * Features:
 * - Validate input paths and ensure files exist
 * - Display file metadata (size, modified date, type)
 * - Preview file contents with configurable line count
 * - Support UTF-8 text files and graceful binary detection
 * - Helpful usage instructions and exit codes
 */

const fs = require('fs');
const path = require('path');

const HELP_TEXT = `\nUsage: node index.js <file-path> [options]\n\nOptions:\n  --lines <number>     Number of preview lines (default: 10)\n  --info               Show only file metadata (no content preview)\n  --json               Output metadata + preview in JSON format\n  --help               Display this help message\n\nExamples:\n  node index.js ./README.md\n  node index.js ./data/sample.txt --lines 5\n  node index.js ./logs/app.log --info\n`;

const isHelpRequested = () => {
  return process.argv.includes('--help') || process.argv.length <= 2;
};

const parseArguments = () => {
  const args = process.argv.slice(2);
  const options = {
    lines: 10,
    infoOnly: false,
    json: false,
    filePath: null
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--lines') {
      const value = Number(args[i + 1]);
      if (Number.isNaN(value) || value <= 0) {
        throw new Error('The --lines option requires a positive number');
      }
      options.lines = value;
      i += 1;
      continue;
    }

    if (arg === '--info') {
      options.infoOnly = true;
      continue;
    }

    if (arg === '--json') {
      options.json = true;
      continue;
    }

    if (!options.filePath) {
      options.filePath = arg;
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  if (!options.filePath) {
    throw new Error('Missing file path. Use --help for usage information.');
  }

  return options;
};

const formatBytes = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const detectBinary = (buffer) => {
  const textChars = buffer.toString('utf8');
  const controlChars = textChars.split('').filter((char) => char.charCodeAt(0) < 32 && ![ '\n', '\r', '\t' ].includes(char));
  return controlChars.length > 0;
};

const readFilePreview = (filePath, lines) => {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split(/\r?\n/).slice(0, lines);
};

const main = () => {
  if (isHelpRequested()) {
    console.log('📁 File Reader CLI - Day 2');
    console.log(HELP_TEXT);
    process.exit(0);
  }

  let options;
  try {
    options = parseArguments();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.log(HELP_TEXT);
    process.exit(1);
  }

  const absolutePath = path.resolve(process.cwd(), options.filePath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Error: File not found -> ${absolutePath}`);
    process.exit(1);
  }

  if (!fs.statSync(absolutePath).isFile()) {
    console.error('❌ Error: The provided path is not a file');
    process.exit(1);
  }

  const stats = fs.statSync(absolutePath);
  const extension = path.extname(absolutePath) || 'N/A';

  const metadata = {
    name: path.basename(absolutePath),
    path: absolutePath,
    sizeBytes: stats.size,
    sizeHuman: formatBytes(stats.size),
    extension,
    createdAt: stats.birthtime,
    modifiedAt: stats.mtime
  };

  let preview = [];
  let isBinary = false;

  if (!options.infoOnly) {
    const buffer = fs.readFileSync(absolutePath);
    isBinary = detectBinary(buffer);

    if (isBinary) {
      preview = ['(Binary file preview skipped)'];
    } else {
      preview = readFilePreview(absolutePath, options.lines);
    }
  }

  if (options.json) {
    console.log(JSON.stringify({ metadata, preview, isBinary }, null, 2));
    process.exit(0);
  }

  console.log('📁 File Reader CLI - Day 2');
  console.log('='.repeat(32));
  console.log(`File: ${metadata.name}`);
  console.log(`Path: ${metadata.path}`);
  console.log(`Size: ${metadata.sizeHuman} (${metadata.sizeBytes} bytes)`);
  console.log(`Extension: ${metadata.extension}`);
  console.log(`Created: ${metadata.createdAt}`);
  console.log(`Modified: ${metadata.modifiedAt}`);

  if (options.infoOnly) {
    process.exit(0);
  }

  console.log('\n📄 Preview:');
  console.log('-'.repeat(32));

  if (isBinary) {
    console.log('(Binary file preview skipped)');
  } else if (preview.length === 0) {
    console.log('(File is empty)');
  } else {
    preview.forEach((line, index) => {
      const lineNumber = String(index + 1).padStart(3, '0');
      console.log(`${lineNumber}: ${line}`);
    });
  }

  console.log('\n✨ Tips:');
  console.log('-'.repeat(32));
  console.log('Use --lines <number> to adjust preview length');
  console.log('Use --info for metadata only');
  console.log('Use --json for machine-readable output');

  process.exit(0);
};

main();
