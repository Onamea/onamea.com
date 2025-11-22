import { define } from "../utils.ts"
import LatestNames from "../islands/LatestNames.tsx"
import MiningForm from "../islands/MiningForm.tsx"
import About from "../islands/About.tsx"

export default define.page(() => {
  return (
    <div class="main px-4 py-8 gradient min-h-screen">
      <div class="center">
        <h1>Vanice</h1>
        <h2>Decentralized Naming</h2>
        <LatestNames />
        <MiningForm />
        <About />
      </div>
    </div>
  )
})
