# Interactive Prompts CLI 🤖
### Day 7 - User Input & Validation

A powerful, dependency-free interactive prompting system built on Node.js's native `readline` module. This project demonstrates how to build interactive setup wizards, questionnaires, and feedback forms directly in the terminal.

## 🎯 Learning Objectives
- Mastering the `readline` module for asynchronous user input
- Implementing secret/masked input for passwords
- Building custom confirmation and selection prompts
- Handling input validation and re-prompting
- Using Promises and async/await for clean control flow
- Designing a user-friendly interactive CLI experience

## 🚀 Usage
```bash
node index.js
```

## 🧠 Key Features
- **`ask(question)`**: Get standard text input.
- **`secret(question)`**: Secure input (characters are masked/hidden).
- **`confirm(question)`**: Simple Y/n confirmation.
- **`select(question, choices)`**: Select from a numbered list of options.

## 🛠️ Implementation Specs
This tool bypasses the need for high-level libraries like `Inquirer.js` by interfacing directly with `process.stdin` and `process.stdout` through the `readline` interface.

---
**Day 7 Complete!** 🤖 You've built a professional interactive prompting engine from scratch.
