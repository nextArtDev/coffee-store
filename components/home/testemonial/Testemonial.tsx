'use client'

import { AnimatePresence, motion, stagger } from 'framer-motion'
import { Dot } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatTimeToNow } from '@/lib/utils'
import GlassSurface from '@/components/shared/glass-surface/GlassSurface'
import { StarRating } from './StarRating'

// const testimonials = [
//   {
//     title: '',
//     description:
//       'First testimonial goes here. Praising your product or service and expressing satisfaction.',
//     user: 'Ansub',
//     rating: 4,
//     createdAt: '',
//   },
//   {
//     title:
//       'Another testimonial goes here. Praising your product or service and expressing satisfaction.',
//     description: 'Lex Collins',
//     user: 3,
//     rating: 3,
//     createdAt: 3,
//   },
//   {
//     title:
//       'Third testimonial goes here. Praising your product or service and expressing satisfaction.',
//     description: 'Alex Jones',
//     user: 5,
//     rating: 5,
//     createdAt: 5,
//   },
//   {
//     title:
//       'Fourth testimonial goes here. Praising your product or service and expressing satisfaction.',
//     description: 'John Doe',
//     user: 4,
//     rating: 4,
//     createdAt: 4,
//   },
// ]
interface TestimonialCarouselProps {
  testimonials?: {
    title: string
    description: string
    user: string
    rating: number
    createdAt: Date
  }[]
}
const TestimonialCarousel = ({ testimonials }: TestimonialCarouselProps) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!!testimonials?.length) {
        setCurrentTestimonial(
          (prevTestimonial) => (prevTestimonial + 1) % testimonials.length
        )
      }
    }, 4500) // Change Time here

    return () => {
      clearInterval(intervalId)
    }
  }, [testimonials?.length])

  if (!testimonials?.length) return
  // const { text, author, rating, created_time } =
  const { title, description, user, rating, createdAt } =
    testimonials?.[currentTestimonial]

  const variants = {
    initial: { opacity: 0, y: '100%', scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: '100%', scale: 0.9 },
  }
  const dotVariants = {
    active: { scale: 0.8, backgroundColor: '#202221' },
    inactive: { scale: 0.7, backgroundColor: '#8d8f8985' },
  }

  return (
    <section className="w-full mx-auto py-12 md:py-24 max-w-2xl">
      {/* <article className="relative overflow-hidden  px-8 py-10  w-[90vw] max-w-[90vh]  ">
       */}
      <GlassSurface
        width={'100%'}
        height={'100%'}
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
        className="relative overflow-hidden !rounded-md py-4 !w-[90vw] max-w-lg mx-auto"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentTestimonial}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            className=" flex w-full flex-col items-center ga-3 justify-center"
            transition={{
              // type: 'spring',
              // stiffness: 200,
              // damping: 20,
              // duration: 0.5,
              // delay: 0.1,
              duration: 0.25,
              delayChildren: stagger(0.25),
            }}
          >
            <motion.div
              dir="ltr"
              variants={variants}
              className="pb-4 flex gap-2 "
            >
              <StarRating value={rating} disabled allowHalfStars />
              {/* <SingleStarRating rating={rating} /> */}
              {/* <span className="font-semibold">{rating}</span>/5 */}
            </motion.div>
            <motion.p
              variants={variants}
              className="m-0 text-center text-primary text-sm md:text-base font-semibold tracking-tight line-clamp-1 md:line-clamp-2"
            >
              {title}
            </motion.p>
            <motion.p
              variants={variants}
              className="m-0 text-center  text-sm md:text-base font-medium tracking-tight line-clamp-7 md:line-clamp-5  py-6 px-2 text-muted-foreground"
            >
              &quot;{description}&quot;
            </motion.p>
            <motion.div variants={variants} className="mx-auto mt-5">
              <div className="flex flex-col items-center justify-center space-x-3">
                {/* <div className="font-regular text-sm text-gray-900/80">
                  {author}
                </div> */}

                <div className="flex justify-center items-center">
                  <span dir="ltr" className=" text-[1rem] ">{`${user.slice(
                    0,
                    5
                  )}...${user.slice(-3)}`}</span>
                  <Dot className="" />

                  <span className=" text-xs md:text-sm ">
                    {formatTimeToNow(new Date(createdAt))}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </GlassSurface>
      <div className="mt-8 flex justify-center">
        {testimonials?.map((_, index) => (
          <motion.div
            key={index}
            className="mx-0.5 h-3  w-3  cursor-pointer rounded-full"
            variants={dotVariants}
            animate={index === currentTestimonial ? 'active' : 'inactive'}
            onClick={() => setCurrentTestimonial(index)}
          />
        ))}
      </div>
    </section>
  )
}

export default TestimonialCarousel
