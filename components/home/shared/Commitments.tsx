'use client' // Added if not present in parent; required for client components
import { FadeIn } from '@/components/shared/fade-in'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import React, { useRef } from 'react'
import { useInView } from 'framer-motion'
import Autoplay from 'embla-carousel-autoplay'
import { RevealText } from '@/components/shared/reveal-text'
import GlassSurface from '@/components/shared/glass-surface/GlassSurface'

const items = [
  {
    id: '1',
    title: 'عشق به طعم اصیل قهوه',
    // Love for the Authentic Taste of Coffee
    description:
      'ما تنها از مرغوب‌ترین دانه‌های قهوه Single-Origin و ادغام‌های (Blend) ویژه استفاده می‌کنیم. این دانه‌ها با روش‌های برشته‌کاری دقیق و هنرمندانه، به نوشیدنی‌هایی با عطر و طعمی ماندگار و منحصربه‌فرد تبدیل می‌شوند که با گذر زمان در خاطره‌ها جاودان می‌مانند. تضمین می‌کنیم که هیچ‌یک از محصولات ما حاوی طعم‌دهنده‌ها یا اسانس‌های مصنوعی نیست.',
    // We use only the finest Single-Origin coffee beans and special blends. These beans are transformed into beverages with a lasting and unique aroma and flavor through precise and artistic roasting methods, becoming timeless in memories. We guarantee that none of our products contain artificial flavorings or essences.
    url: '/images/commit1.webp', // تصویر از دانه‌های قهوه برشته شده با عکس ماکرو یا یک باریستا در حال تست قهوه
  },
  {
    id: '2',
    title: 'تولید اخلاق‌مدار و پایدار',
    // Ethical and Sustainable Production
    description:
      'فرآیند برشته‌کاری و بسته‌بندی در کارخانه خودمان تحت شرایطی عادلانه و محترمانه انجام می‌شود. ما به محیط زیست و حقوق کشاورزان احترام می‌گذاریم و با خرید مستقیم از مزارع، از قهوه‌کاری پایدار حمایت می‌کنیم. در فرآیند تولید، از بسته‌بندی‌های سازگار با محیط زیست و کم‌آب‌بر استفاده کرده و ردپای کربن خود را به حداقل می‌رسانیم. قدم‌های کوچک ما برای آینده‌ای سبزتر.',
    // The roasting and packaging process is carried out in our own facility under fair and respectful conditions. We respect the environment and the rights of farmers, and by sourcing directly from farms, we support sustainable coffee farming. In the production process, we use eco-friendly, low-water-footprint packaging and minimize our carbon footprint. Our small steps for a greener future.
    url: '/images/commit2.webp', // تصویر از مزرعه قهوه یا داخل کارخانه برشته‌کاری مدرن و تمیز
  },
  {
    id: '3',
    title: 'توجه وسواس‌گونه به هنر باریستا',
    // Obsessive Attention to the Art of the Barista
    description:
      'به هیچ چیز جز کمال در یک فنجان قهوه راضی نیستیم. از انتخاب و آسیاب دانه‌ها تا دم‌آوری با دستگاه‌های اسپرسو و لاته‌آرت، تمامی مراحل با دقتی وسواس‌گونه و عشقی هنرمندانه انجام می‌گیرد. هر فنجان قهوه نه یک نوشیدنی ساده، که یک اثر هنری است که نام و سلیقه شما را بر خود دارد.',
    // We are satisfied with nothing less than perfection in a cup of coffee. From selecting and grinding the beans to brewing with espresso machines and latte art, all stages are carried out with obsessive precision and artistic love. Each cup of coffee is not just a simple beverage, but a work of art that bears your name and taste.
    url: '/images/commit3.webp', // تصویر از دستان یک باریستا در حال خلق لته‌آرت یا ماکرو از خروجی کرما (Crema) روی یک اسپرسو
  },
]
export default function Commitments() {
  const carouselRef = useRef(null)

  const isInView = useInView(carouselRef, { once: true, amount: 0.3 })
  return (
    <Carousel
      opts={{
        align: 'start',
        direction: 'rtl',
        // loop: true, // Added for infinite looping; remove if not wanted
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
      className="w-full "
    >
      <CarouselContent className=" ">
        {/* Responsive negative margin to offset item padding */}
        {items.map((item, i) => (
          <CarouselItem
            key={item.id}
            className="pl-1.5 mx-auto basis-2/3   sm:basis-1/2 md:basis-2/5 lg:basis-1/4 "
            /* Adjusted basis for better fit (e.g., 2 on mobile, 3 on md, 4 on lg, 5 on xl); made padding responsive */
          >
            <FadeIn
              className="translate-y-5"
              vars={{ delay: 0.2 * i, duration: 0.3, ease: 'sine.inOut' }}
            >
              <GlassSurface
                // width={'100%'}
                // height={'100%'}
                // borderRadius={999}
                borderWidth={0.8}
                brightness={20}
                opacity={0.4}
                blur={11}
                displace={1}
                backgroundOpacity={0}
                saturation={0.5}
                distortionScale={-280}
                key={'characteristics'}
                className=" !w-full !h-full"
              >
                <div className="flex w-full h-full flex-col  rounded-xl overflow-hidden gap-2 md:gap-4 ">
                  {/* Moved gap-4 here to space image and text */}
                  <figure className=" relative w-full aspect-square  border-none  ">
                    {/* Changed to figure for semantic; simplified, removed min-h to let aspect-square handle */}
                    <Image
                      unoptimized
                      src={item.url || '/images/fallback-image.webp'}
                      fill
                      alt={item.title}
                      className="object-cover mix-blend-darken  " // Uncommented; remove if not needed
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      quality={85} // Slightly reduced quality for faster loading
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </figure>
                  <article className="aspect-video  pt-3 px-2 text-pretty text-xs md:text-sm lg:text-base  text-right">
                    <RevealText
                      text={item.title}
                      id={item.title}
                      className="font-bold text-lg text-primary"
                      staggerAmount={0.2}
                      duration={0.8}
                    />
                    {/* <p className="font-bold text-lg">{item.title}</p> */}
                    <FadeIn
                      className=" translate-y-4 "
                      vars={{ delay: 0.6, duration: 0.6 }}
                    >
                      <p className="text-sm text-justify">{item.description}</p>
                    </FadeIn>
                  </article>
                </div>
              </GlassSurface>
            </FadeIn>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 right-4" />
    </Carousel>
  )
}
