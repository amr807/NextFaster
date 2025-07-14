export default function FullPageSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Spinner */}
      <div className="flex justify-center py-6">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
          <div className="absolute inset-0 rounded-full border-4 border-gray-300 opacity-20" />
        </div>
      </div>

      {/* Top Promo Bar */}
      <div className="w-full bg-gray-50 animate-pulse flex justify-center py-2">
        <div className="h-4 w-4/5 bg-gray-200 rounded" />
      </div>

      {/* Header: Logo, Search, User/Cart */}
      <div className="flex items-center justify-between p-4 space-x-4 animate-pulse">
        <div className="h-8 w-24 bg-gray-200 rounded" />
        <div className="flex-1 h-10 bg-gray-200 rounded" />
        <div className="flex space-x-3">
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="mx-4 my-4 h-56 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-xl animate-pulse" />

      {/* Feature Icons / Benefits */}
      <div className="flex justify-around items-center px-4 py-6 animate-pulse space-x-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-2">
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
