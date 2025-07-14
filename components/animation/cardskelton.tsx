export default function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl shadow-lg bg-gray-200 animate-pulse w-full h-full">
      <div className="h-48 bg-gray-300 rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-2/3" />
        <div className="h-4 bg-gray-300 rounded w-1/3" />
        <div className="h-6 bg-gray-300 rounded w-1/2" />
        <div className="h-10 bg-gray-300 rounded w-full" />
      </div>
    </div>
  );
}
