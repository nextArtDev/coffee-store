'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import React, { useRef, useState, useCallback } from 'react'
import { HomepageProduct } from '@/lib/types/home'
import { FadeIn } from '../shared/fade-in'
import { useInView, AnimatePresence, motion } from 'framer-motion'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '@/lib/utils'
import { TransitionLink } from '../home/shared/TransitionLink'
import { ProgressiveBlur } from '../shared/progressive-blur'
import BatteryLevel from '../shared/widget/widgest'
import { BlurredCardWithClearCenter } from './BluredCard'
import GlassSurface from '../shared/glass-surface/GlassSurface'
import type { EmblaCarouselType } from 'embla-carousel'
import DonutChart from '../shared/widget/donate-chart'

export type item = {
  id: string
  link: string
  category: string
  title: string
  price: number
  imageSrc: string
}

type MainPageCarousel = {
  items: Partial<HomepageProduct>[]
}

// Individual Slide Flower Menu Button
const SlideFlowerButton = ({
  item,
  isVisible,
  onAction,
}: {
  item: Partial<HomepageProduct>
  isVisible: boolean
  onAction?: (action: string, item: Partial<HomepageProduct>) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)

  // Auto-open when slide comes into view, close when goes out of view
  React.useEffect(() => {
    if (isVisible) {
      // Small delay to allow slide transition to complete
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setIsOpen(false)
    }
  }, [isVisible])

  const handleAction = (action: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (onAction) {
      onAction(action, item)
    }
    setIsOpen(false) // Close menu after action
  }

  const handleToggle = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
        >
          {/* Main Toggle Button */}
          <div className="relative">
            <button
              onClick={handleToggle}
              className="w-12 h-12 bg-black/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-all duration-300 shadow-lg"
            >
              <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </motion.div>
            </button>

            {/* Action Buttons */}
            <AnimatePresence>
              {isOpen && (
                <>
                  {/* Add to Cart */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x: -60, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    onClick={(e) => handleAction('addToCart', e)}
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-green-500/80 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-green-500/90 transition-all duration-200 shadow-lg"
                    title="Add to Cart"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8v5a1 1 0 001 1h8a1 1 0 001-1v-5M7 13L5.4 7H4"
                      />
                    </svg>
                  </motion.button>

                  {/* Add to Favorites */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x: -42, y: -42 }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                    onClick={(e) => handleAction('addToFavorites', e)}
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-red-500/80 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-red-500/90 transition-all duration-200 shadow-lg"
                    title="Add to Favorites"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </motion.button>

                  {/* Quick View */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: -60 }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    onClick={(e) => handleAction('quickView', e)}
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-blue-500/80 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-blue-500/90 transition-all duration-200 shadow-lg"
                    title="Quick View"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </motion.button>

                  {/* Share */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x: 42, y: -42 }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.25 }}
                    onClick={(e) => handleAction('share', e)}
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-purple-500/80 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-purple-500/90 transition-all duration-200 shadow-lg"
                    title="Share"
                  >
                    {/* <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg> */}
                    <DonutChart
                      progress={45}
                      circleWidth={8}
                      progressWidth={8}
                      size={90}
                      gradientColors={['#2c1b06', '#804e05', '#ddb58f']}
                      className="p-0 relative flex items-center justify-center text-[#2c1b06]"
                      trackClassName="text-green-500/50 text-green-100/30"
                    >
                      <GlassSurface
                        width={70}
                        height={70}
                        borderRadius={999}
                        borderWidth={0.07}
                        brightness={50}
                        opacity={0.93}
                        blur={15}
                        displace={0}
                        backgroundOpacity={0.2}
                        saturation={2}
                        distortionScale={-180}
                        className="p-1 rounded-full aspect-square"
                      >
                        {/* <item.icon className="absolute" size={24} /> */}
                        <span className="absolute flex flex-col gap-0.25 font-semibold">
                          <p>Free</p>
                          24%
                        </span>
                      </GlassSurface>
                    </DonutChart>
                  </motion.button>

                  {/* Compare */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x: 60, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    onClick={(e) => handleAction('compare', e)}
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-orange-500/80 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-orange-500/90 transition-all duration-200 shadow-lg"
                    title="Compare"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Individual Carousel Item Component
const CarouselItemComponent = ({
  item,
  index,
  isInViewport,
  onAction,
}: {
  item: Partial<HomepageProduct>
  index: number
  isInViewport: boolean
  onAction: (action: string, item: Partial<HomepageProduct>) => void
}) => {
  return (
    <CarouselItem
      key={item.id}
      className="pl-1 basis-1/2 md:pl-2 md:basis-1/3 lg:basis-1/4 xl:pl-4 xl:basis-1/5"
    >
      <FadeIn
        className="translate-y-5"
        vars={{ delay: 0.2 * index, duration: 0.3, ease: 'sine.inOut' }}
      >
        <div className="relative">
          <TransitionLink
            href={`/products/${item.slug}`}
            className="flex flex-col border-none rounded-xl bg-transparent gap-4"
          >
            {!!item.images && (
              <figure className="relative w-full border-none rounded-xl">
                <Image
                  unoptimized
                  src={
                    item.images.map((img) => img.url)[0] ||
                    '/images/fallback-image.webp'
                  }
                  fill
                  alt={item.name!}
                  className="object-cover rounded-xl"
                />
                <GlassSurface
                  width={100}
                  height={100}
                  borderRadius={999}
                  borderWidth={0.07}
                  brightness={50}
                  opacity={0.93}
                  blur={11}
                  displace={0}
                  backgroundOpacity={0}
                  saturation={1}
                  distortionScale={-180}
                  className="p-1 rounded-full aspect-square"
                >
                  {item.name!}
                </GlassSurface>
                <BlurredCardWithClearCenter
                  clearRadius={120}
                  blurIntensity={500}
                  className="z-10"
                >
                  <div className="relative w-full h-full">
                    <BatteryLevel />
                  </div>
                </BlurredCardWithClearCenter>
                <div className="absolute left-0 bottom-0 flex w-fit h-full items-center gap-2"></div>
                <article className="absolute h-1/2 w-full bottom-0 flex flex-col gap-1 justify-evenly py-3 px-2 text-pretty text-xs md:text-sm lg:text-base rounded-b-md">
                  <p className="font-semibold">{item.category!.name}</p>
                  <p className="font-bold">{item.name}</p>
                  {!!item.variants && (
                    <>
                      {item.variants.map((variant, i) => (
                        <div key={i} className="flex items-center gap-1">
                          {!!variant.discount && (
                            <p className="text-red-500">
                              {variant.price -
                                variant.price * (variant.discount / 100)}{' '}
                              تومان
                            </p>
                          )}
                          <p
                            className={cn(
                              '',
                              variant.discount && 'line-through'
                            )}
                          >
                            {variant.price} تومان
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                </article>
              </figure>
            )}
          </TransitionLink>

          {/* Individual Flower Menu for this slide */}
          <SlideFlowerButton
            item={item}
            isVisible={isInViewport}
            onAction={onAction}
          />
        </div>
      </FadeIn>
    </CarouselItem>
  )
}

export default function MainPageCarousel({ items }: MainPageCarousel) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType>()
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [slidesInView, setSlidesInView] = useState<number[]>([])

  const isInView = useInView(carouselRef, { once: true, amount: 0.3 })

  const onInit = useCallback((emblaApi: EmblaCarouselType | undefined) => {
    if (emblaApi) {
      setEmblaApi(emblaApi)
    }
  }, [])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setCurrentSlideIndex(emblaApi.selectedScrollSnap())
  }, [])

  // Update slides in view
  const updateSlidesInView = useCallback((emblaApi: EmblaCarouselType) => {
    const inView = emblaApi.slidesInView().concat(emblaApi.slidesInView())
    setSlidesInView(inView)
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    updateSlidesInView(emblaApi)

    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
    emblaApi.on('slidesInView', updateSlidesInView)
    emblaApi.on('select', updateSlidesInView)
  }, [emblaApi, onSelect, updateSlidesInView])

  // Handle flower menu actions
  const handleFlowerAction = (
    action: string,
    item: Partial<HomepageProduct>
  ) => {
    switch (action) {
      case 'addToCart':
        console.log('Adding to cart:', item)
        // Add your cart logic here
        break
      case 'addToFavorites':
        console.log('Adding to favorites:', item)
        // Add your favorites logic here
        break
      case 'quickView':
        console.log('Quick view:', item)
        // Add your quick view logic here
        break
      case 'share':
        console.log('Sharing:', item)
        // Add your share logic here
        break
      case 'compare':
        console.log('Adding to compare:', item)
        // Add your compare logic here
        break
    }
  }

  return (
    <Carousel
      opts={{
        align: 'start',
        direction: 'rtl',
        loop: true,
      }}
      plugins={
        isInView
          ? [
              Autoplay({
                delay: 3000,
              }),
            ]
          : []
      }
      dir="rtl"
      className="w-full aspect-square"
      ref={carouselRef}
      setApi={onInit}
    >
      <CarouselContent className="-ml-1 md:-ml-2 xl:-ml-4 text-primary-foreground">
        {items.map((item, i) => (
          <CarouselItemComponent
            key={item.id}
            item={item}
            index={i}
            isInViewport={slidesInView.includes(i)}
            onAction={handleFlowerAction}
          />
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 right-4" />
    </Carousel>
  )
}
