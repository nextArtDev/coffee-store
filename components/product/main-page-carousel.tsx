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
import GlassSurface from '../shared/glass-surface/GlassSurface'
import type { EmblaCarouselType } from 'embla-carousel'
import DonutChart from '../shared/widget/donate-chart'
import { StarRating } from '../home/testemonial/StarRating'

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

const calculateCirclePositions = ({
  itemCount,
  radius = 90,
}: {
  itemCount: number
  radius?: number
}) => {
  const positions = []
  const angleStep = (2 * Math.PI) / itemCount
  const startAngle = -Math.PI / 2 // Start from top

  for (let i = 0; i < itemCount; i++) {
    const angle = startAngle + angleStep * i
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    positions.push({ x, y })
  }
  // console.log({ itemCount })
  // console.log({ positions })
  return positions
}

// const CircleButton = ({
//   item,
//   position,
//   index,
//   isOpen,
//   onAction,
// }: {
//   index: number
//   isOpen: boolean
//   item: { label: string; value: number }
//   isVisible: boolean
//   position: { x: number; y: number }
//   onAction?: (action: string, item: Partial<HomepageProduct>) => void
// }) => {
//   const { label, value } = item

//   return (
//     <motion.button
//       initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
//       animate={{
//         opacity: 1,
//         scale: 1,
//         x: position.x,
//         y: position.y,
//       }}
//       exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
//       transition={{ duration: 0.2, delay: index * 0.05 }}
//       // onClick={(e) => onAction(label.toLowerCase().replace(' ', ''), e)}
//       // className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[70px] h-[70px] backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:${color} transition-all duration-200 shadow-lg`}
//       className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[70px] h-[70px] backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white  transition-all duration-200 shadow-lg`}
//       title={label}
//     >
//       <DonutChart
//         progress={value || 50}
//         circleWidth={8}
//         progressWidth={8}
//         size={90}
//         gradientColors={['#2c1b06', '#804e05', '#ddb58f']}
//         className="p-0 relative flex items-center justify-center text-[#2c1b06]"
//         trackClassName="text-green-500/50 text-green-100/30"
//       >
//         <GlassSurface
//           width={70}
//           height={70}
//           borderRadius={999}
//           borderWidth={0.07}
//           brightness={50}
//           opacity={0.93}
//           blur={15}
//           displace={0}
//           backgroundOpacity={0.2}
//           saturation={2}
//           distortionScale={-180}
//           className="p-1 rounded-full aspect-square"
//         >
//           <span className="absolute flex flex-col gap-0.5 font-semibold text-xs">
//             <p className="text-[8px] opacity-80">{label}</p>
//             <p className="text-sm">{value}%</p>
//           </span>
//         </GlassSurface>
//       </DonutChart>
//     </motion.button>
//   )
// }

// Individual Slide Flower Menu Button
const SlideFlowerButton = ({
  item,
  isVisible,
}: // onAction,
{
  item: Partial<HomepageProduct>
  isVisible: boolean
  // onAction?: (action: string, item: Partial<HomepageProduct>) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuItems = []
  if (item.coffeeCharacteristics) {
    const { acidity, bitterness, sweetness, body } = item.coffeeCharacteristics
    menuItems.push(
      { label: 'اسیدیته', value: acidity },
      { label: 'روشنایی', value: bitterness },
      { label: 'شیرینی', value: sweetness },
      { label: 'بادی', value: body }
    )
  } else if (item.chocolateCharacteristics) {
    const { sweetness, bitterness, acidity, fruitiness, cocoaPercentage } =
      item.chocolateCharacteristics
    menuItems.push(
      { label: 'کاکائو', value: Number(cocoaPercentage) / 10 },
      { label: 'اسیدیته', value: acidity },
      { label: 'تاریکی', value: bitterness },
      { label: 'شیرینی', value: sweetness },
      { label: 'میوه‌ای', value: fruitiness }
    )
  }
  // if(item.c)
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

  // console.log({ item })
  // const handleAction = (action: string, event?: React.MouseEvent) => {
  //   if (event) {
  //     event.preventDefault()
  //     event.stopPropagation()
  //   }
  //   if (onAction) {
  //     onAction(action, item)
  //   }
  //   setIsOpen(false) // Close menu after action
  // }
  const positions = calculateCirclePositions({ itemCount: menuItems.length })
  const handleToggle = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (
    <AnimatePresence>
      {isVisible && menuItems.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'circIn' }}
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
              {isOpen &&
                menuItems.map((menuItem, index) => (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: positions[index].x,
                      y: positions[index].y,
                    }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    // onClick={(e) => handleAction('addToCart', e)}
                    key={menuItem.label}
                    // item={menuItem}
                    // position={positions[index]}
                    // index={index}
                    // isOpen={isOpen}
                    // onAction={handleAction}
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[70] h-[70]   backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white  bg-green-500/90 transition-all duration-200 shadow-lg"
                    title="Add to Cart"
                  >
                    <DonutChart
                      progress={Number(menuItem.value) * 10}
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
                          <p>{menuItem.label}</p>
                          <p>{Number(menuItem.value) * 10}%</p>
                        </span>
                      </GlassSurface>
                    </DonutChart>
                  </motion.button>
                ))}

              {/* Add to Favorites */}
              {/* <motion.button
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x: -82, y: -42 }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                    onClick={(e) => handleAction('addToFavorites', e)}
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[70] h-[70]   backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-red-500/90 transition-all duration-200 shadow-lg"
                    title="Add to Favorites"
                  >
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
                        <span className="absolute flex flex-col gap-0.25 font-semibold">
                          <p>Free</p>
                          24%
                        </span>
                      </GlassSurface>
                    </DonutChart>
                  </motion.button> */}

              {/* Quick View */}
              {/* <motion.button
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: -90 }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    onClick={(e) => handleAction('quickView', e)}
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[70] h-[70]   backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-blue-500/90 transition-all duration-200 shadow-lg"
                    title="Quick View"
                  >
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
                        <span className="absolute flex flex-col gap-0.25 font-semibold">
                          <p>Free</p>
                          24%
                        </span>
                      </GlassSurface>
                    </DonutChart>
                  </motion.button> */}

              {/* Share */}
              {/* <motion.button
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x: 82, y: -42 }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.25 }}
                    onClick={(e) => handleAction('share', e)}
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[70] h-[70]   backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-purple-500/90 transition-all duration-200 shadow-lg"
                    title="Share"
                  >
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
                        <span className="absolute flex flex-col gap-0.25 font-semibold">
                          <p>Free</p>
                          24%
                        </span>
                      </GlassSurface>
                    </DonutChart>
                  </motion.button> */}

              {/* Compare */}
              {/* <motion.button
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x: 60, y: 50 }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    onClick={(e) => handleAction('compare', e)}
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[70] h-[70]   backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-orange-500/90 transition-all duration-200 shadow-lg"
                    title="Compare"
                  >
                    <DonutChart
                      progress={75}
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
                  
                        <span className="absolute flex flex-col gap-0.25 font-semibold">
                          <p>Free</p>
                          45%
                        </span>
                      </GlassSurface>
                    </DonutChart>
                  </motion.button> */}
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
}: // onAction,
{
  item: Partial<HomepageProduct>
  index: number
  isInViewport: boolean
  // onAction: (action: string, item: Partial<HomepageProduct>) => void
}) => {
  const avgRating = !!item.reviews?.length
    ? (
        item.reviews?.reduce((sum, review) => sum + review.rating, 0) /
        item.reviews?.length
      ).toFixed(1)
    : null

  return (
    <CarouselItem
      key={item.id}
      className="pl-1 basis-1/1 md:pl-2 md:basis-1/2 lg:basis-1/3 xl:pl-4 xl:basis-1/4"
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
              <figure className="relative w-full border-none rounded-xl h-[450px] ">
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
                  height={40}
                  borderRadius={999}
                  borderWidth={0.07}
                  brightness={50}
                  opacity={0.93}
                  blur={11}
                  displace={0}
                  backgroundOpacity={0}
                  saturation={1}
                  distortionScale={-180}
                  className="p-1 w-full  rounded-full aspect-square"
                >
                  {item.name!}
                </GlassSurface>
                <SlideFlowerButton
                  item={item}
                  isVisible={isInViewport}
                  // onAction={onAction}
                />
                <div className="absolute left-0 bottom-0 flex w-fit h-fit items-center gap-2"></div>
                <article className="absolute h-1/2 w-full bottom-0 flex flex-col gap-1 justify-evenly py-3 px-2 text-pretty text-xs md:text-sm lg:text-base rounded-b-md">
                  <p className="font-semibold">{item.category!.name}</p>
                  <p className="font-bold">{item.name}</p>
                  <div className="flex gap-0.5 items-center">
                    {avgRating && (
                      <StarRating disabled value={Number(avgRating)} />
                    )}
                    {Number(avgRating)} از {item.reviews?.length} نظر
                  </div>
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
        </div>
      </FadeIn>
    </CarouselItem>
  )
}

export default function MainPageCarousel({ items }: MainPageCarousel) {
  // console.log(items.map((pr) => pr.reviews?.map((rv) => rv.rating)))
  // const avgRating = !!reviews?.length
  //   ? (
  //       reviews?.reduce((sum, review) => sum + review.rating, 0) /
  //       reviews?.length
  //     ).toFixed(1)
  //   : null
  const carouselRef = useRef<HTMLDivElement>(null)
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // const handleFlowerAction = (
  //   action: string,
  //   item: Partial<HomepageProduct>
  // ) => {
  //   switch (action) {
  //     case 'addToCart':
  //       console.log('Adding to cart:', item)
  //       // Add your cart logic here
  //       break
  //     case 'addToFavorites':
  //       console.log('Adding to favorites:', item)
  //       // Add your favorites logic here
  //       break
  //     case 'quickView':
  //       console.log('Quick view:', item)
  //       // Add your quick view logic here
  //       break
  //     case 'share':
  //       console.log('Sharing:', item)
  //       // Add your share logic here
  //       break
  //     case 'compare':
  //       console.log('Adding to compare:', item)
  //       // Add your compare logic here
  //       break
  //   }
  // }

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
      className="w-full "
      ref={carouselRef}
      setApi={onInit}
    >
      <CarouselContent className=" -ml-1 md:-ml-2 xl:-ml-4 text-primary-foreground">
        {items.map((item, i) => (
          <CarouselItemComponent
            key={item.id}
            item={item}
            index={i}
            isInViewport={slidesInView.includes(i)}
            // onAction={handleFlowerAction}
          />
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 right-4" />
    </Carousel>
  )
}
