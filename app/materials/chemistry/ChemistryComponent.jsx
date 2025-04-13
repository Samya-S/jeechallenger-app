"use client";
import Image from 'next/image';
import ChemistryResources from './ChemistryResources';
import CategorySection from '../CategorySection';
import PYQandMoreSection from '../PYQandMoreSection';
import TelegramPost from '@/components/utils/TelegramPost';

const ChemistryComponent = () => {
  return (
    <div>
      <Image
        className="headingimg"
        src="/images/chemistry-banner.png"
        alt="Chemistry Banner"
        width={1920}
        height={1080}
        style={{ width: '100%', boxSizing: 'border-box' }}
      />

      {ChemistryResources.map((resource, index) => (
        <CategorySection
          key={index}
          category={resource.category}
          backgroundColor={(ChemistryResources.length - index) % 2 === 0 ? 'bg-white dark:bg-black' : 'bg-gray-200/30 dark:bg-zinc-900/30'}
          items={resource.items}
        />
      ))}

      <PYQandMoreSection />

      <TelegramPost url="jeechallengerindex/5" />
    </div>
  )
}

export default ChemistryComponent
