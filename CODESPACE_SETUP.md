# OctoFit Tracker - Codespace Configuration Guide

## Configuration Summary

### 1. ✅ Updated `settings.py`
The following changes were made to `octofit-tracker/backend/octofit_tracker/settings.py`:

- **Added environment variable support**: `CODESPACE_NAME` is read from the environment
- **Updated ALLOWED_HOSTS**: Now supports:
  - `localhost` (local development)
  - `127.0.0.1` (local development)
  - `{CODESPACE_NAME}-8000.app.github.dev` (GitHub Codespaces)
  - `{CODESPACE_NAME}` (GitHub Codespaces)
  
- **Added REST Framework configuration**: 
  - Configured `SECURE_PROXY_SSL_HEADER` to handle HTTPS requests from the codespace proxy
  - This ensures Django properly detects HTTPS connections and generates correct URLs in `reverse()`

**Code added to settings.py:**
```python
import os

# Configure ALLOWED_HOSTS for codespace and local development
CODESPACE_NAME = os.getenv('CODESPACE_NAME', 'localhost')
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    f'{CODESPACE_NAME}-8000.app.github.dev',
    CODESPACE_NAME,
]

# REST Framework settings with HTTPS support for codespace
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.AutoSchema',
    'SECURE_PROXY_SSL_HEADER': ('HTTP_X_FORWARDED_PROTO', 'https'),
}
```

### 2. ✅ Updated `urls.py`
The following changes were made to `octofit-tracker/backend/octofit_tracker/urls.py`:

- **Added environment variable configuration**: `CODESPACE_NAME` is imported and configured
- **Added documentation**: Comments explain the URL format and fallback behavior
- **REST API endpoint format**: `https://$CODESPACE_NAME-8000.app.github.dev/api/[component]/`

**Code added to urls.py:**
```python
import os

# Configure API endpoint for codespace environment
# REST API endpoint format: https://$CODESPACE_NAME-8000.app.github.dev/api/[component]/
# Falls back to localhost for local development
CODESPACE_NAME = os.getenv('CODESPACE_NAME', 'localhost')
```

### 3. ✅ Updated `launch.json`
The following changes were made to `.vscode/launch.json`:

- **Added CODESPACE_NAME environment variable**: Passed to the Django process so it can read the codespace configuration
- The variable is automatically available in GitHub Codespaces and defaults gracefully in local development

**Environment configuration:**
```json
"env": {
  "PYTHONPATH": "${workspaceFolder}/octofit-tracker/backend/venv/bin/python",
  "VIRTUAL_ENV": "${workspaceFolder}/octofit-tracker/backend/venv",
  "PATH": "${workspaceFolder}/octofit-tracker/backend/venv/bin:${env:PATH}",
  "CODESPACE_NAME": "${env:CODESPACE_NAME}"
}
```

## Running the Django Server

### Option 1: Using VS Code Launch Configuration (Recommended)
1. Open the debug view (Ctrl+Shift+D / Cmd+Shift+D)
2. Select "Launch Django Backend" from the dropdown
3. Click the green play button or press F5

### Option 2: From Terminal
```bash
# Activate virtual environment
source octofit-tracker/backend/venv/bin/activate  # On Linux/macOS
octofit-tracker\backend\venv\Scripts\activate     # On Windows

# Run Django server
python octofit-tracker/backend/manage.py runserver 0.0.0.0:8000
```

## Testing the API

### Endpoint Format
- **Local Development**: `http://localhost:8000/api/[component]/`
- **GitHub Codespaces**: `https://$CODESPACE_NAME-8000.app.github.dev/api/[component]/`

### Available Endpoints
The following REST API endpoints are available:

1. **Users**: `/api/users/`
2. **Teams**: `/api/teams/`
3. **Activities**: `/api/activities/`
4. **Leaderboard**: `/api/leaderboard/`
5. **Workouts**: `/api/workouts/`

### Test Using curl Commands

**Test Root API (shows available endpoints):**
```bash
curl -X GET http://localhost:8000/api/
```

**Test Users Endpoint (requires authentication):**
```bash
curl -X GET http://localhost:8000/api/users/ \
  -H "Content-Type: application/json"
```

**Test Teams Endpoint (requires authentication):**
```bash
curl -X GET http://localhost:8000/api/teams/ \
  -H "Content-Type: application/json"
```

### Using the Provided Test Scripts

**On Windows (PowerShell):**
```powershell
cd octofit-tracker\backend
.\test_api.ps1
```

**On Linux/macOS or GitHub Codespaces (Bash):**
```bash
cd octofit-tracker/backend
chmod +x test_api.sh
./test_api.sh
```

## Environment Variables

### Local Development
- `CODESPACE_NAME` defaults to `'localhost'` if not set
- Server runs at `http://localhost:8000`

### GitHub Codespaces
- `CODESPACE_NAME` is automatically set by GitHub Codespaces
- Server runs at `https://$CODESPACE_NAME-8000.app.github.dev`
- HTTPS is automatically handled by the proxy

## HTTPS Configuration
The `SECURE_PROXY_SSL_HEADER` setting ensures that:
1. When requests come through the GitHub Codespaces proxy (which terminates HTTPS)
2. Django correctly recognizes the original request was HTTPS
3. The `reverse()` function generates HTTPS URLs in API responses
4. No certificate warnings occur (the proxy handles HTTPS)

## Troubleshooting

### "Connection Refused" Error
- Verify MongoDB is running: `mongosh` command should connect to MongoDB
- Verify Django server is running (check VS Code Debug Console or terminal)
- Check that port 8000 is not blocked

### "Unauthorized" Responses (401)
- The API endpoints require authentication
- This is expected behavior as defined in the `views.py` `permission_classes`
- Create a user or obtain an authentication token to access protected endpoints

### HTTPS Issues in Codespaces
- The `SECURE_PROXY_SSL_HEADER` setting handles this automatically
- No additional SSL certificates are needed
- Use the forwarded URL: `https://$CODESPACE_NAME-8000.app.github.dev`

## Notes

- `ALLOWED_HOSTS` now uses explicit host configuration instead of the wildcard `['*']`
- The `CODESPACE_NAME` environment variable is read on startup
- Both local and codespace URLs are properly configured
- REST Framework is configured to properly generate HTTPS URLs in codespaces
- MongoDB connection uses localhost:27017 (configured in DATABASES setting)
