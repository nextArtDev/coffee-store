import React from 'react'
import FruitCarousel, {
  CarouselItem,
} from '../components/hero-carousel/Spining'
import RotatableCan from '../components/hero-carousel/RotatableCan'
import RotatableCanGSAP from '../components/hero-carousel/RotatableCanGSAP'
import SpinningCan from '../components/hero-carousel/SpinningCan'
import SpinningCanCarousel from '../components/hero-carousel/SpinningCanCarousel'
import RotatingCan from '../components/hero-carousel/CanSpinning'
import HeroCarousel from '../components/hero-carousel/Carousel'
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
const canFrames = [
  '/img/can-frame-1.png',
  '/img/can-frame-2.png',
  '/img/can-frame-3.png',
  // Add more frames for smoother rotation
]
const page = () => {
  return (
    <div dir="ltr" className="w-full h-full min-h-screen">
      <div className="relative h-full w-full">
        <HeroCarousel
          slides={[
            {
              backgroundUrl: '/img/fruit_avocado.png',
              canMockup: '/img/mockup.png',
              canTexture: '/img/listSoda.jpg',
              canWidth: 350,
              canAspectRatio: '1 / 2',
            },
            {
              backgroundUrl: '/img/fruit_strawberry.png',
              canMockup: '/img/cup-mockup1.png',
              canTexture: '/img/listSoda.jpg',
              canWidth: 400,
              canAspectRatio: '22 / 18',
            },
            {
              backgroundUrl: '/img/fruit_orange.png',
              canMockup: '/img/mockup.png',
              canTexture: '/img/listSoda.jpg',
              canWidth: 350,
              canAspectRatio: '1 / 2',
            },
          ]}
        />
      </div>
      {/* <div className="h-[100vh] w-full bg-gradient-to-b from-[#EA3D41] via-[#2D5643] to-[#E7A043]"></div> */}
      <FruitCarousel
        items={items}
        leavesImage="/img/leaves.png"
        autoPlayInterval={3000}
        headerTitle="My Brand"
        headerNavItems={['HOME', 'PRODUCTS', 'ABOUT', 'CONTACT']}
        showHeader={true}
      />
      <RotatingCan
        mockupImage="/img/cup-mockup1.png"
        textureImage="/img/listSoda.jpg"
        width={400}
        aspectRatio="22 / 18"
        className=""
      />
      <SpinningCanCarousel
        items={items}
        mockupImage="/img/mockup.png"
        leavesImage="/img/leaves.png"
        autoPlayInterval={3000}
        headerTitle="MY BRAND"
        headerNavItems={['HOME', 'PRODUCTS', 'CONTACT']}
        animateOnView={true}
        rotationDuration={2}
      />
      <div className="banner relative h-screen mt-[-50px]">
        <div className="product absolute left-1/2 -translate-x-1/2 bottom-[170px] z-10 w-[500px]">
          <SpinningCan
            canImages={canFrames}
            mockupImage="/img/mockup.png"
            width={280}
            height={560}
            rotationDuration={2}
            animateOnView={true}
            autoRotate={true}
          />
          {/* <RotatableCan image="/img/leaves.png" mockup="/img/mockup.png" /> */}
        </div>
      </div>

      <RotatableCanGSAP image="/img/listSoda.jpg" mockup="/img/mockup.png" />
      <RotatableCan image="/img/leaves.png" mockup="/img/mockup.png" />
    </div>
  )
}

export default page
