#!/usr/bin/env node

/**
 * Day 1 - Hello World CLI
 * Basic CLI setup and output demonstration
 * 
 * This script demonstrates:
 * - Shebang line for direct execution
 * - Basic console output with different methods
 * - Command-line argument handling
 * - Process exit codes
 */

// Get command line arguments
const args = process.argv.slice(2);

// Display welcome message
console.log('🚀 Hello World CLI - Day 1');
console.log('================================');

// Check if user provided a name
if (args.length > 0) {
  const name = args.join(' ');
  console.log(`Hello, ${name}! Welcome to CLI Engineering Bootcamp!`);
} else {
  console.log('Hello, World! Welcome to CLI Engineering Bootcamp!');
}

// Demonstrate different console methods
console.log('\n📋 Console Output Examples:');
console.log('--------------------------------');

console.log('🔵 Info: This is an informational message');
console.warn('⚠️  Warning: This is a warning message');
console.error('❌ Error: This is an error message');

// Show process information
console.log('\n🔧 Process Information:');
console.log('--------------------------------');
console.log(`Node.js Version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);
console.log(`Process ID: ${process.pid}`);

// Display usage instructions
console.log('\n💡 Usage Examples:');
console.log('--------------------------------');
console.log('node index.js                    # Basic hello world');
console.log('node index.js "John Doe"         # Personalized greeting');
console.log('hello "John Doe"                 # If installed globally');

// Exit with success code
process.exit(0);
