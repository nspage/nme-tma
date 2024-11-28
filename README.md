# TON Event Badge Platform

A decentralized platform for creating and managing non-transferable digital badges for Web3 community events.

## Features

- 🎫 Soulbound Token (SBT) based event badges
- 🔒 Non-transferable proof of participation
- 📱 QR code-based check-in system
- 📦 Batch minting capabilities
- 🖼️ TON Storage integration for metadata and artwork
- 🔐 Secure wallet authentication
- 📊 Event management dashboard

## Tech Stack

- Frontend: Vite + React with TypeScript
- Blockchain: The Open Network (TON)
- Authentication: TON Connect
- Styling: Tailwind CSS
- State Management: React Hooks
- Testing: Jest

## Prerequisites

- Node.js 16+
- TON Wallet (e.g., Tonkeeper)
- TON Center API Key

## Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required environment variables:
   - `TON_ENDPOINT`: TON blockchain endpoint
   - `TON_NETWORK`: 'mainnet' or 'testnet'
   - `BADGE_COLLECTION_ADDRESS`: Deployed badge collection contract address
   - `TON_STORAGE_CONTRACT`: TON Storage provider contract address
   - `TON_CENTER_API_KEY`: Your TON Center API key

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for deployment on Vercel:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Environment Variables on Vercel

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" section
3. Add all required variables from `.env.example`
4. Redeploy your application

## Security Considerations

- Owner-only minting permissions
- Rate limiting on badge minting
- Secure storage of sensitive information
- Non-transferable badge mechanism
- Security headers configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
