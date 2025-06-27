// Clear module cache for debugging purposes
Object.keys(require.cache).forEach(function(key) {
    delete require.cache[key];
});

require('./index.js');