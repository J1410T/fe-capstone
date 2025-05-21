import { useRouteError } from 'react-router-dom';

/**
 * Error boundary page for handling route errors
 */
export default function ErrorBoundaryPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <h1 className="mb-4 text-2xl font-bold">Oops!</h1>
        <p className="mb-8 text-gray-600">Sorry, an unexpected error has occurred.</p>
        <p className="text-sm text-gray-500">
          {(error as Error)?.message || 'Unknown error'}
        </p>
      </div>
    </div>
  );
}
