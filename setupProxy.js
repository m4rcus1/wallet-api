const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/add',
    createProxyMiddleware({
      target: 'https://tinted-diagnostic-gateway.glitch.me',
      changeOrigin: true,
      pathRewrite: {
        '^/add': '/add',
      },
    })
  );
};
