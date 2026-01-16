# Argument Parser CLI ⚙️
### Day 5 - Command-Line Argument Handling

A robust command-line argument parsing utility that handles flags, options, positional arguments, and provides automatic help generation.

## 🎯 Learning Objectives
- Parsing `process.argv` manually
- Handling short (`-v`) and long (`--version`) flags
- Parsing options with values (`--name "John"`)
- Managing positional arguments
- Type conversion for argument values
- Generating help and version information
- Error handling for missing or invalid arguments

## 🚀 Usage
```bash
node index.js --name "MJ_Syed" --age 1 -v
```

## 🧠 Key Concepts
- **Tokenization:** Breaking down the command line into meaningful parts
- **State Management:** Tracking which option expects a value
- **Validation:** Ensuring required arguments are present and correctly formatted
