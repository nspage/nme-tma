import React, { useEffect, useState } from 'react';
import { Address } from 'ton-core';
import { useTonConnect } from '@tonconnect/ui-react';
import { BadgeCollectionContract } from '../contracts/badge-collection';
import { BadgeStorage } from '../services/BadgeStorage';

interface Badge {
  id: number;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: {
      event_date: string;
      location: string;
      role: string;
      achievement?: string;
    };
  };
}

interface BadgeShowcaseProps {
  collectionAddress: Address;
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ collectionAddress }) => {
  const { connected, wallet } = useTonConnect();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      if (!connected || !wallet) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Initialize contracts and services
        const collection = BadgeCollectionContract.createFromAddress(collectionAddress);
        const storage = new BadgeStorage();

        // Get total badges in collection
        const collectionData = await collection.getCollectionData();
        const totalBadges = collectionData.nextItemIndex;

        // Fetch all badges and check ownership
        const userBadges: Badge[] = [];
        for (let i = 0; i < totalBadges; i++) {
          const isOwner = await collection.verifyOwnership(wallet.account.address, i);
          if (isOwner) {
            // Get badge metadata
            const metadata = await collection.getBadgeMetadata(i);
            const parsedMetadata = await storage.getMetadata(metadata);
            
            userBadges.push({
              id: i,
              metadata: parsedMetadata,
            });
          }
        }

        setBadges(userBadges);
      } catch (err) {
        console.error('Error fetching badges:', err);
        setError('Failed to load badges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [connected, wallet, collectionAddress]);

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Connect your TON wallet to view your badges</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No badges found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="aspect-w-1 aspect-h-1">
            <img
              src={badge.metadata.image}
              alt={badge.metadata.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{badge.metadata.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{badge.metadata.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date:</span>
                <span>{badge.metadata.attributes.event_date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Location:</span>
                <span>{badge.metadata.attributes.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Role:</span>
                <span className="capitalize">{badge.metadata.attributes.role}</span>
              </div>
              {badge.metadata.attributes.achievement && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Achievement:</span>
                  <span>{badge.metadata.attributes.achievement}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
