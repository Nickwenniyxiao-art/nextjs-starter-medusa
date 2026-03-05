import { getBaseURL } from "@lib/util/env"
import CrispChat from "@modules/common/components/crisp-chat"
import { Metadata } from "next"
import "styles/globals.css"
import { DM_Serif_Display, Inter, Noto_Sans_SC } from "next/font/google"

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-en",
  display: "swap",
})

const notoSansSC = Noto_Sans_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-sans-zh",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "NordHjem - Nordic Minimalist Furniture",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      className={`${dmSerif.variable} ${inter.variable} ${notoSansSC.variable}`}
    >
      <body>
        <main className="relative">{props.children}</main>
        <CrispChat />
      </body>
    </html>
  )
}
