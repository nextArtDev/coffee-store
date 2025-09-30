'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CategoryData, FiltersData, SearchFilters } from '@/lib/types/home'
import CategoryFilter from './filters/CategoryFilter'
import PriceFilter from './filters/PriceFilter'
import AttributeFilter from './filters/AtributeFilter'
import { Coffee, Candy, Package } from 'lucide-react'
import { useState } from 'react'
import CoffeeFilter from './filters/CoffeeFilteres'
import ChocolateFilter from './filters/ChocolateFilters'

// Coffee filters data type
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

// Chocolate filters data type
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
  // Determine active tab based on current filters or default to 'general'
  const [activeTab, setActiveTab] = useState<
    'general' | 'coffee' | 'chocolate'
  >(currentFilters.productType || 'general')

  const handleTabChange = (value: string) => {
    const newTab = value as 'general' | 'coffee' | 'chocolate'
    setActiveTab(newTab)
    onFiltersChange({
      productType: newTab === 'general' ? undefined : newTab,
      page: 1,
    })
  }

  const handleCoffeeFiltersChange = (
    coffeeFilters: SearchFilters['coffeeFilters']
  ) => {
    onFiltersChange({
      coffeeFilters,
      productType: 'coffee',
      page: 1,
    })
  }

  const handleChocolateFiltersChange = (
    chocolateFilters: SearchFilters['chocolateFilters']
  ) => {
    onFiltersChange({
      chocolateFilters,
      productType: 'chocolate',
      page: 1,
    })
  }

  return (
    <div className="w-full lg:w-80">
      <ScrollArea className="h-[calc(100vh-10px)]">
        <div className="space-y-6 p-1">
          {/* Product Type Tabs - Only show if coffee or chocolate data available */}
          {(coffeeFiltersData || chocolateFiltersData) && (
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
                  {/* Still show basic filters */}
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

                  {/* Coffee-specific filters */}
                  <CoffeeFilter
                    filtersData={coffeeFiltersData}
                    selectedFilters={currentFilters.coffeeFilters || {}}
                    onFiltersChange={handleCoffeeFiltersChange}
                  />
                </TabsContent>
              )}

              {/* Chocolate Filters Tab */}
              {chocolateFiltersData && (
                <TabsContent value="chocolate" className="space-y-6">
                  {/* Still show basic filters */}
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

                  {/* Chocolate-specific filters */}
                  <ChocolateFilter
                    filtersData={chocolateFiltersData}
                    selectedFilters={currentFilters.chocolateFilters || {}}
                    onFiltersChange={handleChocolateFiltersChange}
                  />
                </TabsContent>
              )}
            </Tabs>
          )}

          {/* If no coffee/chocolate data, show only general filters */}
          {!coffeeFiltersData && !chocolateFiltersData && (
            <>
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
