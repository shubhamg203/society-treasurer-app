from flask import Flask, jsonify, request, session
from flask_cors import CORS
from config import Config
from models import db, User, FlatMember, Transaction, SocietyBalance
from datetime import datetime
from sqlalchemy import func

app = Flask(__name__)
app.config.from_object(Config)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'simple-secret-key-for-development'

# Initialize extensions
CORS(app, supports_credentials=True)
db.init_app(app)

# Create tables and default admin user
with app.app_context():
    db.create_all()
    
    # Create default admin user if not exists
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(
            username='admin',
            email='admin@society.com',
            role='admin'
        )
        admin.set_password('admin123')
        db.session.add(admin)
        
        # Initialize society balance
        balance = SocietyBalance.query.first()
        if not balance:
            balance = SocietyBalance(balance=0.0)
            db.session.add(balance)
        
        db.session.commit()
        print("Default admin user created: username='admin', password='admin123'")


# ============= Authentication Routes =============

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    user = User.query.filter_by(username=username).first()
    
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account is inactive'}), 403
    
    # Store user in session
    session['user_id'] = user.id
    session['user_role'] = user.role
    
    return jsonify({
        'access_token': 'simple-token',  # Dummy token for frontend compatibility
        'user': user.to_dict()
    }), 200


@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    """Get current logged-in user"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200


# Helper function to check if user is logged in
def require_auth():
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)


# ============= User Management Routes =============

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users"""
    current_user = require_auth()
    if not current_user or current_user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200


@app.route('/api/users', methods=['POST'])
def create_user():
    """Create new user"""
    current_user = require_auth()
    if not current_user or current_user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    
    if not all(k in data for k in ['username', 'email', 'password', 'role']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    new_user = User(
        username=data['username'],
        email=data['email'],
        role=data['role']
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(new_user.to_dict()), 201


@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete user"""
    current_user = require_auth()
    if not current_user or current_user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    if current_user.id == user_id:
        return jsonify({'error': 'Cannot delete your own account'}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'User deleted successfully'}), 200


# ============= Flat Member Routes =============

@app.route('/api/flat-members', methods=['GET'])
def get_flat_members():
    """Get all flat members"""
    if not require_auth():
        return jsonify({'error': 'Authentication required'}), 401
    
    flat_members = FlatMember.query.filter_by(is_active=True).all()
    return jsonify([member.to_dict() for member in flat_members]), 200


@app.route('/api/flat-members', methods=['POST'])
def create_flat_member():
    """Create new flat member"""
    current_user = require_auth()
    if not current_user or current_user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    
    if not all(k in data for k in ['flat_number', 'owner_name', 'monthly_maintenance']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if FlatMember.query.filter_by(flat_number=data['flat_number']).first():
        return jsonify({'error': 'Flat number already exists'}), 400
    
    new_member = FlatMember(
        flat_number=data['flat_number'],
        owner_name=data['owner_name'],
        contact_number=data.get('contact_number'),
        email=data.get('email'),
        monthly_maintenance=data['monthly_maintenance']
    )
    
    db.session.add(new_member)
    db.session.commit()
    
    return jsonify(new_member.to_dict()), 201


@app.route('/api/flat-members/<int:member_id>', methods=['PUT'])
def update_flat_member(member_id):
    """Update flat member"""
    current_user = require_auth()
    if not current_user or current_user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    member = FlatMember.query.get(member_id)
    if not member:
        return jsonify({'error': 'Flat member not found'}), 404
    
    data = request.get_json()
    
    if 'owner_name' in data:
        member.owner_name = data['owner_name']
    if 'contact_number' in data:
        member.contact_number = data['contact_number']
    if 'email' in data:
        member.email = data['email']
    if 'monthly_maintenance' in data:
        member.monthly_maintenance = data['monthly_maintenance']
    
    db.session.commit()
    
    return jsonify(member.to_dict()), 200


@app.route('/api/flat-members/<int:member_id>', methods=['DELETE'])
def delete_flat_member(member_id):
    """Delete flat member"""
    current_user = require_auth()
    if not current_user or current_user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    member = FlatMember.query.get(member_id)
    if not member:
        return jsonify({'error': 'Flat member not found'}), 404
    
    member.is_active = False
    db.session.commit()
    
    return jsonify({'message': 'Flat member deleted successfully'}), 200


# ============= Transaction Routes =============

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Get all transactions with optional filters"""
    if not require_auth():
        return jsonify({'error': 'Authentication required'}), 401
    
    transaction_type = request.args.get('type')
    category = request.args.get('category')
    flat_member_id = request.args.get('flat_member_id')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Transaction.query
    
    if transaction_type:
        query = query.filter_by(transaction_type=transaction_type)
    if category:
        query = query.filter_by(category=category)
    if flat_member_id:
        query = query.filter_by(flat_member_id=flat_member_id)
    if start_date:
        query = query.filter(Transaction.transaction_date >= datetime.fromisoformat(start_date))
    if end_date:
        query = query.filter(Transaction.transaction_date <= datetime.fromisoformat(end_date))
    
    transactions = query.order_by(Transaction.transaction_date.desc()).all()
    return jsonify([t.to_dict() for t in transactions]), 200


@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    """Create new transaction"""
    current_user = require_auth()
    if not current_user or current_user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    
    if not all(k in data for k in ['transaction_type', 'category', 'amount']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    transaction_date = datetime.fromisoformat(data['transaction_date']) if 'transaction_date' in data else datetime.utcnow()
    
    new_transaction = Transaction(
        transaction_type=data['transaction_type'],
        category=data['category'],
        amount=float(data['amount']),
        description=data.get('description'),
        transaction_date=transaction_date,
        payment_method=data.get('payment_method'),
        reference_number=data.get('reference_number'),
        flat_member_id=data.get('flat_member_id'),
        created_by=current_user.id
    )
    
    db.session.add(new_transaction)
    
    balance = SocietyBalance.query.first()
    if not balance:
        balance = SocietyBalance(balance=0.0)
        db.session.add(balance)
    
    if data['transaction_type'] == 'credit':
        balance.balance += float(data['amount'])
    else:
        balance.balance -= float(data['amount'])
    
    db.session.commit()
    
    return jsonify(new_transaction.to_dict()), 201


@app.route('/api/transactions/<int:transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    """Update transaction"""
    current_user = require_auth()
    if not current_user or current_user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    transaction = Transaction.query.get(transaction_id)
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    
    data = request.get_json()
    
    old_type = transaction.transaction_type
    old_amount = transaction.amount
    
    if 'transaction_type' in data:
        transaction.transaction_type = data['transaction_type']
    if 'category' in data:
        transaction.category = data['category']
    if 'amount' in data:
        transaction.amount = float(data['amount'])
    if 'description' in data:
        transaction.description = data['description']
    if 'transaction_date' in data:
        transaction.transaction_date = datetime.fromisoformat(data['transaction_date'])
    if 'payment_method' in data:
        transaction.payment_method = data['payment_method']
    if 'reference_number' in data:
        transaction.reference_number = data['reference_number']
    if 'flat_member_id' in data:
        transaction.flat_member_id = data['flat_member_id']
    
    balance = SocietyBalance.query.first()
    
    if old_type == 'credit':
        balance.balance -= old_amount
    else:
        balance.balance += old_amount
    
    if transaction.transaction_type == 'credit':
        balance.balance += transaction.amount
    else:
        balance.balance -= transaction.amount
    
    db.session.commit()
    
    return jsonify(transaction.to_dict()), 200


@app.route('/api/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    """Delete transaction"""
    current_user = require_auth()
    if not current_user or current_user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    transaction = Transaction.query.get(transaction_id)
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    
    balance = SocietyBalance.query.first()
    if transaction.transaction_type == 'credit':
        balance.balance -= transaction.amount
    else:
        balance.balance += transaction.amount
    
    db.session.delete(transaction)
    db.session.commit()
    
    return jsonify({'message': 'Transaction deleted successfully'}), 200


# ============= Dashboard & Reports Routes =============

@app.route('/api/dashboard/summary', methods=['GET'])
def get_dashboard_summary():
    """Get dashboard summary statistics"""
    if not require_auth():
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        balance = SocietyBalance.query.first()
        current_balance = balance.balance if balance else 0.0
        
        total_credits = db.session.query(func.sum(Transaction.amount)).filter_by(transaction_type='credit').scalar() or 0.0
        total_debits = db.session.query(func.sum(Transaction.amount)).filter_by(transaction_type='debit').scalar() or 0.0
        
        now = datetime.utcnow()
        month_start = datetime(now.year, now.month, 1)
        if now.month == 12:
            month_end = datetime(now.year + 1, 1, 1)
        else:
            month_end = datetime(now.year, now.month + 1, 1)
        
        month_credits = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.transaction_type == 'credit',
            Transaction.transaction_date >= month_start,
            Transaction.transaction_date < month_end
        ).scalar() or 0.0
        
        month_debits = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.transaction_type == 'debit',
            Transaction.transaction_date >= month_start,
            Transaction.transaction_date < month_end
        ).scalar() or 0.0
        
        total_flats = FlatMember.query.filter_by(is_active=True).count()
        recent_transactions = Transaction.query.order_by(Transaction.transaction_date.desc()).limit(10).all()
        
        return jsonify({
            'current_balance': float(current_balance),
            'total_credits': float(total_credits),
            'total_debits': float(total_debits),
            'month_credits': float(month_credits),
            'month_debits': float(month_debits),
            'total_flats': total_flats,
            'recent_transactions': [t.to_dict() for t in recent_transactions]
        }), 200
    except Exception as e:
        print(f"Dashboard error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/reports/expense-summary', methods=['GET'])
def get_expense_summary():
    """Get expense summary by category"""
    if not require_auth():
        return jsonify({'error': 'Authentication required'}), 401
    
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = db.session.query(
        Transaction.category,
        func.sum(Transaction.amount).label('total')
    ).filter_by(transaction_type='debit')
    
    if start_date:
        query = query.filter(Transaction.transaction_date >= datetime.fromisoformat(start_date))
    if end_date:
        query = query.filter(Transaction.transaction_date <= datetime.fromisoformat(end_date))
    
    results = query.group_by(Transaction.category).all()
    
    return jsonify([
        {'category': category, 'total': float(total)}
        for category, total in results
    ]), 200


@app.route('/api/reports/maintenance-status', methods=['GET'])
def get_maintenance_status():
    """Get maintenance payment status for all flats"""
    if not require_auth():
        return jsonify({'error': 'Authentication required'}), 401
    
    month = int(request.args.get('month', datetime.utcnow().month))
    year = int(request.args.get('year', datetime.utcnow().year))
    
    month_start = datetime(year, month, 1)
    if month == 12:
        month_end = datetime(year + 1, 1, 1)
    else:
        month_end = datetime(year, month + 1, 1)
    
    flat_members = FlatMember.query.filter_by(is_active=True).all()
    
    status_list = []
    for member in flat_members:
        payment = Transaction.query.filter(
            Transaction.flat_member_id == member.id,
            Transaction.category == 'maintenance',
            Transaction.transaction_type == 'credit',
            Transaction.transaction_date >= month_start,
            Transaction.transaction_date < month_end
        ).first()
        
        status_list.append({
            'flat_number': member.flat_number,
            'owner_name': member.owner_name,
            'monthly_maintenance': member.monthly_maintenance,
            'paid': payment is not None,
            'payment_date': payment.transaction_date.isoformat() if payment else None,
            'amount_paid': payment.amount if payment else 0.0
        })
    
    return jsonify(status_list), 200


@app.route('/api/reports/monthly-summary', methods=['GET'])
def get_monthly_summary():
    """Get monthly income and expense summary"""
    if not require_auth():
        return jsonify({'error': 'Authentication required'}), 401
    
    year = int(request.args.get('year', datetime.utcnow().year))
    
    monthly_data = []
    
    for month in range(1, 13):
        month_start = datetime(year, month, 1)
        if month == 12:
            month_end = datetime(year + 1, 1, 1)
        else:
            month_end = datetime(year, month + 1, 1)
        
        credits = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.transaction_type == 'credit',
            Transaction.transaction_date >= month_start,
            Transaction.transaction_date < month_end
        ).scalar() or 0.0
        
        debits = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.transaction_type == 'debit',
            Transaction.transaction_date >= month_start,
            Transaction.transaction_date < month_end
        ).scalar() or 0.0
        
        monthly_data.append({
            'month': month,
            'credits': float(credits),
            'debits': float(debits),
            'net': float(credits - debits)
        })
    
    return jsonify(monthly_data), 200


# ============= Health Check =============

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Society Treasurer API is running (Simplified Version)'}), 200


if __name__ == '__main__':
    print("\n" + "="*50)
    print("Society Treasurer Backend (Simplified Version)")
    print("="*50)
    print("Running on: http://localhost:5001")
    print("Authentication: Session-based (no JWT)")
    print("Default login: admin / admin123")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5001)

# Made with Bob
