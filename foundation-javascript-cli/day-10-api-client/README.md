# API Client CLI 🌐
### Day 10 - HTTP Requests & API Integration

A lightweight, dependency-free command-line tool for interacting with RESTful APIs. This project leverages Node.js's native `fetch` API to perform HTTP operations, handle responses, and manage errors without external libraries like `axios`.

## 🎯 Learning Objectives
- Utilizing the native `fetch` API in Node.js
- Implementing asynchronous HTTP request handlers (GET, POST)
- Managing request headers and authentication patterns
- Handling JSON response parsing and formatting
- Implementing robust error handling for network and API errors
- Measuring and reporting request performance

## 🚀 Usage
```bash
# General help
node index.js --help

# GET request example
node index.js --get https://jsonplaceholder.typicode.com/posts/1

# POST request example
node index.js --post https://jsonplaceholder.typicode.com/posts --data '{"title":"foo","body":"bar","userId":1}'
```

## 🧠 Key Features
- **Native Fetch:** No external dependencies.
- **Support for Methods:** Handles GET and POST requests.
- **Pretty Print:** Formats JSON responses for better readability.
- **Performance Tracking:** Reports request duration.
- **Error Management:** Provides clear feedback on failed requests or invalid data.

---
**Day 10 Complete!** 🌐 You've built a professional API integration engine from scratch!
