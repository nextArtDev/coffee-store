'use client'

import { ReactNode, useRef } from 'react'
import { ScrollOffset } from '../shared/FixedVideoPlay'
import { useScroll, useTransform, motion } from 'framer-motion'
import Image from 'next/image'

export function FixedMotionImage({
  imageUrl,
  children,
  offset = ['start end', 'end start'],
  transform = ['-80%', '80%'],
  overlayClassNames = 'bg-black/30',
  className,
  imageAlt = 'Hero background image',
  priority = true,
  quality = 90,
  blurDataURL,
}: {
  imageUrl: string
  children: ReactNode
  offset?: ScrollOffset
  transform?: string[]
  overlayClassNames?: string
  className?: string
  imageAlt?: string
  priority?: boolean
  quality?: number
  blurDataURL?: string
}) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset,
  })

  const y = useTransform(scrollYProgress, [0, 1], transform)

  // Generate a simple blur placeholder if none provided
  const defaultBlurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#f3f4f6"/>
    </svg>`
  ).toString('base64')}`

  return (
    <section
      ref={ref}
      className={`relative flex items-center justify-center h-dvh overflow-hidden ${className}`}
    >
      {/* Fixed background container - no motion applied here */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Apply motion only to the image wrapper */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            y,
            width: '100%',
            height: '120%',
            top: '-10%',
          }}
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={priority}
            quality={quality}
            placeholder="blur"
            blurDataURL={blurDataURL || defaultBlurDataURL}
          />
        </motion.div>
      </div>

      {/* Dark overlay */}
      <div className={`absolute inset-0 z-10 ${overlayClassNames}`} />

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </section>
  )
}

// Alternative with CSS background approach for maximum smoothness
export function CSSBackgroundParallax({
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset,
  })

  const y = useTransform(scrollYProgress, [0, 1], transform)

  return (
    <section
      ref={ref}
      className={`relative flex items-center justify-center h-dvh overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 z-0">
        {/* Use CSS background for smoothest parallax */}
        <motion.div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{
            backgroundImage: `url(${imageUrl})`,
            y,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        />
        {/* Preload the image with Next.js Image (hidden) */}
        <Image
          src={imageUrl}
          alt=""
          width={1}
          height={1}
          priority={true}
          className="opacity-0 absolute"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay */}
      <div className={`absolute inset-0 z-10 ${overlayClassNames}`} />

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </section>
  )
}
