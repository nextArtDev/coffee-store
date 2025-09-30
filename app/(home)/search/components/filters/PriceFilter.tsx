'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { Slider } from '@/components/ui/slider' // Your existing slider
import { FiltersData } from '@/lib/types/home'

interface PriceFilterProps {
  filtersData: FiltersData
  selectedMinPrice?: number
  selectedMaxPrice?: number
  onPriceChange: (minPrice?: number, maxPrice?: number) => void
}

export default function PriceFilter({
  filtersData,
  selectedMinPrice,
  selectedMaxPrice,
  onPriceChange,
}: PriceFilterProps) {
  const [localMin, setLocalMin] = useState(
    selectedMinPrice || filtersData.priceRange.min
  )
  const [localMax, setLocalMax] = useState(
    selectedMaxPrice || filtersData.priceRange.max
  )
  // const [manualMin, setManualMin] = useState('')
  // const [manualMax, setManualMax] = useState('')

  useEffect(() => {
    setLocalMin(selectedMinPrice || filtersData.priceRange.min)
    setLocalMax(selectedMaxPrice || filtersData.priceRange.max)
  }, [selectedMinPrice, selectedMaxPrice, filtersData.priceRange])

  const handleSliderChange = (values: number[]) => {
    setLocalMin(values[0])
    setLocalMax(values[1])
    // setManualMin('')
    // setManualMax('')
  }

  // }

  const handleApplyPrice = () => {
    const minToApply =
      localMin === filtersData.priceRange.min ? undefined : localMin
    const maxToApply =
      localMax === filtersData.priceRange.max ? undefined : localMax
    onPriceChange(minToApply, maxToApply)
  }

  const handleResetPrice = () => {
    setLocalMin(filtersData.priceRange.min)
    setLocalMax(filtersData.priceRange.max)
    // setManualMin('')
    // setManualMax('')
    onPriceChange(undefined, undefined)
  }

  const isChanged =
    localMin !== (selectedMinPrice || filtersData.priceRange.min) ||
    localMax !== (selectedMaxPrice || filtersData.priceRange.max)

  return (
    <Card dir="rtl" className=" rounded-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">محدوده قیمت</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Slider */}
        <div className="px-2">
          <Slider
            value={[localMin, localMax]}
            onValueChange={handleSliderChange}
            max={filtersData.priceRange.max}
            min={filtersData.priceRange.min}
            step={100}
            className="w-full "
          />
        </div>

        {/* Price Display */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{localMin.toLocaleString()} تومان</span>
          <span>{localMax.toLocaleString()} تومان</span>
        </div>

        {isChanged && (
          <div className="flex gap-2">
            <Button
              variant={'indigo'}
              size="sm"
              onClick={handleApplyPrice}
              className="flex-1"
            >
              اعمال فیلتر
            </Button>
            <Button size="sm" variant="outline" onClick={handleResetPrice}>
              ریست
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
