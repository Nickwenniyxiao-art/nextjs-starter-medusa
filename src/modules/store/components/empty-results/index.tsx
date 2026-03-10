import { getTranslations } from "next-intl/server"

export default async function EmptyResults({ query }: { query?: string }) {
  const t = await getTranslations("store")
  return <div className="py-16 text-center" data-testid="empty-results"><div className="text-4xl mb-4">🔍</div><h2 className="text-xl font-heading text-[#2C3E2D] mb-2">{query ? t("noResultsForQuery", { query }) : t("noProducts")}</h2><p className="text-[#2C3E2D]/60 mb-8">{t("emptyResultsHint")}</p></div>
}
