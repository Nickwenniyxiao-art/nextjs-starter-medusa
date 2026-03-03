export const getCookieSecureFlag = (): boolean => {
  return process.env.COOKIE_SECURE === "true"
}
