"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export interface ReturnReason {
  id: string
  value: string
  label: string
  description?: string
  created_at: string
  updated_at: string
}

export interface ReturnShippingOption {
  id: string
  name: string
  amount: number
  price_type: string
  provider_id: string
}

export interface CreateReturnItem {
  id: string
  quantity: number
  reason_id?: string
  note?: string
}

export interface CreateReturnPayload {
  order_id: string
  items: CreateReturnItem[]
  return_shipping: {
    option_id: string
  }
  location_id?: string
  note?: string
}

export async function listReturnReasons(): Promise<ReturnReason[]> {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("returns")),
  }

  try {
    const response = await sdk.client.fetch<{
      return_reasons: ReturnReason[]
    }>("/store/return-reasons", {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })

    return response.return_reasons
  } catch {
    return []
  }
}

export async function listReturnShippingOptions(
  cartId: string
): Promise<ReturnShippingOption[]> {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  try {
    const response = await sdk.client.fetch<{
      shipping_options: ReturnShippingOption[]
    }>("/store/shipping-options", {
      method: "GET",
      query: {
        cart_id: cartId,
        is_return: true,
      },
      headers,
      next,
      cache: "force-cache",
    })

    return response.shipping_options
  } catch {
    return []
  }
}

export async function createReturnRequest(
  payload: CreateReturnPayload
): Promise<{ success: boolean; error: string | null }> {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await sdk.client.fetch("/store/returns", {
      method: "POST",
      body: payload,
      headers,
    })

    return { success: true, error: null }
  } catch (err: any) {
    const status = err?.status || err?.response?.status
    const message = err?.message || ""

    if (status === 404 || message.includes("Not Found")) {
      return {
        success: false,
        error: "RETURN_API_UNAVAILABLE",
      }
    }

    return {
      success: false,
      error: message || "RETURN_REQUEST_FAILED",
    }
  }
}
