"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import { useTranslations } from "next-intl"

export type SortOptions = "recommended" | "price_asc" | "price_desc" | "created_at" | "name_asc"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const t = useTranslations("store")

  const sortOptions = [
    {
      value: "recommended" as const,
      label: t("recommended"),
    },
    {
      value: "created_at" as const,
      label: t("latestArrivals"),
    },
    {
      value: "price_asc" as const,
      label: t("priceLowToHigh"),
    },
    {
      value: "price_desc" as const,
      label: t("priceHighToLow"),
    },
    {
      value: "name_asc" as const,
      label: t("nameAZ"),
    },
  ]

  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <FilterRadioGroup
      title={t("sortBy")}
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts
