# 🔧 Troubleshooting Guide

## Current Issue: Dashboard Error 422

The error 422 typically means there's a validation or processing error on the backend. Let's fix this step by step.

## Solution: Complete Restart

### Step 1: Stop Everything

1. Go to the terminal running the backend
2. Press `Ctrl+C` to stop it
3. Close all browser tabs with the application

### Step 2: Delete the Database (Fresh Start)

```powershell
cd society-treasurer-app/backend
Remove-Item society_treasurer.db -ErrorAction SilentlyContinue
```

This will create a fresh database when you restart.

### Step 3: Restart Backend

```powershell
cd society-treasurer-app/backend
python app.py
```

Wait until you see:
```
Default admin user created: username='admin', password='admin123'
 * Running on http://0.0.0.0:5000
```

### Step 4: Start Frontend (New Terminal)

Open a **NEW** terminal window and run:

```powershell
cd society-treasurer-app/frontend
npm run dev
```

Wait until you see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

### Step 5: Access Application

1. Open browser
2. Go to: http://localhost:3000
3. Login: admin / admin123

## If Frontend Won't Start

### Check if Node.js is in PATH

```powershell
# Close ALL terminals first
# Open a NEW PowerShell window
node --version
npm --version
```

If these don't work:
1. Restart your computer (this updates PATH)
2. Try again

### Manual Frontend Setup

```powershell
# Navigate to frontend
cd society-treasurer-app/frontend

# Install dependencies (if not done)
npm install

# Start dev server
npm run dev
```

## Common Errors

### Error: "npm not found"
- **Solution**: Restart computer after installing Node.js
- **Or**: Add Node.js to PATH manually

### Error: "python not found"
- **Solution**: Restart terminal after installing Python
- **Or**: Use `py` instead of `python`

### Error: Port already in use
- **Backend (5000)**: Another app is using port 5000
  - Stop other apps or change port in app.py
- **Frontend (3000)**: Vite will ask to use different port
  - Type 'y' and press Enter

### Error 422 on Dashboard
- **Solution**: Delete database and restart (see Step 2 above)
- The database might be corrupted or using old schema

## Quick Test

### Test Backend Only

Open browser and go to:
```
http://localhost:5000/api/health
```

Should see:
```json
{"status":"healthy","message":"Society Treasurer API is running"}
```

### Test Frontend Only

If frontend is running, you should see the login page at:
```
http://localhost:3000
```

## Still Not Working?

### Option 1: Use the Batch File

1. Close all terminals
2. Double-click `START_APP.bat` in the society-treasurer-app folder
3. Wait for both servers to start
4. Browser will open automatically

### Option 2: Manual Debug

Check what's actually running:

```powershell
# Check if backend is running
Test-NetConnection -ComputerName localhost -Port 5000

# Check if frontend is running  
Test-NetConnection -ComputerName localhost -Port 3000
```

## Need Fresh Start?

### Complete Reset

```powershell
# Stop all servers (Ctrl+C in terminals)

# Delete database
cd society-treasurer-app/backend
Remove-Item society_treasurer.db

# Delete frontend build cache
cd ../frontend
Remove-Item -Recurse -Force node_modules/.vite -ErrorAction SilentlyContinue

# Restart everything
cd ../backend
python app.py

# In new terminal:
cd society-treasurer-app/frontend
npm run dev
```

## Success Indicators

✅ Backend running: Terminal shows "Running on http://0.0.0.0:5000"
✅ Frontend running: Terminal shows "Local: http://localhost:3000/"
✅ Can access: Browser shows login page at localhost:3000
✅ Can login: Dashboard loads after entering admin/admin123

## Contact

If none of these work, please provide:
1. Screenshot of backend terminal
2. Screenshot of frontend terminal (if running)
3. Screenshot of browser error
4. Output of: `node --version` and `python --version`