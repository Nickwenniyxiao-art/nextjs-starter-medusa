"use client"

import React from "react"

interface CrispTriggerLinkProps {
  children: React.ReactNode
  className?: string
}

const CrispTriggerLink: React.FC<CrispTriggerLinkProps> = ({ children, className }) => {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.$crisp) {
      window.$crisp.push(["do", "chat:open"])
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}

export default CrispTriggerLink
