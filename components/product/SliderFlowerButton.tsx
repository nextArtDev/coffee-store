'use client'
import { FC, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HomepageProduct } from '@/lib/types/home'
import DonutChart from '../shared/widget/donate-chart'
import GlassSurface from '../shared/glass-surface/GlassSurface'

interface SliderFlowerButtonProps {
  item: Partial<HomepageProduct>
  isVisible?: boolean
}

const SliderFlowerButton: FC<SliderFlowerButtonProps> = ({
  item,
  isVisible,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuItems = []
  if (item.coffeeCharacteristics) {
    const { acidity, bitterness, sweetness, body } = item.coffeeCharacteristics
    menuItems.push(
      { label: 'اسیدیته', value: acidity },
      { label: 'روشنایی', value: bitterness },
      { label: 'شیرینی', value: sweetness },
      { label: 'بادی', value: body }
    )
  } else if (item.chocolateCharacteristics) {
    const { sweetness, bitterness, acidity, fruitiness, cocoaPercentage } =
      item.chocolateCharacteristics
    menuItems.push(
      { label: 'کاکائو', value: Number(cocoaPercentage) / 10 },
      { label: 'اسیدیته', value: acidity },
      { label: 'تاریکی', value: bitterness },
      { label: 'شیرینی', value: sweetness },
      { label: 'میوه‌ای', value: fruitiness }
    )
  }
  // if(item.c)
  // Auto-open when slide comes into view, close when goes out of view
  useEffect(() => {
    if (isVisible) {
      // Small delay to allow slide transition to complete
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setIsOpen(false)
    }
  }, [isVisible])

  // console.log({ item })
  // const handleAction = (action: string, event?: React.MouseEvent) => {
  //   if (event) {
  //     event.preventDefault()
  //     event.stopPropagation()
  //   }
  //   if (onAction) {
  //     onAction(action, item)
  //   }
  //   setIsOpen(false) // Close menu after action
  // }
  const positions = calculateCirclePositions({ itemCount: menuItems.length })
  const handleToggle = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (
    <AnimatePresence>
      {isVisible && menuItems.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'circIn' }}
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
        >
          {/* Main Toggle Button */}
          <div className="relative">
            <button
              onClick={handleToggle}
              className="w-12 h-12 bg-black/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-all duration-300 shadow-lg"
            >
              <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </motion.div>
            </button>

            {/* Action Buttons */}
            <AnimatePresence>
              {isOpen &&
                menuItems.map((menuItem, index) => (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: positions[index].x,
                      y: positions[index].y,
                    }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    // onClick={(e) => handleAction('addToCart', e)}
                    key={menuItem.label}
                    // item={menuItem}
                    // position={positions[index]}
                    // index={index}
                    // isOpen={isOpen}
                    // onAction={handleAction}
                    // className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[70] h-[70]   backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white  bg-green-500/90 transition-all duration-200 shadow-lg"
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[70] h-[70]   backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white  transition-all duration-200 shadow-lg"
                    title="Add to Cart"
                  >
                    <DonutChart
                      progress={Number(menuItem.value) * 10}
                      circleWidth={8}
                      progressWidth={8}
                      size={90}
                      gradientColors={['#2c1b06', '#804e05', '#ddb58f']}
                      className="p-0 relative flex items-center justify-center text-[#2c1b06]"
                      trackClassName="text-green-500/50 text-green-100/30"
                    >
                      <GlassSurface
                        width={70}
                        height={70}
                        key={menuItem.label}
                        borderRadius={999}
                        borderWidth={0.07}
                        brightness={50}
                        opacity={0.93}
                        blur={15}
                        displace={50}
                        backgroundOpacity={0.2}
                        saturation={2}
                        distortionScale={-180}
                        className="p-1 rounded-full aspect-square text-foreground"
                      >
                        {/* <item.icon className="absolute" size={24} /> */}
                        <span className="absolute flex flex-col gap-0.25 font-semibold  ">
                          <p>{menuItem.label}</p>
                          <p>{Number(menuItem.value) * 10}%</p>
                        </span>
                      </GlassSurface>
                    </DonutChart>
                  </motion.button>
                ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export default SliderFlowerButton

const calculateCirclePositions = ({
  itemCount,
  radius = 90,
}: {
  itemCount: number
  radius?: number
}) => {
  const positions = []
  const angleStep = (2 * Math.PI) / itemCount
  const startAngle = -Math.PI / 2 // Start from top

  for (let i = 0; i < itemCount; i++) {
    const angle = startAngle + angleStep * i
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    positions.push({ x, y })
  }
  // console.log({ itemCount })
  // console.log({ positions })
  return positions
}
