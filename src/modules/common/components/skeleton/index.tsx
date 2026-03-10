import { CSSProperties } from "react"

type SkeletonProps = {
  width?: number | string
  height?: number | string
  className?: string
  variant?: "text" | "rect" | "circle"
}

const variantClassMap: Record<NonNullable<SkeletonProps["variant"]>, string> = {
  text: "rounded",
  rect: "rounded-lg",
  circle: "rounded-full",
}

export default function Skeleton({
  width,
  height,
  className = "",
  variant = "rect",
}: SkeletonProps) {
  const style: CSSProperties = {
    width,
    height,
  }

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${variantClassMap[variant]} ${className}`}
      style={style}
    />
  )
}
