/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Define the type for carousel items
export interface CarouselItem {
  id: number
  name: string
  backgroundColor: string
  image: string
  canImage: string // Individual can texture image for each item
  mockupImage?: string // Optional individual mockup frame for each item
}

// Define props for the component
interface SpinningCanCarouselProps {
  items: CarouselItem[]
  mockupImage?: string
  leavesImage?: string
  autoPlayInterval?: number
  headerTitle?: string
  headerNavItems?: string[]
  showHeader?: boolean
  className?: string
  animateOnView?: boolean
  rotationDuration?: number
}

// Carousel component
const SpinningCanCarousel: React.FC<SpinningCanCarouselProps> = ({
  items,
  mockupImage = '/img/mockup.png',
  leavesImage = '/img/leaves.png',
  autoPlayInterval = 3000,
  headerTitle = 'LUNDEV',
  headerNavItems = ['HOME', 'CONTACT', 'INFO'],
  showHeader = true,
  className = '',
  animateOnView = true,
  rotationDuration = 2,
}) => {
  // State management
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevActiveIndex, setPrevActiveIndex] = useState(0)
  const [isInView, setIsInView] = useState(false)

  // Refs for DOM elements
  const carouselRef = useRef<HTMLDivElement>(null)
  const mockupRef = useRef<HTMLDivElement>(null)
  const canStripRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

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

    if (carouselRef.current) {
      observerRef.current.observe(carouselRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [animateOnView])

  // Set up can rotation animation when in view
  useEffect(() => {
    if (!isInView || !canStripRef.current) return

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    // Create a new timeline for the can rotation
    const tl = gsap.timeline({
      repeat: -1,
    })

    // Create a seamless loop by duplicating the first frame at the end
    const totalFrames = items.length + 1

    // Animate through all frames
    tl.to(canStripRef.current, {
      x: `-${(items.length / totalFrames) * 100}%`,
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
  }, [isInView, items.length, rotationDuration])

  // Handle next button click
  const handleNext = () => {
    setPrevActiveIndex(activeIndex)
    const newActiveIndex = activeIndex >= items.length - 1 ? 0 : activeIndex + 1
    setActiveIndex(newActiveIndex)
  }

  // Handle previous button click
  const handlePrev = () => {
    setPrevActiveIndex(activeIndex)
    const newActiveIndex = activeIndex <= 0 ? items.length - 1 : activeIndex - 1
    setActiveIndex(newActiveIndex)
  }

  // Reset auto-play interval
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(handleNext, autoPlayInterval)
  }

  // Set up auto-play and cleanup
  useEffect(() => {
    if (!isInView) return

    intervalRef.current = setInterval(handleNext, autoPlayInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isInView, autoPlayInterval])

  // Handle carousel changes with proper animations
  useEffect(() => {
    if (prevActiveIndex === activeIndex || !isInView) return

    const oldItem = itemRefs.current[prevActiveIndex]
    const newItem = itemRefs.current[activeIndex]

    if (oldItem) {
      const oldFruit = oldItem.querySelector('.fruit')
      const oldContent = oldItem.querySelector('.content')

      // Animate out old item
      if (oldFruit) {
        gsap.to(oldFruit, {
          top: '100%',
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
        })
      }

      if (oldContent) {
        gsap.to(oldContent, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
        })
      }
    }

    if (newItem) {
      const newFruit = newItem.querySelector('.fruit')
      const newContent = newItem.querySelector('.content')

      // Animate in new item
      if (newFruit) {
        gsap.fromTo(
          newFruit,
          {
            top: '100%',
            opacity: 0,
          },
          {
            top: '50%',
            opacity: 1,
            duration: 0.5,
            ease: 'power2.inOut',
          }
        )
      }

      if (newContent) {
        gsap.fromTo(
          newContent,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.inOut',
            delay: 0.1,
          }
        )
      }
    }

    resetInterval()
  }, [activeIndex, prevActiveIndex, isInView])

  // Get the display status for each item
  const getItemStatus = (index: number) => {
    if (index === activeIndex) return 'active'
    if (index === prevActiveIndex) return 'hidden'
    return 'inactive'
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${className}`}>
      {/* Header */}
      {showHeader && (
        <header className="flex justify-between items-center px-12 py-2 font-mono font-bold text-lg relative z-10">
          <div>{headerTitle}</div>
          <nav>
            <ul className="flex gap-5 list-none p-0 m-0">
              {headerNavItems.map((item, index) => (
                <li key={index} className="cursor-pointer hover:opacity-70">
                  {item}
                </li>
              ))}
            </ul>
          </nav>
        </header>
      )}

      {/* Carousel */}
      <div
        ref={carouselRef}
        className={`relative w-full h-screen overflow-hidden ${
          showHeader ? '-mt-12' : ''
        }`}
      >
        {/* Carousel Items */}
        <div className="list w-full h-full">
          {items.map((item, index) => {
            const status = getItemStatus(index)
            const isVisible = status === 'active' || status === 'hidden'

            return (
              <div
                key={item.id}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                data-index={index}
                className={`item w-full h-full absolute top-0 left-0 overflow-hidden ${
                  !isVisible ? 'hidden' : ''
                } ${status === 'hidden' ? 'pointer-events-none' : ''}`}
                style={{
                  backgroundColor:
                    status === 'hidden' ? 'transparent' : item.backgroundColor,
                  zIndex: status === 'active' ? 10 : 1,
                  display: isVisible ? 'block' : 'none',
                }}
              >
                <div className="content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-[8rem] md:text-[12rem] text-white/90 font-bold font-sans uppercase whitespace-nowrap">
                  {item.name}
                </div>
                <div className="fruit w-[90%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={800}
                    height={800}
                    className="w-full h-auto object-contain"
                    priority={index === 0}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Decorative Leaves */}
        {leavesImage && (
          <div
            className="leaves absolute w-[170px] h-[170px] z-20 opacity-50"
            style={{
              top: 'calc(50% - 150px)',
              left: 'calc(50% + 50px)',
            }}
          >
            <Image
              src={leavesImage}
              alt="Leaves decoration"
              width={170}
              height={170}
              className="w-full h-full"
            />
          </div>
        )}

        {/* Mockup with rotating can strip */}
        <div
          ref={mockupRef}
          className="mockup absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            height: 'calc(673px / 1.5)',
            width: 'calc(371px / 1.5)',
            WebkitMaskImage: `url(${
              items[activeIndex].mockupImage || mockupImage
            })`,
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskSize: 'auto 100%',
            maskImage: `url(${items[activeIndex].mockupImage || mockupImage})`,
            maskRepeat: 'no-repeat',
            maskSize: 'auto 100%',
            transition: 'all 0.5s ease-out',
          }}
        >
          {/* Can Strip Container - scrolls horizontally */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              ref={canStripRef}
              className="flex h-full"
              style={{
                width: `${items.length * 100}%`,
              }}
            >
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="h-full flex-shrink-0"
                  style={{
                    width: `${100 / items.length}%`,
                  }}
                >
                  <Image
                    src={item.canImage}
                    alt={`${item.name} can`}
                    width={247}
                    height={449}
                    className="w-full h-full object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mockup Frame Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
            style={{
              backgroundImage: `url(${
                items[activeIndex].mockupImage || mockupImage
              })`,
              backgroundSize: 'auto 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0 0',
              mixBlendMode: 'multiply',
            }}
          />
        </div>

        {/* Shadow */}
        <div
          className="shadow rounded-full absolute left-1/2 transform -translate-x-1/2 z-5"
          style={{
            width: 'calc(371px / 1.5)',
            height: '100px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            top: 'calc(50% + calc(673px / 2 / 1.5))',
            filter: 'blur(20px)',
          }}
        ></div>

        {/* Navigation Buttons */}
        <div className="arrow">
          <button
            id="prev"
            onClick={handlePrev}
            className="absolute top-1/2 left-5 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 border border-white/60 text-white text-xl font-mono cursor-pointer z-30 hover:bg-white/30 transition-colors"
            aria-label="Previous"
          >
            &lt;
          </button>
          <button
            id="next"
            onClick={handleNext}
            className="absolute top-1/2 right-5 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 border border-white/60 text-white text-xl font-mono cursor-pointer z-30 hover:bg-white/30 transition-colors"
            aria-label="Next"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media screen and (max-width: 768px) {
          .content {
            transform: translate(-50%, -50%) scale(0.5);
          }
          .fruit {
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default SpinningCanCarousel
