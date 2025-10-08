'use client'
import { motion } from 'framer-motion'
import FAQItem from './FAQItem'
import { Spotlight } from '../../about-us/components/spotlight'

type Props = { faqs: { question: string; answer: string; id: string }[] }

function FAQ({ faqs }: Props) {
  return (
    <div className="relative w-full  ">
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(336, 100%, 50%, 0.08) 0, hsla(341, 100%, 55%, 0.04) 50%, hsla(336, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(333, 100%, 85%, 0.08) 0, hsla(335, 100%, 55%, 0.04) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(332, 100%, 85%, 0.06) 0, hsla(327, 100%, 85%, 0.06) 80%, transparent 100%)"
      />
      <div className="bg-primary/5 absolute top-20 -left-20 h-64 w-64 rounded-full blur-3xl" />
      <div className="bg-primary/5 absolute -right-20 bottom-20 h-64 w-64 rounded-full blur-3xl" />
      <div className="relative container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          {/* <Badge
            variant="outline"
            className="border-primary mb-4 px-3 py-1 text-xs font-medium tracking-wider uppercase"
          >
            FAQs
          </Badge> */}

          <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
            سوالات متداول (پرسش و پاسخ)
          </h2>
          <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
            عزیزان و همراهان گرامی، در این صفحه به پرتکرارترین سوالاتی که ممکن
            است درباره محصولات قهوه دست‌ساز، فرآیند خرید و نگهداری از آنها داشته
            باشید، پاسخ داده‌ایم. اگر پاسخ پرسش خود را نیافتید، از طریق راه‌های
            ارتباطی با ما در تماس باشید. خوشحال می‌شویم به شما کمک کنیم.
          </p>
        </motion.div>
        <div className="mx-auto max-w-2xl space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={cn('mx-auto mt-12 max-w-md rounded-lg p-6 text-center')}
        >
          <div className="bg-primary/10 text-primary mb-4 inline-flex items-center justify-center rounded-full p-2">
            <Mail className="h-4 w-4" />
          </div>
        </motion.div> */}
      </div>
    </div>
  )
}

export default FAQ
