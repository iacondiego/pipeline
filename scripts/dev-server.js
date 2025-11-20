#!/usr/bin/env node

/**
 * Auto Port Detection for Next.js Development Server
 * Scans ports 3000-3006 and starts on first available
 * Handles both IPv4 (0.0.0.0) and IPv6 (::) bindings
 */

const { spawn } = require('child_process');
const net = require('net');

const PORT_RANGE = [3000, 3001, 3002, 3003, 3004, 3005, 3006];

/**
 * Check if a port is available on both IPv4 and IPv6
 */
async function isPortAvailable(port) {
  const checkHost = (host) => {
    return new Promise((resolve) => {
      const server = net.createServer();

      server.once('error', () => {
        resolve(false);
      });

      server.once('listening', () => {
        server.close();
        resolve(true);
      });

      server.listen(port, host);
    });
  };

  // Check both IPv4 and IPv6 (Next.js uses :: by default)
  const ipv4Available = await checkHost('0.0.0.0');
  const ipv6Available = await checkHost('::');

  return ipv4Available && ipv6Available;
}

/**
 * Find first available port in range
 */
async function findAvailablePort() {
  for (const port of PORT_RANGE) {
    if (await isPortAvailable(port)) {
      return port;
    }
    console.log(`⚠️  Port ${port} is busy, trying next...`);
  }

  throw new Error(`No available ports in range ${PORT_RANGE[0]}-${PORT_RANGE[PORT_RANGE.length - 1]}`);
}

/**
 * Start Next.js dev server on available port
 */
async function startDevServer() {
  try {
    const port = await findAvailablePort();
    console.log(`🚀 Starting Next.js on port ${port}...\n`);

    const devServer = spawn('npx', ['next', 'dev', '-p', port.toString()], {
      stdio: 'inherit',
      shell: true,
    });

    // Handle graceful shutdown
    const shutdown = (signal) => {
      console.log(`\n📴 Received ${signal}, shutting down gracefully...`);
      devServer.kill();
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    devServer.on('error', (error) => {
      console.error('❌ Failed to start dev server:', error);
      process.exit(1);
    });

    devServer.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`❌ Dev server exited with code ${code}`);
        process.exit(code);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Start the server
startDevServer();
