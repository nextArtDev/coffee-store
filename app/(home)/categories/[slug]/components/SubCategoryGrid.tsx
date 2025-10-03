'use client'
import { TransitionLink } from '@/components/home/shared/TransitionLink'
import GlassSurface from '@/components/shared/glass-surface/GlassSurface'
import { SubCategoryInfo } from '@/lib/types/home'
import { motion, Variants } from 'framer-motion'
import { FC } from 'react'

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

interface SubCategoryGridProps {
  subCategories: (SubCategoryInfo & { images: { url: string }[] | null })[]
}

const SubCategoryGrid: FC<SubCategoryGridProps> = ({ subCategories }) => {
  return (
    <div>
      <motion.div
        className="p-2"
        initial="hidden"
        animate="visible"
        variants={listContainerVariants}
      >
        <motion.ul
          className="absolute inset-0   max-w-3xl mx-auto  space-y-2 w-full   flex justify-evenly items-center flex-wrap gap-0.5 place-content-center  place-items-center"
          variants={listContainerVariants}
        >
          {subCategories?.map((subcategory) => (
            <motion.li
              key={subcategory.id}
              className=" relative w-[25%] aspect-square   place-content-center place-items-center rounded-md text-black dark:text-white text-xs sm:text-sm md:text-md cursor-pointer"
              variants={listItemVariants}
            >
              <TransitionLink
                href={`/sub-categories/${subcategory.url}`}
                className="  absolute inset-0 flex items-center justify-center "
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
                  className="p-1   !rounded-xl aspect-square font-bold text-center text-2xl "
                >
                  {' '}
                  {subcategory.name}
                </GlassSurface>
              </TransitionLink>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  )
}

export default SubCategoryGrid
