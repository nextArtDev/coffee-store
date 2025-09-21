'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
// Make sure the color helpers are imported or defined above
// import { getGradientColor } from '@/lib/utils'

interface ProgressProps {
  /** The progress percentage (0-100) */
  progress: number
  /** The direction of the progress bar */
  direction?: 'horizontal' | 'vertical'
  /** An array of hex colors to create a gradient. E.g., ['#ff0000', '#00ff00'] */
  gradientColors?: string[]
}

export default function Progress({
  progress,
  direction = 'horizontal',
  gradientColors, // Default gradient is now handled implicitly
}: ProgressProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [shouldUseValue, setShouldUseValue] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isVertical = direction === 'vertical'

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      })
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => setShouldUseValue(true), 250)
    return () => clearTimeout(timeout)
  }, [])

  const barSize = 2
  const gap = 2
  const bars = isVertical
    ? Math.floor(dimensions.height / (barSize + gap))
    : Math.floor(dimensions.width / (barSize + gap))

  return (
    <div
      ref={containerRef}
      className={cn('relative flex flex-wrap gap-[2px] overflow-hidden', {
        'h-[12px] w-full min-w-4': !isVertical,
        'flex-col-reverse h-full min-h-4 w-[12px]': isVertical,
      })}
    >
      {Array.from({ length: bars }).map((_, index) => {
        const highlight = shouldUseValue ? index / bars < progress / 100 : false
        const useGradient =
          highlight && gradientColors && gradientColors.length > 0

        // Calculate the inline style for the bar
        const barStyle: React.CSSProperties = {
          transitionDelay: highlight ? `${index * 24}ms` : '0ms',
        }

        if (useGradient) {
          // Calculate the bar's position as a fraction (0 to 1)
          const fraction = bars > 1 ? index / (bars - 1) : 0
          barStyle.backgroundColor = getGradientColor(gradientColors, fraction)
        }

        return (
          <div
            key={`bar_${index}`}
            style={barStyle}
            className={cn(
              'rounded-[1px] transition-all',
              {
                'h-full w-[2px]': !isVertical,
                'h-[2px] w-full': isVertical,
              },
              {
                // Fallback color if no gradient is provided
                'bg-blue-100 duration-75': highlight && !useGradient,
                'bg-zinc-900/30 duration-300': !highlight,
              }
            )}
          />
        )
      })}
    </div>
  )
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Interpolates a color from a gradient array based on a fraction.
 * @param colors An array of hex color strings defining the gradient.
 * @param fraction A number between 0 and 1 representing the position in the gradient.
 * @returns An `rgb(r, g, b)` color string.
 */
const getGradientColor = (colors: string[], fraction: number): string => {
  if (!colors || colors.length === 0) return 'rgb(0,0,0)'
  if (colors.length === 1) return colors[0]

  const clampedFraction = Math.max(0, Math.min(1, fraction))
  const segment = (colors.length - 1) * clampedFraction
  const startIndex = Math.floor(segment)
  const endIndex = Math.min(startIndex + 1, colors.length - 1)

  const segmentFraction = segment - startIndex

  const startRgb = hexToRgb(colors[startIndex])
  const endRgb = hexToRgb(colors[endIndex])

  if (!startRgb || !endRgb) return 'rgb(0,0,0)'

  const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * segmentFraction)
  const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * segmentFraction)
  const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * segmentFraction)

  return `rgb(${r},${g},${b})`
}
