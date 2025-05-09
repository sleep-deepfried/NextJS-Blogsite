from flask import Blueprint, request, jsonify, current_app
from marshmallow import ValidationError
from sqlalchemy import or_
from app import db
from app.models.post import Post
from app.schemas.post import post_schema, posts_schema, post_pagination_schema

posts_bp = Blueprint("posts", __name__)


@posts_bp.route("/posts", methods=["GET"])
def get_posts():
    """Get all blog posts with pagination and search"""
    # Get pagination parameters
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get(
        "per_page", current_app.config["POSTS_PER_PAGE"], type=int
    )

    # Get search query if provided
    search_query = request.args.get("search", "")

    # Build query
    query = Post.query

    # Apply search filter if provided
    if search_query:
        search_filter = or_(
            Post.title.ilike(f"%{search_query}%"),
            Post.content.ilike(f"%{search_query}%"),
            Post.excerpt.ilike(f"%{search_query}%"),
        )
        query = query.filter(search_filter)

    # Order by most recent
    query = query.order_by(Post.created_at.desc())

    # Paginate results
    paginated_posts = query.paginate(page=page, per_page=per_page)

    # Format response
    result = {
        "items": [post.to_dict() for post in paginated_posts.items],
        "total": paginated_posts.total,
        "page": paginated_posts.page,
        "per_page": paginated_posts.per_page,
        "pages": paginated_posts.pages,
        "has_next": paginated_posts.has_next,
        "has_prev": paginated_posts.has_prev,
    }

    return jsonify(result)


@posts_bp.route("/posts/<int:post_id>", methods=["GET"])
def get_post(post_id):
    """Get a specific blog post by ID"""
    post = Post.query.get_or_404(post_id)
    return jsonify(post.to_dict())


@posts_bp.route("/posts", methods=["POST"])
def create_post():
    """Create a new blog post"""
    try:
        # Validate request data
        post_data = post_schema.load(request.json)

        # Create new post
        post = Post(
            title=post_data["title"],
            content=post_data["content"],
            excerpt=post_data.get("excerpt"),
            featured_image=post_data.get("featured_image"),
            published=post_data.get("published", True),
        )

        # Save to database
        db.session.add(post)
        db.session.commit()

        return jsonify(post.to_dict()), 201

    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400


@posts_bp.route("/posts/<int:post_id>", methods=["PUT"])
def update_post(post_id):
    """Update an existing blog post"""
    post = Post.query.get_or_404(post_id)

    try:
        # Validate request data
        post_data = post_schema.load(request.json)

        # Update post fields
        post.title = post_data["title"]
        post.content = post_data["content"]
        post.excerpt = post_data.get("excerpt")
        post.featured_image = post_data.get("featured_image")
        post.published = post_data.get("published", post.published)

        # Save changes
        db.session.commit()

        return jsonify(post.to_dict())

    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400


@posts_bp.route("/posts/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    """Delete a blog post"""
    post = Post.query.get_or_404(post_id)

    # Delete from database
    db.session.delete(post)
    db.session.commit()

    return jsonify({"message": "Post deleted successfully"}), 200
