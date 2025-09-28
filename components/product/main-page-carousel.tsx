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
import { useInView } from 'framer-motion'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '@/lib/utils'
import { TransitionLink } from '../home/shared/TransitionLink'
import GlassSurface from '../shared/glass-surface/GlassSurface'
import type { EmblaCarouselType } from 'embla-carousel'
import { StarRating } from '../home/testemonial/StarRating'
import SliderFlowerButton from './SliderFlowerButton'

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
                  borderWidth={0.8}
                  brightness={50}
                  opacity={0.93}
                  blur={11}
                  displace={1}
                  backgroundOpacity={0}
                  saturation={1}
                  distortionScale={-180}
                  // key={'characteristics'}
                  className="p-1 w-full  rounded-full aspect-square text-white"
                >
                  {item.name!}
                </GlassSurface>
                <SliderFlowerButton
                  item={item}
                  isVisible={isInViewport}
                  // onAction={onAction}
                />
                <div className="absolute left-0 bottom-0 flex w-fit h-fit items-center gap-2"></div>
                <article className="absolute h-1/2 w-full bottom-0 flex flex-col gap-1 justify-evenly py-3 px-2 text-pretty text-xs md:text-sm lg:text-base rounded-b-md">
                  <p className="font-semibold">{item.category!.name}</p>
                  <p className="font-bold">{item.name}</p>
                  {avgRating && (
                    <div className="flex gap-0.5 items-center">
                      <StarRating
                        disabled
                        allowHalfStars={true}
                        value={Number(avgRating)}
                      />
                      {Number(avgRating)} از {item.reviews?.length} نظر
                    </div>
                  )}
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
