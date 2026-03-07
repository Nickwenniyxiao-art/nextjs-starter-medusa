import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import type React from "react"
import { Resend } from "resend"

type ResendOptions = {
  api_key: string
  from: string
}

type TemplateRenderer = (props: any) => React.ReactNode

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "notification-resend"

  private resendClient: Resend
  private options: ResendOptions
  private logger: Logger
  private templateMap: Record<string, TemplateRenderer> = {}
  private subjectMap: Record<string, Record<string, string>> = {}

  constructor({ logger }: { logger: Logger }, options: ResendOptions) {
    super()
    this.resendClient = new Resend(options.api_key)
    this.options = options
    this.logger = logger
  }

  static validateOptions(options: Record<any, any>) {
    if (!options.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Option `api_key` is required for Resend provider."
      )
    }
    if (!options.from) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Option `from` is required for Resend provider."
      )
    }
  }

  registerTemplate(
    name: string,
    renderer: TemplateRenderer,
    subjects: Record<string, string>
  ) {
    this.templateMap[name] = renderer
    this.subjectMap[name] = subjects
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const template = this.templateMap[notification.template]

    if (!template) {
      this.logger.error(`[Resend] Template not found: ${notification.template}`)
      return {}
    }

    const locale = (notification.data as any)?.locale || "en"
    const subject =
      this.subjectMap[notification.template]?.[locale] ||
      this.subjectMap[notification.template]?.en ||
      "NordHjem Notification"

    try {
      const { data, error } = await this.resendClient.emails.send({
        from: this.options.from,
        to: [notification.to],
        subject,
        react: template({ ...notification.data, locale }),
      })

      if (error) {
        this.logger.error("[Resend] Failed to send email", error as any)
        return {}
      }

      this.logger.info(
        `[Resend] Email sent: ${notification.template} → ${notification.to} (id: ${data?.id})`
      )
      return { id: data?.id }
    } catch (err) {
      this.logger.error("[Resend] Send exception", err as any)
      return {}
    }
  }
}

export default ResendNotificationProviderService
