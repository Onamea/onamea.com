import { FunctionComponent } from 'preact'
import { useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import HomeButton from "../components/HomeButton.tsx"
import ProfileButton from "../components/ProfileButton.tsx"

const headerStyle = {
  borderBottom: "1px solid black"
}

const divStyle = {
  display: "flex",
  justifyContent: "space-between"
}

const Header: FunctionComponent = () => {
  const showHome = useSignal(false)

  useEffect(() => {
    showHome.value = globalThis.location.pathname !== "/"
  }, [])

  return (
    <header style={ headerStyle }>
      <div class="px-4 py-8">
        <div class="center" style={ divStyle }>
          <span>{ showHome.value && <HomeButton /> }</span>
          <ProfileButton />
        </div>
      </div>
    </header>
  )
}

export default Header
