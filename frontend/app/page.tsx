"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { format } from "date-fns";
import Pagination from "@/components/Pagination";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
}

interface PaginatedResponse {
  items: Post[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PaginatedResponse>(
          "http://localhost:5000/api/posts",
          {
            params: {
              page: currentPage,
              per_page: 6,
              search: debouncedSearchQuery,
            },
          }
        );

        setPosts(response.data.items);
        setTotalPages(response.data.pages);
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, debouncedSearchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Latest Blog Posts</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            className="form-input pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No posts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {debouncedSearchQuery
              ? `No results found for "${debouncedSearchQuery}"`
              : "There are no blog posts yet."}
          </p>
          <div className="mt-6">
            <Link href="/posts/create" className="btn btn-primary">
              Create your first post
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="card hover:shadow-lg transition-shadow"
              >
                {post.featured_image && (
                  <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-md">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="object-cover w-full h-48"
                    />
                  </div>
                )}
                <h2 className="text-xl font-semibold mb-2">
                  <Link
                    href={`/posts/${post.id}`}
                    className="hover:text-primary-700 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {post.created_at
                      ? format(new Date(post.created_at), "MMM d, yyyy")
                      : ""}
                  </span>
                  <Link
                    href={`/posts/${post.id}`}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
