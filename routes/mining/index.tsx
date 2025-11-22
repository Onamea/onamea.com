import Mining from "../../islands/Mining.tsx"
import { define } from "../../utils.ts"

export default define.page((props) => {

  const name = props.url.searchParams.get("name") ?? undefined

  return (
    <div class="main px-4 py-8 gradient min-h-screen">
      <div class="center">
        <Mining name={ name } />
      </div>
    </div>
  )
})
