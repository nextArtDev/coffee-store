'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { CSSPlugin } from 'gsap/CSSPlugin'

// Register GSAP plugins
gsap.registerPlugin(CSSPlugin)

// Define the type for carousel items
export interface CarouselItem {
  id: number
  name: string
  backgroundColor: string
  image: string
  canImage: string // Individual can texture image for each item
}

// Define props for the component
interface FruitCarouselProps {
  items: CarouselItem[]
  mockupImage?: string
  leavesImage?: string
  autoPlayInterval?: number
  headerTitle?: string
  headerNavItems?: string[]
  showHeader?: boolean
  className?: string
}

// Carousel component
const FruitCarousel: React.FC<FruitCarouselProps> = ({
  items,
  mockupImage = '/img/mockup.png',
  leavesImage = '/img/leaves.png',
  autoPlayInterval = 3000,
  headerTitle = 'LUNDEV',
  headerNavItems = ['HOME', 'CONTACT', 'INFO'],
  showHeader = true,
  className = '',
}) => {
  // State management
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevActiveIndex, setPrevActiveIndex] = useState(0)
  const [leftMockup, setLeftMockup] = useState(0)
  const [isRightDirection, setIsRightDirection] = useState(false)
  const [canStripLoaded, setCanStripLoaded] = useState(false)

  // Refs for DOM elements
  const carouselRef = useRef<HTMLDivElement>(null)
  const mockupRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const canStripRef = useRef<HTMLDivElement>(null)

  // Calculate left position for each item
  const leftEachItem = items.length > 1 ? 100 / (items.length - 1) : 0

  // Handle next button click
  const handleNext = () => {
    setPrevActiveIndex(activeIndex)
    const newActiveIndex = activeIndex >= items.length - 1 ? 0 : activeIndex + 1
    setActiveIndex(newActiveIndex)
    setLeftMockup((prev) => prev + leftEachItem)
    setIsRightDirection(false)
  }

  // Handle previous button click
  const handlePrev = () => {
    setPrevActiveIndex(activeIndex)
    const newActiveIndex = activeIndex <= 0 ? items.length - 1 : activeIndex - 1
    setActiveIndex(newActiveIndex)
    setLeftMockup((prev) => prev - leftEachItem)
    setIsRightDirection(true)
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
    intervalRef.current = setInterval(handleNext, autoPlayInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Handle carousel changes with proper animations
  useEffect(() => {
    if (prevActiveIndex === activeIndex) return

    const oldItem = itemRefs.current[prevActiveIndex]
    const newItem = itemRefs.current[activeIndex]

    if (oldItem) {
      const oldFruit = oldItem.querySelector('.fruit')
      const oldContent = oldItem.querySelector('.content')

      // Animate out old item
      if (oldFruit) {
        gsap.to(oldFruit, {
          top: isRightDirection ? '100%' : '-100%',
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
            top: isRightDirection ? '0%' : '100%',
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

    // Update mockup background position with GSAP
    if (mockupRef.current) {
      gsap.to(mockupRef.current, {
        '--left': `${leftMockup}%`,
        duration: 0.5,
        ease: 'power2.inOut',
      })
    }

    resetInterval()
  }, [activeIndex, prevActiveIndex, isRightDirection, leftMockup])

  // Get the display status for each item
  const getItemStatus = (index: number) => {
    if (index === activeIndex) return 'active'
    if (index === prevActiveIndex) return 'hidden'
    return 'inactive'
  }

  // Create a combined can strip image from all items
  const createCanStrip = () => {
    // We'll use a different approach - create a CSS variable with all the can images
    return items
      .map((item, index) => {
        return `url(${item.canImage}) ${index * 100}% 0`
      })
      .join(', ')
  }

  // Handle can strip loading
  useEffect(() => {
    // Preload all can images
    const preloadImages = async () => {
      const promises = items.map((item) => {
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.src = item.canImage
          img.onload = () => resolve()
        })
      })

      await Promise.all(promises)
      setCanStripLoaded(true)
    }

    preloadImages()
  }, [items])

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
        } ${isRightDirection ? 'right' : ''}`}
      >
        {/* Carousel Items */}
        <div className="list w-full h-full">
          {items.map((item, index) => {
            const status = getItemStatus(index)
            const isVisible = status === 'active' || status === 'hidden'

            return (
              <div
                key={item.id}
                ref={(el) => (itemRefs.current[index] = el)}
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

        {/* Mockup with rotating can strip - Fixed implementation */}
        <div
          ref={mockupRef}
          className="mockup absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={
            {
              height: 'calc(673px / 1.5)',
              width: 'calc(371px / 1.5)',
              // Use CSS variables for dynamic values
              '--left': `${leftMockup}%`,
            } as React.CSSProperties
          }
        >
          {/* Can Strip Container - using background images */}
          <div
            ref={canStripRef}
            className="absolute inset-0"
            style={{
              // Create a horizontal strip of all can images
              backgroundImage: items
                .map((item, index) => `url(${item.canImage})`)
                .join(', '),
              backgroundPosition: items
                .map((_, index) => `${index * 100}% 0`)
                .join(', '),
              backgroundSize: `${items.length * 100}% 100%`,
              backgroundRepeat: 'no-repeat',
              // Position the strip based on active index
              backgroundPositionX: `calc(var(--left) * -1)`,
              transition: 'background-position 0.5s ease-out',
              // Apply mask to show only the mockup shape
              WebkitMaskImage: `url(${mockupImage})`,
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskSize: 'auto 100%',
              maskImage: `url(${mockupImage})`,
              maskRepeat: 'no-repeat',
              maskSize: 'auto 100%',
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

export default FruitCarousel
