"use client";
import Image from 'next/image';
import PhysicsResources from './PhysicsResources';
import CategorySection from '../CategorySection';
import PYQandMoreSection from '../PYQandMoreSection';
import TelegramPost from '@/components/utils/TelegramPost';

const PhysicsComponent = () => {
  return (
    <div>
      <Image
        className="headingimg"
        src="/images/physics-banner.png"
        alt="Physics Banner"
        width={1920}
        height={1080}
        style={{ width: '100%', boxSizing: 'border-box' }}
      />

      {PhysicsResources.map((resource, index) => (
        <CategorySection
          key={index}
          category={resource.category}
          backgroundColor={(PhysicsResources.length - index) % 2 === 0 ? 'bg-white dark:bg-black' : 'bg-gray-200/30 dark:bg-zinc-900/30'}
          items={resource.items}
        />
      ))}

      <PYQandMoreSection />

      <TelegramPost url="jeechallengerindex/4" />
    </div>
  );
};

export default PhysicsComponent;
