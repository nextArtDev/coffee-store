'use client'

import { FC } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Wrench } from 'lucide-react'
import { EnhancedProductFormSchema } from './product-details'

interface EquipmentSpecsProps {
  form: UseFormReturn<z.infer<typeof EnhancedProductFormSchema>>
  disabled?: boolean
}

const EquipmentSpecsForm: FC<EquipmentSpecsProps> = ({
  form,
  disabled = false,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          مشخصات تجهیزات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Specifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">مشخصات پایه</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="equipmentSpecs.material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>جنس</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="استیل ضدزنگ، پلاستیک، آلومینیوم"
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
              name="equipmentSpecs.capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ظرفیت (میلی لیتر)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1000"
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
              name="equipmentSpecs.weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وزن (کیلوگرم)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2.5"
                      step="0.1"
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
              name="equipmentSpecs.dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ابعاد (سانتی متر)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="30 × 20 × 25"
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
              name="equipmentSpecs.powerConsumption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>مصرف برق (وات)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1200"
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
          </div>
        </div>

        {/* Performance Specifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">مشخصات عملکرد</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="equipmentSpecs.pressureLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>فشار (بار)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="15"
                      step="0.1"
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
              name="equipmentSpecs.heatingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>زمان گرم شدن (ثانیه)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="90"
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
              name="equipmentSpecs.temperatureRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>محدوده دما (درجه)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="85-96°C"
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

        {/* Grinder-Specific Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">ویژگی‌های آسیاب</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="equipmentSpecs.burrType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع آسیاب</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CERAMIC">سرامیکی</SelectItem>
                      <SelectItem value="STEEL">فولادی</SelectItem>
                      <SelectItem value="TITANIUM">تیتانیومی</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equipmentSpecs.grindSettings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تعداد تنظیمات آسیاب</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="40"
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
              name="equipmentSpecs.grindCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ظرفیت آسیاب (گرم)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="250"
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
          </div>
        </div>

        {/* Filter & Compatibility */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">فیلتر و سازگاری</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="equipmentSpecs.filterType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع فیلتر</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PAPER">کاغذی</SelectItem>
                      <SelectItem value="METAL">فلزی</SelectItem>
                      <SelectItem value="CLOTH">پارچه‌ای</SelectItem>
                      <SelectItem value="PERMANENT">دائمی</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equipmentSpecs.compatibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>سازگاری</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="سازگار با کپسول Nespresso"
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
      </CardContent>
    </Card>
  )
}

export default EquipmentSpecsForm
