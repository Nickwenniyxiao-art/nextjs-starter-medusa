"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { getLocalizedVariantTitle } from "@lib/util/get-localized-product"
import { useLocale, useTranslations } from "next-intl"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  const t = useTranslations("product")
  const locale = useLocale()

  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis"
    >
      {t("variantLabel")}: {getLocalizedVariantTitle(variant, locale)}
    </Text>
  )
}

export default LineItemOptions
