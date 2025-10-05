// components/ProductInterceptWrapper.tsx
'use client'

import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
export function ProductInterceptWrapper({
  className,
  name,
  children,
}: {
  name: string
  className: string
  children: ReactNode
}) {
  const router = useRouter()
  const isMobile = useIsMobile()

  return isMobile ? (
    <Drawer
      defaultOpen
      onOpenChange={(open) => !open && router.back()}
      shouldScaleBackground
    >
      <DrawerContent className={cn('', className)}>
        <div className="w-full h-full">
          <ScrollArea className="h-[80vh] sm:h-[60vh]">
            <div className="mx-auto w-full max-w-[90vw]" dir="rtl">
              <DrawerHeader>
                <DrawerTitle className="sr-only">{name}</DrawerTitle>
                <DrawerDescription className="sr-only"></DrawerDescription>
              </DrawerHeader>

              {children}

              {/* <DrawerFooter className="">
                <DrawerClose asChild>
                  <Button
                    asChild
                    className="w-full max-w-sm mx-auto bg-indigo-600 text-white"
                    onClick={() => (window.location.href = `/products/${slug}`)}
                  >
                    صفحه محصول
                  </Button>
                </DrawerClose>
              </DrawerFooter> */}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog
      defaultOpen
      onOpenChange={(open) => !open && router.back()}
      modal={true}
    >
      <DialogContent
        forceMount
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-md border-background/10 bg-background/5 backdrop-blur-sm "
      >
        <DialogTitle className="sr-only">{name}</DialogTitle>
        <ScrollArea dir="rtl" className="h-[80vh] ">
          {children}
        </ScrollArea>
      </DialogContent>
      {/* <DialogFooter>
        <DialogClose asChild>
          <Button
            asChild
            className="w-full max-w-sm mx-auto bg-indigo-600 text-white"
            onClick={() => (window.location.href = `/products/${slug}`)}
          >
            صفحه محصول
          </Button>
        </DialogClose>
      </DialogFooter> */}
    </Dialog>
  )
}
