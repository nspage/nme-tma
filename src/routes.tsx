import { createHashRouter } from 'react-router-dom'
import { App } from './App'
import { ErrorPage } from './pages/error'
import { HomePage } from './pages/home'
import { ProposalsPage } from './pages/proposals'
import { ProposalPage } from './pages/proposals/[id]'
import { EventsPage } from './pages/events'
import { EventPage } from './pages/events/[id]'
import { CreateEventPage } from './pages/events/create'
import { GroupsPage } from './pages/groups'
import { GroupPage } from './pages/groups/[id]'
import { ProfilePage } from './pages/profile'
import TestProposalPage from './pages/test-proposal'
import BadgesPage from './pages/badges'

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/proposals',
        element: <ProposalsPage />,
      },
      {
        path: '/proposals/:id',
        element: <ProposalPage />,
      },
      {
        path: '/events',
        element: <EventsPage />,
      },
      {
        path: '/events/create',
        element: <CreateEventPage />,
      },
      {
        path: '/events/:id',
        element: <EventPage />,
      },
      {
        path: '/groups',
        element: <GroupsPage />,
      },
      {
        path: '/groups/:id',
        element: <GroupPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/test-proposal',
        element: <TestProposalPage />,
      },
      {
        path: '/badges',
        element: <BadgesPage />,
      },
    ],
  },
]);
