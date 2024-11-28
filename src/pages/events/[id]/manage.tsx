import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Address } from 'ton-core';
import { BatchMintForm } from '../../../components/BatchMintForm';
import { CheckInFlow } from '../../../components/CheckInFlow';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { toast } from 'sonner';
import { showError } from '../../../utils/errorHandling';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  collectionAddress?: string;
}

export default function ManageEventPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual event fetching
    const fetchEvent = async () => {
      try {
        // Simulated API call
        const mockEvent = {
          id,
          name: 'TON Developer Meetup #1',
          date: '2024-03-15',
          location: 'San Francisco, CA',
          collectionAddress: process.env.BADGE_COLLECTION_ADDRESS,
        };
        setEvent(mockEvent);
      } catch (err) {
        console.error('Error fetching event:', err);
        toast.error('Failed to load event details');
        showError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
        <div className="flex items-center text-gray-600 space-x-4">
          <span>{event.date}</span>
          <span>•</span>
          <span>{event.location}</span>
        </div>
      </div>

      <Tabs defaultValue="badges" className="space-y-6">
        <TabsList>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="check-in">Check-in</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-6">
          {event.collectionAddress ? (
            <BatchMintForm
              collectionAddress={Address.parse(event.collectionAddress)}
              eventName={event.name}
              eventDate={event.date}
              location={event.location}
            />
          ) : (
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Badge Collection Not Set Up
              </h3>
              <p className="text-yellow-700 mb-4">
                You need to set up a badge collection for this event before you can mint badges.
              </p>
              <Button>Set Up Badge Collection</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="check-in" className="space-y-6">
          {event.collectionAddress ? (
            <CheckInFlow
              eventId={event.id}
              collectionAddress={Address.parse(event.collectionAddress)}
              eventName={event.name}
              eventDate={event.date}
              location={event.location}
            />
          ) : (
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Check-in Not Available
              </h3>
              <p className="text-yellow-700 mb-4">
                You need to set up a badge collection for this event before you can use the check-in system.
              </p>
              <Button>Set Up Badge Collection</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="attendees">
          {/* TODO: Implement attendee management */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Attendee Management</h3>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          {/* TODO: Implement event settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Event Settings</h3>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
