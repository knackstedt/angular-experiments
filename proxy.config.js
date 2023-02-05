const PROXY_CONFIG = [
  {
    "context": [
      // "/api" // which paths get proxied.
    ],
    "target": "https://example.com",
    "secure": false,
    "changeOrigin": true
  }
];

module.exports = PROXY_CONFIG;
