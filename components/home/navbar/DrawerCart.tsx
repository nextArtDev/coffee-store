'use client'

import { useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useCartStore } from '@/hooks/useCartStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import ShoppingList from '@/app/(home)/cart/components/ShoppingList'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

type Props = {
  isOpen?: boolean
  onClose?: () => void
}

export default function DrawerCart({ isOpen, onClose }: Props) {
  const cartItems = useCartStore((state) => state.cart)
  const totalPrice = useCartStore((state) => state.totalPrice)
  const { validateAndUpdatePrices } = useCartStore()

  useEffect(() => {
    validateAndUpdatePrices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cartItemCount = cartItems?.length ?? 0

  return (
    <Drawer open={isOpen} onClose={onClose} shouldScaleBackground>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Shopping cart with ${cartItemCount} items`}
          className="relative"
        >
          <ShoppingBag className="h-4 w-4" />
          {cartItemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-0 -right-0 h-4 w-4 flex items-center justify-center p-0 text-xs bg-indigo-500 text-white"
            >
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <ScrollArea className="h-[80vh] sm:h-[60vh]">
          <div className="mx-auto w-full max-w-[90vw]" dir="rtl">
            <DrawerHeader>
              <DrawerTitle>لیست خرید</DrawerTitle>
              <DrawerDescription className="sr-only">
                Items in your shopping cart
              </DrawerDescription>
            </DrawerHeader>

            {cartItemCount > 0 ? (
              <div className="flex flex-col gap-2 pb-12">
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <ShoppingList mutable cartItems={cartItems} />

                  <div className="py-6 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base text-muted-foreground">
                        قیمت مجموع:
                      </span>
                      <Badge
                        variant="default"
                        className="text-sm sm:text-base px-2 py-1 bg-indigo-600 text-white"
                      >
                        {totalPrice} تومان
                      </Badge>
                    </div>
                  </div>
                </div>

                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button
                      asChild
                      className="w-full max-w-sm mx-auto bg-indigo-600 text-white"
                    >
                      <Link href="/cart">سبد خرید</Link>
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full max-w-sm mx-auto"
                    >
                      <Link href="/">ادامه &larr;</Link>
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col gap-8 items-center justify-center py-8">
                <p className="text-center text-muted-foreground">
                  سبد شما خالی است!
                </p>
                <DrawerClose asChild>
                  <Button asChild>
                    <Link href="/">ادامه خرید</Link>
                  </Button>
                </DrawerClose>
              </div>
            )}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
