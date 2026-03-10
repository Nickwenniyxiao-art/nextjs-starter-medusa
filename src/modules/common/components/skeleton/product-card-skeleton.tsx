import Skeleton from "@modules/common/components/skeleton"

export default function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton variant="rect" className="w-full aspect-[4/5]" />
      <Skeleton variant="text" className="h-4 w-3/4" />
      <Skeleton variant="text" className="h-4 w-1/3" />
    </div>
  )
}
