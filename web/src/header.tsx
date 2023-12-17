import { Link } from "react-router-dom"
export const Header = () => {
  return (
    <header role="banner" className="flex w-full border-b py-2">
      <h1 className="grow">Macrotest thing</h1>
      <nav role="navigation">
        <ul className="flex gap-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/brands">Brands</Link>
          </li>
          <li>
            <Link to="/foods">Foods</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
