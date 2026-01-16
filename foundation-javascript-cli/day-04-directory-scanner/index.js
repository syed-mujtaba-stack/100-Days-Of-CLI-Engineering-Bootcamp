#!/usr/bin/env node

/**
 * Day 4 - Directory Scanner CLI
 *
 * Features:
 * - Recursive directory traversal with configurable depth
 * - File filtering by extension, name patterns, and size
 * - Directory statistics and tree visualization
 * - Search functionality for files containing specific content
 * - Export results to JSON or CSV formats
 */

const fs = require('fs');
const path = require('path');

const HELP_TEXT = `
Usage: node index.js <directory-path> [options]

Options:
  --depth <number>        Maximum recursion depth (default: unlimited)
  --ext <extensions>      Filter by file extensions (comma-separated)
  --name <pattern>        Filter by filename pattern (wildcards supported)
  --size <operator:size>  Filter by file size (>,<,=,>=,<= + KB,MB,GB)
  --search <text>         Search for files containing specific text
  --tree                  Display directory tree structure
  --stats                 Show directory statistics
  --json                  Output results in JSON format
  --csv                   Output results in CSV format
  --help                  Show this help message

Examples:
  node index.js ./src --tree --depth 3
  node index.js ./project --ext .js,.ts --stats
  node index.js ./logs --size ">1MB" --search "error"
  node index.js ./data --name "*.json" --json
`;

const isHelpRequested = () => process.argv.length <= 2 || process.argv.includes('--help');

const parseArguments = () => {
  const args = process.argv.slice(2);
  const options = {
    dirPath: null,
    depth: Infinity,
    extensions: [],
    namePattern: null,
    sizeFilter: null,
    searchText: null,
    showTree: false,
    showStats: false,
    outputJson: false,
    outputCsv: false
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      switch (arg) {
        case '--depth':
          if (!args[i + 1] || args[i + 1].startsWith('--')) {
            throw new Error('The --depth option requires a number.');
          }
          const depth = Number(args[i + 1]);
          if (Number.isNaN(depth) || depth < 0) {
            throw new Error('Depth must be a non-negative number.');
          }
          options.depth = depth;
          i += 1;
          break;

        case '--ext':
          if (!args[i + 1] || args[i + 1].startsWith('--')) {
            throw new Error('The --ext option requires extensions.');
          }
          options.extensions = args[i + 1].split(',').map(ext => ext.trim().toLowerCase());
          i += 1;
          break;

        case '--name':
          if (!args[i + 1] || args[i + 1].startsWith('--')) {
            throw new Error('The --name option requires a pattern.');
          }
          options.namePattern = args[i + 1];
          i += 1;
          break;

        case '--size':
          if (!args[i + 1] || args[i + 1].startsWith('--')) {
            throw new Error('The --size option requires a size filter.');
          }
          options.sizeFilter = parseSizeFilter(args[i + 1]);
          i += 1;
          break;

        case '--search':
          if (!args[i + 1] || args[i + 1].startsWith('--')) {
            throw new Error('The --search option requires search text.');
          }
          options.searchText = args[i + 1];
          i += 1;
          break;

        case '--tree':
          options.showTree = true;
          break;

        case '--stats':
          options.showStats = true;
          break;

        case '--json':
          options.outputJson = true;
          break;

        case '--csv':
          options.outputCsv = true;
          break;

        case '--help':
          break;

        default:
          throw new Error(`Unknown option: ${arg}`);
      }
    } else if (!options.dirPath) {
      options.dirPath = arg;
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  if (!options.dirPath) {
    throw new Error('Missing directory path. Use --help for usage information.');
  }

  return options;
};

const parseSizeFilter = (filterStr) => {
  const match = filterStr.match(/^([><=]=?)(\d+(?:\.\d+)?)(KB|MB|GB|B)?$/i);
  if (!match) {
    throw new Error('Invalid size filter format. Use: >,<,=,>=,<= followed by number and optional unit (KB,MB,GB).');
  }

  const [, operator, sizeStr, unit = 'B'] = match;
  const size = Number(sizeStr);
  
  const multipliers = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
  const bytes = size * (multipliers[unit.toUpperCase()] || 1);

  return { operator, bytes };
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

const matchesExtension = (filePath, extensions) => {
  if (extensions.length === 0) return true;
  const ext = path.extname(filePath).toLowerCase();
  return extensions.includes(ext);
};

const matchesNamePattern = (fileName, pattern) => {
  if (!pattern) return true;
  
  const regex = new RegExp(
    pattern.replace(/\*/g, '.*').replace(/\?/g, '.'),
    'i'
  );
  return regex.test(fileName);
};

const matchesSizeFilter = (fileSize, sizeFilter) => {
  if (!sizeFilter) return true;
  
  const { operator, bytes } = sizeFilter;
  switch (operator) {
    case '>': return fileSize > bytes;
    case '<': return fileSize < bytes;
    case '=': return fileSize === bytes;
    case '>=': return fileSize >= bytes;
    case '<=': return fileSize <= bytes;
    default: return true;
  }
};

const containsSearchText = (filePath, searchText) => {
  if (!searchText) return true;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.toLowerCase().includes(searchText.toLowerCase());
  } catch (error) {
    // Skip binary files or read errors
    return false;
  }
};

const scanDirectory = (dirPath, currentDepth = 0, options) => {
  if (currentDepth > options.depth) return [];

  const results = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        const subResults = scanDirectory(itemPath, currentDepth + 1, options);
        results.push(...subResults);
      } else if (stats.isFile()) {
        const fileInfo = {
          name: item,
          path: itemPath,
          relativePath: path.relative(options.baseDir, itemPath),
          size: stats.size,
          sizeHuman: formatBytes(stats.size),
          extension: path.extname(item).toLowerCase(),
          modified: stats.mtime,
          created: stats.birthtime
        };

        // Apply filters
        if (matchesExtension(itemPath, options.extensions) &&
            matchesNamePattern(item, options.namePattern) &&
            matchesSizeFilter(stats.size, options.sizeFilter) &&
            containsSearchText(itemPath, options.searchText)) {
          results.push(fileInfo);
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Cannot read directory ${dirPath}: ${error.message}`);
  }
  
  return results;
};

const displayTree = (dirPath, currentDepth = 0, maxDepth = Infinity, prefix = '') => {
  if (currentDepth > maxDepth) return;

  try {
    const items = fs.readdirSync(dirPath);
    const sortedItems = items.sort((a, b) => {
      const aPath = path.join(dirPath, a);
      const bPath = path.join(dirPath, b);
      const aStat = fs.statSync(aPath);
      const bStat = fs.statSync(bPath);
      
      // Directories first, then files
      if (aStat.isDirectory() && !bStat.isDirectory()) return -1;
      if (!aStat.isDirectory() && bStat.isDirectory()) return 1;
      return a.localeCompare(b);
    });

    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      const isLast = i === sortedItems.length - 1;
      const currentPrefix = isLast ? '└── ' : '├── ';
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');

      if (stats.isDirectory()) {
        console.log(`${prefix}${currentPrefix}${item}/`);
        displayTree(itemPath, currentDepth + 1, maxDepth, nextPrefix);
      } else {
        const size = formatBytes(stats.size);
        console.log(`${prefix}${currentPrefix}${item} (${size})`);
      }
    }
  } catch (error) {
    console.warn(`${prefix}└── [Error reading directory: ${error.message}]`);
  }
};

const displayStats = (files, dirPath) => {
  const totalFiles = files.length;
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  
  const extensionCounts = files.reduce((acc, file) => {
    const ext = file.extension || '(no extension)';
    acc[ext] = (acc[ext] || 0) + 1;
    return acc;
  }, {});

  const sizeDistribution = {
    small: files.filter(f => f.size < 1024).length,      // < 1KB
    medium: files.filter(f => f.size >= 1024 && f.size < 1024 * 1024).length, // 1KB - 1MB
    large: files.filter(f => f.size >= 1024 * 1024 && f.size < 1024 * 1024 * 1024).length, // 1MB - 1GB
    huge: files.filter(f => f.size >= 1024 * 1024 * 1024).length // >= 1GB
  };

  console.log('📊 Directory Statistics');
  console.log('='.repeat(32));
  console.log(`Directory: ${dirPath}`);
  console.log(`Total Files: ${totalFiles}`);
  console.log(`Total Size: ${formatBytes(totalSize)}`);
  console.log(`Average File Size: ${totalFiles > 0 ? formatBytes(totalSize / totalFiles) : '0 B'}`);
  
  console.log('\n📁 File Extensions:');
  console.log('-'.repeat(32));
  Object.entries(extensionCounts)
    .sort(([,a], [,b]) => b - a)
    .forEach(([ext, count]) => {
      console.log(`${ext}: ${count} files`);
    });

  console.log('\n📏 Size Distribution:');
  console.log('-'.repeat(32));
  console.log(`< 1KB: ${sizeDistribution.small} files`);
  console.log(`1KB - 1MB: ${sizeDistribution.medium} files`);
  console.log(`1MB - 1GB: ${sizeDistribution.large} files`);
  console.log(`>= 1GB: ${sizeDistribution.huge} files`);
};

const outputJson = (files, dirPath) => {
  const result = {
    directory: dirPath,
    scannedAt: new Date().toISOString(),
    totalFiles: files.length,
    totalSize: files.reduce((sum, file) => sum + file.size, 0),
    files: files.map(file => ({
      ...file,
      modified: file.modified.toISOString(),
      created: file.created.toISOString()
    }))
  };
  console.log(JSON.stringify(result, null, 2));
};

const outputCsv = (files) => {
  const headers = ['name', 'relativePath', 'size', 'extension', 'modified', 'created'];
  console.log(headers.join(','));
  
  files.forEach(file => {
    const row = [
      `"${file.name}"`,
      `"${file.relativePath}"`,
      file.size,
      `"${file.extension}"`,
      `"${file.modified.toISOString()}"`,
      `"${file.created.toISOString()}"`
    ];
    console.log(row.join(','));
  });
};

const main = () => {
  if (isHelpRequested()) {
    console.log('📁 Directory Scanner CLI - Day 4');
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

  const absolutePath = path.resolve(process.cwd(), options.dirPath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Error: Directory not found -> ${absolutePath}`);
    process.exit(1);
  }

  if (!fs.statSync(absolutePath).isDirectory()) {
    console.error('❌ Error: The provided path is not a directory');
    process.exit(1);
  }

  // Set base directory for relative path calculations
  options.baseDir = absolutePath;

  console.log('📁 Directory Scanner CLI - Day 4');
  console.log('='.repeat(32));
  console.log(`Scanning: ${absolutePath}`);
  if (options.depth !== Infinity) {
    console.log(`Max Depth: ${options.depth}`);
  }

  const files = scanDirectory(absolutePath, 0, options);

  if (options.showTree) {
    console.log('\n🌳 Directory Tree');
    console.log('-'.repeat(32));
    displayTree(absolutePath, 0, options.depth);
  }

  if (options.showStats) {
    console.log('\n📊 Statistics');
    console.log('-'.repeat(32));
    displayStats(files, absolutePath);
  }

  if (options.outputJson) {
    console.log('\n📄 JSON Output');
    console.log('-'.repeat(32));
    outputJson(files, absolutePath);
  } else if (options.outputCsv) {
    console.log('\n📊 CSV Output');
    console.log('-'.repeat(32));
    outputCsv(files);
  } else if (!options.showTree && !options.showStats) {
    // Default: show file list
    console.log('\n📋 Found Files');
    console.log('-'.repeat(32));
    if (files.length === 0) {
      console.log('No files found matching the criteria.');
    } else {
      files.forEach((file, index) => {
        const lineNumber = String(index + 1).padStart(3, '0');
        console.log(`${lineNumber}: ${file.relativePath} (${file.sizeHuman})`);
      });
    }
  }

  console.log(`\n✨ Found ${files.length} files`);
  process.exit(0);
};

main();
