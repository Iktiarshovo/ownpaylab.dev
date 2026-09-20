#!/usr/bin/env node

// Ensure ts-node / runtime execution or direct node
try {
  require('ts-node/register');
  const { OwnPayMCPServer } = require('../src/server');
  const server = new OwnPayMCPServer();
  server.startStdio();
} catch (e) {
  // If compiled or ts-node not globally available, fallback to compiled dist if present
  try {
    const { OwnPayMCPServer } = require('../dist/server');
    const server = new OwnPayMCPServer();
    server.startStdio();
  } catch (err) {
    console.error('[ownpay-mcp] Startup error:', err.message);
    process.exit(1);
  }
}
