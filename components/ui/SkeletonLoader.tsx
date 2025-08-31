import Card from "./Card";

interface SkeletonLoaderProps {
  type: "tour" | "booking" | "list";
  count?: number;
}

export default function SkeletonLoader({
  type,
  count = 1,
}: SkeletonLoaderProps) {
  if (type === "tour") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
          </Card>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </Card>
        </div>

        {/* Right column skeleton */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Add other skeleton types...
  return null;
}
