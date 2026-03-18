const React = require("react")

const createComponent = (tag, baseProps = {}) => {
  const Component = React.forwardRef(({ children, style, ...props }, ref) =>
    React.createElement(tag, { ...baseProps, ...props, style, ref }, children)
  )

  Component.displayName = typeof tag === "string" ? tag : "Component"

  return Component
}

const Fragment = ({ children }) => React.createElement(React.Fragment, null, children)

const Html = createComponent("html")
const Head = createComponent("head")
const Preview = createComponent("div", { style: { display: "none", overflow: "hidden", lineHeight: "1px", opacity: 0, maxHeight: 0, maxWidth: 0 } })
const Body = createComponent("body")
const Container = createComponent("div")
const Section = createComponent("section")
const Text = createComponent("p")
const Row = createComponent("div")
const Column = createComponent("div", { style: { display: "inline-block", verticalAlign: "top" } })
const Img = React.forwardRef(({ alt = "", ...props }, ref) => React.createElement("img", { alt, ...props, ref }))
Img.displayName = "img"
const Hr = createComponent("hr")
const Button = React.forwardRef(({ children, href, style, ...props }, ref) =>
  React.createElement("a", { ...props, href, style, ref }, children)
)
Button.displayName = "a"

module.exports = {
  Body,
  Button,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
}
