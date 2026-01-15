# Hello World CLI 🌍
### Day 1 - Basic CLI Setup and Output

A simple command-line application that demonstrates the fundamentals of CLI development with Node.js and JavaScript.

## 🎯 Learning Objectives

- **Shebang Line:** Making scripts directly executable
- **Console Output:** Different types of console messages (log, warn, error)
- **Command-line Arguments:** Processing user input from process.argv
- **Process Information:** Accessing Node.js and system details
- **Exit Codes:** Proper process termination

## 🚀 Usage

### Basic Usage
```bash
# Run with Node.js
node index.js

# Personalized greeting
node index.js "Your Name"

# If installed globally (via npm link)
hello "Your Name"
```

### Examples
```bash
$ node index.js
🚀 Hello World CLI - Day 1
================================
Hello, World! Welcome to CLI Engineering Bootcamp!

📋 Console Output Examples:
--------------------------------
🔵 Info: This is an informational message
⚠️  Warning: This is a warning message
❌ Error: This is an error message

🔧 Process Information:
--------------------------------
Node.js Version: v18.17.0
Platform: win32
Architecture: x64
Process ID: 12345

💡 Usage Examples:
--------------------------------
node index.js                    # Basic hello world
node index.js "John Doe"         # Personalized greeting
hello "John Doe"                 # If installed globally
```

```bash
$ node index.js "Alice Johnson"
🚀 Hello World CLI - Day 1
================================
Hello, Alice Johnson! Welcome to CLI Engineering Bootcamp!

📋 Console Output Examples:
--------------------------------
🔵 Info: This is an informational message
⚠️  Warning: This is a warning message
❌ Error: This is an error message

🔧 Process Information:
--------------------------------
Node.js Version: v18.17.0
Platform: win32
Architecture: x64
Process ID: 12346

💡 Usage Examples:
--------------------------------
node index.js                    # Basic hello world
node index.js "John Doe"         # Personalized greeting
hello "John Doe"                 # If installed globally
```

## 📁 Project Structure

```
day-01-hello-world/
├── package.json          # Package configuration
├── index.js             # Main CLI application
└── README.md            # This documentation
```

## 🛠️ Technical Details

### Key Concepts Demonstrated

1. **Shebang Line (`#!/usr/bin/env node`)**
   - Allows direct script execution on Unix systems
   - Uses env to find Node.js regardless of installation path

2. **Command-line Arguments**
   - `process.argv` contains all command-line arguments
   - `process.argv[0]` is the Node.js executable path
   - `process.argv[1]` is the script path
   - `process.argv.slice(2)` contains user arguments

3. **Console Methods**
   - `console.log()` - Standard output
   - `console.warn()` - Warning messages
   - `console.error()` - Error messages

4. **Process Object**
   - `process.version` - Node.js version
   - `process.platform` - Operating system
   - `process.arch` - System architecture
   - `process.pid` - Process ID

5. **Exit Codes**
   - `process.exit(0)` - Successful termination
   - `process.exit(1)` - Error termination

## 🔧 Installation & Development

### Local Development
```bash
# Navigate to the project directory
cd day-01-hello-world

# Install dependencies (none for this basic example)
npm install

# Run the application
npm start
```

### Global Installation (Optional)
```bash
# Link the package globally
npm link

# Run from anywhere
hello "Your Name"

# Unlink when done
npm unlink
```

## 🎓 Next Steps

This basic CLI application establishes the foundation for more complex command-line tools. In the next days, you'll build upon these concepts to create:

- File system operations
- Data processing utilities
- Interactive user interfaces
- API integrations
- Advanced error handling

---

**Day 1 Complete!** ✅ You've successfully created your first CLI application and learned the fundamental concepts of command-line development with Node.js.
