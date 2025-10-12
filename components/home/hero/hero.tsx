import React from 'react'
import { Bounded } from '@/components/shared/Bounded'
// import Image from 'next/image'
import heroImage from '../../../public/images/beans.webp'
// import heroImage from '../../../public/images/bg.jpg'

import { FadeIn } from '@/components/shared/fade-in'
// import { RevealText } from '@/components/shared/reveal-text'
import { SubCategoryForHomePage } from '@/lib/types/home'
import { TransitionLink } from '../shared/TransitionLink'
import { FixedMotionImage } from './fixed-motion-image'
import LustreText from '../shared/lustre-text'
import GlassSurface from '@/components/shared/glass-surface/GlassSurface'
// import Image from 'next/image'

const Hero = ({
  subCategories,
}: {
  subCategories: SubCategoryForHomePage[]
}) => {
  return (
    <Bounded
      className={`relative w-full h-full  overflow-hidden  backdrop-blur-lg text-background  text-center`}
    >
      <FadeIn
        vars={{ scale: 1, opacity: 0.5 }}
        className=" absolute inset-0   min-h-svh origin-top lg:h-svh motion-safe:scale-125 motion-reduce:opacity-50 "
      >
        <FixedMotionImage
          imageUrl={heroImage.src}
          imageAlt="Coffee Store"
          priority={true}
          // quality={100}
          // overlayClassNames="bg-gradient-to-b from-black/20 via-black/40 to-black/60"
          overlayClassNames="!bg-transparent"
        >
          {' '}
        </FixedMotionImage>
        {/* <Image
          unoptimized
          src={heroImage}
          priority
          fetchPriority="high"
          alt="hero image"
          fill
          className="object-cover origin-top "
        /> */}
      </FadeIn>
      <div className="relative flex h-screen flex-col justify-center items-center">
        {/* <RevealText
          // text="Effortless Elegance"
          text="فروشگاه قهوه"
          id="hero-heading"
          className="font-display max-w-xl text-6xl leading-none text-neutral-50 md:text-7xl lg:text-8xl"
          staggerAmount={0.2}
          duration={1.7}
        /> */}
        <LustreText
          text="فروشگاه قهوه"
          className="font-display max-w-xl text-6xl leading-none !mix-blend-difference md:text-7xl lg:text-8xl"
        />
        <FadeIn
          // important factor to go up or down: translate-y-8
          className="mt-6 max-w-md translate-y-8  text-lg text-neutral-100"
          vars={{ delay: 1, duration: 1.3 }}
        >
          <p className=" ">
            عرضه انواع قهوه، تجهیزات و لوازم جانبی مرتبط و ارسال به سراسر نقاط
            ایران
          </p>
        </FadeIn>

        <FadeIn
          className="mt-8 translate-y-15"
          vars={{ delay: 1.5, duration: 1.1 }}
        >
          <TransitionLink href={'/products'} className=" ">
            <GlassSurface
              // width={'100%'}
              // height={'100%'}
              // borderRadius={999}
              borderWidth={0.8}
              brightness={70}
              opacity={0.9}
              blur={15}
              displace={1}
              backgroundOpacity={0.2}
              saturation={1}
              distortionScale={-140}
              key={'products-link'}
              className="w-fit inline-flex items-center justify-center px-12 py-4 text-center font-extrabold tracking-wider uppercase transition-all duration-300  border border-white text-white hover:bg-white/20 hover:scale-[1.03] active:scale-95 !rounded-xl "
            >
              محصولات
            </GlassSurface>
          </TransitionLink>
        </FadeIn>
        <FadeIn
          className="mt-8 -translate-y-15"
          vars={{ delay: 1.5, duration: 1.1 }}
        >
          <article className="mt-12  text-secondary flex flex-wrap items-center justify-center">
            <ul className=" flex items-center justify-center w-full h-full gap-3 flex-wrap max-w-[70vw] mx-auto  md:gap-x-6">
              {subCategories?.map((sub, i) => (
                <li key={sub.id}>
                  <FadeIn
                    className="translate-y-10"
                    vars={{ delay: 0.2 * i, duration: 1, ease: 'sine.in' }}
                  >
                    <TransitionLink
                      href={`/sub-categories/${sub.url}`}
                      className=""
                    >
                      <GlassSurface
                        // width={'100%'}
                        // height={'100%'}
                        // borderRadius={999}
                        borderWidth={0.8}
                        brightness={30}
                        opacity={0.7}
                        blur={15}
                        displace={1}
                        backgroundOpacity={0.6}
                        saturation={1.5}
                        distortionScale={140}
                        key={'products-link'}
                        className="!w-fit !h-fit inline-flex items-center justify-center !px-3 !py-1 text-center font-extrabold tracking-wider uppercase transition-all duration-300  border border-white text-white hover:scale-[1.03] active:scale-95 !rounded-xl "
                      >
                        {sub.name}
                      </GlassSurface>
                    </TransitionLink>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </article>
        </FadeIn>
      </div>
    </Bounded>
  )
}

export default Hero
