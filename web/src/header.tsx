import { Link } from "@tanstack/react-router"

const links = [
  {
    to: "/",
    label: "Home",
  },
  {
    to: "/brands",
    label: "Brands",
  },
] as const

const activeLinkProps = {
  className: "underline",
} as const

export const Header = () => {
  return (
    <header role="banner" className="flex w-full border-b py-2">
      <h1 className="grow">Macrotest thing</h1>
      <nav role="navigation">
        <ul className="flex gap-4">
          {links.map((link) => (
            <li key={link.to}>
              <Link to={link.to} activeProps={activeLinkProps}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
