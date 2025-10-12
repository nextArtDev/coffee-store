'use client'
import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface RotatingCanProps {
  textureImage: string
  mockupImage: string
  className?: string
  width?: number
  aspectRatio?: string
  isActive?: boolean // New prop to trigger animation
  animationTrigger?: 'scroll' | 'active' // Choose animation mode
}

const RotatingCan: React.FC<RotatingCanProps> = ({
  textureImage,
  mockupImage,
  className = '',
  width = 280,
  aspectRatio = '2 / 4',
  isActive = true,
  animationTrigger = 'active',
}) => {
  const canRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [textureOffset, setTextureOffset] = useState(0)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!canRef.current || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Create timeline but don't play it yet
      const tl = gsap.timeline({ paused: true })
      timelineRef.current = tl

      // Set initial state
      gsap.set(canRef.current, { y: 100, opacity: 0 })

      // Animate the can rising up
      tl.to(canRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      })

      // Animate texture rotation (simulating can rotation)
      tl.to(
        {},
        {
          duration: 1.5,
          ease: 'power1.inOut',
          onUpdate: function () {
            const progress = this.progress()
            setTextureOffset(progress * 500)
          },
        },
        '-=0.4'
      )
    }, containerRef)

    return () => {
      ctx.revert()
      timelineRef.current = null
    }
  }, [])

  // Trigger animation when isActive changes
  useEffect(() => {
    if (!timelineRef.current) return

    if (isActive && animationTrigger === 'active') {
      // Reset and play animation
      timelineRef.current.restart()
    } else if (!isActive && animationTrigger === 'active') {
      // Reset to initial state when not active
      timelineRef.current.pause(0)
      setTextureOffset(0)
    }
  }, [isActive, animationTrigger])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full flex items-end justify-center overflow-hidden ${className}`}
    >
      <div
        ref={canRef}
        className="relative mb-32"
        style={{
          width: `${width}px`,
          aspectRatio: aspectRatio,
        }}
      >
        <div
          className="absolute inset-0 bg-blend-multiply"
          style={{
            backgroundImage: `url(${textureImage}), url(${mockupImage})`,
            backgroundPosition: `${textureOffset}px 0, 0 0`,
            backgroundSize: 'auto 100%',
            maskImage: `url(${mockupImage})`,
            maskSize: 'auto 100%',
            WebkitMaskImage: `url(${mockupImage})`,
            WebkitMaskSize: 'auto 100%',
          }}
        />
      </div>
    </div>
  )
}

export default RotatingCan
