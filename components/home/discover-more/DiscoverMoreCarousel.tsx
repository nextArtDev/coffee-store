'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Image from 'next/image'
import React, { useRef } from 'react'
// import { CategoryWithStats } from '@/lib/types/home'
import Autoplay from 'embla-carousel-autoplay'
// import { SubCategory } from '@/lib/generated/prisma'
import { SubCategoryForHomePage } from '@/lib/types/home'
import { FadeIn } from '@/components/shared/fade-in'
import { useInView } from 'framer-motion'
import { TransitionLink } from '../shared/TransitionLink'
import GlassSurface from '@/components/shared/glass-surface/GlassSurface'

export default function DiscoverMoreCarousel({
  subCategories,
}: {
  subCategories: SubCategoryForHomePage[]
}) {
  const carouselRef = useRef(null)

  const isInView = useInView(carouselRef, { once: true, amount: 0.3 })
  return (
    <section className="w-full h-full">
      <Carousel
        opts={{
          align: 'start',
          direction: 'rtl',
          loop: true, // Added for infinite looping; remove if not wanted
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
        ref={carouselRef}
        dir="rtl"
        className="w-full"
      >
        <CarouselContent className=" ">
          {subCategories.map((item, i) => (
            <CarouselItem
              key={item.id}
              // className="pr-1 basis-4/5 md:basis-2/3 xl:basis-1/4 w-full mx-auto"
              className="pl-1.5 mx-auto basis-6/7  md:basis-3/7 lg:basis-1/3 xl:basics-1/4 2xl:basis-1/5 w-full " // Adjusted for better responsiveness
            >
              <FadeIn
                vars={{ delay: 0.2 * i, duration: 0.5, ease: 'sine.inOut' }}
              >
                <GlassSurface
                  borderWidth={0.8}
                  brightness={50}
                  opacity={0.93}
                  blur={11}
                  displace={1}
                  backgroundOpacity={0}
                  saturation={1}
                  distortionScale={-180}
                  key={'characteristics'}
                  className="!p-1 min-w-xs !h-full aspect-square"
                >
                  <figure className="relative w-full h-full  border-none rounded-none">
                    <Image
                      unoptimized
                      src={
                        item.images.map((img) => img.url)[0] ||
                        '/images/fallback-image.webp'
                      }
                      fill
                      alt={item.name}
                      className="object-cover rounded-xl" // Uncommented; remove if not needed
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      quality={85} // Slightly reduced quality for faster loading
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                      <GlassSurface
                        borderWidth={0.8}
                        brightness={50}
                        opacity={0.93}
                        blur={11}
                        displace={1}
                        backgroundOpacity={0}
                        saturation={1}
                        distortionScale={-180}
                        key={'characteristics'}
                        className="!absolute !w-fit !h-fit z-10 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-secondary/5 to-secondary/20 px-2 py-3 text-center text-2xl font-semibold text-secondary hover:scale-105 transition-transform duration-300 ease-in-out rounded-lg"
                      >
                        <TransitionLink
                          href={`/sub-categories/${item.url}`}
                          className="mix-blend-darken "
                        >
                          دیدن {item.name}
                        </TransitionLink>
                      </GlassSurface>
                    </div>
                  </figure>
                </GlassSurface>
              </FadeIn>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
