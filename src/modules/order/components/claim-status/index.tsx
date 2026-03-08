"use client"

import { convertToLocale } from "@lib/util/money"
import { Badge, Text } from "@medusajs/ui"
import { useTranslations } from "next-intl"

interface ClaimItem {
  id: string
  item_id: string
  quantity: number
  reason?: string
  note?: string
}

interface AdditionalItem {
  id: string
  item_id: string
  quantity: number
  unit_price: number
  title?: string
  variant_title?: string
  thumbnail?: string
}

interface Claim {
  id: string
  display_id: number
  type: "refund" | "replace"
  order_version: number
  refund_amount: number | null
  canceled_at: string | null
  created_at: string
  claim_items?: ClaimItem[]
  additional_items?: AdditionalItem[]
}

type Props = {
  claims: Claim[]
  currencyCode: string
}

const statusColorMap: Record<
  string,
  "green" | "orange" | "red" | "grey" | "blue" | "purple"
> = {
  active: "orange",
  completed: "green",
  canceled: "red",
}

const typeColorMap: Record<string, "blue" | "purple"> = {
  refund: "blue",
  replace: "purple",
}

function getClaimStatus(claim: Claim): string {
  if (claim.canceled_at) return "canceled"

  return "active"
}

const ClaimStatus = ({ claims, currencyCode }: Props) => {
  const t = useTranslations("claims")

  if (!claims || claims.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-3">
      <Text className="txt-medium-plus">
        {t.has("statusTitle") ? t("statusTitle") : "Claims"}
      </Text>

      {claims.map((claim) => {
        const status = getClaimStatus(claim)

        return (
          <div key={claim.id} className="rounded-lg border border-ui-border-base p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <Text className="txt-compact-medium">
                  {t.has("claimLabel") ? t("claimLabel") : "Claim"} #{claim.display_id}
                </Text>
                <Badge color={typeColorMap[claim.type] || "grey"}>
                  {t.has(`type.${claim.type}`) ? t(`type.${claim.type}`) : claim.type}
                </Badge>
              </div>
              <Badge color={statusColorMap[status] || "grey"}>
                {t.has(`status.${status}`) ? t(`status.${status}`) : status}
              </Badge>
            </div>

            <Text className="mb-2 text-sm text-ui-fg-subtle">
              {t.has("submittedOn") ? t("submittedOn") : "Submitted on"}{" "}
              {new Date(claim.created_at).toLocaleDateString()}
            </Text>

            {claim.claim_items && claim.claim_items.length > 0 && (
              <div className="mt-2 space-y-1">
                <Text className="text-xs font-medium text-ui-fg-muted">
                  {t.has("claimedItems") ? t("claimedItems") : "Claimed items"}
                </Text>
                {claim.claim_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-ui-fg-subtle">
                    <Text className="text-sm">Qty: {item.quantity}</Text>
                    {item.reason && (
                      <Text className="text-sm text-ui-fg-muted">{item.reason}</Text>
                    )}
                  </div>
                ))}
              </div>
            )}

            {claim.additional_items && claim.additional_items.length > 0 && (
              <div className="mt-2 space-y-1">
                <Text className="text-xs font-medium text-ui-fg-muted">
                  {t.has("replacementItems")
                    ? t("replacementItems")
                    : "Replacement items"}
                </Text>
                {claim.additional_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-ui-fg-subtle">
                    <Text className="text-sm">
                      {item.title || item.variant_title || "Item"} × {item.quantity}
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

            {claim.refund_amount != null && claim.refund_amount > 0 && (
              <div className="mt-2 border-t border-ui-border-base pt-2">
                <Text className="text-sm">
                  {t.has("refundAmount") ? t("refundAmount") : "Refund amount"}: {" "}
                  {convertToLocale({
                    amount: claim.refund_amount,
                    currency_code: currencyCode,
                  })}
                </Text>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ClaimStatus
