import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import OrderDetailsTable from './components/order-details-table1'
import { getOrderById } from '@/lib/home/queries/order'
import { Order, OrderItem, ShippingAddress } from '@/lib/generated/prisma'
import { Suspense } from 'react'
import { OrderDetailsSkeleton } from './components/Skeletons'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const metadata: Metadata = {
  title: 'جزئیات سفارش',
}

function OrderDetailsTableWrapper({
  order,
  isAdmin,
}: {
  order: Order & { items: OrderItem[] } & {
    shippingAddress: ShippingAddress & { province: { name: string } } & {
      city: { name: string }
    }
  } & { paymentDetails: { transactionId: string | null } | null } & {
    user: { name: string; phoneNumber: string | null }
  }

  isAdmin: boolean
}) {
  return (
    <OrderDetailsTable
      order={{
        ...order,

        shippingAddress: {
          ...order.shippingAddress,
          province: order.shippingAddress.province,
          city: order.shippingAddress.city,
        },
        user: {
          name: order.user.name,
          phoneNumber: order.user.phoneNumber ?? '',
        },
      }}
      isAdmin={isAdmin}
    />
  )
}

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>
}) => {
  const productId = (await params).orderId
  const [order, currentUser] = await Promise.all([
    getOrderById(productId),
    getCurrentUser(),
  ])

  if (!order) notFound()
  const isAdmin = currentUser?.role === 'admin' || false

  return (
    <section className="pt-20">
      <Suspense fallback={<OrderDetailsSkeleton />}>
        <OrderDetailsTableWrapper order={order} isAdmin={isAdmin} />
      </Suspense>
    </section>
  )
}

export default OrderDetailsPage
