import { createBrowserRouter, Outlet, useLocation, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import EventPage from './components/EventPage';
import CreateEventEdit from './components/CreateEventEdit';
import CreateEventTicket from './components/CreateEventTicket';
import CreateEventReview from './components/CreateEventReview';
import ProfilePage from './components/ProfilePage';
import BuyTickets from './components/BuyTickets';
import Navbar from './components/Navbar';
import OTPVerification from './components/OTPVerification';
import AccountInfo from './components/AccountInfo';
import EditProfile from './components/EditProfile';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import SecurityPage from './components/SecurityPage';
import AccountSettings from './components/AccountSettings';
import ForgotPassword from './components/ForgotPassword';
import EventHistory from './components/EventHistory';
import TicketHistory from './components/TicketHistory';
import OnlineEventsPage from './components/OnlineEventsPage';
import AllEventsPage from './components/AllEventsPage';
import HackathonsPage from './components/HackathonsPage';
import SeminarsPage from './components/SeminarsPage';
import WorkshopsPage from './components/WorkshopsPage';
import ConferencesPage from './components/ConferencesPage';
import NetworkingPage from './components/NetworkingPage';
import CompetitionsPage from './components/CompetitionsPage';
import ScrollToTop from './components/ScrollToTop';
import MockPaymentPage from './components/MockPaymentPage';
import YourEvents from './components/YourEvents';
import EventAnalysis from './components/EventAnalysis';

const Layout = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup", "/", "/forgot-password"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <ScrollToTop />
      <div className={shouldShowNavbar ? "pt-20" : ""}>
        <Outlet />
      </div>
    </>
  );
};

const router = createBrowserRouter([{
  element: <Layout />,
  errorElement: <ErrorBoundary />,
  children: [
    {
      path: '/',
      element: <Landing />
    },
    {
      path: '/home',
      element: <ProtectedRoute><Home /></ProtectedRoute>
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <SignUp />
    },
    {
      path: '/event/:id',
      element: <ProtectedRoute><EventPage /></ProtectedRoute>
    },
    {
      path: '/tickets/:eventId',
      element: <ProtectedRoute><BuyTickets /></ProtectedRoute>
    },
    {
      path: '/create-event',
      element: <ProtectedRoute><Outlet /></ProtectedRoute>,
      children: [
        {
          path: 'edit',
          element: <CreateEventEdit />
        },
        {
          path: 'ticket',
          element: <CreateEventTicket />
        },
        {
          path: 'review',
          element: <CreateEventReview />
        }
      ]
    },
    {
      path: '/profile',
      element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      errorElement: <ErrorBoundary />
    },
    {
      path: '/events',
      element: <ProtectedRoute><Outlet /></ProtectedRoute>,
      children: [
        {
          path: '',
          element: <ProtectedRoute><AllEventsPage /></ProtectedRoute>
        },
        {
          path: 'hackathons',
          element: <ProtectedRoute><HackathonsPage /></ProtectedRoute>
        },
        {
          path: 'seminars',
          element: <ProtectedRoute><SeminarsPage /></ProtectedRoute>
        },
        {
          path: 'workshops',
          element: <ProtectedRoute><WorkshopsPage /></ProtectedRoute>
        },
        {
          path: 'conferences',
          element: <ProtectedRoute><ConferencesPage /></ProtectedRoute>
        },
        {
          path: 'networking',
          element: <ProtectedRoute><NetworkingPage /></ProtectedRoute>
        },
        {
          path: 'competitions',
          element: <ProtectedRoute><CompetitionsPage /></ProtectedRoute>
        },
        {
          path: 'online',
          element: <ProtectedRoute><OnlineEventsPage /></ProtectedRoute>
        },
        {
          path: ':id',
          element: <EventPage />
        }
      ]
    },
    {
      path: '/account',
      element: <ProtectedRoute><Outlet /></ProtectedRoute>,
      children: [
        {
          path: '',
          element: <Navigate to="info" replace />
        },
        {
          path: 'info',
          element: <AccountInfo />
        },
        {
          path: 'settings',
          element: <AccountSettings />
        },
        {
          path: 'security',
          element: <SecurityPage />
        }
      ]
    },
    {
      path: '/profile/edit',
      element: <ProtectedRoute><EditProfile /></ProtectedRoute>
    },
    {
      path: '/verify',
      element: <ProtectedRoute><OTPVerification /></ProtectedRoute>
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/event-history',
      element: <ProtectedRoute><EventHistory /></ProtectedRoute>
    },
    {
      path: '/ticket-history',
      element: <ProtectedRoute><TicketHistory /></ProtectedRoute>
    },
    {
      path: '/mock-payment',
      element: <MockPaymentPage />
    },
    {
      path: '/your-events',
      element: <ProtectedRoute><YourEvents /></ProtectedRoute>
    },
    {
      path: '/your-events/:eventId',
      element: <ProtectedRoute><EventAnalysis /></ProtectedRoute>
    }
  ]
}]);

export default router;