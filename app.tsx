import { render } from "preact"
import { useState } from "preact/hooks"
import Router, { Route } from "preact-router"
import Header from "./components/Header.tsx"
import "./assets/styles.css"
import Home from "./views/Home.tsx"
import Identify from "./views/Identify.tsx"
import Identity from "./views/Identity.tsx"
import Me from "./views/Me.tsx"
import Mining from "./views/Mining.tsx"
import NotFound from "./views/NotFound.tsx"

function App() {
  const [pathname, setPathname] = useState(globalThis.location.pathname)

  return (
    <>
      <Header showHome={pathname !== "/"} />
      <Router
        onChange={({ url }) => {
          setPathname(new URL(url, globalThis.location.origin).pathname)
        }}
      >
        <Route path="/" component={Home} />
        <Route path="/identify" component={Identify} />
        <Route path="/identity/:id" component={Identity} />
        <Route path="/me" component={Me} />
        <Route path="/mining" component={Mining} />
        <Route default component={NotFound} />
      </Router>
    </>
  )
}

render(<App />, document.getElementById("app")!)
