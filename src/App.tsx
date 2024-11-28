import { Outlet } from 'react-router-dom'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { Layout } from '@/components/layout'
import { manifestUrl } from '@/lib/ton-connect'
import { Toaster } from 'sonner'
import { StorageProvider } from '@/contexts/StorageContext'

// Pages
import { HomePage } from '@/pages'
import { ConnectPage } from '@/pages/connect'
import { ProposalsPage } from '@/pages/proposals'
import { ProposalPage } from '@/pages/proposals/[id]'
import { EventsPage } from '@/pages/events'
import { EventPage } from '@/pages/events/[id]'
import { CreateEventPage } from '@/pages/events/create'
import { GroupsPage } from '@/pages/groups'
import { GroupPage } from '@/pages/groups/[id]'
import { ProfilePage } from '@/pages/profile'

export function App() {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <StorageProvider>
        <Layout>
          <Outlet />
        </Layout>
        <Toaster richColors position="top-right" />
      </StorageProvider>
    </TonConnectUIProvider>
  )
}