'use client'
import React, { ReactNode, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

type SupportedEdgeUnit = 'px' | 'vw' | 'vh' | '%'
type EdgeUnit = `${number}${SupportedEdgeUnit}`
type NamedEdges = 'start' | 'end' | 'center'
type EdgeString = NamedEdges | EdgeUnit | `${number}`
type Edge = EdgeString | number
type ProgressIntersection = [number, number]
type Intersection = `${Edge} ${Edge}`
export type ScrollOffset = Array<Edge | Intersection | ProgressIntersection>

export default function FixedMotionImage({
  imageUrl,
  children,
  offset = ['start end', 'end start'],
  transform = ['-80%', '80%'],
  overlayClassNames = 'bg-black/30',
  className,
}: {
  imageUrl: string
  children: ReactNode
  offset?: ScrollOffset
  transform?: string[]
  overlayClassNames?: string
  className?: string
}) {
  const ref = useRef(null)

  // useScroll listens to the scroll progress of the target element (ref).
  // "start end" means the animation starts when the top of the element hits the bottom of the viewport.
  // "end start" means the animation ends when the bottom of the element hits the top of the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset,
  })

  // useTransform maps the scroll progress (a value from 0 to 1) to a CSS transform.
  // Here, we're moving the background image vertically from -20% to 20%.
  // This makes the image move slower than the scroll speed, creating the parallax effect.
  const y = useTransform(scrollYProgress, [0, 1], transform)

  return (
    <section
      ref={ref}
      className={`relative flex items-center justify-center h-dvh  overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 z-0">
        {/* The motion.div is the element that will be animated. */}
        <motion.div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
            y, // Apply the transformed y-value here.
          }}
        />
        {/* This adds the dark overlay on top of the image. */}
        <div className={` absolute inset-0 z-10  ${overlayClassNames}`} />
      </div>

      {/* The content is placed on top with a higher z-index. */}
      <div className="relative z-20">{children}</div>
    </section>
  )
}
