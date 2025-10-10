import React from 'react'
import FruitCarousel, { CarouselItem } from '../components/Spining'
const items: CarouselItem[] = [
  {
    id: 1,
    name: 'Strawberry',
    backgroundColor: '#EA3D41',
    image: '/img/fruit_strawberry.png',
    canImage: '/img/can_strawberry.png', // Individual can image
  },
  {
    id: 2,
    name: 'Avocado',
    backgroundColor: '#2D5643',
    image: '/img/fruit_avocado.png',
    canImage: '/img/listSoda.jpg', // Individual can image
  },
  {
    id: 3,
    name: 'Orange',
    backgroundColor: '#E7A043',
    image: '/img/fruit_orange.png',
    canImage: '/img/listSoda.jpg', // Individual can image
  },
]

const page = () => {
  return (
    <div>
      <FruitCarousel
        items={items}
        mockupImage="/img/mockup.png"
        leavesImage="/img/leaves.png"
        autoPlayInterval={3000}
        headerTitle="My Brand"
        headerNavItems={['HOME', 'PRODUCTS', 'ABOUT', 'CONTACT']}
        showHeader={true}
      />
    </div>
  )
}

export default page
