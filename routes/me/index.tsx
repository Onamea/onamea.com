import { define } from "../../utils.ts"
import Me from "../../islands/Me.tsx";

export default define.page(() => {

  return (
    <div class="main px-4 py-8 gradient min-h-screen">
      <div class="center">
        <Me />
      </div>
    </div>
  )
})
