import ProductDetailCarousel from '@/components/product/product-detail-carousel'
import AddToCardBtn from '@/components/product/product-detail/AddToCardBtn'

import { SingleStarRating } from '@/components/home/testemonial/SingleStartRating'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ProductDetails } from '@/lib/types/home'
import { FC, useMemo } from 'react'

import Countdown from '@/app/(home)/products/components/count-down'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type ProductInterceptingPageProp = {
  data: NonNullable<ProductDetails>
  productAverageRating: { rating: number; count: number } | null

  selectedSizeId: string
  selectedColorId: string
}
const ProductInterceptingPage: FC<ProductInterceptingPageProp> = ({
  data,
  productAverageRating,

  selectedColorId,
  selectedSizeId,
}) => {
  const {
    images,

    variants,

    brand,
    id,
    name,
    slug,
    // weight,
    shippingFeeMethod,
    isSale,
    saleEndDate,
  } = data

  const currentVariant = variants.find(
    (v) => v.size?.id === selectedSizeId && v.color?.id === selectedColorId
  )
  const uniqueSizes = useMemo(() => {
    const seen = new Set()
    return variants
      .map((v) => v.size)
      .filter((size) => {
        if (!size || seen.has(size.id)) return false
        seen.add(size.id)
        return true
      })
  }, [variants])

  const uniqueColors = useMemo(() => {
    const seen = new Set()
    return variants
      .map((v) => v.color)
      .filter((color) => {
        if (!color || seen.has(color.id)) return false
        seen.add(color.id)
        return true
      })
  }, [variants])

  return (
    <section className="pb-24 w-full h-full  ">
      <div className="max-w-2xl px-4 mx-auto  flex flex-col gap-4">
        <article className=" ">
          <ProductDetailCarousel
            images={[...variants?.flatMap((vr) => vr?.images ?? []), ...images]}
          />
        </article>

        {/* <ProductDetails /> */}
        <article className="grid grid-row-5 gap-4">
          <div className="flex gap-2">
            {productAverageRating && (
              <>
                <SingleStarRating rating={productAverageRating.rating} />
                {productAverageRating.rating}
                <p>{' از'}</p>
                {productAverageRating.count}
                <p>{' نفر'}</p>
              </>
            )}
          </div>
          <p className="text-sm font-semibold">{brand}</p>
          <p className="text-base font-bold">
            {/* medium handbag with double flap in grained leather */}
            {name}
          </p>

          <Separator />
          <article className="flex items-center justify-evenly">
            {/* === COLOR SELECTION === */}
            <div className=" flex-1 flex flex-col gap-2 items-start">
              <p className="text-base font-semibold">
                سایز: {currentVariant?.size.name}
              </p>
              <ul className="flex flex-wrap gap-1">
                {uniqueSizes.map((size) => {
                  if (!size) return null
                  const isAvailable = variants.some(
                    (v) => v.size?.id === size.id && v.quantity > 0
                  )
                  return (
                    <li key={size.id}>
                      <Link
                        href={{
                          pathname: `/products/${slug}`,
                          query: { size: size.id, color: selectedColorId },
                        }}
                        replace
                        scroll={false}
                        className={cn(
                          buttonVariants({
                            variant:
                              selectedSizeId === size.id ? 'indigo' : 'link',
                          }),
                          !isAvailable &&
                            'opacity-50 cursor-not-allowed pointer-events-none'
                        )}
                      >
                        {size.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            <Separator orientation="vertical" />
            <div className="pr-2 flex-1 flex flex-col gap-2 items-start">
              <p className="text-base font-semibold">
                رنگ:{currentVariant?.color.name}
              </p>
              <div className="flex gap-1">
                {uniqueColors.map((color) => {
                  if (!color) return null
                  const isAvailable = variants.some(
                    (v) => v.color?.id === color.id && v.quantity > 0
                  )
                  return (
                    <Link
                      key={color.id}
                      href={{
                        pathname: `/products/${slug}`,
                        query: { size: selectedSizeId, color: color.id },
                      }}
                      replace
                      scroll={false}
                      className={cn(
                        'rounded-none p-1 m-2 transition-all',
                        selectedColorId === color.id
                          ? 'ring-2 ring-offset-2 ring-indigo-500'
                          : 'ring-1 ring-gray-300 ',
                        !isAvailable &&
                          'opacity-50 cursor-not-allowed pointer-events-none'
                      )}
                    >
                      <div
                        className="size-8 rounded-none"
                        style={{ backgroundColor: color.hex }}
                      />
                    </Link>
                  )
                })}
              </div>
            </div>
          </article>
        </article>
        <Separator />
        <article>
          {isSale && saleEndDate && (
            <div className="mt-4 pb-2">
              <Countdown targetDate={saleEndDate} />
            </div>
          )}
        </article>
        <span className="text-green-600 flex gap-1 text-sm items-center">
          <span
            className={cn(
              'w-2 h-2 animate-pulse rounded-full',
              currentVariant && currentVariant.quantity > 0
                ? 'bg-green-600'
                : 'bg-red-600'
            )}
          ></span>
          {currentVariant && currentVariant.quantity > 0
            ? 'موجود'
            : 'اتمام موجودی'}
          {currentVariant && currentVariant.quantity > 0 && (
            <span className="text-xs text-gray-500">
              ({currentVariant.quantity} عدد باقی مانده)
            </span>
          )}
        </span>
        <article className="sticky top-2">
          {currentVariant && currentVariant.size && currentVariant.color ? (
            <AddToCardBtn
              variant={{
                id: currentVariant?.id,
                size: currentVariant.size.name,
                color: currentVariant.color.name,
                price: currentVariant.price,
                discount: currentVariant.discount,
                quantity: currentVariant.quantity,
                weight: currentVariant?.weight,
              }}
              product={{
                id: id,
                slug: slug,
                name: name,
                image: (data.images[0] || data.variants[0]?.images)?.url,
                shippingFeeMethod: shippingFeeMethod,
              }}
            />
          ) : (
            <div className="bg-orange-100 border border-orange-200 rounded-md p-4 text-center">
              <p className="text-orange-700 font-medium">
                این ترکیب رنگ و سایز موجود نیست!
              </p>
              <p className="text-sm text-orange-600 mt-1">
                لطفا ترکیب دیگری از سایز و رنگ را انتخاب کنید.
              </p>
            </div>
          )}
        </article>

        <Link
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'max-w-sm mx-auto '
          )}
          href={'/cart'}
        >
          سبد خرید
        </Link>
      </div>
    </section>
  )
}

export default ProductInterceptingPage
