const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/v2',
    createProxyMiddleware({
      target: 'http://localhost:5000', // Backend 1
      changeOrigin: true,
    })
  );

  app.use(
    '/api/v3',
    createProxyMiddleware({
      target: 'http://localhost:4000', // Backend 2
      changeOrigin: true,
    })
  );
};
