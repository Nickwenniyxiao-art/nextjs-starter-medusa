import { Checkbox, Label } from "@medusajs/ui"
import React from "react"

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
  name?: string
  "data-testid"?: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  name,
  "data-testid": dataTestId,
}) => {
  const id = name ? `checkbox-${name}` : "checkbox"

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={onChange}
      role="checkbox"
      aria-checked={checked}
      data-testid={dataTestId}
    >
      <Checkbox
        className="text-base-regular flex items-center gap-x-2"
        id={id}
        checked={checked}
        aria-checked={checked}
        name={name}
      />
      <Label htmlFor={id} className="!transform-none !txt-medium cursor-pointer" size="large">
        {label}
      </Label>
    </div>
  )
}

export default CheckboxWithLabel
