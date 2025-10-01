import { SearchFilters } from '@/lib/types/home'

// export function parseSearchParams(
//   searchParams: Record<string, string | string[]>
// ): SearchFilters {
//   return {
//     search: typeof searchParams.q === 'string' ? searchParams.q : undefined,
//     categoryId:
//       typeof searchParams.categoryId === 'string'
//         ? searchParams.categoryId
//         : undefined,
//     subCategoryId:
//       typeof searchParams.subCategoryId === 'string'
//         ? searchParams.subCategoryId
//         : undefined,
//     minPrice: searchParams.minPrice
//       ? parseInt(searchParams.minPrice as string)
//       : undefined,
//     maxPrice: searchParams.maxPrice
//       ? parseInt(searchParams.maxPrice as string)
//       : undefined,
//     sortBy: (searchParams.sortBy as SearchFilters['sortBy']) || 'newest',
//     page: searchParams.page ? parseInt(searchParams.page as string) : 1,
//     colors: Array.isArray(searchParams.colors)
//       ? searchParams.colors
//       : searchParams.colors
//       ? [searchParams.colors as string]
//       : undefined,
//     sizes: Array.isArray(searchParams.sizes)
//       ? searchParams.sizes
//       : searchParams.sizes
//       ? [searchParams.sizes as string]
//       : undefined,
//   }
// }

// export function createSearchUrl(
//   baseFilters: SearchFilters,
//   updates: Partial<SearchFilters>
// ): string {
//   const filters = { ...baseFilters, ...updates }
//   const params = new URLSearchParams()

//   Object.entries(filters).forEach(([key, value]) => {
//     if (value !== undefined && value !== null && value !== '') {
//       if (Array.isArray(value)) {
//         value.forEach((v) => params.append(key, v))
//       } else {
//         params.set(key, value.toString())
//       }
//     }
//   })

//   return `/search?${params.toString()}`
// }

function toArray(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined
  return Array.isArray(value) ? value : [value]
}

function toNumber(value: string | string[] | undefined): number | undefined {
  if (!value || Array.isArray(value)) return undefined
  const num = parseFloat(value)
  return isNaN(num) ? undefined : num
}

function toBoolean(value: string | string[] | undefined): boolean | undefined {
  if (!value || Array.isArray(value)) return undefined
  return value === 'true'
}

// Updated parse function
export function parseSearchParams(
  searchParams: Record<string, string | string[]>
): SearchFilters {
  return {
    // Basic filters
    search: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    categoryId:
      typeof searchParams.categoryId === 'string'
        ? searchParams.categoryId
        : undefined,
    subCategoryId:
      typeof searchParams.subCategoryId === 'string'
        ? searchParams.subCategoryId
        : undefined,
    minPrice: searchParams.minPrice
      ? parseInt(searchParams.minPrice as string)
      : undefined,
    maxPrice: searchParams.maxPrice
      ? parseInt(searchParams.maxPrice as string)
      : undefined,
    sortBy: (searchParams.sortBy as SearchFilters['sortBy']) || 'newest',
    page: searchParams.page ? parseInt(searchParams.page as string) : 1,
    colors: Array.isArray(searchParams.colors)
      ? searchParams.colors
      : searchParams.colors
      ? [searchParams.colors as string]
      : undefined,
    sizes: Array.isArray(searchParams.sizes)
      ? searchParams.sizes
      : searchParams.sizes
      ? [searchParams.sizes as string]
      : undefined,

    // Product type
    productType:
      (searchParams.productType as 'coffee' | 'chocolate' | 'general') ||
      undefined,

    // Coffee filters
    coffeeFilters: {
      roastLevels: toArray(searchParams.roastLevels),
      processingMethods: toArray(searchParams.processingMethods),
      origins: toArray(searchParams.coffeeOrigins),
      minCaffeine: toNumber(searchParams.minCaffeine),
      maxCaffeine: toNumber(searchParams.maxCaffeine),
      minAcidity: toNumber(searchParams.minAcidity),
      maxAcidity: toNumber(searchParams.maxAcidity),
      minBitterness: toNumber(searchParams.minBitterness),
      maxBitterness: toNumber(searchParams.maxBitterness),
      minSweetness: toNumber(searchParams.minSweetness),
      maxSweetness: toNumber(searchParams.maxSweetness),
      minBody: toNumber(searchParams.minBody),
      maxBody: toNumber(searchParams.maxBody),
      flavorNotes: toArray(searchParams.flavorNotes),
      brewingMethods: toArray(searchParams.brewingMethods),
      grindSizes: toArray(searchParams.grindSizes),
    },

    // Chocolate filters
    chocolateFilters: {
      chocolateTypes: toArray(searchParams.chocolateTypes),
      minCocoaPercentage: toNumber(searchParams.minCocoaPercentage),
      maxCocoaPercentage: toNumber(searchParams.maxCocoaPercentage),
      origins: toArray(searchParams.chocolateOrigins),
      textures: toArray(searchParams.textures),
      minSweetness: toNumber(searchParams.chocMinSweetness), // Prefixed to avoid conflict
      maxSweetness: toNumber(searchParams.chocMaxSweetness),
      minBitterness: toNumber(searchParams.chocMinBitterness),
      maxBitterness: toNumber(searchParams.chocMaxBitterness),
      minAcidity: toNumber(searchParams.chocMinAcidity),
      maxAcidity: toNumber(searchParams.chocMaxAcidity),
      minFruitiness: toNumber(searchParams.minFruitiness),
      maxFruitiness: toNumber(searchParams.maxFruitiness),
      organic: toBoolean(searchParams.organic),
      fairTrade: toBoolean(searchParams.fairTrade),
      singleOrigin: toBoolean(searchParams.singleOrigin),
      vegan: toBoolean(searchParams.vegan),
      glutenFree: toBoolean(searchParams.glutenFree),
      flavorNotes: toArray(searchParams.chocolateFlavorNotes),
    },
  }
}

// Helper to build URL from filters (useful for client-side navigation)
export function createSearchUrl(
  currentFilters: SearchFilters,
  updates: Partial<SearchFilters>
): string {
  const params = new URLSearchParams()
  const filters = { ...currentFilters, ...updates }

  if (filters.search) params.set('q', filters.search)
  if (filters.categoryId) params.set('categoryId', filters.categoryId)
  if (filters.subCategoryId) params.set('subCategoryId', filters.subCategoryId)
  if (filters.minPrice !== undefined)
    params.set('minPrice', filters.minPrice.toString())
  if (filters.maxPrice !== undefined)
    params.set('maxPrice', filters.maxPrice.toString())
  if (filters.sortBy) params.set('sortBy', filters.sortBy)
  if (filters.page && filters.page > 1)
    params.set('page', filters.page.toString())
  if (filters.productType) params.set('productType', filters.productType)

  // Colors and sizes
  filters.colors?.forEach((color) => params.append('colors', color))
  filters.sizes?.forEach((size) => params.append('sizes', size))

  // Coffee filters - only add if productType is coffee
  if (filters.productType === 'coffee' && filters.coffeeFilters) {
    const cf = filters.coffeeFilters
    cf.roastLevels?.forEach((level) => params.append('roastLevels', level))
    cf.processingMethods?.forEach((method) =>
      params.append('processingMethods', method)
    )
    cf.origins?.forEach((origin) => params.append('coffeeOrigins', origin))
    if (cf.minCaffeine !== undefined)
      params.set('minCaffeine', cf.minCaffeine.toString())
    if (cf.maxCaffeine !== undefined)
      params.set('maxCaffeine', cf.maxCaffeine.toString())
    if (cf.minAcidity !== undefined)
      params.set('minAcidity', cf.minAcidity.toString())
    if (cf.maxAcidity !== undefined)
      params.set('maxAcidity', cf.maxAcidity.toString())
    if (cf.minBitterness !== undefined)
      params.set('minBitterness', cf.minBitterness.toString())
    if (cf.maxBitterness !== undefined)
      params.set('maxBitterness', cf.maxBitterness.toString())
    if (cf.minSweetness !== undefined)
      params.set('minSweetness', cf.minSweetness.toString())
    if (cf.maxSweetness !== undefined)
      params.set('maxSweetness', cf.maxSweetness.toString())
    if (cf.minBody !== undefined) params.set('minBody', cf.minBody.toString())
    if (cf.maxBody !== undefined) params.set('maxBody', cf.maxBody.toString())
    cf.flavorNotes?.forEach((note) => params.append('flavorNotes', note))
    cf.brewingMethods?.forEach((method) =>
      params.append('brewingMethods', method)
    )
    cf.grindSizes?.forEach((size) => params.append('grindSizes', size))
  }

  // Chocolate filters - only add if productType is chocolate
  if (filters.productType === 'chocolate' && filters.chocolateFilters) {
    const chf = filters.chocolateFilters
    chf.chocolateTypes?.forEach((type) => params.append('chocolateTypes', type))
    if (chf.minCocoaPercentage !== undefined)
      params.set('minCocoaPercentage', chf.minCocoaPercentage.toString())
    if (chf.maxCocoaPercentage !== undefined)
      params.set('maxCocoaPercentage', chf.maxCocoaPercentage.toString())
    chf.origins?.forEach((origin) => params.append('chocolateOrigins', origin))
    chf.textures?.forEach((texture) => params.append('textures', texture))
    if (chf.minSweetness !== undefined)
      params.set('chocMinSweetness', chf.minSweetness.toString())
    if (chf.maxSweetness !== undefined)
      params.set('chocMaxSweetness', chf.maxSweetness.toString())
    if (chf.minBitterness !== undefined)
      params.set('chocMinBitterness', chf.minBitterness.toString())
    if (chf.maxBitterness !== undefined)
      params.set('chocMaxBitterness', chf.maxBitterness.toString())
    if (chf.minAcidity !== undefined)
      params.set('chocMinAcidity', chf.minAcidity.toString())
    if (chf.maxAcidity !== undefined)
      params.set('chocMaxAcidity', chf.maxAcidity.toString())
    if (chf.minFruitiness !== undefined)
      params.set('minFruitiness', chf.minFruitiness.toString())
    if (chf.maxFruitiness !== undefined)
      params.set('maxFruitiness', chf.maxFruitiness.toString())
    if (chf.organic !== undefined) params.set('organic', chf.organic.toString())
    if (chf.fairTrade !== undefined)
      params.set('fairTrade', chf.fairTrade.toString())
    if (chf.singleOrigin !== undefined)
      params.set('singleOrigin', chf.singleOrigin.toString())
    if (chf.vegan !== undefined) params.set('vegan', chf.vegan.toString())
    if (chf.glutenFree !== undefined)
      params.set('glutenFree', chf.glutenFree.toString())
    chf.flavorNotes?.forEach((note) =>
      params.append('chocolateFlavorNotes', note)
    )
  }

  return `/products?${params.toString()}`
}

// Helper to check if any filters are active
export function hasActiveFilters(filters: SearchFilters): boolean {
  const {
    search,
    categoryId,
    subCategoryId,
    minPrice,
    maxPrice,
    colors,
    sizes,
    productType,
    coffeeFilters,
    chocolateFilters,
  } = filters

  // Check basic filters
  if (search || categoryId || subCategoryId || minPrice || maxPrice) return true
  if (colors?.length || sizes?.length) return true
  if (productType && productType !== 'general') return true

  // Check coffee filters
  if (coffeeFilters) {
    const cf = coffeeFilters
    if (
      cf.roastLevels?.length ||
      cf.processingMethods?.length ||
      cf.origins?.length ||
      cf.minCaffeine !== undefined ||
      cf.maxCaffeine !== undefined ||
      cf.minAcidity !== undefined ||
      cf.maxAcidity !== undefined ||
      cf.minBitterness !== undefined ||
      cf.maxBitterness !== undefined ||
      cf.minSweetness !== undefined ||
      cf.maxSweetness !== undefined ||
      cf.minBody !== undefined ||
      cf.maxBody !== undefined ||
      cf.flavorNotes?.length ||
      cf.brewingMethods?.length ||
      cf.grindSizes?.length
    ) {
      return true
    }
  }

  // Check chocolate filters
  if (chocolateFilters) {
    const chf = chocolateFilters
    if (
      chf.chocolateTypes?.length ||
      chf.minCocoaPercentage !== undefined ||
      chf.maxCocoaPercentage !== undefined ||
      chf.origins?.length ||
      chf.textures?.length ||
      chf.minSweetness !== undefined ||
      chf.maxSweetness !== undefined ||
      chf.minBitterness !== undefined ||
      chf.maxBitterness !== undefined ||
      chf.minAcidity !== undefined ||
      chf.maxAcidity !== undefined ||
      chf.minFruitiness !== undefined ||
      chf.maxFruitiness !== undefined ||
      chf.organic !== undefined ||
      chf.fairTrade !== undefined ||
      chf.singleOrigin !== undefined ||
      chf.vegan !== undefined ||
      chf.glutenFree !== undefined ||
      chf.flavorNotes?.length
    ) {
      return true
    }
  }

  return false
}

// Helper to clear specific filter types
export function clearFilters(
  currentFilters: SearchFilters,
  filterType?: 'coffee' | 'chocolate' | 'all'
): SearchFilters {
  if (filterType === 'all') {
    return {
      sortBy: currentFilters.sortBy,
      page: 1,
    }
  }

  if (filterType === 'coffee') {
    return {
      ...currentFilters,
      coffeeFilters: undefined,
      productType: 'general',
      page: 1,
    }
  }

  if (filterType === 'chocolate') {
    return {
      ...currentFilters,
      chocolateFilters: undefined,
      productType: 'general',
      page: 1,
    }
  }

  return currentFilters
}

// Helper to get active filter count
export function getActiveFilterCount(filters: SearchFilters): number {
  let count = 0

  if (filters.search) count++
  if (filters.categoryId) count++
  if (filters.subCategoryId) count++
  if (filters.minPrice) count++
  if (filters.maxPrice) count++
  if (filters.colors?.length) count += filters.colors.length
  if (filters.sizes?.length) count += filters.sizes.length

  // Coffee filters
  if (filters.coffeeFilters) {
    const cf = filters.coffeeFilters
    if (cf.roastLevels?.length) count += cf.roastLevels.length
    if (cf.processingMethods?.length) count += cf.processingMethods.length
    if (cf.origins?.length) count += cf.origins.length
    if (cf.minCaffeine !== undefined || cf.maxCaffeine !== undefined) count++
    if (cf.minAcidity !== undefined || cf.maxAcidity !== undefined) count++
    if (cf.minBitterness !== undefined || cf.maxBitterness !== undefined)
      count++
    if (cf.minSweetness !== undefined || cf.maxSweetness !== undefined) count++
    if (cf.minBody !== undefined || cf.maxBody !== undefined) count++
    if (cf.flavorNotes?.length) count += cf.flavorNotes.length
    if (cf.brewingMethods?.length) count += cf.brewingMethods.length
    if (cf.grindSizes?.length) count += cf.grindSizes.length
  }

  // Chocolate filters
  if (filters.chocolateFilters) {
    const chf = filters.chocolateFilters
    if (chf.chocolateTypes?.length) count += chf.chocolateTypes.length
    if (
      chf.minCocoaPercentage !== undefined ||
      chf.maxCocoaPercentage !== undefined
    )
      count++
    if (chf.origins?.length) count += chf.origins.length
    if (chf.textures?.length) count += chf.textures.length
    if (chf.minSweetness !== undefined || chf.maxSweetness !== undefined)
      count++
    if (chf.minBitterness !== undefined || chf.maxBitterness !== undefined)
      count++
    if (chf.minAcidity !== undefined || chf.maxAcidity !== undefined) count++
    if (chf.minFruitiness !== undefined || chf.maxFruitiness !== undefined)
      count++
    if (chf.organic) count++
    if (chf.fairTrade) count++
    if (chf.singleOrigin) count++
    if (chf.vegan) count++
    if (chf.glutenFree) count++
    if (chf.flavorNotes?.length) count += chf.flavorNotes.length
  }

  return count
}
