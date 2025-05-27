import React from "react";
import { Link } from "react-router-dom";

export const Unauthorized: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <h1 className="mb-4 text-2xl font-bold">Unauthorized Access</h1>
        <p className="mb-8 text-gray-600">
          Sorry, you don't have permission to access this page.
        </p>
        <Link
          to="/home"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};
