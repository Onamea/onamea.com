import { define } from "../utils.ts"
import LatestNames from "../islands/LatestNames.tsx"
import GenerateNameForm from "../islands/GenerateNameForm.tsx"
import SearchForm from "../islands/SearchForm.tsx"
import About from "../islands/About.tsx"

export default define.page(function Home() {
  return (
    <div class="main px-4 py-8 gradient min-h-screen">
      <div class="center">
        <h1>Vanice</h1>
        <h2>Decentralized Naming</h2>
        <LatestNames />
        <SearchForm />
        <GenerateNameForm />
        <About />
      </div>
    </div>
  )
})
