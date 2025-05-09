import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize SQLAlchemy
db = SQLAlchemy()
migrate = Migrate()


def create_app(config=None):
    """Application factory pattern"""
    app = Flask(__name__)

    # Configure the app
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-key")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "postgresql://localhost/blogsite"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["POSTS_PER_PAGE"] = int(os.environ.get("POSTS_PER_PAGE", 10))

    # Apply any custom configurations
    if config:
        app.config.update(config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Register blueprints
    from app.routes.posts import posts_bp

    app.register_blueprint(posts_bp, url_prefix="/api")

    # Shell context for flask cli
    @app.shell_context_processor
    def make_shell_context():
        return {"app": app, "db": db}

    # CLI commands
    from app.utils.commands import seed_db_command

    app.cli.add_command(seed_db_command)

    return app
