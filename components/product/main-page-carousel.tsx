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
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  priority={index < 4} // Prioritize first 4 images (visible on load)
                  quality={85} // Slightly reduced quality for faster loading
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
