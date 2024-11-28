import { ethers } from 'ethers'
import WebApp from '@twa-dev/sdk'

export type WalletInfo = {
  address: string
  chainId: number
  balance: string
}

class WalletService {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null

  async connect(): Promise<WalletInfo> {
    try {
      // Check if MetaMask or similar provider is available
      if (!window.ethereum) {
        throw new Error('No Web3 provider found. Please install MetaMask.')
      }

      // Initialize provider and request account access
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()
      
      // Get wallet info
      const address = await this.signer.getAddress()
      const network = await this.provider.getNetwork()
      const balance = await this.provider.getBalance(address)

      return {
        address,
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance)
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null
    this.signer = null
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected')
    }
    return await this.signer.signMessage(message)
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.provider
  }

  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer
  }
}

export const walletService = new WalletService()
