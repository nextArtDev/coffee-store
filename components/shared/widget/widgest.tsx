import { Coffee, Laptop, Phone, Watch } from 'lucide-react'
import DonutChart from './donate-chart'
import GlassSurface from '../glass-surface/GlassSurface'

// https://animata.design/docs/widget/battery-level
const items = [
  {
    level: 90,
    icon: Coffee,
    label: 'کافئین',
  },
  {
    level: 40,
    icon: Phone,
    label: 'تلخی',
  },
  {
    level: 80,
    icon: Laptop,
    label: 'ترشی',
  },
  {
    level: 20,
    icon: Watch,
    label: 'چربی',
  },
]

export default function BatteryLevel() {
  return (
    <div className="w-full h-full grid size-42 grid-cols-2 grid-rows-2 justify-between   p-0 text-background">
      {items.map((item, index) => {
        return (
          <DonutChart
            progress={item.level}
            key={`item_${index}`}
            circleWidth={8}
            progressWidth={8}
            size={90}
            gradientColors={['#2c1b06', '#804e05', '#ddb58f']}
            className="p-0 relative flex items-center justify-center text-[#2c1b06]"
            trackClassName="text-green-500/50 text-green-100/30"
          >
            <GlassSurface
              width={70}
              height={70}
              borderRadius={999}
              borderWidth={0.07}
              brightness={50}
              opacity={0.93}
              blur={15}
              displace={0}
              backgroundOpacity={0.2}
              saturation={2}
              distortionScale={-180}
              className="p-1 rounded-full aspect-square"
            >
              {/* <item.icon className="absolute" size={24} /> */}
              <span className="absolute flex flex-col gap-0.25 font-semibold">
                <p>{item.label}</p>
                {item.level}%
              </span>
            </GlassSurface>
          </DonutChart>
        )
      })}
    </div>
  )
}
