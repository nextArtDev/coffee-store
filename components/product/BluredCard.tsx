import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface BlurredCardProps {
  clearRadius?: number
  blurIntensity?: number
  children: React.ReactNode
  className?: string
}

export function BlurredCardWithClearCenter({
  clearRadius = 100,
  blurIntensity = 8,
  children,
  className,
}: BlurredCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden p-0',
        `backdrop-blur-${blurIntensity} bg-white/10`,
        className
      )}
      style={{
        mask: `radial-gradient(circle at center, black ${clearRadius}px, transparent ${clearRadius}px)`,
        WebkitMask: `radial-gradient(circle at center, black ${clearRadius}px, transparent ${clearRadius}px)`,
      }}
    >
      <CardContent className="p-6 relative">{children}</CardContent>
    </Card>
  )
}

// // Usage:
// ;<BlurredCardWithClearCenter clearRadius={120} blurIntensity={12}>
//   <p>Customizable clear center radius</p>
// </BlurredCardWithClearCenter>
