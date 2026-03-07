import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const sendNotificationStep = createStep(
  "send-notification",
  async (data: any[], { container }) => {
    const service = container.resolve(Modules.NOTIFICATION)
    const result = await service.createNotifications(data)
    return new StepResponse(result)
  }
)
