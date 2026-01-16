# Colorful Output CLI 🌈
### Day 6 - Terminal Styling & Formatting

A pure JavaScript utility for styling terminal output using ANSI escape sequences. This project demonstrates how to add colors, backgrounds, and text decorations to CLI tools without external libraries like `chalk` or `colors`.

## 🎯 Learning Objectives
- Understanding ANSI escape codes and sequences
- Implementing a fluent/chained API for styling
- Supporting foreground and background colors
- Implementing text modifiers (Bold, Italic, Underline, etc.)
- Handling system-level color support
- Creating reusable UI components for the terminal

## 🚀 Usage
```bash
node index.js
```

## 🧠 ANSI Escape Codes
ANSI escapes start with `\x1b[` (or `\u001b[`).
- **Reset:** `\x1b[0m`
- **Bold:** `\x1b[1m`
- **Red Foreground:** `\x1b[31m`
- **Green Foreground:** `\x1b[32m`
- **Blue Background:** `\x1b[44m`

## 🛠️ Implementation Specs
The custom `Style` utility supports:
- **Foregrounds:** Black, Red, Green, Yellow, Blue, Magenta, Cyan, White
- **Backgrounds:** bgBlack, bgRed, bgGreen, etc.
- **Modifiers:** Bold, Dim, Italic, Underline, Inverse, Hidden, Strikethrough
- **Method Chaining:** `style.red().bold().italic().apply("Styled Text")`

---
**Day 6 Complete!** 🌈 You can now create visually stunning and professional-looking command-line interfaces with zero dependencies.
