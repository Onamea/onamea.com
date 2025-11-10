import { define } from "../../utils.ts"
import Identity from "../../islands/Identity.tsx";

export default define.page((props) => {

  const { nameKey } = props.params

  return (
    <div class="main px-4 py-8 gradient min-h-screen">
      <div class="center">
        <Identity nameKey={ nameKey } />
      </div>
    </div>
  )
})
