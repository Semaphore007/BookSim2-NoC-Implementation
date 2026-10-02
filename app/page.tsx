import { Hero } from '@/components/hero'
import { FeatureCards, HomeCta, Workflow } from '@/components/home-sections'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <Workflow />
      <HomeCta />
    </>
  )
}
