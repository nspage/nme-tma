import React, { useState } from 'react';
import { Address } from 'ton-core';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { BadgeCollectionContract } from '../contracts/badge-collection';
import { BadgeStorage } from '../services/BadgeStorage';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

interface CheckInFlowProps {
  eventId: string;
  collectionAddress: Address;
  eventName: string;
  eventDate: string;
  location: string;
}

interface AttendeeStatus {
  address: string;
  status: 'pending' | 'verified' | 'minting' | 'minted' | 'failed';
  timestamp?: number;
  error?: string;
}

export const CheckInFlow: React.FC<CheckInFlowProps> = ({
  eventId,
  collectionAddress,
  eventName,
  eventDate,
  location,
}) => {
  const [tonConnectUI] = useTonConnectUI();
  const connected = tonConnectUI.connected;
  const wallet = tonConnectUI.account;
  
  const [attendees, setAttendees] = useState<Map<string, AttendeeStatus>>(new Map());
  const [scanMode, setScanMode] = useState<boolean>(false);
  const [manualAddress, setManualAddress] = useState<string>('');

  // Generate a unique check-in code for the event
  const checkInCode = `ton-event-${eventId}-${Date.now()}`;

  const handleManualCheckIn = async () => {
    if (!manualAddress) {
      toast.error('Please enter a wallet address');
      return;
    }

    try {
      // Validate address format
      const address = Address.parse(manualAddress);
      await processCheckIn(address.toString());
    } catch (err) {
      toast.error('Invalid wallet address format');
    }
  };

  const processCheckIn = async (attendeeAddress: string) => {
    if (!connected || !wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Update status to pending
    setAttendees(prev => new Map(prev).set(attendeeAddress, {
      address: attendeeAddress,
      status: 'pending',
      timestamp: Date.now(),
    }));

    try {
      // Verify physical presence (in this case, just checking if the address is valid)
      const address = Address.parse(attendeeAddress);
      
      // Update status to verified
      setAttendees(prev => new Map(prev).set(attendeeAddress, {
        address: attendeeAddress,
        status: 'verified',
        timestamp: Date.now(),
      }));

      // Prepare for minting
      setAttendees(prev => new Map(prev).set(attendeeAddress, {
        address: attendeeAddress,
        status: 'minting',
        timestamp: Date.now(),
      }));

      // Initialize contracts
      const collection = BadgeCollectionContract.createFromAddress(collectionAddress);
      const storage = new BadgeStorage();

      // Prepare metadata
      const metadata = {
        name: `${eventName} - Attendee`,
        description: `Badge for attending ${eventName}`,
        image: '', // TODO: Generate or use template image
        attributes: {
          event_date: eventDate,
          location,
          role: 'Attendee',
          check_in_time: new Date().toISOString(),
        },
      };

      // Upload metadata to TON Storage
      const metadataCell = await storage.uploadMetadata(metadata);

      // Mint badge
      await collection.mint(wallet.address, {
        to: address,
        content: metadataCell,
      });

      // Update status to minted
      setAttendees(prev => new Map(prev).set(attendeeAddress, {
        address: attendeeAddress,
        status: 'minted',
        timestamp: Date.now(),
      }));

      toast.success(`Badge minted for ${attendeeAddress}`);
      setManualAddress(''); // Clear input after successful mint
    } catch (err) {
      console.error('Check-in failed:', err);
      setAttendees(prev => new Map(prev).set(attendeeAddress, {
        address: attendeeAddress,
        status: 'failed',
        timestamp: Date.now(),
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
      toast.error(`Failed to process check-in for ${attendeeAddress}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Event Check-In</h3>
        
        <div className="space-y-4">
          {/* QR Code Section */}
          <div className="text-center">
            <QRCodeSVG
              value={checkInCode}
              size={200}
              level="H"
              className="mx-auto"
            />
            <p className="text-sm text-gray-600 mt-2">
              Scan to check in to {eventName}
            </p>
          </div>

          {/* Manual Check-in Section */}
          <div className="flex space-x-2">
            <Input
              placeholder="Enter wallet address"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
            <Button onClick={handleManualCheckIn}>
              Check In
            </Button>
          </div>

          {/* Attendee List */}
          {attendees.size > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Recent Check-ins</h4>
              <div className="space-y-2">
                {Array.from(attendees.entries()).map(([address, status]) => (
                  <div
                    key={address}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm truncate flex-1">{address}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      status.status === 'minted'
                        ? 'bg-green-100 text-green-800'
                        : status.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {status.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
