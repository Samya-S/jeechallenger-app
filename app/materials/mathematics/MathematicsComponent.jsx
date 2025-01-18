"use client";
import Image from 'next/image';
import MathematicsResources from './MathematicsResources';
import CategorySection from '../CategorySection';
import PYQandMoreSection from '../PYQandMoreSection';
import TelegramPost from '@/components/utils/TelegramPost';

const MathematicsComponent = () => {
  return (
    <div>
      <Image
        className="headingimg"
        src="/images/maths-banner.png"
        alt="Mathematics Banner"
        width={1920}
        height={1080}
        style={{ width: '100%', boxSizing: 'border-box' }}
      />

      {MathematicsResources.map((resource, index) => (
        <CategorySection
          key={index}
          category={resource.category}
          backgroundColor={(MathematicsResources.length - index) % 2 === 0 ? 'white' : 'rgba(212, 212, 212, 0.26)'}
          items={resource.items}
        />
      ))}

      <PYQandMoreSection />

      <TelegramPost url="jeechallengerindex/6" />
    </div>
  )
}

export default MathematicsComponent
