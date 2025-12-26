import Identify from "../../islands/Identify.tsx"
import { define } from "../../utils.ts"

export default define.page(() => {

  return (
    <div class="main px-4 py-8 gradient min-h-screen">
      <div class="center">
        <Identify />
      </div>
    </div>
  )
})

