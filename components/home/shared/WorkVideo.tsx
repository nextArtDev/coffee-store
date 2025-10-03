'use client'
import React from 'react'
// import FixedVideoPlay from './FixedVideoPlay'
// import heroImage from '../../../public/images/hero-image.webp'
import { RevealText } from '@/components/shared/reveal-text'
import { FadeIn } from '@/components/shared/fade-in'
import GlassSurface from '@/components/shared/glass-surface/GlassSurface'
import { motion, Variants } from 'framer-motion'
import { CategoryWithStats } from '@/lib/types/home'
import { TransitionLink } from './TransitionLink'
// import { FixedMotionImage } from '../hero/fixed-motion-image'
// import Image from 'next/image'
const WorkVideo = ({ categories }: { categories: CategoryWithStats[] }) => {
  const listContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Slower stagger
        delayChildren: 0.2, // More delay
      },
    },
  }

  const listItemVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 }, // Use scale instead of y movement
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }
  return (
    <section className="w-full py-12 flex flex-col items-center justify-center mx-auto gap-12  text-center">
      <div className="  w-[90vw] m-w-xl flex flex-col items-center mx-auto gap-4">
        <RevealText
          text="طعم و مزه متفاوت: طبیعت در ذهن شما"
          id="work-video"
          className="text-xl pt-12 md:text-3xl font-bold uppercase  text-center"
          staggerAmount={0.2}
          duration={0.8}
        />

        <FadeIn
          className=" translate-y-8 "
          vars={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="max-w-md mx-auto text-pretty text-center">
            {/* ما در ساخت مصنوعات قهوهی، که نیازمند ظرافتی مثال‌زدنی است، متخصص
            هستیم و توجهی ویژه به انتخاب مواد اولیه خود داریم. تمامی مجموعه‌های
            ما تنها از قهوه تمام‌دانه — که اصیل‌ترین و مرغوب‌ترین نوع قهوه طبیعی
            است — ساخته می‌شوند. */}
            قهوه‌های ما از دل طبیعت و با بالاترین کیفیت تجربه‌ای متفاوت را برای
            شما رقم خواهد زد.
          </p>
        </FadeIn>
      </div>
      <div className="relative w-full aspect-video max-h-[600px] max-w-5xl mx-auto px-4">
        {/* <FixedVideoPlay
            className="relative bg-transparent w-full  rounded-xl overflow-hidden"
            videoUrl="/videos/vid1.webm"
          >
            <span></span>
          </FixedVideoPlay> */}
        {/* <FixedMotionImage
            imageUrl={heroImage.src}
            imageAlt="Coffee Store"
            // priority={true}
            // quality={95}
            // overlayClassNames="bg-gradient-to-b from-black/20 via-black/40 to-black/60"
            overlayClassNames="!bg-transparent absolute inset-0 w-full h-full"
          >
            {''}
          </FixedMotionImage> */}
        {/* <Image src={heroImage.src} fill alt="" className="object-cover" />
         */}
        <section className="w-full gap-2 dark:bg-black bg-white border rounded-lg overflow-hidden ">
          <figure
            className="relative h-[70vh] bg-fixed bg-cover bg-center origin-right  "
            style={{
              backgroundImage: "url('/images/couple.webp')",

              // maskImage: "url('/images/hero-image.webp')",

              maskSize: 'contain',

              maskRepeat: 'no-repeat',

              maskPosition: 'center',
            }}
          >
            {/* <div className="absolute inset-0 bg-gradient-to-b from-secondary to-secondary opacity-30" /> */}
          </figure>
        </section>

        <motion.div
          className="p-2"
          initial="hidden"
          animate="visible"
          variants={listContainerVariants}
        >
          <motion.ul
            className="absolute inset-0 z-10  max-w-3xl mx-auto  space-y-2 w-full h-full   flex justify-evenly items-center flex-wrap gap-0.5 place-content-center py-10 min-h-[50dvh] place-items-center"
            variants={listContainerVariants}
          >
            {categories?.map((category) => (
              <motion.li
                key={category.id}
                className=" relative w-[25%] aspect-square grid grid-rows-1 place-content-center place-items-center rounded-md text-black dark:text-white text-xs sm:text-sm md:text-md cursor-pointer"
                variants={listItemVariants}
              >
                <TransitionLink
                  href={`/categories/${category.url}`}
                  className="z-[1] absolute inset-0 flex items-center justify-center "
                >
                  <GlassSurface
                    // key={'carousel'}
                    width={'100%'}
                    height={'100%'}
                    // borderRadius={999}
                    borderWidth={0.07}
                    brightness={50}
                    opacity={0.5}
                    blur={1}
                    displace={10}
                    backgroundOpacity={0}
                    saturation={1}
                    distortionScale={-180}
                    className="p-1 text-accent !rounded-xl aspect-square font-bold text-center text-2xl "
                  >
                    {' '}
                    {category.name}
                  </GlassSurface>
                </TransitionLink>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  )
}

export default WorkVideo
