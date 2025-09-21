import { Coffee, Laptop, Phone, Watch } from 'lucide-react'
import DonutChart from './donate-chart'

// https://animata.design/docs/widget/battery-level
const items = [
  {
    level: 100,
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
    <div className="grid size-52 grid-cols-2 grid-rows-2 justify-evenly   p-4 text-background">
      {items.map((item, index) => {
        return (
          <DonutChart
            progress={item.level}
            circleWidth={10}
            progressWidth={10}
            size={76}
            progressClassName={
              'text-gradient text-[#ff7433] via-[#b14100] stroke-[#3b160490]'
            }
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
