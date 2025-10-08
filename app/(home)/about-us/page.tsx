'use client'
import dynamic from 'next/dynamic'

// Dynamically import the component with SSR disabled
const AboutUs = dynamic(() => import('./components/about-us'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    </div>
  ),
})

export default function AboutUsPage() {
  return <AboutUs />
}
