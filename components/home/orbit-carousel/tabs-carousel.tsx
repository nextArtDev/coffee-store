'use client'
import { useState, useEffect, FC } from 'react'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'
import { CategoryWithStats } from '@/lib/types/home'
import { Loader } from '@/components/shared/loader'
import GlassSurface from '@/components/shared/glass-surface/GlassSurface'
import { TransitionLink } from '../shared/TransitionLink'

// Mock Components
const useDetectBrowser = () => 'Chrome'
const useScreenSize = () => ({
  lessThan: (size: string) =>
    typeof window !== 'undefined' && size === 'md' && window.innerWidth < 768,
})
const GooeySvgFilter = ({ id, strength }: { id: string; strength: number }) => (
  <svg className="absolute w-0 h-0">
    <defs>
      <filter id={id}>
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
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

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Slower stagger
      delayChildren: 0.2, // More delay
    },
  },
}

const listItemVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 }, // Use scale instead of y movement
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

interface GooeyCarouselProps {
  categories: CategoryWithStats[]
}

const GooeyCarousel: FC<GooeyCarouselProps> = ({ categories }) => {
  const [activeTab, setActiveTab] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const screenSize = useScreenSize()
  const browserName = useDetectBrowser()
  const isSafari = browserName === 'Safari'

  useEffect(() => {
    if (isHovering) return
    const interval = setInterval(() => {
      if (categories && categories.length > 0) {
        setActiveTab((prevTab) => (prevTab + 1) % categories.length)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [isHovering, activeTab, categories.length, categories])

  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader />
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-full flex justify-center items-center p-4 sm:p-6 md:p-8 font-sans"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <GooeySvgFilter
        id="gooey-filter"
        strength={screenSize.lessThan('md') ? 8 : 15}
      />

      <div className="w-full max-w-3xl relative">
        <div
          className="absolute inset-0"
          style={{ filter: 'url(#gooey-filter)' }}
        >
          <div className="flex w-full">
            {categories?.map((_, index) => (
              <div key={index} className="relative flex-1 h-12 md:h-16">
                {activeTab === index && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-secondary"
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

          <div className="w-full min-h-[260px] sm:min-h-[280px] bg-secondary overflow-hidden text-gray-500 dark:text-gray-400">
            <motion.div
              key={activeTab}
              className="p-2"
              initial="hidden"
              animate="visible"
              variants={listContainerVariants}
            >
              <motion.ul
                className="relative space-y-2 flex justify-evenly items-center flex-wrap gap-0.5  py-10 min-h-[50dvh]"
                variants={listContainerVariants}
              >
                <Image
                  fill
                  className="object-cover rounded-md opacity-60"
                  alt={categories[activeTab]?.name}
                  src={categories[activeTab]?.images.map((img) => img.url)[0]}
                />
                {categories[activeTab]?.subCategories?.map((subcategory) => (
                  <motion.li
                    key={subcategory.id}
                    className=" relative w-[25%] aspect-square grid grid-rows-1 place-content-center place-items-center rounded-md text-black dark:text-white text-xs sm:text-sm md:text-md cursor-pointer"
                    variants={listItemVariants}
                  >
                    <Image
                      fill
                      className="object-cover rounded-full z-[0] opacity-50 "
                      alt={subcategory.name}
                      src={subcategory.images.map((img) => img.url)[0]}
                    />
                    <TransitionLink
                      href={`/sub-categories/${subcategory.url}`}
                      className="z-[1] absolute inset-0 flex items-center justify-center "
                    >
                      {/* SOLUTION 1: Solid background instead of semi-transparent */}
                      {/* <span className="text-center font-bold bg-white/55 text-black border border-gray-200 rounded-md aspect-square flex items-center justify-center p-2 leading-tight  shadow-sm">
                        {subcategory.name}
                      </span> */}
                      <GlassSurface
                        width={'100%'}
                        height={'100%'}
                        borderRadius={999}
                        borderWidth={0.07}
                        brightness={50}
                        opacity={0.93}
                        blur={15}
                        displace={0}
                        backgroundOpacity={0.2}
                        saturation={2}
                        distortionScale={-180}
                        className="p-1 rounded-full aspect-square font-bold text-center"
                      >
                        {' '}
                        {subcategory.name}
                      </GlassSurface>

                      {/* SOLUTION 2: Remove backdrop-blur entirely */}
                      {/* <span className="text-center bg-white text-black border border-gray-300 rounded-full aspect-square flex items-center justify-center p-2 leading-tight font-medium">
                        {subcategory.name}
                      </span> */}

                      {/* SOLUTION 3: Different styling approach */}
                      {/* <span className="text-center bg-gray-800/90 text-white border border-gray-600 rounded-full aspect-square flex items-center justify-center p-2 leading-tight font-medium">
                        {subcategory.name}
                      </span> */}
                    </TransitionLink>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>

        <div className="relative flex w-full">
          {categories.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className="flex-1 h-12 md:h-16"
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
                {tab.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GooeyCarousel
