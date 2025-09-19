'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
//https://www.fancycomponents.dev/docs/components/filter/gooey-svg-filter
// --- Mock Components for Demonstration ---
const useDetectBrowser = () => 'Chrome'
const useScreenSize = () => ({
  lessThan: (size: string) =>
    typeof window !== 'undefined' && size === 'md' && window.innerWidth < 768,
})
const GooeySvgFilter = ({ id, strength }: { id: string; strength: number }) => (
  <svg className="absolute w-0 h-0">
    <defs>
      <filter id={id}>
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${strength} -7`}
          result="goo"
        />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
)
// --- End Mock Components ---

const TAB_CONTENT = [
  {
    title: 'قهوه',
    files: [
      { id: '1', title: 'learning-to-meditate.md', imageSrc: '/images/4.png' },
      { id: '2', title: 'spring-garden-plans.md', imageSrc: '/images/4.png' },
      { id: '3', title: 'travel-wishlist.md', imageSrc: '/images/4.png' },
      { id: '4', title: 'new-coding-projects.md', imageSrc: '/images/4.png' },
      { id: '5', title: 'learning-to-meditate.md', imageSrc: '/images/4.png' },
    ],
  },
  {
    title: 'تجهیزات',
    files: [
      { id: '1', title: 'year-in-review.md', imageSrc: '/images/4.png' },
      { id: '2', title: 'marathon-training-log.md', imageSrc: '/images/4.png' },
      { id: '3', title: 'recipe-collection.md', imageSrc: '/images/4.png' },
      { id: '4', title: 'book-reflections.md', imageSrc: '/images/4.png' },
    ],
  },
  {
    title: 'فروش عمده',
    files: [
      { id: '1', title: 'moving-to-a-new-city.md', imageSrc: '/images/4.png' },
      { id: '2', title: 'starting-a-blog.md', imageSrc: '/images/4.png' },
      { id: '3', title: 'photography-basics.md', imageSrc: '/images/4.png' },
      { id: '4', title: 'first-coding-project.md', imageSrc: '/images/4.png' },
    ],
  },
  {
    title: 'اکسسوری',
    files: [
      { id: '1', title: 'goals-and-aspirations.md', imageSrc: '/images/4.png' },
      { id: '2', title: 'daily-gratitude.md', imageSrc: '/images/4.png' },
      { id: '3', title: 'learning-to-cook.md', imageSrc: '/images/4.png' },
      { id: '4', title: 'remote-work-journal.md', imageSrc: '/images/4.png' },
    ],
  },
]

export default function GooeyCarousel() {
  const [activeTab, setActiveTab] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const screenSize = useScreenSize()
  const browserName = useDetectBrowser()
  const isSafari = browserName === 'Safari'

  useEffect(() => {
    if (isHovering) return
    const interval = setInterval(() => {
      setActiveTab((prevTab) => (prevTab + 1) % TAB_CONTENT.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isHovering, activeTab])

  return (
    <div
      // ⭐ RESPONSIVE: Adjusted padding for smaller screens
      className="relative w-full h-full flex justify-center items-center p-4 sm:p-6 md:p-8 font-sans  "
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <GooeySvgFilter
        id="gooey-filter"
        strength={screenSize.lessThan('md') ? 8 : 15}
      />

      {/* ⭐ REMOVED: The "Disable/Enable Gooey" button is gone */}

      {/* ⭐ RESPONSIVE: Using max-w for a flexible, centered layout */}
      <div className="w-full max-w-3xl relative">
        <div
          className="absolute inset-0"
          // The gooey filter is now always on
          style={{ filter: 'url(#gooey-filter)' }}
        >
          <div className="flex w-full">
            {TAB_CONTENT.map((_, index) => (
              <div key={index} className="relative flex-1 h-8 md:h-12">
                {activeTab === index && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-primary  "
                    transition={{
                      type: 'spring',
                      bounce: 0.1,
                      duration: isSafari ? 0 : 0.5,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ⭐ RESPONSIVE: Using min-height to allow content to grow */}
          <div className="w-full min-h-[260px] sm:min-h-[280px] bg-primary   overflow-hidden text-gray-500 dark:text-gray-400">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                // ⭐ RESPONSIVE: Adjusted padding
                className="p-6 md:p-10"
              >
                <ul className="space-y-2   flex justify-evenly items-center flex-wrap gap-0.5">
                  {TAB_CONTENT[activeTab].files.map((file) => (
                    <li
                      key={file.id}
                      className="relative w-1/3 aspect-square flex items-center justify-center text-center rounded-md border-b border-gray-400/50 dark:border-gray-600/50 pt-2 pb-1 text-black dark:text-white text-sm sm:text-base"
                    >
                      {file.title}
                      <Image
                        fill
                        className="object-cover opacity-50"
                        alt=""
                        src={file.imageSrc}
                      />
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Interactive text overlay, no filter */}
        <div className="relative flex w-full ">
          {TAB_CONTENT.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className="flex-1 h-8 md:h-12"
            >
              <span
                className={`
                  w-full h-full flex items-center justify-center transition-colors duration-300 text-xs sm:text-sm md:text-base
                  ${
                    activeTab === index
                      ? 'text-black dark:text-white font-semibold'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {tab.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
