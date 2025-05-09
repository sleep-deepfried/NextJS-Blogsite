"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";

interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  published: boolean;
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormData>();

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/posts/${params.id}`
        );

        // Reset form with post data
        reset({
          title: response.data.title,
          content: response.data.content,
          excerpt: response.data.excerpt || "",
          featured_image: response.data.featured_image || "",
          published: response.data.published,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(
          "Failed to load post. It may have been deleted or does not exist."
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id, reset]);

  const onSubmit = async (data: PostFormData) => {
    try {
      setSubmitting(true);
      setError(null);

      await axios.put(`http://localhost:5000/api/posts/${params.id}`, data);

      // Redirect to post detail page after successful update
      router.push(`/posts/${params.id}`);
    } catch (err: any) {
      console.error("Error updating post:", err);

      if (err.response?.data?.errors) {
        // Format validation errors
        const validationErrors = err.response.data.errors;
        const errorMessages = Object.entries(validationErrors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
          .join("; ");

        setError(`Validation failed: ${errorMessages}`);
      } else {
        setError("Failed to update post. Please try again later.");
      }

      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !submitting) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <h1 className="text-xl font-medium text-red-700">Error</h1>
        <p className="text-red-700">{error}</p>
        <Link href="/" className="mt-4 inline-block btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/posts/${params.id}`}
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
          Back to Post
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

      {error && submitting && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="form-label">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            className={`form-input ${errors.title ? "border-red-500" : ""}`}
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
              maxLength: {
                value: 255,
                message: "Title must be at most 255 characters",
              },
            })}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="excerpt" className="form-label">
            Excerpt
          </label>
          <input
            id="excerpt"
            type="text"
            className={`form-input ${errors.excerpt ? "border-red-500" : ""}`}
            {...register("excerpt", {
              maxLength: {
                value: 300,
                message: "Excerpt must be at most 300 characters",
              },
            })}
          />
          {errors.excerpt && (
            <p className="mt-1 text-sm text-red-600">
              {errors.excerpt.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            A short description of your post that will be shown in the list view
          </p>
        </div>

        <div>
          <label htmlFor="featured_image" className="form-label">
            Featured Image URL
          </label>
          <input
            id="featured_image"
            type="text"
            className={`form-input ${
              errors.featured_image ? "border-red-500" : ""
            }`}
            {...register("featured_image")}
          />
          {errors.featured_image && (
            <p className="mt-1 text-sm text-red-600">
              {errors.featured_image.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="form-label">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            rows={12}
            className={`form-input ${errors.content ? "border-red-500" : ""}`}
            {...register("content", {
              required: "Content is required",
              minLength: {
                value: 10,
                message: "Content must be at least 10 characters",
              },
            })}
          ></textarea>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Supports Markdown formatting
          </p>
        </div>

        <div className="flex items-center">
          <input
            id="published"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            {...register("published")}
          />
          <label
            htmlFor="published"
            className="ml-2 block text-sm text-gray-900"
          >
            Published
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <Link href={`/posts/${params.id}`} className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
