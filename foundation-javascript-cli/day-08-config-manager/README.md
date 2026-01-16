# Config Manager CLI ⚙️
### Day 8 - Configuration File Handling

A robust, dependency-free utility for managing application settings persisted in JSON files. This project demonstrates how to handle file-based state, merged configurations, and nested data access.

## 🎯 Learning Objectives
- Implementing persistent storage for CLI applications
- Safe file I/O with JSON parsing and error handling
- Handling nested configuration paths (e.g., `user.theme.color`)
- Merging default settings with user-defined overrides
- Implementing a singleton-like pattern for configuration access
- Managing configuration directories across different environments

## 🚀 Usage
```bash
# Set a configuration value
node index.js --set key=value

# Get a configuration value
node index.js --get key

# List all configuration values
node index.js --list

# Reset to defaults
node index.js --reset
```

## 🧠 Key Concepts
- **Automatic Initialization:** Creating the config file and directory if they don't exist.
- **Graceful Failure:** Handling corrupted or invalid JSON files.
- **Atomic Operations:** Ensuring the config is saved correctly to prevent data loss.
- **Deep Access:** Using dot-notation to access nested settings.

---
**Day 8 Complete!** ⚙️ You've built a persistent configuration system that makes your CLI tools smarter and more customizable.
