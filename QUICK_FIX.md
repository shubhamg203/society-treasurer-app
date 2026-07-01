# 🔧 Quick Fix for Error 422

## The Problem

Error 422 on all endpoints means there's likely an issue with:
1. Flask-JWT-Extended version compatibility
2. Request/Response format
3. CORS configuration

## Solution: Manual Steps

### Step 1: Stop Both Servers

In Terminal 1 (Backend): Press `Ctrl+C`
In Terminal 2 (Frontend): Press `Ctrl+C`

### Step 2: Delete and Recreate Database

```powershell
cd society-treasurer-app/backend
Remove-Item society_treasurer.db -ErrorAction SilentlyContinue
```

### Step 3: Update Flask-JWT-Extended

```powershell
cd society-treasurer-app/backend
pip install --upgrade Flask-JWT-Extended
```

### Step 4: Restart Backend

```powershell
cd society-treasurer-app/backend
python app.py
```

Wait for: "Running on http://0.0.0.0:5000"

### Step 5: Test Backend Directly

Open browser and go to:
```
http://localhost:5000/api/health
```

Should see:
```json
{"status":"healthy","message":"Society Treasurer API is running"}
```

### Step 6: Restart Frontend

```powershell
cd society-treasurer-app/frontend  
npm run dev
```

### Step 7: Clear Browser Cache

1. Open browser
2. Press `Ctrl+Shift+Delete`
3. Clear "Cached images and files"
4. Close browser
5. Reopen and go to http://localhost:3000

## Alternative: Use Simpler Authentication

If the above doesn't work, we can temporarily disable JWT and use session-based auth for testing.

## Check Versions

```powershell
pip show Flask-JWT-Extended
```

Should be version 4.6.0 or higher.

## Still Not Working?

The issue might be with how the frontend is sending the JWT token. Let me know and I'll create a version without authentication for initial testing.