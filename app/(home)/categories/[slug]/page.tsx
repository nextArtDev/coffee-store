import { notFound } from 'next/navigation'
import React from 'react'
import { getCategoryBySlug } from '@/lib/home/queries/products'
import { Bounded } from '@/components/shared/Bounded'
import { FadeIn } from '@/components/shared/fade-in'
import Image from 'next/image'
import { RevealText } from '@/components/shared/reveal-text'
import { Metadata } from 'next'
import SubCategoryGrid from './components/SubCategoryGrid'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const slug = (await params).slug
  const category = await getCategoryBySlug({ slug })

  if (!category) {
    return {
      title: 'دسته‌بندی مورد نظر پیدا نشد!',
      description: 'دسته‌بندی مورد نظر یافت نمی‌شود.',
      robots: 'noindex, nofollow',
    }
  }

  const categoryName = category.name
  const subcategoryName = category.subCategories.map((sc) => sc.name).join(', ')

  // const description = category.description ||
  //   `Discover our premium collection of ${categoryName.toLowerCase()} in the ${categoryName.toLowerCase()} category. Shop ${productCount} carefully curated products with fast shipping and excellent customer service.`

  return {
    title: `${categoryName} - ${subcategoryName} `,
    // description,
    keywords: [
      categoryName.toLowerCase(),
      categoryName.toLowerCase(),
      'خرید آنلاین',
      'خرید اینترنتی قهوه',
      'قهوه عمده',
    ].join(', '),

    // Open Graph metadata for social sharing
    openGraph: {
      type: 'website',
      // title: `${categoryName} - Premium ${categoryName}`,
      title: `${categoryName} `,
      // description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/categories/${slug}`,
      siteName: ' ',
      images: [
        {
          url: category.images?.[0]?.url || '/default-og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${categoryName} collection`,
        },
      ],
      locale: 'fa-IR',
    },

    // Twitter Card metadata
    twitter: {
      card: 'summary_large_image',
      // title: `${categoryName} - Premium ${categoryName}`,
      title: `${categoryName} `,
      // description,
      images: [category.images?.[0]?.url || '/default-twitter-image.jpg'],
      // creator: '@yourstorehandle',
      // site: '@yourstorehandle',
    },

    // Additional metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/categories/${slug}`,
    },

    // Additional meta tags
    // other: {
    //   'product-category': categoryName,
    //   'product-category': categoryName,
    //   'product-count': productCount.toString(),
    // },

    // Structured data
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      // bing: process.env.BING_SITE_VERIFICATION,
    },

    // Add structured data as JSON-LD
    // ...(structuredData && {
    //   other: {
    //     ...((return metadata)?.other || {}),
    //     'structured-data': JSON.stringify(structuredData),
    //   }
    // })
  }
}

const CategoryDetailsPage = async ({ params }: CategoryPageProps) => {
  // const page = Number((await searchParams).page) || 1
  // const pageSize = 4

  const slug = (await params).slug

  const category = await getCategoryBySlug({ slug })
  if (!category) notFound()
  // Structured data JSON-LD for client-side rendering
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    // description:
    //   category.description ||
    //   `Shop premium ${category.name.toLowerCase()} products`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/sub-categories/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: category.subCategories?.length || 0,
      itemListElement: category.subCategories
        ?.slice(0, 10)
        .map((subcategory, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Subcategory',
            name: subcategory.name,
            // description: subcategory.description,
            image: subcategory.images?.[0]?.url,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/sub-categories/${subcategory.url}`,
          },
        })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: process.env.NEXT_PUBLIC_SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category.subCategories?.map((sub) => sub.name)[0] || 'زیردسته',
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/sub-categories/${
            category.subCategories?.map((sub) => sub.url)[0]
          }`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/sub-categories/${slug}`,
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="">
        <Bounded
          className={`pt-24 min-h-svh relative w-full h-full flex flex-col text-center  overflow-hidden bg-neutral-950 `}
        >
          <RevealText
            text={category.name}
            id="hero-heading"
            className="relative font-display text-center w-full mx-auto max-w-xl text-6xl leading-none text-neutral-50 md:text-7xl lg:text-8xl"
            staggerAmount={0.2}
            duration={1.7}
          />
          <FadeIn
            vars={{ scale: 1, opacity: 0.5 }}
            className=" absolute inset-0 z-0 origin-top lg:h-screen motion-safe:scale-125 motion-reduce:opacity-50 "
          >
            <Image
              unoptimized
              src={
                category.images.map((s) => s.url)[0] ||
                '/images/fallback-image.webp'
              }
              priority
              fetchPriority="high"
              alt="hero image"
              fill
              className="object-cover origin-top z-0"
            />
          </FadeIn>

          {category?.subCategories && (
            <SubCategoryGrid subCategories={category?.subCategories} />
          )}
        </Bounded>
      </div>
    </>
  )
}

export default CategoryDetailsPage
