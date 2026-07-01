import os
from datetime import timedelta

class Config:
    """Application configuration — values are read from environment variables.
    Copy .env.example to .env for local development.
    On cloud platforms (Render, Railway, etc.) set these in the dashboard.
    """

    # Flask secret key — MUST be changed in production
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'

    # Database — defaults to SQLite for local dev, use PostgreSQL in production.
    # Render provides DATABASE_URL automatically when a Postgres instance is attached.
    # SQLAlchemy 1.4+ requires "postgresql://" not "postgres://" — fix Render's URL if needed.
    raw_db_url = os.environ.get('DATABASE_URL') or 'sqlite:///society_treasurer.db'
    SQLALCHEMY_DATABASE_URI = raw_db_url.replace('postgres://', 'postgresql://', 1)

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT settings — MUST be changed in production
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'

    # CORS — comma-separated list of allowed frontend origins.
    # Example: "https://society-treasurer.onrender.com,https://society-treasurer.vercel.app"
    # Defaults to all origins for local development only.
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS') or '*'

# Made with Bob
