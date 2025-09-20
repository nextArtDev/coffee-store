'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { HomepageProduct } from '@/lib/types/home'
import { FadeIn } from '../shared/fade-in'
import { useInView } from 'framer-motion'
import { motion, AnimatePresence } from 'framer-motion'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '@/lib/utils'
import { TransitionLink } from '../home/shared/TransitionLink'
import { ExternalLink } from 'lucide-react'

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

export default function ExpandableCardCarousel({ items }: MainPageCarousel) {
  const carouselRef = useRef(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const isInView = useInView(carouselRef, { once: true, amount: 0.3 })

  const handleCardClick = (cardId: string) => {
    setSelectedCard(selectedCard === cardId ? null : cardId)
  }

  return (
    <Carousel
      opts={{
        align: 'start',
        direction: 'rtl',
        loop: true,
      }}
      plugins={
        isInView && !selectedCard
          ? [
              Autoplay({
                delay: 3000,
              }),
            ]
          : []
      }
      dir="rtl"
      className="w-full"
      ref={carouselRef}
    >
      <CarouselContent className="-ml-1 md:-ml-2 xl:-ml-4">
        {items.map((item, i) => {
          const isSelected = selectedCard === item.id
          const isAnySelected = selectedCard !== null

          return (
            <CarouselItem
              key={item.id}
              className={cn(
                'pl-1 md:pl-2 xl:pl-4 transition-all duration-700 ease-out',
                isSelected
                  ? 'basis-3/4 md:basis-1/2 lg:basis-2/5'
                  : isAnySelected
                  ? 'basis-1/6 md:basis-1/8 lg:basis-1/12'
                  : 'basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5'
              )}
            >
              <FadeIn
                className="translate-y-5"
                vars={{ delay: 0.2 * i, duration: 0.3, ease: 'sine.inOut' }}
              >
                <motion.div
                  onClick={() => handleCardClick(item.id!)}
                  className="relative h-80 md:h-96 rounded-xl overflow-hidden cursor-pointer group bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -2 }}
                  layout
                >
                  {/* Background Image */}
                  {!!item.images && (
                    <div className="absolute inset-0">
                      <Image
                        unoptimized
                        src={
                          item.images.map((img) => img.url)[0] ||
                          '/images/fallback-image.webp'
                        }
                        fill
                        alt={item.name!}
                        className="object-cover mix-blend-darken transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-4 text-white">
                    {/* Collapsed state content */}
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isSelected ? 0 : 1,
                        y: isSelected ? 20 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        'space-y-2',
                        isSelected && 'pointer-events-none'
                      )}
                    >
                      <p className="text-xs md:text-sm font-medium opacity-90">
                        {item.category?.name}
                      </p>
                      <h3 className="font-bold text-sm md:text-base line-clamp-2">
                        {item.name}
                      </h3>
                      {!!item.variants && (
                        <div className="space-y-1">
                          {item.variants.slice(0, 1).map((variant, i) => (
                            <div key={i} className="flex items-center gap-2">
                              {!!variant.discount && (
                                <p className="text-yellow-300 font-semibold text-sm">
                                  {variant.price -
                                    variant.price *
                                      (variant.discount / 100)}{' '}
                                  تومان
                                </p>
                              )}
                              <p
                                className={cn(
                                  'text-sm font-medium',
                                  variant.discount && 'line-through opacity-70'
                                )}
                              >
                                {variant.price} تومان
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>

                    {/* Expanded state content */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 30 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-t from-black/90 via-black/60 to-black/30"
                        >
                          {/* Header */}
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-yellow-300">
                              {item.category?.name}
                            </p>
                            <h2 className="text-xl md:text-2xl font-bold leading-tight">
                              {item.name}
                            </h2>

                            {/* Description */}
                            {item.description && (
                              <div
                                className="text-sm opacity-90 leading-relaxed line-clamp-4"
                                dangerouslySetInnerHTML={{
                                  __html: item.description,
                                }}
                              />
                            )}
                          </div>

                          {/* Footer */}
                          <div className="space-y-4">
                            {/* Price */}
                            {!!item.variants && (
                              <div className="space-y-2">
                                {item.variants.map((variant, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-3"
                                  >
                                    {!!variant.discount && (
                                      <div className="flex items-center gap-2">
                                        <p className="text-xl font-bold text-yellow-300">
                                          {variant.price -
                                            variant.price *
                                              (variant.discount / 100)}{' '}
                                          تومان
                                        </p>
                                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                                          -{variant.discount}%
                                        </span>
                                      </div>
                                    )}
                                    <p
                                      className={cn(
                                        'font-semibold',
                                        variant.discount
                                          ? 'line-through opacity-60 text-sm'
                                          : 'text-xl text-yellow-300'
                                      )}
                                    >
                                      {variant.price} تومان
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Action Button */}
                            <TransitionLink
                              href={`/products/${item.slug}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors w-fit"
                              onClick={(e) => e.stopPropagation()}
                            >
                              مشاهده محصول
                              <ExternalLink size={16} />
                            </TransitionLink>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Expansion indicator */}
                  <div className="absolute top-4 left-4">
                    <motion.div
                      animate={{ rotate: isSelected ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                  </div>
                </motion.div>
              </FadeIn>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 right-4" />
    </Carousel>
  )
}
