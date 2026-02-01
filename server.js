require('dotenv').config();
const express = require('express');
const frkr = require('@frkr-io/sdk-node');

// Request logger middleware
function logRequest(source, port) {
  return (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${source}] [Port ${port}] ${req.method} ${req.path}`);
    if (Object.keys(req.query).length > 0) {
      console.log(`  Query:`, req.query);
    }
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(`  Body:`, JSON.stringify(req.body, null, 2));
    }
    next();
  };
}

// Shared API routes handler
function createApiRoutes() {
  const router = express.Router();
  
  router.get('/api/users', (req, res) => {
    res.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
  });

  router.post('/api/users', (req, res) => {
    const user = { id: Date.now(), ...req.body };
    res.status(201).json(user);
  });

  router.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return router;
}

// Initialize frkr SDK
const transport = process.env.FRKR_TRANSPORT || 'http';
const authMethod = process.env.AUTH_METHOD || 'basic';

let frkrConfig = {
  ingestGatewayUrl: process.env.FRKR_INGEST_URL || (transport === 'grpc' ? 'localhost:50051' : 'http://localhost:8082'),
  streamId: process.env.FRKR_STREAM_ID || 'my-api',
  transport: transport
};

if (authMethod === 'oidc') {
  console.log('🔒 Using OIDC Authentication');
  frkrConfig.auth = {
    type: 'oidc',
    issuer: process.env.OIDC_ISSUER,
    clientId: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET
  };
} else {
  console.log('🔑 Using Basic Authentication');
  // Legacy/Basic auth uses top-level username/password in SDK config
  frkrConfig.username = process.env.FRKR_USERNAME || 'testuser';
  frkrConfig.password = process.env.FRKR_PASSWORD || 'testpass';
}

// Port 3000: Direct API calls (with frkr mirroring)
const API_PORT = process.env.API_PORT || 3000;
const apiApp = express();
apiApp.use(express.json());
apiApp.use(logRequest('DIRECT API CALL', API_PORT));
apiApp.use(frkr.mirror(frkrConfig));
apiApp.use(createApiRoutes());

apiApp.listen(API_PORT, () => {
  console.log(`✅ API server running on http://localhost:${API_PORT}`);
  console.log(`   Requests will be mirrored to frkr`);
  console.log(`   Stream ID: ${frkrConfig.streamId}`);
  console.log(`   Transport: ${transport.toUpperCase()} (${frkrConfig.ingestGatewayUrl})`);
});

// Port 3001: Forwarded requests from frkr CLI
const FORWARD_PORT = process.env.FORWARD_PORT || 3001;
const forwardApp = express();
forwardApp.use(express.json());
forwardApp.use(logRequest('FORWARDED FROM FRKR', FORWARD_PORT));
forwardApp.use(createApiRoutes());

forwardApp.listen(FORWARD_PORT, () => {
  console.log(`✅ Forward server running on http://localhost:${FORWARD_PORT}`);
  console.log(`   Ready to receive forwarded requests from frkr CLI`);
});

console.log('\n🚀 frkr-example-api started');
console.log(`   Direct API: http://localhost:${API_PORT}`);
console.log(`   Forwarded:  http://localhost:${FORWARD_PORT}\n`);
