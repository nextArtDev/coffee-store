/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentUser } from '@/lib/auth'
import { Prisma, Review } from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'
import {
  CategoryWithStats,
  ProductDetails,
  SubCategoryForHomePage,
} from '@/lib/types/home'
import { redirect } from 'next/navigation'
import { cache } from 'react'

// Homepage Products (with basic info + first image)
export async function getHomepageProducts(limit: number = 12) {
  return await prisma.product.findMany({
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
      rating: true,
      isFeatured: true,
      isSale: true,
      saleEndDate: true,
      updatedAt: true,
      // Get only the first image for performance
      images: {
        take: 1,
        select: {
          id: true,
          url: true,
          key: true,
        },
      },
      // Get minimum size info for price display
      variants: {
        select: {
          price: true,
          discount: true,
          quantity: true,
        },
        where: {
          quantity: {
            gt: 0,
          },
        },
        orderBy: [
          { quantity: 'desc' }, // Prioritize higher stock
          { price: 'asc' }, // Then lowest price
        ],
        take: 1,
      },
      category: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
      subCategory: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
      accessorySpecs: true,
      coffeeCharacteristics: true,
      chocolateCharacteristics: true,
      equipmentSpecs: true,
      reviews: { select: { rating: true } },
    },
    where: {
      variants: {
        some: {
          quantity: {
            gt: 0,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// 2. BEST SELLERS SECTION
export async function getBestSellers(limit: number = 8) {
  return await prisma.product.findMany({
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      rating: true,
      sales: true,
      description: true,
      brand: true,

      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
      subCategory: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
      variants: {
        select: {
          price: true,
          discount: true,
          quantity: true,
        },
        where: {
          quantity: {
            gt: 0,
          },
        },
        orderBy: [
          { quantity: 'desc' }, // Prioritize higher stock
          { price: 'asc' }, // Then lowest price
        ],

        take: 1,
      },
      accessorySpecs: true,
      equipmentSpecs: true,
      chocolateCharacteristics: true,
      coffeeCharacteristics: true,
      reviews: {
        select: { rating: true },
        where: {
          isPending: false,
        },
      },
    },
    where: {
      variants: {
        some: {
          quantity: {
            gt: 0,
          },
        },
      },
    },
    orderBy: {
      sales: 'desc',
    },
  })
}

// 3. NEW PRODUCTS SECTION
export async function getNewProducts(limit: number = 8) {
  return await prisma.product.findMany({
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      rating: true,
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      variants: {
        select: {
          price: true,
          discount: true,
        },
        orderBy: {
          price: 'asc',
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// 4. CATEGORIES FOR NAVIGATION/HOMEPAGE
export async function getSubCategories(): Promise<SubCategoryForHomePage[]> {
  return await prisma.subCategory.findMany({
    where: { featured: true },
    // select: {
    //   id: true,
    //   name: true,
    //   url: true,

    // },
    include: {
      images: {
        select: {
          url: true,
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}
export async function getCategoriesWithStats(): Promise<CategoryWithStats[]> {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      url: true,
      updatedAt: true,
      featured: true,
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      // Get product count for each category
      _count: {
        select: {
          products: true,
        },
      },
      subCategories: {
        select: {
          id: true,
          name: true,
          url: true,
          images: {
            select: { url: true },
            take: 1,
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
        take: 5,
        // orderBy:{

        // }
        // orderBy: {Prisma.sql`RANDOM()`}
      },
    },
    orderBy: {
      featured: 'desc',
    },
  })
  // for (const category of categories) {
  //   category.subCategories = shuffleArray(category.subCategories).slice(0, 5) // Get up to 5 random subcategories
  // }
  //return categories;
}

// 5. SEARCH/FILTER PAGE - More comprehensive
// export async function searchProducts({
//   search,
//   categoryId,
//   subCategoryId,
//   minPrice,
//   maxPrice,
//   sortBy = 'newest',
//   page = 1,
//   limit = 20,
//   colors,
//   sizes,
//   brands,
// }: {
//   search?: string
//   categoryId?: string
//   subCategoryId?: string
//   minPrice?: number
//   maxPrice?: number
//   sortBy?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating' | 'sales'
//   page?: number
//   limit?: number
//   colors?: string[]
//   sizes?: string[]
//   brands?: string[]
// }) {
//   const skip = (page - 1) * limit

//   // Build where clause
//   const where: Prisma.ProductWhereInput = { AND: [] }
//   const pushToAnd = (condition: Prisma.ProductWhereInput) =>
//     (where.AND as Prisma.ProductWhereInput[]).push(condition)

//   if (search) {
//     ;(where.AND as Prisma.ProductWhereInput[]).push({
//       OR: [
//         { name: { contains: search } },
//         { description: { contains: search } },
//         { brand: { contains: search } },
//         { keywords: { contains: search } },
//       ],
//     })
//   }

//   if (categoryId) (where.AND as Prisma.ProductWhereInput[]).push({ categoryId })
//   if (subCategoryId)
//     (where.AND as Prisma.ProductWhereInput[]).push({ subCategoryId })
//   if (brands && brands.length > 0)
//     (where.AND as Prisma.ProductWhereInput[]).push({ brand: { in: brands } })

//   // Build conditions array for complex filtering
//   const variantWhere: Prisma.ProductVariantWhereInput = { AND: [] }
//   const pushToVariantAnd = (condition: Prisma.ProductVariantWhereInput) =>
//     (variantWhere.AND as Prisma.ProductVariantWhereInput[]).push(condition)

//   if (minPrice || maxPrice) {
//     pushToVariantAnd({ price: { gte: minPrice, lte: maxPrice } })
//   }
//   if (sizes && sizes.length > 0) {
//     pushToVariantAnd({ size: { name: { in: sizes } } })
//   }
//   if (colors && colors.length > 0) {
//     pushToVariantAnd({ color: { hex: { in: colors } } })
//   }

//   if ((variantWhere.AND as unknown[]).length > 0) {
//     pushToAnd({ variants: { some: variantWhere } })
//   }

//   const isPriceSort = sortBy === 'price_asc' || sortBy === 'price_desc'
//   let orderBy: Prisma.ProductOrderByWithRelationInput = {}

//   if (!isPriceSort) {
//     switch (sortBy) {
//       case 'rating':
//         orderBy = { rating: 'desc' }
//         break
//       case 'sales':
//         orderBy = { sales: 'desc' }
//         break
//       case 'oldest':
//         orderBy = { createdAt: 'asc' }
//         break
//       case 'newest':
//       default:
//         orderBy = { createdAt: 'desc' }
//         break
//     }
//   }
//   try {
//     const [allProducts, total] = await prisma.$transaction([
//       prisma.product.findMany({
//         where,
//         include: {
//           images: { take: 1, orderBy: { created_at: 'asc' } },

//           variants: {
//             select: {
//               price: true,
//               discount: true,
//               quantity: true,
//               images: {
//                 take: 1,
//                 select: { url: true },
//                 orderBy: { created_at: 'asc' },
//               },
//               size: true,
//               color: true,
//             },
//             orderBy: [
//               { quantity: 'desc' }, // Prioritize higher stock
//               { price: 'asc' }, // Then lowest price
//             ], // Always show the cheapest variant first
//           },
//         },
//         orderBy,
//         skip: isPriceSort ? undefined : skip,
//         take: isPriceSort ? undefined : limit,
//       }),
//       prisma.product.count({ where }),
//     ])
//     let products = allProducts

//     if (isPriceSort) {
//       products.sort((a, b) => {
//         const getMinPrice = (p: typeof a) => {
//           if (!p.variants || p.variants.length === 0) return Infinity
//           // Calculate final price after discount for an accurate sort
//           return Math.min(
//             ...p.variants.map((v) => v.price - v.price * (v.discount / 100))
//           )
//         }
//         const priceA = getMinPrice(a)
//         const priceB = getMinPrice(b)

//         return sortBy === 'price_asc' ? priceA - priceB : priceB - priceA
//       })

//       // Apply pagination *after* the sort is complete
//       products = products.slice(skip, skip + limit)
//     }
//     return {
//       products,
//       pagination: {
//         total,
//         pages: Math.ceil(total / limit),
//         current: page,
//         hasNext: page < Math.ceil(total / limit),
//         hasPrev: page > 1,
//       },
//     }
//   } catch (error) {
//     console.error('Error searching products:', error)
//     return {
//       products: [],
//       pagination: {
//         total: 0,
//         pages: 1,
//         current: 1,
//         hasNext: false,
//         hasPrev: false,
//       },
//     }
//   }
// }

export async function updateSearchFilters(filters: Partial<SearchFilters>) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else {
        params.set(key, value.toString())
      }
    }
  })

  // Reset page when filters change
  params.set('page', '1')

  redirect(`/search?${params.toString()}`)
}
// 6. SINGLE PRODUCT PAGE - Full details
export const getProductDetails = cache(
  async (slug: string): Promise<ProductDetails> => {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          select: {
            // id: true,
            url: true,
            // key: true,
          },
        },
        variants: {
          select: {
            id: true,
            price: true,
            quantity: true,
            discount: true,
            weight: true,
            length: true,
            width: true,
            height: true,

            images: {
              select: {
                url: true,
              },
            },
            color: {
              select: {
                id: true,
                name: true,
                hex: true,
              },
            },
            size: {
              select: {
                id: true,
                name: true,
              },
            },
          },

          orderBy: [
            { price: 'asc' }, // Then lowest price
            { quantity: 'desc' }, // Prioritize higher stock
          ],
        },
        specs: {
          select: {
            name: true,
            value: true,
          },
        },
        questions: {
          select: {
            question: true,
            answer: true,
          },
        },
        chocolateCharacteristics: true,
        accessorySpecs: true,
        coffeeCharacteristics: true,
        equipmentSpecs: true,
        reviews: {
          where: {
            isPending: false,
          },
          select: {
            id: true,
            isFeatured: true,
            isPending: true,
            isVerifiedPurchase: true,
            rating: true,
            title: true,
            description: true,

            likes: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                //   avatar: true,
              },
            },
            images: {
              select: {
                url: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        category: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
        subCategory: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
        offerTag: {
          select: {
            name: true,
            url: true,
          },
        },
        freeShipping: {
          include: {
            eligibleCities: {
              include: {
                city: true,
              },
            },
          },
        },
      },
    })

    // Increment view count (do this async without blocking)
    if (product) {
      prisma.product
        .update({
          where: { id: product.id },
          data: { views: { increment: 1 } },
        })
        .catch(console.error)
    }

    return product
  }
)

// 7. RELATED PRODUCTS
export async function getRelatedProducts(
  productId: string,
  subCategoryId: string,
  limit: number = 6
) {
  return await prisma.product.findMany({
    where: {
      subCategoryId,
      id: { not: productId },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      rating: true,
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      variants: {
        select: {
          price: true,
          discount: true,
        },
        orderBy: {
          price: 'asc',
        },
        take: 1,
      },
    },
    take: limit,

    orderBy: {
      rating: 'desc',
    },
  })
}

// 8. FILTERS DATA FOR SEARCH PAGE
export async function getFiltersData(
  categoryId?: string,
  subCategoryId?: string
) {
  const where: Prisma.ProductWhereInput = {}
  if (categoryId) where.categoryId = categoryId
  if (subCategoryId) where.subCategoryId = subCategoryId

  try {
    const [priceRange, colors, sizes, brands] = await Promise.all([
      // Get price range
      prisma.productVariant.aggregate({
        where: { product: where },
        _min: { price: true },
        _max: { price: true },
      }),
      // Get available colors
      prisma.color.findMany({
        where: {
          variants: { some: { product: where } },
        },
        select: { name: true, hex: true },
        distinct: ['name'],
      }),
      // Get available sizes
      prisma.size.findMany({
        where: {
          variants: { some: { product: where, quantity: { gt: 0 } } },
        },
        select: { name: true },
        distinct: ['name'],
      }),
      // Get brands
      prisma.product.findMany({
        where,
        select: {
          brand: true,
        },
        distinct: ['brand'],
      }),
    ])

    return {
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 1000000,
      },
      colors: colors.map((c) => c.hex),
      sizes: sizes.map((s) => s.name),
      brands: brands.map((b) => b.brand),
    }
  } catch (error) {
    console.error('Error fetching filters data:', error)
    return {
      priceRange: { min: 0, max: 1000000 },
      colors: [],
      sizes: [],
      brands: [],
    }
  }
}

export async function getAllCategories({}) {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      url: true,
      featured: true,
    },
    orderBy: {
      featured: 'desc',
    },
  })

  return {
    categories,
  }
}

export async function getSubCategoryBySlug({ slug }: { slug: string }) {
  return await prisma.subCategory.findFirst({
    where: {
      url: slug,
    },
    include: {
      images: {
        select: { url: true },
      },
      products: {
        select: {
          id: true, // You'll likely need this
          name: true,
          slug: true,
          brand: true,
          rating: true,
          numReviews: true,
          sales: true,
          isSale: true,
          saleEndDate: true,
          images: {
            select: {
              url: true,
            },
          },
          // variantImages: {
          //   select: {
          //     url: true,
          //   },
          // },
          variants: {
            orderBy: {
              discount: 'desc',
            },
            select: {
              price: true,
              discount: true,
              quantity: true,

              size: {
                select: {
                  id: true,
                  name: true,
                },
              },
              color: {
                select: {
                  id: true,
                  name: true,
                  hex: true,
                },
              },
              images: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    },
  })
}

export const getHomePageReviews = async (): Promise<
  | (Review & {
      user: {
        name: string | null
      }
    })[]
  | null
> => {
  return await prisma.review.findMany({
    where: {},
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: {
      rating: 'desc',
    },
    take: 8,
  })
}

export async function userBookmarkedProducts({
  page = 1,
  limit = 50,
}: {
  page?: number
  limit?: number
}) {
  const skip = (page - 1) * limit
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  try {
    const [allWhishedProducts, total] = await prisma.$transaction([
      prisma.wishlist.findMany({
        where: {
          userId: user.id,
        },
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { created_at: 'asc' } },
              variants: {
                select: {
                  price: true,
                  discount: true,
                  quantity: true,
                  images: {
                    take: 1,
                    select: { url: true },
                    orderBy: { created_at: 'asc' },
                  },
                  size: true,
                  color: true,
                },
              },
            },
          },
        },
        skip: skip,
        take: limit,
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      prisma.wishlist.count({
        where: {
          userId: user.id,
        },
      }),
    ])

    // Remove the double slicing - it's already handled by Prisma's skip/take
    const products = allWhishedProducts.map((w) => w.product)

    return {
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    }
  } catch (error) {
    console.error('Error searching products:', error)
    return {
      products: [],
      pagination: {
        total: 0,
        pages: 1,
        current: 1,
        hasNext: false,
        hasPrev: false,
      },
    }
  }
}

interface SearchFilters {
  q?: string
  categoryId?: string
  subCategoryId?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  page?: number
  colors?: string[]
  sizes?: string[]
  productType?: 'coffee' | 'chocolate' | 'general'
  coffeeFilters?: {
    roastLevels?: string[]
    processingMethods?: string[]
    origins?: string[]
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
    grindSizes?: string[]
  }
  chocolateFilters?: {
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
}

export async function searchProducts(filters: SearchFilters) {
  const page = filters.page || 1
  const limit = 20
  const skip = (page - 1) * limit

  try {
    // Build base product where clause
    const productWhere: Prisma.ProductWhereInput = {}

    // Basic filters
    if (filters.q) {
      productWhere.OR = [
        { name: { contains: filters.q } },
        { description: { contains: filters.q } },
        { keywords: { contains: filters.q } },
        { brand: { contains: filters.q } },
      ]
    }

    if (filters.categoryId) {
      productWhere.categoryId = filters.categoryId
    }

    if (filters.subCategoryId) {
      productWhere.subCategoryId = filters.subCategoryId
    }

    // Price filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      productWhere.variants = {
        some: {
          price: {
            ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
            ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
          },
        },
      }
    }

    // Color and Size filters
    if (filters.colors && filters.colors.length > 0) {
      productWhere.variants = {
        ...productWhere.variants,
        some: {
          ...((
            productWhere.variants as { some?: Prisma.ProductVariantWhereInput }
          )?.some || {}),
          color: {
            hex: { in: filters.colors },
          },
        },
      }
    }

    if (filters.sizes && filters.sizes.length > 0) {
      productWhere.variants = {
        ...productWhere.variants,
        some: {
          ...((
            productWhere.variants as { some?: Prisma.ProductVariantWhereInput }
          )?.some || {}),
          size: {
            name: { in: filters.sizes },
          },
        },
      }
    }

    // Product type specific filters
    if (filters.productType === 'coffee' && filters.coffeeFilters) {
      const coffeeWhere: Prisma.CoffeeCharacteristicsWhereInput = {}

      if (
        filters.coffeeFilters.roastLevels &&
        filters.coffeeFilters.roastLevels.length > 0
      ) {
        coffeeWhere.roastLevel = {
          in: filters.coffeeFilters.roastLevels as any[],
        }
      }

      if (
        filters.coffeeFilters.processingMethods &&
        filters.coffeeFilters.processingMethods.length > 0
      ) {
        coffeeWhere.processingMethod = {
          in: filters.coffeeFilters.processingMethods as any[],
        }
      }

      if (
        filters.coffeeFilters.origins &&
        filters.coffeeFilters.origins.length > 0
      ) {
        coffeeWhere.origin = { in: filters.coffeeFilters.origins }
      }

      if (
        filters.coffeeFilters.grindSizes &&
        filters.coffeeFilters.grindSizes.length > 0
      ) {
        coffeeWhere.grindSize = {
          in: filters.coffeeFilters.grindSizes as any[],
        }
      }

      if (
        filters.coffeeFilters.minCaffeine !== undefined ||
        filters.coffeeFilters.maxCaffeine !== undefined
      ) {
        coffeeWhere.caffeineContent = {}
        if (filters.coffeeFilters.minCaffeine !== undefined) {
          coffeeWhere.caffeineContent.gte = filters.coffeeFilters.minCaffeine
        }
        if (filters.coffeeFilters.maxCaffeine !== undefined) {
          coffeeWhere.caffeineContent.lte = filters.coffeeFilters.maxCaffeine
        }
      }

      // Taste profile filters
      const tasteFilters: Prisma.CoffeeCharacteristicsWhereInput[] = []

      if (
        filters.coffeeFilters.minAcidity !== undefined ||
        filters.coffeeFilters.maxAcidity !== undefined
      ) {
        const acidityFilter: any = {}
        if (filters.coffeeFilters.minAcidity !== undefined)
          acidityFilter.gte = filters.coffeeFilters.minAcidity
        if (filters.coffeeFilters.maxAcidity !== undefined)
          acidityFilter.lte = filters.coffeeFilters.maxAcidity
        tasteFilters.push({ acidity: acidityFilter })
      }

      if (
        filters.coffeeFilters.minBitterness !== undefined ||
        filters.coffeeFilters.maxBitterness !== undefined
      ) {
        const bitternessFilter: any = {}
        if (filters.coffeeFilters.minBitterness !== undefined)
          bitternessFilter.gte = filters.coffeeFilters.minBitterness
        if (filters.coffeeFilters.maxBitterness !== undefined)
          bitternessFilter.lte = filters.coffeeFilters.maxBitterness
        tasteFilters.push({ bitterness: bitternessFilter })
      }

      if (
        filters.coffeeFilters.minSweetness !== undefined ||
        filters.coffeeFilters.maxSweetness !== undefined
      ) {
        const sweetnessFilter: any = {}
        if (filters.coffeeFilters.minSweetness !== undefined)
          sweetnessFilter.gte = filters.coffeeFilters.minSweetness
        if (filters.coffeeFilters.maxSweetness !== undefined)
          sweetnessFilter.lte = filters.coffeeFilters.maxSweetness
        tasteFilters.push({ sweetness: sweetnessFilter })
      }

      if (
        filters.coffeeFilters.minBody !== undefined ||
        filters.coffeeFilters.maxBody !== undefined
      ) {
        const bodyFilter: any = {}
        if (filters.coffeeFilters.minBody !== undefined)
          bodyFilter.gte = filters.coffeeFilters.minBody
        if (filters.coffeeFilters.maxBody !== undefined)
          bodyFilter.lte = filters.coffeeFilters.maxBody
        tasteFilters.push({ body: bodyFilter })
      }

      if (tasteFilters.length > 0) {
        coffeeWhere.AND = tasteFilters
      }

      // Flavor notes and brewing methods (OR conditions)
      const orConditions: Prisma.CoffeeCharacteristicsWhereInput[] = []

      if (
        filters.coffeeFilters.flavorNotes &&
        filters.coffeeFilters.flavorNotes.length > 0
      ) {
        filters.coffeeFilters.flavorNotes.forEach((note) => {
          orConditions.push({ flavorNotes: { contains: note } })
        })
      }

      if (
        filters.coffeeFilters.brewingMethods &&
        filters.coffeeFilters.brewingMethods.length > 0
      ) {
        filters.coffeeFilters.brewingMethods.forEach((method) => {
          orConditions.push({ brewingMethods: { contains: method } })
        })
      }

      if (orConditions.length > 0) {
        coffeeWhere.OR = orConditions
      }

      productWhere.coffeeCharacteristics = coffeeWhere
    }

    if (filters.productType === 'chocolate' && filters.chocolateFilters) {
      const chocolateWhere: Prisma.ChocolateCharacteristicsWhereInput = {}
      const tasteFilters: Prisma.ChocolateCharacteristicsWhereInput[] = []

      if (
        filters.chocolateFilters.minBitterness !== undefined ||
        filters.chocolateFilters.maxBitterness !== undefined
      ) {
        const bitternessFilter: any = {}
        if (filters.chocolateFilters.minBitterness !== undefined)
          bitternessFilter.gte = filters.chocolateFilters.minBitterness
        if (filters.chocolateFilters.maxBitterness !== undefined)
          bitternessFilter.lte = filters.chocolateFilters.maxBitterness
        tasteFilters.push({ bitterness: bitternessFilter })
      }

      if (
        filters.chocolateFilters.minAcidity !== undefined ||
        filters.chocolateFilters.maxAcidity !== undefined
      ) {
        const acidityFilter: any = {}
        if (filters.chocolateFilters.minAcidity !== undefined)
          acidityFilter.gte = filters.chocolateFilters.minAcidity
        if (filters.chocolateFilters.maxAcidity !== undefined)
          acidityFilter.lte = filters.chocolateFilters.maxAcidity
        tasteFilters.push({ acidity: acidityFilter })
      }

      if (
        filters.chocolateFilters.minFruitiness !== undefined ||
        filters.chocolateFilters.maxFruitiness !== undefined
      ) {
        const fruitinessFilter: any = {}
        if (filters.chocolateFilters.minFruitiness !== undefined)
          fruitinessFilter.gte = filters.chocolateFilters.minFruitiness
        if (filters.chocolateFilters.maxFruitiness !== undefined)
          fruitinessFilter.lte = filters.chocolateFilters.maxFruitiness
        tasteFilters.push({ fruitiness: fruitinessFilter })
      }

      if (tasteFilters.length > 0) {
        chocolateWhere.AND = tasteFilters
      }

      // Certifications
      if (filters.chocolateFilters.organic !== undefined) {
        chocolateWhere.organic = filters.chocolateFilters.organic
      }
      if (filters.chocolateFilters.fairTrade !== undefined) {
        chocolateWhere.fairTrade = filters.chocolateFilters.fairTrade
      }
      if (filters.chocolateFilters.singleOrigin !== undefined) {
        chocolateWhere.singleOrigin = filters.chocolateFilters.singleOrigin
      }
      if (filters.chocolateFilters.vegan !== undefined) {
        chocolateWhere.vegan = filters.chocolateFilters.vegan
      }
      if (filters.chocolateFilters.glutenFree !== undefined) {
        chocolateWhere.glutenFree = filters.chocolateFilters.glutenFree
      }

      // Flavor notes
      if (
        filters.chocolateFilters.flavorNotes &&
        filters.chocolateFilters.flavorNotes.length > 0
      ) {
        chocolateWhere.OR = filters.chocolateFilters.flavorNotes.map(
          (note) => ({
            flavorNotes: { contains: note },
          })
        )
      }

      productWhere.chocolateCharacteristics = chocolateWhere
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          orderBy = { variants: { _count: 'asc' } } // Will need custom logic for min price
          break
        case 'price-desc':
          orderBy = { variants: { _count: 'desc' } } // Will need custom logic for max price
          break
        case 'rating':
          orderBy = { rating: 'desc' }
          break
        case 'sales':
          orderBy = { sales: 'desc' }
          break
        case 'newest':
          orderBy = { createdAt: 'desc' }
          break
        default:
          orderBy = { createdAt: 'desc' }
      }
    }

    // Fetch products
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: productWhere,
        include: {
          images: true,
          variants: {
            include: {
              size: true,
              color: true,
              images: true,
            },
            where: {
              quantity: { gt: 0 },
            },
          },
          category: true,
          subCategory: true,
          coffeeCharacteristics: true,
          chocolateCharacteristics: true,
          equipmentSpecs: true,
          accessorySpecs: true,
          // brand: true,
          offerTag: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where: productWhere }),
    ])

    return {
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    }
  } catch (error) {
    console.error('Error searching products:', error)
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    }
  }
}

// ============================================
// Helper function to get products sorted by price
// ============================================

export async function searchProductsSortedByPrice(
  filters: SearchFilters,
  sortOrder: 'asc' | 'desc' = 'asc'
) {
  const page = filters.page || 1
  const limit = 20

  try {
    // First get all matching product IDs with their minimum prices
    const productWhere: Prisma.ProductWhereInput = {}

    // Apply all the same filters as searchProducts (reuse logic)
    if (filters.q) {
      productWhere.OR = [
        { name: { contains: filters.q } },
        { description: { contains: filters.q } },
        { keywords: { contains: filters.q } },
        { brand: { contains: filters.q } },
      ]
    }

    if (filters.categoryId) productWhere.categoryId = filters.categoryId
    if (filters.subCategoryId)
      productWhere.subCategoryId = filters.subCategoryId

    // Get all products with their variants to calculate min/max prices
    const productsWithPrices = await prisma.product.findMany({
      where: productWhere,
      select: {
        id: true,
        variants: {
          select: {
            price: true,
          },
          where: {
            quantity: { gt: 0 },
          },
        },
      },
    })

    // Calculate min price for each product and sort
    const productsWithMinPrice = productsWithPrices
      .map((p) => ({
        id: p.id,
        minPrice:
          p.variants.length > 0
            ? Math.min(...p.variants.map((v) => v.price))
            : Infinity,
      }))
      .filter((p) => p.minPrice !== Infinity)
      .sort((a, b) =>
        sortOrder === 'asc' ? a.minPrice - b.minPrice : b.minPrice - a.minPrice
      )

    // Apply pagination
    const paginatedIds = productsWithMinPrice
      .slice((page - 1) * limit, page * limit)
      .map((p) => p.id)

    // Fetch full product data for paginated results
    const products = await prisma.product.findMany({
      where: {
        id: { in: paginatedIds },
      },
      include: {
        images: true,
        variants: {
          include: {
            size: true,
            color: true,
            images: true,
          },
          where: {
            quantity: { gt: 0 },
          },
        },
        category: true,
        subCategory: true,
        coffeeCharacteristics: true,
        chocolateCharacteristics: true,
        equipmentSpecs: true,
        accessorySpecs: true,
      },
    })

    // Sort products according to paginatedIds order
    const orderedProducts = paginatedIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)

    return {
      products: orderedProducts,
      totalCount: productsWithMinPrice.length,
      totalPages: Math.ceil(productsWithMinPrice.length / limit),
      currentPage: page,
    }
  } catch (error) {
    console.error('Error searching products sorted by price:', error)
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    }
  }
}
