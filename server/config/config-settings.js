exports.PORT = process.env.PORT || 8000;
exports.CALLBACKHOST = (exports.PORT === 8000) ? 'http://127.0.0.1:8000' : 'http://gitachieve.com';
exports.HOST = (exports.PORT === 8000) ? '127.0.0.1' : 'gitachieve.com';
