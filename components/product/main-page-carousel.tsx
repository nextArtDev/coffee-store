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
import SliderFlowerButton from './SliderFlowerButton'
import { SingleStarRating } from '../home/testemonial/SingleStartRating'

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
      className="pl-1.5 mx-auto basis-6/7  md:basis-3/7 lg:basis-1/3 xl:basics-1/4 2xl:basis-1/5 w-full"
    >
      <FadeIn
        className="translate-y-5"
        vars={{ delay: 0.2 * index, duration: 0.3, ease: 'sine.inOut' }}
      >
        <div className="relative border px-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-md">
          {!!item.images && (
            <TransitionLink
              href={`/products/${item.slug}`}
              className="flex flex-col items-center justify-center border-none rounded-xl bg-transparent gap-4"
            >
              <div className="absolute w-fit h-fit top-[10%] right-6 z-[1]  ">
                <GlassSurface
                  // width={'100%'}
                  // height={'auto'}
                  borderRadius={999}
                  borderWidth={0.8}
                  brightness={50}
                  opacity={0.93}
                  blur={11}
                  displace={1}
                  backgroundOpacity={0}
                  saturation={1}
                  distortionScale={-180}
                  key={'characteristics'}
                  className="!px-2 !py-1 !w-fit !h-fit !bg-muted/10  rounded-full  "
                >
                  <div className="flex flex-col text-center gap-1">
                    <p className="font-semibold  text-xs md:text-sm lg:text-base">
                      {item.category!.name}
                    </p>
                    <p className="font-bold text-white">{item.name!}</p>
                  </div>
                </GlassSurface>
              </div>
              <div className="absolute w-fit h-fit bottom-[10%] left-6  z-[1] ">
                <GlassSurface
                  // width={'100%'}
                  // height={'100%'}
                  borderRadius={999}
                  borderWidth={0.8}
                  brightness={50}
                  opacity={0.93}
                  blur={11}
                  displace={1}
                  backgroundOpacity={0}
                  saturation={1}
                  distortionScale={-180}
                  key={'characteristics'}
                  className="!p-0 !w-fit !h-fit !bg-accent  rounded-full "
                >
                  {!!item.variants && (
                    <>
                      {item.variants.map((variant, i) => (
                        <div
                          key={i}
                          className="flex flex-col-reverse items-center gap-1"
                        >
                          {!!variant.discount && (
                            <p className="text-background">
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
                </GlassSurface>
              </div>
              <article className="absolute w-full h-fit top-[15%] left-4  ">
                {/* <p className="font-bold">{item.name}</p> */}
                {avgRating && (
                  <div className="flex gap-0.5 items-center text-accent">
                    <SingleStarRating
                      // disabled
                      // allowHalfStars={true}
                      rating={Number(avgRating)}
                    />
                    {Number(avgRating)} از {item.reviews?.length} نظر
                  </div>
                )}
              </article>
              <figure className="relative w-full !p-0 border-none rounded-xl min-h-[450px] ">
                <Image
                  unoptimized
                  src={
                    item.images.map((img) => img.url)[0] ||
                    '/images/fallback-image.webp'
                  }
                  fill
                  alt={item.name!}
                  className="object-contain rounded-xl scale-55 hover:scale-75 transition-transform duration-500 ease-in-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  priority={index < 4} // Prioritize first 4 images (visible on load)
                  quality={85} // Slightly reduced quality for faster loading
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </figure>

              <SliderFlowerButton
                item={item}
                isVisible={isInViewport}
                // onAction={onAction}
              />
              {/* <div className="absolute left-0 bottom-0 flex w-fit h-fit items-center justify-center gap-4"></div> */}
            </TransitionLink>
          )}

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
