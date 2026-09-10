import { useState } from 'react'
import Hero from '../components/home/Hero'
import QuickView from '../components/shop/QuickView'
import {
  Collections,
  CtaBand,
  Editorial,
  Featured,
  JournalPreview,
  Lookbook,
  Testimonials,
  ValueBar,
} from '../components/home/Sections'

export default function Home() {
  const [quick, setQuick] = useState(null)

  return (
    <>
      <Hero />
      <ValueBar />
      <Collections />
      <Featured onQuickView={setQuick} />
      <Editorial />
      <Lookbook />
      <Testimonials />
      <JournalPreview />
      <CtaBand />
      <QuickView product={quick} onClose={() => setQuick(null)} />
    </>
  )
}
