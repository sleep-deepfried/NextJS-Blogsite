import click
from flask.cli import with_appcontext
from app import db
from app.models.post import Post


@click.command("seed-db")
@with_appcontext
def seed_db_command():
    """Seed the database with sample blog posts."""
    click.echo("Seeding the database...")

    # Add sample blog posts
    sample_posts = [
        {
            "title": "Getting Started with Flask",
            "content": """
# Getting Started with Flask

Flask is a lightweight web framework for Python. It is designed to make getting started quick and easy, with the ability to scale up to complex applications.

## Installing Flask

You can install Flask using pip:

```bash
pip install flask
```

## Hello World Example

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
```

This is just a simple example to get you started with Flask. There's a lot more you can do with this powerful framework!
            """,
            "excerpt": "A beginner's guide to Flask, a lightweight web framework for Python.",
            "featured_image": "https://example.com/images/flask.jpg",
            "published": True,
        },
        {
            "title": "Introduction to NextJS",
            "content": """
# Introduction to NextJS

Next.js is a React framework that enables server-side rendering, static site generation, and more.

## Why NextJS?

- **Server-side rendering**: NextJS allows you to pre-render pages on the server, which can improve performance and SEO.
- **Static site generation**: NextJS can generate static HTML at build time, which can be served directly from a CDN.
- **API routes**: NextJS allows you to create API endpoints as part of your application.
- **File-based routing**: NextJS uses the file system for routing, making it easy to organize your application.

## Getting Started

To create a new NextJS application, run:

```bash
npx create-next-app@latest my-app
```

This will create a new NextJS application in the `my-app` directory.
            """,
            "excerpt": "Learn about NextJS, a powerful React framework for building modern web applications.",
            "featured_image": "https://example.com/images/nextjs.jpg",
            "published": True,
        },
        {
            "title": "Working with PostgreSQL",
            "content": """
# Working with PostgreSQL

PostgreSQL is a powerful, open-source relational database system with over 30 years of active development.

## Key Features

- **ACID Compliance**: PostgreSQL is fully ACID compliant, ensuring reliable transaction processing.
- **Extensibility**: PostgreSQL can be extended with custom data types, operators, and functions.
- **Concurrency**: PostgreSQL provides excellent support for concurrent access.
- **JSON Support**: PostgreSQL has excellent support for JSON data, allowing you to store and query JSON data directly.

## Basic Commands

Here are some basic PostgreSQL commands:

```sql
-- Create a database
CREATE DATABASE mydb;

-- Connect to a database
\c mydb

-- Create a table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

-- Insert data
INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');

-- Query data
SELECT * FROM users;
```

PostgreSQL is a great choice for any application that requires a relational database.
            """,
            "excerpt": "An introduction to PostgreSQL, a powerful open-source relational database system.",
            "featured_image": "https://example.com/images/postgresql.jpg",
            "published": True,
        },
    ]

    for post_data in sample_posts:
        post = Post(**post_data)
        db.session.add(post)

    db.session.commit()
    click.echo("Database seeded successfully!")
