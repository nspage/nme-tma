import React from 'react';
import { Address } from 'ton-core';
import { BadgeShowcase } from '../../components/BadgeShowcase';

const BadgesPage: React.FC = () => {
  // TODO: Get collection address from environment or configuration
  const collectionAddress = Address.parse(process.env.BADGE_COLLECTION_ADDRESS || '');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Event Badges</h1>
        <p className="text-gray-600">
          View your earned badges from TON community events
        </p>
      </div>

      <BadgeShowcase collectionAddress={collectionAddress} />
    </div>
  );
};

export default BadgesPage;
