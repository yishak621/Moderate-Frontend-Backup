export default function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-6 md:py-12">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-7 border border-gray-200 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
