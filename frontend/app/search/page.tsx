"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Search for posts
  useEffect(() => {
    if (!searchQuery.trim()) {
      setPosts([]);
      setTotalResults(0);
      setTotalPages(1);
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PaginatedResponse>(
          "http://localhost:5000/api/posts",
          {
            params: {
              page: currentPage,
              per_page: 10,
              search: searchQuery.trim(),
            },
          }
        );

        setPosts(response.data.items);
        setTotalPages(response.data.pages);
        setTotalResults(response.data.total);
        setError(null);
      } catch (err) {
        console.error("Error searching posts:", err);
        setError("Failed to search posts. Please try again later.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchQuery, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);

    // Update URL query params for shareable search
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }

    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Search Posts</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search for posts..."
              className="form-input pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>

      {searchQuery.trim() && (
        <div className="text-sm text-gray-500 mb-4">
          {loading
            ? "Searching..."
            : `Found ${totalResults} result${
                totalResults !== 1 ? "s" : ""
              } for "${searchQuery}"`}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : posts.length === 0 && searchQuery.trim() ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M5.8 21h12.4a2 2 0 002-2V5a2 2 0 00-2-2H5.8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">
            No results found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            We couldn't find any posts matching "{searchQuery}".
          </p>
          <div className="mt-6">
            <Link href="/" className="text-primary-600 hover:text-primary-800">
              Back to Home
            </Link>
          </div>
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {post.featured_image && (
                    <div className="flex-shrink-0">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full md:w-40 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold mb-2">
                      <Link
                        href={`/posts/${post.id}`}
                        className="hover:text-primary-700 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-3">{post.excerpt}</p>
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
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : null}
    </div>
  );
}
