import { redirect } from 'next/navigation'
import ShippingDetails from './components/ShippingDetails'
// import ShippingHeader from './components/ShippingHeader'
import ShippingOrders from './components/ShippinOrders'
import { getMyCart, getUserById } from '@/lib/home/queries/user'
import CheckoutSteps from './components/checkout-steps'
import prisma from '@/lib/prisma'
import { getCurrentUserWithFetch } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

const page = async () => {
  const cUser = await getCurrentUserWithFetch()
  const provinces = await prisma.province.findMany()
  const userId = cUser?.id

  if (!userId || !cUser.phoneNumber) redirect('/sign-in')

  const cart = await getMyCart()
  if (!cart || cart.cartItems.length === 0) redirect('/cart')

  const user = await getUserById(userId)
  const shippingAddress = await prisma.shippingAddress.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      city: true,
      country: true,
      user: true,
    },
  })
  return (
    <section>
      <div className="py-4">
        <CheckoutSteps current={1} />
      </div>

      {/* <ShippingHeader /> */}
      <article className="relative  mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8">
        <h1 className="sr-only">Checkout</h1>
        <ShippingOrders cartItems={cart.cartItems} />
        <ShippingDetails
          provinces={provinces}
          initialData={shippingAddress}
          phone={cUser.phoneNumber}
        />
      </article>
    </section>
  )
}

export default page
