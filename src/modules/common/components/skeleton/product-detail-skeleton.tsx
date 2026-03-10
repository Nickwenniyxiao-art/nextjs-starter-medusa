import Skeleton from "@modules/common/components/skeleton"

export default function ProductDetailSkeleton() {
  return (
    <div className="content-container py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton variant="rect" className="w-full aspect-square" />
      <div className="space-y-4">
        <Skeleton variant="text" className="h-8 w-2/3" />
        <Skeleton variant="text" className="h-6 w-1/4" />
        <div className="space-y-2 pt-2">
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-[90%]" />
          <Skeleton variant="text" className="h-4 w-[70%]" />
        </div>
        <Skeleton variant="rect" className="h-11 w-full sm:w-56" />
      </div>
    </div>
  )
}
