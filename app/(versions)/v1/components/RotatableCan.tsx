'use client'
import React, { useRef, useEffect, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

interface CanProps {
  image: string
  mockup: string
  className?: string
}

const RotatableCan: React.FC<CanProps> = ({
  image,
  mockup,
  className = '',
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.3 })
  const controls = useAnimation()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start('animate')
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated, controls])

  const canVariants = {
    initial: {
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
    animate: {
      y: -10,
      transition: {
        duration: 0.7,
      },
    },
  }

  const canLayerVariants = {
    initial: {
      opacity: 1,
      backgroundPosition: '0px 0',
      transition: {
        duration: 0.8,
      },
    },
    animate: {
      opacity: 0,
      backgroundPosition: '500px 0',
      transition: {
        duration: 0.8,
      },
    },
  }

  const canLayer2Variants = {
    initial: {
      opacity: 0,
      backgroundPosition: '0px 0',
      transition: {
        duration: 0.8,
      },
    },
    animate: {
      opacity: 1,
      backgroundPosition: '500px 0',
      transition: {
        duration: 0.8,
      },
    },
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        className="relative mx-auto w-[280px] h-[560px] md:w-[400px] md:h-[800px] lg:w-[280px] lg:h-[560px]"
        variants={canVariants}
        initial="initial"
        animate={controls}
      >
        <motion.div
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
          variants={canLayerVariants}
          initial="initial"
          animate={controls}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full"
          style={{
            backgroundImage: `url(${mockup})`,
            backgroundSize: 'auto 100%',
            maskImage: `url(${mockup})`,
            WebkitMaskImage: `url(${mockup})`,
            maskSize: 'auto 100%',
            WebkitMaskSize: 'auto 100%',
          }}
          variants={canLayer2Variants}
          initial="initial"
          animate={controls}
        />
      </motion.div>
    </div>
  )
}

export default RotatableCan
