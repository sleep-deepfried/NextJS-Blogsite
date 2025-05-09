from marshmallow import Schema, fields, validate, ValidationError


class PostSchema(Schema):
    """Schema for validating post data"""

    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=3, max=255))
    content = fields.Str(required=True, validate=validate.Length(min=10))
    excerpt = fields.Str(validate=validate.Length(max=300))
    featured_image = fields.Str(validate=validate.URL(relative=True))
    published = fields.Boolean(missing=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class PostPaginationSchema(Schema):
    """Schema for paginated posts response"""

    items = fields.List(fields.Nested(PostSchema))
    total = fields.Int()
    page = fields.Int()
    per_page = fields.Int()
    pages = fields.Int()
    has_next = fields.Boolean()
    has_prev = fields.Boolean()


post_schema = PostSchema()
posts_schema = PostSchema(many=True)
post_pagination_schema = PostPaginationSchema()
