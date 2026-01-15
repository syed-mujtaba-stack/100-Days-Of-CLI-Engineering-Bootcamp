# JSON Processor CLI 🧮
### Day 3 - Data Parsing & Manipulation

A versatile command-line tool for working with JSON documents—validate, inspect, filter, and format data directly from the terminal.

## 🎯 Learning Objectives
- JSON parsing and error handling
- Pretty-printing vs. minified output
- Dot-notation traversal for nested data
- Array/object statistics and analysis
- Command-line option parsing and validation
- Reusable JSON utilities for automation workflows

## 🚀 Usage
```bash
# Pretty-print JSON
node index.js ./data.json --pretty

# Minify JSON for storage/transmission
node index.js ./data.json --minify

# List top-level keys
node index.js ./data.json --keys

# Extract nested value via dot path
node index.js ./data.json --path users.0.email

# Show structural statistics
node index.js ./data.json --stats

# Combine operations
node index.js ./data.json --keys --stats

# Help
node index.js --help
```

### CLI Options
| Option | Description |
|--------|-------------|
| `--pretty` | Pretty-print JSON with indentation |
| `--minify` | Output compact JSON |
| `--keys` | List top-level keys |
| `--path <dot.path>` | Retrieve value using dot notation |
| `--stats` | Display structural statistics |
| `--help` | Show usage instructions |

## 🧠 Key Concepts
- **Dot Notation Traversal:** Access nested data with `object.child.key` syntax
- **Type-Safe Formatting:** Differentiate between primitives, arrays, and objects
- **Error Reporting:** Helpful messages for invalid JSON or missing paths
- **Flexible Output Modes:** Works as a debugging aid or automation building block

## 🛠️ Project Structure
```
day-03-json-processor/
├── package.json   # Package metadata and CLI entry point
├── index.js       # Main JSON processing logic
└── README.md      # Documentation (this file)
```

## ✅ Sample Output
```
🧮 JSON Processor CLI - Day 3
================================
File: /path/to/data.json

🔑 Top-level Keys
--------------------------------
- users
- settings
- metadata

🎯 Path Result
--------------------------------
{"email":"admin@example.com","role":"owner"}

📈 Statistics
--------------------------------
📊 Object Stats
--------------------------------
Keys: 3
Sample Keys: users, settings, metadata
```

## 🔍 Implementation Notes
- Uses `fs` + `path` for reliable file handling
- Validates command-line inputs and option combinations
- Supports default summary mode to quickly understand JSON structure
- Designed for chaining in shell pipelines (e.g., `jsonproc data.json --path users | jq ...`)

---

**Day 3 Complete!** 🧮 You've built a professional-grade JSON inspection tool suitable for debugging APIs, scripts, and data pipelines.
