import React, { useState, useCallback } from 'react';
import { useTonConnect } from '@tonconnect/ui-react';
import { Address } from 'ton-core';
import { TonClient4 } from '@ton/ton';
import { BadgeStorage, BadgeMetadata } from '@/services/BadgeStorage';
import { useNavigate } from 'react-router-dom';

export function MintBadgePage() {
  const { connected, wallet } = useTonConnect();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    event: '',
    date: '',
    type: '',
  });
  const [artwork, setArtwork] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArtwork(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setArtworkPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cleanup preview URL on component unmount
  React.useEffect(() => {
    return () => {
      if (artworkPreview) {
        URL.revokeObjectURL(artworkPreview);
      }
    };
  }, [artworkPreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !wallet) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);

      // Initialize TON client and storage
      const client = new TonClient4({
        endpoint: process.env.TON_ENDPOINT || 'https://mainnet-v4.ton.org',
      });

      const storage = await BadgeStorage.create(
        client,
        Address.parse(process.env.TON_STORAGE_CONTRACT || '')
      );

      // Upload artwork first
      const artworkBuffer = artwork ? await artwork.arrayBuffer() : null;
      if (!artworkBuffer) {
        throw new Error('No artwork selected');
      }

      const artworkBag = await storage.uploadArtwork(Buffer.from(artworkBuffer));

      // Prepare and upload metadata
      const metadata: BadgeMetadata = {
        name: formData.name,
        description: formData.description,
        image: artworkBag.toString(),
        attributes: {
          event: formData.event,
          date: formData.date,
          type: formData.type,
        },
      };

      const metadataBag = await storage.uploadMetadata(metadata);

      // TODO: Call contract to mint badge with metadataBag
      // This will be implemented once the contract is deployed

      navigate('/badges');
    } catch (error) {
      console.error('Error minting badge:', error);
      alert('Failed to mint badge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Preview component
  const ArtworkPreview = () => {
    if (!artworkPreview) return null;

    return (
      <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
        <img
          src={artworkPreview}
          alt="Badge artwork preview"
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={() => {
            setArtwork(null);
            setArtworkPreview(null);
          }}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mint New Badge</h1>
      
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Badge Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Event Name</label>
          <input
            type="text"
            name="event"
            value={formData.event}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Event Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Badge Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Badge Artwork</label>
          {artworkPreview ? (
            <ArtworkPreview />
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleArtworkChange}
                className="w-full"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Drag and drop an image or click to select
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !connected}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            loading || !connected
              ? 'bg-gray-400'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Minting...
            </span>
          ) : (
            'Mint Badge'
          )}
        </button>
      </form>
    </div>
  );
}
