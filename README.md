# frkr Example API

Example Node.js API demonstrating frkr SDK integration for traffic mirroring.

## Overview

This example API demonstrates how to integrate the frkr SDK into a Node.js Express application. It shows:

- **Traffic Mirroring**: All API requests are automatically mirrored to frkr
- **Dual Port Setup**: 
  - Port 3000: Direct API calls (with frkr mirroring)
  - Port 3001: Forwarded requests from the frkr CLI
- **Request Logging**: Clear labels showing the source of each request

## Prerequisites

- Node.js 14+ 
- npm or yarn
- A running frkr instance (or use frkr CLI for local development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/frkr-io/frkr-example-api.git
cd frkr-example-api
```

2. Install dependencies:
```bash
npm install
```

**Note**: The example uses `@frkr-io/sdk-node` directly from GitHub. If you prefer to use the npm package, you can update `package.json` to use `"@frkr-io/sdk-node": "^0.1.0"` instead.

## Configuration

Configure frkr connection via environment variables:

```bash
export FRKR_INGEST_URL="http://localhost:8082"
export FRKR_STREAM_ID="my-api"
export FRKR_USERNAME="testuser"
export FRKR_PASSWORD="testpass"
```

Or set them inline when running:
```bash
FRKR_INGEST_URL="http://localhost:8082" \
FRKR_STREAM_ID="my-api" \
FRKR_USERNAME="testuser" \
FRKR_PASSWORD="testpass" \
npm start
```

**Default values** (if not set):
- `FRKR_INGEST_URL`: `http://localhost:8082`
- `FRKR_STREAM_ID`: `my-api`
- `FRKR_USERNAME`: `testuser`
- `FRKR_PASSWORD`: `testpass`

## Run

```bash
npm start
```

The API will start and display:
```
✅ API server running on http://localhost:3000
   Requests will be mirrored to frkr
   Stream ID: my-api
✅ Forward server running on http://localhost:3001
   Ready to receive forwarded requests from frkr CLI
```

## Test

### Direct API Calls (Port 3000)

These requests are mirrored to frkr:

```bash
# GET request
curl http://localhost:3000/api/users

# POST request
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'

# Health check
curl http://localhost:3000/api/health
```

### Forwarded Requests (Port 3001)

These requests come from the frkr CLI after being streamed:

```bash
# The frkr CLI will forward requests here
curl http://localhost:3001/api/users
```

## Request Logging

All requests are logged with clear labels:
- `[DIRECT API CALL]` - Requests sent directly to port 3000
- `[FORWARDED FROM FRKR]` - Requests forwarded by the frkr CLI to port 3001

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│ Port 3000   │   │ Port 3001   │
│ Direct API  │   │ Forwarded   │
│ (Mirrored)  │   │ from frkr   │
└──────┬──────┘   └─────────────┘
       │
       ▼
┌─────────────┐
│  frkr SDK   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ frkr Ingest │
│   Gateway   │
└─────────────┘
```

## Development

### Local Development with frkr CLI

1. Start the example API:
```bash
npm start
```

2. In another terminal, use frkr CLI to forward traffic:
```bash
frkr forward my-api --target http://localhost:3001
```

3. Make requests to your API - they'll be mirrored to frkr and can be replayed.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Apache 2.0 - See [LICENSE](LICENSE) file for details.


