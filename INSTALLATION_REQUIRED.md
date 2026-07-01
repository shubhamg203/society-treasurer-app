# ⚠️ Prerequisites Required

Your system is missing the required software to run this application. Please install the following:

## 1. Install Python

### Option A: From Microsoft Store (Recommended for Windows)
1. Open Microsoft Store
2. Search for "Python 3.12" or "Python 3.11"
3. Click "Get" or "Install"
4. Wait for installation to complete

### Option B: From Python.org
1. Visit: https://www.python.org/downloads/
2. Download Python 3.11 or 3.12 for Windows
3. Run the installer
4. **IMPORTANT**: Check "Add Python to PATH" during installation
5. Click "Install Now"

### Verify Python Installation
Open a new PowerShell/Command Prompt and run:
```bash
python --version
```
You should see: `Python 3.x.x`

## 2. Install Node.js

### Download and Install
1. Visit: https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Accept all default options
5. Click "Install"

### Verify Node.js Installation
Open a new PowerShell/Command Prompt and run:
```bash
node --version
npm --version
```
You should see version numbers for both.

## 3. After Installing Prerequisites

Once both Python and Node.js are installed, follow these steps:

### Step 1: Install Backend Dependencies
```bash
cd society-treasurer-app/backend
pip install -r requirements.txt
```

### Step 2: Start Backend Server
```bash
python app.py
```
Keep this terminal open!

### Step 3: Install Frontend Dependencies (New Terminal)
```bash
cd society-treasurer-app/frontend
npm install
```

### Step 4: Start Frontend Server
```bash
npm run dev
```

### Step 5: Access Application
Open browser and go to: http://localhost:3000

Login with:
- Username: `admin`
- Password: `admin123`

## Need Help?

If you encounter any issues during installation:
1. Make sure to restart your terminal/PowerShell after installing Python and Node.js
2. Check that both are added to your system PATH
3. Run the verification commands to ensure they're properly installed

## Quick Installation Links

- **Python**: https://www.python.org/downloads/
- **Node.js**: https://nodejs.org/

Both installations are straightforward and take about 5-10 minutes total.