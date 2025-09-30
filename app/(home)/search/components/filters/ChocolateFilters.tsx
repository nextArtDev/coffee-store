import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface ChocolateFiltersData {
  chocolateTypes: string[]
  origins: string[]
  textures: string[]
  cocoaRange: { min: number; max: number }
  tasteRanges: {
    sweetness: { min: number; max: number }
    bitterness: { min: number; max: number }
    acidity: { min: number; max: number }
    fruitiness: { min: number; max: number }
  }
  availableCertifications: {
    organic: boolean
    fairTrade: boolean
    singleOrigin: boolean
    vegan: boolean
    glutenFree: boolean
  }
  flavorNotes: string[]
}

interface ChocolateFilterProps {
  filtersData: ChocolateFiltersData
  selectedFilters: {
    chocolateTypes?: string[]
    minCocoaPercentage?: number
    maxCocoaPercentage?: number
    origins?: string[]
    textures?: string[]
    minSweetness?: number
    maxSweetness?: number
    minBitterness?: number
    maxBitterness?: number
    minAcidity?: number
    maxAcidity?: number
    minFruitiness?: number
    maxFruitiness?: number
    organic?: boolean
    fairTrade?: boolean
    singleOrigin?: boolean
    vegan?: boolean
    glutenFree?: boolean
    flavorNotes?: string[]
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFiltersChange: (filters: any) => void
}

const CHOCOLATE_TYPE_LABELS: Record<string, string> = {
  DARK: 'تلخ',
  MILK: 'شیری',
  WHITE: 'سفید',
  RUBY: 'یاقوتی',
  RAW: 'خام',
  UNSWEETENED: 'بدون شکر',
}

const TEXTURE_LABELS: Record<string, string> = {
  SMOOTH: 'نرم',
  GRAINY: 'دانه‌دار',
  CREAMY: 'خامه‌ای',
  CRUNCHY: 'ترد',
  VELVETY: 'مخملی',
}

const CERTIFICATION_LABELS = {
  organic: { label: 'ارگانیک', icon: '🌱' },
  fairTrade: { label: 'تجارت عادلانه', icon: '🤝' },
  singleOrigin: { label: 'تک منشأ', icon: '🌍' },
  vegan: { label: 'وگان', icon: '🌿' },
  glutenFree: { label: 'بدون گلوتن', icon: '🌾' },
}

export default function ChocolateFilter({
  filtersData,
  selectedFilters,
  onFiltersChange,
}: ChocolateFilterProps) {
  const [localFilters, setLocalFilters] = useState(selectedFilters)
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    taste: false,
    cocoa: false,
    origin: false,
    certifications: false,
    flavor: false,
  })

  useEffect(() => {
    setLocalFilters(selectedFilters)
  }, [selectedFilters])

  const toggleSelection = (key: keyof typeof localFilters, value: string) => {
    const currentArray = (localFilters[key] as string[]) || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value]

    setLocalFilters({
      ...localFilters,
      [key]: newArray.length > 0 ? newArray : undefined,
    })
  }

  const toggleCertification = (key: keyof typeof localFilters) => {
    const currentValue = localFilters[key]
    setLocalFilters({
      ...localFilters,
      [key]: currentValue === true ? undefined : true,
    })
  }

  const handleRangeChange = (
    minKey: keyof typeof localFilters,
    maxKey: keyof typeof localFilters,
    values: number[]
  ) => {
    setLocalFilters({
      ...localFilters,
      [minKey]: values[0],
      [maxKey]: values[1],
    })
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
  }

  const handleReset = () => {
    setLocalFilters({})
    onFiltersChange({})
  }

  const hasActiveFilters = Object.values(localFilters).some(
    (v) => v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
  )

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header */}
      <Card className="rounded-none bg-gradient-to-r from-amber-900/10 to-orange-900/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            🍫 یافتن شکلات مورد علاقه
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            با انتخاب ویژگی‌های دلخواه، شکلات ایده‌آل خود را پیدا کنید
          </p>
        </CardHeader>
      </Card>

      {/* Chocolate Type */}
      <Card className="rounded-none">
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('type')}
        >
          <CardTitle className="text-base font-medium flex items-center justify-between">
            <span>🍫 نوع شکلات</span>
            <span className="text-xs">{expandedSections.type ? '▲' : '▼'}</span>
          </CardTitle>
        </CardHeader>
        {expandedSections.type && (
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filtersData.chocolateTypes.map((type) => (
                <Badge
                  key={type}
                  variant={
                    localFilters.chocolateTypes?.includes(type)
                      ? 'default'
                      : 'outline'
                  }
                  className={cn(
                    'cursor-pointer transition-all',
                    localFilters.chocolateTypes?.includes(type) &&
                      'bg-amber-900 hover:bg-amber-950'
                  )}
                  onClick={() => toggleSelection('chocolateTypes', type)}
                >
                  {CHOCOLATE_TYPE_LABELS[type] || type}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Cocoa Percentage */}
      <Card className="rounded-none">
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('cocoa')}
        >
          <CardTitle className="text-base font-medium flex items-center justify-between">
            <span>📊 درصد کاکائو</span>
            <span className="text-xs">
              {expandedSections.cocoa ? '▲' : '▼'}
            </span>
          </CardTitle>
        </CardHeader>
        {expandedSections.cocoa && (
          <CardContent className="space-y-2">
            <Slider
              value={[
                localFilters.minCocoaPercentage || filtersData.cocoaRange.min,
                localFilters.maxCocoaPercentage || filtersData.cocoaRange.max,
              ]}
              onValueChange={(values) =>
                handleRangeChange(
                  'minCocoaPercentage',
                  'maxCocoaPercentage',
                  values
                )
              }
              min={filtersData.cocoaRange.min}
              max={filtersData.cocoaRange.max}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {localFilters.minCocoaPercentage || filtersData.cocoaRange.min}%
              </span>
              <span>
                {localFilters.maxCocoaPercentage || filtersData.cocoaRange.max}%
              </span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Taste Profile */}
      <Card className="rounded-none">
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('taste')}
        >
          <CardTitle className="text-base font-medium flex items-center justify-between">
            <span>👅 پروفایل طعم</span>
            <span className="text-xs">
              {expandedSections.taste ? '▲' : '▼'}
            </span>
          </CardTitle>
        </CardHeader>
        {expandedSections.taste && (
          <CardContent className="space-y-6">
            {/* Sweetness */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">شیرینی</span>
                <span className="text-xs text-muted-foreground">
                  {localFilters.minSweetness ||
                    filtersData.tasteRanges.sweetness.min}{' '}
                  -{' '}
                  {localFilters.maxSweetness ||
                    filtersData.tasteRanges.sweetness.max}
                </span>
              </div>
              <Slider
                value={[
                  localFilters.minSweetness ||
                    filtersData.tasteRanges.sweetness.min,
                  localFilters.maxSweetness ||
                    filtersData.tasteRanges.sweetness.max,
                ]}
                onValueChange={(values) =>
                  handleRangeChange('minSweetness', 'maxSweetness', values)
                }
                min={filtersData.tasteRanges.sweetness.min}
                max={filtersData.tasteRanges.sweetness.max}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Bitterness */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">تلخی</span>
                <span className="text-xs text-muted-foreground">
                  {localFilters.minBitterness ||
                    filtersData.tasteRanges.bitterness.min}{' '}
                  -{' '}
                  {localFilters.maxBitterness ||
                    filtersData.tasteRanges.bitterness.max}
                </span>
              </div>
              <Slider
                value={[
                  localFilters.minBitterness ||
                    filtersData.tasteRanges.bitterness.min,
                  localFilters.maxBitterness ||
                    filtersData.tasteRanges.bitterness.max,
                ]}
                onValueChange={(values) =>
                  handleRangeChange('minBitterness', 'maxBitterness', values)
                }
                min={filtersData.tasteRanges.bitterness.min}
                max={filtersData.tasteRanges.bitterness.max}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Acidity */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">اسیدیته</span>
                <span className="text-xs text-muted-foreground">
                  {localFilters.minAcidity ||
                    filtersData.tasteRanges.acidity.min}{' '}
                  -{' '}
                  {localFilters.maxAcidity ||
                    filtersData.tasteRanges.acidity.max}
                </span>
              </div>
              <Slider
                value={[
                  localFilters.minAcidity ||
                    filtersData.tasteRanges.acidity.min,
                  localFilters.maxAcidity ||
                    filtersData.tasteRanges.acidity.max,
                ]}
                onValueChange={(values) =>
                  handleRangeChange('minAcidity', 'maxAcidity', values)
                }
                min={filtersData.tasteRanges.acidity.min}
                max={filtersData.tasteRanges.acidity.max}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Fruitiness */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">میوه‌ای بودن</span>
                <span className="text-xs text-muted-foreground">
                  {localFilters.minFruitiness ||
                    filtersData.tasteRanges.fruitiness.min}{' '}
                  -{' '}
                  {localFilters.maxFruitiness ||
                    filtersData.tasteRanges.fruitiness.max}
                </span>
              </div>
              <Slider
                value={[
                  localFilters.minFruitiness ||
                    filtersData.tasteRanges.fruitiness.min,
                  localFilters.maxFruitiness ||
                    filtersData.tasteRanges.fruitiness.max,
                ]}
                onValueChange={(values) =>
                  handleRangeChange('minFruitiness', 'maxFruitiness', values)
                }
                min={filtersData.tasteRanges.fruitiness.min}
                max={filtersData.tasteRanges.fruitiness.max}
                step={0.5}
                className="w-full"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Texture */}
      {filtersData.textures.length > 0 && (
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">✨ بافت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filtersData.textures.map((texture) => (
                <Badge
                  key={texture}
                  variant={
                    localFilters.textures?.includes(texture)
                      ? 'default'
                      : 'outline'
                  }
                  className={cn(
                    'cursor-pointer transition-all',
                    localFilters.textures?.includes(texture) &&
                      'bg-pink-600 hover:bg-pink-700'
                  )}
                  onClick={() => toggleSelection('textures', texture)}
                >
                  {TEXTURE_LABELS[texture] || texture}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Origin */}
      {filtersData.origins.length > 0 && (
        <Card className="rounded-none">
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection('origin')}
          >
            <CardTitle className="text-base font-medium flex items-center justify-between">
              <span>🌍 منشأ</span>
              <span className="text-xs">
                {expandedSections.origin ? '▲' : '▼'}
              </span>
            </CardTitle>
          </CardHeader>
          {expandedSections.origin && (
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {filtersData.origins.map((origin) => (
                  <Badge
                    key={origin}
                    variant={
                      localFilters.origins?.includes(origin)
                        ? 'default'
                        : 'outline'
                    }
                    className={cn(
                      'cursor-pointer transition-all',
                      localFilters.origins?.includes(origin) &&
                        'bg-green-600 hover:bg-green-700'
                    )}
                    onClick={() => toggleSelection('origins', origin)}
                  >
                    {origin}
                  </Badge>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Certifications */}
      <Card className="rounded-none">
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('certifications')}
        >
          <CardTitle className="text-base font-medium flex items-center justify-between">
            <span>✅ گواهینامه‌ها</span>
            <span className="text-xs">
              {expandedSections.certifications ? '▲' : '▼'}
            </span>
          </CardTitle>
        </CardHeader>
        {expandedSections.certifications && (
          <CardContent>
            <div className="space-y-2">
              {Object.entries(CERTIFICATION_LABELS).map(
                ([key, { label, icon }]) => {
                  const available =
                    filtersData.availableCertifications[
                      key as keyof typeof filtersData.availableCertifications
                    ]
                  if (!available) return null

                  const isSelected =
                    localFilters[key as keyof typeof localFilters] === true

                  return (
                    <div
                      key={key}
                      onClick={() =>
                        toggleCertification(key as keyof typeof localFilters)
                      }
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                        isSelected
                          ? 'bg-green-50 border-green-500'
                          : 'hover:bg-gray-50'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span>{icon}</span>
                        <span className="text-sm font-medium">{label}</span>
                      </span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  )
                }
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Flavor Notes */}
      {filtersData.flavorNotes.length > 0 && (
        <Card className="rounded-none">
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection('flavor')}
          >
            <CardTitle className="text-base font-medium flex items-center justify-between">
              <span>🌸 یادداشت‌های طعم</span>
              <span className="text-xs">
                {expandedSections.flavor ? '▲' : '▼'}
              </span>
            </CardTitle>
          </CardHeader>
          {expandedSections.flavor && (
            <CardContent>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {filtersData.flavorNotes.map((note) => (
                  <Badge
                    key={note}
                    variant={
                      localFilters.flavorNotes?.includes(note)
                        ? 'default'
                        : 'outline'
                    }
                    className={cn(
                      'cursor-pointer transition-all text-xs',
                      localFilters.flavorNotes?.includes(note) &&
                        'bg-purple-600 hover:bg-purple-700'
                    )}
                    onClick={() => toggleSelection('flavorNotes', note)}
                  >
                    {note}
                  </Badge>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <Separator />

      {/* Action Buttons */}
      <div className="flex gap-2 sticky bottom-0 bg-white p-2 border-t">
        <Button
          onClick={handleApply}
          className="flex-1 bg-amber-900 hover:bg-amber-950"
          disabled={!hasActiveFilters}
        >
          اعمال فیلترها
        </Button>
        {hasActiveFilters && (
          <Button onClick={handleReset} variant="outline">
            پاک کردن
          </Button>
        )}
      </div>
    </div>
  )
}
