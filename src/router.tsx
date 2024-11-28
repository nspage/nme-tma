import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { HomePage } from './pages';
import { ConnectPage } from './pages/connect';
import { EventsPage } from './pages/events';
import { EventPage } from './pages/events/[id]';
import { CreateEventPage } from './pages/events/create';
import ManageEventPage from './pages/events/[id]/manage';
import { ProfilePage } from './pages/profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'connect',
        element: <ConnectPage />,
      },
      {
        path: 'events',
        children: [
          {
            index: true,
            element: <EventsPage />,
          },
          {
            path: 'create',
            element: <CreateEventPage />,
          },
          {
            path: ':id',
            element: <EventPage />,
          },
          {
            path: ':id/manage',
            element: <ManageEventPage />,
          },
        ],
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
]);
