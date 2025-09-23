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
import { Slider } from '@/components/ui/slider'

import { Coffee } from 'lucide-react'
import { TagsInput } from '../../../components/tag-input'
import { EnhancedProductFormSchema } from '../../../lib/schemas'

interface CoffeeCharacteristicsProps {
  form: UseFormReturn<z.infer<typeof EnhancedProductFormSchema>>
  disabled?: boolean
}

// Constants
const FLAVOR_NOTES = [
  'شکلاتی',
  'آجیلی',
  'میوه‌ای',
  'گلی',
  'کارامل',
  'وانیل',
  'توت‌فرنگی',
  'مرکباتی',
  'ادویه‌ای',
  'خاکی',
  'چوبی',
  'دودی',
]

const AROMA_NOTES = [
  'گلی',
  'خاکی',
  'مرکباتی',
  'شیرین',
  'آجیلی',
  'ادویه‌ای',
  'میوه‌ای',
  'شکلاتی',
  'کارامل',
  'تازه',
  'غنی',
  'پررنگ',
]

const BREWING_METHODS = [
  'اسپرسو',
  'پورآور',
  'فرنچ پرس',
  'قهوه دم',
  'کولد برو',
  'ایروپرس',
  'موکاپات',
  'ترکی',
  'کِمکس',
  'V60',
]

const CoffeeCharacteristicsForm: FC<CoffeeCharacteristicsProps> = ({
  form,
  disabled = false,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="h-5 w-5" />
          مشخصات قهوه
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Coffee Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="coffeeCharacteristics.caffeineContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>میزان کافئین (میلی گرم)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="95"
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
            name="coffeeCharacteristics.roastLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>سطح برشته‌کاری</FormLabel>
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
                    <SelectItem value="LIGHT">روشن</SelectItem>
                    <SelectItem value="MEDIUM_LIGHT">نیمه روشن</SelectItem>
                    <SelectItem value="MEDIUM">متوسط</SelectItem>
                    <SelectItem value="MEDIUM_DARK">نیمه تیره</SelectItem>
                    <SelectItem value="DARK">تیره</SelectItem>
                    <SelectItem value="EXTRA_DARK">خیلی تیره</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coffeeCharacteristics.origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>منطقه تولید</FormLabel>
                <FormControl>
                  <Input
                    placeholder="کلمبیا، اتیوپی، برزیل"
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
            name="coffeeCharacteristics.processingMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>روش پردازش</FormLabel>
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
                    <SelectItem value="WASHED">شسته</SelectItem>
                    <SelectItem value="NATURAL">طبیعی</SelectItem>
                    <SelectItem value="HONEY">عسلی</SelectItem>
                    <SelectItem value="SEMI_WASHED">نیمه شسته</SelectItem>
                    <SelectItem value="WET_HULLED">مرطوب پوسته‌گیری</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coffeeCharacteristics.altitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ارتفاع (متر)</FormLabel>
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

          <FormField
            control={form.control}
            name="coffeeCharacteristics.harvestYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>سال برداشت</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2024"
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

        {/* Taste Profile */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">پروفایل طعم (1-10)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="coffeeCharacteristics.acidity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسیدیته: {field.value || 5}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={0.5}
                      value={[field.value || 5]}
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={disabled}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coffeeCharacteristics.bitterness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تلخی: {field.value || 5}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={0.5}
                      value={[field.value || 5]}
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={disabled}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coffeeCharacteristics.sweetness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شیرینی: {field.value || 5}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={0.5}
                      value={[field.value || 5]}
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={disabled}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coffeeCharacteristics.body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>بدنه: {field.value || 5}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={0.5}
                      value={[field.value || 5]}
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={disabled}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Flavor and Aroma Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="coffeeCharacteristics.flavorNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نت‌های طعم</FormLabel>
                <FormControl>
                  <TagsInput
                    value={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="شکلات، آجیل، میوه‌ای"
                    suggestions={FLAVOR_NOTES}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coffeeCharacteristics.aromaNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نت‌های عطر</FormLabel>
                <FormControl>
                  <TagsInput
                    value={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="گلی، خاکی، مرکباتی"
                    suggestions={AROMA_NOTES}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Brewing Recommendations */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">توصیه‌های دم‌آوری</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="coffeeCharacteristics.brewingMethods"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>روش‌های دم‌آوری</FormLabel>
                  <FormControl>
                    <TagsInput
                      value={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="اسپرسو، پورآور"
                      suggestions={BREWING_METHODS}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coffeeCharacteristics.waterTemp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>دمای آب (سانتیگراد)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="92"
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
              name="coffeeCharacteristics.brewTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>زمان دم‌آوری (ثانیه)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="240"
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
              name="coffeeCharacteristics.coffeeToWaterRatio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نسبت قهوه به آب</FormLabel>
                  <FormControl>
                    <Input placeholder="1:15" disabled={disabled} {...field} />
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

export default CoffeeCharacteristicsForm
