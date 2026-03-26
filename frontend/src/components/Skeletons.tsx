/**
 * Skeleton loader component for loading states
 */
export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
  );
}

/**
 * Skeleton for a stat card
 */
export function StatsCardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <SkeletonLoader className="h-3 w-24 mb-3" />
      <SkeletonLoader className="h-8 w-16" />
    </div>
  );
}

/**
 * Skeleton for incident list item
 */
export function IncidentItemSkeleton() {
  return (
    <div className="p-3 rounded-lg border border-gray-200 bg-white">
      <div className="mb-3">
        <SkeletonLoader className="h-5 w-3/4 mb-2" />
      </div>
      <div className="flex gap-2 mb-2">
        <SkeletonLoader className="h-6 w-16" />
        <SkeletonLoader className="h-6 w-16" />
      </div>
      <SkeletonLoader className="h-4 w-32" />
    </div>
  );
}

/**
 * Skeleton for detail panel
 */
export function DetailPanelSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 p-6">
        <SkeletonLoader className="h-6 w-2/3 mb-3" />
        <div className="flex gap-2">
          <SkeletonLoader className="h-6 w-20" />
          <SkeletonLoader className="h-6 w-20" />
        </div>
      </div>
      <div className="flex-1 p-6 space-y-6">
        <div>
          <SkeletonLoader className="h-5 w-24 mb-2" />
          <SkeletonLoader className="h-12 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SkeletonLoader className="h-16" />
          <SkeletonLoader className="h-16" />
        </div>
      </div>
    </div>
  );
}
