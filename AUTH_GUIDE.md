# Authentication Guide for Example API

This API supports two authentication methods for connecting to the `frkr` Ingest Gateway.

## 1. Basic Authentication (Default)

By default, the API will use Basic Auth.

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `FRKR_USERNAME` | `testuser` | Gateway username |
| `FRKR_PASSWORD` | `testpass` | Gateway password |

### Run Example
```bash
export FRKR_USERNAME="myuser"
export FRKR_PASSWORD="mypassword"
npm start
```

---

## 2. OIDC (Machine-to-Machine)

To use OIDC (Client Credentials flow), set `AUTH_METHOD=oidc`.

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_METHOD` | Yes | Set to `oidc` |
| `OIDC_ISSUER` | Yes | Identity Provider URL (e.g., Auth0, Azure) |
| `OIDC_CLIENT_ID` | Yes | App Client ID |
| `OIDC_CLIENT_SECRET` | Yes | App Client Secret |

### Run Example (Generic)
```bash
export AUTH_METHOD="oidc"
export OIDC_ISSUER="https://my-idp.example.com/"
export OIDC_CLIENT_ID="your-client-id"
export OIDC_CLIENT_SECRET="your-client-secret"
npm start
```

### Run Example (Azure / Entra ID)
Use the `.default` scope logic if your SDK handles it, or ensure your Client ID acts as the resource.

```bash
export AUTH_METHOD="oidc"
export OIDC_ISSUER="https://login.microsoftonline.com/YOUR_TENANT_ID/v2.0"
export OIDC_CLIENT_ID="YOUR_APP_CLIENT_ID"
export OIDC_CLIENT_SECRET="YOUR_CLIENT_SECRET"
npm start
```
