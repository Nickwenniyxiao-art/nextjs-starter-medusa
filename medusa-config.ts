import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/resend",
            id: "resend",
            options: {
              channels: ["email"],
              api_key: process.env.RESEND_API_KEY,
              from:
                process.env.RESEND_FROM_EMAIL ||
                "NordHjem <noreply@nordhjem.store>",
            },
          },
        ],
      },
    },
  ],
})
