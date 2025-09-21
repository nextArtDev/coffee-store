import { Coffee, Laptop, Phone, Watch } from 'lucide-react'
import DonutChart from './donate-chart'

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
    <div className="w-full h-full grid size-42 grid-cols-2 grid-rows-2 justify-evenly   p-4 text-background">
      {items.map((item, index) => {
        return (
          <DonutChart
            progress={item.level}
            circleWidth={8}
            progressWidth={8}
            size={68}
            gradientColors={['#2c1b06', '#f79401', '#ddb58f']}
            className="relative flex items-center justify-center"
            key={`item_${index}`}
            trackClassName="text-green-500/50 text-green-100/30"
          >
            {/* <item.icon className="absolute" size={24} /> */}
            <span className="absolute flex flex-col gap-0.25 font-semibold">
              <p>{item.label}</p>
              {item.level}%
            </span>
          </DonutChart>
        )
      })}
    </div>
  )
}
