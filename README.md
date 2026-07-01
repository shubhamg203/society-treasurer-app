# Society Treasurer Management System

A comprehensive web application for managing society finances, tracking maintenance payments, expenses, and generating financial reports.

## Features

### For Admin Users
- **Dashboard**: View current balance, total income/expenses, and recent transactions
- **Transaction Management**: Add, edit, and delete credit/debit transactions
- **Flat Member Management**: Manage flat members and their monthly maintenance amounts
- **Reports**: 
  - Expense summary by category with pie charts
  - Maintenance payment status tracking
  - Monthly income vs expense analysis with bar charts
- **User Management**: Create and manage read-only users for committee members

### For Read-Only Users
- View dashboard and all financial data
- Access reports and analytics
- Cannot modify any data

## Technology Stack

### Backend
- Python 3.x
- Flask (Web Framework)
- Flask-SQLAlchemy (ORM)
- Flask-JWT-Extended (Authentication)
- SQLite (Database)

### Frontend
- React 18
- React Router (Navigation)
- Axios (API calls)
- Recharts (Data visualization)
- Vite (Build tool)

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd society-treasurer-app/backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file (optional, uses defaults if not provided):
```bash
cp .env.example .env
```

5. Run the backend server:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd society-treasurer-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Default Login Credentials

- **Username**: admin
- **Password**: admin123

**Important**: Change the default password after first login!

## Usage Guide

### 1. Login
- Use the default credentials to login as admin
- Admin users have full access to all features

### 2. Add Flat Members
- Navigate to "Flat Members"
- Click "Add Flat Member"
- Enter flat number, owner name, contact details, and monthly maintenance amount

### 3. Record Transactions

#### Maintenance Payment (Credit)
- Go to "Transactions"
- Click "Add Transaction"
- Select "Credit" as type
- Choose "Maintenance" as category
- Select the flat member
- Enter amount and payment details

#### Expenses (Debit)
- Go to "Transactions"
- Click "Add Transaction"
- Select "Debit" as type
- Choose appropriate category (Cleaning, Repair, Utility, Other)
- Enter amount and description

### 4. View Reports
- Navigate to "Reports"
- View expense breakdown by category
- Check maintenance payment status for any month
- Analyze monthly income vs expenses

### 5. Manage Users (Admin Only)
- Go to "Users"
- Create read-only accounts for committee members
- Delete users when needed

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `DELETE /api/users/:id` - Delete user

### Flat Members
- `GET /api/flat-members` - Get all flat members
- `POST /api/flat-members` - Create flat member (Admin)
- `PUT /api/flat-members/:id` - Update flat member (Admin)
- `DELETE /api/flat-members/:id` - Delete flat member (Admin)

### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `POST /api/transactions` - Create transaction (Admin)
- `PUT /api/transactions/:id` - Update transaction (Admin)
- `DELETE /api/transactions/:id` - Delete transaction (Admin)

### Dashboard & Reports
- `GET /api/dashboard/summary` - Get dashboard statistics
- `GET /api/reports/expense-summary` - Get expense summary by category
- `GET /api/reports/maintenance-status` - Get maintenance payment status
- `GET /api/reports/monthly-summary` - Get monthly income/expense summary

## Database Schema

### Users
- id, username, email, password_hash, role, created_at, is_active

### Flat Members
- id, flat_number, owner_name, contact_number, email, monthly_maintenance, created_at, is_active

### Transactions
- id, transaction_type, category, amount, description, transaction_date, payment_method, reference_number, flat_member_id, created_by, created_at, updated_at

### Society Balance
- id, balance, last_updated

## Security Features

- JWT-based authentication
- Password hashing using Werkzeug
- Role-based access control (Admin/Read-only)
- Protected API endpoints
- Automatic token expiration

## Production Deployment

### Backend
1. Set strong SECRET_KEY and JWT_SECRET_KEY in environment variables
2. Use a production database (PostgreSQL recommended)
3. Enable HTTPS
4. Use a production WSGI server (Gunicorn, uWSGI)

### Frontend
1. Build the production bundle:
```bash
npm run build
```
2. Serve the `dist` folder using a web server (Nginx, Apache)
3. Update API_BASE_URL to point to production backend

## Troubleshooting

### Backend Issues
- **Database errors**: Delete `society_treasurer.db` and restart to recreate
- **Import errors**: Ensure all dependencies are installed
- **Port conflicts**: Change port in `app.py`

### Frontend Issues
- **API connection errors**: Check if backend is running on port 5000
- **Build errors**: Delete `node_modules` and run `npm install` again
- **CORS errors**: Ensure Flask-CORS is properly configured

## Future Enhancements

- Email notifications for pending maintenance
- SMS integration for payment reminders
- PDF export for reports
- Bulk transaction import
- Mobile app
- Payment gateway integration

## Support

For issues or questions, please contact your system administrator.

## License

This project is proprietary software for society management use only.