import React, { useState } from 'react';
import { Address } from 'ton-core';
import { BadgeCollectionContract } from '../contracts/badge-collection';
import { BadgeStorage } from '../services/BadgeStorage';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { useWallet } from '../hooks/use-wallet';

interface Attendee {
  address: string;
  role: 'Attendee' | 'Speaker' | 'Organizer';
  achievement?: string;
}

interface BatchMintFormProps {
  collectionAddress: Address;
  eventName: string;
  eventDate: string;
  location: string;
}

export const BatchMintForm: React.FC<BatchMintFormProps> = ({
  collectionAddress,
  eventName,
  eventDate,
  location,
}) => {
  const { isConnected, isConnecting, address, connect } = useWallet();
  const [loading, setLoading] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [csvContent, setCsvContent] = useState('');

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvContent(text);
      
      // Parse CSV content
      const lines = text.split('\n');
      const parsed: Attendee[] = lines
        .slice(1) // Skip header row
        .filter(line => line.trim()) // Remove empty lines
        .map(line => {
          const [address, role, achievement] = line.split(',').map(s => s.trim());
          return {
            address,
            role: role as 'Attendee' | 'Speaker' | 'Organizer',
            achievement,
          };
        });
      setAttendees(parsed);
    };
    reader.readAsText(file);
  };

  const handleMint = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    try {
      setLoading(true);
      const collection = new BadgeCollectionContract(collectionAddress);
      const storage = new BadgeStorage();

      for (const attendee of attendees) {
        const metadata = {
          name: `${eventName} - ${attendee.role} Badge`,
          description: attendee.achievement || `${attendee.role} at ${eventName}`,
          event: {
            name: eventName,
            date: eventDate,
            location: location,
          },
          attributes: [
            { trait_type: 'Role', value: attendee.role },
            { trait_type: 'Event', value: eventName },
            { trait_type: 'Date', value: eventDate },
            { trait_type: 'Location', value: location },
          ],
        };

        // Upload metadata to storage
        const metadataUrl = await storage.uploadMetadata(metadata);
        const metadataCell = storage.createMetadataCell(metadataUrl);

        // Mint badge
        await collection.mint(address, {
          to: Address.parse(attendee.address),
          content: metadataCell,
        });

        toast.success(`Badge minted for ${attendee.address}`);
      }
    } catch (error) {
      console.error('Error minting badges:', error);
      toast.error('Failed to mint badges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h3 className="text-lg font-semibold">Batch Mint Badges</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV File
          </label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            CSV format: address,role,achievement (optional)
          </p>
        </div>

        {csvContent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <Textarea
              value={csvContent}
              readOnly
              className="h-32 font-mono text-sm"
            />
          </div>
        )}

        <Button
          onClick={handleMint}
          disabled={loading || isConnecting || !attendees.length}
          className="w-full"
        >
          {isConnecting ? 'Connecting Wallet...' : 
           loading ? 'Minting...' : 
           !isConnected ? 'Connect Wallet' :
           `Mint ${attendees.length} Badges`}
        </Button>
      </div>
    </div>
  );
};
