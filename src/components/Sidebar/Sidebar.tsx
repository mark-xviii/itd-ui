import {
  AccountCircleRounded,
  DomainRounded,
  HowToVote,
  LoginRounded,
  LogoutRounded,
  Menu,
  QuestionMarkRounded,
  Settings,
  TableChartRounded,
} from '@mui/icons-material';
import { observer } from 'mobx-react';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../stores/auth.store';
import { SidebarInterface } from './Sidebar.interface';
import './Sidebar.sass';

export const Sidebar = observer(({ isToggle, setToggle, hiddenButton }: SidebarInterface) => {
  const AuthSingleton = useContext(AuthContext);

  const sidebarClass = isToggle ? 'sidebar-shown' : 'sidebar-hidden';
  const buttonClass = isToggle ? 'button-moved' : 'button-returned';

  const navigate = useNavigate();

  const location = useLocation();

  return (
    <div
      className={`sidebar-attention ${isToggle ? 'sidebar-attention-active' : ''}`}
      onClick={() => {
        if (isToggle) {
          setToggle(false);
        }
      }}
    >
      <div className="sidebar-inner">
        <div className={`sidebar ${sidebarClass}`}>
          {AuthSingleton.accessToken ? (
            AuthSingleton.role === 'Admin' && (
              <div
                className={`sidebar-entry ${location.pathname === '/admin' ? 'sidebar-entry-emph' : ''}`}
                onClick={() => {
                  navigate('/admin');
                }}
              >
                <TableChartRounded className="sidebar-icon" />
                Панель администратора
              </div>
            )
          ) : (
            <div
              className={`sidebar-entry ${location.pathname === '/login' ? 'sidebar-entry-emph' : ''} `}
              onClick={() => {
                if (location.pathname !== '/login') {
                  navigate('/login');
                }
              }}
            >
              <LoginRounded className="sidebar-icon" />
              Войти в систему
            </div>
          )}
          {AuthSingleton.accessToken && (
            <div
              className={`sidebar-entry ${location.pathname === '/profile' ? 'sidebar-entry-emph' : ''}`}
              onClick={() => {
                navigate('/profile');
              }}
            >
              <AccountCircleRounded className="sidebar-icon" />
              Профиль
            </div>
          )}
          {AuthSingleton.accessToken && (
            <div
              className="sidebar-entry"
              onClick={() => {
                AuthSingleton.signOut();
                if (location.pathname !== '/') {
                  navigate('/');
                }
              }}
            >
              <LogoutRounded className="sidebar-icon" />
              Выйти из системы
            </div>
          )}
          {/* <hr className="sidebar-divider" /> */}
          {AuthSingleton.accessToken && (
            <div
              className={`sidebar-entry ${location.pathname === '/game' ? 'sidebar-entry-emph' : ''}`}
              onClick={() => {
                if (location.pathname !== '/game') {
                  navigate('/game');
                }
              }}
            >
              <HowToVote className="sidebar-icon" />
              Игра
            </div>
          )}
          <div
            className={`sidebar-entry ${location.pathname === '/' ? 'sidebar-entry-emph' : ''}`}
            onClick={() => {
              if (location.pathname !== '/') {
                navigate('/');
              }
            }}
          >
            <DomainRounded className="sidebar-icon" />
            Главная страница
          </div>
        </div>
        {!isToggle && hiddenButton ? null : (
          <div
            className={`sidebar-button ${buttonClass}`}
            onClick={() => {
              setToggle(!isToggle);
            }}
          >
            <Menu />
          </div>
        )}
      </div>
    </div>
  );
});
