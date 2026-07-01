# Quick Setup Guide for Society Treasurer App

## Step-by-Step Installation

### Step 1: Install Backend Dependencies

Open a terminal in the project directory and run:

```bash
cd society-treasurer-app/backend
python -m pip install -r requirements.txt
```

### Step 2: Start the Backend Server

While in the backend directory, run:

```bash
python app.py
```

You should see:
```
Default admin user created: username='admin', password='admin123'
 * Running on http://0.0.0.0:5000
```

**Keep this terminal open!** The backend server needs to keep running.

### Step 3: Install Frontend Dependencies

Open a **NEW terminal** (keep the backend running) and run:

```bash
cd society-treasurer-app/frontend
npm install
```

This will take a few minutes to download all dependencies.

### Step 4: Start the Frontend Server

While in the frontend directory, run:

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### Step 5: Access the Application

1. Open your web browser
2. Go to: `http://localhost:3000`
3. Login with:
   - **Username**: `admin`
   - **Password**: `admin123`

## First Time Setup Tasks

After logging in for the first time:

### 1. Change Default Password (Recommended)
- Create a new admin user with a strong password
- Login with the new user
- Delete the default admin user

### 2. Add Flat Members
- Go to "Flat Members" page
- Click "Add Flat Member"
- Add all flats in your society with their details

### 3. Record Initial Balance (if any)
- Go to "Transactions" page
- Add a credit transaction with category "Other"
- Description: "Opening Balance"
- Amount: Your current society balance

### 4. Create Read-Only Users
- Go to "Users" page
- Create accounts for other committee members
- They can view all data but cannot modify anything

## Common Issues & Solutions

### Backend Issues

**Issue**: `ModuleNotFoundError: No module named 'flask'`
**Solution**: Make sure you installed requirements: `pip install -r requirements.txt`

**Issue**: Port 5000 already in use
**Solution**: Stop other applications using port 5000, or change the port in `app.py` (last line)

### Frontend Issues

**Issue**: `npm: command not found`
**Solution**: Install Node.js from https://nodejs.org/

**Issue**: Port 3000 already in use
**Solution**: The terminal will ask if you want to use a different port. Type 'y' and press Enter.

**Issue**: Cannot connect to backend
**Solution**: Make sure the backend server is running on port 5000

## Daily Usage

### Starting the Application

You need to start both servers:

**Terminal 1 (Backend):**
```bash
cd society-treasurer-app/backend
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd society-treasurer-app/frontend
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Stopping the Application

Press `Ctrl+C` in both terminal windows to stop the servers.

## Data Backup

Your data is stored in `backend/society_treasurer.db`

To backup:
1. Stop the backend server
2. Copy `society_treasurer.db` to a safe location
3. Restart the backend server

To restore:
1. Stop the backend server
2. Replace `society_treasurer.db` with your backup
3. Restart the backend server

## Need Help?

Refer to the main README.md file for detailed documentation.