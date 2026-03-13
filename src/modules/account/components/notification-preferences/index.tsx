import { updateNotificationPreferences } from "@lib/data/customer"
import { getTranslations } from "next-intl/server"

export default async function NotificationPreferences({
  preferences,
}: {
  preferences: { order_updates: boolean; promotions: boolean; newsletter: boolean }
}) {
  const t = await getTranslations("account")

  return (
    <form action={updateNotificationPreferences} className="space-y-4">
      <h2 className="text-xl font-semibold font-heading">{t("notificationPreferences")}</h2>
      <div className="space-y-3 rounded-xl border border-grey-20 p-4">
        <label className="flex items-center justify-between">
          <span>{t("notifyOrderUpdates")}</span>
          <input type="checkbox" name="order_updates" defaultChecked={preferences.order_updates} />
        </label>
        <label className="flex items-center justify-between">
          <span>{t("notifyPromotions")}</span>
          <input type="checkbox" name="promotions" defaultChecked={preferences.promotions} />
        </label>
        <label className="flex items-center justify-between">
          <span>{t("notifyNewsletter")}</span>
          <input type="checkbox" name="newsletter" defaultChecked={preferences.newsletter} />
        </label>
      </div>
      <button type="submit" className="rounded bg-[#2C3E2D] px-4 py-2 text-white">{t("savePreferences")}</button>
    </form>
  )
}
