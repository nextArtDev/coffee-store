'use client'
//nyxbui.design/docs/components/star-rating

import type { Dispatch, SetStateAction } from 'react'
import React from 'react'
import type { LucideIcon, LucideProps } from 'lucide-react'
import { StarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarWrapperProps {
  value?: number
  setValue?: Dispatch<SetStateAction<number>>
  numStars?: number
  icon?: LucideIcon
  disabled?: boolean
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>
  iconProps?: LucideProps
  showcase?: boolean
  allowHalfStars?: boolean
  precision?: number
}

function StarRating({
  numStars = 5,
  icon,
  setValue,
  value = 0,
  disabled = false,
  showcase = false,
  allowHalfStars = false,
  precision = 0.5,
  iconProps = {},
  wrapperProps = {},
}: StarWrapperProps) {
  const { className: wrapperClassName, ...restWrapperProps } = wrapperProps
  const { className: iconClassName, ...restIconProps } = iconProps
  const IconComponent = icon

  const handleStarClick = (
    starIndex: number,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (showcase || disabled || !setValue) return

    if (allowHalfStars) {
      const rect = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const starWidth = rect.width
      const isLeftHalf = clickX < starWidth / 2

      const newValue = starIndex + (isLeftHalf ? 0.5 : 1)
      setValue(Math.round(newValue / precision) * precision)
    } else {
      setValue(starIndex + 1)
    }
  }

  const getStarFill = (starIndex: number): 'full' | 'half' | 'empty' => {
    const starValue = starIndex + 1

    if (value >= starValue) {
      return 'full'
    } else if (allowHalfStars && value >= starValue - 0.5) {
      return 'half'
    } else {
      return 'empty'
    }
  }

  return (
    <div
      dir="ltr"
      className={cn('flex items-center gap-1', wrapperClassName)}
      {...restWrapperProps}
    >
      {Array.from({ length: numStars }, (_, i) => {
        const fillType = getStarFill(i)
        const isInteractive = !disabled && !showcase

        return (
          <div
            key={i}
            className={cn('relative', {
              'cursor-pointer': isInteractive,
            })}
            onClick={(e) => handleStarClick(i, e)}
          >
            {fillType === 'empty' ? (
              // Empty star
              IconComponent ? (
                <IconComponent
                  className={cn(
                    'fill-transparent stroke-muted/30 size-6',
                    {
                      'opacity-70': disabled,
                      'transition-transform duration-300 hover:scale-110':
                        isInteractive,
                    },
                    iconClassName
                  )}
                  {...restIconProps}
                />
              ) : (
                <StarIcon
                  className={cn(
                    'fill-transparent stroke-muted/30 size-6',
                    {
                      'opacity-70': disabled,
                      'transition-transform duration-300 hover:scale-110':
                        isInteractive,
                    },
                    iconClassName
                  )}
                  {...restIconProps}
                />
              )
            ) : fillType === 'full' ? (
              // Full star
              IconComponent ? (
                <IconComponent
                  className={cn(
                    'fill-accent stroke-accent size-6',
                    {
                      'opacity-70': disabled,
                      'transition-transform duration-300 hover:scale-110':
                        isInteractive,
                    },
                    iconClassName
                  )}
                  {...restIconProps}
                />
              ) : (
                <StarIcon
                  className={cn(
                    'fill-accent stroke-accent size-6',
                    {
                      'opacity-70': disabled,
                      'transition-transform duration-300 hover:scale-110':
                        isInteractive,
                    },
                    iconClassName
                  )}
                  {...restIconProps}
                />
              )
            ) : (
              // Half star - use CSS mask for precise half fill
              <div className="relative">
                {/* Background empty star */}
                {IconComponent ? (
                  <IconComponent
                    className={cn(
                      'fill-transparent stroke-muted/30 size-6',
                      {
                        'opacity-70': disabled,
                        'transition-transform duration-300 hover:scale-110':
                          isInteractive,
                      },
                      iconClassName
                    )}
                    {...restIconProps}
                  />
                ) : (
                  <StarIcon
                    className={cn(
                      'fill-transparent stroke-muted/30 size-6',
                      {
                        'opacity-70': disabled,
                        'transition-transform duration-300 hover:scale-110':
                          isInteractive,
                      },
                      iconClassName
                    )}
                    {...restIconProps}
                  />
                )}

                {/* Half-filled overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
                    overflow: 'hidden',
                  }}
                >
                  {IconComponent ? (
                    <IconComponent
                      className={cn(
                        'fill-accent stroke-accent size-6',
                        {
                          'opacity-70': disabled,
                        },
                        iconClassName
                      )}
                      {...restIconProps}
                    />
                  ) : (
                    <StarIcon
                      className={cn(
                        'fill-primary stroke-primary size-6',
                        {
                          'opacity-70': disabled,
                        },
                        iconClassName
                      )}
                      {...restIconProps}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { StarRating }
export type { StarWrapperProps }

// import * as React from 'react'
// import { Heart } from 'lucide-react'
// import { StarRating } from '~/components/ui/star-rating'

// export function StarRatingIcon() {
//   const [value, setValue] = React.useState<number>(3)
//   return <StarRating value={value} setValue={setValue} icon={Heart} />
// }
