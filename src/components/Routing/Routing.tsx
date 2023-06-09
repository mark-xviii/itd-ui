import { createBrowserRouter } from 'react-router-dom';
import { AdminPanel } from '../../screens/admin-panel/AdminPanel';
import { AuthScreen } from '../../screens/auth/AuthScreen';
import { GameScreen } from '../../screens/game/Game';
import { Main } from '../../screens/main/Main';
import { Profile } from '../../screens/profile/Profile';
import { AnimatedBackground } from '../AnimatedBackground/AnimatedBackground';
import { LoginAndRegister } from '../LoginAndRegister/LoginAndRegister';
import { MovingTilesAnimation } from '../MovingTilesAnimation/MovingTilesAnimation';
import { ResourcePanel } from '../ResourceIndicator/ResourcePanel';
import { SVGRainbow } from '../SVGRainbow/SVGRainbow';
import { UniversalAdminPanelNavigator } from '../UniversalAdminPanelNavigator/UniversalAdminPanelNavigator';
import { FlowAnimation } from '../FlowAnimation/FlowAnimation';

const UNIVERSAL_URL = ':action/:entity/:id?';

export const Routing = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
  {
    path: '/test-mta',
    element: <MovingTilesAnimation />,
  },
  {
    path: '/test-indicators',
    element: <ResourcePanel coffee={32} money={64} personnel={8} customers={80} />,
  },
  {
    path: '/test-fa',
    element: <FlowAnimation />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/test-abg',
    element: <AnimatedBackground />,
  },
  {
    path: '/test-svgrainbow',
    element: <SVGRainbow />,
  },
  {
    path: '/game',
    element: <GameScreen />,
  },
  {
    path: '/login',
    element: (
      <AuthScreen>
        <LoginAndRegister mode="login" />
      </AuthScreen>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthScreen>
        <LoginAndRegister mode="register" />
      </AuthScreen>
    ),
  },
  {
    path: 'admin',
    element: <AdminPanel />,
    children: [
      {
        path: UNIVERSAL_URL,
        element: <UniversalAdminPanelNavigator />,
      },
      {
        path: '*',
        element: <h1>notfaund</h1>,
      },
    ],
  },
]);
