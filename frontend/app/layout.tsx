import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blogsite",
  description: "A modern blog application built with NextJS and Flask",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex">
                  <a href="/" className="flex-shrink-0 flex items-center">
                    <span className="text-2xl font-bold text-yellow-500">
                      NuWorks Blogsite
                    </span>
                  </a>
                  <nav className="ml-6 flex space-x-4">
                    <a
                      href="/"
                      className="px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Home
                    </a>
                    <a
                      href="/posts/create"
                      className="px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Create Post
                    </a>
                  </nav>
                </div>
                <div className="flex items-center">
                  <a
                    href="/search"
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
