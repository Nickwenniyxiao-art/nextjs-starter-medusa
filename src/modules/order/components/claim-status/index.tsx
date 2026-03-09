"use client"

import { convertToLocale } from "@lib/util/money"
import { Badge, Text } from "@medusajs/ui"
import { useTranslations } from "next-intl"

interface ClaimItem {
  id: string
  quantity: number
  reason?: string
  note?: string
}

interface AdditionalItem {
  id: string
  quantity: number
  unit_price: number
  title?: string
  variant_title?: string
}

interface Claim {
  id: string
  display_id: number
  type: "refund" | "replace"
  refund_amount: number | null
  canceled_at: string | null
  claim_items?: ClaimItem[]
  additional_items?: AdditionalItem[]
}

type Props = {
  claims: Claim[]
  currencyCode: string
}

const ClaimStatus = ({ claims, currencyCode }: Props) => {
  const t = useTranslations("claims")

  if (!claims || claims.length === 0) {
    return null
  }

  const openSupport = () => {
    if (typeof window !== "undefined" && (window as any).$crisp) {
      ;(window as any).$crisp.push(["do", "chat:open"])
    }
  }

  return (
    <div className="flex flex-col gap-y-3">
      <Text className="txt-medium-plus">
        {t.has("statusTitle") ? t("statusTitle") : "Claims"}
      </Text>

      {claims.map((claim) => {
        const status = claim.canceled_at ? "canceled" : "active"
        return (
          <div
            key={claim.id}
            className="rounded-lg border border-ui-border-base p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <Text className="txt-compact-medium">
                  {t.has("claimLabel") ? t("claimLabel") : "Claim"} #
                  {claim.display_id}
                </Text>
                <Badge color={claim.type === "refund" ? "blue" : "purple"}>
                  {t.has(`type.${claim.type}`)
                    ? t(`type.${claim.type}`)
                    : claim.type}
                </Badge>
              </div>
              <Badge color={status === "canceled" ? "red" : "orange"}>
                {t.has(`status.${status}`) ? t(`status.${status}`) : status}
              </Badge>
            </div>

            {!claim.canceled_at && (
              <Text className="mb-2 text-sm text-ui-fg-subtle">
                {t("claimProgress")}: Active → Completed
              </Text>
            )}

            {claim.refund_amount != null && claim.refund_amount > 0 && (
              <div className="mb-2 rounded border border-ui-border-base p-2">
                <Text className="text-sm font-semibold">
                  {t.has("refundAmount") ? t("refundAmount") : "Refund amount"}:{" "}
                  {convertToLocale({
                    amount: claim.refund_amount,
                    currency_code: currencyCode,
                  })}
                </Text>
              </div>
            )}

            {claim.claim_items && claim.claim_items.length > 0 && (
              <div className="mt-2 space-y-1">
                {claim.claim_items.map((item) => (
                  <div key={item.id} className="text-sm text-ui-fg-subtle">
                    <Text>Qty: {item.quantity}</Text>
                    {item.reason && (
                      <Text>
                        {t("claimReason")}: {item.reason}
                      </Text>
                    )}
                    {item.note && (
                      <Text>
                        {t("claimNote")}: {item.note}
                      </Text>
                    )}
                  </div>
                ))}
              </div>
            )}

            {claim.type === "replace" &&
              claim.additional_items &&
              claim.additional_items.length > 0 && (
                <div className="mt-2 space-y-1">
                  <Text className="text-xs font-medium text-ui-fg-muted">
                    {t.has("replacementItems")
                      ? t("replacementItems")
                      : "Replacement items"}
                  </Text>
                  {claim.additional_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-ui-fg-subtle"
                    >
                      <Text className="text-sm">
                        {item.title || item.variant_title || "Item"} ×{" "}
                        {item.quantity}
                      </Text>
                      <Text className="text-sm">
                        {convertToLocale({
                          amount: item.unit_price,
                          currency_code: currencyCode,
                        })}
                      </Text>
                    </div>
                  ))}
                </div>
              )}

            {!claim.canceled_at && (
              <button
                type="button"
                onClick={openSupport}
                className="mt-3 text-sm text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                {t("contactSupport")}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ClaimStatus
