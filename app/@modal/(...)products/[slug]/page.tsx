import ProductPage from '@/app/(home)/products/components/ProductPage'
import { currentUser } from '@/lib/auth'
import {
  getProductDetails,
  getRelatedProducts,
} from '@/lib/home/queries/products'
import { notFound } from 'next/navigation'
import ModalWrapper from '../../components/ModalWrapper'

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
  const relatedProducts = await getRelatedProducts(
    product.id,
    product.subCategoryId
  )

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

  const user = await currentUser()

  return (
    <div>
      <ModalWrapper>
        <ProductPage
          data={product}
          selectedSizeId={
            selectedVariant.size?.id ? selectedVariant.size?.id : ''
          }
          selectedColorId={
            selectedVariant.color ? selectedVariant.color?.id : ''
          }
          productAverageRating={null}
          reviews={product.reviews}
          userId={!!user?.id ? user.id : null}
          userReview={null}
          relatedProducts={relatedProducts}
        />
      </ModalWrapper>
    </div>
  )
}

export default ProductDetailsPage
