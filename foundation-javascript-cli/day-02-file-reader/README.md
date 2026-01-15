# File Reader CLI 📄
### Day 2 - File System Operations & Content Inspection

A command-line utility for inspecting file metadata and previewing contents directly from the terminal.

## 🎯 Learning Objectives
- File system interaction with the `fs` module
- Path resolution and validation using `path`
- Metadata retrieval (size, timestamps, extensions)
- Content preview with configurable line counts
- Binary detection and safe handling
- JSON output for automated workflows

## 🚀 Usage
```bash
# Display file metadata + 10-line preview
node index.js ./sample.txt

# Preview with a custom line count
node index.js ./sample.txt --lines 5

# Metadata only (no content preview)
node index.js ./sample.txt --info

# Structured JSON output
node index.js ./sample.txt --json

# Help message
node index.js --help
```

### CLI Options
| Option | Description |
|--------|-------------|
| `--lines <number>` | Number of preview lines (default: 10) |
| `--info` | Show metadata only |
| `--json` | Output metadata + preview in JSON |
| `--help` | Display usage instructions |

## 🧠 Key Concepts
- **Synchronous File Reading:** `fs.readFileSync` for predictable reads
- **Binary Detection:** Inspecting control characters to avoid garbled output
- **Metadata Gathering:** Using `fs.statSync` for file details
- **Path Normalization:** `path.resolve` ensures reliable paths
- **Error Handling:** Clear messages for missing files or invalid options

## 🛠️ Project Structure
```
day-02-file-reader/
├── package.json   # Package metadata and CLI entry
├── index.js      # Main CLI logic
└── README.md     # Documentation (this file)
```

## ✅ Sample Output
```
📁 File Reader CLI - Day 2
================================
File: sample.txt
Path: /path/to/sample.txt
Size: 1.25 KB (1280 bytes)
Extension: .txt
Created: Tue Jan 14 2026 10:23:45 GMT+0500
Modified: Tue Jan 14 2026 11:10:12 GMT+0500

📄 Preview:
--------------------------------
001: Lorem ipsum dolor sit amet,
002: consectetur adipiscing elit.
003: Integer nec odio. Praesent libero.
...

✨ Tips:
--------------------------------
Use --lines <number> to adjust preview length
Use --info for metadata only
Use --json for machine-readable output
```

## 🔍 Implementation Notes
- Handles relative and absolute paths
- Supports UTF-8 plain text files
- Detects binary files and skips unsafe previews
- Provides help text and examples for new users
- Exits with appropriate status codes for automation workflows

---

**Day 2 Complete!** 📂 You've built a practical utility for exploring files directly from the command line.
