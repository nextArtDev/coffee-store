'use client'

import { ReactNode, useEffect, useState, useId } from 'react'
import { cn } from '@/lib/utils'
import { motion, Variants } from 'framer-motion'
interface DonutChartProps {
  /** The size (width and height) of the chart in pixels. */
  size: number
  /** The progress percentage (0-100). */
  progress: number
  /** Tailwind CSS classes for the background track circle. */
  trackClassName?: string
  /** Tailwind CSS classes for the progress circle. Used for color if `gradientColors` is not provided. */
  progressClassName?: string
  /** The width of the background track circle. */
  circleWidth?: number
  /** The width of the progress circle. */
  progressWidth?: number
  /** Whether the progress circle has rounded ends. */
  rounded?: boolean
  /** Optional container class name. */
  className?: string
  /** Content to display in the center of the chart. */
  children?: ReactNode
  /** An array of hex colors to create a gradient for the progress circle. */
  gradientColors?: string[]
}

export default function DonutChart({
  size,
  progress,
  progressClassName = 'text-green-500',
  trackClassName = 'text-black/10 dark:text-white/10',
  circleWidth = 16,
  progressWidth = 16,
  rounded = true,
  className,
  children,
  gradientColors,
}: DonutChartProps) {
  const [shouldUseValue, setShouldUseValue] = useState(false)
  // Generate a unique ID for the gradient to avoid conflicts
  const gradientId = useId()

  useEffect(() => {
    const timeout = setTimeout(() => {
      // This is a hack to force the animation to run for the first time.
      setShouldUseValue(true)
    }, 250)
    return () => clearTimeout(timeout)
  }, [])

  const radius = size / 2 - Math.max(progressWidth, circleWidth) / 2
  const circumference = Math.PI * radius * 2
  const percentage = shouldUseValue
    ? circumference * ((100 - progress) / 100)
    : circumference

  const hasGradient = gradientColors && gradientColors.length > 0

  const drawVariants = {
    hidden: { strokeDashoffset: circumference },
    visible: {
      strokeDashoffset: circumference * ((100 - progress) / 100),
      transition: {
        duration: 1.5,
        // ease: [0, 0, 0.2, 1],
      },
    },
  }

  return (
    <motion.div
      className={cn('relative', className)}
      // 👇 It will animate from "hidden" to "visible" when it enters the viewport
      initial="hidden"
      whileInView="visible"
      // 👇 Configure the trigger: run once, when 50% of the element is visible
      viewport={{ once: true, amount: 0.5 }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Gradient Definition: Only rendered if gradientColors are provided */}
        {hasGradient && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              {gradientColors.map((color, index) => (
                <stop
                  key={index}
                  offset={`${(index / (gradientColors.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          </defs>
        )}

        {/* Background Track Circle */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={`${circleWidth}px`}
          className={cn('duration-500', trackClassName)}
        />

        {/* Progress Circle */}
        <motion.circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          // Apply the gradient if it exists, otherwise fall back to currentColor
          stroke={hasGradient ? `url(#${gradientId})` : 'currentColor'}
          className={cn('duration-500', progressClassName)}
          strokeWidth={`${progressWidth}px`}
          strokeLinecap={rounded ? 'round' : 'butt'}
          fill="transparent"
          strokeDasharray={`${circumference}px`}
          strokeDashoffset={`${percentage}px`}
          variants={drawVariants as Variants}
        />
      </svg>
      {/* Center Content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </motion.div>
  )
}
