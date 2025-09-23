'use client'

import { FC } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Package } from 'lucide-react'
import { EnhancedProductFormSchema } from '../../../lib/schemas'

interface AccessorySpecsProps {
  form: UseFormReturn<z.infer<typeof EnhancedProductFormSchema>>
  disabled?: boolean
}

const AccessorySpecsForm: FC<AccessorySpecsProps> = ({
  form,
  disabled = false,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          مشخصات لوازم جانبی
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Specifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">مشخصات پایه</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="accessorySpecs.material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>جنس</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="سرامیک، شیشه، استیل"
                      disabled={disabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accessorySpecs.capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ظرفیت (میلی لیتر)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="350"
                      disabled={disabled}
                      {...field}
                      value={field.value || ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="accessorySpecs.weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وزن (گرم)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="200"
                      disabled={disabled}
                      {...field}
                      value={field.value || ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accessorySpecs.dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ابعاد (سانتی متر)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="10 × 8 × 12"
                      disabled={disabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
        </div>

        {/* Design Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">ویژگی‌های طراحی</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="accessorySpecs.handleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع دستگیره</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ارگونومیک، کلاسیک، بدون دستگیره"
                      disabled={disabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accessorySpecs.lidType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع درب</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="درپوش، درب پیچی، درب کشویی"
                      disabled={disabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Safety & Convenience Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">ویژگی‌های ایمنی و راحتی</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="accessorySpecs.heatRetention"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>نگهداری حرارت</FormLabel>
                    <FormDescription>
                      آیا گرما را برای مدت طولانی حفظ می‌کند؟
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accessorySpecs.microwaveSafe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>قابل استفاده در مایکروویو</FormLabel>
                    <FormDescription>
                      آیا می‌توان در مایکروویو استفاده کرد؟
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accessorySpecs.dishwasherSafe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>قابل شستشو در ماشین ظرفشویی</FormLabel>
                    <FormDescription>
                      آیا می‌توان در ماشین ظرفشویی شست؟
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AccessorySpecsForm
