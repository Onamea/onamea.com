import type { ComponentChildren, FunctionComponent } from "preact"

type Props = {
  children: ComponentChildren
}

const PageLayout: FunctionComponent<Props> = ({ children }) => {
  return (
    <main class="main px-4 min-h-screen">
      <div class="center">{children}</div>
    </main>
  )
}

export default PageLayout
