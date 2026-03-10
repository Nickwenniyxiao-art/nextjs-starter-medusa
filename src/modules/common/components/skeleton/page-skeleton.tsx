import Skeleton from "@modules/common/components/skeleton"

export default function PageSkeleton() {
  return (
    <div className="content-container py-8 space-y-6">
      <Skeleton variant="rect" className="h-10 w-1/2" />
      <div className="space-y-4">
        <Skeleton variant="rect" className="h-24 w-full" />
        <Skeleton variant="rect" className="h-24 w-full" />
        <Skeleton variant="rect" className="h-24 w-full" />
      </div>
    </div>
  )
}
