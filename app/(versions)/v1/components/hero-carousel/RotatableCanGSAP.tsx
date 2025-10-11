'use client'
import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CanProps {
  image: string
  mockup: string
  className?: string
}

const RotatableCanGSAP: React.FC<CanProps> = ({
  image,
  mockup,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canRef = useRef<HTMLDivElement>(null)
  const layer1Ref = useRef<HTMLDivElement>(null)
  const layer2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      !containerRef.current ||
      !canRef.current ||
      !layer1Ref.current ||
      !layer2Ref.current
    )
      return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        once: true,
      },
    })

    tl.to(canRef.current, {
      y: -130,
      duration: 0.7,
    })
      .to(
        layer1Ref.current,
        {
          opacity: 0,
          backgroundPosition: '500px 0',
          duration: 0.8,
        },
        '-=0.3'
      )
      .to(
        layer2Ref.current,
        {
          opacity: 1,
          backgroundPosition: '500px 0',
          duration: 0.8,
        },
        '-=0.8'
      )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        ref={canRef}
        className="relative mx-auto w-[280px] h-[560px] md:w-[400px] md:h-[800px] lg:w-[280px] lg:h-[560px]"
      >
        <div
          ref={layer1Ref}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full"
          style={{
            backgroundImage: `url(${image}), url(${mockup})`,
            backgroundSize: 'auto 100%',
            backgroundBlendMode: 'multiply',
            maskImage: `url(${mockup})`,
            WebkitMaskImage: `url(${mockup})`,
            maskSize: 'auto 100%',
            WebkitMaskSize: 'auto 100%',
          }}
        />
        <div
          ref={layer2Ref}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full opacity-0"
          style={{
            backgroundImage: `url(${mockup})`,
            backgroundSize: 'auto 100%',
            maskImage: `url(${mockup})`,
            WebkitMaskImage: `url(${mockup})`,
            maskSize: 'auto 100%',
            WebkitMaskSize: 'auto 100%',
          }}
        />
      </div>
    </div>
  )
}

export default RotatableCanGSAP
