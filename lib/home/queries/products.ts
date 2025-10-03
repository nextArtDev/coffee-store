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
    const [priceRange, colors, sizes, brands, coffeeData, chocolateData] =
      await Promise.all([
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
        prisma.coffeeCharacteristics.findMany({
          where: { product: where },
          select: {
            roastLevel: true,
            processingMethod: true,
            origin: true,
            grindSize: true,
            caffeineContent: true,
            acidity: true,
            bitterness: true,
            sweetness: true,
            body: true,
            flavorNotes: true,
            brewingMethods: true,
          },
        }),

        // Chocolate filters data
        prisma.chocolateCharacteristics.findMany({
          where: { product: where },
          select: {
            chocolateType: true,
            origin: true,
            texture: true,
            cocoaPercentage: true,
            sweetness: true,
            bitterness: true,
            acidity: true,
            fruitiness: true,
            flavorNotes: true,
            organic: true,
            fairTrade: true,
            singleOrigin: true,
            vegan: true,
            glutenFree: true,
          },
        }),
      ])
    const coffeeFiltersData =
      coffeeData.length > 0
        ? {
            roastLevels: [
              ...new Set(coffeeData.map((c) => c.roastLevel).filter(Boolean)),
            ],
            processingMethods: [
              ...new Set(
                coffeeData.map((c) => c.processingMethod).filter(Boolean)
              ),
            ],
            origins: [
              ...new Set(coffeeData.map((c) => c.origin).filter(Boolean)),
            ],
            grindSizes: [
              ...new Set(coffeeData.map((c) => c.grindSize).filter(Boolean)),
            ],
            caffeineRange: {
              min: Math.min(...coffeeData.map((c) => c.caffeineContent || 0)),
              max: Math.max(...coffeeData.map((c) => c.caffeineContent || 200)),
            },
            tasteRanges: {
              acidity: {
                min: Math.min(...coffeeData.map((c) => c.acidity || 1)),
                max: Math.max(...coffeeData.map((c) => c.acidity || 10)),
              },
              bitterness: {
                min: Math.min(...coffeeData.map((c) => c.bitterness || 1)),
                max: Math.max(...coffeeData.map((c) => c.bitterness || 10)),
              },
              sweetness: {
                min: Math.min(...coffeeData.map((c) => c.sweetness || 1)),
                max: Math.max(...coffeeData.map((c) => c.sweetness || 10)),
              },
              body: {
                min: Math.min(...coffeeData.map((c) => c.body || 1)),
                max: Math.max(...coffeeData.map((c) => c.body || 10)),
              },
            },
            flavorNotes: [
              ...new Set(
                coffeeData.flatMap((c) =>
                  c.flavorNotes ? JSON.parse(c.flavorNotes) : []
                )
              ),
            ],
            brewingMethods: [
              ...new Set(
                coffeeData.flatMap((c) =>
                  c.brewingMethods ? JSON.parse(c.brewingMethods) : []
                )
              ),
            ],
          }
        : null

    // Process chocolate data
    const chocolateFiltersData =
      chocolateData.length > 0
        ? {
            chocolateTypes: [
              ...new Set(
                chocolateData.map((c) => c.chocolateType).filter(Boolean)
              ),
            ],
            origins: [
              ...new Set(chocolateData.map((c) => c.origin).filter(Boolean)),
            ],
            textures: [
              ...new Set(chocolateData.map((c) => c.texture).filter(Boolean)),
            ],
            cocoaRange: {
              min: Math.min(
                ...chocolateData.map((c) => c.cocoaPercentage || 0)
              ),
              max: Math.max(
                ...chocolateData.map((c) => c.cocoaPercentage || 100)
              ),
            },
            tasteRanges: {
              sweetness: {
                min: Math.min(...chocolateData.map((c) => c.sweetness || 1)),
                max: Math.max(...chocolateData.map((c) => c.sweetness || 10)),
              },
              bitterness: {
                min: Math.min(...chocolateData.map((c) => c.bitterness || 1)),
                max: Math.max(...chocolateData.map((c) => c.bitterness || 10)),
              },
              acidity: {
                min: Math.min(...chocolateData.map((c) => c.acidity || 1)),
                max: Math.max(...chocolateData.map((c) => c.acidity || 10)),
              },
              fruitiness: {
                min: Math.min(...chocolateData.map((c) => c.fruitiness || 1)),
                max: Math.max(...chocolateData.map((c) => c.fruitiness || 10)),
              },
            },
            availableCertifications: {
              organic: chocolateData.some((c) => c.organic),
              fairTrade: chocolateData.some((c) => c.fairTrade),
              singleOrigin: chocolateData.some((c) => c.singleOrigin),
              vegan: chocolateData.some((c) => c.vegan),
              glutenFree: chocolateData.some((c) => c.glutenFree),
            },
            flavorNotes: [
              ...new Set(
                chocolateData.flatMap((c) =>
                  c.flavorNotes ? JSON.parse(c.flavorNotes) : []
                )
              ),
            ],
          }
        : null
    return {
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 1000000,
      },
      colors: colors.map((c) => c.hex),
      sizes: sizes.map((s) => s.name),
      brands: brands.map((b) => b.brand),
      coffeeFiltersData,
      chocolateFiltersData,
    }
  } catch (error) {
    console.error('Error fetching filters data:', error)
    return {
      priceRange: { min: 0, max: 1000000 },
      colors: [],
      sizes: [],
      brands: [],
      coffeeFiltersData: null,
      chocolateFiltersData: null,
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
export async function getCategoryBySlug({ slug }: { slug: string }) {
  return await prisma.category.findFirst({
    where: {
      url: slug,
    },
    include: {
      images: {
        select: { url: true },
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
    const productWhere: Prisma.ProductWhereInput = {}

    // Basic search
    if (filters.q) {
      productWhere.OR = [
        { name: { contains: filters.q } },
        { description: { contains: filters.q } },
        { keywords: { contains: filters.q } },
        { brand: { contains: filters.q } },
      ]
    }

    // Category filters
    if (filters.categoryId) {
      productWhere.categoryId = filters.categoryId
    }

    if (filters.subCategoryId) {
      productWhere.subCategoryId = filters.subCategoryId
    }

    // Price filter - must have at least one variant in range
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

    // Color and Size filters - combine with existing variant filters
    const variantConditions: Prisma.ProductVariantWhereInput[] = []

    if (filters.colors && filters.colors.length > 0) {
      variantConditions.push({
        color: { hex: { in: filters.colors } },
      })
    }

    if (filters.sizes && filters.sizes.length > 0) {
      variantConditions.push({
        size: { name: { in: filters.sizes } },
      })
    }

    // If we have variant conditions, combine them
    if (variantConditions.length > 0) {
      const baseVariantFilter = productWhere.variants || {}
      productWhere.variants = {
        some: {
          ...((baseVariantFilter as any)?.some || {}),
          AND: variantConditions,
        },
      }
    }

    // ===== COFFEE FILTERS =====
    if (filters.productType === 'coffee' && filters.coffeeFilters) {
      const coffeeWhere: Prisma.CoffeeCharacteristicsWhereInput = {}
      const coffeeAndConditions: Prisma.CoffeeCharacteristicsWhereInput[] = []

      // Enum filters (roast level, processing method, grind size)
      if (filters.coffeeFilters.roastLevels?.length) {
        coffeeWhere.roastLevel = {
          in: filters.coffeeFilters.roastLevels as any[],
        }
      }

      if (filters.coffeeFilters.processingMethods?.length) {
        coffeeWhere.processingMethod = {
          in: filters.coffeeFilters.processingMethods as any[],
        }
      }

      if (filters.coffeeFilters.grindSizes?.length) {
        coffeeWhere.grindSize = {
          in: filters.coffeeFilters.grindSizes as any[],
        }
      }

      // Origin filter
      if (filters.coffeeFilters.origins?.length) {
        coffeeWhere.origin = { in: filters.coffeeFilters.origins }
      }

      // Caffeine content range
      if (
        filters.coffeeFilters.minCaffeine !== undefined ||
        filters.coffeeFilters.maxCaffeine !== undefined
      ) {
        coffeeWhere.caffeineContent = {
          ...(filters.coffeeFilters.minCaffeine !== undefined && {
            gte: filters.coffeeFilters.minCaffeine,
          }),
          ...(filters.coffeeFilters.maxCaffeine !== undefined && {
            lte: filters.coffeeFilters.maxCaffeine,
          }),
        }
      }

      // Taste profile ranges - each as separate AND condition
      if (
        filters.coffeeFilters.minAcidity !== undefined ||
        filters.coffeeFilters.maxAcidity !== undefined
      ) {
        coffeeAndConditions.push({
          acidity: {
            ...(filters.coffeeFilters.minAcidity !== undefined && {
              gte: filters.coffeeFilters.minAcidity,
            }),
            ...(filters.coffeeFilters.maxAcidity !== undefined && {
              lte: filters.coffeeFilters.maxAcidity,
            }),
          },
        })
      }

      if (
        filters.coffeeFilters.minBitterness !== undefined ||
        filters.coffeeFilters.maxBitterness !== undefined
      ) {
        coffeeAndConditions.push({
          bitterness: {
            ...(filters.coffeeFilters.minBitterness !== undefined && {
              gte: filters.coffeeFilters.minBitterness,
            }),
            ...(filters.coffeeFilters.maxBitterness !== undefined && {
              lte: filters.coffeeFilters.maxBitterness,
            }),
          },
        })
      }

      if (
        filters.coffeeFilters.minSweetness !== undefined ||
        filters.coffeeFilters.maxSweetness !== undefined
      ) {
        coffeeAndConditions.push({
          sweetness: {
            ...(filters.coffeeFilters.minSweetness !== undefined && {
              gte: filters.coffeeFilters.minSweetness,
            }),
            ...(filters.coffeeFilters.maxSweetness !== undefined && {
              lte: filters.coffeeFilters.maxSweetness,
            }),
          },
        })
      }

      if (
        filters.coffeeFilters.minBody !== undefined ||
        filters.coffeeFilters.maxBody !== undefined
      ) {
        coffeeAndConditions.push({
          body: {
            ...(filters.coffeeFilters.minBody !== undefined && {
              gte: filters.coffeeFilters.minBody,
            }),
            ...(filters.coffeeFilters.maxBody !== undefined && {
              lte: filters.coffeeFilters.maxBody,
            }),
          },
        })
      }

      // Apply AND conditions
      if (coffeeAndConditions.length > 0) {
        coffeeWhere.AND = coffeeAndConditions
      }

      // Flavor notes and brewing methods (OR conditions for contains)
      const coffeeOrConditions: Prisma.CoffeeCharacteristicsWhereInput[] = []

      if (filters.coffeeFilters.flavorNotes?.length) {
        filters.coffeeFilters.flavorNotes.forEach((note) => {
          coffeeOrConditions.push({ flavorNotes: { contains: note } })
        })
      }

      if (filters.coffeeFilters.brewingMethods?.length) {
        filters.coffeeFilters.brewingMethods.forEach((method) => {
          coffeeOrConditions.push({ brewingMethods: { contains: method } })
        })
      }

      if (coffeeOrConditions.length > 0) {
        coffeeWhere.OR = coffeeOrConditions
      }

      productWhere.coffeeCharacteristics = coffeeWhere
    }

    // ===== CHOCOLATE FILTERS =====
    if (filters.productType === 'chocolate' && filters.chocolateFilters) {
      const chocolateWhere: Prisma.ChocolateCharacteristicsWhereInput = {}
      const chocolateAndConditions: Prisma.ChocolateCharacteristicsWhereInput[] =
        []

      // Type and texture filters
      if (filters.chocolateFilters.chocolateTypes?.length) {
        chocolateWhere.chocolateType = {
          in: filters.chocolateFilters.chocolateTypes as any[],
        }
      }

      if (filters.chocolateFilters.textures?.length) {
        chocolateWhere.texture = {
          in: filters.chocolateFilters.textures as any[],
        }
      }

      // Origin filter
      if (filters.chocolateFilters.origins?.length) {
        chocolateWhere.origin = { in: filters.chocolateFilters.origins }
      }

      // Cocoa percentage range
      if (
        filters.chocolateFilters.minCocoaPercentage !== undefined ||
        filters.chocolateFilters.maxCocoaPercentage !== undefined
      ) {
        chocolateWhere.cocoaPercentage = {
          ...(filters.chocolateFilters.minCocoaPercentage !== undefined && {
            gte: filters.chocolateFilters.minCocoaPercentage,
          }),
          ...(filters.chocolateFilters.maxCocoaPercentage !== undefined && {
            lte: filters.chocolateFilters.maxCocoaPercentage,
          }),
        }
      }

      // Taste profile ranges
      if (
        filters.chocolateFilters.minBitterness !== undefined ||
        filters.chocolateFilters.maxBitterness !== undefined
      ) {
        chocolateAndConditions.push({
          bitterness: {
            ...(filters.chocolateFilters.minBitterness !== undefined && {
              gte: filters.chocolateFilters.minBitterness,
            }),
            ...(filters.chocolateFilters.maxBitterness !== undefined && {
              lte: filters.chocolateFilters.maxBitterness,
            }),
          },
        })
      }

      if (
        filters.chocolateFilters.minAcidity !== undefined ||
        filters.chocolateFilters.maxAcidity !== undefined
      ) {
        chocolateAndConditions.push({
          acidity: {
            ...(filters.chocolateFilters.minAcidity !== undefined && {
              gte: filters.chocolateFilters.minAcidity,
            }),
            ...(filters.chocolateFilters.maxAcidity !== undefined && {
              lte: filters.chocolateFilters.maxAcidity,
            }),
          },
        })
      }

      if (
        filters.chocolateFilters.minFruitiness !== undefined ||
        filters.chocolateFilters.maxFruitiness !== undefined
      ) {
        chocolateAndConditions.push({
          fruitiness: {
            ...(filters.chocolateFilters.minFruitiness !== undefined && {
              gte: filters.chocolateFilters.minFruitiness,
            }),
            ...(filters.chocolateFilters.maxFruitiness !== undefined && {
              lte: filters.chocolateFilters.maxFruitiness,
            }),
          },
        })
      }

      if (
        filters.chocolateFilters.minSweetness !== undefined ||
        filters.chocolateFilters.maxSweetness !== undefined
      ) {
        chocolateAndConditions.push({
          sweetness: {
            ...(filters.chocolateFilters.minSweetness !== undefined && {
              gte: filters.chocolateFilters.minSweetness,
            }),
            ...(filters.chocolateFilters.maxSweetness !== undefined && {
              lte: filters.chocolateFilters.maxSweetness,
            }),
          },
        })
      }

      if (chocolateAndConditions.length > 0) {
        chocolateWhere.AND = chocolateAndConditions
      }

      // Certifications (boolean filters)
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

      // Flavor notes (OR conditions)
      if (filters.chocolateFilters.flavorNotes?.length) {
        chocolateWhere.OR = filters.chocolateFilters.flavorNotes.map(
          (note) => ({
            flavorNotes: { contains: note },
          })
        )
      }

      productWhere.chocolateCharacteristics = chocolateWhere
    }

    // ===== SORTING =====
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'rating':
          orderBy = { rating: 'desc' }
          break
        case 'sales':
          orderBy = { sales: 'desc' }
          break
        case 'newest':
          orderBy = { createdAt: 'desc' }
          break
        case 'oldest':
          orderBy = { createdAt: 'asc' }
          break
        // Price sorting handled after fetch
        case 'price-asc':
        case 'price-desc':
          orderBy = { createdAt: 'desc' }
          break
        default:
          orderBy = { createdAt: 'desc' }
      }
    }

    // ===== FETCH PRODUCTS =====
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
            where: { quantity: { gt: 0 } },
          },
          category: true,
          subCategory: true,
          coffeeCharacteristics: true,
          chocolateCharacteristics: true,
          equipmentSpecs: true,
          accessorySpecs: true,
          offerTag: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where: productWhere }),
    ])

    // ===== HANDLE PRICE SORTING =====
    if (filters.sortBy === 'price-asc' || filters.sortBy === 'price-desc') {
      products.sort((a, b) => {
        const getMinPrice = (product: (typeof products)[0]) => {
          if (product.variants.length === 0) return Infinity
          return Math.min(
            ...product.variants.map((v) => v.price * (1 - v.discount / 100))
          )
        }

        const aPrice = getMinPrice(a)
        const bPrice = getMinPrice(b)

        return filters.sortBy === 'price-asc'
          ? aPrice - bPrice
          : bPrice - aPrice
      })
    }

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

function parseFlavorNotes(value: string | null): string[] {
  if (!value) return []

  // Try parsing as JSON first
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // If JSON parsing fails, treat as comma-separated string
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }
}

// Get available coffee filter options
export async function getCoffeeFiltersData(categoryId?: string) {
  try {
    const where: Prisma.ProductWhereInput = {
      coffeeCharacteristics: { isNot: null },
    }
    if (categoryId) where.categoryId = categoryId

    const [
      roastLevels,
      processingMethods,
      origins,
      grindSizes,
      caffeineRange,
      tasteRanges,
      allCoffeeProducts,
    ] = await Promise.all([
      prisma.coffeeCharacteristics.findMany({
        where: { product: where },
        select: { roastLevel: true },
        distinct: ['roastLevel'],
      }),
      prisma.coffeeCharacteristics.findMany({
        where: { product: where },
        select: { processingMethod: true },
        distinct: ['processingMethod'],
      }),
      prisma.coffeeCharacteristics.findMany({
        where: { product: where, origin: { not: null } },
        select: { origin: true },
        distinct: ['origin'],
      }),
      prisma.coffeeCharacteristics.findMany({
        where: { product: where },
        select: { grindSize: true },
        distinct: ['grindSize'],
      }),
      prisma.coffeeCharacteristics.aggregate({
        where: { product: where },
        _min: { caffeineContent: true },
        _max: { caffeineContent: true },
      }),
      prisma.coffeeCharacteristics.aggregate({
        where: { product: where },
        _min: {
          acidity: true,
          bitterness: true,
          sweetness: true,
          body: true,
        },
        _max: {
          acidity: true,
          bitterness: true,
          sweetness: true,
          body: true,
        },
      }),
      prisma.coffeeCharacteristics.findMany({
        where: { product: where },
        select: {
          flavorNotes: true,
          brewingMethods: true,
        },
      }),
    ])

    // Extract unique flavor notes - FIXED VERSION
    const flavorNotesSet = new Set<string>()
    const brewingMethodsSet = new Set<string>()

    allCoffeeProducts.forEach((product) => {
      // Use helper function instead of direct JSON.parse
      if (product.flavorNotes) {
        const notes = parseFlavorNotes(product.flavorNotes)
        notes.forEach((note) => flavorNotesSet.add(note))
      }

      if (product.brewingMethods) {
        const methods = parseFlavorNotes(product.brewingMethods)
        methods.forEach((method) => brewingMethodsSet.add(method))
      }
    })

    return {
      roastLevels: roastLevels
        .map((r) => r.roastLevel)
        .filter((r): r is NonNullable<typeof r> => r !== null),
      processingMethods: processingMethods
        .map((p) => p.processingMethod)
        .filter((p): p is NonNullable<typeof p> => p !== null),
      origins: origins
        .map((o) => o.origin)
        .filter((o): o is NonNullable<typeof o> => o !== null),
      grindSizes: grindSizes
        .map((g) => g.grindSize)
        .filter((g): g is NonNullable<typeof g> => g !== null),
      caffeineRange: {
        min: caffeineRange._min.caffeineContent || 0,
        max: caffeineRange._max.caffeineContent || 400,
      },
      tasteRanges: {
        acidity: {
          min: tasteRanges._min.acidity || 1,
          max: tasteRanges._max.acidity || 10,
        },
        bitterness: {
          min: tasteRanges._min.bitterness || 1,
          max: tasteRanges._max.bitterness || 10,
        },
        sweetness: {
          min: tasteRanges._min.sweetness || 1,
          max: tasteRanges._max.sweetness || 10,
        },
        body: {
          min: tasteRanges._min.body || 1,
          max: tasteRanges._max.body || 10,
        },
      },
      flavorNotes: Array.from(flavorNotesSet),
      brewingMethods: Array.from(brewingMethodsSet),
    }
  } catch (error) {
    console.error('Error fetching coffee filters data:', error)
    return {
      roastLevels: [],
      processingMethods: [],
      origins: [],
      grindSizes: [],
      caffeineRange: { min: 0, max: 400 },
      tasteRanges: {
        acidity: { min: 1, max: 10 },
        bitterness: { min: 1, max: 10 },
        sweetness: { min: 1, max: 10 },
        body: { min: 1, max: 10 },
      },
      flavorNotes: [],
      brewingMethods: [],
    }
  }
}

// Get available chocolate filter options
export async function getChocolateFiltersData(categoryId?: string) {
  try {
    const where: Prisma.ProductWhereInput = {
      chocolateCharacteristics: { isNot: null },
    }
    if (categoryId) where.categoryId = categoryId

    const [
      chocolateTypes,
      origins,
      textures,
      cocoaRange,
      tasteRanges,
      certifications,
      allChocolateProducts,
    ] = await Promise.all([
      prisma.chocolateCharacteristics.findMany({
        where: { product: where },
        select: { chocolateType: true },
        distinct: ['chocolateType'],
      }),
      prisma.chocolateCharacteristics.findMany({
        where: { product: where, origin: { not: null } },
        select: { origin: true },
        distinct: ['origin'],
      }),
      prisma.chocolateCharacteristics.findMany({
        where: { product: where },
        select: { texture: true },
        distinct: ['texture'],
      }),
      prisma.chocolateCharacteristics.aggregate({
        where: { product: where },
        _min: { cocoaPercentage: true },
        _max: { cocoaPercentage: true },
      }),
      prisma.chocolateCharacteristics.aggregate({
        where: { product: where },
        _min: {
          sweetness: true,
          bitterness: true,
          acidity: true,
          fruitiness: true,
        },
        _max: {
          sweetness: true,
          bitterness: true,
          acidity: true,
          fruitiness: true,
        },
      }),
      prisma.chocolateCharacteristics.findMany({
        where: { product: where },
        select: {
          organic: true,
          fairTrade: true,
          singleOrigin: true,
          vegan: true,
          glutenFree: true,
        },
      }),
      prisma.chocolateCharacteristics.findMany({
        where: { product: where },
        select: {
          flavorNotes: true,
        },
      }),
    ])

    // Extract unique flavor notes - FIXED VERSION
    const flavorNotesSet = new Set<string>()
    allChocolateProducts.forEach((product) => {
      if (product.flavorNotes) {
        const notes = parseFlavorNotes(product.flavorNotes)
        notes.forEach((note) => flavorNotesSet.add(note))
      }
    })

    const availableCertifications = {
      organic: certifications.some((c) => c.organic === true),
      fairTrade: certifications.some((c) => c.fairTrade === true),
      singleOrigin: certifications.some((c) => c.singleOrigin === true),
      vegan: certifications.some((c) => c.vegan === true),
      glutenFree: certifications.some((c) => c.glutenFree === true),
    }

    return {
      chocolateTypes: chocolateTypes
        .map((c) => c.chocolateType)
        .filter((c): c is NonNullable<typeof c> => c !== null),
      origins: origins
        .map((o) => o.origin)
        .filter((o): o is NonNullable<typeof o> => o !== null),
      textures: textures
        .map((t) => t.texture)
        .filter((t): t is NonNullable<typeof t> => t !== null),
      cocoaRange: {
        min: cocoaRange._min.cocoaPercentage || 0,
        max: cocoaRange._max.cocoaPercentage || 100,
      },
      tasteRanges: {
        sweetness: {
          min: tasteRanges._min.sweetness || 1,
          max: tasteRanges._max.sweetness || 10,
        },
        bitterness: {
          min: tasteRanges._min.bitterness || 1,
          max: tasteRanges._max.bitterness || 10,
        },
        acidity: {
          min: tasteRanges._min.acidity || 1,
          max: tasteRanges._max.acidity || 10,
        },
        fruitiness: {
          min: tasteRanges._min.fruitiness || 1,
          max: tasteRanges._max.fruitiness || 10,
        },
      },
      availableCertifications,
      flavorNotes: Array.from(flavorNotesSet),
    }
  } catch (error) {
    console.error('Error fetching chocolate filters data:', error)
    return {
      chocolateTypes: [],
      origins: [],
      textures: [],
      cocoaRange: { min: 0, max: 100 },
      tasteRanges: {
        sweetness: { min: 1, max: 10 },
        bitterness: { min: 1, max: 10 },
        acidity: { min: 1, max: 10 },
        fruitiness: { min: 1, max: 10 },
      },
      availableCertifications: {
        organic: false,
        fairTrade: false,
        singleOrigin: false,
        vegan: false,
        glutenFree: false,
      },
      flavorNotes: [],
    }
  }
}

// BONUS: Database migration helper to fix existing data
export async function fixFlavorNotesFormat() {
  try {
    // Fix Coffee flavor notes
    const coffeeProducts = await prisma.coffeeCharacteristics.findMany({
      where: {
        OR: [
          { flavorNotes: { not: { startsWith: '[' } } },
          { brewingMethods: { not: { startsWith: '[' } } },
        ],
      },
    })

    for (const coffee of coffeeProducts) {
      const updates: any = {}

      if (coffee.flavorNotes && !coffee.flavorNotes.startsWith('[')) {
        const notes = coffee.flavorNotes.split(',').map((n) => n.trim())
        updates.flavorNotes = JSON.stringify(notes)
      }

      if (coffee.brewingMethods && !coffee.brewingMethods.startsWith('[')) {
        const methods = coffee.brewingMethods.split(',').map((m) => m.trim())
        updates.brewingMethods = JSON.stringify(methods)
      }

      if (Object.keys(updates).length > 0) {
        await prisma.coffeeCharacteristics.update({
          where: { id: coffee.id },
          data: updates,
        })
      }
    }

    // Fix Chocolate flavor notes
    const chocolateProducts = await prisma.chocolateCharacteristics.findMany({
      where: {
        flavorNotes: { not: { startsWith: '[' } },
      },
    })

    for (const chocolate of chocolateProducts) {
      if (chocolate.flavorNotes && !chocolate.flavorNotes.startsWith('[')) {
        const notes = chocolate.flavorNotes.split(',').map((n) => n.trim())
        await prisma.chocolateCharacteristics.update({
          where: { id: chocolate.id },
          data: {
            flavorNotes: JSON.stringify(notes),
          },
        })
      }
    }

    console.log(
      `✅ Fixed ${coffeeProducts.length} coffee and ${chocolateProducts.length} chocolate products`
    )
    return {
      success: true,
      fixed: coffeeProducts.length + chocolateProducts.length,
    }
  } catch (error) {
    console.error('Error fixing flavor notes:', error)
    return { success: false, error }
  }
}
