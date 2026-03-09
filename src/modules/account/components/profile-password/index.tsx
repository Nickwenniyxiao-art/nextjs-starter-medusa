"use client"

import React, { useActionState, useEffect } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { toast } from "@medusajs/ui"
import { useTranslations } from "next-intl"
import { updateCustomerPassword } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = () => {
  const [successState, setSuccessState] = React.useState(false)
  const t = useTranslations("account")

  const [state, formAction] = useActionState(updateCustomerPassword, {
    success: false,
    error: null,
    translations: {
      passwordMismatch: t("passwordMismatch"),
      passwordTooShort: t("passwordTooShort"),
      incorrectPassword: t("incorrectPassword"),
      passwordUpdateFailed: t("passwordUpdateFailed"),
    },
  })

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(!!state.success)
    if (state.success) {
      toast.success(t("passwordUpdated"))
    }
  }, [state, t])

  return (
    <form action={formAction} onReset={() => clearState()} className="w-full">
      <AccountInfo
        label={t("passwordLabel")}
        currentInfo={<span>{t("passwordNotShown")}</span>}
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error ?? undefined}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t("oldPassword")}
            name="old_password"
            required
            type="password"
            data-testid="old-password-input"
          />
          <Input
            label={t("newPasswordLabel")}
            type="password"
            name="new_password"
            required
            data-testid="new-password-input"
          />
          <Input
            label={t("confirmPasswordLabel")}
            type="password"
            name="confirm_password"
            required
            data-testid="confirm-password-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
