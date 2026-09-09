import { type FunctionComponent } from "preact"
import HomeButton from "./HomeButton.tsx"
import ProfileButton from "./ProfileButton.tsx"

const headerStyle = {
  borderBottom: "1px solid black"
}

const divStyle = {
  display: "flex",
  justifyContent: "space-between"
}

const Header: FunctionComponent<{ showHome: boolean }> = ({ showHome }) => {
  return (
    <header style={headerStyle}>
      <div class="px-4 py-8">
        <div class="center" style={divStyle}>
          <span>{showHome && <HomeButton />}</span>
          <ProfileButton />
        </div>
      </div>
    </header>
  )
}

export default Header
