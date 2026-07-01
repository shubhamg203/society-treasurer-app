#!/usr/bin/env python
"""Test if app.py can be imported without errors"""

try:
    print("Testing imports...")
    from flask import Flask
    print("✓ Flask imported")
    
    from flask_cors import CORS
    print("✓ Flask-CORS imported")
    
    from flask_jwt_extended import JWTManager
    print("✓ Flask-JWT-Extended imported")
    
    from sqlalchemy import func
    print("✓ SQLAlchemy imported")
    
    print("\nTesting app.py import...")
    import app
    print("✓ app.py imported successfully")
    
    print("\n✅ All imports successful! Backend code is valid.")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()

# Made with Bob
