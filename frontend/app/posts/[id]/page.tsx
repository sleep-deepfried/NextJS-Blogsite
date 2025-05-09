"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
  updated_at: string;
}

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/posts/${params.id}`
        );
        setPost(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(
          "Failed to load post. It may have been deleted or does not exist."
        );
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/posts/${params.id}`);
      router.push("/");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <h1 className="text-xl font-medium text-red-700">Error</h1>
        <p className="text-red-700">{error || "Post not found"}</p>
        <Link href="/" className="mt-4 inline-block btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="text-primary-600 hover:text-primary-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Posts
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
          <div>
            <time dateTime={post.created_at}>
              Published: {format(new Date(post.created_at), "MMMM d, yyyy")}
            </time>
            {post.updated_at && post.updated_at !== post.created_at && (
              <time dateTime={post.updated_at} className="ml-4">
                Updated: {format(new Date(post.updated_at), "MMMM d, yyyy")}
              </time>
            )}
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/posts/${post.id}/edit`}
              className="text-primary-600 hover:text-primary-800"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      </header>

      {post.featured_image && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full object-cover h-[400px]"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
