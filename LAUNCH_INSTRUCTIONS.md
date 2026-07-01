# 🚀 How to Launch the Application

## ✅ Good News!
Your application is **ALREADY RUNNING**! 

I can see from the logs that:
- ✅ Backend is running on port 5000
- ✅ Frontend is connected and making requests
- ✅ Login is working (HTTP 200 responses)

## 🌐 Access Your Application

**Open your web browser and go to:**
```
http://localhost:3000
```

**Login with:**
- Username: `admin`
- Password: `admin123`

---

## 🔄 For Future Use - Starting the Application

### Option 1: Use the Batch Script (Easiest)
1. Close all current terminals
2. Double-click: `START_APP.bat`
3. Wait for both servers to start
4. Browser will open automatically

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd society-treasurer-app/backend
python app.py
```

**Terminal 2 - Frontend (New Window):**
```bash
cd society-treasurer-app/frontend
npm install  # Only needed first time
npm run dev
```

Then open: http://localhost:3000

---

## 📊 What You Can Do

### As Admin:
1. **Dashboard** - View financial overview
2. **Transactions** - Add/edit income and expenses
3. **Flat Members** - Manage resident database
4. **Reports** - View charts and payment status
5. **Users** - Create accounts for committee members

### Features:
- ✅ Track maintenance payments per flat
- ✅ Record all expenses (cleaning, repairs, etc.)
- ✅ Generate monthly reports with charts
- ✅ Check who paid/didn't pay maintenance
- ✅ View current society balance
- ✅ Create read-only users for viewing

---

## 🛑 Stopping the Application

Press `Ctrl+C` in both terminal windows to stop the servers.

---

## 💾 Data Backup

Your data is stored in: `backend/society_treasurer.db`

To backup, simply copy this file to a safe location.

---

## 🆘 Troubleshooting

**Can't access http://localhost:3000?**
- Make sure both backend and frontend servers are running
- Check if any firewall is blocking the ports
- Try http://127.0.0.1:3000 instead

**Login not working?**
- Default credentials: admin / admin123
- Make sure backend server is running

**Need to reset?**
- Stop both servers
- Delete `backend/society_treasurer.db`
- Restart backend (will create fresh database)

---

## 📞 Support

For detailed documentation, see:
- `README.md` - Complete feature list
- `SETUP_GUIDE.md` - Installation guide
- `INSTALLATION_REQUIRED.md` - Prerequisites

Enjoy managing your society finances! 🎉