// components/ErrorBoundary.tsx
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-800 rounded">
      <h2 className="text-lg font-bold">Something went wrong.</h2>
      <pre className="whitespace-pre-wrap">{error.message}</pre>
    </div>
  );
}

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("Caught by error boundary:", error, info);
        // Optionally log to Sentry or another service here
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
