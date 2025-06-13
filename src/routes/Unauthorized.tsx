import React from "react";
import { Link } from "react-router-dom";

export const Unauthorized: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center  p-4">
      <div className="w-full max-w-md rounded-lg p-6  text-center">
        <div className="flex justify-center mb-4">
          <svg
            viewBox="0 0 112 112"
            width="96"
            height="96"
            className="text-primary"
          >
            <defs>
              <clipPath id="a">
                <path
                  fill="none"
                  d="M100.31 101.1H39.45V12.8h40.78l20.08 21.03v67.27z"
                ></path>
              </clipPath>
            </defs>
            <path
              d="M38.54 39.69h1.82a11.78 11.78 0 0 1 11.78 11.78v13.6H26.77v-13.6a11.78 11.78 0 0 1 11.77-11.78z"
              strokeMiterlimit="10"
              strokeWidth="9.48"
              stroke="#bcc0c4"
              fill="none"
            ></path>
            <g clipPath="url(#a)">
              <path
                fill="#90c3ff"
                d="M100.31 101.1H39.45V12.8h40.78l20.08 21.03v67.27z"
              ></path>
              <path
                d="M80.28 10.59h23.26v23.26H87.32a7 7 0 0 1-7-7V10.59h-.04z"
                fill="#1876f2"
              ></path>
              <path
                d="M38.54 39.69h1.82a11.78 11.78 0 0 1 11.78 11.78v13.6H26.77v-13.6a11.78 11.78 0 0 1 11.77-11.78z"
                stroke="#fff"
                strokeMiterlimit="10"
                strokeWidth="9.48"
                fill="none"
              ></path>
            </g>
            <rect
              x="10.54"
              y="58.29"
              width="57.83"
              height="42.76"
              rx="4.41"
              fill="#7a7d81"
            ></rect>
            <circle cx="39.45" cy="75.25" r="6.3"></circle>
            <path d="M36.62 73.73h5.67v12.48a2.63 2.63 0 0 1-2.63 2.63h-.41a2.63 2.63 0 0 1-2.63-2.63V73.73z"></path>
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Unauthorized Access
        </h1>
        <p className="mb-6 text-gray-600">
          Sorry, you don't have permission to access this page.
        </p>
        <Link
          to="/home"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};
