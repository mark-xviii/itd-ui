import { Add, Logout, QuestionMark } from '@mui/icons-material';
import { Menu } from '@mui/icons-material';
import { observer } from 'mobx-react';
import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
import Modal from '../../components/Modal/Modal';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { AuthContext } from '../../stores/auth.store';
import { Utils } from '../../utils';
import './AdminPanel.sass';
import { FlowAnimation } from '../../components/FlowAnimation/FlowAnimation';

export const AdminPanel = observer(() => {
  const isMobile = false;

  const navigate = useNavigate();

  let { action, entity, id } = useParams() as { action: string; entity: string; id: string };

  const [showModal, setShowModal] = useState<boolean>(false);
  const [sidebarToggle, setSideBarToggle] = useState<boolean>(false);

  const AuthSingleton = useContext(AuthContext);

  useEffect(() => {
    if (AuthSingleton.role) {
      if (AuthSingleton.role !== 'Admin') {
        navigate('/');
      }
    }
  }, [AuthSingleton.role]);

  return (
    <div className="ap-container">
      <FlowAnimation />
      <Sidebar isToggle={sidebarToggle} setToggle={setSideBarToggle} hiddenButton={true} />
      <div className="ap-topbar">
        <div className="ap-topbar-actions">
          <div className="ap-topbar-actions-group">
            <div className="ap-topbar-action">
              <Menu
                className="ap-action-icon"
                onClick={() => {
                  setSideBarToggle(true);
                }}
              />
            </div>
            <div className="ap-topbar-action">
              {action !== Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.POST &&
                entity &&
                entity !== Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS && (
                  <Add
                    className="ap-action-icon"
                    onClick={() => {
                      console.log(action, entity, id);
                      navigate(`${Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.POST}/${entity}/`);
                    }}
                  />
                )}
            </div>
          </div>
          <div className="ap-topbar-action">
            <div className="ap-topbar-entities">
              <div
                className="ap-topbar-entity"
                onClick={() => {
                  navigate(
                    `${Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.LIST}/${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS}/`,
                  );
                }}
                style={{ color: entity === 'cards' ? '#ffaaff' : '#080808' }}
              >
                Карточки
              </div>
              <div
                className="ap-topbar-entity"
                onClick={() => {
                  navigate(
                    `${Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.LIST}/${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES}/`,
                  );
                }}
                style={{ color: entity === 'sequences' ? '#ffaaff' : '#080808' }}
              >
                Последовательности
              </div>
              <div
                className="ap-topbar-entity"
                onClick={() => {
                  navigate(
                    `${Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.LIST}/${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS}/`,
                  );
                }}
                style={{ color: entity === 'characters' ? '#ffaaff' : '#080808' }}
              >
                Персонажи
              </div>
              <div
                className="ap-topbar-entity"
                onClick={() => {
                  navigate(
                    `${Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.LIST}/${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS}/`,
                  );
                }}
                style={{ color: entity === 'users' ? '#ffaaff' : '#080808' }}
              >
                Пользователи
              </div>
            </div>
          </div>
          <div className="ap-topbar-actions-group">
            <div className="ap-topbar-action">
              <QuestionMark
                className="ap-action-icon"
                onClick={() => {
                  setShowModal(true);
                }}
              ></QuestionMark>
            </div>
            <div className="ap-topbar-action">
              <Logout
                className="ap-action-icon"
                onClick={() => {
                  navigate('/');
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="ap-area">
        <Outlet></Outlet>
      </div>
      <Modal isShown={showModal} setIsShown={setShowModal}>
        <h1>Система помощи</h1>
        <p>
          Добро пожаловать в систему помощи! Данный текст предназначен для тех, кто нажал на кнопку <QuestionMark />
        </p>
        <p>В самом верху страницы вы можете видет полоску с различными элементами - они интерактивны.</p>
        <p>
          Кнопка <Add /> предназначена для создания новых записей в разделе которого вы находитесь в данный момент.
        </p>
        <p>Центральные элементы представляют собой возможность переключения на вкладки одноимённых сущностей</p>
        <p>На каждой вкладке есть список элементов данной сущности. Каждый элемент можно редактировать и удалять.</p>
      </Modal>
    </div>
  );
});
