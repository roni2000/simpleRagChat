const fs = require('fs');
const path = require('path');
const assert = require('assert');

const indexPath = path.join(__dirname, '..', 'index.js');
const content = fs.readFileSync(indexPath, 'utf8');

assert.ok(content.includes('window.toggleChat = window.toggleChat || function'), 'fallback toggle handler not found in index.js');

console.log('fallback toggle handler exists in index.js');
