'use client'
import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RotatingCanProps {
  textureImage: string
  mockupImage: string
  className?: string
  width?: number
  aspectRatio?: string
}

const RotatingCan: React.FC<RotatingCanProps> = ({
  textureImage,
  mockupImage,
  className = '',
  width = 280,
  aspectRatio = '2 / 4',
}) => {
  const canRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [textureOffset, setTextureOffset] = useState(0)

  useEffect(() => {
    if (!canRef.current || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Create timeline for the animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        },
      })

      // Animate the can rising up
      tl.to(canRef.current, {
        y: -100,
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
            // Rotate texture by moving background position
            setTextureOffset(progress * 500)
          },
        },
        '-=0.4'
      )
    }, containerRef)

    return () => ctx.revert()
  }, [textureImage, mockupImage])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen flex items-end justify-center overflow-hidden ${className}`}
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

// Demo component with example usage
// const Demo: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100">
//       <div className="h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-6xl font-bold mb-4">Scroll Down</h1>
//           <p className="text-xl text-gray-600">
//             Watch the can animate when it comes into view
//           </p>
//         </div>
//       </div>

//       <RotatingCan
//         textureImage="https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&h=800&fit=crop"
//         mockupImage="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=800&fit=crop&mask=ellipse"
//         width={320}
//         aspectRatio="1 / 2"
//       />

//       <div className="h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-4xl font-bold mb-4">Animation Complete!</h2>
//           <p className="text-lg text-gray-600">
//             Scroll back up to see it reverse
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Demo
export default RotatingCan
