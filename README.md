# Blogsite Application

A full-stack blog application built with NextJS, Flask, and PostgreSQL.

## Features

- Create, read, update, and delete blog posts
- Search functionality for blog posts
- Pagination for better user experience
- Responsive user interface
- RESTful API

## Tech Stack

### Backend
- Python (Flask)
- PostgreSQL database

### Frontend
- TypeScript
- NextJS
- Tailwind CSS

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment and activate it:
```bash
python -m venv .venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install the required packages:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
touch .env
```
Edit the `.env` file to include your PostgreSQL credentials.

5. Run database migrations:
```bash
flask db upgrade
```

6. Seed the database:
```bash
flask seed-db
```

7. Start the backend server:
```bash
flask run
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
touch .env.local
```
Edit the `.env.local` file to point to your backend API.

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## API Documentation

### Blog Posts API

- `GET /api/posts` - Get all blog posts (supports pagination and search)
- `GET /api/posts/:id` - Get a specific blog post
- `POST /api/posts` - Create a new blog post
- `PUT /api/posts/:id` - Update a blog post
- `DELETE /api/posts/:id` - Delete a blog post

## Project Structure

```
├── backend/                # Flask backend
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── schemas/        # Request/response schemas
│   │   └── utils/          # Utility functions
│   ├── migrations/         # Database migrations
│   ├── tests/              # Backend tests
│   ├── .env.example        # Example environment variables
│   ├── requirements.txt    # Python dependencies
│   └── run.py              # Entry point
├── frontend/               # NextJS frontend
│   ├── app/                # Next.js 13+ App Router
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utility functions
│   ├── public/             # Static assets
│   ├── .env.example        # Example environment variables
│   └── package.json        # JavaScript dependencies
└── README.md               # Project documentation
```

## License

MIT 