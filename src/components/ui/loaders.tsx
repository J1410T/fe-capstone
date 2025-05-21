import React, { useState, useEffect } from "react";
import { Trefoil } from "ldrs/react";
import "ldrs/react/Trefoil.css";

// Fun loading messages
const loadingMessages = [
  "Brewing some science...",
  "Calculating research impact...",
  "Gathering brilliant minds...",
  "Connecting researchers...",
  "Analyzing data points...",
  "Preparing your dashboard...",
  "Loading scientific wonders...",
  "Quantifying research quality...",
  "Synthesizing information...",
  "Accelerating innovation...",
];

/**
 * General loading component with Trefoil animation and fun messages
 */
export const Loading: React.FC<{ className?: string }> = ({ className }) => {
  const [message, setMessage] = useState(loadingMessages[0]);

  // Cycle through messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      setMessage(loadingMessages[randomIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <Trefoil
        size="40"
        stroke="4"
        strokeLength="0.15"
        bgOpacity="0.1"
        speed="1.4"
        color="#047857" // emerald-700
      />
      <p className="text-sm text-gray-600 animate-pulse">{message}</p>
    </div>
  );
};

/**
 * Upload loading component with Trefoil animation
 */
export const UploadLoading: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
    >
      <Trefoil
        size="45"
        stroke="4"
        strokeLength="0.15"
        bgOpacity="0.1"
        speed="1.4"
        color="#047857" // emerald-700
      />
      <p className="text-sm text-gray-600">Uploading your files...</p>
    </div>
  );
};

/**
 * Full page loading overlay with Trefoil animation and fun messages
 */
export const PageLoading: React.FC = () => {
  const [message, setMessage] = useState(loadingMessages[0]);

  // Cycle through messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      setMessage(loadingMessages[randomIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90">
      <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-lg shadow-lg bg-white">
        <Trefoil
          size="80"
          stroke="4"
          strokeLength="0.15"
          bgOpacity="0.1"
          speed="1.4"
          color="#047857" // emerald-700
        />
        <p className="text-lg font-medium text-gray-800 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

/**
 * Button loading state using Trefoil
 */
export const ButtonLoading: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <Trefoil
      size="24"
      stroke="4"
      strokeLength="0.15"
      bgOpacity="0.1"
      speed="1.4"
      color="currentColor"
      className={className}
    />
  );
};
