import ProductCardSkeleton from "@modules/common/components/skeleton/product-card-skeleton"

export default function Loading() {
  return (
    <div className="content-container py-8 grid grid-cols-2 small:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
