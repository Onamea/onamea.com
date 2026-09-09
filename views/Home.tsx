import About from "../components/About.tsx"
import LatestNames from "../components/LatestNames.tsx"
import MiningForm from "../components/MiningForm.tsx"
import PageLayout from "../components/PageLayout.tsx"

function Home() {
  return (
    <PageLayout>
      <h1>Onamea</h1>
      <h2>Decentralized Naming</h2>
      <LatestNames />
      <MiningForm />
      <About />
    </PageLayout>
  )
}

export default Home
