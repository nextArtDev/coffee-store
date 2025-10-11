'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Define props for the component
interface SpinningCanProps {
  canImages: string[] // Array of can texture images
  mockupImage: string // Mockup frame image
  className?: string
  width?: number
  height?: number
  rotationDuration?: number
  animateOnView?: boolean
  autoRotate?: boolean
}

// Spinning Can component
const SpinningCan: React.FC<SpinningCanProps> = ({
  canImages,
  mockupImage,
  className = '',
  width = 280,
  height = 560,
  rotationDuration = 2,
  animateOnView = true,
  autoRotate = true,
}) => {
  // State
  const [isInView, setIsInView] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const canStripRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Set up intersection observer for view detection
  useEffect(() => {
    if (!animateOnView) {
      setIsInView(true)
      return
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [animateOnView])

  // Set up can rotation animation
  useEffect(() => {
    if (!canStripRef.current || !isInView || !autoRotate) return

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    // Create a new timeline for the can rotation
    const tl = gsap.timeline({
      repeat: -1,
      onUpdate: function () {
        const progress = tl.progress()
        const frameIndex = Math.floor(progress * canImages.length)
        setCurrentFrame(frameIndex)
      },
    })

    // Create a seamless loop by duplicating the first frame at the end
    const totalFrames = canImages.length + 1

    // Animate through all frames
    tl.to(canStripRef.current, {
      x: `-${(canImages.length / totalFrames) * 100}%`,
      duration: rotationDuration,
      ease: 'none',
      onComplete: function () {
        // Reset to the beginning without a jump
        gsap.set(canStripRef.current, { x: 0 })
        tl.restart()
      },
    })

    timelineRef.current = tl

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [isInView, canImages.length, rotationDuration, autoRotate])

  // Handle manual rotation (for when autoRotate is false)
  const handleManualRotation = (direction: 'left' | 'right') => {
    if (!canStripRef.current) return

    const frameWidth = 100 / canImages.length
    let newFrame = currentFrame

    if (direction === 'right') {
      newFrame = (currentFrame + 1) % canImages.length
    } else {
      newFrame = (currentFrame - 1 + canImages.length) % canImages.length
    }

    setCurrentFrame(newFrame)
    gsap.to(canStripRef.current, {
      x: `-${newFrame * frameWidth}%`,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width, height }}
    >
      {/* Mockup with rotating can strip */}
      <div
        className="mockup absolute inset-0"
        style={{
          WebkitMaskImage: `url(${mockupImage})`,
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: 'auto 100%',
          maskImage: `url(${mockupImage})`,
          maskRepeat: 'no-repeat',
          maskSize: 'auto 100%',
        }}
      >
        {/* Can Strip Container - scrolls horizontally */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            ref={canStripRef}
            className="flex h-full"
            style={{
              width: `${canImages.length * 100}%`,
            }}
          >
            {canImages.map((image, index) => (
              <div
                key={index}
                className="h-full flex-shrink-0"
                style={{
                  width: `${100 / canImages.length}%`,
                }}
              >
                <Image
                  src={image}
                  alt={`Can frame ${index}`}
                  width={width}
                  height={height}
                  className="w-full h-full object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mockup Frame Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${mockupImage})`,
            backgroundSize: 'auto 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 0',
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      {/* Shadow */}
      <div
        className="shadow rounded-full absolute left-1/2 transform -translate-x-1/2"
        style={{
          width: '80%',
          height: '30px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          bottom: '-20px',
          filter: 'blur(15px)',
        }}
      ></div>

      {/* Manual Controls (only shown when autoRotate is false) */}
      {!autoRotate && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 pb-4">
          <button
            onClick={() => handleManualRotation('left')}
            className="w-10 h-10 rounded-full bg-white/20 border border-white/60 text-white text-xl font-mono cursor-pointer hover:bg-white/30 transition-colors"
            aria-label="Rotate Left"
          >
            &lt;
          </button>
          <button
            onClick={() => handleManualRotation('right')}
            className="w-10 h-10 rounded-full bg-white/20 border border-white/60 text-white text-xl font-mono cursor-pointer hover:bg-white/30 transition-colors"
            aria-label="Rotate Right"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  )
}

export default SpinningCan
