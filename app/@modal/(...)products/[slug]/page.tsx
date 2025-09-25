import { getProductDetails } from '@/lib/home/queries/products'
import { notFound } from 'next/navigation'
import ModalWrapper from '../../components/ModalWrapper'

import { ProductInterceptDrawer } from './components/ProductInterceptingDrawer'
import ProductInterceptingPage from './components/ProductInterceptingPage'
import prisma from '@/lib/prisma'
const ProductDetailsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    size?: string
    color?: string
    page?: string
  }>
}) => {
  const slug = (await params).slug
  const searchParamsSize = (await searchParams).size
  const searchParamsColor = (await searchParams).color

  const product = await getProductDetails(slug)
  if (!product || product.variants.length === 0) {
    notFound()
  }

  const defaultVariant = product.variants[0]
  let selectedVariant = product.variants.find(
    (v) => v.size?.id === searchParamsSize && v.color?.id === searchParamsColor
  )
  if (!selectedVariant && searchParamsSize) {
    selectedVariant = product.variants.find(
      (v) => v.size?.id === searchParamsSize
    )
  }
  if (!selectedVariant) {
    selectedVariant = defaultVariant
  }

  const productAverageRating = await prisma.review.aggregate({
    _avg: { rating: true },
    _count: true,
    where: { productId: product.id, isPending: false },
  })

  return (
    <div className="z-[999]">
      <article className="z-[999] ">
        <ModalWrapper>
          <ProductInterceptingPage
            data={product}
            selectedSizeId={
              selectedVariant.size?.id ? selectedVariant.size?.id : ''
            }
            selectedColorId={
              selectedVariant.color ? selectedVariant.color?.id : ''
            }
            productAverageRating={
              !!productAverageRating._avg.rating &&
              !!productAverageRating._count
                ? {
                    rating: productAverageRating._avg.rating,
                    count: productAverageRating._count,
                  }
                : null
            }
          />
        </ModalWrapper>
      </article>
      <article className=" hidden">
        <ProductInterceptDrawer slug={slug} name={product.name} className=" ">
          <ProductInterceptingPage
            data={product}
            selectedSizeId={
              selectedVariant.size?.id ? selectedVariant.size?.id : ''
            }
            selectedColorId={
              selectedVariant.color ? selectedVariant.color?.id : ''
            }
            productAverageRating={
              !!productAverageRating._avg.rating &&
              !!productAverageRating._count
                ? {
                    rating: productAverageRating._avg.rating,
                    count: productAverageRating._count,
                  }
                : null
            }
          />
        </ProductInterceptDrawer>
      </article>
    </div>
  )
}

export default ProductDetailsPage
