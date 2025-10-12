'use client'
import * as React from 'react'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import RotatingCan from './CanSpinning'
import { cn } from '@/lib/utils'

type SlideData = {
  backgroundUrl: string
  backgroundColor?: string
  canMockup: string
  canTexture: string
  canWidth?: number
  canAspectRatio?: string
}

type Props = {
  slides: SlideData[]
}

const HeroCarousel = ({ slides }: Props) => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section className="relative w-full mx-auto">
      <Carousel
        setApi={setApi}
        opts={{ align: 'start', loop: true, skipSnaps: false }}
        plugins={[
          Autoplay({
            delay: 3000,
          }),
          Fade({
            // Optional: customize fade behavior
          }),
        ]}
        orientation="vertical"
        className=" relative min-h-dvh w-full h-dvh"
      >
        <CarouselContent className="!p-0 !m-0 h-dvh  w-full mx-auto ">
          {slides.map((slide, index) => (
            <CarouselItem
              key={`${slide.backgroundUrl}-${index}`}
              className="flex items-center justify-center w-full h-full"
            >
              <figure
                className={cn(
                  'border-none relative h-full w-full',
                  slide.backgroundColor
                )}
              >
                <Image
                  unoptimized
                  src={slide.backgroundUrl || '/images/fallback-image.webp'}
                  fill
                  alt="product"
                  className="object-cover"
                />
                <RotatingCan
                  mockupImage={slide.canMockup}
                  textureImage={slide.canTexture}
                  width={slide.canWidth}
                  aspectRatio={slide.canAspectRatio}
                  isActive={current === index}
                />
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}

export default HeroCarousel
