# Directory Scanner CLI 📁
### Day 4 - Recursive File System Traversal

A powerful command-line tool for exploring and analyzing directory structures with advanced filtering, search capabilities, and multiple output formats.

## 🎯 Learning Objectives
- Recursive directory traversal with depth control
- File filtering by extension, name patterns, and size
- Directory tree visualization with proper formatting
- File content searching and statistics generation
- Multiple output formats (JSON, CSV, tree view)
- Performance optimization for large directory structures

## 🚀 Usage
```bash
# Display directory tree with depth limit
node index.js ./src --tree --depth 3

# Filter files by extension and show statistics
node index.js ./project --ext .js,.ts --stats

# Search for large files containing specific text
node index.js ./logs --size ">1MB" --search "error"

# Export results to JSON
node index.js ./data --name "*.json" --json

# Complex filtering with multiple criteria
node index.js ./codebase --ext .js --name "*.test.*" --size "<100KB"
```

### CLI Options
| Option | Description |
|--------|-------------|
| `--depth <number>` | Maximum recursion depth (default: unlimited) |
| `--ext <extensions>` | Filter by file extensions (comma-separated) |
| `--name <pattern>` | Filter by filename pattern (wildcards supported) |
| `--size <operator:size>` | Filter by file size (>,<,=,>=,<= + KB,MB,GB) |
| `--search <text>` | Search for files containing specific text |
| `--tree` | Display directory tree structure |
| `--stats` | Show directory statistics |
| `--json` | Output results in JSON format |
| `--csv` | Output results in CSV format |
| `--help` | Show usage instructions |

## 🧠 Key Concepts
- **Recursive Traversal:** Efficient directory scanning with depth control
- **Pattern Matching:** Wildcard support for filename filtering
- **Size Filtering:** Flexible size-based filtering with multiple units
- **Content Search:** Text search within file contents
- **Tree Visualization:** ASCII tree rendering with proper indentation
- **Statistics Analysis:** Comprehensive file distribution metrics

## 🛠️ Project Structure
```
day-04-directory-scanner/
├── package.json   # Package metadata and CLI entry point
├── index.js       # Main directory scanning logic
└── README.md      # Documentation (this file)
```

## ✅ Sample Output
```
📁 Directory Scanner CLI - Day 4
================================
Scanning: /path/to/project
Max Depth: 3

🌳 Directory Tree
--------------------------------
├── src/
│   ├── components/
│   │   ├── Header.js (2.1 KB)
│   │   └── Footer.js (1.8 KB)
│   ├── utils/
│   │   ├── helpers.js (3.2 KB)
│   │   └── constants.js (0.8 KB)
│   └── index.js (1.2 KB)
├── package.json (1.5 KB)
└── README.md (4.7 KB)

📊 Statistics
--------------------------------
Directory: /path/to/project
Total Files: 6
Total Size: 15.10 KB
Average File Size: 2.52 KB

📁 File Extensions:
--------------------------------
.js: 4 files
.json: 1 files
.md: 1 files

📏 Size Distribution:
--------------------------------
< 1KB: 1 files
1KB - 1MB: 5 files
1MB - 1GB: 0 files
>= 1GB: 0 files

✨ Found 6 files
```

## 🔍 Advanced Features

### **Size Filtering Examples**
```bash
# Find files larger than 1MB
node index.js ./project --size ">1MB"

# Find files smaller than 100KB
node index.js ./project --size "<100KB"

# Find files exactly 1KB
node index.js ./project --size "=1KB"

# Find files between 10KB and 1MB
node index.js ./project --size ">=10KB" | grep -E ">=10KB.*<1MB"
```

### **Pattern Matching Examples**
```bash
# Find all test files
node index.js ./src --name "*.test.*"

# Find all configuration files
node index.js ./project --name "config.*"

# Find files starting with 'app'
node index.js ./src --name "app*"
```

### **Content Search Examples**
```bash
# Find files containing 'TODO'
node index.js ./src --search "TODO"

# Find files containing error messages
node index.js ./logs --search "ERROR"

# Find files with specific function calls
node index.js ./code --search "console.log"
```

## 🚀 Performance Considerations
- **Memory Efficient:** Processes files sequentially without loading all into memory
- **Early Filtering:** Applies filters during traversal to reduce processing
- **Error Handling:** Gracefully handles permission errors and unreadable files
- **Depth Control:** Prevents infinite recursion in circular directory structures

## 🔍 Implementation Notes
- Uses `fs.readdirSync` and `fs.statSync` for synchronous file system operations
- Implements proper error handling for permission issues and invalid paths
- Supports relative and absolute paths with automatic resolution
- Provides multiple output formats for integration with other tools
- Optimized for large directory structures with efficient filtering

---

**Day 4 Complete!** 📁 You've built a professional-grade directory scanner suitable for code analysis, file management, and system administration tasks.
