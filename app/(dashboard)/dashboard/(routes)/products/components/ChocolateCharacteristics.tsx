'use client'

import { FC } from 'react'
import { UseFormReturn } from 'react-hook-form'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Package } from 'lucide-react'
import { TagsInput } from '../../../components/tag-input'
import { EnhancedProductFormSchema } from '../../../lib/schemas'
import z from 'zod'

// Constants
const CHOCOLATE_FLAVOR_NOTES = [
  'شکلاتی',
  'وانیلی',
  'کارامل',
  'میوه‌ای',
  'آجیلی',
  'ادویه‌ای',
  'گلی',
  'خاکی',
  'دودی',
  'عسلی',
  'توت‌فرنگی',
  'پرتقالی',
]

const CHOCOLATE_PAIRINGS = [
  'شراب قرمز',
  'قهوه',
  'چای',
  'آجیل',
  'میوه‌های خشک',
  'پنیر',
  'نان',
  'آیس‌کریم',
  'میوه‌های تازه',
]

interface ChocolateCharacteristicsProps {
  form: UseFormReturn<z.infer<typeof EnhancedProductFormSchema>>
  disabled?: boolean
}

const ChocolateCharacteristicsForm: FC<ChocolateCharacteristicsProps> = ({
  form,
  disabled = false,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          مشخصات شکلات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Chocolate Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="chocolateCharacteristics.cocoaPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>درصد کاکائو (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="70"
                    min="0"
                    max="100"
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
            name="chocolateCharacteristics.chocolateType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نوع شکلات</FormLabel>
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
                    <SelectItem value="DARK">تلخ</SelectItem>
                    <SelectItem value="MILK">شیری</SelectItem>
                    <SelectItem value="WHITE">سفید</SelectItem>
                    <SelectItem value="RUBY">روبی</SelectItem>
                    <SelectItem value="RAW">خام</SelectItem>
                    <SelectItem value="UNSWEETENED">بدون شکر</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chocolateCharacteristics.origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>منطقه تولید</FormLabel>
                <FormControl>
                  <Input
                    placeholder="اکوادور، غنا، ماداگاسکار"
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Taste Profile Sliders */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">پروفایل طعم (1-10)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['sweetness', 'bitterness', 'acidity', 'fruitiness'].map(
              (field) => (
                <FormField
                  key={field}
                  control={form.control}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  name={`chocolateCharacteristics.${field}` as any}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>
                        {field === 'sweetness' && 'شیرینی'}
                        {field === 'bitterness' && 'تلخی'}
                        {field === 'acidity' && 'اسیدیته'}
                        {field === 'fruitiness' && 'طعم میوه‌ای'}:{' '}
                        {formField.value || 5}
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={10}
                          step={0.5}
                          value={[formField.value || 5]}
                          onValueChange={(value) =>
                            formField.onChange(value[0])
                          }
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}
          </div>
        </div>

        {/* Flavor Notes and Pairings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="chocolateCharacteristics.flavorNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نت‌های طعم</FormLabel>
                <FormControl>
                  <TagsInput
                    value={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="وانیلی، کارامل، میوه‌ای"
                    suggestions={CHOCOLATE_FLAVOR_NOTES}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chocolateCharacteristics.pairings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>پیشنهاد همراهی</FormLabel>
                <FormControl>
                  <TagsInput
                    value={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="شراب قرمز، قهوه، آجیل"
                    suggestions={CHOCOLATE_PAIRINGS}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Certifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">گواهینامه‌ها و ویژگی‌ها</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'organic', label: 'ارگانیک' },
              { name: 'fairTrade', label: 'تجارت عادلانه' },
              { name: 'singleOrigin', label: 'تک منطقه' },
              { name: 'vegan', label: 'وگان' },
              { name: 'glutenFree', label: 'بدون گلوتن' },
              { name: 'rawChocolate', label: 'شکلات خام' },
            ].map((cert) => (
              <FormField
                key={cert.name}
                control={form.control}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                name={`chocolateCharacteristics.${cert.name}` as any}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormLabel>{cert.label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChocolateCharacteristicsForm
