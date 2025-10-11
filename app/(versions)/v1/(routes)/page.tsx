import React from 'react'
import FruitCarousel, { CarouselItem } from '../components/Spining'
import RotatableCan from '../components/RotatableCan'
import RotatableCanGSAP from '../components/RotatableCanGSAP'
const items: CarouselItem[] = [
  {
    id: 1,
    name: 'Strawberry',
    backgroundColor: '#EA3D41',
    image: '/img/fruit_strawberry.png',
    canImage: '/img/listSoda.jpg',
    mockupImage: '/img/mockup.png', // Custom iPhone frame
  },
  {
    id: 2,
    name: 'Avocado',
    backgroundColor: '#2D5643',
    image: '/img/fruit_avocado.png',
    canImage: '/img/listSoda.jpg',
    mockupImage: '/img/mockup.png', // Custom Android frame
  },
  {
    id: 3,
    name: 'Orange',
    backgroundColor: '#E7A043',
    image: '/img/fruit_orange.png',
    canImage: '/img/listSoda.jpg',
    mockupImage: '/img/mockup.png', // Custom tablet frame
  },
]

const page = () => {
  return (
    <div dir="ltr">
      <FruitCarousel
        items={items}
        leavesImage="/img/leaves.png"
        autoPlayInterval={3000}
        headerTitle="My Brand"
        headerNavItems={['HOME', 'PRODUCTS', 'ABOUT', 'CONTACT']}
        showHeader={true}
      />

      <div className="banner relative h-screen mt-[-50px]">
        <div className="product absolute left-1/2 -translate-x-1/2 bottom-[170px] z-10 w-[500px]">
          <RotatableCan image="/img/leaves.png" mockup="/img/mockup.png" />
        </div>
      </div>

      <RotatableCanGSAP image="/img/listSoda.jpg" mockup="/img/mockup.png" />
      <RotatableCan image="/img/leaves.png" mockup="/img/mockup.png" />
    </div>
  )
}

export default page
