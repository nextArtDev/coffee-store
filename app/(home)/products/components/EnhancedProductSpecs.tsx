/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ProductSpec, VariantsWithSizeAndColor } from '@/lib/types/home'
import {
  AccessorySpecs,
  ChocolateCharacteristics,
  CoffeeCharacteristics,
  EquipmentSpecs,
} from '@/lib/generated/prisma'

// Type definitions based on your Prisma models (same as before)
// interface CoffeeCharacteristics {
//   caffeineContent?: number
//   origin?: string
//   roastLevel?:
//     | 'LIGHT'
//     | 'MEDIUM_LIGHT'
//     | 'MEDIUM'
//     | 'MEDIUM_DARK'
//     | 'DARK'
//     | 'EXTRA_DARK'
//   processingMethod?:
//     | 'WASHED'
//     | 'NATURAL'
//     | 'HONEY'
//     | 'SEMI_WASHED'
//     | 'WET_HULLED'
//     | 'CARBONIC_MACERATION'
//   altitude?: number | null
//   harvestYear?: number | null
//   acidity?: number | null
//   bitterness?: number | null
//   sweetness?: number | null
//   body?: number | null
//   flavorNotes?: string
//   aromaNotes?: string
//   grindSize?:
//     | 'EXTRA_COARSE'
//     | 'COARSE'
//     | 'MEDIUM_COARSE'
//     | 'MEDIUM'
//     | 'MEDIUM_FINE'
//     | 'FINE'
//     | 'EXTRA_FINE'
//   brewingMethods?: string
//   waterTemp?: number | null
//   brewTime?: number | null
//   coffeeToWaterRatio?: string
// }

// interface ChocolateCharacteristics {
//   cocoaPercentage?: number
//   chocolateType?: 'DARK' | 'MILK' | 'WHITE' | 'RUBY' | 'RAW' | 'UNSWEETENED'
//   origin?: string
//   beanVariety?: string
//   processingMethod?: string
//   conchingTime?: number
//   temperingMethod?: string
//   texture?: 'SMOOTH' | 'GRAINY' | 'CREAMY' | 'CRUNCHY' | 'VELVETY'
//   sweetness?: number
//   bitterness?: number
//   acidity?: number
//   fruitiness?: number
//   flavorNotes?: string
//   mouthfeel?: string
//   finish?: string
//   pairings?: string
//   servingTemp?: string
//   organic?: boolean
//   fairTrade?: boolean
//   singleOrigin?: boolean
//   rawChocolate?: boolean
//   vegan?: boolean
//   glutenFree?: boolean
// }

// interface EquipmentSpecs {
//   material?: string
//   capacity?: number
//   powerConsumption?: number
//   pressureLevel?: number
//   heatingTime?: number
//   temperatureRange?: string
//   burrType?: 'CERAMIC' | 'STEEL' | 'TITANIUM'
//   grindSettings?: number
//   grindCapacity?: number
//   filterType?: 'PAPER' | 'METAL' | 'CLOTH' | 'PERMANENT'
//   compatibility?: string
// }

// interface AccessorySpecs {
//   material?: string
//   capacity?: number
//   heatRetention?: boolean
//   microwaveSafe?: boolean
//   dishwasherSafe?: boolean
//   handleType?: string
//   lidType?: string
// }

// interface ProductVariant {
//   id: string
//   price: number
//   quantity: number
//   discount: number
//   weight: number
//   length?: number
//   width?: number
//   height?: number
//   size: { name: string }
//   color: { name: string; hex: string }
// }

// interface Spec {
//   name: string
//   value: string
// }

interface EnhancedProductSpecsProps {
  variant: VariantsWithSizeAndColor
  specs?: Partial<ProductSpec[]> | null
  coffeeCharacteristics?: Partial<CoffeeCharacteristics> | null
  chocolateCharacteristics?: Partial<ChocolateCharacteristics> | null
  equipmentSpecs?: Partial<EquipmentSpecs> | null
  accessorySpecs?: Partial<AccessorySpecs> | null
  className?: string
}

const EnhancedProductSpecs: React.FC<EnhancedProductSpecsProps> = ({
  variant,
  specs,
  coffeeCharacteristics,
  chocolateCharacteristics,
  equipmentSpecs,
  accessorySpecs,
  className,
}) => {
  const [activeTab, setActiveTab] = useState('basic')

  const formatValue = (value: any, key: string): React.ReactNode => {
    if (value === null || value === undefined) return '-'

    // Handle JSON arrays
    if (
      typeof value === 'string' &&
      (value.startsWith('[') ||
        key.includes('Notes') ||
        key.includes('Methods'))
    ) {
      try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) {
          return (
            <div className="flex flex-wrap gap-1">
              {parsed.map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          )
        }
      } catch {
        return value
      }
    }

    // Handle temperature range
    if (key === 'temperatureRange' && typeof value === 'string') {
      try {
        const range = JSON.parse(value)
        return `${range.min}°C - ${range.max}°C`
      } catch {
        return value
      }
    }

    // Handle boolean values
    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'} className="text-xs">
          {value ? 'بله' : 'خیر'}
        </Badge>
      )
    }

    // Handle numeric values with units
    if (typeof value === 'number') {
      switch (key) {
        case 'caffeineContent':
          return `${value} میلی‌گرم`
        case 'altitude':
          return `${value} متر`
        case 'waterTemp':
          return `${value}°C`
        case 'brewTime':
          return `${value} ثانیه`
        case 'capacity':
          return `${value} میلی‌لیتر`
        case 'powerConsumption':
          return `${value} وات`
        case 'pressureLevel':
          return `${value} بار`
        case 'heatingTime':
          return `${value} ثانیه`
        case 'grindCapacity':
          return `${value} گرم`
        case 'weight':
          return `${value} گرم`
        case 'length':
        case 'width':
        case 'height':
          return `${value} سانتی‌متر`
        case 'cocoaPercentage':
          return `${value}%`
        case 'conchingTime':
          return `${value} ساعت`
        case 'acidity':
        case 'bitterness':
        case 'sweetness':
        case 'body':
        case 'fruitiness':
          return `${value}/10`
        case 'price':
          return `${value.toLocaleString('fa-IR')} تومان`
        case 'discount':
          return `${value}%`
        default:
          return value.toString()
      }
    }

    return value.toString()
  }

  const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
      // Coffee
      caffeineContent: 'محتوای کافئین',
      origin: 'منشأ',
      roastLevel: 'سطح برشته‌کاری',
      processingMethod: 'روش فرآوری',
      altitude: 'ارتفاع کشت',
      harvestYear: 'سال برداشت',
      acidity: 'اسیدیته',
      bitterness: 'تلخی',
      sweetness: 'شیرینی',
      body: 'بدنه',
      flavorNotes: 'یادداشت‌های طعم',
      aromaNotes: 'یادداشت‌های عطر',
      grindSize: 'اندازه آسیاب',
      brewingMethods: 'روش‌های دم‌آوری',
      waterTemp: 'دمای آب',
      brewTime: 'زمان دم‌آوری',
      coffeeToWaterRatio: 'نسبت قهوه به آب',

      // Chocolate
      cocoaPercentage: 'درصد کاکائو',
      chocolateType: 'نوع شکلات',
      beanVariety: 'نوع دانه',
      conchingTime: 'زمان کانچینگ',
      temperingMethod: 'روش تمپرینگ',
      texture: 'بافت',
      fruitiness: 'میوه‌ای بودن',
      mouthfeel: 'احساس دهانی',
      finish: 'پایان طعم',
      pairings: 'ترکیب‌های پیشنهادی',
      servingTemp: 'دمای سرو',
      organic: 'ارگانیک',
      fairTrade: 'تجارت عادلانه',
      singleOrigin: 'تک منشأ',
      rawChocolate: 'شکلات خام',
      vegan: 'وگان',
      glutenFree: 'بدون گلوتن',

      // Equipment
      material: 'جنس',
      capacity: 'ظرفیت',
      powerConsumption: 'مصرف برق',
      pressureLevel: 'فشار',
      heatingTime: 'زمان گرم شدن',
      temperatureRange: 'محدوده دما',
      burrType: 'نوع تیغه آسیاب',
      grindSettings: 'تنظیمات آسیاب',
      grindCapacity: 'ظرفیت آسیاب',
      filterType: 'نوع فیلتر',
      compatibility: 'سازگاری',

      // Accessory
      heatRetention: 'حفظ حرارت',
      microwaveSafe: 'قابل استفاده در مایکروویو',
      dishwasherSafe: 'قابل شستشو در ماشین ظرفشویی',
      handleType: 'نوع دسته',
      lidType: 'نوع درب',

      // Variant
      price: 'قیمت',
      quantity: 'موجودی',
      discount: 'تخفیف',
      weight: 'وزن',
      length: 'طول',
      width: 'عرض',
      height: 'ارتفاع',
    }

    return labels[key] || key
  }

  const renderRatingBar = (value: number, maxValue: number = 10) => {
    const percentage = (value / maxValue) * 100
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium w-12">
          {value}/{maxValue}
        </span>
      </div>
    )
  }

  const renderSpecRow = (
    key: string,
    value: any,
    isRating: boolean = false
  ) => {
    if (value === null || value === undefined || value === '' || value === 0)
      return null

    return (
      <div
        key={key}
        className="flex flex-col sm:flex-row py-3 border-b last:border-b-0"
      >
        <div className="sm:w-1/3 font-medium text-primary mb-1 sm:mb-0">
          {getFieldLabel(key)}
        </div>
        <div className="sm:w-2/3">
          {isRating && typeof value === 'number'
            ? renderRatingBar(value)
            : formatValue(value, key)}
        </div>
      </div>
    )
  }

  const renderSpecCard = (
    title: string,
    data: Record<string, any>,
    ratingKeys: string[] = []
  ) => {
    const filteredEntries = Object.entries(data).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) =>
        value !== null && value !== undefined && value !== '' && value !== 0
    )

    if (filteredEntries.length === 0) return null

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {filteredEntries.map(([key, value]) =>
            renderSpecRow(key, value, ratingKeys.includes(key))
          )}
        </CardContent>
      </Card>
    )
  }

  const tabs = [
    { id: 'basic', label: 'مشخصات پایه', icon: '📋' },
    { id: 'coffee', label: 'قهوه', icon: '☕', show: !!coffeeCharacteristics },
    {
      id: 'chocolate',
      label: 'شکلات',
      icon: '🍫',
      show: !!chocolateCharacteristics,
    },
    { id: 'equipment', label: 'تجهیزات', icon: '⚙️', show: !!equipmentSpecs },
    {
      id: 'accessory',
      label: 'لوازم جانبی',
      icon: '🏆',
      show: !!accessorySpecs,
    },
  ].filter((tab) => tab.show !== false)

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Navigation */}
      <div className="flex   mb-6 border-b w-full ">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'cursor-pointer flex-1 items-center justify-center mx-1  py-2 rounded-t-lg transition-all duration-200 text-md font-medium',
              'flex items-center gap-2',
              activeTab === tab.id
                ? 'bg-muted text-white border-b-2 border-muted'
                : 'bg-secondary text-primary hover:bg-gray-200'
            )}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'basic' && (
          <>
            {/* Size and Color */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">🎨 سایز و رنگ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-primary">سایز:</span>
                    <Badge variant="outline" className="text-sm">
                      {variant.size.name}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-primary">رنگ:</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border shadow-sm"
                        style={{ backgroundColor: variant.color.hex }}
                      />
                      <Badge variant="outline" className="text-sm">
                        {variant.color.name}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Product Info */}
            {renderSpecCard('💰 اطلاعات قیمت و موجودی', {
              price: variant.price,
              discount: variant.discount > 0 ? variant.discount : null,
              quantity: variant.quantity,
            })}

            {/* Dimensions */}
            {renderSpecCard('📏 ابعاد و وزن', {
              weight: variant.weight,
              length: variant.length,
              width: variant.width,
              height: variant.height,
            })}

            {/* General Specs */}
            {specs &&
              specs.length > 0 &&
              renderSpecCard(
                '📋 مشخصات عمومی',
                Object.fromEntries(
                  specs
                    .filter(
                      (spec) =>
                        spec!.name.trim().length > 0 &&
                        spec!.value.trim().length > 0
                    )
                    .map((spec) => [spec!.name, spec!.value])
                )
              )}
          </>
        )}

        {activeTab === 'coffee' && coffeeCharacteristics && (
          <>
            {/* Coffee Basic Info */}
            {renderSpecCard('☕ اطلاعات پایه قهوه', {
              origin: coffeeCharacteristics.origin,
              roastLevel: coffeeCharacteristics.roastLevel,
              processingMethod: coffeeCharacteristics.processingMethod,
              altitude: coffeeCharacteristics.altitude,
              harvestYear: coffeeCharacteristics.harvestYear,
              caffeineContent: coffeeCharacteristics.caffeineContent,
            })}

            {/* Taste Profile with Rating Bars */}
            {renderSpecCard(
              '👅 پروفایل طعم',
              {
                acidity: coffeeCharacteristics.acidity,
                bitterness: coffeeCharacteristics.bitterness,
                sweetness: coffeeCharacteristics.sweetness,
                body: coffeeCharacteristics.body,
              },
              ['acidity', 'bitterness', 'sweetness', 'body']
            )}

            {/* Flavor Notes */}
            {renderSpecCard('🌸 یادداشت‌های طعم و عطر', {
              flavorNotes: coffeeCharacteristics.flavorNotes,
              aromaNotes: coffeeCharacteristics.aromaNotes,
            })}

            {/* Brewing Recommendations */}
            {renderSpecCard('🔥 توصیه‌های دم‌آوری', {
              grindSize: coffeeCharacteristics.grindSize,
              brewingMethods: coffeeCharacteristics.brewingMethods,
              waterTemp: coffeeCharacteristics.waterTemp,
              brewTime: coffeeCharacteristics.brewTime,
              coffeeToWaterRatio: coffeeCharacteristics.coffeeToWaterRatio,
            })}
          </>
        )}

        {activeTab === 'chocolate' && chocolateCharacteristics && (
          <>
            {/* Chocolate Basic Info */}
            {renderSpecCard('🍫 اطلاعات پایه شکلات', {
              cocoaPercentage: chocolateCharacteristics.cocoaPercentage,
              chocolateType: chocolateCharacteristics.chocolateType,
              origin: chocolateCharacteristics.origin,
              beanVariety: chocolateCharacteristics.beanVariety,
            })}

            {/* Processing Info */}
            {renderSpecCard('⚙️ فرآوری', {
              processingMethod: chocolateCharacteristics.processingMethod,
              conchingTime: chocolateCharacteristics.conchingTime,
              temperingMethod: chocolateCharacteristics.temperingMethod,
              texture: chocolateCharacteristics.texture,
            })}

            {/* Taste Profile */}
            {renderSpecCard(
              '👅 پروفایل طعم',
              {
                sweetness: chocolateCharacteristics.sweetness,
                bitterness: chocolateCharacteristics.bitterness,
                acidity: chocolateCharacteristics.acidity,
                fruitiness: chocolateCharacteristics.fruitiness,
              },
              ['sweetness', 'bitterness', 'acidity', 'fruitiness']
            )}

            {/* Additional Characteristics */}
            {renderSpecCard('🎯 ویژگی‌های اضافی', {
              flavorNotes: chocolateCharacteristics.flavorNotes,
              mouthfeel: chocolateCharacteristics.mouthfeel,
              finish: chocolateCharacteristics.finish,
              pairings: chocolateCharacteristics.pairings,
              servingTemp: chocolateCharacteristics.servingTemp,
            })}

            {/* Certifications */}
            {renderSpecCard('✅ گواهینامه‌ها', {
              organic: chocolateCharacteristics.organic,
              fairTrade: chocolateCharacteristics.fairTrade,
              singleOrigin: chocolateCharacteristics.singleOrigin,
              rawChocolate: chocolateCharacteristics.rawChocolate,
              vegan: chocolateCharacteristics.vegan,
              glutenFree: chocolateCharacteristics.glutenFree,
            })}
          </>
        )}

        {activeTab === 'equipment' && equipmentSpecs && (
          <>{renderSpecCard('⚙️ مشخصات تجهیزات', equipmentSpecs)}</>
        )}

        {activeTab === 'accessory' && accessorySpecs && (
          <>{renderSpecCard('🏆 مشخصات لوازم جانبی', accessorySpecs)}</>
        )}
      </div>
    </div>
  )
}

export default EnhancedProductSpecs
