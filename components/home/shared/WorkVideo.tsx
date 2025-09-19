import React from 'react'
import FixedVideoPlay from './FixedVideoPlay'
import { RevealText } from '@/components/shared/reveal-text'
import { FadeIn } from '@/components/shared/fade-in'

const WorkVideo = () => {
  return (
    <section className="w-full py-12 flex flex-col items-center justify-center mx-auto gap-12  text-center">
      <div className="  w-[90vw] m-w-xl flex flex-col items-center mx-auto gap-4">
        <RevealText
          text="طعم و مزه متفاوت: طبیعت در ذهن شما"
          id="work-video"
          className="text-xl pt-12 md:text-3xl font-bold uppercase  text-center"
          staggerAmount={0.2}
          duration={0.8}
        />

        <FadeIn
          className=" translate-y-8 "
          vars={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="max-w-md mx-auto text-pretty text-center">
            {/* ما در ساخت مصنوعات قهوهی، که نیازمند ظرافتی مثال‌زدنی است، متخصص
            هستیم و توجهی ویژه به انتخاب مواد اولیه خود داریم. تمامی مجموعه‌های
            ما تنها از قهوه تمام‌دانه — که اصیل‌ترین و مرغوب‌ترین نوع قهوه طبیعی
            است — ساخته می‌شوند. */}
            قهوه‌های ما از دل طبیعت و با بالاترین کیفیت تجربه‌ای متفاوت را برای
            شما رقم خواهد زد.
          </p>
        </FadeIn>
      </div>
      <FixedVideoPlay className="w-full" videoUrl="/videos/vid1.webm">
        {' '}
      </FixedVideoPlay>
    </section>
  )
}

export default WorkVideo
