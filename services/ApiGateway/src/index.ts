import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const port = process.env.PORT || 3000;

// Configuration for the services
const services = [
  {
    route: '/api/v1/auth',
    target: 'http://localhost:3002',
  },
  {
    route: '/api/v1/admin',
    target: 'http://localhost:3001',
  },
  // Add other services here
];

// Set up the proxy for each service
services.forEach(({ route, target }) => {
  app.use(route, createProxyMiddleware({
    target,
    changeOrigin: true,
  }));
});

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
