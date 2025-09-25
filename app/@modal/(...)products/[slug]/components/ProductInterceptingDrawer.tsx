// components/ProductInterceptDrawer.tsx
'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
export function ProductInterceptDrawer({
  className,
  name,

  slug,
  children,
}: {
  name: string
  className: string
  slug: string
  children: ReactNode
}) {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const handleOpenChange = (isOpen: boolean) => {
    console.log('Drawer state changing to:', isOpen)
    if (!isOpen) {
      setOpen(false)
      // Navigate back to the previous page
      router.back()
    }
  }

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Only close on overlay click, not content click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} shouldScaleBackground>
      <DrawerContent className={cn('', className)} onClick={handleOverlayClick}>
        <div onClick={handleContentClick} className="w-full h-full">
          <ScrollArea className="h-[80vh] sm:h-[60vh]">
            <div className="mx-auto w-full max-w-[90vw]" dir="rtl">
              <DrawerHeader>
                <DrawerTitle>{name}</DrawerTitle>
                <DrawerDescription className="sr-only"></DrawerDescription>
              </DrawerHeader>

              {children}

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button
                    asChild
                    className="w-full max-w-sm mx-auto bg-indigo-600 text-white"
                    onClick={() => (window.location.href = `/products/${slug}`)}
                  >
                    صفحه محصول
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
