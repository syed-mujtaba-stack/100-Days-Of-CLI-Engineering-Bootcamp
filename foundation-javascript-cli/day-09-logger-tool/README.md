# Logger Tool CLI 🪵
### Day 9 - Custom Logging System

A professional-grade, dependency-free logging utility for Node.js command-line applications. This project demonstrates how to implement structured logging with support for multiple levels, terminal colors, timestamps, and persistent file storage.

## 🎯 Learning Objectives
- Implementing a class-based logging system
- Managing log levels (DEBUG, INFO, WARN, ERROR)
- Using ANSI escape codes for color-coded terminal output
- Asynchronous file appending for persistent logs
- Formatting timestamps for log entries
- Filtering output based on a minimum log level

## 🚀 Usage
```bash
node index.js
```

## 🧠 Key Features
- **Categorized Logs:** Visually distinguish between different types of messages.
- **Persistent Storage:** All logs are automatically saved to `app.log`.
- **Level Filtering:** Control the verbosity of your application's output.
- **Professional Formatting:** Standardized log format: `[TIMESTAMP] [LEVEL] Message`

## 🛠️ Implementation Specs
The `Logger` class uses numeric priorities to filter logs:
- `DEBUG` (0): Detailed debugging information.
- `INFO`  (1): General application flow.
- `WARN`  (2): Non-critical warnings.
- `ERROR` (3): Critical failures.

---
**Day 9 Complete!** 🪵 You've built a robust logging engine that provides visibility and auditability to your CLI tools.
