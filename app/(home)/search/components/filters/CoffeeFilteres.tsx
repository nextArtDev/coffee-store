import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Coffee, Sparkles } from 'lucide-react'

interface CoffeeFiltersData {
  roastLevels: string[]
  processingMethods: string[]
  origins: string[]
  grindSizes: string[]
  caffeineRange: { min: number; max: number }
  tasteRanges: {
    acidity: { min: number; max: number }
    bitterness: { min: number; max: number }
    sweetness: { min: number; max: number }
    body: { min: number; max: number }
  }
  flavorNotes: string[]
  brewingMethods: string[]
}

interface CoffeeFilterProps {
  filtersData: CoffeeFiltersData
  selectedFilters: {
    roastLevels?: string[]
    processingMethods?: string[]
    origins?: string[]
    grindSizes?: string[]
    minCaffeine?: number
    maxCaffeine?: number
    minAcidity?: number
    maxAcidity?: number
    minBitterness?: number
    maxBitterness?: number
    minSweetness?: number
    maxSweetness?: number
    minBody?: number
    maxBody?: number
    flavorNotes?: string[]
    brewingMethods?: string[]
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFiltersChange: (filters: any) => void
}

const ROAST_LEVEL_LABELS: Record<string, string> = {
  LIGHT: 'روشن',
  MEDIUM_LIGHT: 'نیمه روشن',
  MEDIUM: 'متوسط',
  MEDIUM_DARK: 'نیمه تیره',
  DARK: 'تیره',
  EXTRA_DARK: 'خیلی تیره',
}

const PROCESSING_METHOD_LABELS: Record<string, string> = {
  WASHED: 'شسته شده',
  NATURAL: 'طبیعی',
  HONEY: 'عسلی',
  SEMI_WASHED: 'نیمه شسته',
  WET_HULLED: 'خیس پوست‌کنی',
  CARBONIC_MACERATION: 'نقع کربنیک',
}

const GRIND_SIZE_LABELS: Record<string, string> = {
  EXTRA_COARSE: 'خیلی درشت',
  COARSE: 'درشت',
  MEDIUM_COARSE: 'نیمه درشت',
  MEDIUM: 'متوسط',
  MEDIUM_FINE: 'نیمه ریز',
  FINE: 'ریز',
  EXTRA_FINE: 'خیلی ریز',
}

export default function CoffeeFilter({
  filtersData,
  selectedFilters,
  onFiltersChange,
}: CoffeeFilterProps) {
  const [localFilters, setLocalFilters] = useState(selectedFilters)
  const [expandedSections, setExpandedSections] = useState({
    roastLevel: true,
    taste: false,
    origin: false,
    brewing: false,
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
      <Card className="rounded-none bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <Coffee className="w-5 h-5" />
            یافتن قهوه مورد علاقه
            <Sparkles className="w-4 h-4 text-amber-600" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            با انتخاب ویژگی‌های دلخواه، قهوه ایده‌آل خود را پیدا کنید
          </p>
        </CardHeader>
      </Card>

      {/* Roast Level */}
      <Card className="rounded-none">
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('roastLevel')}
        >
          <CardTitle className="text-base font-medium flex items-center justify-between">
            <span>☕ سطح برشته‌کاری</span>
            <span className="text-xs">
              {expandedSections.roastLevel ? '▲' : '▼'}
            </span>
          </CardTitle>
        </CardHeader>
        {expandedSections.roastLevel && (
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filtersData.roastLevels.map((level) => (
                <Badge
                  key={level}
                  variant={
                    localFilters.roastLevels?.includes(level)
                      ? 'default'
                      : 'outline'
                  }
                  className={cn(
                    'cursor-pointer transition-all',
                    localFilters.roastLevels?.includes(level) &&
                      'bg-amber-600 hover:bg-amber-700'
                  )}
                  onClick={() => toggleSelection('roastLevels', level)}
                >
                  {ROAST_LEVEL_LABELS[level] || level}
                </Badge>
              ))}
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

            {/* Body */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">بدنه</span>
                <span className="text-xs text-muted-foreground">
                  {localFilters.minBody || filtersData.tasteRanges.body.min} -{' '}
                  {localFilters.maxBody || filtersData.tasteRanges.body.max}
                </span>
              </div>
              <Slider
                value={[
                  localFilters.minBody || filtersData.tasteRanges.body.min,
                  localFilters.maxBody || filtersData.tasteRanges.body.max,
                ]}
                onValueChange={(values) =>
                  handleRangeChange('minBody', 'maxBody', values)
                }
                min={filtersData.tasteRanges.body.min}
                max={filtersData.tasteRanges.body.max}
                step={0.5}
                className="w-full"
              />
            </div>
          </CardContent>
        )}
      </Card>

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

      {/* Caffeine Content */}
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            ⚡ محتوای کافئین
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Slider
            value={[
              localFilters.minCaffeine || filtersData.caffeineRange.min,
              localFilters.maxCaffeine || filtersData.caffeineRange.max,
            ]}
            onValueChange={(values) =>
              handleRangeChange('minCaffeine', 'maxCaffeine', values)
            }
            min={filtersData.caffeineRange.min}
            max={filtersData.caffeineRange.max}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {localFilters.minCaffeine || filtersData.caffeineRange.min}{' '}
              میلی‌گرم
            </span>
            <span>
              {localFilters.maxCaffeine || filtersData.caffeineRange.max}{' '}
              میلی‌گرم
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Processing Method */}
      {filtersData.processingMethods.length > 0 && (
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              🔬 روش فرآوری
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filtersData.processingMethods.map((method) => (
                <Badge
                  key={method}
                  variant={
                    localFilters.processingMethods?.includes(method)
                      ? 'default'
                      : 'outline'
                  }
                  className={cn(
                    'cursor-pointer transition-all',
                    localFilters.processingMethods?.includes(method) &&
                      'bg-blue-600 hover:bg-blue-700'
                  )}
                  onClick={() => toggleSelection('processingMethods', method)}
                >
                  {PROCESSING_METHOD_LABELS[method] || method}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Brewing Methods */}
      {filtersData.brewingMethods.length > 0 && (
        <Card className="rounded-none">
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection('brewing')}
          >
            <CardTitle className="text-base font-medium flex items-center justify-between">
              <span>☕ روش‌های دم‌آوری</span>
              <span className="text-xs">
                {expandedSections.brewing ? '▲' : '▼'}
              </span>
            </CardTitle>
          </CardHeader>
          {expandedSections.brewing && (
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {filtersData.brewingMethods.map((method) => (
                  <Badge
                    key={method}
                    variant={
                      localFilters.brewingMethods?.includes(method)
                        ? 'default'
                        : 'outline'
                    }
                    className={cn(
                      'cursor-pointer transition-all',
                      localFilters.brewingMethods?.includes(method) &&
                        'bg-orange-600 hover:bg-orange-700'
                    )}
                    onClick={() => toggleSelection('brewingMethods', method)}
                  >
                    {method}
                  </Badge>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Grind Size */}
      {filtersData.grindSizes.length > 0 && (
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              ⚙️ اندازه آسیاب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filtersData.grindSizes.map((size) => (
                <Badge
                  key={size}
                  variant={
                    localFilters.grindSizes?.includes(size)
                      ? 'default'
                      : 'outline'
                  }
                  className={cn(
                    'cursor-pointer transition-all',
                    localFilters.grindSizes?.includes(size) &&
                      'bg-gray-600 hover:bg-gray-700'
                  )}
                  onClick={() => toggleSelection('grindSizes', size)}
                >
                  {GRIND_SIZE_LABELS[size] || size}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Action Buttons */}
      <div className="flex gap-2 sticky bottom-0 bg-white p-2 border-t">
        <Button
          onClick={handleApply}
          className="flex-1 bg-amber-600 hover:bg-amber-700"
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
