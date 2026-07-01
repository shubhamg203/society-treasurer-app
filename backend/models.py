from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    """User model for authentication and authorization"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='readonly')  # 'admin' or 'readonly'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }


class FlatMember(db.Model):
    """Flat member model for society residents"""
    __tablename__ = 'flat_members'
    
    id = db.Column(db.Integer, primary_key=True)
    flat_number = db.Column(db.String(20), unique=True, nullable=False)
    owner_name = db.Column(db.String(100), nullable=False)
    contact_number = db.Column(db.String(20))
    email = db.Column(db.String(120))
    monthly_maintenance = db.Column(db.Float, nullable=False, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationship with transactions
    transactions = db.relationship('Transaction', backref='flat_member', lazy=True)
    
    def to_dict(self):
        """Convert flat member to dictionary"""
        return {
            'id': self.id,
            'flat_number': self.flat_number,
            'owner_name': self.owner_name,
            'contact_number': self.contact_number,
            'email': self.email,
            'monthly_maintenance': self.monthly_maintenance,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }


class Transaction(db.Model):
    """Transaction model for all financial records"""
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    transaction_type = db.Column(db.String(20), nullable=False)  # 'credit' or 'debit'
    category = db.Column(db.String(50), nullable=False)  # 'maintenance', 'cleaning', 'repair', 'utility', 'other'
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    transaction_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    payment_method = db.Column(db.String(50))  # 'cash', 'bank_transfer', 'cheque', 'upi'
    reference_number = db.Column(db.String(100))
    
    # Foreign key to flat member (for maintenance payments)
    flat_member_id = db.Column(db.Integer, db.ForeignKey('flat_members.id'), nullable=True)
    
    # Metadata
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = db.relationship('User', backref='transactions')
    
    def to_dict(self):
        """Convert transaction to dictionary"""
        return {
            'id': self.id,
            'transaction_type': self.transaction_type,
            'category': self.category,
            'amount': self.amount,
            'description': self.description,
            'transaction_date': self.transaction_date.isoformat(),
            'payment_method': self.payment_method,
            'reference_number': self.reference_number,
            'flat_member_id': self.flat_member_id,
            'flat_number': self.flat_member.flat_number if self.flat_member else None,
            'owner_name': self.flat_member.owner_name if self.flat_member else None,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class SocietyBalance(db.Model):
    """Society balance snapshot model"""
    __tablename__ = 'society_balance'
    
    id = db.Column(db.Integer, primary_key=True)
    balance = db.Column(db.Float, nullable=False, default=0.0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert balance to dictionary"""
        return {
            'id': self.id,
            'balance': self.balance,
            'last_updated': self.last_updated.isoformat()
        }

# Made with Bob
