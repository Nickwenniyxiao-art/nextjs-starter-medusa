import { getTranslations } from "next-intl/server"

import { listCategories } from "@lib/data/categories"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const t = await getTranslations("footer")
  const homeT = await getTranslations("home")
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-forest/10 w-full bg-forest text-warm">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-24">
          <div>
            <LocalizedClientLink
              href="/"
              className="text-xl md:text-2xl font-heading text-warm hover:text-brass transition-colors tracking-wide"
            >
              NordHjem
            </LocalizedClientLink>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-4">
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus text-warm">{t("company")}</span>
              <ul className="grid grid-cols-1 gap-y-2 text-warm/80 txt-small">
                <li>
                  <LocalizedClientLink className="hover:text-brass" href="/about">
                    {t("aboutUs")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink className="hover:text-brass" href="/about">
                    {t("ourStory")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink className="hover:text-brass" href="/account">
                    {t("careers")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink className="hover:text-brass" href="/account">
                    {t("press")}
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus text-warm">{t("support")}</span>
              <ul className="grid grid-cols-1 gap-y-2 text-warm/80 txt-small">
                <li>
                  <LocalizedClientLink className="hover:text-brass" href="/account">
                    {t("contactUs")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink className="hover:text-brass" href="/account">
                    {t("faq")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink className="hover:text-brass" href="/account/orders">
                    {t("shipping")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink className="hover:text-brass" href="/account/orders">
                    {t("returns")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink className="hover:text-brass" href="/account/orders">
                    {t("orderTracking")}
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus text-warm">{t("policies")}</span>
              <ul className="grid grid-cols-1 gap-y-2 text-warm/80 txt-small">
                <li>
                  <LocalizedClientLink className="hover:text-brass" href="/privacy-policy">
                    {t("privacyPolicy")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink className="hover:text-brass" href="/terms-of-service">
                    {t("termsOfService")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink className="hover:text-brass" href="/cookie-policy">
                    {t("cookiePolicy")}
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>

            {productCategories && productCategories.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus text-warm">{homeT("categories")}</span>
                <ul className="grid grid-cols-1 gap-2" data-testid="footer-categories">
                  {productCategories.slice(0, 5).map((c) => {
                    if (c.parent_category) {
                      return null
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li className="flex flex-col gap-2 text-warm/80 txt-small" key={c.id}>
                        <LocalizedClientLink
                          className={clx("hover:text-brass", children && "txt-small-plus")}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children.map((child) => (
                              <li key={child.id}>
                                <LocalizedClientLink
                                  className="hover:text-brass"
                                  href={`/categories/${child.handle}`}
                                  data-testid="category-link"
                                >
                                  {child.name}
                                </LocalizedClientLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full mb-16 justify-between text-warm/70 border-t border-forest-dark/50 pt-6">
          <Text className="txt-compact-small">{t("copyright")}</Text>
        </div>
      </div>
    </footer>
  )
}
