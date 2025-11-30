const assert = require('assert');

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function linkify(inputText) {
  const escaped = escapeHtml(String(inputText));

  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%%?=~_|!:,.;]*[-A-Z0-9+&@#\/%%%=~_|])/ig;
  const wwwUrlRegex = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

  const linked = escaped
    .replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(wwwUrlRegex, '$1<a href="http://$2" target="_blank" rel="noopener noreferrer">$2</a>');

  return linked;
}

// Tests
assert.strictEqual(
  linkify('visit https://www.google.com for search'),
  'visit <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">https://www.google.com</a> for search'
);

assert.strictEqual(
  linkify('go to www.example.com now'),
  'go to <a href="http://www.example.com" target="_blank" rel="noopener noreferrer">www.example.com</a> now'
);

// Ensure HTML is escaped
assert.strictEqual(
  linkify('<script>alert(1)</script> https://a.com'),
  '&lt;script&gt;alert(1)&lt;/script&gt; <a href="https://a.com" target="_blank" rel="noopener noreferrer">https://a.com</a>'
);

console.log('linkify tests passed');
