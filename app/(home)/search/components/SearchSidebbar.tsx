'use client'

import { CategoryData, FiltersData, SearchFilters } from '@/lib/types/home'
import { Candy, Coffee, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
// import SearchSidebar from './SearchSidebbar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AttributeFilter from './filters/AtributeFilter'
import CategoryFilter from './filters/CategoryFilter'
import PriceFilter from './filters/PriceFilter'
import CoffeeFilter from './filters/CoffeeFilteres'

// Add these new types for coffee/chocolate filter data
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

interface SearchSidebarProps {
  filtersData: FiltersData
  coffeeFiltersData?: CoffeeFiltersData | null
  chocolateFiltersData?: ChocolateFiltersData | null
  categories: CategoryData[]
  currentFilters: SearchFilters
  onFiltersChange: (filters: Partial<SearchFilters>) => void
}

export default function SearchSidebar({
  filtersData,
  coffeeFiltersData,
  chocolateFiltersData,
  categories,
  currentFilters,
  onFiltersChange,
}: SearchSidebarProps) {
  const [activeTab, setActiveTab] = useState<
    'general' | 'coffee' | 'chocolate'
  >(currentFilters.productType || 'general')

  // DEBUG: Log what data we're receiving
  useEffect(() => {
    console.log('🔍 SearchSidebar Debug:')
    console.log('coffeeFiltersData:', coffeeFiltersData)
    console.log('chocolateFiltersData:', chocolateFiltersData)
    console.log('Has coffee data?', !!coffeeFiltersData)
    console.log('Has chocolate data?', !!chocolateFiltersData)
  }, [coffeeFiltersData, chocolateFiltersData])

  const handleTabChange = (value: string) => {
    const newTab = value as 'general' | 'coffee' | 'chocolate'
    setActiveTab(newTab)
    onFiltersChange({
      productType: newTab === 'general' ? undefined : newTab,
      page: 1,
    })
  }

  // Show debug info at the top
  const showDebugInfo = process.env.NODE_ENV === 'development'

  return (
    <div className="w-full lg:w-80">
      <ScrollArea className="h-[calc(100vh-10px)]">
        <div className="space-y-6 p-1">
          {/* DEBUG INFO - Remove in production */}
          {showDebugInfo && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs">
              <p className="font-bold mb-2">🐛 Debug Info:</p>
              <div className="space-y-1">
                <p>
                  Coffee Data:{' '}
                  {coffeeFiltersData ? '✅ Available' : '❌ Missing'}
                </p>
                <p>
                  Chocolate Data:{' '}
                  {chocolateFiltersData ? '✅ Available' : '❌ Missing'}
                </p>
                <p>
                  Current Product Type: {currentFilters.productType || 'none'}
                </p>
                {coffeeFiltersData && (
                  <p>
                    Coffee Origins: {coffeeFiltersData.origins?.length || 0}
                  </p>
                )}
                {chocolateFiltersData && (
                  <p>
                    Chocolate Types:{' '}
                    {chocolateFiltersData.chocolateTypes?.length || 0}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Show tabs only if we have special filter data */}
          {coffeeFiltersData || chocolateFiltersData ? (
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="general" className="text-xs">
                  <Package className="w-3 h-3 ml-1" />
                  همه
                </TabsTrigger>
                {coffeeFiltersData && (
                  <TabsTrigger value="coffee" className="text-xs">
                    <Coffee className="w-3 h-3 ml-1" />
                    قهوه
                  </TabsTrigger>
                )}
                {chocolateFiltersData && (
                  <TabsTrigger value="chocolate" className="text-xs">
                    <Candy className="w-3 h-3 ml-1" />
                    شکلات
                  </TabsTrigger>
                )}
              </TabsList>

              {/* General Filters Tab */}
              <TabsContent value="general" className="space-y-6">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={currentFilters.categoryId}
                  onCategoryChange={(categoryId) =>
                    onFiltersChange({ categoryId, page: 1 })
                  }
                />

                <PriceFilter
                  filtersData={filtersData}
                  selectedMinPrice={currentFilters.minPrice}
                  selectedMaxPrice={currentFilters.maxPrice}
                  onPriceChange={(minPrice, maxPrice) =>
                    onFiltersChange({ minPrice, maxPrice, page: 1 })
                  }
                />

                <AttributeFilter
                  title="رنگ"
                  items={filtersData.colors}
                  selectedItems={currentFilters.colors || []}
                  onSelectionChange={(colors) =>
                    onFiltersChange({ colors, page: 1 })
                  }
                />

                <AttributeFilter
                  title="سایز"
                  items={filtersData.sizes}
                  selectedItems={currentFilters.sizes || []}
                  onSelectionChange={(sizes) =>
                    onFiltersChange({ sizes, page: 1 })
                  }
                />
              </TabsContent>

              {/* Coffee Filters Tab */}
              {coffeeFiltersData && (
                <TabsContent value="coffee" className="space-y-6">
                  <CoffeeFilter
                    filtersData={coffeeFiltersData}
                    selectedFilters={currentFilters.coffeeFilters || {}}
                    onFiltersChange={(coffeeFilters) =>
                      onFiltersChange({
                        coffeeFilters,
                        productType: 'coffee',
                        page: 1,
                      })
                    }
                  />
                  <PriceFilter
                    filtersData={filtersData}
                    selectedMinPrice={currentFilters.minPrice}
                    selectedMaxPrice={currentFilters.maxPrice}
                    onPriceChange={(minPrice, maxPrice) =>
                      onFiltersChange({ minPrice, maxPrice, page: 1 })
                    }
                  />

                  {/* TEMPORARY: Show coffee data */}
                  <div className="bg-amber-50 border border-amber-200 rounded p-4">
                    <p className="font-semibold mb-2">
                      ☕ Coffee Filters Available:
                    </p>
                    <div className="space-y-2 text-sm">
                      <p>
                        Roast Levels: {coffeeFiltersData.roastLevels.length}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {coffeeFiltersData.roastLevels.map((level) => (
                          <Badge key={level} variant="outline">
                            {level}
                          </Badge>
                        ))}
                      </div>
                      <p>Origins: {coffeeFiltersData.origins.length}</p>
                      <p>
                        Flavor Notes: {coffeeFiltersData.flavorNotes.length}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Import CoffeeFilter component to see full filters
                    </p>
                  </div>

                  {/* Uncomment when CoffeeFilter component is ready */}
                  {/* <CoffeeFilter
                    filtersData={coffeeFiltersData}
                    selectedFilters={currentFilters.coffeeFilters || {}}
                    onFiltersChange={(coffeeFilters) => 
                      onFiltersChange({ coffeeFilters, productType: 'coffee', page: 1 })
                    }
                  /> */}
                </TabsContent>
              )}

              {/* Chocolate Filters Tab */}
              {chocolateFiltersData && (
                <TabsContent value="chocolate" className="space-y-6">
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={currentFilters.categoryId}
                    onCategoryChange={(categoryId) =>
                      onFiltersChange({ categoryId, page: 1 })
                    }
                  />

                  <PriceFilter
                    filtersData={filtersData}
                    selectedMinPrice={currentFilters.minPrice}
                    selectedMaxPrice={currentFilters.maxPrice}
                    onPriceChange={(minPrice, maxPrice) =>
                      onFiltersChange({ minPrice, maxPrice, page: 1 })
                    }
                  />

                  {/* TEMPORARY: Show chocolate data */}
                  <div className="bg-amber-900/10 border border-amber-900/20 rounded p-4">
                    <p className="font-semibold mb-2">
                      🍫 Chocolate Filters Available:
                    </p>
                    <div className="space-y-2 text-sm">
                      <p>Types: {chocolateFiltersData.chocolateTypes.length}</p>
                      <div className="flex flex-wrap gap-1">
                        {chocolateFiltersData.chocolateTypes.map((type) => (
                          <Badge key={type} variant="outline">
                            {type}
                          </Badge>
                        ))}
                      </div>
                      <p>Origins: {chocolateFiltersData.origins.length}</p>
                      <p>
                        Flavor Notes: {chocolateFiltersData.flavorNotes.length}
                      </p>
                      <p>
                        Cocoa Range: {chocolateFiltersData.cocoaRange.min}% -{' '}
                        {chocolateFiltersData.cocoaRange.max}%
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Import ChocolateFilter component to see full filters
                    </p>
                  </div>

                  {/* Uncomment when ChocolateFilter component is ready */}
                  {/* <ChocolateFilter
                    filtersData={chocolateFiltersData}
                    selectedFilters={currentFilters.chocolateFilters || {}}
                    onFiltersChange={(chocolateFilters) =>
                      onFiltersChange({ chocolateFilters, productType: 'chocolate', page: 1 })
                    }
                  /> */}
                </TabsContent>
              )}
            </Tabs>
          ) : (
            // No special filters - show only general
            <>
              {showDebugInfo && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-800">
                  ⚠️ No coffee or chocolate filter data available. Check if data
                  is being fetched in server component.
                </div>
              )}

              <CategoryFilter
                categories={categories}
                selectedCategory={currentFilters.categoryId}
                onCategoryChange={(categoryId) =>
                  onFiltersChange({ categoryId, page: 1 })
                }
              />

              <PriceFilter
                filtersData={filtersData}
                selectedMinPrice={currentFilters.minPrice}
                selectedMaxPrice={currentFilters.maxPrice}
                onPriceChange={(minPrice, maxPrice) =>
                  onFiltersChange({ minPrice, maxPrice, page: 1 })
                }
              />

              <AttributeFilter
                title="رنگ"
                items={filtersData.colors}
                selectedItems={currentFilters.colors || []}
                onSelectionChange={(colors) =>
                  onFiltersChange({ colors, page: 1 })
                }
              />

              <AttributeFilter
                title="سایز"
                items={filtersData.sizes}
                selectedItems={currentFilters.sizes || []}
                onSelectionChange={(sizes) =>
                  onFiltersChange({ sizes, page: 1 })
                }
              />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
