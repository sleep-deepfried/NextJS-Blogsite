from datetime import datetime
from app import db


class Post(db.Model):
    """Post model for blog posts"""

    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    excerpt = db.Column(db.String(300))
    featured_image = db.Column(db.String(255))
    published = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self):
        return f"<Post {self.title}>"

    def to_dict(self):
        """Convert the post to a dictionary"""
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "excerpt": self.excerpt,
            "featured_image": self.featured_image,
            "published": self.published,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
